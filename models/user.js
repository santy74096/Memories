const mongoose=require('mongoose');
const {ObjectId} = mongoose.Schema.Types

//user schema
const userSchema = new mongoose.Schema({
    name : {
        type:String,
        required:true
    },
    email : {
        type:String,
        required:true
    },
    password : {
        type:String,
        required:true
    },
    pic:{
        type:String,
        default:"https://res.cloudinary.com/santy74096/image/upload/v1627467842/no-user-image_mzfsmd.gif"
    },
    followers:[{type:ObjectId,ref:"User"}],
    following:[{type:ObjectId,ref:"User"}],
})

mongoose.model("User",userSchema);