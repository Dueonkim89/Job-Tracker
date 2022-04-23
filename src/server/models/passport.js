import passport from 'passport';
import { getUserByID } from "../models/userModel";
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;


let jwtOptions = {};

jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'd5bb8b56620cc82ee7d0ebda543f26414e8547051469fe642a64100b918767c5ef5494efe3659742853f83d425562098ca450abbc8d38f3f5dfcc2aceb22b78a';
let strategy = new JwtStrategy(jwtOptions, async function(jwt_payload, next) {
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