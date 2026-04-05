const {body, validationResult} = require('express-validator');

function handleValidationErrors(req, res, next) {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    next()
}

const registerUserValidation = [
    body("username")
        .isString()
        .withMessage("Username should be string")
        .isLength({min: 3, max: 30})
        .withMessage("Username must be between 3 and 30 characters"),
    body("email")
        .isEmail()
        .withMessage("Please provide a valid email"),
    body("password")
        .isLength({min: 6})
        .withMessage("Password must be at least 6 characters"),
    handleValidationErrors
]

const loginUserValidation = [
    body("password")
        .notEmpty()
        .withMessage("Password is required"),
    handleValidationErrors
]

module.exports = {registerUserValidation, loginUserValidation, handleValidationErrors}