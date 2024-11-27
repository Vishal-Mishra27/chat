// import { request } from 'express'
import jwt from 'jsonwebtoken'

export const verifyToken=(request,response,next)=>{
    const token = request.cookies.jwt;
    // console.log({token})
    
    if (!token) {
        // console.log("token ")
      return response
        .status(401)
        .json({ message: "No token, authorization denied" });
    }
        jwt.verify(token,process.env.JWT_key,async(err,payload)=>{
            if(err){
              return response.status(403).json({ message: "Token is invalid" });
              console.log(err)
            }
                request.userId = payload.userId;
                next()     
        })
}