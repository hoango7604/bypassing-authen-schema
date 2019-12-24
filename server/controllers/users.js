const JWT = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const path = require('path')

const { JWT_SECRET } = require('../utils/configurations')
const { User } = require('../models/user')

hashPassword = async password => {
    // Generate salt
    const salt = await bcrypt.genSalt(10)

    // Generate a hashed password (salt + password)
    const hashedPassword = await bcrypt.hash(password, salt)

    return hashedPassword
}

signToken = id => {
    return JWT.sign({
        iss: 'hoango7604',
        sub: id,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1)
    }, JWT_SECRET)
}

module.exports = {
    signUp: async (req, res, next) => {
        const { username, password } = req.value.body

        // Check if username is validated
        const existUser = await User.query().findOne({ username })
        if (existUser) {
            return res.status(400).json({ error: 'Existed username' })
        }

        // username is validated
        // Generate a hash password
        const passwordHashed = await hashPassword(password)

        // Create new user
        const newUser = await User.query().insert({ username, password, passwordHashed })
        // Insert failed
        if (!newUser) {
            res.status(400).json({ error: 'An error happened. Please try again!' })
        }

        // Respond with token
        const token = signToken(newUser.id)
        res.status(200).json({ token })
    },

    signIn: (req, res, next) => {
        // Generate token
        const token = signToken(req.user.id)
        res.status(200).json({ token })
    },

    admin: (req, res, next) => {
        // res.status(200).json({ secret: 'secret' })
        const pathHtml = path.join(process.cwd(), 'server/views/admin.html')
        res.status(200).sendFile(pathHtml)
    }
}