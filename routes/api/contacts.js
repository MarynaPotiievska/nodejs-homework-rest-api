const express = require("express");
const Joi = require("joi");

const contacts = require("../../models/contacts");
const { HttpError } = require("../../helpers");

const router = express.Router();

const contactsScema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^\(?(\d{3})\)?\s?(\d{3})[- ]?(\d{4})$/)
    .required(),
});

router.get("/", async (req, res, next) => {
  try {
    const contactsList = await contacts.listContacts();
    res.json(contactsList);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await contacts.getContactById(contactId);
    if (!contact) {
      throw HttpError(404, "Not found");
    }
    res.json(contact);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = contactsScema.validate(req.body);
    if (error) {
      throw HttpError(400, "missing required name field");
    }
    const newContact = await contacts.addContact(req.body);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contacts.removeContact(contactId);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json({ message: "contact deleted" });
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    if (!req.body) {
      throw HttpError(400, "missing fields");
    }
    const { error } = contactsScema.validate(req.body);
    if (error) {
      throw HttpError(400, "missing required name field");
    }
    const editedContact = await contacts.updateContact(contactId, req.body);
    if (!editedContact) {
      throw HttpError(404, "Not found");
    }
    res.json(editedContact);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
