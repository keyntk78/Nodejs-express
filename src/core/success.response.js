"use strict";

class SuccessResponse {
  constructor({ statusCode, code, message, metadata = {}, options } = {}) {
    this.statusCode = statusCode;
    this.status = "success";
    this.code = code;
    this.message = message;
    this.metadata = metadata;
    if (options && Object.keys(options).length > 0) {
      this.options = options;
    }
  }

  toJSON() {
    const { statusCode, ...body } = this;
    return body;
  }

  send(res) {
    return res.status(this.statusCode).json(this);
  }
}

class Ok extends SuccessResponse {
  constructor({ code = "OK", message = "Success", metadata = {}, options } = {}) {
    super({ statusCode: 200, code, message, metadata, options });
  }
}

class Created extends SuccessResponse {
  constructor({ code = "CREATED", message = "Created", metadata = {}, options } = {}) {
    super({ statusCode: 201, code, message, metadata, options });
  }
}

module.exports = {
  SuccessResponse,
  Ok,
  Created,
};
