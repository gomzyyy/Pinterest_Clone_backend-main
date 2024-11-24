import express from "express";
import dotenv from "dotenv";
import cors from "cors";
//configuration
dotenv.config({});
import connectMongoDB from "./database/mongoDB.js"
import route from "./routes/routes.js";
//constants
const app = express();
const PORT = process.env.PORT;
const corsOptions = {
  origin: "*",
  credentials: true,
};
//middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//routes

app.get("/", (req, res) => {
  res.json({
    message: "data recieved",
  });
});

app.use("/api", route)

//server

app.listen(PORT, (req, res) => {
  // console.log(`http://localhost:${PORT}/`);
  // console.log('connecting to database...')
  connectMongoDB();
});
