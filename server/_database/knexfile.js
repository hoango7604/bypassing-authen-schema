// Update with your config settings.

module.exports = {

	development: {
		client: 'pg',
		connection: {
			host: 'localhost',
			user:     'postgres',
			password: 'postgres',
			database: 'btpm_bypass_authen_schema',
		},
	},

	test: {
		client: 'pg',
		connection: {
			host: 'localhost',
			user:     'postgres',
			password: 'postgres',
			database: 'btpm_bypass_authen_schema_testing',
		},
	},

}
