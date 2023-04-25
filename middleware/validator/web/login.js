const { body, validationResult } = require('express-validator')

exports.userLoginValidationRules =  [
    body('email').notEmpty().withMessage('email is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required').isLength({ min: 8 }).withMessage('Minimum 8 character required password length.'),

    // password must be at least 5 chars long
    (req, res, next) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array);
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}];

