"use strict";

const keyTokenModel = require("../models/keytoken.model");

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      const keyToken = await keyTokenModel.findOneAndUpdate(
        { user: userId },
        {
          user: userId,
          publicKey,
          privateKey,
          refreshTokensUsed: [],
          refreshToken,
        },
        {
          new: true,
          upsert: true,
        },
      );

      return keyToken ? publicKey : null;
    } catch (error) {
      throw error;
    }
  };
}

module.exports = KeyTokenService;
