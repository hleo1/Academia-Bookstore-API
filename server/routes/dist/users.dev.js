"use strict";

var express = require("express");

var UserDao = require("../data/UserDao");

var ApiError = require("../model/ApiError");

var _require = require("../util/middleware"),
    checkAdmin = _require.checkAdmin,
    checkToken = _require.checkToken;

var router = express.Router();
var users = new UserDao();
router.get("/api/users", checkAdmin, function _callee(req, res, next) {
  var _req$query, username, role, data;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$query = req.query, username = _req$query.username, role = _req$query.role;

          if (!(username && role)) {
            _context.next = 6;
            break;
          }

          throw new ApiError(400, "You must query the database based on either a username or user role.");

        case 6:
          if (!username) {
            _context.next = 12;
            break;
          }

          _context.next = 9;
          return regeneratorRuntime.awrap(users.readOne(username));

        case 9:
          _context.t0 = _context.sent;
          _context.next = 15;
          break;

        case 12:
          _context.next = 14;
          return regeneratorRuntime.awrap(users.readAll(role));

        case 14:
          _context.t0 = _context.sent;

        case 15:
          data = _context.t0;
          res.json({
            data: data
          });

        case 17:
          _context.next = 22;
          break;

        case 19:
          _context.prev = 19;
          _context.t1 = _context["catch"](0);
          next(_context.t1);

        case 22:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 19]]);
});
router.get("/api/users/:id", checkToken, function _callee2(req, res, next) {
  var id, data;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          //check token stores the users' identity in req.users
          //if admin, or if user.id === the requested ID, then continue!
          id = req.params.id;

          if (!(req.user.role === "ADMIN" || req.user.role === "CUSTOMER" && req.user.sub === id)) {
            _context2.next = 9;
            break;
          }

          _context2.next = 5;
          return regeneratorRuntime.awrap(users.read(id));

        case 5:
          data = _context2.sent;
          res.json({
            data: data
          });
          _context2.next = 10;
          break;

        case 9:
          throw new ApiError(403, "You are not authorized to perform this action.");

        case 10:
          _context2.next = 15;
          break;

        case 12:
          _context2.prev = 12;
          _context2.t0 = _context2["catch"](0);
          next(_context2.t0);

        case 15:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 12]]);
});
router.post("/api/users", checkAdmin, function _callee3(req, res, next) {
  var _req$body, username, password, role, data;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _req$body = req.body, username = _req$body.username, password = _req$body.password, role = _req$body.role;
          _context3.next = 4;
          return regeneratorRuntime.awrap(users.create({
            username: username,
            password: password,
            role: role
          }));

        case 4:
          data = _context3.sent;
          res.status(201).json({
            data: data
          });
          _context3.next = 11;
          break;

        case 8:
          _context3.prev = 8;
          _context3.t0 = _context3["catch"](0);
          next(_context3.t0);

        case 11:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 8]]);
});
router["delete"]("/api/users/:id", checkToken, function _callee4(req, res, next) {
  var id, data;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          id = req.params.id;

          if (!(req.user.role === "ADMIN" || req.user.role === "CUSTOMER" && req.user.sub === id)) {
            _context4.next = 9;
            break;
          }

          _context4.next = 5;
          return regeneratorRuntime.awrap(users["delete"](id));

        case 5:
          data = _context4.sent;
          res.json({
            data: data
          });
          _context4.next = 10;
          break;

        case 9:
          throw new ApiError(403, "You are not authorized to perform this action.");

        case 10:
          _context4.next = 15;
          break;

        case 12:
          _context4.prev = 12;
          _context4.t0 = _context4["catch"](0);
          next(_context4.t0);

        case 15:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 12]]);
});
router.put("/api/users/:id", checkToken, function _callee5(req, res, next) {
  var id, _req$body2, password, role, data;

  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          id = req.params.id;
          _req$body2 = req.body, password = _req$body2.password, role = _req$body2.role;

          if (!(!password && !role)) {
            _context5.next = 5;
            break;
          }

          throw new ApiError(400, "You must provide at least one user attribute!");

        case 5:
          if (!(req.user.role === "CUSTOMER" && role || !(req.user.role === "ADMIN" || req.user.role === "CUSTOMER" && req.user.sub === id))) {
            _context5.next = 9;
            break;
          }

          throw new ApiError(403, "You are not authorized to perform this action.");

        case 9:
          _context5.next = 11;
          return regeneratorRuntime.awrap(users.update(id, {
            password: password,
            role: role
          }));

        case 11:
          data = _context5.sent;
          res.json({
            data: data
          });

        case 13:
          _context5.next = 18;
          break;

        case 15:
          _context5.prev = 15;
          _context5.t0 = _context5["catch"](0);
          next(_context5.t0);

        case 18:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 15]]);
});
module.exports = router;