var mysql      = require('mysql');

exports.mysqlConnection = ( ) => {
	console.log( process.env.RDS_MYSQL_HOSTNAME );
	return mysql.createConnection(
									{
				                      host     : process.env.RDS_MYSQL_HOSTNAME,
				                      user     : process.env.RDS_MYSQL_USERNAME,
				                      password : process.env.RDS_MYSQL_PASSWORD,
				                      port     : process.env.RDS_MYSQL_PORT,
				                      database : process.env.RDS_MYSQL_DATABASE
				                    }
	                    		);
	};