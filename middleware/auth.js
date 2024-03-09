const { getUser } = require("../service/auth");
async function restrictToLoggedinUserOnly(req, res, next) {
    const userUid = req.cookies?.uid;
    if (!userUid) {
        if (req.path !== '/login') {
            return res.redirect("/login");
        }
        return next();
    }
    const user = getUser(userUid);
    if (!user) {
        if (req.path !== '/login') {
            return res.redirect("/login");
        }
        return next();
    }
    req.user = user;
    next();
}
module.exports = {
    restrictToLoggedinUserOnly,
};
