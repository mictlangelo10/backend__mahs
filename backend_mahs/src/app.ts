import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

/*  DotEnv  */
const port = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
