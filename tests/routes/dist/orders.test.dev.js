"use strict";

var faker = require("faker");

var mongoose = require("mongoose");

var supertest = require("supertest");

var app = require("../../server");

var _require = require("../../server/util/token"),
    createToken = _require.createToken;

var UserDao = require("../../server/data/UserDao");

var OrderDao = require("../../server/data/OrderDao");

var ProductDao = require("../../server/data/ProductDao");

var Order = require("../../server/model/Order");

var users = new UserDao();
var order = new OrderDao();
var products = new ProductDao();
var request = supertest(app);
var endpoint = "/api/orders";

function create_product_object(product, quantity) {
  return {
    product: product._id,
    quantity: quantity
  };
}

describe("Test ".concat(endpoint, " endpoints"), function () {
  // You may want to declare variables here
  var tokens = {};
  var sample_users = [];
  var sample_products = [];
  var sample_orders = [];
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
              username: faker.internet.userName(),
              password: faker.internet.password(),
              role: "ADMIN"
            }));

          case 4:
            sample_users[0] = _context.sent;
            _context.next = 7;
            return regeneratorRuntime.awrap(users.create({
              username: faker.internet.userName(),
              password: faker.internet.password(),
              role: "CUSTOMER"
            }));

          case 7:
            sample_users[1] = _context.sent;
            _context.next = 10;
            return regeneratorRuntime.awrap(users.create({
              username: faker.internet.userName(),
              password: faker.internet.password(),
              role: "CUSTOMER"
            }));

          case 10:
            sample_users[2] = _context.sent;
            _context.next = 13;
            return regeneratorRuntime.awrap(users.create({
              username: faker.internet.userName(),
              password: faker.internet.password(),
              role: "CUSTOMER"
            }));

          case 13:
            sample_users[3] = _context.sent;
            _context.next = 16;
            return regeneratorRuntime.awrap(createToken(sample_users[0]));

          case 16:
            tokens.admin = _context.sent;
            _context.next = 19;
            return regeneratorRuntime.awrap(createToken(sample_users[1]));

          case 19:
            tokens.customer1 = _context.sent;
            _context.next = 22;
            return regeneratorRuntime.awrap(createToken(sample_users[2]));

          case 22:
            tokens.customer2 = _context.sent;
            _context.next = 25;
            return regeneratorRuntime.awrap(createToken(sample_users[3]));

          case 25:
            tokens.customer3 = _context.sent;
            _context.next = 28;
            return regeneratorRuntime.awrap(createToken({}));

          case 28:
            tokens.missingcustomer = _context.sent;
            _context.next = 31;
            return regeneratorRuntime.awrap(createToken({
              _id: new mongoose.Types.ObjectId(),
              username: "I'm not a real customer",
              role: "CUSTOMER"
            }));

          case 31:
            tokens.nonexistentcustomer = _context.sent;
            tokens.invalid = tokens.admin.split("").sort(function () {
              return 0.5 - Math.random();
            }).join("");
            _context.next = 35;
            return regeneratorRuntime.awrap(createToken({
              role: "ADMIN"
            }, -1));

          case 35:
            tokens.expiredAdmin = _context.sent;
            _context.next = 38;
            return regeneratorRuntime.awrap(products.create({
              name: "Eloquent JavaScript",
              price: 20.99
            }));

          case 38:
            sample_products[0] = _context.sent;
            _context.next = 41;
            return regeneratorRuntime.awrap(products.create({
              name: "JavaScript: The Good Parts",
              price: 13.69
            }));

          case 41:
            sample_products[1] = _context.sent;
            _context.next = 44;
            return regeneratorRuntime.awrap(products.create({
              name: "Peter Thiel: Zero to One",
              price: 0.99
            }));

          case 44:
            sample_products[2] = _context.sent;
            _context.next = 47;
            return regeneratorRuntime.awrap(products.create({
              name: "Elon Musk: Why Tesla Rockzzz",
              price: 99.99
            }));

          case 47:
            sample_products[3] = _context.sent;
            _context.next = 50;
            return regeneratorRuntime.awrap(order.create({
              customer: sample_users[1]._id,
              products: [create_product_object(sample_products[0], 2), create_product_object(sample_products[1], 1), create_product_object(sample_products[2], 1)]
            }));

          case 50:
            sample_orders[0] = _context.sent;
            _context.next = 53;
            return regeneratorRuntime.awrap(order.create({
              customer: sample_users[1]._id,
              products: [create_product_object(sample_products[3], 1)]
            }));

          case 53:
            sample_orders[1] = _context.sent;
            _context.next = 56;
            return regeneratorRuntime.awrap(order.create({
              customer: sample_users[2]._id,
              products: [create_product_object(sample_products[0], 1)]
            }));

          case 56:
            sample_orders[2] = _context.sent;
            _context.next = 59;
            return regeneratorRuntime.awrap(order.create({
              customer: sample_users[2]._id,
              products: [create_product_object(sample_products[1], 1)]
            }));

          case 59:
            sample_orders[3] = _context.sent;
            _context.next = 62;
            return regeneratorRuntime.awrap(order.update(sample_orders[1]._id, sample_users[1]._id, {
              status: "COMPLETE"
            }));

          case 62:
            sample_orders[1] = _context.sent;

          case 63:
          case "end":
            return _context.stop();
        }
      }
    });
  });
  describe("Test GET ".concat(endpoint), function () {
    test("Return 403 for missing token", function _callee2() {
      var response;
      return regeneratorRuntime.async(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return regeneratorRuntime.awrap(request.get(endpoint));

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
    test("Return 403 for invalid token", function _callee3() {
      var response;
      return regeneratorRuntime.async(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return regeneratorRuntime.awrap(request.get(endpoint).set("authorization", "Bearer ".concat(tokens.invalid)));

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
    test("Return 403 for unauthorized token", function _callee4() {
      var response;
      return regeneratorRuntime.async(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return regeneratorRuntime.awrap(request.get(endpoint).set("authorization", "Bearer ".concat(tokens.customer1)));

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
    test("Return 403 for expired token", function _callee5() {
      var response;
      return regeneratorRuntime.async(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return regeneratorRuntime.awrap(request.get(endpoint).set("authorization", "Bearer ".concat(tokens.expiredAdmin)));

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
    describe("Return 200 and list of orders for successful request", function () {
      test("Admin can see any order", function _callee6() {
        var response;
        return regeneratorRuntime.async(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return regeneratorRuntime.awrap(request.get(endpoint).set("authorization", "Bearer ".concat(tokens.admin)));

              case 2:
                response = _context6.sent;
                expect(response.status).toBe(200);
                expect(response.body.data.length).toBe(sample_orders.length);

              case 5:
              case "end":
                return _context6.stop();
            }
          }
        });
      });
    });
    describe("Test GET ".concat(endpoint, " with query parameter"), function () {
      describe("Admin can see any order", function () {
        test("Return 200 and the order for a given customer", function _callee7() {
          var cust_id, response;
          return regeneratorRuntime.async(function _callee7$(_context7) {
            while (1) {
              switch (_context7.prev = _context7.next) {
                case 0:
                  cust_id = sample_users[1]._id;
                  _context7.next = 3;
                  return regeneratorRuntime.awrap(request.get("".concat(endpoint, "?customer=").concat(cust_id)).set("authorization", "Bearer ".concat(tokens.admin)));

                case 3:
                  response = _context7.sent;
                  expect(response.status).toBe(200); //first customer made 2 separate orders in "BeforeAll"

                  expect(response.body.data.length).toBe(2);

                case 6:
                case "end":
                  return _context7.stop();
              }
            }
          });
        });
        test("Return 200 and the orders with status of ACTIVE", function _callee8() {
          var cust_id, status, response;
          return regeneratorRuntime.async(function _callee8$(_context8) {
            while (1) {
              switch (_context8.prev = _context8.next) {
                case 0:
                  // sample_users[1] has one active order and one complete order
                  cust_id = sample_users[1]._id;
                  status = "ACTIVE";
                  _context8.next = 4;
                  return regeneratorRuntime.awrap(request.get("".concat(endpoint, "?customer=").concat(cust_id, "&status=").concat(status)).set("authorization", "Bearer ".concat(tokens.admin)));

                case 4:
                  response = _context8.sent;
                  expect(response.status).toBe(200);
                  expect(response.body.data.length).toBe(1);

                case 7:
                case "end":
                  return _context8.stop();
              }
            }
          });
        });
        test("Return 200 and the orders with status of COMPLETE", function _callee9() {
          var cust_id, status, response;
          return regeneratorRuntime.async(function _callee9$(_context9) {
            while (1) {
              switch (_context9.prev = _context9.next) {
                case 0:
                  // sample_users[1] has one active order and one complete order
                  cust_id = sample_users[1]._id;
                  status = "COMPLETE";
                  _context9.next = 4;
                  return regeneratorRuntime.awrap(request.get("".concat(endpoint, "?customer=").concat(cust_id, "&status=").concat(status)).set("authorization", "Bearer ".concat(tokens.admin)));

                case 4:
                  response = _context9.sent;
                  expect(response.status).toBe(200);
                  expect(response.body.data.length).toBe(1);

                case 7:
                case "end":
                  return _context9.stop();
              }
            }
          });
        });
      });
      describe("Customer can see their order(s)", function () {
        test("Return 200 and the order for a given customer", function _callee10() {
          var cust_id, response;
          return regeneratorRuntime.async(function _callee10$(_context10) {
            while (1) {
              switch (_context10.prev = _context10.next) {
                case 0:
                  cust_id = sample_users[1]._id;
                  _context10.next = 3;
                  return regeneratorRuntime.awrap(request.get("".concat(endpoint, "?customer=").concat(cust_id)).set("authorization", "Bearer ".concat(tokens.customer1)));

                case 3:
                  response = _context10.sent;
                  expect(response.status).toBe(200); //first customer made 2 separate orders in "BeforeAll"

                  expect(response.body.data.length).toBe(2);

                case 6:
                case "end":
                  return _context10.stop();
              }
            }
          });
        });
        test("Return 200 and this customer's orders with status of ACTIVE", function _callee11() {
          var cust_id, status, response;
          return regeneratorRuntime.async(function _callee11$(_context11) {
            while (1) {
              switch (_context11.prev = _context11.next) {
                case 0:
                  // first customer has 1 active order and 1 complete order
                  cust_id = sample_users[1]._id;
                  status = "ACTIVE";
                  _context11.next = 4;
                  return regeneratorRuntime.awrap(request.get("".concat(endpoint, "?customer=").concat(cust_id, "&status=").concat(status)).set("authorization", "Bearer ".concat(tokens.customer1)));

                case 4:
                  response = _context11.sent;
                  expect(response.status).toBe(200);
                  expect(response.body.data.length).toBe(1);

                case 7:
                case "end":
                  return _context11.stop();
              }
            }
          });
        });
        test("Return 200 and this customer's orders with status of COMPLETE", function _callee12() {
          var cust_id, status, response;
          return regeneratorRuntime.async(function _callee12$(_context12) {
            while (1) {
              switch (_context12.prev = _context12.next) {
                case 0:
                  //first customer has 1 active order and 1 complete order
                  cust_id = sample_users[1]._id;
                  status = "COMPLETE";
                  _context12.next = 4;
                  return regeneratorRuntime.awrap(request.get("".concat(endpoint, "?customer=").concat(cust_id, "&status=").concat(status)).set("authorization", "Bearer ".concat(tokens.customer1)));

                case 4:
                  response = _context12.sent;
                  expect(response.status).toBe(200);
                  expect(response.body.data.length).toBe(1);

                case 7:
                case "end":
                  return _context12.stop();
              }
            }
          });
        });
      });
      test("Return 200 and an empty list for orders with invalid customer query", function _callee13() {
        var cust_id, response;
        return regeneratorRuntime.async(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                //customer3 didn't actually order anything, we just use customer3's id to simulate an "invalid" query
                cust_id = sample_users[3]._id;
                _context13.next = 3;
                return regeneratorRuntime.awrap(request.get("".concat(endpoint, "?customer=").concat(cust_id)).set("authorization", "Bearer ".concat(tokens.customer3)));

              case 3:
                response = _context13.sent;
                expect(response.status).toBe(200);
                expect(response.body.data.length).toBe(0);

              case 6:
              case "end":
                return _context13.stop();
            }
          }
        });
      });
      test("Return 200 and an empty list for orders with invalid status query", function _callee14() {
        var cust_id, status, response;
        return regeneratorRuntime.async(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                cust_id = sample_users[1]._id;
                status = "YouMustBeNutzz!";
                _context14.next = 4;
                return regeneratorRuntime.awrap(request.get("".concat(endpoint, "?customer=").concat(cust_id, "&status=").concat(status)).set("authorization", "Bearer ".concat(tokens.customer1)));

              case 4:
                response = _context14.sent;
                expect(response.status).toBe(200);
                expect(response.body.data.length).toBe(0);

              case 7:
              case "end":
                return _context14.stop();
            }
          }
        });
      });
    });
  });
  describe("Test GET ".concat(endpoint, "/:id"), function () {
    test("Return 404 for invalid order ID", function _callee15() {
      var orderID, response;
      return regeneratorRuntime.async(function _callee15$(_context15) {
        while (1) {
          switch (_context15.prev = _context15.next) {
            case 0:
              orderID = "You Must be Nutz!";
              _context15.next = 3;
              return regeneratorRuntime.awrap(request.get("".concat(endpoint, "/").concat(orderID)).set("authorization", "Bearer ".concat(tokens.admin)));

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
      var orderID, response;
      return regeneratorRuntime.async(function _callee16$(_context16) {
        while (1) {
          switch (_context16.prev = _context16.next) {
            case 0:
              orderID = sample_orders[0]._id;
              _context16.next = 3;
              return regeneratorRuntime.awrap(request.get("".concat(endpoint, "/").concat(orderID)));

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
      var orderID, response;
      return regeneratorRuntime.async(function _callee17$(_context17) {
        while (1) {
          switch (_context17.prev = _context17.next) {
            case 0:
              orderID = sample_orders[0]._id;
              _context17.next = 3;
              return regeneratorRuntime.awrap(request.get("".concat(endpoint, "/").concat(orderID)).set("authorization", "Bearer ".concat(tokens.invalid)));

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
      var orderID, response;
      return regeneratorRuntime.async(function _callee18$(_context18) {
        while (1) {
          switch (_context18.prev = _context18.next) {
            case 0:
              // An admin can see any order, however a customer should not be allowed to
              //  see other customers' orders
              // customer 1 ordered sample_orders[0] therefore customer 2 shouldn't have access
              orderID = sample_orders[0]._id;
              _context18.next = 3;
              return regeneratorRuntime.awrap(request.get("".concat(endpoint, "/").concat(orderID)).set("authorization", "Bearer ".concat(tokens.customer2)));

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
      var orderID, response;
      return regeneratorRuntime.async(function _callee19$(_context19) {
        while (1) {
          switch (_context19.prev = _context19.next) {
            case 0:
              orderID = sample_orders[0]._id;
              _context19.next = 3;
              return regeneratorRuntime.awrap(request.get("".concat(endpoint, "/").concat(orderID)).set("authorization", "Bearer ".concat(tokens.expiredAdmin)));

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
    describe("Return 200 and the order for successful request", function () {
      test("Admin can see any order", function _callee20() {
        var orderID, response;
        return regeneratorRuntime.async(function _callee20$(_context20) {
          while (1) {
            switch (_context20.prev = _context20.next) {
              case 0:
                orderID = sample_orders[1]._id;
                _context20.next = 3;
                return regeneratorRuntime.awrap(request.get("".concat(endpoint, "/").concat(orderID)).set("authorization", "Bearer ".concat(tokens.admin)));

              case 3:
                response = _context20.sent;
                expect(response.status).toBe(200);
                expect(response.body.data.total).toBe(99.99);
                expect(response.body.data.status).toBe("COMPLETE");

              case 7:
              case "end":
                return _context20.stop();
            }
          }
        });
      });
      test("Customer can see their order only", function _callee21() {
        var orderID, response;
        return regeneratorRuntime.async(function _callee21$(_context21) {
          while (1) {
            switch (_context21.prev = _context21.next) {
              case 0:
                //customer1 did in fact order sample_orders[1]!
                orderID = sample_orders[1]._id;
                _context21.next = 3;
                return regeneratorRuntime.awrap(request.get("".concat(endpoint, "/").concat(orderID)).set("authorization", "Bearer ".concat(tokens.customer1)));

              case 3:
                response = _context21.sent;
                expect(response.status).toBe(200);
                expect(response.body.data.total).toBe(99.99);
                expect(response.body.data.status).toBe("COMPLETE");

              case 7:
              case "end":
                return _context21.stop();
            }
          }
        });
      });
    });
  });
  describe("Test POST ".concat(endpoint), function () {
    test("Return 403 for missing token", function _callee22() {
      var response;
      return regeneratorRuntime.async(function _callee22$(_context22) {
        while (1) {
          switch (_context22.prev = _context22.next) {
            case 0:
              _context22.next = 2;
              return regeneratorRuntime.awrap(request.post(endpoint));

            case 2:
              response = _context22.sent;
              expect(response.status).toBe(403);

            case 4:
            case "end":
              return _context22.stop();
          }
        }
      });
    });
    test("Return 403 for invalid token", function _callee23() {
      var response;
      return regeneratorRuntime.async(function _callee23$(_context23) {
        while (1) {
          switch (_context23.prev = _context23.next) {
            case 0:
              _context23.next = 2;
              return regeneratorRuntime.awrap(request.post(endpoint).set("authorization", "Bearer ".concat(tokens.invalid)));

            case 2:
              response = _context23.sent;
              expect(response.status).toBe(403);

            case 4:
            case "end":
              return _context23.stop();
          }
        }
      });
    });
    test("Return 403 for expired token", function _callee24() {
      var response;
      return regeneratorRuntime.async(function _callee24$(_context24) {
        while (1) {
          switch (_context24.prev = _context24.next) {
            case 0:
              _context24.next = 2;
              return regeneratorRuntime.awrap(request.post(endpoint).set("authorization", "Bearer ".concat(tokens.expiredAdmin)));

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
    test("Return 400 for missing customer", function _callee25() {
      var response;
      return regeneratorRuntime.async(function _callee25$(_context25) {
        while (1) {
          switch (_context25.prev = _context25.next) {
            case 0:
              _context25.next = 2;
              return regeneratorRuntime.awrap(request.post(endpoint).set("authorization", "Bearer ".concat(tokens.missingcustomer)));

            case 2:
              response = _context25.sent;
              expect(response.status).toBe(400);

            case 4:
            case "end":
              return _context25.stop();
          }
        }
      });
    });
    test("Return 404 for non-existing customer", function _callee26() {
      var response;
      return regeneratorRuntime.async(function _callee26$(_context26) {
        while (1) {
          switch (_context26.prev = _context26.next) {
            case 0:
              _context26.next = 2;
              return regeneratorRuntime.awrap(request.post(endpoint).set("authorization", "Bearer ".concat(tokens.nonexistentcustomer)));

            case 2:
              response = _context26.sent;
              expect(response.status).toBe(404);

            case 4:
            case "end":
              return _context26.stop();
          }
        }
      });
    });
    test("Return 400 for missing payload", function _callee27() {
      var response;
      return regeneratorRuntime.async(function _callee27$(_context27) {
        while (1) {
          switch (_context27.prev = _context27.next) {
            case 0:
              _context27.next = 2;
              return regeneratorRuntime.awrap(request.post(endpoint).set("authorization", "Bearer ".concat(tokens.customer1)));

            case 2:
              response = _context27.sent;
              expect(response.status).toBe(400);

            case 4:
            case "end":
              return _context27.stop();
          }
        }
      });
    });
    test("Return 400 for invalid quantity attribute", function _callee28() {
      var response;
      return regeneratorRuntime.async(function _callee28$(_context28) {
        while (1) {
          switch (_context28.prev = _context28.next) {
            case 0:
              _context28.next = 2;
              return regeneratorRuntime.awrap(request.post(endpoint).send({
                products: [{
                  product: sample_products[0]._id,
                  quantity: -1
                }]
              }).set("authorization", "Bearer ".concat(tokens.customer1)));

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
    test("Return 404 for non-existing product attribute", function _callee29() {
      var response;
      return regeneratorRuntime.async(function _callee29$(_context29) {
        while (1) {
          switch (_context29.prev = _context29.next) {
            case 0:
              _context29.next = 2;
              return regeneratorRuntime.awrap(request.post(endpoint).send({
                products: [{
                  product: new mongoose.Types.ObjectId(),
                  quantity: 1
                }]
              }).set("authorization", "Bearer ".concat(tokens.customer1)));

            case 2:
              response = _context29.sent;
              expect(response.status).toBe(404);

            case 4:
            case "end":
              return _context29.stop();
          }
        }
      });
    });
    test("Return 400 for invalid product attribute", function _callee30() {
      var response;
      return regeneratorRuntime.async(function _callee30$(_context30) {
        while (1) {
          switch (_context30.prev = _context30.next) {
            case 0:
              _context30.next = 2;
              return regeneratorRuntime.awrap(request.post(endpoint).send({
                products: [{
                  product: "I'm not a valid mongoose id obvs",
                  quantity: 1
                }]
              }).set("authorization", "Bearer ".concat(tokens.customer1)));

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
    test("Return 201 and the order for successful request", function _callee31() {
      var response;
      return regeneratorRuntime.async(function _callee31$(_context31) {
        while (1) {
          switch (_context31.prev = _context31.next) {
            case 0:
              _context31.next = 2;
              return regeneratorRuntime.awrap(request.post(endpoint).send({
                products: [{
                  product: sample_products[0]._id,
                  quantity: 1
                }]
              }).set("authorization", "Bearer ".concat(tokens.customer1)));

            case 2:
              response = _context31.sent;
              expect(response.status).toBe(201);
              expect(response.body.data.status).toBe("ACTIVE");
              expect(response.body.data.total).toBe(sample_products[0].price);

            case 6:
            case "end":
              return _context31.stop();
          }
        }
      });
    });
  });
  describe("Test PUT ".concat(endpoint, "/:id"), function () {
    test("Return 404 for invalid order ID", function _callee32() {
      var invalid_id, response;
      return regeneratorRuntime.async(function _callee32$(_context32) {
        while (1) {
          switch (_context32.prev = _context32.next) {
            case 0:
              invalid_id = new mongoose.Types.ObjectId();
              _context32.next = 3;
              return regeneratorRuntime.awrap(request.put("".concat(endpoint, "/").concat(invalid_id)).set("authorization", "Bearer ".concat(tokens.customer1)));

            case 3:
              response = _context32.sent;
              expect(response.status).toBe(404);

            case 5:
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
              return regeneratorRuntime.awrap(request.put("".concat(endpoint, "/").concat(sample_orders[0]._id)));

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
              return regeneratorRuntime.awrap(request.put("".concat(endpoint, "/").concat(sample_orders[0]._id)).set("authorization", "Bearer ".concat(tokens.invalid)));

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
    describe("Return 403 for unauthorized token", function () {
      test("Admins not allowed to update others' orders", function _callee35() {
        var response;
        return regeneratorRuntime.async(function _callee35$(_context35) {
          while (1) {
            switch (_context35.prev = _context35.next) {
              case 0:
                _context35.next = 2;
                return regeneratorRuntime.awrap(request.put("".concat(endpoint, "/").concat(sample_orders[1]._id)).set("authorization", "Bearer ".concat(tokens.admin)));

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
      test("Customers not allowed to update others' orders", function _callee36() {
        var response;
        return regeneratorRuntime.async(function _callee36$(_context36) {
          while (1) {
            switch (_context36.prev = _context36.next) {
              case 0:
                _context36.next = 2;
                return regeneratorRuntime.awrap(request.put("".concat(endpoint, "/").concat(sample_orders[1]._id)).set("authorization", "Bearer ".concat(tokens.customer2)));

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
    });
    test("Return 403 for expired token", function _callee37() {
      var response;
      return regeneratorRuntime.async(function _callee37$(_context37) {
        while (1) {
          switch (_context37.prev = _context37.next) {
            case 0:
              _context37.next = 2;
              return regeneratorRuntime.awrap(request.put("".concat(endpoint, "/").concat(sample_orders[1]._id)).set("authorization", "Bearer ".concat(tokens.expiredAdmin)));

            case 2:
              response = _context37.sent;
              expect(response.status).toBe(403);

            case 4:
            case "end":
              return _context37.stop();
          }
        }
      });
    });
    test("Return 400 for missing payload", function _callee38() {
      var response;
      return regeneratorRuntime.async(function _callee38$(_context38) {
        while (1) {
          switch (_context38.prev = _context38.next) {
            case 0:
              _context38.next = 2;
              return regeneratorRuntime.awrap(request.put("".concat(endpoint, "/").concat(sample_orders[1]._id)).set("authorization", "Bearer ".concat(tokens.customer1)));

            case 2:
              response = _context38.sent;
              expect(response.status).toBe(400);

            case 4:
            case "end":
              return _context38.stop();
          }
        }
      });
    });
    test("Return 400 for invalid status attribute", function _callee39() {
      var response;
      return regeneratorRuntime.async(function _callee39$(_context39) {
        while (1) {
          switch (_context39.prev = _context39.next) {
            case 0:
              _context39.next = 2;
              return regeneratorRuntime.awrap(request.put("".concat(endpoint, "/").concat(sample_orders[1]._id)).set("authorization", "Bearer ".concat(tokens.customer1)).send({
                products: [create_product_object(sample_products[0], 3)],
                status: "DEFINITELY NOT A VALID STATUS"
              }));

            case 2:
              response = _context39.sent;
              expect(response.status).toBe(400);

            case 4:
            case "end":
              return _context39.stop();
          }
        }
      });
    }); //added test

    test("Return 400 for invalid product attribute", function _callee40() {
      var response;
      return regeneratorRuntime.async(function _callee40$(_context40) {
        while (1) {
          switch (_context40.prev = _context40.next) {
            case 0:
              _context40.next = 2;
              return regeneratorRuntime.awrap(request.put("".concat(endpoint, "/").concat(sample_orders[1]._id)).set("authorization", "Bearer ".concat(tokens.customer1)).send({
                products: [create_product_object({
                  _id: "I'm def not valid!"
                }, 3)],
                status: "ACTIVE"
              }));

            case 2:
              response = _context40.sent;
              expect(response.status).toBe(400);

            case 4:
            case "end":
              return _context40.stop();
          }
        }
      });
    });
    test("Return 400 for invalid quantity attribute", function _callee41() {
      var response;
      return regeneratorRuntime.async(function _callee41$(_context41) {
        while (1) {
          switch (_context41.prev = _context41.next) {
            case 0:
              _context41.next = 2;
              return regeneratorRuntime.awrap(request.put("".concat(endpoint, "/").concat(sample_orders[1]._id)).set("authorization", "Bearer ".concat(tokens.customer1)).send({
                products: [create_product_object(sample_products[0], -1)],
                status: "ACTIVE"
              }));

            case 2:
              response = _context41.sent;
              expect(response.status).toBe(400);

            case 4:
            case "end":
              return _context41.stop();
          }
        }
      });
    });
    describe("Return 200 and the updated order for successful request", function () {
      test("Update products, e.g., add/remove or change quantity", function _callee42() {
        var response;
        return regeneratorRuntime.async(function _callee42$(_context42) {
          while (1) {
            switch (_context42.prev = _context42.next) {
              case 0:
                _context42.next = 2;
                return regeneratorRuntime.awrap(request.put("".concat(endpoint, "/").concat(sample_orders[1]._id)).set("authorization", "Bearer ".concat(tokens.customer1)).send({
                  products: [create_product_object(sample_products[0], 3)]
                }));

              case 2:
                response = _context42.sent;
                expect(response.status).toBe(200);
                expect(response.body.data.total).toBe(sample_products[0].price * 3);

              case 5:
              case "end":
                return _context42.stop();
            }
          }
        });
      });
      test("Update status, e.g., from ACTIVE to COMPLETE", function _callee43() {
        var response;
        return regeneratorRuntime.async(function _callee43$(_context43) {
          while (1) {
            switch (_context43.prev = _context43.next) {
              case 0:
                _context43.next = 2;
                return regeneratorRuntime.awrap(request.put("".concat(endpoint, "/").concat(sample_orders[1]._id)).set("authorization", "Bearer ".concat(tokens.customer1)).send({
                  status: "COMPLETE"
                }));

              case 2:
                response = _context43.sent;
                expect(response.status).toBe(200);
                expect(response.body.data.status).toBe("COMPLETE");

              case 5:
              case "end":
                return _context43.stop();
            }
          }
        });
      });
    });
  });
  describe("Test DELETE ".concat(endpoint, "/:id"), function () {
    test("Return 404 for invalid order ID", function _callee44() {
      var invalid_id, response;
      return regeneratorRuntime.async(function _callee44$(_context44) {
        while (1) {
          switch (_context44.prev = _context44.next) {
            case 0:
              invalid_id = new mongoose.Types.ObjectId();
              _context44.next = 3;
              return regeneratorRuntime.awrap(request["delete"]("".concat(endpoint, "/").concat(invalid_id)).set("authorization", "Bearer ".concat(tokens.customer1)));

            case 3:
              response = _context44.sent;
              expect(response.status).toBe(404);

            case 5:
            case "end":
              return _context44.stop();
          }
        }
      });
    });
    test("Return 403 for missing token", function _callee45() {
      var response;
      return regeneratorRuntime.async(function _callee45$(_context45) {
        while (1) {
          switch (_context45.prev = _context45.next) {
            case 0:
              _context45.next = 2;
              return regeneratorRuntime.awrap(request["delete"]("".concat(endpoint, "/").concat(sample_orders[0]._id)));

            case 2:
              response = _context45.sent;
              expect(response.status).toBe(403);

            case 4:
            case "end":
              return _context45.stop();
          }
        }
      });
    });
    test("Return 403 for invalid token", function _callee46() {
      var response;
      return regeneratorRuntime.async(function _callee46$(_context46) {
        while (1) {
          switch (_context46.prev = _context46.next) {
            case 0:
              _context46.next = 2;
              return regeneratorRuntime.awrap(request["delete"]("".concat(endpoint, "/").concat(sample_orders[0]._id)).set("authorization", "Bearer ".concat(tokens.invalidAdmin)));

            case 2:
              response = _context46.sent;
              expect(response.status).toBe(403);

            case 4:
            case "end":
              return _context46.stop();
          }
        }
      });
    });
    describe("Return 403 for unauthorized token", function () {
      test("Admins not allowed to delete others' orders", function _callee47() {
        var response;
        return regeneratorRuntime.async(function _callee47$(_context47) {
          while (1) {
            switch (_context47.prev = _context47.next) {
              case 0:
                _context47.next = 2;
                return regeneratorRuntime.awrap(request["delete"]("".concat(endpoint, "/").concat(sample_orders[1]._id)).set("authorization", "Bearer ".concat(tokens.admin)));

              case 2:
                response = _context47.sent;
                expect(response.status).toBe(403);

              case 4:
              case "end":
                return _context47.stop();
            }
          }
        });
      });
      test("Customers not allowed to delete others' orders", function _callee48() {
        var response;
        return regeneratorRuntime.async(function _callee48$(_context48) {
          while (1) {
            switch (_context48.prev = _context48.next) {
              case 0:
                _context48.next = 2;
                return regeneratorRuntime.awrap(request["delete"]("".concat(endpoint, "/").concat(sample_orders[1]._id)).set("authorization", "Bearer ".concat(tokens.customer2)));

              case 2:
                response = _context48.sent;
                expect(response.status).toBe(403);

              case 4:
              case "end":
                return _context48.stop();
            }
          }
        });
      });
    });
    test("Return 403 for expired token", function _callee49() {
      var response;
      return regeneratorRuntime.async(function _callee49$(_context49) {
        while (1) {
          switch (_context49.prev = _context49.next) {
            case 0:
              _context49.next = 2;
              return regeneratorRuntime.awrap(request["delete"]("".concat(endpoint, "/").concat(sample_orders[1]._id)).set("authorization", "Bearer ".concat(tokens.expiredAdmin)));

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
    test("Return 200 and the deleted order for successful request", function _callee50() {
      var response;
      return regeneratorRuntime.async(function _callee50$(_context50) {
        while (1) {
          switch (_context50.prev = _context50.next) {
            case 0:
              _context50.next = 2;
              return regeneratorRuntime.awrap(request["delete"]("".concat(endpoint, "/").concat(sample_orders[1]._id)).set("authorization", "Bearer ".concat(tokens.customer1)));

            case 2:
              response = _context50.sent;
              expect(response.status).toBe(200);
              expect(response.body.data._id).toBe(sample_orders[1]._id);

            case 5:
            case "end":
              return _context50.stop();
          }
        }
      });
    });
  });
  afterAll(function _callee51() {
    var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, curr_order, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, product, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, sample;

    return regeneratorRuntime.async(function _callee51$(_context51) {
      while (1) {
        switch (_context51.prev = _context51.next) {
          case 0:
            //delete everything in the database and clean up database!
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context51.prev = 3;
            _iterator = sample_orders[Symbol.iterator]();

          case 5:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context51.next = 12;
              break;
            }

            curr_order = _step.value;
            _context51.next = 9;
            return regeneratorRuntime.awrap(Order.findByIdAndDelete(curr_order._id).lean().select("-__v"));

          case 9:
            _iteratorNormalCompletion = true;
            _context51.next = 5;
            break;

          case 12:
            _context51.next = 18;
            break;

          case 14:
            _context51.prev = 14;
            _context51.t0 = _context51["catch"](3);
            _didIteratorError = true;
            _iteratorError = _context51.t0;

          case 18:
            _context51.prev = 18;
            _context51.prev = 19;

            if (!_iteratorNormalCompletion && _iterator["return"] != null) {
              _iterator["return"]();
            }

          case 21:
            _context51.prev = 21;

            if (!_didIteratorError) {
              _context51.next = 24;
              break;
            }

            throw _iteratorError;

          case 24:
            return _context51.finish(21);

          case 25:
            return _context51.finish(18);

          case 26:
            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context51.prev = 29;
            _iterator2 = sample_products[Symbol.iterator]();

          case 31:
            if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
              _context51.next = 38;
              break;
            }

            product = _step2.value;
            _context51.next = 35;
            return regeneratorRuntime.awrap(products["delete"](product._id));

          case 35:
            _iteratorNormalCompletion2 = true;
            _context51.next = 31;
            break;

          case 38:
            _context51.next = 44;
            break;

          case 40:
            _context51.prev = 40;
            _context51.t1 = _context51["catch"](29);
            _didIteratorError2 = true;
            _iteratorError2 = _context51.t1;

          case 44:
            _context51.prev = 44;
            _context51.prev = 45;

            if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
              _iterator2["return"]();
            }

          case 47:
            _context51.prev = 47;

            if (!_didIteratorError2) {
              _context51.next = 50;
              break;
            }

            throw _iteratorError2;

          case 50:
            return _context51.finish(47);

          case 51:
            return _context51.finish(44);

          case 52:
            _iteratorNormalCompletion3 = true;
            _didIteratorError3 = false;
            _iteratorError3 = undefined;
            _context51.prev = 55;
            _iterator3 = sample_users[Symbol.iterator]();

          case 57:
            if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
              _context51.next = 64;
              break;
            }

            sample = _step3.value;
            _context51.next = 61;
            return regeneratorRuntime.awrap(users["delete"](sample._id));

          case 61:
            _iteratorNormalCompletion3 = true;
            _context51.next = 57;
            break;

          case 64:
            _context51.next = 70;
            break;

          case 66:
            _context51.prev = 66;
            _context51.t2 = _context51["catch"](55);
            _didIteratorError3 = true;
            _iteratorError3 = _context51.t2;

          case 70:
            _context51.prev = 70;
            _context51.prev = 71;

            if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
              _iterator3["return"]();
            }

          case 73:
            _context51.prev = 73;

            if (!_didIteratorError3) {
              _context51.next = 76;
              break;
            }

            throw _iteratorError3;

          case 76:
            return _context51.finish(73);

          case 77:
            return _context51.finish(70);

          case 78:
            _context51.next = 80;
            return regeneratorRuntime.awrap(mongoose.connection.db.dropDatabase());

          case 80:
            _context51.next = 82;
            return regeneratorRuntime.awrap(mongoose.connection.close());

          case 82:
          case "end":
            return _context51.stop();
        }
      }
    }, null, null, [[3, 14, 18, 26], [19,, 21, 25], [29, 40, 44, 52], [45,, 47, 51], [55, 66, 70, 78], [71,, 73, 77]]);
  });
}); //close database properly with "afterAll"