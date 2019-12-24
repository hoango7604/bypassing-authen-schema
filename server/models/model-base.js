const { Model } = require('objection')
const Knex = require('knex')

const { development, test } = require('../_database/knexfile')

const knex = Knex({ development, test })

const BaseModel = Model.knex(knex)

module.exports = {
    BaseModel
}
