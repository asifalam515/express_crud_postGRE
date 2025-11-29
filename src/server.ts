import express, { Request, Response } from "express";
const app = express();
const port = 5000;
// parser
app.use(express.json());
app.use(express.urlencoded());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});
app.post("/", (req: Request, res: Response) => {
  console.log(req.body);
  res.status(200).json({
    success: true,
    message: "api is working",
  });
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
