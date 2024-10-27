import Joi from 'joi';

export const taskSchema = Joi.object({
  title: Joi.string().min(3).required().messages({
    'string.empty': 'Title is required',
    'string.min': 'Title must be at least 3 characters long',
  }),
  description: Joi.string().required().messages({
    'string.empty': 'Description is required',
  }),
  userId: Joi.string().required().messages({
    'string.empty': 'User ID is required',
    'string.userId': 'User ID must be a valid',
  }),
  completed: Joi.boolean().required().messages({
    'boolean.base': 'Completed must be a boolean value',
  }),
});

export const taskUpdateSchema = Joi.object({
  title: Joi.string().min(3).optional().messages({
    'string.empty': 'Title is required',
    'string.min': 'Title must be at least 3 characters long',
  }),
  description: Joi.string().optional().messages({
    'string.empty': 'Description is required',
  }),
  completed: Joi.boolean().optional().messages({
    'boolean.base': 'Completed must be a boolean value',
  }),
});
