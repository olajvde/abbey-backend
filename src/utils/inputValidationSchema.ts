import * as Joi from 'joi';

export const OnboardUserSchema = Joi.object({
  email: Joi.string().required().email().messages({
    'string.base': 'Email should be a type of text',
    'string.empty': 'Email cannot be an empty field',
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is a required field',
  }),
  phone: Joi.string().min(10).max(11).required().messages({
    'string.empty': 'Phone number cannot be an empty field',
    'string.min': 'Phone number must be at least 10 characters long',
    'string.max': 'Phone number must be at most 11 characters long',
    'any.required': 'Phone number is a required field',
  }),
  firstName: Joi.string().min(2).required().messages({
    'string.base': 'First name should be a type of text',
    'string.empty': 'First name cannot be an empty field',
    'string.min': 'First name must be at least 2 characters long',
    'any.required': 'First name is a required field',
  }),
  lastName: Joi.string().min(2).required().messages({
    'string.base': 'Last name should be a type of text',
    'string.empty': 'Last name cannot be an empty field',
    'string.min': 'Last name must be at least 2 characters long',
    'any.required': 'Last name is a required field',
  }),

  password: Joi.string()
    .min(6)
    .regex(/[0-9]/, 'digit')
    .regex(/[A-Z]/, 'uppercase letter')
    .regex(/[a-z]/, 'lowercase letter')
    .required()
    .messages({
      'string.base': 'Password should be a type of text',
      'string.empty': 'Password cannot be empty',
      'string.min': 'Password must be at least 6 characters long',
      'string.pattern.name': 'Password must contain at least one {#name}',
      'any.required': 'Password is a required field',
    }),

  isAccountOfficer: Joi.boolean().required().messages({
    'boolean.base': 'isAccountOfficer should be a boolean',
    'any.required': 'isAccountOfficer is a required field',
  }),
});
export const LoginSchema = Joi.object({
  email: Joi.string().required().email().messages({
    'string.base': 'Email should be a type of text',
    'string.empty': 'Email cannot be an empty field',
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is a required field',
  }),

  password: Joi.string()

    .required(),
});

export const createAccountSchema = Joi.object({

  officerId: Joi.string().required().messages({
    'string.base': 'Officer ID should be a type of text',
    'string.empty': 'Officer ID cannot be an empty field',
    'any.required': 'Officer ID is a required field',
  }),
  accountType: Joi.string()
    .valid('savings', 'current', 'corporate')
    .default('savings')
    .messages({
      'string.base': 'Account type should be a type of text',
      'any.only': 'Account type must be either savings or current or corporate',
    }),
});

