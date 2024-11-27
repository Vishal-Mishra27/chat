import { children, useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Button } from "./components/ui/button";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./pages/auth";
import Profile from "./pages/profile/index";
import Chat from "./pages/chat";
import { Navigate } from "react-router-dom";
import { useAppStore } from "./stores";
import apiClient from "./lib/api-client";
import { GET_USER_INFO } from "./utils/constants";

const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

const AuthRoute = ({children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/chat" /> : children;
};


function App() {
const {userInfo,setUserInfo}=useAppStore()
const [loading,setLoading]=useState(true)

useEffect(()=>{
  const getUserData=async(e)=>{
try{
    const response=await apiClient.get(GET_USER_INFO,{
      withCredentials:true
    })
    if(response.status===200 && response.data.id){
      setUserInfo(response.data)
  console.log("done");
    }
    else if(e){
      setUserInfo(undefined)
  console.log("eroor",e);

    }
    console.log({response})
}
catch(error){
  console.log(error)
      setUserInfo(undefined);
}finally{
  setLoading(false)
}
  }
  if(!userInfo){
    getUserData()
  }
  else{
    setLoading(false);
  }
},[userInfo,setUserInfo])

if(loading){
  return <div>Loading...</div>
}

  return (
    <>
      {/* <Button>Click me</Button> */}

      <Router>
        <Routes>
          <Route
            path="/auth"
            element={
              <AuthRoute>
                <Auth />
              </AuthRoute>
            }
          />
          <Route path="*" element={<Navigate to="/auth" />}/>
        <Route path="/" element={<Auth/>}/>
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <PrivateRoute>
                <Chat />
              </PrivateRoute>
            }
         />
        </Routes>
      </Router>
    </>
  );
}

export default App;
