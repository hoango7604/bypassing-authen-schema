const TBL_USERS = 'users'

exports.TBL_USERS = TBL_USERS

exports.up = async function(knex) {
	const schema = knex.schema
	
	await schema.createTable(TBL_USERS, talbe => {
		talbe.increments('id')
		talbe.string('username').notNullable().unique()
		talbe.string('password')
		talbe.string('passwordHashed')
	})
}

exports.down = async function(knex) {
	const schema = knex.schema
	
	await schema.dropTable(TBL_USERS)
}
