import React, { useState, useEffect, useCallback, useContext } from 'react'
import {userContext} from '../../App'
import {Link} from 'react-router-dom'

const Home = () =>{

    const [data,setData] = useState([]);

    const {state,dispatch} = useContext(userContext);

    useEffect(() =>{
        fetch('/getsubpost', {
            headers:{
                "Authorization" : "Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res => res.json())
        .then(result => {
            //console.log(result);
            setData(result.posts);
            //console.log(data);
            
        })
    },[])

    const likePost = (id) => {
        fetch('/like',{
            method:"put",   //put method used whenever we require an update (we can also use post)
            headers:{
                "Content-Type" : "application/json",
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            },
            body :JSON.stringify({
                postId : id
            })
        })
        .then(res => res.json())
        .then(result => {
            //console.log(result);
            const newData = data.map(item => {
                if(item._id == result._id){
                    return result
                }
                else{
                    return item;
                }
            })

            setData(newData);
        }).catch(err => {
            console.log(err);
        })
    }

    const unlikePost = (id) => {
        fetch('/unlike',{
            method:"put",
            headers:{
                "Content-Type" : "application/json",
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            },
            body : JSON.stringify({
                postId : id
            })
        })
        .then(res => res.json())
        .then(result => {
            //console.log(result);
            const newData = data.map(item => {
                if(item._id == result._id){
                    return result
                }
                else{
                    return item;
                }
            })

            setData(newData);
        }).catch(err => {
            console.log(err);
        })
    }


    const makeComment = (text,postId) => {
        fetch('/comment',{
            method:"put",
            headers:{
                "Content-Type" : "application/json",
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            },
            body :  JSON.stringify({
                postId,
                text
            })
        }).then(res => res.json())
        .then(result => {
            console.log(result);
            const newData = data.map(item => {
                if(item._id == result._id){
                    return result
                }
                else{
                    return item;
                }
            })
            setData(newData);
        }).catch(err => {
            console.log(err);
        })
    }

    //delete post
    const deletePost = (postId) => {
        fetch(`/deletepost/${postId}`, {
            method:"delete",
            headers:{
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
        .then(result => {
            console.log(result);
            const newData=data.filter(item => {
                return item._id != result._id;
            })
            setData(newData);
        }).catch(err => {
            console.log(err);
        })
    }

    //{item.postedBy.name}
    return (
        <div className="home">
            { 
                data.map(item => {   
                    return (
                        <div className="card home-card" key={item._id}>
                            <h5 style={{padding:"5px"}}><Link to={item.postedBy._id != state._id ? "/profile/"+item.postedBy._id : "/profile"}>
                                {item.postedBy.name}
                            </Link>  
                                {
                                    item.postedBy._id == state._id && // show delete icon to user's posts only
                                    <i class="material-icons" style={{float:"right"}} onClick={()=>deletePost(item._id)} >delete</i>
                                    
                                }
                            </h5>    
                            <div className="card-image">
                                <img src={item.photo} />
                            </div>
                            <div className="card-content">
                                <i className="material-icons" style={{color:"red"}}>favorite</i>

                                {
                                    item.likes.includes(state._id)
                                    ? <i  className="material-icons" onClick={() =>unlikePost(item._id)}>thumb_down</i>
                                    : <i className="material-icons" onClick={() =>likePost(item._id)}>thumb_up</i>
                                }

                                <h6>{(item.likes.length)} Likes</h6>
                                <h6>{item.title}</h6>
                                <p>{item.body}</p>

                                {
                                    item.comments.map(record => {
                                        return(
                                            <h6 key={record._id}> <span 
                                                style={{fontWeight:"500",margin:"0px 10px"}}>{record.postedBy.name }
                                                </span> 
                                                {record.text}  
                                            </h6>
                                        )
                                    })
                                }

                                <form onSubmit = {(e) => {
                                    e.preventDefault(); //prevent automatic refresh on submit
                                    //console.log(e.target);  //return input in the form
                                   // console.log(e.target[0].value); //return the comment from input field
                                   makeComment(e.target[0].value,item._id);
                                }}>

                                    <input type="text" placeholder="add a comment" />

                                </form>
                                
                            </div>
                        </div>
                    )
                })
            }
        </div>
        
    )
}

export default Home
