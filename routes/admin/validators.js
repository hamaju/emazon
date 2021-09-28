const { check } = require('express-validator')
const usersDatabase = require('../../db/users')

module.exports = {
  requireTitle: check('title')
    .trim()
    .isLength({ min: 5, max: 40 })
    .withMessage('Must be between 5 and 40 characters'),
  requirePrice: check('price')
    .trim()
    .toFloat()
    .isFloat({ min: 1 })
    .withMessage('Must be a number greater than 1'),
  requireEmail: check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Must be valid email')
    .custom(async (email) => {
      const existingUser = await usersDatabase.getOneBy({ email })
      if (existingUser) {
        throw new Error('Email in use')
      }
    }),
  requirePassword: check('password')
    .trim()
    .isLength({ min: 4, max: 32 })
    .withMessage('Must be between 4 and 32 characters'),
  requirePasswordConfirmation: check('passwordConfirmation')
    .trim()
    .isLength({ min: 4, max: 32 })
    .withMessage('Must be between 4 and 32 characters')
    .custom(async (passwordConfirmation, { req }) => {
      if (passwordConfirmation !== req.body.password) {
        throw new Error('Passwords must match')
      }
    }),
  requireEmailExists: check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Must provide a valid email')
    .custom(async (email) => {
      const user = await usersDatabase.getOneBy({ email })
      if (!user) {
        throw new Error('Email not found')
      }
    }),
  requireValidPasswordForUser: check('password')
    .trim()
    .custom(async (password, { req }) => {
      const user = await usersDatabase.getOneBy({ email: req.body.email })
      if (!user) {
        throw new Error('Invalid password')
      }

      const validPassword = await usersDatabase.comparePasswords(
        user.password,
        password
      )
      if (!validPassword) {
        throw new Error('Invalid password')
      }
    }),
}
