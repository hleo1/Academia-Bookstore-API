"use strict";

var ApiError = require("../model/ApiError");

var _require = require("./token"),
    verifyToken = _require.verifyToken,
    decodeToken = _require.decodeToken,
    parseBearer = _require.parseBearer;

var checkToken = function checkToken(req, res, next) {
  var authorization, token, valid, user;
  return regeneratorRuntime.async(function checkToken$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          authorization = req.headers.authorization;
          token = authorization ? parseBearer(authorization) : "";
          _context.next = 4;
          return regeneratorRuntime.awrap(verifyToken(token));

        case 4:
          valid = _context.sent;
          user = decodeToken(token);

          if (!valid) {
            next(new ApiError(403, "You are not authorized to access this resource!"));
          } else {
            req.user = user;
            next();
          }

        case 7:
        case "end":
          return _context.stop();
      }
    }
  });
};

var checkAdmin = function checkAdmin(req, res, next) {
  var authorization, token, valid, user;
  return regeneratorRuntime.async(function checkAdmin$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          authorization = req.headers.authorization;
          token = authorization ? parseBearer(authorization) : "";
          _context2.next = 4;
          return regeneratorRuntime.awrap(verifyToken(token));

        case 4:
          valid = _context2.sent;
          user = decodeToken(token);

          if (!valid || user.role !== "ADMIN") {
            next(new ApiError(403, "You are not authorized to perform this action."));
          } else {
            next();
          }

        case 7:
        case "end":
          return _context2.stop();
      }
    }
  });
};

var globalErrorHandler = function globalErrorHandler(err, req, res, next) {
  if (err) {
    // debug(err);
    return res.status(err.status || 500).json({
      message: err.message || "Internal server error!"
    });
  }

  next();
};

module.exports = {
  checkToken: checkToken,
  checkAdmin: checkAdmin,
  globalErrorHandler: globalErrorHandler
};