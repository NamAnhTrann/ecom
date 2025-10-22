const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
const cookieParser = require("cookie-parser");
require("dotenv").config();

require("./utils/passport");

const app = express();
app.use(express.json());
app.use(cookieParser()); 

app.use(passport.initialize());

const allowedOrigins = ["http://localhost:4200"];

app.use(
  cors({
    origin: allowedOrigins,
    methods: "GET, POST, PUT, DELETE",
    credentials: true, 
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const productRouter = require("./router/product_router");
const userRouter = require("./router/user_router");

app.use(productRouter);
app.use(userRouter);

app.get("/", (req, res) => {
  res.send("Backend is running");
});

const db_url = process.env.db_url;
const port_no = process.env.port_no;

async function connectDB() {
  try {
    await mongoose.connect(db_url);
    console.log("Connected to the database");
  } catch (err) {
    console.error("Database connection error:", err);
  }
}

connectDB();

app.listen(port_no, () => {
  console.log(`Server listening on port ${port_no}`);
});
