const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const router = require('./routes')

const app = express()

// Middlewares
if (!(process.env.NODE_ENV === 'test')) {
    app.use(morgan('dev'))
}

app.use(bodyParser.json())

// Routes
app.use('/api/v1', router)

// Exports module 'app'
module.exports = app