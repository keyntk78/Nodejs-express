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

  static removeKeyTokenByUserId = async (userId) => {
    return keyTokenModel.deleteOne({ user: userId });
  };

  static findByUserId = async (userId) => {
    return keyTokenModel.findOne({ user: userId }).lean();
  };

  static findByRefreshTokenUsed = async (refreshToken) => {
    return keyTokenModel.findOne({ refreshTokensUsed: refreshToken }).lean();
  };

  static findByRefreshToken = async (refreshToken) => {
    return keyTokenModel.findOne({ refreshToken }).lean();
  };

  static deleteKeyById = async (userId) => {
    return keyTokenModel.deleteOne({ user: userId });
  };

  static updateRefreshToken = async (
    userId,
    oldRefreshToken,
    newRefreshToken,
  ) => {
    return keyTokenModel.findOneAndUpdate(
      { user: userId },
      {
        $push: { refreshTokensUsed: oldRefreshToken },
        refreshToken: newRefreshToken,
      },
      { new: true },
    );
  };
}

module.exports = KeyTokenService;
