// TODO: Implement the operations of OrderDao.
//  Do not change the signature of any of the operations!
//  You may add helper functions, other variables, etc, as the need arises!
const ProductDao = require("./ProductDao");
const UserDao = require("./UserDao");
const product_dao = new ProductDao();
const Order = require("../model/Order");
const ApiError = require("../model/ApiError");
const mongoose = require("mongoose");

const users = new UserDao();

class OrderDao {
  order_formatter(order) {
    //format the products (_id and product are returned as ObjectId)
    let new_products = [];

    for (const product of order.products) {
      new_products.push({
        _id: product._id.toString(),
        product: product.product.toString(),
        quantity: product.quantity,
      });
    }

    return {
      _id: order._id.toString(),
      customer: order.customer.toString(),
      products: new_products,
      total: order.total,
      status: order.status,
    };
  }

  async get_total_from_products(products) {
    let total = 0;

    //calculate new total
    for (const product of products) {
      if (isNaN(product.quantity) || product.quantity <= 0) {
        throw new ApiError(400, "Product has invalid quantity!");
      }

      if (!mongoose.isValidObjectId(product.product)) {
        throw new ApiError(400, "Invalid product ID!");
      }

      let product_info = await product_dao.read(product.product);
      //will throw a 404 not found if product.product is not even in the database!

      total += product.quantity * product_info.price;
    }
    return total;
  }

  // When an order is created, it is in "active" state
  async create({ customer, products }) {
    if (customer === undefined || customer === "") {
      throw new ApiError(400, "Every order must have a customer name!");
    }
    //sanity check to see if user id exists in our database!
    await users.read(customer);
    // Total price is computer from the list of products.
    if (!Array.isArray(products) || products.length === 0) {
      throw new ApiError(400, "Every order must have a list of products!");
    }

    let total = await this.get_total_from_products(products);

    //assign a product _id?
    const order = await Order.create({
      customer,
      products,
      total,
      status: "ACTIVE",
    });
    return this.order_formatter(order);
  }

  async read(id, customer_id, role) {
    // Hint:
    //  If role==="ADMIN" then return the order for the given ID
    //  Otherwise, only return it if the customer is the one who placed the order!
    if (!mongoose.isValidObjectId(id)) {
      throw new ApiError(404, "invalid id");
    }
    const order = await Order.findById(id).lean().select("-__v");
    if (order === null) {
      throw new ApiError(404, "There is no order found of that fits that ID!");
    }
    if (role === "ADMIN" || order.customer.toString() === customer_id) {
      return [this.order_formatter(order)];
    } else {
      throw new ApiError(403, "Unauthorized to perform this action!");
    }
  }

  // Pre: The requester is an ADMIN or is the customer!
  //  The route handler must verify this!
  async readAll({ customer, status }) {
    // Hint:
    //  The customer and status parameters are filters.
    //  For example, one may search for all "ACTIVE" orders for the given customer.
    const filter = {};
    if (customer) {
      filter.customer = customer;
    }
    if (status) {
      filter.status = status;
    }

    const orders = await Order.find(filter).lean().select("-__v");
    let results = [];
    for (const order of orders) {
      results.push(this.order_formatter(order));
    }
    return results;
  }

  async delete(id, customer) {
    // Hint: The customer must be the one who placed the order!
    // sanity checking to see if the order even exists! if it does
    //customer must be the one who placed it!
    //admins not allowed to delete others' orders
    //customers not allowe to delete others' orders
    await this.read(id, customer, "CUSTOMER");
    const order = await Order.findByIdAndDelete(id).lean().select("-__v");
    return [this.order_formatter(order)];
  }

  // One can update the list of products or the status of an order
  async update(id, customer, { products, status }) {
    // Hint: The customer must be the one who placed the order!
    // sanity checking to see if the order even exists! if it does
    //customer must be the one who placed it!
    await this.read(id, customer, "CUSTOMER");

    if (!products && !status) {
      throw new ApiError(400, "Enter product/status as part of payload!");
    }
    const attributes = {};
    if (products) {
      attributes.products = products;
      attributes.total = await this.get_total_from_products(products);
    }
    if (status) {
      attributes.status = status;
    }
    const new_order = await Order.findByIdAndUpdate(id, attributes, {
      new: true,
      runValidators: true,
    })
      .lean()
      .select("-__v");
    return this.order_formatter(new_order);
  }
}

module.exports = OrderDao;
