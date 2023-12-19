import passport from "passport";

function authenticateJwt(req:any, res: any, next: any) {
  passport.authenticate("jwt", async function (err: any, user: any, info: any) {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = user;
    next();
  })(req, res, next);
}

export { authenticateJwt };
