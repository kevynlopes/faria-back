import express from "express";
import cors from "cors";
import routes from "./routes/index";

export const createServer = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use("/api", routes);

  return app;
};
