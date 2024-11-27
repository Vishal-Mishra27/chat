// const express=require('express')
import express from 'express'
// const  dotenv=require('dotenv')
import dotenv from 'dotenv'
// const mongoose = require('mongoose');
import mongoose from "mongoose";
// const cors=require('cors')
import cors from "cors";
// const cookieParser=require('cookie-parser')
import cookieParser from "cookie-parser";
import authRoutes from "./routes/AuthRoutes.js";
import contactsRoutes from "./routes/ContactRoutes.js";
import setupSocket from './socket.js';

// import messagesRoutes from './routes/MessagesRoutes.js';
import messagesRoutes from "./routes/MessagesRoutes.js";

 

// dotenv.config({ path: './config.env' })
dotenv.config()
const app = express();

const port=process.env.PORT 
const MONGO_URI = process.env.DATABASE_URL;

app.use(
  cors({
    origin: [process.env.ORIGIN],
    methods:["GET","POST","PUT","PATCH","DELETE"],
    credentials:true
  })
);

app.use("/uploads/profiles", express.static("uploads/profiles"))
app.use("/uploads/files", express.static("uploads/files"));

app.use(cookieParser())
app.use(express.json())

app.use("/api/auth",authRoutes)
app.use("/api/contacts", contactsRoutes);
app.use("/api/messages", messagesRoutes);

mongoose.connect(MONGO_URI)
.then(() => console.log('DB Connection Successfull'))
.catch(err => console.log('DB Connection Failed', err));

const server=app.listen(port,()=>{
    console.log(`Server is running on port http://localhost:${port}`)
})

setupSocket(server)
