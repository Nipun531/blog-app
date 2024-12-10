


// const mongoose = require('mongoose');
// const {Schema,model}= mongoose;
// const PostSchema = new Schema({
//     title: String,
//     summary: String,
//     content: String,
//     cover: String,
//     author: { type: Schema.ObjectId, ref: 'User' },
//     likes: [{ type: Schema.ObjectId, ref: 'User' }], // Array of user IDs
// }, {
//     timestamps: true,
// });

// const PostModel = model('Post', PostSchema);

// module.exports = PostModel;


const mongoose = require('mongoose');
const { Schema } = mongoose;

const PostSchema = new Schema({
    title: String,
    summary: String,
    content: String,
    cover: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [
        {
            author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            text: String,
            createdAt: { type: Date, default: Date.now },
        },
    ],
}, { timestamps: true });

const Post = mongoose.model('Post', PostSchema);
module.exports = Post;

