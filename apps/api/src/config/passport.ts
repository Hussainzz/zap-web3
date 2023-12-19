import db  from "@zap/core/src/models";
import user from "@zap/core/src/models/users";
const User = user(db?.sequelize, db?.Sequelize);


import passportStrategies from "passport-jwt";

const JwtStrategy = passportStrategies.Strategy;
const ExtractJwt = passportStrategies.ExtractJwt;

export default (passport: any) => {

  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
      },
      async (payload: any, done: any) => {
        try {
          const user = await User.findOne({
            attributes: ['id', 'fullname', 'email'],
            where:{
              id: payload.id
            }
          });
          if (user && user?.dataValues) {
            return done(null, user?.dataValues);
          }
          return done(null, false);
        } catch (e) {
          return done(e, false);
        }
      }
    )
  );
};
