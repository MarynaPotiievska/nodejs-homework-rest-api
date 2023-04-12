const fs = require("fs/promises");

const path = require("path");
const { nanoid } = require("nanoid");

const contactsPath = path.join(__dirname, "/contacts.json");

const listContacts = async () => {
  const contacts = await fs.readFile(contactsPath, "utf-8");
  return JSON.parse(contacts);
};

const getContactById = async (contactId) => {
  const contactsList = await listContacts();
  const contact = contactsList.find((contact) => contact.id === contactId);
  return contact || null;
};

const removeContact = async (contactId) => {
  const contactsList = await listContacts();
  console.log(contactsList);
  const index = contactsList.findIndex((contact) => contact.id === contactId);
  if (index === -1) {
    return null;
  }
  contactsList.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contactsList), "utf-8");
  return contactsList;
};

const addContact = async (body) => {
  const contactsList = await listContacts();
  const newContact = { id: nanoid(21), ...body };
  contactsList.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contactsList), "utf-8");
  return newContact;
};

const updateContact = async (contactId, body) => {
  const contactsList = await listContacts();
  const index = contactsList.findIndex((contact) => contact.id === contactId);
  if (index === -1) {
    return null;
  }
  const { id, name, email, phone } = contactsList[index];
  contactsList[index] = {
    id,
    name: body?.name || name,
    email: body?.email || email,
    phone: body?.phone || phone,
  };
  await fs.writeFile(contactsPath, JSON.stringify(contactsList), "utf-8");
  return contactsList[index];
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
