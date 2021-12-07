"use strict";

var mongoose = require("mongoose");

var supertest = require("supertest");

var app = require("../../server");

var ProductDao = require("../../server/data/ProductDao");

var _require = require("../../server/util/token"),
    createToken = _require.createToken;

var products = new ProductDao();
var request = supertest(app);
var endpoint = "/api/products";
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
              return regeneratorRuntime.awrap(products.create({
                name: "Eloquent JavaScript",
                price: 20.99
              }));

            case 2:
              samples[0] = _context2.sent;
              _context2.next = 5;
              return regeneratorRuntime.awrap(products.create({
                name: "JavaScript: The Good Parts",
                price: 13.69
              }));

            case 5:
              samples[1] = _context2.sent;

            case 6:
            case "end":
              return _context2.stop();
          }
        }
      });
    });
    test("Return 200 and list of products for successful request", function _callee3() {
      var response;
      return regeneratorRuntime.async(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return regeneratorRuntime.awrap(request.get(endpoint));

            case 2:
              response = _context3.sent;
              expect(response.status).toBe(200);
              expect(response.body.data.length).toBe(samples.length);

            case 5:
            case "end":
              return _context3.stop();
          }
        }
      });
    });
    describe("Test GET ".concat(endpoint, " with query parameter"), function () {
      test("Return 400 for non-numeric price range", function _callee4() {
        var minPrice, maxPrice, response;
        return regeneratorRuntime.async(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                minPrice = "fifteen";
                maxPrice = "eighteen";
                _context4.next = 4;
                return regeneratorRuntime.awrap(request.get("".concat(endpoint, "?minPrice=").concat(minPrice, "&maxPrice=").concat(maxPrice)));

              case 4:
                response = _context4.sent;
                expect(response.status).toBe(400);

              case 6:
              case "end":
                return _context4.stop();
            }
          }
        });
      });
      test("Return 200 and list of products matching a given query name", function _callee5() {
        var query, response, expected;
        return regeneratorRuntime.async(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                query = "The";
                _context5.next = 3;
                return regeneratorRuntime.awrap(request.get("".concat(endpoint, "?query=").concat(query)));

              case 3:
                response = _context5.sent;
                expected = samples.filter(function (s) {
                  return s.name.includes(query);
                }).length;
                expect(response.status).toBe(200);
                expect(response.body.data.length).toBe(expected);

              case 7:
              case "end":
                return _context5.stop();
            }
          }
        });
      });
      test("Return 200 and empty list for query name with no match", function _callee6() {
        var query, response, expected;
        return regeneratorRuntime.async(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                query = "non-existing-phrase";
                _context6.next = 3;
                return regeneratorRuntime.awrap(request.get("".concat(endpoint, "?query=").concat(query)));

              case 3:
                response = _context6.sent;
                expected = samples.filter(function (s) {
                  return s.name.includes(query);
                }).length;
                expect(response.status).toBe(200);
                expect(response.body.data.length).toBe(expected);

              case 7:
              case "end":
                return _context6.stop();
            }
          }
        });
      });
      test("Return 200 and list of products matching a given price range", function _callee7() {
        var minPrice, response, expected;
        return regeneratorRuntime.async(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                minPrice = 15;
                _context7.next = 3;
                return regeneratorRuntime.awrap(request.get("".concat(endpoint, "?minPrice=").concat(minPrice)));

              case 3:
                response = _context7.sent;
                expected = samples.filter(function (s) {
                  return s.price >= minPrice;
                }).length;
                expect(response.status).toBe(200);
                expect(response.body.data.length).toBe(expected);

              case 7:
              case "end":
                return _context7.stop();
            }
          }
        });
      });
      test("Return 200 and empty list of a given price range with no match", function _callee8() {
        var minPrice, maxPrice, response, expected;
        return regeneratorRuntime.async(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                minPrice = 15;
                maxPrice = 18;
                _context8.next = 4;
                return regeneratorRuntime.awrap(request.get("".concat(endpoint, "?minPrice=").concat(minPrice, "&maxPrice=").concat(maxPrice)));

              case 4:
                response = _context8.sent;
                expected = samples.filter(function (s) {
                  return s.price >= minPrice && s.price <= maxPrice;
                }).length;
                expect(response.status).toBe(200);
                expect(response.body.data.length).toBe(expected);

              case 8:
              case "end":
                return _context8.stop();
            }
          }
        });
      });
    });
    afterAll(function _callee9() {
      var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, sample;

      return regeneratorRuntime.async(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              _iteratorNormalCompletion = true;
              _didIteratorError = false;
              _iteratorError = undefined;
              _context9.prev = 3;
              _iterator = samples[Symbol.iterator]();

            case 5:
              if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                _context9.next = 12;
                break;
              }

              sample = _step.value;
              _context9.next = 9;
              return regeneratorRuntime.awrap(products["delete"](sample._id));

            case 9:
              _iteratorNormalCompletion = true;
              _context9.next = 5;
              break;

            case 12:
              _context9.next = 18;
              break;

            case 14:
              _context9.prev = 14;
              _context9.t0 = _context9["catch"](3);
              _didIteratorError = true;
              _iteratorError = _context9.t0;

            case 18:
              _context9.prev = 18;
              _context9.prev = 19;

              if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                _iterator["return"]();
              }

            case 21:
              _context9.prev = 21;

              if (!_didIteratorError) {
                _context9.next = 24;
                break;
              }

              throw _iteratorError;

            case 24:
              return _context9.finish(21);

            case 25:
              return _context9.finish(18);

            case 26:
            case "end":
              return _context9.stop();
          }
        }
      }, null, null, [[3, 14, 18, 26], [19,, 21, 25]]);
    });
  });
  describe("Test GET ".concat(endpoint, "/:id"), function () {
    var product;
    beforeAll(function _callee10() {
      return regeneratorRuntime.async(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              _context10.next = 2;
              return regeneratorRuntime.awrap(products.create({
                name: "JavaScript: The Definitive Guide",
                price: 50.69
              }));

            case 2:
              product = _context10.sent;

            case 3:
            case "end":
              return _context10.stop();
          }
        }
      });
    });
    test("Return 404 for an invalid id", function _callee11() {
      var id, response;
      return regeneratorRuntime.async(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              id = mongoose.Types.ObjectId().toString();
              _context11.next = 3;
              return regeneratorRuntime.awrap(request.get("".concat(endpoint, "/").concat(id)));

            case 3:
              response = _context11.sent;
              expect(response.status).toBe(404);

            case 5:
            case "end":
              return _context11.stop();
          }
        }
      });
    });
    test("Return 200 and the product for a given id", function _callee12() {
      var id, response;
      return regeneratorRuntime.async(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              id = product._id;
              _context12.next = 3;
              return regeneratorRuntime.awrap(request.get("".concat(endpoint, "/").concat(id)));

            case 3:
              response = _context12.sent;
              expect(response.status).toBe(200);
              expect(response.body.data).toStrictEqual(product);

            case 6:
            case "end":
              return _context12.stop();
          }
        }
      });
    });
    afterAll(function _callee13() {
      return regeneratorRuntime.async(function _callee13$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              _context13.next = 2;
              return regeneratorRuntime.awrap(products["delete"](product._id));

            case 2:
            case "end":
              return _context13.stop();
          }
        }
      });
    });
  });
  describe("Test POST ".concat(endpoint), function () {
    var product = {
      name: "Designing Web APIs: Building APIs That Developers Love",
      price: 21.99
    };
    test("Return 403 for missing token", function _callee14() {
      var response;
      return regeneratorRuntime.async(function _callee14$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              _context14.next = 2;
              return regeneratorRuntime.awrap(request.post(endpoint).send(product));

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
    test("Return 403 for invalid token", function _callee15() {
      var response;
      return regeneratorRuntime.async(function _callee15$(_context15) {
        while (1) {
          switch (_context15.prev = _context15.next) {
            case 0:
              _context15.next = 2;
              return regeneratorRuntime.awrap(request.post(endpoint).send(product).set("Authorization", "Bearer ".concat(tokens.invalid)));

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
    test("Return 403 for unauthorized token", function _callee16() {
      var response;
      return regeneratorRuntime.async(function _callee16$(_context16) {
        while (1) {
          switch (_context16.prev = _context16.next) {
            case 0:
              _context16.next = 2;
              return regeneratorRuntime.awrap(request.post(endpoint).send(product).set("Authorization", "Bearer ".concat(tokens.customer)));

            case 2:
              response = _context16.sent;
              expect(response.status).toBe(403);

            case 4:
            case "end":
              return _context16.stop();
          }
        }
      });
    });
    test("Return 403 for expired token", function _callee17() {
      var response;
      return regeneratorRuntime.async(function _callee17$(_context17) {
        while (1) {
          switch (_context17.prev = _context17.next) {
            case 0:
              _context17.next = 2;
              return regeneratorRuntime.awrap(request.post(endpoint).send(product).set("Authorization", "Bearer ".concat(tokens.expiredAdmin)));

            case 2:
              response = _context17.sent;
              expect(response.status).toBe(403);

            case 4:
            case "end":
              return _context17.stop();
          }
        }
      });
    });
    test("Return 400 for missing name", function _callee18() {
      var response;
      return regeneratorRuntime.async(function _callee18$(_context18) {
        while (1) {
          switch (_context18.prev = _context18.next) {
            case 0:
              _context18.next = 2;
              return regeneratorRuntime.awrap(request.post(endpoint).send({
                price: product.price
              }).set("Authorization", "Bearer ".concat(tokens.admin)));

            case 2:
              response = _context18.sent;
              expect(response.status).toBe(400);

            case 4:
            case "end":
              return _context18.stop();
          }
        }
      });
    });
    test("Return 400 for missing price", function _callee19() {
      var response;
      return regeneratorRuntime.async(function _callee19$(_context19) {
        while (1) {
          switch (_context19.prev = _context19.next) {
            case 0:
              _context19.next = 2;
              return regeneratorRuntime.awrap(request.post(endpoint).send({
                name: product.name
              }).set("Authorization", "Bearer ".concat(tokens.admin)));

            case 2:
              response = _context19.sent;
              expect(response.status).toBe(400);

            case 4:
            case "end":
              return _context19.stop();
          }
        }
      });
    });
    test("Return 201 and the product for successful request", function _callee20() {
      var response;
      return regeneratorRuntime.async(function _callee20$(_context20) {
        while (1) {
          switch (_context20.prev = _context20.next) {
            case 0:
              _context20.next = 2;
              return regeneratorRuntime.awrap(request.post(endpoint).send(product).set("Authorization", "Bearer ".concat(tokens.admin)));

            case 2:
              response = _context20.sent;
              expect(response.status).toBe(201);
              expect(response.body.data.name).toBe(product.name);
              expect(response.body.data.price).toBe(product.price);
              product._id = response.body.data._id;

            case 7:
            case "end":
              return _context20.stop();
          }
        }
      });
    });
    afterAll(function _callee21() {
      return regeneratorRuntime.async(function _callee21$(_context21) {
        while (1) {
          switch (_context21.prev = _context21.next) {
            case 0:
              _context21.next = 2;
              return regeneratorRuntime.awrap(products["delete"](product._id));

            case 2:
            case "end":
              return _context21.stop();
          }
        }
      });
    });
  });
  describe("Test PUT ".concat(endpoint, "/:id"), function () {
    var product;
    beforeAll(function _callee22() {
      return regeneratorRuntime.async(function _callee22$(_context22) {
        while (1) {
          switch (_context22.prev = _context22.next) {
            case 0:
              _context22.next = 2;
              return regeneratorRuntime.awrap(products.create({
                name: "Secrets of the JavaScript Ninja",
                price: 42.74
              }));

            case 2:
              product = _context22.sent;

            case 3:
            case "end":
              return _context22.stop();
          }
        }
      });
    });
    test("Return 404 for invalid ID", function _callee23() {
      var response;
      return regeneratorRuntime.async(function _callee23$(_context23) {
        while (1) {
          switch (_context23.prev = _context23.next) {
            case 0:
              _context23.next = 2;
              return regeneratorRuntime.awrap(request.put("".concat(endpoint, "/").concat(mongoose.Types.ObjectId().toString())).send({
                name: "".concat(product.name, " 2nd Edition")
              }).set("Authorization", "Bearer ".concat(tokens.admin)));

            case 2:
              response = _context23.sent;
              expect(response.status).toBe(404);

            case 4:
            case "end":
              return _context23.stop();
          }
        }
      });
    });
    test("Return 403 for missing token", function _callee24() {
      var response;
      return regeneratorRuntime.async(function _callee24$(_context24) {
        while (1) {
          switch (_context24.prev = _context24.next) {
            case 0:
              _context24.next = 2;
              return regeneratorRuntime.awrap(request.put("".concat(endpoint, "/").concat(product._id)).send({
                name: "".concat(product.name, " 2nd Edition")
              }));

            case 2:
              response = _context24.sent;
              expect(response.status).toBe(403);

            case 4:
            case "end":
              return _context24.stop();
          }
        }
      });
    });
    test("Return 403 for invalid token", function _callee25() {
      var response;
      return regeneratorRuntime.async(function _callee25$(_context25) {
        while (1) {
          switch (_context25.prev = _context25.next) {
            case 0:
              _context25.next = 2;
              return regeneratorRuntime.awrap(request.put("".concat(endpoint, "/").concat(product._id)).send({
                name: "".concat(product.name, " 2nd Edition")
              }).set("Authorization", "Bearer ".concat(tokens.invalid)));

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
    test("Return 403 for unauthorized token", function _callee26() {
      var response;
      return regeneratorRuntime.async(function _callee26$(_context26) {
        while (1) {
          switch (_context26.prev = _context26.next) {
            case 0:
              _context26.next = 2;
              return regeneratorRuntime.awrap(request.put("".concat(endpoint, "/").concat(product._id)).send({
                name: "".concat(product.name, " 2nd Edition")
              }).set("Authorization", "Bearer ".concat(tokens.customer)));

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
    test("Return 403 for expired token", function _callee27() {
      var response;
      return regeneratorRuntime.async(function _callee27$(_context27) {
        while (1) {
          switch (_context27.prev = _context27.next) {
            case 0:
              _context27.next = 2;
              return regeneratorRuntime.awrap(request.put("".concat(endpoint, "/").concat(product._id)).send({
                name: "".concat(product.name, " 2nd Edition")
              }).set("Authorization", "Bearer ".concat(tokens.expiredAdmin)));

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
    test("Return 400 for missing payload", function _callee28() {
      var response;
      return regeneratorRuntime.async(function _callee28$(_context28) {
        while (1) {
          switch (_context28.prev = _context28.next) {
            case 0:
              _context28.next = 2;
              return regeneratorRuntime.awrap(request.put("".concat(endpoint, "/").concat(product._id)).set("Authorization", "Bearer ".concat(tokens.admin)));

            case 2:
              response = _context28.sent;
              expect(response.status).toBe(400);

            case 4:
            case "end":
              return _context28.stop();
          }
        }
      });
    });
    test("Return 200 and updated product for successful request", function _callee29() {
      var response;
      return regeneratorRuntime.async(function _callee29$(_context29) {
        while (1) {
          switch (_context29.prev = _context29.next) {
            case 0:
              _context29.next = 2;
              return regeneratorRuntime.awrap(request.put("".concat(endpoint, "/").concat(product._id)).send({
                name: "".concat(product.name, " 2nd Edition")
              }).set("Authorization", "Bearer ".concat(tokens.admin)));

            case 2:
              response = _context29.sent;
              expect(response.status).toBe(200);
              expect(response.body.data.name).toBe("".concat(product.name, " 2nd Edition"));

            case 5:
            case "end":
              return _context29.stop();
          }
        }
      });
    });
    afterAll(function _callee30() {
      return regeneratorRuntime.async(function _callee30$(_context30) {
        while (1) {
          switch (_context30.prev = _context30.next) {
            case 0:
              _context30.next = 2;
              return regeneratorRuntime.awrap(products["delete"](product._id));

            case 2:
            case "end":
              return _context30.stop();
          }
        }
      });
    });
  });
  describe("Test DELETE ".concat(endpoint, "/:id"), function () {
    var product;
    beforeAll(function _callee31() {
      return regeneratorRuntime.async(function _callee31$(_context31) {
        while (1) {
          switch (_context31.prev = _context31.next) {
            case 0:
              _context31.next = 2;
              return regeneratorRuntime.awrap(products.create({
                name: "Testing JavaScript Applications",
                price: 47.99
              }));

            case 2:
              product = _context31.sent;

            case 3:
            case "end":
              return _context31.stop();
          }
        }
      });
    });
    test("Return 404 for invalid ID", function _callee32() {
      var response;
      return regeneratorRuntime.async(function _callee32$(_context32) {
        while (1) {
          switch (_context32.prev = _context32.next) {
            case 0:
              _context32.next = 2;
              return regeneratorRuntime.awrap(request["delete"]("".concat(endpoint, "/").concat(mongoose.Types.ObjectId().toString())).set("Authorization", "Bearer ".concat(tokens.admin)));

            case 2:
              response = _context32.sent;
              expect(response.status).toBe(404);

            case 4:
            case "end":
              return _context32.stop();
          }
        }
      });
    });
    test("Return 403 for missing token", function _callee33() {
      var response;
      return regeneratorRuntime.async(function _callee33$(_context33) {
        while (1) {
          switch (_context33.prev = _context33.next) {
            case 0:
              _context33.next = 2;
              return regeneratorRuntime.awrap(request["delete"]("".concat(endpoint, "/").concat(product._id)));

            case 2:
              response = _context33.sent;
              expect(response.status).toBe(403);

            case 4:
            case "end":
              return _context33.stop();
          }
        }
      });
    });
    test("Return 403 for invalid token", function _callee34() {
      var response;
      return regeneratorRuntime.async(function _callee34$(_context34) {
        while (1) {
          switch (_context34.prev = _context34.next) {
            case 0:
              _context34.next = 2;
              return regeneratorRuntime.awrap(request["delete"]("".concat(endpoint, "/").concat(product._id)).set("Authorization", "Bearer ".concat(tokens.invalid)));

            case 2:
              response = _context34.sent;
              expect(response.status).toBe(403);

            case 4:
            case "end":
              return _context34.stop();
          }
        }
      });
    });
    test("Return 403 for unauthorized token", function _callee35() {
      var response;
      return regeneratorRuntime.async(function _callee35$(_context35) {
        while (1) {
          switch (_context35.prev = _context35.next) {
            case 0:
              _context35.next = 2;
              return regeneratorRuntime.awrap(request["delete"]("".concat(endpoint, "/").concat(product._id)).set("Authorization", "Bearer ".concat(tokens.customer)));

            case 2:
              response = _context35.sent;
              expect(response.status).toBe(403);

            case 4:
            case "end":
              return _context35.stop();
          }
        }
      });
    });
    test("Return 403 for expired token", function _callee36() {
      var response;
      return regeneratorRuntime.async(function _callee36$(_context36) {
        while (1) {
          switch (_context36.prev = _context36.next) {
            case 0:
              _context36.next = 2;
              return regeneratorRuntime.awrap(request["delete"]("".concat(endpoint, "/").concat(product._id)).set("Authorization", "Bearer ".concat(tokens.expiredAdmin)));

            case 2:
              response = _context36.sent;
              expect(response.status).toBe(403);

            case 4:
            case "end":
              return _context36.stop();
          }
        }
      });
    });
    test("Return 200 & deleted product for successful request", function _callee37() {
      var response;
      return regeneratorRuntime.async(function _callee37$(_context37) {
        while (1) {
          switch (_context37.prev = _context37.next) {
            case 0:
              _context37.next = 2;
              return regeneratorRuntime.awrap(request["delete"]("".concat(endpoint, "/").concat(product._id)).set("Authorization", "Bearer ".concat(tokens.admin)));

            case 2:
              response = _context37.sent;
              expect(response.status).toBe(200);
              expect(response.body.data).toStrictEqual(product);

            case 5:
            case "end":
              return _context37.stop();
          }
        }
      });
    });
  });
  afterAll(function _callee38() {
    return regeneratorRuntime.async(function _callee38$(_context38) {
      while (1) {
        switch (_context38.prev = _context38.next) {
          case 0:
            _context38.next = 2;
            return regeneratorRuntime.awrap(mongoose.connection.db.dropDatabase());

          case 2:
            _context38.next = 4;
            return regeneratorRuntime.awrap(mongoose.connection.close());

          case 4:
          case "end":
            return _context38.stop();
        }
      }
    });
  });
});