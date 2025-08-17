const {check} = require("express-validator")

exports.addDepartmentValidator = [
    check('name').not().isEmpty().withMessage("Department name is required")
]