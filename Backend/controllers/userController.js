const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateAuthToken = function(user) {
    const token = jwt.sign({    
        _id: user._id,
        username: user.username,
        email: user.email
    }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
}

async function createUser(req, res){
    try {
        const { username, email, password } = req.body; 
        const hashedPassword = await bcrypt.hash(password, 10);
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function loginUser(req, res){
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        res.status(200).json({ user, token: generateAuthToken(user) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { createUser, loginUser };