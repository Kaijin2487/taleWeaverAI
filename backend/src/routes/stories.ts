import express from 'express';
import { prisma } from '../server.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { validate, storySchemas } from '../middleware/validation.js';
import { geminiService } from '../services/geminiService.js';

const router = express.Router();

/**
 * @route   POST /api/stories/generate
 * @desc    Generate a new storybook using AI
 * @access  Private
 */
router.post('/generate', authenticate, validate(storySchemas.generate), async (req: AuthRequest, res, next) => {
  try {
    const { prompt, interests, age } = req.body;
    const userId = req.user!.id;

    // Generate storybook using Gemini AI
    const storybookData = await geminiService.generateStorybook({
      prompt,
      interests,
      age
    });

    // Save storybook to database
    const storybook = await prisma.storyBook.create({
      data: {
        title: storybookData.title,
        pages: storybookData.pages,
        ownerId: userId,
        isPublic: false
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      storybook: {
        id: storybook.id,
        title: storybook.title,
        pages: storybook.pages,
        isPublic: storybook.isPublic,
        createdAt: storybook.createdAt,
        updatedAt: storybook.updatedAt,
        owner: storybook.owner
      }
    });
  } catch (error) {
    console.error('Error generating story:', error);
    next(error);
  }
});

/**
 * @route   GET /api/stories/mine
 * @desc    Get all stories created by the current user
 * @access  Private
 */
router.get('/mine', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;

    const stories = await prisma.storyBook.findMany({
      where: {
        ownerId: userId
      },
      select: {
        id: true,
        title: true,
        pages: true,
        isPublic: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            comments: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      success: true,
      stories
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/stories/:storyId
 * @desc    Get a specific story by ID (user must be the owner)
 * @access  Private
 */
router.get('/:storyId', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { storyId } = req.params;
    const userId = req.user!.id;

    const story = await prisma.storyBook.findFirst({
      where: {
        id: storyId,
        ownerId: userId
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        comments: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!story) {
      return res.status(404).json({
        success: false,
        error: 'Story not found or you do not have permission to view it'
      });
    }

    res.json({
      success: true,
      story
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/stories/:storyId/share
 * @desc    Share a story to the public gallery
 * @access  Private
 */
router.put('/:storyId/share', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { storyId } = req.params;
    const userId = req.user!.id;

    // Find the story and verify ownership
    const story = await prisma.storyBook.findFirst({
      where: {
        id: storyId,
        ownerId: userId
      }
    });

    if (!story) {
      return res.status(404).json({
        success: false,
        error: 'Story not found or you do not have permission to modify it'
      });
    }

    // Update story to make it public
    const updatedStory = await prisma.storyBook.update({
      where: {
        id: storyId
      },
      data: {
        isPublic: true
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.json({
      success: true,
      story: updatedStory
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/stories/:storyId/unshare
 * @desc    Remove a story from the public gallery
 * @access  Private
 */
router.put('/:storyId/unshare', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { storyId } = req.params;
    const userId = req.user!.id;

    // Find the story and verify ownership
    const story = await prisma.storyBook.findFirst({
      where: {
        id: storyId,
        ownerId: userId
      }
    });

    if (!story) {
      return res.status(404).json({
        success: false,
        error: 'Story not found or you do not have permission to modify it'
      });
    }

    // Update story to make it private
    const updatedStory = await prisma.storyBook.update({
      where: {
        id: storyId
      },
      data: {
        isPublic: false
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.json({
      success: true,
      story: updatedStory
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   DELETE /api/stories/:storyId
 * @desc    Delete a story
 * @access  Private
 */
router.delete('/:storyId', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { storyId } = req.params;
    const userId = req.user!.id;

    // Find the story and verify ownership
    const story = await prisma.storyBook.findFirst({
      where: {
        id: storyId,
        ownerId: userId
      }
    });

    if (!story) {
      return res.status(404).json({
        success: false,
        error: 'Story not found or you do not have permission to delete it'
      });
    }

    // Delete the story (comments will be deleted automatically due to cascade)
    await prisma.storyBook.delete({
      where: {
        id: storyId
      }
    });

    res.json({
      success: true,
      message: 'Story deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
