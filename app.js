const express=require('express');
const app=express();
const mongoose=require('mongoose');
const PORT=process.env.PORT || 5000;

//const cors = require('cors')    //cors will allow to fetch data from frontend(at 3000) from backend(5000) sice we are working on diff ports

//app.use(cors()) // Use this after the variable declaration



/*
    const customMiddleware=(req,res,next) => {  //middleware are something which takes an incoming req and modify it before itreaches to route handler
        console.log('Middleware executed');
        next(); //this function ensure that after work middleware should move to next req,if we don't use this then server will hang
    }

    app.use(customMiddleware); //for middleware we use .use();
*/

//MONGO DB CONNECTION START
const {MONGOURL}=require('./config/key');  

mongoose.connect(MONGOURL,{ //function to connect mongo with online mongo Cloud Atlas
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(result => {
    //console.log("mongo connected");
}).catch(err => {
    console.log(err);
})

mongoose.connection.on('connected',() =>{   //to connect mongoDB with server
    console.log('connected to mongo');
})
mongoose.connection.on('error',(err) =>{
    console.log('err connecting',err);
})

//MONGO DB CONNECTION END

require('./models/user');   //register for User schema (no need store it variable because we are not exporting it)
require('./models/post');   //register for Post schema

app.use(express.json())   //this middleware will help to pass req to postman so we can test our app having post req... use before routes

app.use(require('./routes/auth'));   //register the router
app.use(require('./routes/post'));   //register the post
app.use(require('./routes/user'));   


// app.get('/',(req,res) =>{
//     res.send('hello santy');
// })

//if we want to use middleware only before about page then we pass this middleware as argument
/*
    app.get('/about', customMiddleware,(req,res) =>{
        //console.log('This is About');
        res.send('This is About page');
    })
*/

//deployment 
if(process.env.NODE_ENV == 'production'){  
    app.use(express.static('client/build') ) //serve the static css and js file first in build folder
    const path = require('path')
    //if client making any req we will send index.html(static) in build folder since it contain all react code
    app.get("*",(req,res) => {
        res.sendFile(path.resolve(__dirname,'client','build','index.html'));
    })
}


app.listen(PORT,()=>{
    console.log("server is runnin on",PORT);
})
