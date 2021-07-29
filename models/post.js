const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types    //use to connect user who upload this post

//define post schema
const postSchema = new mongoose.Schema({
    title : {
        type : String,
        require : true
    },
    body : {
        type : String,
        require : true
    },
    photo : {
        type : String,
        require:true
    },
    /*
        in our post Schema, we reference the User collection, because we want the user to be tied to the things they post, 
        and we want to be able to easily access those posts without having to create more queries.
        And with that, our schemas are set.
     */
    likes : [{type:ObjectId, ref : "User"}],    //likes will be the array of users who liked the post

    comments:[{
        text:String,
        postedBy:{type : ObjectId,ref : "User"}
    }],

    //connection of post with user 
    postedBy : {
        type : ObjectId,
        ref : "User"
    }
})

mongoose.model("Post",postSchema);