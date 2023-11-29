const { User } = require('../models/User');

let auth = async (req, res, next) => {
    try {
        let token = req.cookies.x_auth;
        const user = await User.findByToken(token);
        if (!user) {
            return res.json({ isAuth: false, error: true });
        }

        req.token = token;
        req.user = user;
        next();
    } catch (err) {
        res.status(500).send(err);
    }
};



module.exports = { auth };