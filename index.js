import "./localEnv.js";
import express from "express"; // connecting BD
import morgan from "morgan";
import { conn } from "./db/conn.js";
conn();
import cors from "cors";
import usersRoutes from "./routes/users.js";

const app = express();

// this dev shows the log when checking the router
app.use(morgan("dev")); // logging routes
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3100;
console.log(process.env.ATLAS_URI);

// this connects the route in the router/user.js
app.use("/api/users", usersRoutes);

// main root route
app.get("/", (req, res) => {
  res.send("This is the main route");
});

app.listen(PORT, () => {
  console.log(`Server at port: ${PORT}`);
});
