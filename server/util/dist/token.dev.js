"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var jwt = require("jsonwebtoken");

var mongoose = require("mongoose");

var createToken = function createToken(user, expiration) {
  return jwt.sign({
    sub: user._id,
    username: user.username,
    role: user.role
  }, process.env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: expiration ? expiration : "20d"
  });
};

var verifyToken = function verifyToken(token) {
  return new Promise(function (resolve, _reject) {
    jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"]
    }, function (err, _decoded) {
      if (err) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};

var decodeToken = function decodeToken(token) {
  var decoded = jwt.decode(token);
  return decoded;
};

var parseBearer = function parseBearer(bearer) {
  var _bearer$trim$split = bearer.trim().split(" "),
      _bearer$trim$split2 = _slicedToArray(_bearer$trim$split, 2),
      _ = _bearer$trim$split2[0],
      token = _bearer$trim$split2[1];

  return token;
};

module.exports = {
  createToken: createToken,
  verifyToken: verifyToken,
  decodeToken: decodeToken,
  parseBearer: parseBearer
};