import Joi from 'joi';

// Defines the rules for creating a new student account.
// Every field is validated before the request reaches the controller.
export const createStudentSchema = Joi.object({
  nim: Joi.string()
    .pattern(/^\d{10}$/) // Must be exactly 10 digits
    .required()
    .messages({
      'string.pattern.base': '"nim" must be exactly 10 digits (e.g., "2024001001")',
    }),
  name: Joi.string().min(3).max(100).required(),
  password: Joi.string().min(8).required(),
  gpa: Joi.number().min(0).max(4.0).required(),
  semester: Joi.number().integer().min(1).max(14).required(),
  major: Joi.string().required(),
});

// Update schema allows partial updates
export const updateStudentSchema = Joi.object({
  nim: Joi.string().pattern(/^\d{10}$/),
  name: Joi.string().min(3).max(100),
  gpa: Joi.number().min(0).max(4.0),
  semester: Joi.number().integer().min(1).max(14),
  major: Joi.string(),
}).min(1); // At least one field must be provided for an update
