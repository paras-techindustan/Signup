const mongoose=require('mongoose');


const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String
    }
})

const User=mongoose.model('User',userSchema);

exports.User=User;