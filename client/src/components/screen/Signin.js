import React,{useState,useContext} from 'react'
import {Link,useHistory} from 'react-router-dom'
import { userContext } from '../../App'
import M from 'materialize-css'

const Signin = () =>{

    const {state,dispatch} = useContext(userContext);

    const history = useHistory();   

    const [password,setPassword] = useState("");
    const [email,setEmail] = useState("");

  
    
    const Postdata = () =>{ 
         fetch("signin", {   
            method : "post",
            headers:{
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({
                password,
                email
            })
        })
        .then(res => res.json())    
        .then(data =>{  //this data will be same which was set from sign as res.json({token,user:{_is,name,email}})
            //console.log(data);
            if(data.error){
                M.toast({html: data.error, classes:"#e53935 red darken-1"});    //toast is like alert but with better UI
            }
            else {
                localStorage.setItem("jwt",data.token); //storing in local storage so that can be accessed by protected routes like createPost 
                localStorage.setItem("user",JSON.stringify(data.user));

                dispatch({type:"USER",payload:data.user});

                M.toast({html : "signed in succefully", classes:"#66bb6a green lighten-1"})
                history.push('/');    //route user to home once sighin is finished
            }
        })
        .catch(err =>{
            console.log(err);
        })
    }


    return (
        <div className="mycard">
            <div className="card auth-card">
                <h2>Instagram</h2>
                <input type="text" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />

                <button className="btn waves-effect waves-light #64b5f6 blue lighten-2" onClick={() => Postdata()}>Signin</button>

                <h5>
                    <Link to="/signup">Don't have an account ?</Link>
                </h5>
            </div>
            
        </div>
    )
}

export default Signin
