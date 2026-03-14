"use strict";

const AuthService = require("../services/auth.service");
const { Created, Ok } = require("../core/success.response");

class AuthController {
  signUp = async (req, res, _next) => {
    return new Created({
      message: "Sign up successfully",
      metadata: await AuthService.signUp(req.body),
    }).send(res);
  };

  signIn = async (req, res, _next) => {
    return new Ok({
      message: "Sign in successfully",
      metadata: await AuthService.signIn(req.body),
    }).send(res);
  };

  signOut = async (req, res, _next) => {
    const userId = req.user?.userId;
    await AuthService.signOut(userId);
    return new Ok({
      message: "Sign out successfully",
    }).send(res);
  };
}

module.exports = new AuthController();
