const jwt =require('jsonwebtoken');
const {JWT_SECRET} = require('../config/key');
const mongoose = require('mongoose');
const User = mongoose.model('User');

//Signin middleware to authorise user using jsonwebtoken(jwt)
module.exports = (req,res,next) =>{
    const {authorization} = req.headers //authorization spelling should be correct z not s
    //authorisation === Bearer Token it is combination of bearer and token, so we need to get token from it
    
    if(!authorization){
        return res.status(401).json({error : "you must be logged in"});
    }

    const token = authorization.replace("Bearer ","");  //getting token
    

    jwt.verify(token, JWT_SECRET, (err,payload) =>{     //verify funtion will verify the user using token and JWT_SECRET
        if(err){
            return res.status(401).json({error : "you must be logged in"});
        }

        const {_id}=payload;    //get the id is user authorised
        User.findById(_id)      //find user in DB
        .then(userData =>{
            req.user=userData      // save data in req.user
            next();
        })
        
    })
}