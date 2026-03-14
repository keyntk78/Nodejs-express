"use strict";

const AuthService = require("../services/auth.service");

class AuthController {
  signUp = async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      const result = await AuthService.signUp({ name, email, password });

      const statusCode = result.code === "0000001" ? 201 : 400;
      return res.status(statusCode).json({
        code: result.code,
        metadata: result.metadata || {},
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new AuthController();
