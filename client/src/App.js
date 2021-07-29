import React,{useEffect,createContext,useReducer,useContext} from 'react';
import NavBar from './components/NavBar'
import './App.css';
import {BrowserRouter, Route, Switch, useHistory} from'react-router-dom'
import Home from './components/screen/Home'
import Profile from './components/screen/Profile'
import Signin from './components/screen/Signin'
import Signup from './components/screen/Signup'
import CreatePost from './components/screen/CreatePost'
import UserProfile from './components/screen/UserProfile'
import SubscribedUserPosts from './components/screen/SubscribedUserPosts'

import {reducer,initialState} from './reducers/useReducer'


export const userContext = createContext();

//we need to access history because if user have token then he will be allowed to access protected resources otherwise he will redirected to signin page
//but we can't use history inside App component because we can use history in route like home , signup etc and we have wrraped all those inside BrowerRouter
//So we will create another component to tackle this problem

const Routing = () =>{

  const history = useHistory();

  const {state,dispatch} = useContext(userContext); //dispatch funtion dipatch the data from central store to user and vice-versa

  useEffect(() =>{
    const user = JSON.parse(localStorage.getItem("user"));

    if(user){
      dispatch({type:"USER",payload:user}); //update the info
      //history.push('/');
    }
    else{
      history.push('/signin');
    }
    //console.log(user);
  },[])

  //switch will ensure that at a time only one route should be active it is optional
  return(
    <Switch>  
        <Route exact path='/'>
          <Home />
        </Route>
        <Route path='/signin'>
          <Signin />
        </Route>
        <Route path='/signup'>
          <Signup />
        </Route>
        <Route exact path='/profile'>
          <Profile />
        </Route>
        <Route path='/createpost'>
          <CreatePost />
        </Route>
        <Route path='/profile/:userid'>
          <UserProfile />
        </Route>
        <Route path='/myfollowerspost'>
          <SubscribedUserPosts />
        </Route>
    </Switch>
  )
}


function App() {

  const [state,dispatch] =useReducer(reducer,initialState);

  return (
    //wrap up all in userContext so that data like token will accesible for every route
    <userContext.Provider value={{state,dispatch}} > 

      <BrowserRouter>
        <NavBar />
        <Routing />
      </BrowserRouter>
    
    </userContext.Provider>

  )
}

export default App;
