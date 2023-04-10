const Joi = require("joi");

const contactsSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^\(?(\d{3})\)?\s?(\d{3})[- ]?(\d{4})$/)
    .required(),
});

module.exports = contactsSchema;
