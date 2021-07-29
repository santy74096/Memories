import React,{useContext} from 'react'
import {Link,useHistory} from 'react-router-dom'
import { userContext } from '../App'

function NavBar() {

    const {state,dispatch} =useContext(userContext);    //state contain the user info like _id,name etc

    const history = useHistory();

    const renderList = () => {
        if(state){  //if we have user then render profile and create post
            return [
                <li><Link to="/createpost">Create Post</Link></li>,
                <li><Link to="/profile">Profile</Link></li>,
                <li><Link to="/myfollowerspost">My following posts</Link></li>,
                <li>
                    <button className="btn waves-effect waves-light  #e53935 red darken-1" 
                    onClick={() => {
                        localStorage.clear();   //clear all local storage containig user token and user info
                        dispatch({type:"CLEAR"});   //clear action to clear central storage
                        history.push('/signin');
                    }}
                    >Logout</button>
                </li>
            ]
        }
        else{   
            return [
                <li><Link to="/signup">Signup</Link></li>,
                <li><Link to="/signin">Signin</Link></li>
            ]
        }
    }

    return (  
        <nav>
        <div className="nav-wrapper white">
            <Link to={state ? '/' : '/signin'} className="brand-logo left">INSTAGRAM</Link>   
            <ul id="nav-mobile" className="right">
                {renderList()};
            </ul>
        </div>
        </nav>
    )
}

export default NavBar
