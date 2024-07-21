import mongoose from "mongoose";

const subscriptionSchem = new mongoose.Schema({
  subscriber:{
    type:mongoose.Types.ObjectId,
    ref:"User",
  },
  channel:{
    type:mongoose.Types.ObjectId,
    ref:"User"
  }
},{timestamps:true})

export const subscription = mongoose.model("subscription",subscriptionSchem)