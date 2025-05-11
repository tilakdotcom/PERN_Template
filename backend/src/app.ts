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
import categoryRoutes from "./core/routes/cotegory.routes";
import blogRoutes from "./core/routes/blog.routes";
import highlightRoutes from "./core/routes/highlight.routes";
import productRoutes from "./core/routes/protuct.routes";
import authRoutes from "./core/routes/auth.routes";
import userRoutes from "./core/routes/user.routes";
import checkoutRoutes from "./core/routes/checkout.routes";
import orderRoutes from "./core/routes/order.routes";

//  use routes
app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/blog", blogRoutes);
app.use("/api/v1/highlight", highlightRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/checkout", checkoutRoutes);
app.use("/api/v1/order", orderRoutes);

app.use(errorHandler);

export { app };
