"use strict";

const express = require("express");
const authController = require("../../controllers/auth.controller");
const { asyncHandler } = require("../../utils/handlerError");
const { authentication } = require("../../middleware/checkAuth");
const router = express.Router();

router.post("/shop/signup", asyncHandler(authController.signUp));
router.post("/shop/signin", asyncHandler(authController.signIn));

// sign out - require: x-api-key, authorization (Bearer token), x-client-id
router.post(
  "/shop/signout",
  asyncHandler(authentication),
  asyncHandler(authController.signOut),
);

module.exports = router;
