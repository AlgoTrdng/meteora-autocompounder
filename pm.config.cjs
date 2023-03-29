module.exports = {
	apps: [
		{
			name: 'meteora-autocompounder',
			script: 'dist/index.js',
			error_file: './logfiles/err.log',
			out_file: './logfiles/out.log',
			log_date_format: 'YYYY-MM-DD HH:mm',
		},
	],
}
