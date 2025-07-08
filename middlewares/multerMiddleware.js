const jwt = require('jsonwebtoken')
require('dotenv').config();

exports.authMiddleware = async (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            const token = req.headers.authorization.split(' ')[1]
            const decode = jwt.verify(token, process.env.JWT_SECRET)
            req.user = decode
            console.log({decode})
            next();
        } catch (err) {
            return res.status(401).send({ message: 'Invalid token, not authorized' })
        }
    } else {
        return res.status(401).send({ message: 'Empty token, not authorized' })
    }
}