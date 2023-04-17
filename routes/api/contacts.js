const express = require("express");

const ctrl = require("../../controllers/contacts");

const { validateBody } = require("../../middlewares");

const { schemas } = require("../../models/contact");

const router = express.Router();

router.get("/", ctrl.listContacts);

router.get("/:contactId", ctrl.getContactById);

router.post("/", validateBody(schemas.addContactSchema), ctrl.addContact);

router.delete("/:contactId", ctrl.removeContact);

router.put(
  "/:contactId",
  validateBody(schemas.updateContactSchema),
  ctrl.updateContact
);

router.patch(
  "/:contactId",
  validateBody(schemas.updateStatusContactSchema),
  ctrl.updateStatusContact
);

module.exports = router;
