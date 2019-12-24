const app = require('./server/app')

// Start server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`)
})