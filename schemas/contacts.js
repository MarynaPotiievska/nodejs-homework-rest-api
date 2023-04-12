const Joi = require("joi");

const addContactSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^\(?(\d{3})\)?\s?(\d{3})[- ]?(\d{4})$/)
    .required(),
});

const updateContactSchema = Joi.object({
  name: Joi.string().min(2),
  email: Joi.string().email(),
  phone: Joi.string().pattern(/^\(?(\d{3})\)?\s?(\d{3})[- ]?(\d{4})$/),
});

module.exports = { addContactSchema, updateContactSchema };
