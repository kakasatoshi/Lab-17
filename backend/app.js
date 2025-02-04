const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const multer = require("multer");
const { check } = require("express-validator");

const User = require("./models/user");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const cors = require("cors");



const MONGODB_URI =
  "mongodb+srv://kakasatoshi:Mnbv%400987@product.6wlp4.mongodb.net/Product?retryWrites=true&w=majority&appName=Product";

const app = express();
const store = new MongoDBStore({ uri: MONGODB_URI, collection: "sessions" });
const csrfProtection = csrf();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "images"),
  filename: (req, file, cb) =>
    cb(null, new Date().toISOString() + "-" + file.originalname),
});

const fileFilter = (req, file, cb) => {
  if (["image/png", "image/jpg", "image/jpeg"].includes(file.mimetype))
    cb(null, true);
  else cb(null, false);
};

app.use(bodyParser.json());
app.use(multer({ storage: fileStorage, fileFilter }).single("image"));
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(express.static(path.join(__dirname, "build")));

app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
// app.use(
//   session({
//     secret: "my secret",
//     resave: false,
//     saveUninitialized: false,
//     store: MongoStore.create({
//       mongoUrl: MONGODB_URI,
//     }),
//   })
// );
app.use(csrfProtection);

app.use((req, res, next) => {
  if (!req.session.user) return next();
  User.findById(req.session.user._id)
    .then((user) => {
      if (user) req.user = user;
      next();
    })
    .catch((err) => next(new Error(err)));
});

// Expose CSRF token
app.get("/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Routes
app.use("/admin", adminRoutes);
app.use("/shop", shopRoutes);
app.use(authRoutes);

// Serve React App
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "build", "index.html"));
});

// Error Handling
app.use((error, req, res, next) => {
  res.status(500).json({
    status: "error",
    message: error.message || "Internal server error",
  });
});

// MongoDB Connection
mongoose;
mongoose
  .connect(MONGODB_URI, {
    tls: true, // Bật SSL (bắt buộc với MongoDB Atlas)
    tlsAllowInvalidCertificates: true, // Chỉ dùng khi test
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(5000, () => console.log("Server is running on port 5000"));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
