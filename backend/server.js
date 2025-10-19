const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose")
require("dotenv").config();

const app = express();
app.use(express.json());

const allowedOrigins = [
  "http://localhost:4200",
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: "GET, POST, PUT, DELETE",
    credential: true,
    allowedHeaders: "Content-Type, Authorization",
  })
);

//holders for routers
const productRouter = require("./router/product_router");

//use router
app.use(productRouter);

const db_url = process.env.db_url;
const port_no = process.env.port_no;

app.listen(port_no, function (err) {
  if (!err) {
    console.log(`listens on ${port_no}`);
  } else {
    console.log("Error", err);
  }
});

app.get("/", function (req, res) {
  res.send(`backend is running `);
});

async function connectDB() {
  try {
    await mongoose.connect(db_url);
    console.log(`Conneted to the database`);
  } catch (err) {
    console.log("Connection Error");
  }
}

connectDB();


