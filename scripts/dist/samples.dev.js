"use strict";

require("dotenv").config();

var db = require("../server/data/db");

var User = require("../server/model/User");

var Product = require("../server/model/Product");

var Order = require("../server/model/Order");

var UserDao = require("../server/data/UserDao");

var ProductDao = require("../server/data/ProductDao");

var OrderDao = require("../server/data/OrderDao");

var users = new UserDao();
var products = new ProductDao();
var orders = new OrderDao();

function createSampleData() {
  var customer1, customer2, admin, book1, book2, book3, order1, order2, order3;
  return regeneratorRuntime.async(function createSampleData$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(db.connect());

        case 2:
          _context.next = 4;
          return regeneratorRuntime.awrap(Order.deleteMany({}));

        case 4:
          _context.next = 6;
          return regeneratorRuntime.awrap(User.deleteMany({}));

        case 6:
          _context.next = 8;
          return regeneratorRuntime.awrap(Product.deleteMany({}));

        case 8:
          _context.next = 10;
          return regeneratorRuntime.awrap(users.create({
            username: "customer1",
            password: "customer1",
            role: "CUSTOMER"
          }));

        case 10:
          customer1 = _context.sent;
          _context.next = 13;
          return regeneratorRuntime.awrap(users.create({
            username: "customer2",
            password: "customer2",
            role: "CUSTOMER"
          }));

        case 13:
          customer2 = _context.sent;
          _context.next = 16;
          return regeneratorRuntime.awrap(users.create({
            username: "admin",
            password: "admin",
            role: "ADMIN"
          }));

        case 16:
          admin = _context.sent;
          _context.next = 19;
          return regeneratorRuntime.awrap(products.create({
            name: "Eloquent JavaScript",
            price: 20.99
          }));

        case 19:
          book1 = _context.sent;
          _context.next = 22;
          return regeneratorRuntime.awrap(products.create({
            name: "JavaScript: The Good Parts",
            price: 13.69
          }));

        case 22:
          book2 = _context.sent;
          _context.next = 25;
          return regeneratorRuntime.awrap(products.create({
            name: "JavaScript: The Definitive Guide",
            price: 50.69
          }));

        case 25:
          book3 = _context.sent;
          _context.next = 28;
          return regeneratorRuntime.awrap(orders.create({
            customer: customer1._id,
            products: [{
              product: book1._id,
              quantity: 2
            }, {
              product: book2._id,
              quantity: 1
            }]
          }));

        case 28:
          order1 = _context.sent;
          _context.next = 31;
          return regeneratorRuntime.awrap(orders.create({
            customer: customer2._id,
            products: [{
              product: book3._id,
              quantity: 2
            }]
          }));

        case 31:
          order2 = _context.sent;
          _context.next = 34;
          return regeneratorRuntime.awrap(orders.create({
            customer: customer2._id,
            products: [{
              product: book1._id,
              quantity: 1
            }]
          }));

        case 34:
          order3 = _context.sent;
          _context.t0 = console;
          _context.next = 38;
          return regeneratorRuntime.awrap(orders.update(order3._id, order3.customer, {
            products: [{
              product: book2._id,
              quantity: 2
            }],
            status: "COMPLETE"
          }));

        case 38:
          _context.t1 = _context.sent;

          _context.t0.log.call(_context.t0, _context.t1);

        case 40:
        case "end":
          return _context.stop();
      }
    }
  });
}

createSampleData().then(function () {
  console.log("Finished creating samples!");
  console.log("Please terminate the process by Ctrl + C");
})["catch"](function (err) {
  return console.log(err);
});