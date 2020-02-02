"use strict";

global.express     = require('express');
const rootPath 	   = require('path');
const app          = express();
global.appRoot 	   = rootPath.resolve(__dirname);
var bodyParser     = require('body-parser')
const apiRouter    = require( appRoot+'/routes/apiRouter' );
const port 		   = 4001;

const cors = require('cors');
app.use(cors());

app.use(bodyParser.json() );

app.use( '/api/v1/', apiRouter );

app.get('/', (req, res) => {
	res.json({'test': 'true'});
});


app.listen( port, () => { 

	console.log('Server is up on '+port ) 
	//console.log(process.env)
});