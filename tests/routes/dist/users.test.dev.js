"use strict";

var faker = require("faker");

var mongoose = require("mongoose");

var supertest = require("supertest");

var app = require("../../server");

var UserDao = require("../../server/data/UserDao");

var _require = require("../../server/util/token"),
    createToken = _require.createToken;

var users = new UserDao();
var request = supertest(app);
var endpoint = "/api/users";
describe("Test ".concat(endpoint, " endpoints"), function () {
  var tokens = {};
  beforeAll(function _callee() {
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(mongoose.connect(global.__MONGO_URI__));

          case 2:
            _context.next = 4;
            return regeneratorRuntime.awrap(createToken({
              role: "ADMIN"
            }));

          case 4:
            tokens.admin = _context.sent;
            tokens.invalid = tokens.admin.split("").sort(function () {
              return 0.5 - Math.random();
            }).join("");
            _context.next = 8;
            return regeneratorRuntime.awrap(createToken({
              role: "CUSTOMER"
            }));

          case 8:
            tokens.customer = _context.sent;
            _context.next = 11;
            return regeneratorRuntime.awrap(createToken({
              role: "ADMIN"
            }, -1));

          case 11:
            tokens.expiredAdmin = _context.sent;

          case 12:
          case "end":
            return _context.stop();
        }
      }
    });
  });
  describe("Test GET ".concat(endpoint), function () {
    var samples = [];
    beforeAll(function _callee2() {
      return regeneratorRuntime.async(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return regeneratorRuntime.awrap(users.create({
                username: faker.internet.userName(),
                password: faker.internet.password(),
                role: "CUSTOMER"
              }));

            case 2:
              samples[0] = _context2.sent;
              _context2.next = 5;
              return regeneratorRuntime.awrap(users.create({
                username: faker.internet.userName(),
                password: faker.internet.password(),
                role: "CUSTOMER"
              }));

            case 5:
              samples[1] = _context2.sent;
              _context2.next = 8;
              return regeneratorRuntime.awrap(users.create({
                username: faker.internet.userName(),
                password: faker.internet.password(),
                role: "ADMIN"
              }));

            case 8:
              samples[2] = _context2.sent;

            case 9:
            case "end":
              return _context2.stop();
          }
        }
      });
    });
    test("Return 403 for missing token", function _callee3() {
      var response;
      return regeneratorRuntime.async(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return regeneratorRuntime.awrap(request.get(endpoint));

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
    test("Return 403 for invalid token", function _callee4() {
      var response;
      return regeneratorRuntime.async(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return regeneratorRuntime.awrap(request.get(endpoint).set("Authorization", "Bearer ".concat(tokens.invalid)));

            case 2:
              response = _context4.sent;
              expect(response.status).toBe(403);

            case 4:
            case "end":
              return _context4.stop();
          }
        }
      });
    });
    test("Return 403 for unauthorized token", function _callee5() {
      var response;
      return regeneratorRuntime.async(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return regeneratorRuntime.awrap(request.get(endpoint).set("Authorization", "Bearer ".concat(tokens.customer)));

            case 2:
              response = _context5.sent;
              expect(response.status).toBe(403);

            case 4:
            case "end":
              return _context5.stop();
          }
        }
      });
    });
    test("Return 403 for expired token", function _callee6() {
      var response;
      return regeneratorRuntime.async(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return regeneratorRuntime.awrap(request.get(endpoint).set("Authorization", "Bearer ".concat(tokens.expiredAdmin)));

            case 2:
              response = _context6.sent;
              expect(response.status).toBe(403);

            case 4:
            case "end":
              return _context6.stop();
          }
        }
      });
    });
    test("Return 200 and list of users for successful request", function _callee7() {
      var response;
      return regeneratorRuntime.async(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return regeneratorRuntime.awrap(request.get(endpoint).set("Authorization", "Bearer ".concat(tokens.admin)));

            case 2:
              response = _context7.sent;
              expect(response.status).toBe(200);
              expect(response.body.data.length).toBe(samples.length);

            case 5:
            case "end":
              return _context7.stop();
          }
        }
      });
    });
    describe("Test GET ".concat(endpoint, " with query parameter"), function () {
      test("Return 400 when both username and role query parameters are provided", function _callee8() {
        var username, role, response;
        return regeneratorRuntime.async(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                username = samples[1].username;
                role = samples[1].role;
                _context8.next = 4;
                return regeneratorRuntime.awrap(request.get("".concat(endpoint, "?username=").concat(username, "&role=").concat(role)).set("Authorization", "Bearer ".concat(tokens.admin)));

              case 4:
                response = _context8.sent;
                expect(response.status).toBe(400);

              case 6:
              case "end":
                return _context8.stop();
            }
          }
        });
      });
      test("Return 200 and list of users for a given role", function _callee9() {
        var role, response, expected;
        return regeneratorRuntime.async(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                role = "ADMIN";
                _context9.next = 3;
                return regeneratorRuntime.awrap(request.get("".concat(endpoint, "?role=").concat(role)).set("Authorization", "Bearer ".concat(tokens.admin)));

              case 3:
                response = _context9.sent;
                expected = samples.filter(function (s) {
                  return s.role === role;
                }).length;
                expect(response.status).toBe(200);
                expect(response.body.data.length).toBe(expected);

              case 7:
              case "end":
                return _context9.stop();
            }
          }
        });
      });
      test("Return 200 and empty list for non-existing role", function _callee10() {
        var role, response, expected;
        return regeneratorRuntime.async(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                role = "non-existing-role";
                _context10.next = 3;
                return regeneratorRuntime.awrap(request.get("".concat(endpoint, "?role=").concat(role)).set("Authorization", "Bearer ".concat(tokens.admin)));

              case 3:
                response = _context10.sent;
                expected = samples.filter(function (s) {
                  return s.role === role;
                }).length;
                expect(response.status).toBe(200);
                expect(response.body.data.length).toBe(expected);

              case 7:
              case "end":
                return _context10.stop();
            }
          }
        });
      });
      test("Return 200 and a user for a given username", function _callee11() {
        var username, response, expected;
        return regeneratorRuntime.async(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                username = samples[1].username;
                _context11.next = 3;
                return regeneratorRuntime.awrap(request.get("".concat(endpoint, "?username=").concat(username)).set("Authorization", "Bearer ".concat(tokens.admin)));

              case 3:
                response = _context11.sent;
                expected = samples.filter(function (s) {
                  return s.username === username;
                });
                expect(response.status).toBe(200);
                expect(response.body.data).toStrictEqual(expected);

              case 7:
              case "end":
                return _context11.stop();
            }
          }
        });
      });
      test("Return 200 and empty list fon non-existing username", function _callee12() {
        var username, response, expected;
        return regeneratorRuntime.async(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                username = "non-existing-username";
                _context12.next = 3;
                return regeneratorRuntime.awrap(request.get("".concat(endpoint, "?username=").concat(username)).set("Authorization", "Bearer ".concat(tokens.admin)));

              case 3:
                response = _context12.sent;
                expected = samples.filter(function (s) {
                  return s.username === username;
                });
                expect(response.status).toBe(200);
                expect(response.body.data).toStrictEqual(expected);

              case 7:
              case "end":
                return _context12.stop();
            }
          }
        });
      });
    });
    afterAll(function _callee13() {
      var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, sample;

      return regeneratorRuntime.async(function _callee13$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              _iteratorNormalCompletion = true;
              _didIteratorError = false;
              _iteratorError = undefined;
              _context13.prev = 3;
              _iterator = samples[Symbol.iterator]();

            case 5:
              if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                _context13.next = 12;
                break;
              }

              sample = _step.value;
              _context13.next = 9;
              return regeneratorRuntime.awrap(users["delete"](sample._id));

            case 9:
              _iteratorNormalCompletion = true;
              _context13.next = 5;
              break;

            case 12:
              _context13.next = 18;
              break;

            case 14:
              _context13.prev = 14;
              _context13.t0 = _context13["catch"](3);
              _didIteratorError = true;
              _iteratorError = _context13.t0;

            case 18:
              _context13.prev = 18;
              _context13.prev = 19;

              if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                _iterator["return"]();
              }

            case 21:
              _context13.prev = 21;

              if (!_didIteratorError) {
                _context13.next = 24;
                break;
              }

              throw _iteratorError;

            case 24:
              return _context13.finish(21);

            case 25:
              return _context13.finish(18);

            case 26:
            case "end":
              return _context13.stop();
          }
        }
      }, null, null, [[3, 14, 18, 26], [19,, 21, 25]]);
    });
  });
  describe("Test GET ".concat(endpoint, "/:id"), function () {
    var user;
    var userToken;
    beforeAll(function _callee14() {
      return regeneratorRuntime.async(function _callee14$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              _context14.next = 2;
              return regeneratorRuntime.awrap(users.create({
                username: faker.internet.userName(),
                password: faker.internet.password(),
                role: "CUSTOMER"
              }));

            case 2:
              user = _context14.sent;
              _context14.next = 5;
              return regeneratorRuntime.awrap(createToken(user));

            case 5:
              userToken = _context14.sent;

            case 6:
            case "end":
              return _context14.stop();
          }
        }
      });
    });
    test("Return 404 for an invalid id", function _callee15() {
      var id, response;
      return regeneratorRuntime.async(function _callee15$(_context15) {
        while (1) {
          switch (_context15.prev = _context15.next) {
            case 0:
              id = mongoose.Types.ObjectId().toString();
              _context15.next = 3;
              return regeneratorRuntime.awrap(request.get("".concat(endpoint, "/").concat(id)).set("Authorization", "Bearer ".concat(tokens.admin)));

            case 3:
              response = _context15.sent;
              expect(response.status).toBe(404);

            case 5:
            case "end":
              return _context15.stop();
          }
        }
      });
    });
    test("Return 403 for missing token", function _callee16() {
      var id, response;
      return regeneratorRuntime.async(function _callee16$(_context16) {
        while (1) {
          switch (_context16.prev = _context16.next) {
            case 0:
              id = user._id;
              _context16.next = 3;
              return regeneratorRuntime.awrap(request.get("".concat(endpoint, "/").concat(id)));

            case 3:
              response = _context16.sent;
              expect(response.status).toBe(403);

            case 5:
            case "end":
              return _context16.stop();
          }
        }
      });
    });
    test("Return 403 for invalid token", function _callee17() {
      var id, response;
      return regeneratorRuntime.async(function _callee17$(_context17) {
        while (1) {
          switch (_context17.prev = _context17.next) {
            case 0:
              id = user._id;
              _context17.next = 3;
              return regeneratorRuntime.awrap(request.get("".concat(endpoint, "/").concat(id)).set("Authorization", "Bearer ".concat(tokens.invalid)));

            case 3:
              response = _context17.sent;
              expect(response.status).toBe(403);

            case 5:
            case "end":
              return _context17.stop();
          }
        }
      });
    });
    test("Return 403 for unauthorized token", function _callee18() {
      var id, response;
      return regeneratorRuntime.async(function _callee18$(_context18) {
        while (1) {
          switch (_context18.prev = _context18.next) {
            case 0:
              id = user._id;
              _context18.next = 3;
              return regeneratorRuntime.awrap(request.get("".concat(endpoint, "/").concat(id)).set("Authorization", "Bearer ".concat(tokens.customer)));

            case 3:
              response = _context18.sent;
              expect(response.status).toBe(403);

            case 5:
            case "end":
              return _context18.stop();
          }
        }
      });
    });
    test("Return 403 for expired token", function _callee19() {
      var id, response;
      return regeneratorRuntime.async(function _callee19$(_context19) {
        while (1) {
          switch (_context19.prev = _context19.next) {
            case 0:
              id = user._id;
              _context19.next = 3;
              return regeneratorRuntime.awrap(request.get("".concat(endpoint, "/").concat(id)).set("Authorization", "Bearer ".concat(tokens.expiredAdmin)));

            case 3:
              response = _context19.sent;
              expect(response.status).toBe(403);

            case 5:
            case "end":
              return _context19.stop();
          }
        }
      });
    });
    describe("Return 200 and the user for a given id", function () {
      test("Customer can get their own user info", function _callee20() {
        var id, response;
        return regeneratorRuntime.async(function _callee20$(_context20) {
          while (1) {
            switch (_context20.prev = _context20.next) {
              case 0:
                id = user._id;
                _context20.next = 3;
                return regeneratorRuntime.awrap(request.get("".concat(endpoint, "/").concat(id)).set("Authorization", "Bearer ".concat(userToken)));

              case 3:
                response = _context20.sent;
                expect(response.status).toBe(200);
                expect(response.body.data).toStrictEqual(user);

              case 6:
              case "end":
                return _context20.stop();
            }
          }
        });
      });
      test("Admin can get user info for any user", function _callee21() {
        var id, response;
        return regeneratorRuntime.async(function _callee21$(_context21) {
          while (1) {
            switch (_context21.prev = _context21.next) {
              case 0:
                id = user._id;
                _context21.next = 3;
                return regeneratorRuntime.awrap(request.get("".concat(endpoint, "/").concat(id)).set("Authorization", "Bearer ".concat(tokens.admin)));

              case 3:
                response = _context21.sent;
                expect(response.status).toBe(200);
                expect(response.body.data).toStrictEqual(user);

              case 6:
              case "end":
                return _context21.stop();
            }
          }
        });
      });
    });
    afterAll(function _callee22() {
      return regeneratorRuntime.async(function _callee22$(_context22) {
        while (1) {
          switch (_context22.prev = _context22.next) {
            case 0:
              _context22.next = 2;
              return regeneratorRuntime.awrap(users["delete"](user._id));

            case 2:
            case "end":
              return _context22.stop();
          }
        }
      });
    });
  });
  describe("Test POST ".concat(endpoint), function () {
    var user;
    var existingUser;
    beforeAll(function _callee23() {
      return regeneratorRuntime.async(function _callee23$(_context23) {
        while (1) {
          switch (_context23.prev = _context23.next) {
            case 0:
              _context23.next = 2;
              return regeneratorRuntime.awrap(users.create({
                username: "existing-user-post",
                password: "existing-user-post",
                role: "ADMIN"
              }));

            case 2:
              existingUser = _context23.sent;
              user = {
                username: "test-user-post",
                password: "test-user-post",
                role: "CUSTOMER"
              };

            case 4:
            case "end":
              return _context23.stop();
          }
        }
      });
    });
    test("Return 500 when username is already in-use", function _callee24() {
      var response;
      return regeneratorRuntime.async(function _callee24$(_context24) {
        while (1) {
          switch (_context24.prev = _context24.next) {
            case 0:
              _context24.next = 2;
              return regeneratorRuntime.awrap(request.post(endpoint).send({
                username: "existing-user-post",
                password: "existing-user-post",
                role: "ADMIN"
              }).set("Authorization", "Bearer ".concat(tokens.admin)));

            case 2:
              response = _context24.sent;
              expect(response.status).toBe(500);

            case 4:
            case "end":
              return _context24.stop();
          }
        }
      });
    });
    test("Return 403 for missing token", function _callee25() {
      var response;
      return regeneratorRuntime.async(function _callee25$(_context25) {
        while (1) {
          switch (_context25.prev = _context25.next) {
            case 0:
              _context25.next = 2;
              return regeneratorRuntime.awrap(request.post(endpoint).send(user));

            case 2:
              response = _context25.sent;
              expect(response.status).toBe(403);

            case 4:
            case "end":
              return _context25.stop();
          }
        }
      });
    });
    test("Return 403 for invalid token", function _callee26() {
      var response;
      return regeneratorRuntime.async(function _callee26$(_context26) {
        while (1) {
          switch (_context26.prev = _context26.next) {
            case 0:
              _context26.next = 2;
              return regeneratorRuntime.awrap(request.post(endpoint).send(user).set("Authorization", "Bearer ".concat(tokens.invalid)));

            case 2:
              response = _context26.sent;
              expect(response.status).toBe(403);

            case 4:
            case "end":
              return _context26.stop();
          }
        }
      });
    });
    test("Return 403 for unauthorized token", function _callee27() {
      var response;
      return regeneratorRuntime.async(function _callee27$(_context27) {
        while (1) {
          switch (_context27.prev = _context27.next) {
            case 0:
              _context27.next = 2;
              return regeneratorRuntime.awrap(request.post(endpoint).send(user).set("Authorization", "Bearer ".concat(tokens.customer)));

            case 2:
              response = _context27.sent;
              expect(response.status).toBe(403);

            case 4:
            case "end":
              return _context27.stop();
          }
        }
      });
    });
    test("Return 403 for expired token", function _callee28() {
      var response;
      return regeneratorRuntime.async(function _callee28$(_context28) {
        while (1) {
          switch (_context28.prev = _context28.next) {
            case 0:
              _context28.next = 2;
              return regeneratorRuntime.awrap(request.post(endpoint).send(user).set("Authorization", "Bearer ".concat(tokens.expiredAdmin)));

            case 2:
              response = _context28.sent;
              expect(response.status).toBe(403);

            case 4:
            case "end":
              return _context28.stop();
          }
        }
      });
    });
    test("Return 400 for missing payload", function _callee29() {
      var response;
      return regeneratorRuntime.async(function _callee29$(_context29) {
        while (1) {
          switch (_context29.prev = _context29.next) {
            case 0:
              _context29.next = 2;
              return regeneratorRuntime.awrap(request.post(endpoint).set("Authorization", "Bearer ".concat(tokens.admin)));

            case 2:
              response = _context29.sent;
              expect(response.status).toBe(400);

            case 4:
            case "end":
              return _context29.stop();
          }
        }
      });
    });
    test("Return 400 for missing username", function _callee30() {
      var response;
      return regeneratorRuntime.async(function _callee30$(_context30) {
        while (1) {
          switch (_context30.prev = _context30.next) {
            case 0:
              _context30.next = 2;
              return regeneratorRuntime.awrap(request.post(endpoint).send({
                password: "test-user-post",
                role: "CUSTOMER"
              }).set("Authorization", "Bearer ".concat(tokens.admin)));

            case 2:
              response = _context30.sent;
              expect(response.status).toBe(400);

            case 4:
            case "end":
              return _context30.stop();
          }
        }
      });
    });
    test("Return 400 for missing password", function _callee31() {
      var response;
      return regeneratorRuntime.async(function _callee31$(_context31) {
        while (1) {
          switch (_context31.prev = _context31.next) {
            case 0:
              _context31.next = 2;
              return regeneratorRuntime.awrap(request.post(endpoint).send({
                username: "test-user-post",
                role: "CUSTOMER"
              }).set("Authorization", "Bearer ".concat(tokens.admin)));

            case 2:
              response = _context31.sent;
              expect(response.status).toBe(400);

            case 4:
            case "end":
              return _context31.stop();
          }
        }
      });
    });
    test("Return 400 for missing role", function _callee32() {
      var response;
      return regeneratorRuntime.async(function _callee32$(_context32) {
        while (1) {
          switch (_context32.prev = _context32.next) {
            case 0:
              _context32.next = 2;
              return regeneratorRuntime.awrap(request.post(endpoint).send({
                username: "test-user-post",
                password: "test-user-post"
              }).set("Authorization", "Bearer ".concat(tokens.admin)));

            case 2:
              response = _context32.sent;
              expect(response.status).toBe(400);

            case 4:
            case "end":
              return _context32.stop();
          }
        }
      });
    });
    test("Return 400 for invalid role", function _callee33() {
      var response;
      return regeneratorRuntime.async(function _callee33$(_context33) {
        while (1) {
          switch (_context33.prev = _context33.next) {
            case 0:
              _context33.next = 2;
              return regeneratorRuntime.awrap(request.post(endpoint).send({
                username: "test-user-post",
                password: "test-user-post",
                role: "SOME_UNSUPPORTED_ROLE"
              }).set("Authorization", "Bearer ".concat(tokens.admin)));

            case 2:
              response = _context33.sent;
              expect(response.status).toBe(400);

            case 4:
            case "end":
              return _context33.stop();
          }
        }
      });
    });
    test("Return 201 and the user for successful request", function _callee34() {
      var response;
      return regeneratorRuntime.async(function _callee34$(_context34) {
        while (1) {
          switch (_context34.prev = _context34.next) {
            case 0:
              _context34.next = 2;
              return regeneratorRuntime.awrap(request.post(endpoint).send(user).set("Authorization", "Bearer ".concat(tokens.admin)));

            case 2:
              response = _context34.sent;
              expect(response.status).toBe(201);
              expect(response.body.data.username).toBe(user.username);
              expect(response.body.data.role).toBe(user.role);
              user._id = response.body.data._id;

            case 7:
            case "end":
              return _context34.stop();
          }
        }
      });
    });
    afterAll(function _callee35() {
      return regeneratorRuntime.async(function _callee35$(_context35) {
        while (1) {
          switch (_context35.prev = _context35.next) {
            case 0:
              _context35.next = 2;
              return regeneratorRuntime.awrap(users["delete"](existingUser._id));

            case 2:
              _context35.next = 4;
              return regeneratorRuntime.awrap(users["delete"](user._id));

            case 4:
            case "end":
              return _context35.stop();
          }
        }
      });
    });
  });
  describe("Test PUT ".concat(endpoint, "/:id"), function () {
    var user;
    var userToken;
    beforeAll(function _callee36() {
      return regeneratorRuntime.async(function _callee36$(_context36) {
        while (1) {
          switch (_context36.prev = _context36.next) {
            case 0:
              _context36.next = 2;
              return regeneratorRuntime.awrap(users.create({
                username: "test-user-put",
                password: "test-user-put",
                role: "CUSTOMER"
              }));

            case 2:
              user = _context36.sent;
              _context36.next = 5;
              return regeneratorRuntime.awrap(createToken(user));

            case 5:
              userToken = _context36.sent;

            case 6:
            case "end":
              return _context36.stop();
          }
        }
      });
    });
    test("Return 404 for invalid ID", function _callee37() {
      var response;
      return regeneratorRuntime.async(function _callee37$(_context37) {
        while (1) {
          switch (_context37.prev = _context37.next) {
            case 0:
              _context37.next = 2;
              return regeneratorRuntime.awrap(request.put("".concat(endpoint, "/").concat(mongoose.Types.ObjectId().toString())).send({
                role: "ADMIN"
              }).set("Authorization", "Bearer ".concat(tokens.admin)));

            case 2:
              response = _context37.sent;
              expect(response.status).toBe(404);

            case 4:
            case "end":
              return _context37.stop();
          }
        }
      });
    });
    test("Return 403 for missing token", function _callee38() {
      var response;
      return regeneratorRuntime.async(function _callee38$(_context38) {
        while (1) {
          switch (_context38.prev = _context38.next) {
            case 0:
              _context38.next = 2;
              return regeneratorRuntime.awrap(request.put("".concat(endpoint, "/").concat(user._id)).send({
                role: "ADMIN"
              }));

            case 2:
              response = _context38.sent;
              expect(response.status).toBe(403);

            case 4:
            case "end":
              return _context38.stop();
          }
        }
      });
    });
    test("Return 403 for invalid token", function _callee39() {
      var response;
      return regeneratorRuntime.async(function _callee39$(_context39) {
        while (1) {
          switch (_context39.prev = _context39.next) {
            case 0:
              _context39.next = 2;
              return regeneratorRuntime.awrap(request.put("".concat(endpoint, "/").concat(user._id)).send({
                role: "ADMIN"
              }).set("Authorization", "Bearer ".concat(tokens.invalid)));

            case 2:
              response = _context39.sent;
              expect(response.status).toBe(403);

            case 4:
            case "end":
              return _context39.stop();
          }
        }
      });
    });
    test("Return 403 for unauthorized token", function _callee40() {
      var response;
      return regeneratorRuntime.async(function _callee40$(_context40) {
        while (1) {
          switch (_context40.prev = _context40.next) {
            case 0:
              _context40.next = 2;
              return regeneratorRuntime.awrap(request.put("".concat(endpoint, "/").concat(user._id)).send({
                role: "ADMIN"
              }).set("Authorization", "Bearer ".concat(tokens.customer)));

            case 2:
              response = _context40.sent;
              expect(response.status).toBe(403);

            case 4:
            case "end":
              return _context40.stop();
          }
        }
      });
    });
    test("Return 403 for customer updating their role", function _callee41() {
      var response;
      return regeneratorRuntime.async(function _callee41$(_context41) {
        while (1) {
          switch (_context41.prev = _context41.next) {
            case 0:
              _context41.next = 2;
              return regeneratorRuntime.awrap(request.put("".concat(endpoint, "/").concat(user._id)).send({
                role: "ADMIN"
              }).set("Authorization", "Bearer ".concat(userToken)));

            case 2:
              response = _context41.sent;
              expect(response.status).toBe(403);

            case 4:
            case "end":
              return _context41.stop();
          }
        }
      });
    });
    test("Return 403 for expired token", function _callee42() {
      var response;
      return regeneratorRuntime.async(function _callee42$(_context42) {
        while (1) {
          switch (_context42.prev = _context42.next) {
            case 0:
              _context42.next = 2;
              return regeneratorRuntime.awrap(request.put("".concat(endpoint, "/").concat(user._id)).send({
                role: "ADMIN"
              }).set("Authorization", "Bearer ".concat(tokens.expiredAdmin)));

            case 2:
              response = _context42.sent;
              expect(response.status).toBe(403);

            case 4:
            case "end":
              return _context42.stop();
          }
        }
      });
    });
    test("Return 400 for missing payload", function _callee43() {
      var response;
      return regeneratorRuntime.async(function _callee43$(_context43) {
        while (1) {
          switch (_context43.prev = _context43.next) {
            case 0:
              _context43.next = 2;
              return regeneratorRuntime.awrap(request.put("".concat(endpoint, "/").concat(user._id)).set("Authorization", "Bearer ".concat(tokens.admin)));

            case 2:
              response = _context43.sent;
              expect(response.status).toBe(400);

            case 4:
            case "end":
              return _context43.stop();
          }
        }
      });
    });
    describe("Return 200 and updated user for successful request", function () {
      test("Customer can update their account", function _callee44() {
        var response;
        return regeneratorRuntime.async(function _callee44$(_context44) {
          while (1) {
            switch (_context44.prev = _context44.next) {
              case 0:
                _context44.next = 2;
                return regeneratorRuntime.awrap(request.put("".concat(endpoint, "/").concat(user._id)).send({
                  password: "updated-password"
                }).set("Authorization", "Bearer ".concat(userToken)));

              case 2:
                response = _context44.sent;
                expect(response.status).toBe(200);

              case 4:
              case "end":
                return _context44.stop();
            }
          }
        });
      });
      test("Admin can update any user account", function _callee45() {
        var response;
        return regeneratorRuntime.async(function _callee45$(_context45) {
          while (1) {
            switch (_context45.prev = _context45.next) {
              case 0:
                _context45.next = 2;
                return regeneratorRuntime.awrap(request.put("".concat(endpoint, "/").concat(user._id)).send({
                  role: "ADMIN"
                }).set("Authorization", "Bearer ".concat(tokens.admin)));

              case 2:
                response = _context45.sent;
                expect(response.status).toBe(200);
                expect(response.body.data.role).toBe("ADMIN");

              case 5:
              case "end":
                return _context45.stop();
            }
          }
        });
      });
    });
    afterAll(function _callee46() {
      return regeneratorRuntime.async(function _callee46$(_context46) {
        while (1) {
          switch (_context46.prev = _context46.next) {
            case 0:
              _context46.next = 2;
              return regeneratorRuntime.awrap(users["delete"](user._id));

            case 2:
            case "end":
              return _context46.stop();
          }
        }
      });
    });
  });
  describe("Test DELETE ".concat(endpoint, "/:id"), function () {
    var samples = [];
    beforeAll(function _callee47() {
      return regeneratorRuntime.async(function _callee47$(_context47) {
        while (1) {
          switch (_context47.prev = _context47.next) {
            case 0:
              _context47.next = 2;
              return regeneratorRuntime.awrap(users.create({
                username: faker.internet.userName(),
                password: faker.internet.password(),
                role: "CUSTOMER"
              }));

            case 2:
              samples[0] = _context47.sent;
              _context47.next = 5;
              return regeneratorRuntime.awrap(users.create({
                username: faker.internet.userName(),
                password: faker.internet.password(),
                role: "CUSTOMER"
              }));

            case 5:
              samples[1] = _context47.sent;

            case 6:
            case "end":
              return _context47.stop();
          }
        }
      });
    });
    test("Return 404 for invalid ID", function _callee48() {
      var response;
      return regeneratorRuntime.async(function _callee48$(_context48) {
        while (1) {
          switch (_context48.prev = _context48.next) {
            case 0:
              _context48.next = 2;
              return regeneratorRuntime.awrap(request["delete"]("".concat(endpoint, "/").concat(mongoose.Types.ObjectId().toString())).set("Authorization", "Bearer ".concat(tokens.admin)));

            case 2:
              response = _context48.sent;
              expect(response.status).toBe(404);

            case 4:
            case "end":
              return _context48.stop();
          }
        }
      });
    });
    test("Return 403 for missing token", function _callee49() {
      var response;
      return regeneratorRuntime.async(function _callee49$(_context49) {
        while (1) {
          switch (_context49.prev = _context49.next) {
            case 0:
              _context49.next = 2;
              return regeneratorRuntime.awrap(request["delete"]("".concat(endpoint, "/").concat(samples[0]._id)));

            case 2:
              response = _context49.sent;
              expect(response.status).toBe(403);

            case 4:
            case "end":
              return _context49.stop();
          }
        }
      });
    });
    test("Return 403 for invalid token", function _callee50() {
      var response;
      return regeneratorRuntime.async(function _callee50$(_context50) {
        while (1) {
          switch (_context50.prev = _context50.next) {
            case 0:
              _context50.next = 2;
              return regeneratorRuntime.awrap(request["delete"]("".concat(endpoint, "/").concat(samples[0]._id)).set("Authorization", "Bearer ".concat(tokens.invalid)));

            case 2:
              response = _context50.sent;
              expect(response.status).toBe(403);

            case 4:
            case "end":
              return _context50.stop();
          }
        }
      });
    });
    test("Return 403 for unauthorized token", function _callee51() {
      var response;
      return regeneratorRuntime.async(function _callee51$(_context51) {
        while (1) {
          switch (_context51.prev = _context51.next) {
            case 0:
              _context51.next = 2;
              return regeneratorRuntime.awrap(request["delete"]("".concat(endpoint, "/").concat(samples[0]._id)).set("Authorization", "Bearer ".concat(tokens.customer)));

            case 2:
              response = _context51.sent;
              expect(response.status).toBe(403);

            case 4:
            case "end":
              return _context51.stop();
          }
        }
      });
    });
    test("Return 403 for expired token", function _callee52() {
      var response;
      return regeneratorRuntime.async(function _callee52$(_context52) {
        while (1) {
          switch (_context52.prev = _context52.next) {
            case 0:
              _context52.next = 2;
              return regeneratorRuntime.awrap(request["delete"]("".concat(endpoint, "/").concat(samples[0]._id)).set("Authorization", "Bearer ".concat(tokens.expiredAdmin)));

            case 2:
              response = _context52.sent;
              expect(response.status).toBe(403);

            case 4:
            case "end":
              return _context52.stop();
          }
        }
      });
    });
    describe("Return 200 and deleted user for successful request", function () {
      test("Customer can delete their account", function _callee53() {
        var token, response;
        return regeneratorRuntime.async(function _callee53$(_context53) {
          while (1) {
            switch (_context53.prev = _context53.next) {
              case 0:
                _context53.next = 2;
                return regeneratorRuntime.awrap(createToken(samples[0]));

              case 2:
                token = _context53.sent;
                _context53.next = 5;
                return regeneratorRuntime.awrap(request["delete"]("".concat(endpoint, "/").concat(samples[0]._id)).set("Authorization", "Bearer ".concat(token)));

              case 5:
                response = _context53.sent;
                expect(response.status).toBe(200);
                expect(response.body.data).toStrictEqual(samples[0]);

              case 8:
              case "end":
                return _context53.stop();
            }
          }
        });
      });
      test("Admin can delete any user account", function _callee54() {
        var response;
        return regeneratorRuntime.async(function _callee54$(_context54) {
          while (1) {
            switch (_context54.prev = _context54.next) {
              case 0:
                _context54.next = 2;
                return regeneratorRuntime.awrap(request["delete"]("".concat(endpoint, "/").concat(samples[1]._id)).set("Authorization", "Bearer ".concat(tokens.admin)));

              case 2:
                response = _context54.sent;
                expect(response.status).toBe(200);
                expect(response.body.data).toStrictEqual(samples[1]);

              case 5:
              case "end":
                return _context54.stop();
            }
          }
        });
      });
    });
  });
  afterAll(function _callee55() {
    return regeneratorRuntime.async(function _callee55$(_context55) {
      while (1) {
        switch (_context55.prev = _context55.next) {
          case 0:
            _context55.next = 2;
            return regeneratorRuntime.awrap(mongoose.connection.db.dropDatabase());

          case 2:
            _context55.next = 4;
            return regeneratorRuntime.awrap(mongoose.connection.close());

          case 4:
          case "end":
            return _context55.stop();
        }
      }
    });
  });
});