const mongoose = require("mongoose");
const express = require("express");
const Order = require("../orders/order.model");
const Book = require("../books/book.model");

const router = express.Router();
router.get("/", async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalSales = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);
    const trendingBooksCount = await Book.aggregate([
      { $match: { trending: true } }, // Match only trending books
      { $count: "trendingBooksCount" }, // Return the count of trending books
    ]);
    const trendingBooks =
      trendingBooksCount.length > 0
        ? trendingBooksCount[0].trendingBooksCount
        : 0;
    const totalBooks = await Book.countDocuments();
    const monthlySales = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, // Group by year and month
          totalSales: { $sum: "$totalPrice" }, // Sum totalPrice for each month
          totalOrders: { $sum: 1 }, // Count total orders for each month
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      totalOrders,
      totalSales: totalSales[0]?.totalSales || 0,
      trendingBooks,
      totalBooks,
      monthlySales,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error.message);
    res.status(500).json({ message: "Failed to fetch admin stats" });
  }
});
module.exports = router;
