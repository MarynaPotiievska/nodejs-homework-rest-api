const express = require("express");

const ctrl = require("../../controllers/contacts");

const {
  validateBody,
  authenticate,
  validateOwner,
} = require("../../middlewares");

const { schemas } = require("../../models/contact");

const router = express.Router();

router.get("/", authenticate, ctrl.listContacts);

router.get("/:contactId", authenticate, validateOwner, ctrl.getContactById);

router.post(
  "/",
  authenticate,
  validateBody(schemas.addContactSchema),
  ctrl.addContact
);

router.delete("/:contactId", authenticate, validateOwner, ctrl.removeContact);

router.put(
  "/:contactId",
  authenticate,
  validateOwner,
  validateBody(schemas.updateContactSchema),
  ctrl.updateContact
);

router.patch(
  "/:contactId",
  authenticate,
  validateOwner,
  validateBody(schemas.updateStatusContactSchema),
  ctrl.updateStatusContact
);

module.exports = router;
