const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");

const User = require("./models/user");
// const session = require("express-session");
const cookieParser = require("cookie-parser");
const app = express();
app.use(cookieParser());

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

// Middleware để parse JSON (thay vì chỉ parse `urlencoded` cho React frontend)
app.use(bodyParser.json());

// Middleware để phục vụ các file tĩnh, ví dụ ảnh, CSS
app.use(express.static(path.join(__dirname, "public")));
const cors = require("cors");
// app.use(cors());
const csrfProtection = csrf({ cookie: true });

const store = new MongoDBStore({
  uri: "mongodb+srv://kakasatoshi:Mnbv%400987@product.6wlp4.mongodb.net/Product",
  collection: "sessions", // Tên collection lưu session
});

// Xử lý lỗi khi khởi tạo store
store.on("error", (err) => {
  console.error("Store error:", err);
});

app.use(
  cors({
    origin: "http://localhost:3000", // Chỉ định origin của frontend
    methods: ["GET", "POST", "PUT", "DELETE"], // Các phương thức được phép
    credentials: true, // Cho phép gửi cookie và header xác thực
  })
);

// Thêm user vào request để có thể truy cập trong controller
app.use(
  session({
    secret: "kaka satoshi",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(csrfProtection);
app.get("/csrf-token", (req, res, next) => {
  res.json({ csrfToken: req.csrfToken() }); // Trả về token cho client
  next();
});

app.get("/status", (req, res, next) => {
  if (req.session.isLoggedIn) {
    res.status(200).json({
      isAuthenticated: true,
      user: req.session.user, // Trả về thông tin user nếu cần
    });
  } else {
    res.status(200).json({
      isAuthenticated: false,
    });
  }
  next();
});
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

// Routes cho API
app.use("/admin", adminRoutes);
app.use("/shop", shopRoutes);
app.use("/auth", authRoutes);

// Route 404 cho API không tồn tại
// app.use((req, res, next) => {
//   res.status(404).json({ message: "Route not found" });
//   next();
// });

// Kết nối MongoDB và khởi chạy server
mongoose
  .connect(
    "mongodb+srv://kakasatoshi:Mnbv%400987@product.6wlp4.mongodb.net/Product?retryWrites=true&w=majority&appName=Product"
  )
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "Max",
          email: "max@test.com",
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });
    app.listen(5000, () => {
      console.log("Server is running on http://localhost:5000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
