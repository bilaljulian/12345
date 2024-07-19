import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import mongoose from 'mongoose';
import { User, Item, Category } from './models'; // Assuming models are defined in models.ts
import { authenticateUser, authorizeUser } from './middlewares/auth';
import { processPayment } from './services/paymentService';
import { handleErrors } from './middlewares/errorHandler';

const app = express();

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session configuration
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
}));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/enull', { useNewUrlParser: true, useUnifiedTopology: true });

// Routes

// Get all items
app.get('/items', async (req: Request, res: Response) => {
    try {
        const items = await Item.find().populate('category');
        res.json(items);
    } catch (error) {
        handleErrors(error, req, res);
    }
});

// Get item by ID
app.get('/items/:id', async (req: Request, res: Response) => {
    try {
        const item = await Item.findById(req.params.id).populate('category');
        if (item) {
            res.json(item);
        } else {
            res.status(404).send('Item not found');
        }
    } catch (error) {
        handleErrors(error, req, res);
    }
});

// Add new item
app.post('/items', authenticateUser, authorizeUser('admin'), async (req: Request, res: Response) => {
    try {
        const newItem = new Item(req.body);
        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        handleErrors(error, req, res);
    }
});

// Get all categories
app.get('/categories', async (req: Request, res: Response) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        handleErrors(error, req, res);
    }
});

// User login
app.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user && await user.comparePassword(password)) {
            req.session.userId = user._id;
            res.json({ message: 'Login successful' });
        } else {
            res.status(401).send('Invalid credentials');
        }
    } catch (error) {
        handleErrors(error, req, res);
    }
});

// User registration
app.post('/register', async (req: Request, res: Response) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        handleErrors(error, req, res);
    }
});

// Process payment
app.post('/payment', authenticateUser, async (req: Request, res: Response) => {
    try {
        const { amount, paymentToken } = req.body;
        const paymentResult = await processPayment(amount, paymentToken);
        if (paymentResult.success) {
            res.json({ message: 'Payment successful' });
        } else {
            res.status(400).send('Payment failed');
        }
    } catch (error) {
        handleErrors(error, req, res);
    }
});

// Error handling
app.use(handleErrors);

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
