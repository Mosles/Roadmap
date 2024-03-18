// validation.js
const { check, validationResult } = require('express-validator');

exports.userValidationRules = () => {
  return [
    check('username')
      .isLength({ min: 3, max: 10 }).withMessage('Username must be between 3 and 10 characters long')
      .isAlphanumeric().withMessage('Username must contain only letters and numbers'),
    check('password')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    // Add more validation rules as needed
  ];
}

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array().map(err => err.msg) });
  }
  next();
};
