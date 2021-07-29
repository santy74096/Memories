import React,{useState,useEffect} from 'react'
import {Link,useHistory} from 'react-router-dom'
import M from 'materialize-css'

const Signup = () =>{

    const history = useHistory();   //will be used to route user to login once signup is finished

    const [name,setName] = useState("");
    const [password,setPassword] = useState("");
    const [email,setEmail] = useState("");

    //profile pic
    const [image,setImage] = useState("");
    const [url,setUrl] = useState(undefined);//initially if pic is not available we will show default pic saved in DB(Model)


    useEffect(()=> {
        if(url){
            uploadFields();
        }
    },[url])


    //upload profile pic
    const uploadPic = () => {
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

    const uploadFields = () => {
        fetch("/signup", {   
            method : "post",
            headers:{
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({
                name,
                password,
                email,
                pic:url
            })
        })
        .then(res => res.json())    //data will be sent as json
        .then(data =>{
            if(data.error){
                M.toast({html: data.error, classes:"#e53935 red darken-1"});    //toast is like alert but with better UI
            }
            else {
                M.toast({html : data.message, classes:"#66bb6a green lighten-1"})
                history.push('/signin');    //route user to login once sighup is finished
            }
        })
        .catch(err =>{
            console.log(err);
        })
    }

    //this function will make post req to server
    const Postdata = () =>{ 
        if(image){
            uploadPic();
        }else{
            uploadFields();
        }
    }

    return (
        <div className="mycard">
            <div className="card auth-card">
                <h2>Instagram</h2>
                <input type="text" placeholder="name" value={name} onChange={(e) => setName(e.target.value)} />
                <input type="text" placeholder="email" value={password} onChange={(e) => setPassword(e.target.value)} />
                <input type="text" placeholder="password" value={email} onChange={(e) => setEmail(e.target.value)} />

                <div className="file-field input-field">
                    <div className="btn blue darken-2" >
                        <span>Upload Profile Pic</span>
                        <input type="file" onChange = {(e) => setImage(e.target.files[0])} />       
                    </div>                                                                         
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>

                <button className="btn waves-effect waves-light #64b5f6 blue lighten-2" onClick = {() =>Postdata()}>Signup</button>

                <h5>
                    <Link to="/signin">Already have an account ?</Link>
                </h5>
            </div>
        </div>
        
    )
}

export default Signup
