"use strict";

const express = require("express");
const authController = require("../../controllers/auth.controller");
const { asyncHandler } = require("../../utils/handlerError");
const router = express.Router();

router.post("/shop/signup", asyncHandler(authController.signUp));
router.post("/shop/signin", asyncHandler(authController.signIn));

module.exports = router;
