const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Post = require('../models/post');
const router = express.Router();

const salt = bcrypt.genSaltSync(10);
const secret = 'asdafsfwf4kuiiuh4353lknlui9';

router.post('/register', async (req, res) => {
    const { username, password, email, fullName } = req.body;

    try {
        const hashedPassword = bcrypt.hashSync(password, salt);
        const userDoc = await User.create({ username, password: hashedPassword, email, fullName });
        res.status(200).json(userDoc);
    } catch (e) {
        console.error(e);
        res.status(400).json(e);
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const userDoc = await User.findOne({ username });
    console.log('User found:', userDoc);
    if (userDoc && bcrypt.compareSync(password, userDoc.password)) {
        jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
            if (err) throw err;
            res.cookie('token', token).json({ id: userDoc._id, username });
        });
    } else {
        res.status(400).json({ message: 'Wrong credentials' });
    }
});

router.get('/profile', (req, res) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({ message: 'Authentication token is missing. Please log in.' });
    }

    jwt.verify(token, secret, {}, (err, info) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token. Please log in again.' });
        }
        res.json(info);
    });
});


router.get('/profile/:id', async (req, res) => {
        const { id } = req.params;
    
        try {
            // Check if the provided id is actually a username
            const user = await User.findOne({ username: id }, { username: 1, _id: 1 });
    
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
    
            // Fetch posts authored by the user
            const userPosts = await Post.find({ author: user._id })
                .sort({ createdAt: -1 })
                .limit(20);
    
            res.json({ user, posts: userPosts });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

router.post('/logout', (req, res) => {
    res.cookie('token', '').json('ok');
});

module.exports = router;

