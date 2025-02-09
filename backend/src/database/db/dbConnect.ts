import pkg from "pg";
import {
  DB_HOST,
  DB_NAME,
  DB_PORT,
  DB_USER,
  PASSWORD,
} from "../../constants/getEnv";
const { Pool } = pkg;

const dbConnect = new Pool({
  host: DB_HOST,
  port: Number.parseInt(DB_PORT),
  user: DB_USER,
  password: PASSWORD,
  database: DB_NAME,
});

dbConnect.on("error", (err) => {
  console.error("Error connecting to PostgreSQL database:", err.stack);
});
dbConnect.on("connect", () => {
  console.log("Connected to PostgreSQL database");
});

export default dbConnect;
