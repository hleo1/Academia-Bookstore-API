"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// TODO: Implement the operations of OrderDao.
//  Do not change the signature of any of the operations!
//  You may add helper functions, other variables, etc, as the need arises!
var ProductDao = require("./ProductDao");

var UserDao = require("./UserDao");

var product_dao = new ProductDao();

var Order = require("../model/Order");

var ApiError = require("../model/ApiError");

var mongoose = require("mongoose");

var users = new UserDao();

var OrderDao =
/*#__PURE__*/
function () {
  function OrderDao() {
    _classCallCheck(this, OrderDao);
  }

  _createClass(OrderDao, [{
    key: "order_formatter",
    value: function order_formatter(order) {
      //format the products (_id and product are returned as ObjectId)
      var new_products = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = order.products[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var product = _step.value;
          new_products.push({
            _id: product._id.toString(),
            product: product.product.toString(),
            quantity: product.quantity
          });
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return {
        _id: order._id.toString(),
        customer: order.customer.toString(),
        products: new_products,
        total: order.total,
        status: order.status
      };
    } // When an order is created, it is in "active" state

  }, {
    key: "create",
    value: function create(_ref) {
      var customer, products, total, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, product, product_info, order;

      return regeneratorRuntime.async(function create$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              customer = _ref.customer, products = _ref.products;

              if (!(customer === undefined || customer === "")) {
                _context.next = 3;
                break;
              }

              throw new ApiError(400, "Every order must have a customer name!");

            case 3:
              _context.next = 5;
              return regeneratorRuntime.awrap(users.read(customer));

            case 5:
              if (!(!Array.isArray(products) || products.length === 0)) {
                _context.next = 7;
                break;
              }

              throw new ApiError(400, "Every order must have a list of products!");

            case 7:
              total = 0;
              _iteratorNormalCompletion2 = true;
              _didIteratorError2 = false;
              _iteratorError2 = undefined;
              _context.prev = 11;
              _iterator2 = products[Symbol.iterator]();

            case 13:
              if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                _context.next = 26;
                break;
              }

              product = _step2.value;

              if (!(isNaN(product.quantity) || product.quantity <= 0)) {
                _context.next = 17;
                break;
              }

              throw new ApiError(400, "Product has invalid quantity!");

            case 17:
              if (mongoose.isValidObjectId(product.product)) {
                _context.next = 19;
                break;
              }

              throw new ApiError(400, "Invalid product ID!");

            case 19:
              _context.next = 21;
              return regeneratorRuntime.awrap(product_dao.read(product.product));

            case 21:
              product_info = _context.sent;
              //will throw a 404 not found if product.product is not even in the database!
              total += product.quantity * product_info.price;

            case 23:
              _iteratorNormalCompletion2 = true;
              _context.next = 13;
              break;

            case 26:
              _context.next = 32;
              break;

            case 28:
              _context.prev = 28;
              _context.t0 = _context["catch"](11);
              _didIteratorError2 = true;
              _iteratorError2 = _context.t0;

            case 32:
              _context.prev = 32;
              _context.prev = 33;

              if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
                _iterator2["return"]();
              }

            case 35:
              _context.prev = 35;

              if (!_didIteratorError2) {
                _context.next = 38;
                break;
              }

              throw _iteratorError2;

            case 38:
              return _context.finish(35);

            case 39:
              return _context.finish(32);

            case 40:
              _context.next = 42;
              return regeneratorRuntime.awrap(Order.create({
                customer: customer,
                products: products,
                total: total,
                status: "ACTIVE"
              }));

            case 42:
              order = _context.sent;
              return _context.abrupt("return", this.order_formatter(order));

            case 44:
            case "end":
              return _context.stop();
          }
        }
      }, null, this, [[11, 28, 32, 40], [33,, 35, 39]]);
    }
  }, {
    key: "read",
    value: function read(id, customer_id, role) {
      var order;
      return regeneratorRuntime.async(function read$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (mongoose.isValidObjectId(id)) {
                _context2.next = 2;
                break;
              }

              throw new ApiError(404, "invalid id");

            case 2:
              _context2.next = 4;
              return regeneratorRuntime.awrap(Order.findById(id).lean().select("-__v"));

            case 4:
              order = _context2.sent;

              if (!(order === null)) {
                _context2.next = 7;
                break;
              }

              throw new ApiError(404, "There is no order found of that fits that ID!");

            case 7:
              if (!(role === "ADMIN" || order.customer.toString() === customer_id)) {
                _context2.next = 11;
                break;
              }

              return _context2.abrupt("return", [this.order_formatter(order)]);

            case 11:
              throw new ApiError(403, "Unauthorized to perform this action!");

            case 12:
            case "end":
              return _context2.stop();
          }
        }
      }, null, this);
    } // Pre: The requester is an ADMIN or is the customer!
    //  The route handler must verify this!

  }, {
    key: "readAll",
    value: function readAll(_ref2) {
      var customer, status, filter, orders, results, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, order;

      return regeneratorRuntime.async(function readAll$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              customer = _ref2.customer, status = _ref2.status;
              // Hint:
              //  The customer and status parameters are filters.
              //  For example, one may search for all "ACTIVE" orders for the given customer.
              filter = {};

              if (customer) {
                filter.customer = customer;
              }

              if (status) {
                filter.status = status;
              }

              _context3.next = 6;
              return regeneratorRuntime.awrap(Order.find(filter).lean().select("-__v"));

            case 6:
              orders = _context3.sent;
              results = [];
              _iteratorNormalCompletion3 = true;
              _didIteratorError3 = false;
              _iteratorError3 = undefined;
              _context3.prev = 11;

              for (_iterator3 = orders[Symbol.iterator](); !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                order = _step3.value;
                results.push(this.order_formatter(order));
              }

              _context3.next = 19;
              break;

            case 15:
              _context3.prev = 15;
              _context3.t0 = _context3["catch"](11);
              _didIteratorError3 = true;
              _iteratorError3 = _context3.t0;

            case 19:
              _context3.prev = 19;
              _context3.prev = 20;

              if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
                _iterator3["return"]();
              }

            case 22:
              _context3.prev = 22;

              if (!_didIteratorError3) {
                _context3.next = 25;
                break;
              }

              throw _iteratorError3;

            case 25:
              return _context3.finish(22);

            case 26:
              return _context3.finish(19);

            case 27:
              return _context3.abrupt("return", results);

            case 28:
            case "end":
              return _context3.stop();
          }
        }
      }, null, this, [[11, 15, 19, 27], [20,, 22, 26]]);
    }
  }, {
    key: "delete",
    value: function _delete(id, customer) {
      var order;
      return regeneratorRuntime.async(function _delete$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return regeneratorRuntime.awrap(this.read(id, customer, "CUSTOMER"));

            case 2:
              _context4.next = 4;
              return regeneratorRuntime.awrap(Order.findByIdAndDelete(id).lean().select("-__v"));

            case 4:
              order = _context4.sent;
              return _context4.abrupt("return", [this.order_formatter(order)]);

            case 6:
            case "end":
              return _context4.stop();
          }
        }
      }, null, this);
    } // One can update the list of products or the status of an order

  }, {
    key: "update",
    value: function update(id, customer, _ref3) {
      var products, status, attributes, total, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, product, product_info, new_order;

      return regeneratorRuntime.async(function update$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              products = _ref3.products, status = _ref3.status;
              _context5.next = 3;
              return regeneratorRuntime.awrap(this.read(id, customer, "CUSTOMER"));

            case 3:
              if (!(!products && !status)) {
                _context5.next = 5;
                break;
              }

              throw new ApiError(400, "Enter product/status as part of payload!");

            case 5:
              attributes = {};

              if (!products) {
                _context5.next = 42;
                break;
              }

              total = 0;
              attributes.products = products; //calculate new total

              _iteratorNormalCompletion4 = true;
              _didIteratorError4 = false;
              _iteratorError4 = undefined;
              _context5.prev = 12;
              _iterator4 = products[Symbol.iterator]();

            case 14:
              if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
                _context5.next = 27;
                break;
              }

              product = _step4.value;

              if (!(isNaN(product.quantity) || product.quantity <= 0)) {
                _context5.next = 18;
                break;
              }

              throw new ApiError(400, "Product has invalid quantity!");

            case 18:
              if (mongoose.isValidObjectId(product.product)) {
                _context5.next = 20;
                break;
              }

              throw new ApiError(400, "Invalid product ID!");

            case 20:
              _context5.next = 22;
              return regeneratorRuntime.awrap(product_dao.read(product.product));

            case 22:
              product_info = _context5.sent;
              //will throw a 404 not found if product.product is not even in the database!
              total += product.quantity * product_info.price;

            case 24:
              _iteratorNormalCompletion4 = true;
              _context5.next = 14;
              break;

            case 27:
              _context5.next = 33;
              break;

            case 29:
              _context5.prev = 29;
              _context5.t0 = _context5["catch"](12);
              _didIteratorError4 = true;
              _iteratorError4 = _context5.t0;

            case 33:
              _context5.prev = 33;
              _context5.prev = 34;

              if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
                _iterator4["return"]();
              }

            case 36:
              _context5.prev = 36;

              if (!_didIteratorError4) {
                _context5.next = 39;
                break;
              }

              throw _iteratorError4;

            case 39:
              return _context5.finish(36);

            case 40:
              return _context5.finish(33);

            case 41:
              attributes.total = total;

            case 42:
              if (status) {
                attributes.status = status;
              }

              _context5.next = 45;
              return regeneratorRuntime.awrap(Order.findByIdAndUpdate(id, attributes, {
                "new": true,
                runValidators: true
              }).lean().select("-__v"));

            case 45:
              new_order = _context5.sent;
              return _context5.abrupt("return", this.order_formatter(new_order));

            case 47:
            case "end":
              return _context5.stop();
          }
        }
      }, null, this, [[12, 29, 33, 41], [34,, 36, 40]]);
    }
  }]);

  return OrderDao;
}();

module.exports = OrderDao;