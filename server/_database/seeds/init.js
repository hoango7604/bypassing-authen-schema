const { TBL_USERS } = require('../migrations/20191127122918_init')
const { USERS } = require('./data/users')

exports.seed = async function(knex) {
	await knex(TBL_USERS).del()

	await knex(TBL_USERS).insert(USERS)
}
