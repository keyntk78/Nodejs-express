"use strict";

const STATUS_CODE = {
  FORBIDDEN: 403,
  CONFLICT: 409,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  UNAUTHORIZED: 401,
  INTERNAL_SERVER_ERROR: 500,
};

const ReasonStatusCode = {
  [STATUS_CODE.CONFLICT]: "Conflict",
  [STATUS_CODE.BAD_REQUEST]: "Bad Request",
  [STATUS_CODE.NOT_FOUND]: "Not Found",
  [STATUS_CODE.UNAUTHORIZED]: "Unauthorized",
  [STATUS_CODE.FORBIDDEN]: "Forbidden",
  [STATUS_CODE.INTERNAL_SERVER_ERROR]: "Internal Server Error",
};

const ErrorCode = {
  [STATUS_CODE.CONFLICT]: "CONFLICT",
  [STATUS_CODE.BAD_REQUEST]: "BAD_REQUEST",
  [STATUS_CODE.NOT_FOUND]: "NOT_FOUND",
  [STATUS_CODE.UNAUTHORIZED]: "UNAUTHORIZED",
  [STATUS_CODE.FORBIDDEN]: "FORBIDDEN",
  [STATUS_CODE.INTERNAL_SERVER_ERROR]: "INTERNAL_SERVER_ERROR",
};

class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.code = ErrorCode[statusCode] || "INTERNAL_SERVER_ERROR";
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode[STATUS_CODE.CONFLICT],
    statusCode = STATUS_CODE.CONFLICT,
  ) {
    super(message, statusCode);
  }
}

class BadRequestError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode[STATUS_CODE.BAD_REQUEST],
    statusCode = STATUS_CODE.BAD_REQUEST,
  ) {
    super(message, statusCode);
  }
}

class NotFoundError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode[STATUS_CODE.NOT_FOUND],
    statusCode = STATUS_CODE.NOT_FOUND,
  ) {
    super(message, statusCode);
  }
}

class UnauthorizedError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode[STATUS_CODE.UNAUTHORIZED],
    statusCode = STATUS_CODE.UNAUTHORIZED,
  ) {
    super(message, statusCode);
  }
}

class ForbiddenError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode[STATUS_CODE.FORBIDDEN],
    statusCode = STATUS_CODE.FORBIDDEN,
  ) {
    super(message, statusCode);
  }
}

class InternalServerError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode[STATUS_CODE.INTERNAL_SERVER_ERROR],
    statusCode = STATUS_CODE.INTERNAL_SERVER_ERROR,
  ) {
    super(message, statusCode);
  }
}
module.exports = {
  ConflictRequestError,
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  InternalServerError,
};
