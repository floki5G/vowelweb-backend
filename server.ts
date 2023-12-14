import express from "express";
import http from "http";
import morgan from "morgan";
import compression from "compression";
import { shouldCompress } from "./src/middlewares/global";
import useragent from "express-useragent";
import path from "path";
import cors from "cors";
import { config } from "dotenv";
import adminRouter from "./src/routes";
config();
// ? Configuration variables
const app = express();

// ? set router config
const server = http.createServer(app);

// ? Set dev logger for better viewing response with optimization
app.use(morgan("dev"));

// ? Set compression for better performance
app.use(compression({ filter: shouldCompress }));

// ? ENABLE behind a reverse proxy (Heroku, AWS elb, Nginx)
app.set("trust proxy", 1);

// ? Setup express response and body parser configurations
app.use(express.json());
app.use(useragent.express());
app.use(express.static(path.join(__dirname, process.env.BUILD_PATH ?? "")));

// ? configure cors domian options
app.use(
  cors({
    origin: "*",
    optionsSuccessStatus: 200,
  })
);

// ? Default header configurations
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Content-Length, X-Requested-With, x-lang"
  );
  return next();
});

// ? Set routes for express
app.use("/v1/api/admin", adminRouter);



// ? Set static folder path
app.use(express.static(path.resolve(process.env.BUILD_PATH ?? "./dist/")));

// ? Set default route
app.get("*", (_req, res) => {
  // ? Serve index.html
  return res.sendFile(
    path.resolve(process.env.BUILD_PATH ?? "./dist/", "index.html")
  );
});

// ? Run express and socket
server.listen(4000, () => {
  console.log(`Server running on ${4000}`);
  // socket({ io });
});

export default server;