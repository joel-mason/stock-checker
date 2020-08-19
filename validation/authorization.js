const jwt_decode = require("jwt-decode");

module.exports = function validateAuthHeader(req) {
    if (!req.headers.authorization || req.headers.authorization.indexOf('Bearer ') === -1) {
        return setRet(401, 'Missing Authorization Header', null);
        //return res.status(401).json({ message: 'Missing Authorization Header' });
    }
    const user = jwt_decode(req.headers.authorization);
    const userId = req.params.userId;
    if(userId !== user.id) {
        return setRet(401, 'Not Authorized', user)
    }
    return setRet(200, '', user);
}

function setRet(status, message, user) {
    return {
        status: status,
        message: message,
        user: user
    }
}