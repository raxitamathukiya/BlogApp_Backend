const express=require('express')
const userroute=express()
const {UserModel}=require('../model/user.model')
const {BlogModel}=require('../model/blog.model')
require('dotenv').config()
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const {authMiddleware}=require('../middleware/auth.middleware')

userroute.post('/register',async(req,res)=>{
    try {
        const { Username,avtar,email, password } = req.body;
    const userExists = await UserModel.findOne({email});
    if (userExists) {
      return res.status(400).json({ msg: 'User already exists' });
    }
   else{
    bcrypt.hash(password, 10, async(err, hash)=> {
      const adddata=new UserModel({Username,avtar,email,password:hash })
      await adddata.save()
      res.status(200).json({ msg: 'User created successfully' });
  });
} 
    } catch (error) {
        console.log(error)
    }
})

userroute.post('/login',async(req,res)=>{
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email }); 
        if (!user) {
          return res.status(401).json({ msg: 'Invalid Credentials' });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
          return res.status(401).json({ msg: 'Invalid Credentials' });
        }
        const token = jwt.sign({ userId: user._id }, process.env.SecretKey, {
          expiresIn: '7d'
        });
        res.status(200).json({ msg: 'Login Successfully' ,token:token,userid:user._id});
    } catch (error) {
        console.log(error)
    }
})

userroute.get('/blogs',authMiddleware,async(req,res)=>{
  try {
    let blog=await BlogModel.find()
    res.status(200).json(blog)
  } catch (error) {
    console.log(error)
  }
})

userroute.get('/blogs',authMiddleware,async(req,res)=>{
  const { Title } = req.query;
  try {
    const blogs = await BlogModel.find({ Title: { $regex: Title, $options: 'i' } });
    res.json(blogs);
  } catch (error) {
    console.log(error)
  }
})
userroute.post('/blogs',authMiddleware,async(req,res)=>{
  try {
    const { Title, Content, Category,Date } = req.body;
    const user=req.body.user
    console.log(user)
    const blog = new BlogModel({ Title, Content, Category,Date, Username: user.Username });
    await blog.save();
    res.status(201).json({ message: 'Blog created successfully' });
  } catch (error) {
    console.log(error)
  }
})
userroute.get('/blogs',authMiddleware,async(req,res)=>{
  const { Category } = req.query;
  try {
    const blogs = await BlogModel.find({ Category: { $regex: Category, $options: 'i' } });
    res.json(blogs);
  } catch (error) {
    console.log(error)
  }
})
userroute.get('/blogs',authMiddleware,async(req,res)=>{
  const { order } = req.query;

  try {
    const sortOrder = order === 'asc' ? 1 : -1;

    const sortedBlogs = await BlogModel.find().sort({ Date: sortOrder });

    res.json(sortedBlogs);
}


catch(error){
  console.log(error)
}
})
  
userroute.put('/blogs/:id',authMiddleware,async(req,res)=>{
  try {
      let id=req.params.id
      let data= await BlogModel.findByIdAndUpdate(id,req.body)
      res.status(200).send("data updated")
  } catch (error) {
      console.log(error)
  }
})
userroute.delete('/blogs/:id',authMiddleware,async(req,res)=>{
  try {
      let id=req.params.id
      let data= await BlogModel.findByIdAndDelete(id)
      res.status(200).send("data deleted")
  } catch (error) {
      console.log(error)
  }
})


userroute.put('/blogs/:id/like', authMiddleware, async (req, res) => {
  try {

    const { id } = req.params;
    const user=req.body.user
    const blog = await BlogModel.findById(id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    if (blog.likes.includes(user._id)) {
      return res.status(400).json({ message: 'You have already liked this blog' });
    }
    blog.likes.push(user._id);
    await blog.save();

    res.json({ message: 'Blog liked successfully' });
  } catch (error) {
    console.log(error)
  }
});

userroute.put('/blogs/:id/comment', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const user=req.body.user

   
    const blog = await BlogModel.findById(id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    
    const comment = {
      content,
      username: user.Username, 
    };

   
    blog.comments.push(comment);
    await blog.save();

    res.json({ message: 'Comment added successfully' });
  } catch (error) {
   console.log(error)
  }
});
module.exports={
  userroute
}