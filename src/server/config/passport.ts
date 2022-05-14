import passport from "passport";
import userModel from "../models/userModel";
import passportJWT from "passport-jwt";
import { UserFields } from "../types/user";
const { Strategy, ExtractJwt } = passportJWT;

function init() {
    const jwtOptions = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET as string,
    };

    const strategy = new Strategy(jwtOptions, async function (jwt_payload, next) {
        if (process.env.NODE_ENV !== "test") console.log("payload received", jwt_payload);
        const user = await userModel.getUserByID(jwt_payload.id);
        if (user) {
            next(null, user);
        } else {
            next(null, false);
        }
    });
    // use the strategy
    passport.use(strategy);
    return passport;
}

declare global {
    namespace Express {
        interface User extends Required<UserFields> {}
    }
}

export default init();
