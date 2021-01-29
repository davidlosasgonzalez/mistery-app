const Joi = require('joi');

/**
 * ##############
 * ## USUARIOS ##
 * ##############
 */

const registrationSchema = Joi.object().keys({
  name: Joi.string().alphanum().required().min(4).max(20),
  email: Joi.string().required().email(),
  password: Joi.string().required().min(8).max(100),
});

const loginSchema = Joi.object().keys({
  email: Joi.string().required().email(),
  password: Joi.string().required().min(8).max(100),
});

const recoveryUserPasswordSchema = Joi.object().keys({
  email: Joi.string().required().email(),
});

const resetUserPasswordSchema = Joi.object().keys({
  recoveryCode: Joi.string().alphanum().required().email(),
  newPassword: Joi.string().required().min(8).max(100),
});

const editUserSchema = Joi.object().keys({
  name: Joi.string().alphanum().min(4).max(20),
  email: Joi.string().email(),
});

const editUserPasswordSchema = Joi.object().keys({
  oldPassword: Joi.string().required().min(8).max(100),
  newPassword: Joi.string().required().min(8).max(100),
});

/**
 * ################
 * ## APLICACIÓN ##
 * ################
 */

const newEntrySchema = Joi.object().keys({
  type: Joi.string().required().min(3).max(50),
  description: Joi.string().required().min(10).max(300),
  idCouncil: Joi.number().required().min(0),
});

const editEntrySchema = Joi.object().keys({
  type: Joi.string().min(3).max(50),
  description: Joi.string().min(10).max(300),
});

const newCommentSchema = Joi.object().keys({
  text: Joi.string().required().min(4).max(300),
});

const newRatingSchema = Joi.object().keys({
  score: Joi.number().required().valid(1, 2, 3, 4, 5),
});

module.exports = {
  registrationSchema,
  loginSchema,
  recoveryUserPasswordSchema,
  resetUserPasswordSchema,
  editUserSchema,
  editUserPasswordSchema,
  newEntrySchema,
  editEntrySchema,
  newCommentSchema,
  newRatingSchema,
};
