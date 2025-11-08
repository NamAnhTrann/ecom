const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
const cookieParser = require("cookie-parser");
require("dotenv").config();
require("./utils/passport");

const app = express();

// --- testing utilities ---
const { Server } = require("socket.io");
const http = require("http");
const server = http.createServer(app);
const io = new Server(server);
// --- end utilities ---

//  Load webhook router first, before express.json()
const webhookRouter = require("./router/webhook");
app.use("/stripe", webhookRouter);

//  Use normal middleware AFTER webhook route
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

//  CORS configuration
const allowedOrigins = ["http://localhost:4200",'https://ecom-six-eosin.vercel.app'];
app.use(
  cors({
    origin: allowedOrigins,
    methods: "GET, POST, PUT, DELETE",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

//  Load all other routers
const productRouter = require("./router/product_router");
const userRouter = require("./router/user_router");
const contactRouter = require("./router/contact_us_router");
const mediaRouter = require("./router/media_router");
const cartRouter = require("./router/cart_router");
const orderRouter = require("./router/order_router");

app.use(productRouter);
app.use(userRouter);
app.use(contactRouter);
app.use(mediaRouter);
app.use(cartRouter);
app.use(orderRouter);

//  Root endpoint
app.get("/", (req, res) => res.send("Backend is running"));

//  Database connection
const db_url = process.env.db_url;
const port_no = process.env.port_no;

async function connectDB() {
  try {
    await mongoose.connect(db_url);
    console.log(" Connected to the database");
  } catch (err) {
    console.error(" Database connection error:", err);
  }
}
connectDB();

//  Socket.IO setup
io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("send name", (username) => {
    io.emit("send name", username);
  });

  socket.on("send message", (chat) => {
    io.emit("send message", chat);
  });
});

//  Start server
server.listen(port_no, () => {
  console.log(` Server listening on port ${port_no}`);
});
