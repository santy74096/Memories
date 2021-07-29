import React, { useState,useEffect } from 'react'
import M from 'materialize-css'
import {useHistory} from 'react-router-dom'

function CreatePost() {

    const history = useHistory(); 

    const [title,setTitle] = useState("");
    const [body,setBody] = useState("");
    const [image,setImage] = useState("");
    const [url,setUrl] = useState("");  //get url from cloudinary

    useEffect(() =>{
        //setUrl(data.url); this is a async func
        //so useEffect will come into state when url will be changed successfully
        //because we want to make network req from server after the req from cloudinary will be completed
        //if we get the url then we will furthur make req from server
        if(url){
            //req server to upload createPost data
            fetch("http://localhost:5000/createPost", {   
                method : "post",
                headers:{
                    "Content-Type" : "application/json",
                    "Authorization" : "Bearer "+localStorage.getItem("jwt")//getting the token so we don't need to signin again and again
                },
                body : JSON.stringify({
                    title,
                    body,
                    pic : url
                })
            })
            .then(res => res.json())    
            .then(data =>{  //this data will be same which was set in post.js at route server side
                //console.log(data);
                if(data.error){
                    M.toast({html: data.error, classes:"#e53935 red darken-1"});    //toast is like alert but with better UI
                }
                else {
                    M.toast({html : "post created succesfully", classes:"#66bb6a green lighten-1"})
                    history.push('/');    //route user to home once sighin is finished
                }
            })
            .catch(err =>{
                console.log(err);
            })
        }

    },[url])

    /*
        Uploading a file
            Files can be uploaded using an HTML <input type="file" /> input element, FormData() and fetch().

            const formData = new FormData();
            const fileField = document.querySelector('input[type="file"]');

            formData.append('username', 'abc123');
            formData.append('avatar', fileField.files[0]);

            fetch('https://example.com/profile/avatar', {
            method: 'PUT',
            body: formData
            })
            .then(response => response.json())
            .then(result => {
            console.log('Success:', result);
            })
            .catch(error => {
            console.error('Error:', error);
    */      

    /*
    
        To upload image we will CLOUDINARY for free cloud service 
        We will store image there, cloudinary will generate a url
        Then we will store that url in our database

    */

    const postDetails = () =>{
        //network req to cloudinary 
        const data = new FormData()
        data.append("file",image);
        data.append("upload_preset","insta-clone")  //insta-clone is name of upload-preset
        data.append("cloud-name","santy74096");      //santy74096 cloud name
        fetch("	https://api.cloudinary.com/v1_1/santy74096/image/upload",{  //https://api.cloudinary.com/v1_1/santy74096 cloud url then add /image/upload to upload image
            method:"post",
            body:data
        })
        .then(res => res.json())
        .then(data =>{
            //console.log(data);    //data will caontain the info of image stored at cloudinary along with url
            setUrl(data.url);
        })
        .catch(err => {
            console.log(err);
        })
    }


    return (
        <div className="card input-field" style={{
            margin:"10px auto",
            padding:"20px",
            maxWidth:"500px",
            textAlign:"center"
        }}>
            <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input type="text" placeholder="Body" value={body} onChange={(e) => setBody(e.target.value)} />

            <div className="file-field input-field">
                <div className="btn blue darken-2" >
                    <span>Upload Image</span>
                    <input type="file" onChange = {(e) => setImage(e.target.files[0])} />       
                </div>                                                                         
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>
            <button className="btn waves-effect waves-light #64b5f6 blue darken-2" onClick={()=>postDetails()}>Submit</button>
        </div>
    )
}

export default CreatePost
    //console.log(e.target.files) return following
                    // FileList {0: File, length: 1}
                    //     0: File
                    //         lastModified: 1556176369571
                    //         lastModifiedDate: Thu Apr 25 2019 12:42:49 GMT+0530 (India Standard Time) {}
                    //         name: "IMG_20181009_121723_609.jpg"
                    //         size: 52736
                    //         type: "image/jpeg"
            
                    //from 0th index of FileList array we can access info related to upload image
