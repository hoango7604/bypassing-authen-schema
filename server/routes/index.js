const express = require('express')

const userRoutes = require('./users')

const router = express.Router()

router.get('/test', async (req, res) => {
    // const wait10sPromise = new Promise((resolve) => {
    //     setTimeout(() => {
    //         resolve('Done')
    //     }, 10000)
    // })
    // await wait10sPromise
    console.log('Here')
    res.status(200).send('Hello World')
})

router.use('/users', userRoutes)

module.exports = router
