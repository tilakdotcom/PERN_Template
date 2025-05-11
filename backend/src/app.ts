import dotEnv from "dotenv";
import helmet from "helmet";
dotEnv.config({
  path: "./.env",
});
import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/errorHandler.middleware";
import { CORS_ORIGIN } from "./constants/getEnv";
const app: Express = express();

//middlewares
app.use(helmet());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

//cors middleware
const corsOptions: cors.CorsOptions = {
  origin: CORS_ORIGIN,
  credentials: true,
};

app.use(cors(corsOptions));

//cookie middleware
app.use(cookieParser());

// import routes and declaratio
import healthRoutes from "./core/routes/health.routes";
import authRoutes from "./core/routes/auth.routes";
import userRoutes from "./core/routes/user.routes";

//  use routes
app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use(errorHandler);

export { app };
