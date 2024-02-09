// this is a function file that connects the application with MongoDB

// imported it into the index.js file

import mongoose from "mongoose";

export async function conn() {
  try {
    await mongoose.connect(process.env.ATLAS_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error.message);
  }
}
