import React from 'react'
import Victory from "@/assets/victory.svg"
// import Tabs from '@/components/ui/tabs'
// import TableList from "@/components/ui/tabs";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs.jsx";
import { Input } from "@/components/ui/input";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import LoginPng from '@/assets/login2.png'
import { toast } from 'sonner';
import apiClient from "@/lib/api-client"
import { LOGIN_ROUTES, SIGNUP_ROUTE } from '@/utils/constants';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/stores';

export default function Auth() {
  const navigate=useNavigate()
  const [email, setemail] = useState()
  const [password, setpassword] = useState()
  const [confirmPassword, setconfirmPassword] = useState()
  const {setUserInfo}=useAppStore()
  
  const validateLogin=()=>{
    if (!email.length) {
      toast.error("Email is required ");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required ");
      return false;
    }
    return true;
  }  

  const validateSignup=()=>{
    if(!email.length){
      toast.error("Email is required ")
      return false
    }
    if(!password.length){
      toast.error("Password is required ")
      return false
    }
    if(!confirmPassword.length){
      toast.error("Confirm password is required ")
      return false
    }

    if(password!==confirmPassword){
      toast.error("Password and confirm password should be same")
      return false
    }
    return true
  }

//   const  handlelogin=async()=>{
//     if(validateLogin()){
//       const response = await apiClient.post(LOGIN_ROUTES,{email,password},
//         {withCredentials:true},
//       )

//         console.log({ response });
//         toast.success("Login success full");

//       if(response.data.user.id){
//         setUserInfo(response.data.user)
//         if(response.data.user.profileSetup){
//           navigate('/chat')
//         }
//         else{
//           navigate('/profile')
//         }
//       }
//   }
// } 

const handlelogin = async () => {
  try {
    // Validate the login form before proceeding
    if (validateLogin()) {
      // Make the API request
      const response = await apiClient.post(
        LOGIN_ROUTES,
        { email, password },
        { withCredentials: true }
      );

      // Log the response for debugging purposes
      console.log({ response });

      // Show a success toast if login is successful
      toast.success("Login successful");

      // Check if the user exists in the response and set user info
      if (response.data.user.id) {
        setUserInfo(response.data.user);

        // Navigate to different routes based on the profile setup
        if (response.data.user.profileSetup) {
          navigate("/chat");
        } else {
          navigate("/profile");
        }
      }
    }
  } catch (error) {
    // Check if the error is an Axios error with a response
    if (error.response) {
      // If the response status is 404, show an error message
      if (error.response.status === 404) {
        toast.error("User not found. Please check your email or sign up.");
      } else {
        // Handle other error statuses like 500, etc.
        toast.error("Something went wrong. Please try again later.");
      }
    } else if (error.request) {
      // Handle the case where the request was made but no response was received
      toast.error("Network error. Please check your internet connection.");
    } else {
      // Handle any other unexpected errors
      toast.error("An unexpected error occurred.");
    }
  }
};


const handlesignup = async () => {
  if (validateSignup()) {
    const response = await apiClient.post(SIGNUP_ROUTE, { email, password },
      {withCredentials:true});
    console.log({ response });
      toast.success("Sign up success full");
      if(response.status===201){
        setUserInfo(response.data.user);
        navigate('/profile')
      }
      console.log({response}) 
  }
  else{
    toast.error("Sign up unsuccessfull");
  }
};

// };
  return (
    // <div className="h-[100vh] w-[100vw] flex items-center justify-center">
    //   <div className="h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[97vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
    //     <div className="flex flex-col gap-10 items-center justify-center">
    //       <div className="flex items-center justify-center flex-col">
    //         <div className="flex items-center justify-center">
    //           <h1 className="text-5xl font-bold md:text-6xl">Welcome</h1>
    //           <img src={Victory} alt="victory emoji" className="h-[100px]" />
    //         </div>
    //         <p className="font-medium text-center">
    //           Fill in the details to get started with the best chat app!
    //         </p>
    //       </div>
    //       <div className="flex items-center justify-center w-full">
    //         <Tabs className="w-3/4">
    //           <TabsList className="bg-transparent rounded-none w-full">
    //             <TabsTrigger
    //               value="login"
    //               className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
    //             >
    //               Login
    //             </TabsTrigger>
    //             <TabsTrigger
    //               value="signup"
    //               className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
    //             >
    //               Signup
    //             </TabsTrigger>
    //           </TabsList>
    //           <TabsContent className="flex flex-col gap-5 mt-10" value="login">
    //             <Input
    //               placeholder="email"
    //               type="email"
    //               className="rounded-full p-6"
    //               value={email}
    //               onChange={(e) => setemail(e.target.value)}
    //             />
    //             <Input
    //               placeholder="password"
    //               type="password"
    //               className="rounded-full p-6"
    //               value={password}
    //               onChange={(e) => setpassword(e.target.value)}
    //             />
    //             <Button className="rounded-full p-6" onClick={handlelogin}>
    //               Login
    //             </Button>
    //           </TabsContent>
    //           <TabsContent className="flex flex-col gap-5 " value="signup">
    //             <Input
    //               placeholder="email"
    //               type="email"
    //               className="rounded-full p-6"
    //               value={email}
    //               onChange={(e) => setemail(e.target.value)}
    //             />
    //             <Input
    //               placeholder="password"
    //               type="password"
    //               className="rounded-full p-6"
    //               value={password}
    //               onChange={(e) => setpassword(e.target.value)}
    //             />
    //             <Input
    //               placeholder="Confirm password"
    //               type="password"
    //               className="rounded-full p-6"
    //               value={confirmPassword}
    //               onChange={(e) => setconfirmPassword(e.target.value)}
    //             />
    //             <Button className="rounded-full p-6" onClick={handlesignup}>
    //               Sign Up
    //             </Button>
    //           </TabsContent>
    //         </Tabs>
    //       </div>
    //     </div>
    //     <div className="hidden xl:flex justify-center items-center">
    //       <img src={LoginPng} alt="background login" className="h-[500px]" />
    //     </div>
    //   </div>
    // </div>

    <div className="h-[100vh] w-[100vw] flex items-center justify-center">
      <div className="h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[97vw] sm:w-[90vw] md:w-[80vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid grid-cols-1 xl:grid-cols-2">
        <div className="flex flex-col gap-6 sm:gap-8 items-center justify-center">
          <div className="flex items-center justify-center flex-col">
            <div className="flex items-center justify-center gap-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
                Welcome
              </h1>
              <img
                src={Victory}
                alt="victory emoji"
                className="h-[80px] sm:h-[100px]"
              />
            </div>
            <p className="font-medium text-center text-sm sm:text-base md:text-lg">
              Fill in the details to get started with the best chat app!
            </p>
          </div>

          <div className="flex items-center justify-center w-full">
            <Tabs className="w-3/4 sm:w-4/5 lg:w-3/4">
              <TabsList className="bg-transparent rounded-none w-full flex justify-around">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                >
                  Signup
                </TabsTrigger>
              </TabsList>
              <TabsContent className="flex flex-col gap-5 mt-10" value="login">
                <Input
                  placeholder="email"
                  type="email"
                  className="rounded-full p-4 sm:p-5"
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                />
                <Input
                  placeholder="password"
                  type="password"
                  className="rounded-full p-4 sm:p-5"
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                />
                <Button
                  className="rounded-full p-4 sm:p-5"
                  onClick={handlelogin}
                >
                  Login
                </Button>
              </TabsContent>
              <TabsContent className="flex flex-col gap-5" value="signup">
                <Input
                  placeholder="email"
                  type="email"
                  className="rounded-full p-4 sm:p-5"
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                />
                <Input
                  placeholder="password"
                  type="password"
                  className="rounded-full p-4 sm:p-5"
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                />
                <Input
                  placeholder="Confirm password"
                  type="password"
                  className="rounded-full p-4 sm:p-5"
                  value={confirmPassword}
                  onChange={(e) => setconfirmPassword(e.target.value)}
                />
                <Button
                  className="rounded-full p-4 sm:p-5"
                  onClick={handlesignup}
                >
                  Sign Up
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Right Side Image (Visible only on xl screens) */}
        <div className="hidden xl:flex justify-center items-center">
          <img
            src={LoginPng}
            alt="background login"
            className="h-[400px] sm:h-[500px] lg:h-[600px]"
          />
        </div>
      </div>
    </div>
  );
}
