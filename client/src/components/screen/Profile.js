import React,{useEffect,useState,useContext} from 'react'
import {userContext} from '../../App'

const Profile = () =>{

    const [mypics,setPics] = useState([]);

    const {state,dispatch} = useContext(userContext);

    //profile pic
    const [image,setImage] = useState("");
    

    useEffect(()=>{
        fetch('/mypost',{
            headers:{
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            }
        })
        .then(res => res.json())
        .then(result => {
            //console.log(result);
            setPics(result.myposts);
        })
    },[])

    //update profile
    useEffect(()=>{
        if(image){
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
                fetch('/updatepic',{
                    method:"put",
                    headers:{
                        "Content-Type" : "application/json",
                        "Authorization" : "Bearer "+localStorage.getItem("jwt")
                    },
                    body:JSON.stringify({
                        pic:data.url
                    })
                }).then(res => res.json())
                .then(result =>{
                    //console.log(result);
                    localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}));   //spread state and override the pic url
                    dispatch({type:"UPDATEPIC",payload:result.pic});  
                })
            })
            .catch(err => {
                console.log(err);
            })
        }
    },[image])

    //update profile pic
    const updatePhoto = (file) => {
        setImage(file);
    }

    return (
        <div style={{maxWidth:"550px",margin:"0px auto"}}>
            <div style={{
                        margin:"18px 0px",
                        borderBottom:"1px solid grey"
                }}>
                
            
                <div style={{
                        display:"flex",
                        justifyContent:"space-around",
                        margin:"18px 0px",
                        // borderBottom:"1px solid grey"
                }}>
                    
                    <div>
                        <img style={{width:"160px", height:"160px",borderRadius:"80px"}} src={state ? state.pic : "loading.."}/>
                        
                    </div>
                    


                    <div>
                        <h4>{state ? state.name : "Loading"}</h4>   
                        <h5>{state ? state.email : "Loading"}</h5>   
                        <div style={{
                            display:"flex", 
                            justifyContent:"space-between",
                            width:"108%"
                        }}>
                            <h6>{mypics.length} posts</h6>
                            <h6>{state ? state.followers.length : "0"} followers</h6>
                            <h6>{state ? state.following.length : "0"} following</h6>
                        </div>
                    </div>
                </div>
                
                <div className="file-field input-field" style={{margin:"10px"}}>
                    <div className="btn blue darken-2" >
                        <span>Update Profile</span>
                        <input type="file" onChange = {(e) => updatePhoto(e.target.files[0])} />       
                    </div>                                                                         
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
            </div>


            <div className="gallery">
                {
                    mypics.map(item => {
                        return (
                            <img className="item" style={{width:"160px", height:"160px"}} src={item.photo} alt={item.title} key={item._id} />
                        )
                    })
                }

            </div>
            
        </div>
    )
}

export default Profile
