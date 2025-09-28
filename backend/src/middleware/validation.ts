import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      res.status(400).json({
        success: false,
        error: errorMessage
      });
      return;
    }
    
    next();
  };
};

// Validation schemas
export const authSchemas = {
  register: Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name must not exceed 50 characters',
      'any.required': 'Name is required'
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required'
    })
  }),

  login: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
    password: Joi.string().required().messages({
      'any.required': 'Password is required'
    })
  })
};

export const storySchemas = {
  generate: Joi.object({
    prompt: Joi.string().min(10).max(500).required().messages({
      'string.min': 'Prompt must be at least 10 characters long',
      'string.max': 'Prompt must not exceed 500 characters',
      'any.required': 'Prompt is required'
    }),
    interests: Joi.string().min(3).max(200).optional().messages({
      'string.min': 'Interests must be at least 3 characters long',
      'string.max': 'Interests must not exceed 200 characters'
    }),
    age: Joi.number().integer().min(2).max(12).required().messages({
      'number.min': 'Age must be at least 2',
      'number.max': 'Age must not exceed 12',
      'any.required': 'Age is required'
    })
  })
};

export const commentSchemas = {
  create: Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name must not exceed 50 characters',
      'any.required': 'Name is required'
    }),
    text: Joi.string().min(3).max(500).required().messages({
      'string.min': 'Comment must be at least 3 characters long',
      'string.max': 'Comment must not exceed 500 characters',
      'any.required': 'Comment text is required'
    })
  })
};

export const chatbotSchemas = {
  query: Joi.object({
    query: Joi.string().min(3).max(1000).required().messages({
      'string.min': 'Query must be at least 3 characters long',
      'string.max': 'Query must not exceed 1000 characters',
      'any.required': 'Query is required'
    })
  })
};
