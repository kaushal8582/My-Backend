import dotenv from "dotenv"
import connectDB from "./db/index.js";
import app from "./app.js";

dotenv.config(
  { 
    path: "./.env" 
  }
)

connectDB()
.then(()=>{
  
  app.listen(process.env.PORT,()=>{
    console.log("Server is starded at Port : ",process.env.PORT);
  })
})
.catch((err)=>{
  console.log("MONGO DB Connection failed  !!!!", err);
})

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
