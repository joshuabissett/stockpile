import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { query } from './db';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', async (req, res) => {
    try {
        const result = await query('SELECT NOW()');
        res.json({ 
            status: 'ok', 
            message: 'Server is running and DB is connected!', 
            dbTime: result.rows[0].now 
        });
    } catch (error) {
        console.error('DB Connection Error:', error);
        res.status(500).json({ status: 'error', message: 'Database connection failed' });
    }
});

app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) 
            return res.status(400).json({ status: 'error', message: 'Email and password are required' });

        const userExists = await query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) 
            return res.status(400).json({ status: 'error', message: 'User already exists' });
   
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await query(
            'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING user_id, email',
            [email, hashedPassword]
        );

        res.status(201).json({
             status: 'User created succesfully',
            user: newUser.rows[0]
        });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ status: 'error', message: 'Registration failed' });
      }

    });

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const userResult = await query('SELECT * FROM users WHERE email = $1', [email]);

        if (userResult.rows.length === 0) {
            return res.status(401).json({ status: 'error', message: 'Invalid email or password' });
        }

        const user = userResult.rows[0];

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch)
            return res.status(401).json({ status: 'error', message: 'Invalid email or password' });

        res.json({
            message: 'Login successful',
            user: {
                id: user.user_id,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ status: 'error', message: 'Login failed' });
    }
});

app.get('/api/assets', async (req, res) => {
    try {
        const userId = req.query.userId;

        if (!userId) {
            res.status(400).json({ message: 'User ID is required' });
            return;
        }

        const result = await query(
            'SELECT * FROM assets WHERE user_id = $1 ORDER BY created_at DESC', 
            [userId]
        );

        const assets = result.rows.map(row => ({
            id: row.asset_id,
            symbol: row.symbol,
            shares: Number(row.shares),
            purchasePrice: Number(row.purchase_price),
            currentPrice: Number(row.current_price || row.purchase_price),
            boughtOn: row.bought_on
        }));

        res.json(assets);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/assets', async (req, res) => {
    try {
        const { userId, symbol, shares, purchasePrice, currentPrice, boughtOn } = req.body;

        const newAsset = await query(
            `INSERT INTO assets (user_id, symbol, shares, purchase_price, current_price, bought_on) 
             VALUES ($1, $2, $3, $4, $5, $6) 
             RETURNING *`,
            [userId, symbol, shares, purchasePrice, currentPrice, boughtOn || null]
        );
        
        const row = newAsset.rows[0];
        res.status(201).json({
            id: row.asset_id,
            symbol: row.symbol,
            shares: Number(row.shares),
            purchasePrice: Number(row.purchase_price),
            currentPrice: Number(row.current_price),
            boughtOn: row.bought_on
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});