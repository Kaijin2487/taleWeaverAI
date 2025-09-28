import express from 'express';
import { prisma } from '../server.js';
import { validate, commentSchemas } from '../middleware/validation.js';

const router = express.Router();

/**
 * @route   GET /api/public/stories
 * @desc    Get all public stories with pagination
 * @access  Public
 */
router.get('/stories', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const skip = (page - 1) * limit;

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 50) {
      return res.status(400).json({
        success: false,
        error: 'Invalid pagination parameters'
      });
    }

    // Get total count of public stories
    const totalStories = await prisma.storyBook.count({
      where: {
        isPublic: true
      }
    });

    // Get public stories with pagination
    const stories = await prisma.storyBook.findMany({
      where: {
        isPublic: true
      },
      select: {
        id: true,
        title: true,
        pages: true,
        createdAt: true,
        updatedAt: true,
        owner: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            comments: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    });

    const totalPages = Math.ceil(totalStories / limit);

    res.json({
      success: true,
      stories,
      pagination: {
        currentPage: page,
        totalPages,
        totalStories,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/public/stories/:storyId
 * @desc    Get a specific public story by ID with comments
 * @access  Public
 */
router.get('/stories/:storyId', async (req, res, next) => {
  try {
    const { storyId } = req.params;

    const story = await prisma.storyBook.findFirst({
      where: {
        id: storyId,
        isPublic: true
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true
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
        error: 'Public story not found'
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
 * @route   POST /api/public/stories/:storyId/comments
 * @desc    Add a comment to a public story
 * @access  Public
 */
router.post('/stories/:storyId/comments', validate(commentSchemas.create), async (req, res, next) => {
  try {
    const { storyId } = req.params;
    const { name, text } = req.body;

    // Verify that the story exists and is public
    const story = await prisma.storyBook.findFirst({
      where: {
        id: storyId,
        isPublic: true
      }
    });

    if (!story) {
      return res.status(404).json({
        success: false,
        error: 'Public story not found'
      });
    }

    // Create the comment
    const comment = await prisma.comment.create({
      data: {
        text,
        authorName: name,
        storyId
      }
    });

    res.status(201).json({
      success: true,
      comment
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/public/stories/:storyId/comments
 * @desc    Get all comments for a public story
 * @access  Public
 */
router.get('/stories/:storyId/comments', async (req, res, next) => {
  try {
    const { storyId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 50) {
      return res.status(400).json({
        success: false,
        error: 'Invalid pagination parameters'
      });
    }

    // Verify that the story exists and is public
    const story = await prisma.storyBook.findFirst({
      where: {
        id: storyId,
        isPublic: true
      }
    });

    if (!story) {
      return res.status(404).json({
        success: false,
        error: 'Public story not found'
      });
    }

    // Get total count of comments
    const totalComments = await prisma.comment.count({
      where: {
        storyId
      }
    });

    // Get comments with pagination
    const comments = await prisma.comment.findMany({
      where: {
        storyId
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    });

    const totalPages = Math.ceil(totalComments / limit);

    res.json({
      success: true,
      comments,
      pagination: {
        currentPage: page,
        totalPages,
        totalComments,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/public/stories/search
 * @desc    Search public stories by title
 * @access  Public
 */
router.get('/stories/search', async (req, res, next) => {
  try {
    const query = req.query.q as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const skip = (page - 1) * limit;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Search query must be at least 2 characters long'
      });
    }

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 50) {
      return res.status(400).json({
        success: false,
        error: 'Invalid pagination parameters'
      });
    }

    // Search stories by title
    const totalStories = await prisma.storyBook.count({
      where: {
        isPublic: true,
        title: {
          contains: query,
          mode: 'insensitive'
        }
      }
    });

    const stories = await prisma.storyBook.findMany({
      where: {
        isPublic: true,
        title: {
          contains: query,
          mode: 'insensitive'
        }
      },
      select: {
        id: true,
        title: true,
        pages: true,
        createdAt: true,
        updatedAt: true,
        owner: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            comments: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    });

    const totalPages = Math.ceil(totalStories / limit);

    res.json({
      success: true,
      stories,
      query,
      pagination: {
        currentPage: page,
        totalPages,
        totalStories,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
