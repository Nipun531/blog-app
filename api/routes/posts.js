// const express = require('express');
// const multer = require('multer');
// const fs = require('fs');
// const jwt = require('jsonwebtoken');
// const Post = require('../models/post');
// const router = express.Router();

// const uploadMiddleware = multer({ dest: 'uploads/' });
// const secret = 'asdafsfwf4kuiiuh4353lknlui9';

// router.post('/', uploadMiddleware.single('file'), async (req, res) => {
//     const { originalname, path } = req.file;
//     const parts = originalname.split('.');
//     const ext = parts[parts.length - 1];
//     const newPath = path + '.' + ext;
//     fs.renameSync(path, newPath);

//     const { token } = req.cookies;
//     jwt.verify(token, secret, {}, async (err, info) => {
//         if (err) throw err;
//         const { title, summary, content } = req.body;
//         const postDoc = await Post.create({ title, summary, content, cover: newPath, author: info.id });
//         res.json(postDoc);
//     });
// });

// router.put('/', uploadMiddleware.single('file'), async (req, res) => {
//     let newPath = null;
//     if (req.file) {
//         const { originalname, path } = req.file;
//         const parts = originalname.split('.');
//         const ext = parts[parts.length - 1];
//         newPath = path + '.' + ext;
//         fs.renameSync(path, newPath);
//     }

//     const { token } = req.cookies;
//     jwt.verify(token, secret, {}, async (err, info) => {
//         if (err) throw err;
//         const { id, title, summary, content } = req.body;
//         const postDoc = await Post.findById(id);
//         if (postDoc.author.toString() !== info.id) {
//             return res.status(400).json('You are not the author');
//         }
//         await postDoc.updateOne({ title, summary, content, cover: newPath || postDoc.cover });
//         res.json(postDoc);
//     });
// });

// router.get('/', async (req, res) => {
//     const posts = await Post.find().populate('author', ['username']).sort({ createdAt: -1 }).limit(20);
//     res.json(posts);
// });

// router.get('/:id', async (req, res) => {
//     const { id } = req.params;
//     const postDoc = await Post.findById(id).populate('author', ['username']);
//     res.json(postDoc);
// });

// module.exports = router;



const express = require('express');
const multer = require('multer');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const Post = require('../models/post');
const router = express.Router();

const uploadMiddleware = multer({ dest: 'uploads/' });
const secret = 'asdafsfwf4kuiiuh4353lknlui9';

// Create Post
router.post('/', uploadMiddleware.single('file'), async (req, res) => {
    const { originalname, path } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);

    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        const { title, summary, content } = req.body;
        const postDoc = await Post.create({ title, summary, content, cover: newPath, author: info.id });
        res.json(postDoc);
    });
});

// Update Post
router.put('/', uploadMiddleware.single('file'), async (req, res) => {
    let newPath = null;
    if (req.file) {
        const { originalname, path } = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
    }

    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        const { id, title, summary, content } = req.body;
        const postDoc = await Post.findById(id);
        if (postDoc.author.toString() !== info.id) {
            return res.status(400).json('You are not the author');
        }
        await postDoc.updateOne({ title, summary, content, cover: newPath || postDoc.cover });
        res.json(postDoc);
    });
});

// Get All Posts
router.get('/', async (req, res) => {
    const posts = await Post.find()
        .populate('author', ['username'])
        .sort({ createdAt: -1 })
        .limit(20);
    res.json(posts);
});

// Get Post by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const postDoc = await Post.findById(id)
        .populate('author', ['username'])
        .populate('comments.author', ['username']);
    res.json(postDoc);
});

// Like/Unlike a Post
router.post('/:id/like', async (req, res) => {
    const { id } = req.params; // Post ID
    const { token } = req.cookies;

    jwt.verify(token, secret, {}, async (err, userInfo) => {
        if (err) throw err;

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const userId = userInfo.id;
        const hasLiked = post.likes.includes(userId);

        if (hasLiked) {
            // Unlike the post
            post.likes = post.likes.filter(like => like.toString() !== userId);
        } else {
            // Like the post
            post.likes.push(userId);
        }

        await post.save();
        res.json({ likes: post.likes.length });
    });
});

// Add a Comment
router.post('/:id/comment', async (req, res) => {
    const { id } = req.params; // Post ID
    const { text } = req.body;
    const { token } = req.cookies;

    jwt.verify(token, secret, {}, async (err, userInfo) => {
        if (err) throw err;

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        post.comments.push({ author: userInfo.id, text });
        await post.save();

        res.json(post.comments);
    });
});

// Export the router
module.exports = router;
