import { Router } from "express";
import User from "../models/users.js";

const router = new Router();

// GET: returns all users
router.get("/", async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
});

//GET: Gets USERS BY ID
router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) return res.status(404).json({ msg: "ID Not Found" });
  else res.json(user);
});

//============================================

//======= Getting users by their username ===
// this didn't work
// 2. GET: Create a route to get a user by username
router.get("/username/:username", async (req, res) => {
  const username = req.params.username;

  try {
    // Find the user by username in the database
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ msg: "Username not found" });
    }

    // return it as JSON
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(404).json({ msg: "Error" });
  }
});

//================ End of Username ============

//==== POST METHOD ROUTE=========
//POST: Creates New Users
router.post("/", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ user });
  } catch (error) {
    console.log(error);
  }
});

//Jan 19, 2024
//PUT: ==== Updates a user and restricting password
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;

    //! Stops request from updating the user's password
    if (body.password) {
      delete body.password;
      console.log("Password removed from body");
    }

    const updatedUser = await User.findByIdAndUpdate(id, body, { new: true });
    res.json(updatedUser);
  } catch (error) {
    console.log(error);
    res.json({ msg: "User Not found!" });
  }
});

//DELETE:
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleteUser = await User.findByIdAndDelete(id);
    res.json({ msg: "User was deleted", deleteUser });
  } catch (error) {
    console.log(error);
  }
});

//================== Updating Password====
/**
 * PUT /:id/update-password
 * @param: client needs to send body:
 * {
 *  currentPassword: "my old password"
 *  newPassword: "my new password"
 * }
 *
 * We can use NodeMailer here to send emails before updating the password
 */
router.put("/:id/update-password", async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    // find the user to update
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ msg: "User not found!" });

    // verify the old password with the password hash in db
    const passwordMatched = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!passwordMatched) {
      return res.status(401).json({ msg: "Authentication Error" });
    }

    console.log("password matched!");

    // hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    // set the old password hash to the newPassword hash
    await User.findByIdAndUpdate(id, { password: hashedPassword });

    res.json({ msg: "User password updated", user });
  } catch (error) {
    console.log(error);
  }
});

//=============================
//==== Authenticating Password ==========

/**
 * POST /login
 * @description authenticates an user with email and password
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // find user with the provided email
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ msg: "Invalid Credentials" });
  }

  // verify provided password with password hash from db
  const passwordMatched = await bcrypt.compare(password, user.password);

  if (!passwordMatched) {
    return res.status(401).json({ msg: "Invalid Credentials password" });
  }

  // TODO: generate a jwt token and send it to the client
  res.json({ msg: "User is logged in!", user });
});

export default router;

// this is the old code for getting the username
// router.get("/:username", async (req, res) => {
//   const user = await User.find({}).populate({ path: "age" });

//   if (!user) return res.status(404).json({ msg: "User Not Found!" });
//   else res.json(user);
// });

// previous code for the put method
// router.put("/:id", async (req, res) => {
//   const { id } = req.params; //
//   const { body } = req;
//   const updatedUser = await User.findByIdAndUpdate(id, body, { new: true });

//   res.json(updatedUser);
// });
