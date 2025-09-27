const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

exports.registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = new User({ name, email, password });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        
        console.log(`--- REGISTER ---`);
        console.log(`Password to be saved: ${password}`);
        console.log(`Hashed password being saved: ${user.password}`);
        console.log(`----------------`);

        await user.save();

        const payload = { user: { id: user.id, name: user.name } };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5h' },
            (err, token) => {
                if (err) throw err;
                res.status(201).json({ token });
            }
        );
    } catch (error) {
        console.error('REGISTER CONTROLLER ERROR:', error); 
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.loginUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials (User not found)' });
        }
        
        console.log(`\n--- LOGIN ATTEMPT ---`);
        console.log(`Email provided: ${email}`);
        console.log(`Password from login form: ${password}`);
        console.log(`Hashed password from DB: ${user.password}`);

        const isMatch = await bcrypt.compare(password, user.password);
        
        console.log(`Does password match? -> ${isMatch}`);
        console.log(`---------------------\n`);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials (Password mismatch)' });
        }

        const payload = { user: { id: user.id, name: user.name } };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (error) {
        console.error('LOGIN CONTROLLER ERROR:', error);
        res.status(500).json({ message: 'Server Error', errorDetails: error.message });
    }
};