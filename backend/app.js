const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const multer = require('multer');

const User = require('./models/user');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const MONGODB_URI = 'mongodb+srv://kakasatoshi:Mnbv%400987@product.6wlp4.mongodb.net/Product?retryWrites=true&w=majority&appName=Product';

const app = express();
const store = new MongoDBStore({ uri: MONGODB_URI, collection: 'sessions' });
const csrfProtection = csrf();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'images'),
  filename: (req, file, cb) => cb(null, new Date().toISOString() + '-' + file.originalname)
});

const fileFilter = (req, file, cb) => {
  if (['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype)) cb(null, true);
  else cb(null, false);
};

app.use(bodyParser.json());
app.use(multer({ storage: fileStorage, fileFilter }).single('image'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.static(path.join(__dirname, 'build')));

app.use(session({
  secret: 'my secret',
  resave: false,
  saveUninitialized: false,
  store: store
}));

app.use(csrfProtection);

app.use((req, res, next) => {
  if (!req.session.user) return next();
  User.findById(req.session.user._id)
    .then(user => {
      if (user) req.user = user;
      next();
    })
    .catch(err => next(new Error(err)));
});

// Expose CSRF token
app.get('/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

// Serve React App
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

// Error Handling
app.use((error, req, res, next) => {
  res.status(500).json({ status: 'error', message: error.message || 'Internal server error' });
});

// MongoDB Connection
mongoose.connect(MONGODB_URI).then(() => app.listen(5000)).catch(err => console.error(err));
