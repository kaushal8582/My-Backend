import dotenv from "dotenv"
import connectDB from "./db/index.js";

dotenv.config(
  { 
    path: "./env" 
  }
)
connectDB()

/*
import express from "express";
const app = express();
;(async ()=>{
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
    app.on("Error",(error)=>{
      console.log("Error",error);
      throw error
    })

    app.listen(process.env.PROT,()=>{
      console.log("Server is listen on port : ",process.env.PORT);
    })

  } catch (error) {
    console.log(error);
  }
})()

*/