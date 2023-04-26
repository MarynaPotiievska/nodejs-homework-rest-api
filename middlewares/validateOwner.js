const { Contact } = require("../models/contact");
const { HttpError } = require("../helpers");

const validateOwner = async (req, res, next) => {
  const { _id: owner } = req.user;
  const { contactId } = req.params;
  const contact = await Contact.find({ contactId, owner });
  console.log(contact);
  if (!contact) {
    next(HttpError(403));
  }
  next();
};

module.exports = validateOwner;
