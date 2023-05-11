const express = require("express");

const { validateBody, authenticate, upload } = require("../../middlewares");

const { schemas } = require("../../models/user");

const ctrl = require("../../controllers/auth");

const router = express.Router();

router.post("/register", validateBody(schemas.registerSchema), ctrl.register);

router.post("/login", validateBody(schemas.loginSchema), ctrl.login);

router.post("/logout", authenticate, ctrl.logout);

router.get("/current", authenticate, upload.single("avatar"), ctrl.current);

router.patch(
  "/",
  authenticate,
  validateBody(schemas.updateSubSchema),
  ctrl.updateUserSub
);

router.patch("/avatars", authenticate, ctrl.updateAvatar);

module.exports = router;
