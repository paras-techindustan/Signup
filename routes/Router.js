const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const express=require('express')
const Router=express.Router();
const{ User}=require('../models/user')


Router.post('/adduser',async(req,res)=>{
    let user=await User.findOne({email:req.body.email})
    if(user){return res.status(400).send('user already exist')}

    user=new User({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password
    })
    const salt= await bcrypt.genSalt(10);
    user.password= await bcrypt.hash(user.password,salt);
    await user.save();
    res.send(user);
})

Router.post('/login',async(req,res)=>{
    let user=await User.findOne({email:req.body.email})
    if(!user){return res.status(400).send('invalid email')}

   let validPassword= await bcrypt.compare(req.body.password,user.password);
   if(!validPassword){return res.status(400).send('invalid password')}

   const token=jwt.sign({email:user.email,password:user.password},'jwtPrivateKey');
   res.send(token);
})



exports.Router=Router;