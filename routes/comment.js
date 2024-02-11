import { Router } from "express";
import Comment from "../models/comments.js";

const router = new Router();

// this creates a new comment
router.post("/", async (req, res) => {
  try {
    const comment = new Comment(req.body);
    await comment.save();
    res.status(201).json(comment);
  } 
  }
});
