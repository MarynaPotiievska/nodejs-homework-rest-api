const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { handleMongooseError } = require("../helpers");

const contactSchema = new Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
});

contactSchema.post("save", handleMongooseError);

const addContactSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^\(?(\d{3})\)?\s?(\d{3})[- ]?(\d{4})$/)
    .required(),
  favorite: Joi.boolean(),
});

const updateContactSchema = Joi.object({
  name: Joi.string().min(2),
  email: Joi.string().email(),
  phone: Joi.string().pattern(/^\(?(\d{3})\)?\s?(\d{3})[- ]?(\d{4})$/),
});

const updateStatusContact = Joi.object({
  favorite: Joi.boolean().required(),
});

const schemas = { addContactSchema, updateContactSchema, updateStatusContact };

const Contact = model("contact", contactSchema);

module.exports = { Contact, schemas };
