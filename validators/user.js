const { check } = require("express-validator")

exports.addEmployeeValidator = [
    check('name').not().isEmpty().withMessage("Name is required"),
    check('email').isEmail().withMessage("Enter valid email"),
    check('password').isLength({min:6}).withMessage("Password must be of 6 character"),
    check('role').not().isEmpty().withMessage("Role is required"),
    check('level').not().isEmpty().withMessage("Level is required"),
    check('reportsTo').not().isEmpty().withMessage("ReportTo is required"),
    check('department').not().isEmpty().withMessage("Department is required"),
    check('designation').not().isEmpty().withMessage("Designation is required"),
]