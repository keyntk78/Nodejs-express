"use strict";

const AuthService = require("../services/auth.service");
const { Created } = require("../core/success.response");

class AuthController {
  signUp = async (req, res, _next) => {
    return new Created({
      code: "0000001",
      message: "Sign up successfully",
      metadata: await AuthService.signUp(req.body),
    }).send(res);
  };
}

module.exports = new AuthController();
