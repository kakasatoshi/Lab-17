const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const multer = require("multer");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const User = require("./models/user");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

const MONGODB_URI =
  "mongodb+srv://kakasatoshi:Mnbv%400987@product.6wlp4.mongodb.net/Product?retryWrites=true&w=majority&appName=Product";

const app = express();
const store = new MongoDBStore({ uri: MONGODB_URI, collection: "sessions" });
const csrfProtection = csrf({ cookie: true });

store.on("error", (err) => console.error("Store error:", err));

app.use(cookieParser());
app.use(bodyParser.json());
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
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) return next();
  User.findById(req.session.user._id)
    .then((user) => {
      if (user) req.user = user;
      next();
    })
    .catch((err) => next(new Error(err)));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.get("/csrf-token", (req, res, next) =>
  res.json({ csrfToken: req.csrfToken() })

);

app.get("/status", (req, res, next) => {
  res.status(200).json({
    isAuthenticated: !!req.session.isLoggedIn,
    user: req.session.user || null,
  });
});

app.use("/admin", adminRoutes);
app.use("/shop", shopRoutes);
app.use("/auth", authRoutes);

app.get("*", (req, res) =>
  res.sendFile(path.resolve(__dirname, "build", "index.html"))
);

app.use((error, req, res, next) => {
  res.status(500).json({
    status: "error",
    message: error.message || "Internal server error",
  });
});

mongoose
  .connect(MONGODB_URI, { tls: true, tlsAllowInvalidCertificates: true })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(5000, () => console.log("Server is running on port 5000"));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
