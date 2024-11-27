import User  from "../models/UserModel.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import {renameSync, unlinkSync} from "fs"
const  maxAge=3*24*60*60*1000

const createToken=(email,userId)=>{
    return jwt.sign({email,userId},process.env.JWT_KEY,{expiresIn:maxAge})
}

 


export const signup = async (request, response, next) => {
  try {
    const { email, password } = request.body;
    if (!email || !password) {
      return response
        .status(400)
        .json({ message: "email and password are required" });
    }
    const user = await User.create({ email, password });
    response.cookie("jwt", createToken(email, user.id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });

    return response.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
      },  
    });
  } catch (error) {
    return response
      .status(500)
      .json({ error: error.message, message: "Internal server error" });
  }
};


export const login = async (request, response, next) => {
  try {
    const { email, password } = request.body;
    if (!email || !password) {
      return response
        .status(400)
        .json({ message: "email and password are required" });
    }
    const user = await User.findOne({ email });
    if(!user){
      return response.status(401).json({message:"Invalid email"})
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return response.status(401).json({ message: "Invalid password" });
      }

    response.cookie("jwt", createToken(email, user.id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });

    return response.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstName:user.firstName,
        lastName:user.lastName,
        image:user.image,
        color:user.color
      },
    });
  } catch (error) {
    return response
      .status(500)
      .json({ error: error.message, message: "Internal server error" });
  }
};

export const getUserInfo= async (request, response, next) => {
  try {

        // console.log(request.userId)
        const userData = await User.findById(request.userId);
        if(!userData){
          return response.status(404).send({message:"Invalid user id"})
          }

    return response.status(200).json({
      // user: {
        id: userData.id,
        email: userData.email,
        profileSetup: userData.profileSetup,
        firstName: userData.firstName,
        lastName: userData.lastName,
        image: userData.image,
        color: userData.color,
      // },
    });
  } catch (error) {
    return response
      .status(500)
      .send({ error: error.message, message: "Internal server error" });
      console.log({error})
  }
};

export const updateProfile= async (request, response, next) => {
  try {
        const {userId} = request
        const {firstName, lastName, image, color} = request.body;
        if(!firstName || !lastName ){
          return response.status(400).send({message:"Firstname lastname and color is required."})
          }

          const userData=await User.findByIdAndUpdate(userId,{
            firstName,
            lastName,
            color,
            profileSetup:true
          },{new:true, runValidators:true})
    return response.status(200).json({
        id: userData.id,
        email: userData.email,
        profileSetup: userData.profileSetup,
        firstName: userData.firstName,
        lastName: userData.lastName,
        image: userData.image,
        color: userData.color,
    });
  } catch (error) {
    return response
      .status(500)
      .send({ error: error.message, message: "update profile not successfull" });
      // console.log({error})
  }
};

// add image

export const addProfileImage = async (request, response, next) => {
  try {
  if(!request.file){
    return response.status(400).send("File is required.")
  }
  const date=Date.now()
  let fileName="uploads/profiles/" + date + request.file.originalname;
  renameSync(request.file.path,fileName)

  const updatedUser=await User.findByIdAndUpdate(request.userId,{
    image:fileName
  },
  {new:true,runValidators:true}
)

    return response.status(200).json({
     image:updatedUser.image,
    });
  } catch (error) {
    return response
      .status(500)
      .send({
        message: "update profile not successfull",
      });
    // console.log({error})
  }
};

export const removeProfileImage = async (request, response, next) => {
  try {
    const { userId } = request;
   const user=await User.findById(userId)

   if(!user){
    return response.status(404).json({message:"User not found"})
   }

   if(user.image){
    unlinkSync(user.image)
   }

   user.image=null
   await user.save()

    return response.status(200).json({
message:"Profile image removed Successfull"
    });
  } catch (error) {
    return response.status(500).send({
      error: error.message,
      message: "update profile not successfull",
    });
    // console.log({error})
  }
};


export const  logout= async (request, response, next) => {
  try {
   response.cookie("jwt","",{maxAge:1,secure:true,sameSite:"None"})
   response.status(200).send("Logout successfull")
  } catch (error) {
    return response.status(500).send({
      error: error.message,
      message: "update profile not successfull",
    });
    // console.log({error})
  }
};