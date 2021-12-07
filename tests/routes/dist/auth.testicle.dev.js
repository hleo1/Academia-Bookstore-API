"use strict";

var mongoose = require("mongoose");

var supertest = require("supertest");

var app = require("../../server");

var UserDao = require("../../server/data/UserDao");

var _require = require("../../server/util/token"),
    createToken = _require.createToken;

var users = new UserDao();
var request = supertest(app);
describe("Test authentication endpoints", function () {
  beforeAll(function _callee() {
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(mongoose.connect(global.__MONGO_URI__));

          case 2:
            _context.next = 4;
            return regeneratorRuntime.awrap(users.create({
              username: "test-client-auth",
              password: "test-client-auth",
              role: "CUSTOMER"
            }));

          case 4:
          case "end":
            return _context.stop();
        }
      }
    });
  });
  describe("Test /authenticate", function () {
    test("Return 403 when username is incorrect", function _callee2() {
      var response;
      return regeneratorRuntime.async(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return regeneratorRuntime.awrap(request.post("/authenticate").send({
                username: "client",
                password: "test-client-auth"
              }));

            case 2:
              response = _context2.sent;
              expect(response.status).toBe(403);

            case 4:
            case "end":
              return _context2.stop();
          }
        }
      });
    });
    test("Return 403 when password is incorrect", function _callee3() {
      var response;
      return regeneratorRuntime.async(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return regeneratorRuntime.awrap(request.post("/authenticate").send({
                username: "test-client-auth",
                password: "client"
              }));

            case 2:
              response = _context3.sent;
              expect(response.status).toBe(403);

            case 4:
            case "end":
              return _context3.stop();
          }
        }
      });
    });
    test("Return 400 when payload is missing", function _callee4() {
      var response;
      return regeneratorRuntime.async(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return regeneratorRuntime.awrap(request.post("/authenticate"));

            case 2:
              response = _context4.sent;
              expect(response.status).toBe(400);

            case 4:
            case "end":
              return _context4.stop();
          }
        }
      });
    });
    test("Return 400 when username is missing", function _callee5() {
      var response;
      return regeneratorRuntime.async(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return regeneratorRuntime.awrap(request.post("/authenticate").send({
                password: "test-client-auth"
              }));

            case 2:
              response = _context5.sent;
              expect(response.status).toBe(400);

            case 4:
            case "end":
              return _context5.stop();
          }
        }
      });
    });
    test("Return 400 when password is missing", function _callee6() {
      var response;
      return regeneratorRuntime.async(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return regeneratorRuntime.awrap(request.post("/authenticate").send({
                username: "test-client-auth"
              }));

            case 2:
              response = _context6.sent;
              expect(response.status).toBe(400);

            case 4:
            case "end":
              return _context6.stop();
          }
        }
      });
    });
    test("Return 200 and JWT when authentication is successful", function _callee7() {
      var response;
      return regeneratorRuntime.async(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return regeneratorRuntime.awrap(request.post("/authenticate").send({
                username: "test-client-auth",
                password: "test-client-auth"
              }));

            case 2:
              response = _context7.sent;
              expect(response.status).toBe(200);
              expect(response.body.token).toBeTruthy(); // exists and non empty!

            case 5:
            case "end":
              return _context7.stop();
          }
        }
      });
    });
  });
  describe("Test /register", function () {
    test("Return 500 when username already exist", function _callee8() {
      var response;
      return regeneratorRuntime.async(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.next = 2;
              return regeneratorRuntime.awrap(request.post("/register").send({
                username: "test-client-auth",
                password: "test-client-auth"
              }));

            case 2:
              response = _context8.sent;
              expect(response.status).toBe(500);

            case 4:
            case "end":
              return _context8.stop();
          }
        }
      });
    });
    test("Return 400 when payload is missing", function _callee9() {
      var response;
      return regeneratorRuntime.async(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              _context9.next = 2;
              return regeneratorRuntime.awrap(request.post("/register"));

            case 2:
              response = _context9.sent;
              expect(response.status).toBe(400);

            case 4:
            case "end":
              return _context9.stop();
          }
        }
      });
    });
    test("Return 400 when username is missing", function _callee10() {
      var response;
      return regeneratorRuntime.async(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              _context10.next = 2;
              return regeneratorRuntime.awrap(request.post("/register").send({
                password: "new-test-client-auth"
              }));

            case 2:
              response = _context10.sent;
              expect(response.status).toBe(400);

            case 4:
            case "end":
              return _context10.stop();
          }
        }
      });
    });
    test("Return 400 when password is missing", function _callee11() {
      var response;
      return regeneratorRuntime.async(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              _context11.next = 2;
              return regeneratorRuntime.awrap(request.post("/register").send({
                username: "new-test-client-auth"
              }));

            case 2:
              response = _context11.sent;
              expect(response.status).toBe(400);

            case 4:
            case "end":
              return _context11.stop();
          }
        }
      });
    });
    test("Return 201 and JWT when registration is successful", function _callee12() {
      var response;
      return regeneratorRuntime.async(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              _context12.next = 2;
              return regeneratorRuntime.awrap(request.post("/register").send({
                username: "new-test-client-auth",
                password: "new-test-client-auth"
              }));

            case 2:
              response = _context12.sent;
              expect(response.status).toBe(201);
              expect(response.body.token).toBeTruthy(); // exists and non empty!

            case 5:
            case "end":
              return _context12.stop();
          }
        }
      });
    });
  });
  describe("Test /verify", function () {
    var token = {};
    beforeAll(function _callee13() {
      return regeneratorRuntime.async(function _callee13$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              _context13.next = 2;
              return regeneratorRuntime.awrap(createToken({
                username: "test-client-auth",
                role: "CUSTOMER"
              }));

            case 2:
              token.valid = _context13.sent;
              token.invalid = token.valid.split("").sort(function () {
                return 0.5 - Math.random();
              }).join("");
              _context13.next = 6;
              return regeneratorRuntime.awrap(createToken({
                username: "test-client-auth",
                role: "CUSTOMER"
              }, -1));

            case 6:
              token.expired = _context13.sent;

            case 7:
            case "end":
              return _context13.stop();
          }
        }
      });
    });
    test("Return 403 when token is invalid", function _callee14() {
      var response;
      return regeneratorRuntime.async(function _callee14$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              _context14.next = 2;
              return regeneratorRuntime.awrap(request.post("/verify").send({
                token: token.invalid
              }));

            case 2:
              response = _context14.sent;
              expect(response.status).toBe(403);

            case 4:
            case "end":
              return _context14.stop();
          }
        }
      });
    });
    test("Return 403 when token is expired", function _callee15() {
      var response;
      return regeneratorRuntime.async(function _callee15$(_context15) {
        while (1) {
          switch (_context15.prev = _context15.next) {
            case 0:
              _context15.next = 2;
              return regeneratorRuntime.awrap(request.post("/verify").send({
                token: token.expired
              }));

            case 2:
              response = _context15.sent;
              expect(response.status).toBe(403);

            case 4:
            case "end":
              return _context15.stop();
          }
        }
      });
    });
    test("Return 400 when payload is missing", function _callee16() {
      var response;
      return regeneratorRuntime.async(function _callee16$(_context16) {
        while (1) {
          switch (_context16.prev = _context16.next) {
            case 0:
              _context16.next = 2;
              return regeneratorRuntime.awrap(request.post("/verify"));

            case 2:
              response = _context16.sent;
              expect(response.status).toBe(400);

            case 4:
            case "end":
              return _context16.stop();
          }
        }
      });
    });
    test("Return 400 when payload does not contain a token", function _callee17() {
      var response;
      return regeneratorRuntime.async(function _callee17$(_context17) {
        while (1) {
          switch (_context17.prev = _context17.next) {
            case 0:
              _context17.next = 2;
              return regeneratorRuntime.awrap(request.post("/verify").send({
                jwt: token.valid
              }));

            case 2:
              response = _context17.sent;
              expect(response.status).toBe(400);

            case 4:
            case "end":
              return _context17.stop();
          }
        }
      });
    });
    test("Return 200 and JWT when verification is successful", function _callee18() {
      var response;
      return regeneratorRuntime.async(function _callee18$(_context18) {
        while (1) {
          switch (_context18.prev = _context18.next) {
            case 0:
              _context18.next = 2;
              return regeneratorRuntime.awrap(request.post("/verify").send({
                token: token.valid
              }));

            case 2:
              response = _context18.sent;
              expect(response.status).toBe(200);
              expect(response.body.token).toBe(token.valid);

            case 5:
            case "end":
              return _context18.stop();
          }
        }
      });
    });
  });
  afterAll(function _callee19() {
    return regeneratorRuntime.async(function _callee19$(_context19) {
      while (1) {
        switch (_context19.prev = _context19.next) {
          case 0:
            _context19.next = 2;
            return regeneratorRuntime.awrap(mongoose.connection.db.dropDatabase());

          case 2:
            _context19.next = 4;
            return regeneratorRuntime.awrap(mongoose.connection.close());

          case 4:
          case "end":
            return _context19.stop();
        }
      }
    });
  });
});