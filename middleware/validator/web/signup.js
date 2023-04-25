const { body, validationResult } = require('express-validator')
const userModel = require('../../../models/user');

exports.userSignupValidationRules =  [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').notEmpty().withMessage('email is required').normalizeEmail().custom(value => {
      return userModel.findOne({email:value}).then(user => {
        if (user) {
          return Promise.reject('E-mail already in use');
        }
      });
    }),
    body('mobile_no').notEmpty().withMessage('mobile no is required').isMobilePhone().withMessage('mobile no not valid'),
    body('password').notEmpty().withMessage('Password is required').isLength({ min: 8 }).withMessage('Minimum 8 character required password length.'),
    body('confirm_password').custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Password confirmation does not match password');
        }    
        // Indicates the success of this synchronous custom validator
        return true;
      }),

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

