const express = require("express");
const router = express.Router();
const { createOrder, getOrderByEmail } = require("./order.controller");

//create an order
router.post("/", createOrder);

//get orders using email
router.get("/email/:email", getOrderByEmail);

module.exports = router;
