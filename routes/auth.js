const express=require('express');
const router=express.Router();  //create router
const mongoose = require('mongoose');
const User = mongoose.model("User");

const bcrypt=require('bcryptjs');   //for hashing the password because we can't store it as plane text

const jwt = require('jsonwebtoken');    //to authenticate and authorise user
const {JWT_SECRET} = require('../config/key'); //secret key

const requireLogin = require('../middleware/requireLogin');

//email verification for forgot password
// const nodemailer =require('nodemailer');
// const sendgridTransport = require('nodemailer-sendgrid-transport')
//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



// router.get('/',(req,res) =>{
//     res.send('this is route')
// })

//to check howtoken is working
// router.get('/protected',requireLogin,(req,res) =>{
//     res.send('hello i am protected.To access me you need a token');
// })

// SIGHUP USER
router.post('/signup',(req,res)=>{   //post route can't be test in browser so we will use postman to use 
    //console.log(req.body);
    const {name,email,password,pic}=req.body;
    if(!email || !password || !name){
       return res.status(422).json({error : "please add all field"});
    }
    //res.json({message : "successfully posted"});

    //sighup user
    User.findOne({email:email}) //find the user using email
    .then((savedUser) =>{           //check with promises if req has been completed or rejected
        if(savedUser){
            return res.status(422).json({message:'user already exist with this email'});    //if user already sign up
        }

        //password hashing

        bcrypt.hash(password,12)    //hash function will hash the generate a hashed password
        .then((hashedPassword) =>{
            //define the user 
            const user=new User({
                email,
                password : hashedPassword,
                name,
                pic:pic
            })

            user.save()   //save the info in DB
            .then((user) =>{
                res.json({message : "saved succesfully"});
            })
            .catch((err)=>{
                console.log(err);
            })
        })
    })
    .catch((err)=>{
        console.log(err);
    })
})

//SIGN IN USER                                                  
router.post('/signin',(req,res) =>{
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(422).json({error : "please add email or password"});
    }

    User.findOne({email:email})
    .then((savedUser) =>{
        if(!savedUser){
            return res.status(422).json({error : "Invalid email or password"});
        }

        bcrypt.compare(password,savedUser.password) //compare function will compare user password and hashed password saved in DB. This function returns boolean value
        .then(doMatch =>{
            if(doMatch){
                //res.json({message : "successfully signed in"});
                /*
                    if we do authentication with this approach then we can't be able stop user to accessing any protected resource 
                    For this we will use jsonwebtoken
                    this means that now  user will come along a token provided and id tcurrent user hash that token then only he can access 
                    protected resources
                 */

                const token = jwt.sign({_id : savedUser._id},JWT_SECRET);//{_id : savedUser._id} means we are providing token based on user id and assign that token to id

                const {_id,name,email,followers,following,pic} = savedUser;
                res.json({token,user:{_id,name,email,followers,following,pic}})   //{token : token} can be written as {token} because it as same name
                //res.json() will return all the data when we login
            }
            else{
                return res.status(422).json({error : "Invalid email or password"});
            }
        })
        .catch((err)=>{
            console.log(err);
        })
    })
    .catch((err)=>{
        console.log(err);
    })
})


module.exports=router;