const { validationResult } = require("express-validator")

// middleware

exports.runValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send({ error: errors.array()[0].msg })
    }
    next();
}