// load env
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const userRoutes = require("./routes/user.routes");
const adoptionsRoutes = require("./routes/adoptions.routes");
const petRoutes = require("./routes/pet.routes");
const uploadRoutes = require("./routes/upload.routes");

const app = express();
const port = process.env.PORT || 5000;
const corsConfig = {
  origin: "*",
  optionsSuccessStatus: 200,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};

// middlewares
app.use(cors()); // enable cors

app.options("", cors(corsConfig));
app.use(express.json({ limit: "2mb" })); // parse json
app.use(express.urlencoded({ extended: true })); // parse form data
connectDB(); // connect database

app.get("/", (req, res) => {
  res.send("Backend Running Successfully"); // test route
});

// routes
app.use("/api/auth", userRoutes);
app.use("/api/adoptions", adoptionsRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/upload", uploadRoutes);

// start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
