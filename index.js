const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 7000;
require("dotenv").config();

//middleware
app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://book-app-frontend-psi.vercel.app",
    ],
    credentials: true,
  })
);

//routes
const bookRoutes = require("./src/books/book.route");
const orderRoutes = require("./src/orders/order.route");
const userRoutes = require("./src/users/user.route");
const adminRoutes = require("./src/stats/admin.stats");
app.use("/api/books", bookRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/admin", adminRoutes);

async function main() {
  await mongoose.connect(process.env.DB_URL);
  app.use("/", (req, res) => {
    res.send("Server for book app is running");
  });
}

main()
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error(err));

app.listen(port, () => {
  console.log(`App is listening on http://localhost:${port}`);
});
