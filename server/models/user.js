const { Model } = require('objection')
const Knex = require('knex')

const { development, test } = require('../_database/knexfile')

const knex = process.env.NODE_ENV === 'test' ? Knex(test) : Knex(development)
Model.knex(knex)

class User extends Model {
    static get tableName() {
        return 'users'
    }
}

module.exports = {
    User
}
