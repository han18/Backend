const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  user_id: {
    // creating a relationship with the user for the profile
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  content: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Comment", commentSchema);
