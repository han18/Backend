// this files holds a single database collection document

import mongoose from "mongoose";
import bcrypt from "bcrypt";

// how strong the hash should be
const SALT_ROUNDS = 10;

const usersSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      minLength: 3,
      maxLength: 15,
      required: true,
    },
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      minLength: 8,
      maxLength: 50,
      required: true,
    },
  },
  // hashing a password
  {
    timestamps: true, // date of when the recourses were created
    toJSON: {
      transform: function (doc, retDoc) {
        delete retDoc.password; // removes pass from the json doc
        return retDoc;
      },
    },
  }
);

//======================= INDEX ====
// creating an index to organize data to find it easier
usersSchema.index({ email: 1 });

//====== Bcrypt For Password Hashing ======
// creating a password hash pre save hook
usersSchema.pre("save", async function (next) {
  // if the password has not been modified
  if (!this.isModified("password")) return next();

  //if the pass has been changed
  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
  return next();
});

export default mongoose.model("User", usersSchema);
