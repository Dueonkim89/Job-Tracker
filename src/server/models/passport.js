import passport from "passport";

import { getUserByID } from "../models/userModel";
const JwtStrategy = require("passport-jwt").Strategy,
    ExtractJwt = require("passport-jwt").ExtractJwt;

let jwtOptions = {};

jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = process.env.JWT_SECRET;
let strategy = new JwtStrategy(jwtOptions, async function (jwt_payload, next) {
    console.log("payload received", jwt_payload);
    let user = await getUserByID(jwt_payload.id);
    if (user) {
        next(null, user);
    } else {
        next(null, false);
    }
});
// use the strategy
passport.use(strategy);
