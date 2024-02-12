import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  user_id: {
    // creating a relationship with the user for the profile
    type: mongoose.Schema.ObjectId,
    ref: "User",
    //     required: true,
  },
  content: {
    type: String,
    //     required: true,
  },


export default mongoose.model("Comment", commentSchema);
