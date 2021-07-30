const express=require('express');
const router=express.Router();  //create router
const mongoose = require('mongoose');
const requireLogin = require('../middleware/requireLogin');
const Post = mongoose.model("Post");

//this route is get all posts 
router.get('/allpost',requireLogin,(req,res) => {
    Post.find()    //no condition since we want all post
    .populate("postedBy","_id name")    //this method will provide data contained in postedBy,second arg is for select field i.e which fields we want to get
    .populate("comments.postedBy","_id name")
    .sort('-createdAt')  //createdAt will be created by timestamps:true,  - is for decreasing  order
    /*
        The properties that we want to use .populate() on are properties that have a type of mongoose.Schema.Types.ObjectId. 
        This tells Mongoose “Hey, I’m gonna be referencing other documents from other collections”. The next part of that property 
        is the ref. The ref tells Mongoose “Those docs are going to be in the ___ collection.”
        So in our post Schema, we reference the User collection, because we want the user to be tied to the things they post, 
        and we want to be able to easily access those posts without having to create more queries.
        And with that, our schemas are set.
    */
    .then(posts => {
        res.json({posts})
    })
    .catch(err => {
        console.log(err);
    })
})

// get all post of following
router.get('/getsubpost',requireLogin,(req,res) => {
    //if postedby is in following list
    Post.find({postedBy:{$in:req.user.following}})    
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .sort('-createdAt')
    .then(posts => {
        res.json({posts})
    })
    .catch(err => {
        console.log(err);
    })
})

//this is post route which will help to upload a post by user
router.post('/createPost',requireLogin,(req,res) =>{
    const {title,body,pic} = req.body;
    if(!title || !body || !pic){
        return res.status(422).json({error : "please add all the field"});
    }
    //console.log(req.user);    req.user is the info of user which we are getting from requireLogin middleware
    //res.send("ok");

    req.user.password=undefined;    //because here we don't want to post password of user
    const post = new Post({
        title,
        body,
        photo:pic,
        postedBy : req.user //connection of post with user using user id
    })
    post.save()
    .then(result => {
        res.json({post : result});
    })
    .catch(err => {
        console.log(err);
    })
})

//this route is to get all posts upload by only user
router.get('/mypost',requireLogin,(req,res) => {
    Post.find({postedBy : req.user._id})
    .populate("postedBy","_id name")
    .then(myposts => {
        res.json({myposts});
    })
    .catch(err => {
        console.log(err);
    })
})

//this router will update the likes and unlikes
router.put('/like',requireLogin,(req,res) => {
    Post.findByIdAndUpdate(req.body.postId,{    //postId will be from frontend
        $push:{likes:req.user._id}, //push method will push current user into likes array since he has liked the post
        },{
               new:true                     // this means that update the data to new data
    }).exec((err,result) =>{                //execute the query
        if(err){
            return res.status(422).json({error : err});
        }
        else{
            res.json(result);
        }
    })
})

//unlike router
router.put('/unlike',requireLogin,(req,res) => {
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}, //pull will delete user from likes array who unliked the post 
        },{
            new:true
    }).exec((err,result) =>{
        if(err){
            return res.status(422).json({error : err});
        }
        else{
            //console.log(result);
            res.json(result);
        }
    })
})


//this router will update comments
router.put('/comment',requireLogin,(req,res) => {

    const comment={
        text:req.body.text,
        postedBy:req.user._id
    }

    Post.findByIdAndUpdate(req.body.postId,{    //postId will be from frontend
        $push:{comments:comment}, //push method will push current user into likes array since he has liked the post
        },{
               new:true                     // this means that update the data to new data
    }).populate("comments.postedBy","_id name")
    .populate("postedBy", "_id name")
    .exec((err,result) =>{
        if(err){
            return res.status(422).json({error : err});
        }
        else{
            res.json(result);
        }
    })
})

//delete post
router.delete('/deletepost/:postId',requireLogin,(req,res) => {  //we will send postId or id along with url as parameter
    Post.findOne({_id:req.params.postId})
    .populate("postId", "_id")
    .exec((err,post) => {
        if(err){
            return res.status(422).json({error:err});
        }
        if(post.postedBy._id.toString() === req.user._id.toString()){
            post.remove()
            .then(result =>{
                res.json(result)
            })
            .catch(err => {
                console.log(err);
            })
        }
    })
})

module.exports = router;