const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const LocalStrategy = require('passport-local').Strategy
const GooglePlusTokenStrategy = require('passport-google-plus-token')
const FacebookTokenStrategy = require('passport-facebook-token')
const bcrypt = require('bcryptjs')

const { oauth, JWT_SECRET } = require('./configurations')
const connection = require('./databaseHelpers')
const { User } = require('../models/user')

/**
 * JSON WEB TOKEN STRATEGY
 */
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: JWT_SECRET
}, async (payload, done) => {
    try {
        // Check if user id is validated
        const foundUser = await User.query().findById(payload.sub)
        if (!foundUser) {
            // user with id does not exist
            return done(null, false)
        }
        done(null, foundUser)

        // connection.query(`SELECT * FROM users WHERE id = '${payload.sub}'`, (results) => {
        //     if (results.length == 0) {
        //         // user with id does not exist
        //         return done(null, false)                
        //     }

        //     const user = results[0]
        //     done(null, user)
        // })
    }
    catch(err) {
        done(err, false)
    }
}))

/**
 * LOCAL STRATEGY
 */
passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        // Check if username is existed in db
        const foundUser = await User.query().findOne({ username })
        if (!foundUser) {
            // username does not exist
            return done(null, false)
        }

        // Check if the password is correct
        if (!(await checkPassword(password, foundUser.passwordHashed))) {
            return done(null, false)
        }

        done(null, foundUser)

        // connection.query(`SELECT * FROM users WHERE username = '${username}'`, (results) => {
        //     if (results.length == 0) {
        //         // username does not exist
        //         return done(null, false)
        //     }

        //     // Check if the password is correct
        //     if (!checkPassword(password, results[0].password)) {
        //         return done(null, false)
        //     }

        //     const user = results[0]
        //     done(null, user)
        // })
    }
    catch(err) {
        done(err, false)
    }
}))

/**
 * GOOGLE OATH STRATEGY
 */
passport.use('googleToken', new GooglePlusTokenStrategy({
    clientID: oauth.google.clientID,
    clientSecret: oauth.google.clientSecret
}, (accessToken, refreshToken, profile, done) => {
    try {
        // Check if username is existed in db
        connection.query(`SELECT * FROM users WHERE GoogleOAuthId = '${profile.id}'`, (results) => {
            if (results.length == 0) {
                // username does not exist
                // Create new user
                connection.query(`INSERT INTO users (id, GoogleOAuthId, username, name, registerdate, authority)
                                    VALUES (null, '${profile.id}', '${profile.emails[0].value}', '${profile.name.familyName + ' ' + profile.name.givenName}', NOW(), 'USER')`
                                , (results) => {
                                    if (results.affectedRows > 0) {
                                        // Insert succeeded
                                        // Respond with token
                                        connection.query(`SELECT * FROM users WHERE GoogleOAuthId = '${profile.id}'`, (results) => {
                                            const user = results[0]
                                            console.log({results})
                                            done(null, user)
                                        })
                                    }
                                    else {
                                        // Fail
                                        res.status(400).json({ error: 'An error happened. Please try again!' })
                                    }
                                })
            }
            else {
                // username does exist
                const user = results[0]
                done(null, user)
            }
        })
    }
    catch(err) {
        done(err, false, err.message)
    }
}))

/**
 * FACEBOOK OATH STRATEGY
 */
passport.use('facebookToken', new FacebookTokenStrategy({
    clientID: oauth.facebook.clientID,
    clientSecret: oauth.facebook.clientSecret
}, (accessToken, refreshToken, profile, done) => {
    try {
        // Check if username is existed in db
        connection.query(`SELECT * FROM users WHERE FacebookOAuthId = '${profile.id}'`, (results) => {
            if (results.length == 0) {
                // username does not exist
                // Create new user
                connection.query(`INSERT INTO users (id, FacebookOAuthId, username, name, registerdate, authority)
                                    VALUES (null, '${profile.id}', '${profile.emails[0].value}', '${profile.name.familyName + ' ' + profile.name.givenName}', NOW(), 'USER')`
                                , (results) => {
                                    if (results.affectedRows > 0) {
                                        // Insert succeeded
                                        // Respond with token
                                        connection.query(`SELECT * FROM users WHERE FacebookOAuthId = '${profile.id}'`, (results) => {
                                            const user = results[0]
                                            console.log({results})
                                            done(null, user)
                                        })
                                    }
                                    else {
                                        // Fail
                                        res.status(400).json({ error: 'An error happened. Please try again!' })
                                    }
                                })
            }
            else {
                // username does exist
                const user = results[0]
                done(null, user)
            }
        })
    }
    catch(err) {
        done(err, false, err.message)
    }
}))

const checkPassword = (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword)
}

module.exports = passport