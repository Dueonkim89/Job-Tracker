import passport from "passport";
import { getUserByID } from "../models/userModel";
import passportJWT from "passport-jwt";
const { Strategy, ExtractJwt } = passportJWT;

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET as string,
};

const strategy = new Strategy(jwtOptions, async function (jwt_payload, next) {
    if (process.env.NODE_ENV !== "test") console.log("payload received", jwt_payload);
    const user = await getUserByID(jwt_payload.id);
    if (user) {
        next(null, user);
    } else {
        next(null, false);
    }
});
// use the strategy
passport.use(strategy);
