import express, { Request, Response } from "express";
const port = process.env.PORT || 3000;
const app = express();

app.listen(port, () => {
  console.log(`Watch Toby Chip on ${port}`);
});
