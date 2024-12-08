import express from "express"
import dotenv from "dotenv";
import dbConnect from "./DB/dbConnect.js";
import authRouter from "./route/authUser.js"
import messageRouter from "../backend/route/messageRoute.js"
import cookieParser from "cookie-parser";
import userRouter from "./route/userRoute.js"
dotenv.config(); //used to safeguard endpoint port,through dotenv it can be accessed from anywhere
const app=express();

app.use(express.json());
app.use(cookieParser());
//to accept json data
app.use('/api/auth',authRouter)
app.use('/api/message',messageRouter)
app.use('/api/user',userRouter)


app.post('/',(req,res)=>{
   res.send("Response sent")
})



const PORT=process.env.PORT 
app.listen(PORT,()=>{
    dbConnect()
    console.log(`Working at ${PORT}`)
})