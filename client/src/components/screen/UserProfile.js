import React,{useEffect,useState,useContext} from 'react'
import {userContext} from '../../App'
import { useParams } from 'react-router-dom'

const UserProfile = () =>{

    const [profile,setProfile] = useState(null);

    const {state,dispatch} = useContext(userContext);

    const {userid} =useParams();

    const [showfollow,setShowFollow] = useState(state ? !state.following.includes(userid) : true);

    //console.log(userid);

    useEffect(()=>{
        fetch(`/user/${userid}`,{
            headers:{
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            }
        })
        .then(res => res.json())
        .then(result => {
            //console.log(result);
            
            setProfile(result);
        }).catch(err => {
            console.log(err);
        })
    },[])

    //follow user
    const followUser = () => {
        fetch('/follow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                followId:userid
            })
        }).then(res => res.json())
        .then(data => {

            //console.log(data);
            dispatch({type:"UPDATE",payload:{
                following:data.following,
                followers:data.followers
            }})

            localStorage.setItem("user",JSON.stringify(data));
            setProfile((prevState) => {
                return {
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:[...prevState.user.followers,data._id]
                    }
                }
            })
            setShowFollow(false);
            
        }).catch(err => {
            console.log(err);
        })
    }

    //unfollow user
    const unfollowUser = () => {
        fetch('/unfollow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                unfollowId:userid
            })
        }).then(res => res.json())
        .then(data => {

            //console.log(data);
            dispatch({type:"UPDATE",payload:{
                following:data.following,
                followers:data.followers
            }})

            localStorage.setItem("user",JSON.stringify(data));

            

            setProfile((prevState) => {
                const newFollower = prevState.user.followers.filter(item=>item !== data._id)
                return {
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:newFollower
                    }
                }
            })
            setShowFollow(true);
            
        }).catch(err => {
            console.log(err);
        })
    }

    return (
        <>
        {profile  ? //if profile exist then show 

            <div style={{maxWidth:"550px",margin:"0px auto"}}>
            <div style={{

                    display:"flex",
                    justifyContent:"space-around",
                    margin:"18px 0px",
                    borderBottom:"1px solid grey"
            }}>
                <div>
                    
                    <img style={{width:"160px", height:"160px",borderRadius:"80px"}} 
                        src={profile.user.pic}
                    />
                </div>
                <div>
                    <h4>{profile.user.name}</h4>   
                    <h5>{profile.user.email}</h5>   
                    <div style={{
                        display:"flex", 
                        justifyContent:"space-between",
                        width:"108%"
                    }}>
                        <h6>{profile.posts.length} posts</h6>
                        <h6>{profile.user.followers.length} followers</h6>
                        <h6>{profile.user.following.length} following</h6>
                    </div>
                    {
                        showfollow ?
                            <button style={{margin : "10px"}} className="btn waves-effect waves-light #64b5f6 blue lighten-2" onClick={() => followUser()}>Follow</button>
                        :
                            <button style={{margin : "10px"}}className="btn waves-effect waves-light #64b5f6 blue lighten-2" onClick={() => unfollowUser()}>Unfollow</button>
                    }
                </div>
            </div>

            <div className="gallery">
                {
                    profile.posts.map(item => {
                        return (
                            <img className="item" style={{width:"160px", height:"160px"}} src={item.photo} alt={item.title} key={item._id} />
                        )
                    })
                }

            </div>
            
        </div>

        : <h2>Loading...</h2>}
        
        </>
    )
}

export default UserProfile
