"use strict";
const payloadCheck = require('payload-validator');
const userModel   = require( './models/userModel' );

// exports.validateHeaders = async function( req,res,next ) {
//     console.log('validating headers')
//     next();
// }

exports.validateHeaders = async function( req,res,next ) {
	try {
		let requestHeaders = req.headers;

		//console.log( requestHeaders );

		let objRequiredHeader =  [
									"content-type",
									"uid"
								];
		var result = payloadCheck.validator(requestHeaders,{"content-type":"","uid":""},objRequiredHeader,true);

		// if(req.method === 'POST' && false == result['success'] ){

		// 	//console.log("123");
		// 	//errorMessage

		// 	result['response']["errorMessage"] = result['response']["errorMessage"].replace("Parameter","Header");
		// 	res.set('status_code', 400);
		// 	return res.status(400).send( {"success":false,"data":null,"message":null,"errors":result['response'] } );
		// }

		// let user = await userModel.getUser( req.headers['uid'] );

		// if( user.length == 0 ){
		// 	return res.status(400).json({"success":false,"data":{},"message":{},"errors":'uid is invalid' });	
		// }

        // req.headers["user_id"] = user[0]['id'];
        
		next();
		
	} catch (error) {
		console.log('exception in validateHeaders : '+error);
		return res.status(400).send("Something went wrong");		
	}
};