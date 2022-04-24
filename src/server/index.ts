import "./env";
import path from "path";
import express, { Express, Request, Response, ErrorRequestHandler } from "express";
import bodyParser from "body-parser";
import userRouter from "./routes/userRouter";
import applicationRouter from "./routes/applicationRouter";
import session from "express-session";
import passport from "passport";
require('./models/passport');
const cors = require("cors");
const MySqlStore = require('express-mysql-session')(session);


const buildDir = path.join(process.cwd(), "/build");

// Middleware
const app: Express = express();
app.use(session({
    key: 'session_cokie_name',
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
    cookie:{
        maxAge:1000*60*60*24
    }
})
);

const corsOption = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
};
app.use(cors(corsOption));
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

app.use("/users", userRouter);
app.use("/applications", applicationRouter);

// Source: https://stackoverflow.com/questions/50218878/typescript-express-error-function
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({ message: err.message });
    return;
};

app.use(errorHandler);

const port = 3001;
console.log("checking port", port);
app.listen(port, () => {
    console.log(`Server now listening on port: ${port}`);
});
