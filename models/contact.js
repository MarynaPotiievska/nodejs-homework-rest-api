const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { handleMongooseError } = require("../helpers");
const phoneRegexp = /^\(?(\d{3})\)?\s?(\d{3})[- ]?(\d{4})$/;

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
    match: phoneRegexp,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
});

contactSchema.post("save", handleMongooseError);

const addContactSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(phoneRegexp).required(),
  favorite: Joi.boolean(),
});

const updateContactSchema = Joi.object({
  name: Joi.string().min(2),
  email: Joi.string().email(),
  phone: Joi.string().pattern(phoneRegexp),
});

const updateStatusContactSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

const schemas = {
  addContactSchema,
  updateContactSchema,
  updateStatusContactSchema,
};

const Contact = model("contact", contactSchema);

module.exports = { Contact, schemas };
