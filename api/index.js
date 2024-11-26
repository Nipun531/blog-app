const express = require('express')
const mongoose = require("mongoose");
const cors= require('cors');
const User= require('./models/user');
const Post=require('./models/post');

// const ProfilePage = require('./uploads/Index pages/ProfilePage');
const bcrypt = require('bcryptjs');
const app =express();
const jwt =require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer=require('multer');
const fs= require('fs');
app.use('/uploads',express.static(__dirname+'/uploads'));

const uploadMiddleware =multer({dest: 'uploads/' })
const salt =bcrypt.genSaltSync(10);
const secret='asdafsfwf4kuiiuh4353lknlui9';

app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());

mongoose.connect('mongodb+srv://sharmanipun531:k91AgCDyCJEKI8H9@cluster0.qgr8q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')


app.post('/register',async (req,res) =>{
    const {username,password} = req.body;
    try{
        const userDoc=await User.create({ 
            username,
             password:bcrypt.hashSync(password,salt)
        })
        res.json(userDoc);
    }catch(e){
        res.status(400).json(e);
    }

    
})

app.post('/login',async (req,res) =>{
    const {username,password} = req.body;
    const userDoc =await User.findOne({username});
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if(passOk){
        // logged in
        jwt.sign({username,id:userDoc._id}, secret,{},(err,token)=>{
            if (err) throw err;
            res.cookie('token',token).json({
                id:userDoc._id,
                username,
            });
        })
    }
    else{
        res.status(400).json({ message: 'Wrong credentials' });
    }
})

app.get('/profile',(req,res)=>{
    const {token}=req.cookies;
    jwt.verify(token,secret,{},(err,info)=>{
        if (err) throw err;
        res.json(info);
    })
    // res.json(req.cookies);
    
})

app.post('/logout',(req,res)=>{
    res.cookie('token','').json('ok');
})

app.post('/post',uploadMiddleware.single('file'),async (req,res) =>{
    // res.json({files:req.file});
    const {originalname,path} = req.file;
    const parts=originalname.split('.');
    const ext = parts[parts.length -1]
    const newPath=path+'.'+ext;
    fs.renameSync(path, path+'.'+ext);
    // res.json(req.file);
    const {token}=req.cookies;
    jwt.verify(token,secret,{},async (err,info)=>{
        if (err) throw err;
        const {title,summary,content} = req.body;
        const postDoc=await Post.create({
            title,
            summary,
            content,
            cover:newPath,
            author:info.id,
        })
        res.json(postDoc);
    
    })

    
})

app.put('/post',uploadMiddleware.single('file'), async(req,res)=>{
    let newPath=null;
    if(req.file){
        const {originalname,path} = req.file;
        const parts=originalname.split('.');
        const ext = parts[parts.length -1]
        newPath=path+'.'+ext;
        fs.renameSync(path, path+'.'+ext);
    }

    const {token}=req.cookies;
    jwt.verify(token,secret,{},async (err,info)=>{
        if (err) throw err;
        const {id,title,summary,content} = req.body;
        const postDoc= await Post.findById(id)
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
        if(!isAuthor){
            return res.status(400).json('you are not the author');
            
        }

        await postDoc.updateOne({
            title,
            summary,
            content,
            cover: newPath ? newPath : postDoc.cover,
        });
        
        res.json(postDoc);
    
    })
})

app.get('/post', async (req,res) =>{
    const posts=await Post.find()
    .populate('author',['username'])
    .sort({createdAt:-1})
    .limit(20);
    res.json(posts);
})

app.get('/post/:id', async(req,res) =>{
    const {id} = req.params;
    const postDoc= await Post.findById(id).populate('author',['username']);
    res.json(postDoc);
})

app.get('/profile/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Check if the provided `id` is actually a username
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



app.listen(4000);


// nodemon restarts the app automatically
// mongodb+srv://sharmanipun531:sharma04@cluster0.xbkff.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0


// sharma04

// k91AgCDyCJEKI8H9
// mongodb+srv://sharmanipun531:k91AgCDyCJEKI8H9@cluster0.qgr8q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0