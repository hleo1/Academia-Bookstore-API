const express = require("express");
const UserDao = require("../data/UserDao");
const ApiError = require("../model/ApiError");
const { checkAdmin, checkToken } = require("../util/middleware");

const router = express.Router();
const users = new UserDao();

router.get("/api/users", checkAdmin, async (req, res, next) => {
  try {
    const { username, role } = req.query;
    if (username && role) {
      throw new ApiError(
        400,
        "You must query the database based on either a username or user role."
      );
    } else {
      const data = username
        ? await users.readOne(username)
        : await users.readAll(role);
      res.json({ data });
    }
  } catch (err) {
    next(err);
  }
});

router.get("/api/users/:id", checkToken, async (req, res, next) => {
  try {
    //check token stores the users' identity in req.users
    //if admin, or if user.id === the requested ID, then continue!
    const { id } = req.params;
    if (
      req.user.role === "ADMIN" ||
      (req.user.role === "CUSTOMER" && req.user.sub === id)
    ) {
      const data = await users.read(id);
      res.json({ data });
    } else {
      throw new ApiError(403, "You are not authorized to perform this action.");
    }
  } catch (err) {
    next(err);
  }
});

router.post("/api/users", checkAdmin, async (req, res, next) => {
  try {
    const { username, password, role } = req.body;
    const data = await users.create({ username, password, role });
    res.status(201).json({ data });
  } catch (err) {
    next(err);
  }
});

router.delete("/api/users/:id", checkToken, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (
      req.user.role === "ADMIN" ||
      (req.user.role === "CUSTOMER" && req.user.sub === id)
    ) {
      const data = await users.delete(id);
      res.json({ data });
    } else {
      throw new ApiError(403, "You are not authorized to perform this action.");
    }
  } catch (err) {
    next(err);
  }
});

router.put("/api/users/:id", checkToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { password, role } = req.body;
    if (!password && !role) {
      throw new ApiError(400, "You must provide at least one user attribute!");
    }

    //customer cannot update their role!
    //furthermore, only admins or customers that update their own profile may do so
    if (
      (req.user.role === "CUSTOMER" && role) ||
      !(
        req.user.role === "ADMIN" ||
        (req.user.role === "CUSTOMER" && req.user.sub === id)
      )
    ) {
      throw new ApiError(403, "You are not authorized to perform this action.");
    } else {
      const data = await users.update(id, { password, role });
      res.json({ data });
    }
    
  } catch (err) {
    next(err);
  }
});

module.exports = router;
