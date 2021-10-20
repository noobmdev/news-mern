const Joi = require("joi");

exports.registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().min(3).required(),
  // email: string.email().trim().lowercase().required().messages({
  //   "string.email": "Not a valid email address.",
  //   "string.empty": "Email is required.",
  // }),
});

exports.loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  // email: string.email().trim().lowercase().required().messages({
  //   "string.email": "Not a valid email address.",
  //   "string.empty": "Email is required.",
  // }),
});
