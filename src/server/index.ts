import "./env";
import path from "path";
import express, { Express, Request, Response, ErrorRequestHandler } from "express";
import bodyParser from "body-parser";
import userRouter from "./routes/userRouter";
import applicationRouter from "./routes/applicationRouter";
import session from "express-session";
import passport from "passport";
import jobsRouter from "./routes/jobRouter";
import companyRouter from "./routes/companyRouter";
require("./models/passport");
const MySqlStore = require("express-mysql-session")(session);

const buildDir = path.join(process.cwd(), "/build");

// Middleware
const app: Express = express();
app.use(
    session({
        secret: "session_cokie_secret",
        store: new MySqlStore({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_DATABASE,
            port: 3306,
        }),
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24,
        },
    })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(express.static(buildDir));

app.get("/", function (req: Request, res: Response) {
    res.sendFile(path.join(buildDir, "index.html"));
});

app.use("/api/users", userRouter);
app.use("/api/applications", applicationRouter);
app.use("/api/jobs", jobsRouter);
app.use("/api/companies", companyRouter);

// Source: https://stackoverflow.com/questions/50218878/typescript-express-error-function
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({ success: false, message: err.message });
    return;
};

app.use(errorHandler);

const port = 3001;
console.log("checking port", port);
app.listen(port, () => {
    console.log(`Server now listening on port: ${port}`);
});
