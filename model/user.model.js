const mongoose=require('mongoose')
const UserSchema=mongoose.Schema({
    Username:{type:String,require:true},
    avtar:{type:String,require:true},
    email:{type:String,require:true},
    password:{type:String,require:true},
   
})

const UserModel=mongoose.model("Users",UserSchema)
module.exports={
    UserModel
}