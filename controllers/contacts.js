const { Contact } = require("../models/contact");
const { HttpError, ctrlWrapper } = require("../helpers");

const listContacts = async (req, res, next) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20, favorite = false } = req.query;
  const skip = limit * (page - 1);
  if (!favorite) {
    const contactsList = await Contact.find({ owner }, "-owner", {
      skip,
      limit,
    });
    res.json(contactsList);
    next();
  }
  const filteredContactsList = await Contact.find(
    { owner, favorite },
    "-owner",
    {
      skip,
      limit,
    }
  );
  res.json(filteredContactsList);
};

const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const contact = await Contact.findById(contactId);
  if (!contact) {
    throw HttpError(404, "Not found");
  }
  res.json(contact);
};

const addContact = async (req, res) => {
  const { _id: owner } = req.user;
  const newContact = await Contact.create({ ...req.body, owner });
  res.status(201).json(newContact);
};

const removeContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndRemove(contactId);
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
  const editedContact = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!editedContact) {
    throw HttpError(404, "Not found");
  }
  res.json(editedContact);
};

const updateStatusContact = async (req, res) => {
  const { contactId } = req.params;
  if (!req.body) {
    throw HttpError(400, "missing field favorite");
  }
  const editedContact = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
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
  updateStatusContact: ctrlWrapper(updateStatusContact),
};
