var mysqlConnection   = require( appRoot+'/config/dbConnection' ).mysqlConnection();


exports.create = ( strSql , jsonData ) => {

	return new Promise( function(fulfill, reject){  
		//console.log( strSql +"mmmm" );
	    mysqlConnection.query(strSql, jsonData,function (error, results, fields) {
	        
	        if( error ) {
	            console.log(`Error from insert query ${error}`);
				//mysqlConnection.destroy();
	            //throw error;
	            reject(error);
	        } else {
	           
	           	fulfill( results.insertId );
	        }
	    });
	
	});

    mysqlConnection.end();

};

exports.update = ( strSql ,jsonData) => {

	return new Promise( function(fulfill, reject){  
		//console.log( strSql +"mmmm" );
	    mysqlConnection.query(strSql,jsonData,function (error, results, fields) {
	        
	        if( error ) {
	            console.log(`Error from update query ${error}`);
				//mysqlConnection.destroy();
	            //throw error;
	            reject(error);
	        } else {
	           
	           	fulfill( results );
	        }
	    });
	
	});

    mysqlConnection.end();

};


exports.read = ( strSql, pagination=false, paginationobj={} ) => {

	// console.log( mysqlConnection  );
	if(pagination)
	{
		let recordperpage = parseInt(paginationobj.records_per_page, 10) || 10;
		let page = (parseInt(paginationobj.page_no, 10) || 1) - 1;
		let skip = page * recordperpage;
		let limit = skip + ' , ' + recordperpage;
		strSql = strSql + ` limit ${limit} `
	}
	return new Promise( function(fulfill, reject){  
		//console.log( strSql +"mmmm" );
	    mysqlConnection.query(strSql, function (error, results, fields) {
	        
	        if( error ) {
	            console.log(`Error from select query ${error}`);
				//mysqlConnection.destroy();
	            //throw error;
	            reject(error);
	        } else {
				//console.log("fulfilled");
				//console.log("results : "+JSON.stringify(results));
	           	fulfill( results );
	        }
	    });
	
	});

    mysqlConnection.end();
};

exports.delete = ( strSql) => {

	return new Promise( function(fulfill, reject){  
		//console.log( strSql +"mmmm" );
	    mysqlConnection.query(strSql, function (error, results, fields) {
	        
	        if( error ) {
	            console.log(`Error from delete query ${error}`);
				//mysqlConnection.destroy();
	            //throw error;
	            reject(error);
	        } else {
	           	fulfill( results );
	        }
	    });
	
	});

    mysqlConnection.end();


};