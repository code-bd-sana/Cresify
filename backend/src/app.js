import express from 'express';
import connectDB from './configure/db.js';
import cors from "cors"
import cookieParser from "cookie-parser";
import index from '../src/route/index.js'


export const app = express();



app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://cresify.vercel.app"
  
    ],
    credentials: true,
  })
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use('/api', index)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

connectDB();