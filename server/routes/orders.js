const express = require("express");
const { checkToken } = require("../util/middleware");


const OrderDao = require("../data/OrderDao");
const ApiError = require("../model/ApiError");
const { create } = require("../model/Product");

const router = express.Router();
const orders = new OrderDao();


router.get("/api/orders", checkToken, async (req, res, next) => {
  const { customer, status } = req.query;
  try {
    //req.user contains user's sub(id) / username / role
    //if admin, then can see all orders!
    //if just a customer, only orders they made only
    if (req.user.role === "ADMIN" || (customer && customer === req.user.sub)) {
      const data = await orders.readAll({ customer, status });
      res.status(200).json({ data });
    } else {
      throw new ApiError(403, "You must have admin access to view all orders!");
    }
  } catch (err) {
    next(err);
  }
});

router.get("/api/orders/:id", checkToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await orders.read(id, req.user.sub, req.user.role);
    res.json({ data });
  } catch (err) {
    next(err);
  }
});

router.post("/api/orders", checkToken, async (req, res, next) => {
  try {
    const { products } = req.body;
    const customer = req.user.sub;

    //orders.create checks to see if products or customer even exists!
    const data = await orders.create({
      customer,
      products,
    });
    res.status(201).json({ data });
  } catch (err) {
    next(err);
  }
});

router.put("/api/orders/:id", checkToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { products, status } = req.body;

    if (status === "ACTIVE" || status === "COMPLETE" || status === undefined) {
      const data = await orders.update(id, req.user.sub, {
        products, status
      })
      res.status(200).json({data});
    } else {
      throw new ApiError(400, "Invalid status attribute!");
    }
  } catch (err) {
    next(err);
  }
});

router.delete("/api/orders/:id", checkToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await orders.delete(id, req.user.sub);
    res.json({ data });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
