const mysql = require('mysql')

const connection = mysql.createConnection({
    host: 'localhost',
    user: '8iOhnX5dGO',
    password: 'IrMLWu4hof',
    database: '8iOhnX5dGO'
})

module.exports = {
    query: (queryString, callback) => {
        connection.query(queryString, (err, results, fields) => {
            if (!!err) throw err

            callback(results)
        })
    }
}