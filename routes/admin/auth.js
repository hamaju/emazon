const express = require('express')

const { handleErrors } = require('./middlewares')
const usersDatabase = require('../../db/users')
const signupTemplate = require('../../views/admin/auth/signup')
const signinTemplate = require('../../views/admin/auth/signin')
const {
  requireEmail,
  requirePassword,
  requirePasswordConfirmation,
  requireEmailExists,
  requireValidPasswordForUser,
} = require('./validators')

const router = express.Router()

router.get('/signup', (req, res) => {
  res.send(signupTemplate({ req }))
})

router.post(
  '/signup',
  [requireEmail, requirePassword, requirePasswordConfirmation],
  handleErrors(signupTemplate),
  async (req, res) => {
    const { email, password } = req.body
    const user = await usersDatabase.create({ email, password })

    // store user's id inside a cookie
    req.session.userId = user.id // added by cookie-session

    res.redirect('/admin/products')
  }
)

router.get('/signout', (req, res) => {
  req.session = null
  res.send('You are now logged out')
})

router.get('/signin', (req, res) => {
  res.send(signinTemplate({}))
})

router.post(
  '/signin',
  [requireEmailExists, requireValidPasswordForUser],
  handleErrors(signupTemplate),
  async (req, res) => {
    const { email } = req.body

    const user = await usersDatabase.getOneBy({ email })

    req.session.userId = user.id

    res.redirect('/admin/products')
  }
)

module.exports = router
