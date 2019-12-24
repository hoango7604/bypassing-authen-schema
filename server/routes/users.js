const express = require('express')
const router = require('express-promise-router')()

const {validateBody, schemas} = require('../utils/routeHelpers')
const UserController = require('../controllers/users')
const passport = require('../utils/passport')
const { User } = require('../models/user')

router.route('/signup')
    .post(validateBody(schemas.authenticateSchema), UserController.signUp)

router.route('/signin')
    .post(validateBody(schemas.authorizeSchema), passport.authenticate('local', { session: false }), UserController.signIn)

router.route('/signin-sql-injectable')
    .post(async (req, res, next) => {
        const { username, password } = req.body
        const foundUsers = await User.query()
            .whereRaw("username = '" + username + "' AND password = '" + password + "'")
            .limit(1)
        if (!foundUsers) {
            return res.status(401).end()
        }
        req.user = foundUsers[0]
        next()
    }, UserController.signIn)

router.route('/oath/google')
    .post(passport.authenticate('googleToken', { session: false }), UserController.signIn)

router.route('/oath/facebook')
    .post(passport.authenticate('facebookToken', { session: false }), UserController.signIn)

router.route('/admin')
    .get(passport.authenticate('jwt', { session: false }), UserController.admin)

router.route('/admin-directable')
    .get(UserController.admin)

router.route('/admin-params-modificable')
    .get((req, res, next) => {
        (req.query.authenticated == 'yes') ? next() : res.status(401).end()
    }, UserController.admin)

module.exports = router