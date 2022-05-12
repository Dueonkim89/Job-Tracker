import "dotenv/config";
import path from "path";
import express, { Express, Request, Response, ErrorRequestHandler } from "express";
import bodyParser from "body-parser";
import session from "express-session";
import { chosenDBConfig } from "./config/db";
import router from "./router";
import passport from "./config/passport";
const cors = require("cors");
const MySqlStore = require("express-mysql-session")(session);

const buildDir = path.join(process.cwd(), "/build");

// Middleware
export const app: Express = express();
app.use(
    session({
        secret: process.env.SESSION_SECRET as string,
        store: new MySqlStore(chosenDBConfig), // TBU Stanely - ensure this part is correct
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24,
        },
    })
);

const corsOption = {
    origin: "*",
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

app.use("/api", router);

// Source: https://stackoverflow.com/questions/50218878/typescript-express-error-function
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({ success: false, message: err.message });
    return;
};

app.use(errorHandler);

app.get("/*", function (req: Request, res: Response) {
    res.sendFile(path.join(buildDir, "index.html"));
});

if (process.env.NODE_ENV !== "test") {
    const port = process.env.PORT ? parseInt(process.env.PORT) : 3001;
    console.log("checking port", port);
    app.listen(port, () => {
        console.log(`Server now listening on port: ${port}`);
    });
}
