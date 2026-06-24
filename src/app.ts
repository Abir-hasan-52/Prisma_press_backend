import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import config from "./config";
import { prisma } from "./lib/prisma";
import { userRouter } from "./modules/user/user.route";
import { authRouter } from "./modules/auth/auth.routes";

const app: Application = express();

// middle ware
app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", async (req: Request, res: Response) => {
  const user = await prisma.user.findMany();
  console.log(user);
  res.send("hello , world!");
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

export default app;
