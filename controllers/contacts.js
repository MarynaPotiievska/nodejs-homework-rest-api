const contacts = require("../models/contacts");
const { HttpError, ctrlWrapper } = require("../helpers");

const listContacts = async (req, res) => {
  const contactsList = await contacts.listContacts();
  res.json(contactsList);
};

const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const contact = await contacts.getContactById(contactId);
  if (!contact) {
    throw HttpError(404, "Not found");
  }
  res.json(contact);
};

const addContact = async (req, res) => {
  const newContact = await contacts.addContact(req.body);
  res.status(201).json(newContact);
};

const removeContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await contacts.removeContact(contactId);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json({ message: "contact deleted" });
};

const updateContact = async (req, res) => {
  const { contactId } = req.params;
  if (!req.body) {
    throw HttpError(400, "missing fields");
  }
  const editedContact = await contacts.updateContact(contactId, req.body);
  if (!editedContact) {
    throw HttpError(404, "Not found");
  }
  res.json(editedContact);
};

module.exports = {
  listContacts: ctrlWrapper(listContacts),
  getContactById: ctrlWrapper(getContactById),
  addContact: ctrlWrapper(addContact),
  removeContact: ctrlWrapper(removeContact),
  updateContact: ctrlWrapper(updateContact),
};
