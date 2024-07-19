// setup.mjs

import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { MongoClient } from 'mongodb';
import stripe from 'stripe';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// MongoDB setup
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/enull';
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Stripe setup
const stripeSecret = process.env.STRIPE_SECRET || 'your_stripe_secret_key';
const stripeClient = stripe(stripeSecret);

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.use(session({
  secret: process.env.SESSION_SECRET || 'your_session_secret',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if (!user) return done(null, false);
      
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) return done(null, user);
      
      return done(null, false);
    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Models
const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model('User', UserSchema);

const ItemSchema = new mongoose.Schema({
  title: String,
  description: String,
  pictureUrl: String,
  price: Number,
  category: String,
});

const Item = mongoose.model('Item', ItemSchema);

// Routes
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).send('User registered');
  } catch (err) {
    res.status(500).send('Error registering user');
  }
});

app.post('/login', passport.authenticate('local', { 
  successRedirect: '/dashboard',
  failureRedirect: '/login'
}));

app.post('/add-item', async (req, res) => {
  const { title, description, pictureUrl, price, category } = req.body;
  try {
    const newItem = new Item({ title, description, pictureUrl, price, category });
    await newItem.save();
    res.status(201).send('Item added');
  } catch (err) {
    res.status(500).send('Error adding item');
  }
});

app.post('/checkout', async (req, res) => {
  const { amount, token } = req.body;
  try {
    const charge = await stripeClient.charges.create({
      amount,
      currency: 'usd',
      source: token,
      description: 'Charge for rare item',
    });
    res.status(200).send('Payment successful');
  } catch (err) {
    res.status(500).send('Payment error');
  }
});

app.get('/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).send('Error fetching items');
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
