"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { createTokenPair, verifyToken } = require("../utils/auth.util");
const { getInfoData } = require("../utils/object.util");
const KeyTokenService = require("./keyToken.service");
const { RoleShop } = require("../constants/role.constant");
const {
  ConflictRequestError,
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
} = require("../core/error.response");

class AuthService {
  static signUp = async ({ name, email, password }) => {
    // step 1: check email exist
    const holderShop = await shopModel.findOne({ email }).lean();

    if (holderShop) {
      throw new ConflictRequestError("Shop already exists");
    }

    // step 2: hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // step 3: create new shop
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });

    // step 4: create key token
    if (newShop) {
      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");

      const tokens = await createTokenPair(
        { userId: newShop._id, email, name, roles: newShop.roles },
        privateKey,
      );

      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
        refreshToken: tokens.refreshToken,
      });

      if (!keyStore) {
        throw new BadRequestError("Create key token failed");
      }

      const shopData = getInfoData(newShop, [
        "_id",
        "name",
        "email",
        "roles",
        "status",
        "verify",
      ]);

      return {
        shop: shopData,
        tokens,
      };
    }

    throw new BadRequestError("Sign up failed");
  };

  /**
   * @param {Object} param0
   * @param {string} param0.email
   * @param {string} param0.password
   * step 1: check email exist
   * step 2: compare password
   * step 3: create AT and RT and save
   * step 4: generate token pair
   * step 5: return data login
   */
  static signIn = async ({ email, password }) => {
    // step 1: check email exist
    const holderShop = await shopModel.findOne({ email }).lean();

    if (!holderShop) {
      throw new NotFoundError("Shop not found");
    }

    // step 2: compare password
    const isMatch = await bcrypt.compare(password, holderShop.password);
    if (!isMatch) {
      throw new UnauthorizedError("Authentication error");
    }

    // step 3: create key token (AT and RT) and save
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    const tokens = await createTokenPair(
      {
        userId: holderShop._id,
        email,
        name: holderShop.name,
        roles: holderShop.roles,
      },
      privateKey,
    );

    const keyStore = await KeyTokenService.createKeyToken({
      userId: holderShop._id,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });

    if (!keyStore) {
      throw new BadRequestError("Create key token failed");
    }

    // step 5: return data login
    const shopData = getInfoData(holderShop, [
      "_id",
      "name",
      "email",
      "roles",
      "status",
      "verify",
    ]);
    return {
      shop: shopData,
      tokens,
    };
  };

  static signOut = async (userId) => {
    const result = await KeyTokenService.removeKeyTokenByUserId(userId);
    return result;
  };

  static refreshToken = async (refreshToken) => {
    if (!refreshToken) {
      throw new BadRequestError("Refresh token is required");
    }

    // check xem token này đã được sử dụng chưa?
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken);
    if (foundToken) {
      // nếu có -> decode xem may la thang nao, xóa tất cả token trong keyStore
      const { userId } = await verifyToken(refreshToken, foundToken.privateKey);
      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenError("Something wrong happened!! Pls relogin");
    }

    // NO, qua ngon - find holder token
    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
    if (!holderToken) {
      throw new UnauthorizedError("Shop not registered");
    }

    // verify token
    const { userId, email } = await verifyToken(
      refreshToken,
      holderToken.privateKey,
    );

    // check userId - shop exists
    const foundShop = await shopModel.findOne({ email }).lean();
    if (!foundShop) {
      throw new UnauthorizedError("Shop not registered");
    }

    // create 1 cặp mới
    const tokens = await createTokenPair(
      {
        userId,
        email,
        name: foundShop.name,
        roles: foundShop.roles,
      },
      holderToken.privateKey,
    );

    // lưu lại: refresh token mới + đẩy refresh token cũ vào refreshTokensUsed
    await KeyTokenService.updateRefreshToken(
      userId,
      refreshToken,
      tokens.refreshToken,
    );

    return tokens;
  };
}

module.exports = AuthService;
