const jwt = require('jsonwebtoken');

const config = require('config');

module.exports = function (req, res, next) {

    //get token form header
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied.' });
    }

    //verify token
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid.' });
    }
}






















//This middleware generates an exclusive token fo reach user to authenticate them. this tokens req.user
// is then passed to the users.js and from there auth.js makes use of that token to suseccfully log in the user.
