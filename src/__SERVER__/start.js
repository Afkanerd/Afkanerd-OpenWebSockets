const express = require('express');
const bodyParser = require('body-parser')

const START_ROUTINES = require('./start_routines.js');

var __DBCLIENT__ = require('./__ENTITIES__/DBClient.js');

//===============
'use strict';
//===============

//================================================
var __MYSQL_CONNECTION__;
(async ()=>{
	try{
		__MYSQL_CONNECTION__ = await START_ROUTINES.GET_MYSQL_CONNECTION();
		console.log("=> MYSQL CONNECTION ESTABLISHED");
	}
	catch(error) {
		console.log(error);
		return;
	}
})()

var app = express();
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
//================================================

//=======================================================
let CONFIGS = START_ROUTINES.READCONFIGS('system_configs');
let RETURN_VALUES = START_ROUTINES.READCONFIGS('return_values');
var COMPONENT = CONFIGS['COMPONENT'];

if(typeof CONFIGS["__DEFAULT__"] == "undefined") {
	console.error("=> CONFIGS NOT PROPERLY LOADED");
	return;
}


//=======================================================

/*/=======================================================
console.log( CONFIGS );
console.log("===============================");
console.log( RETURN_VALUES );
console.log("===============================");
console.log( component );
/*///=======================================================


//=================================
let options = {
	port : 8000
}

app.listen(options, ()=>{
	console.log("=> RECEIVING API BEGAN, RUNNING ON PORT [%d]", options.port);
});
//=================================

app.post(COMPONENT, async (req, res)=>{
	let __BODY__ = req.body;

	console.log(__BODY__);

	let __CLIENT__ = __BODY__.__CLIENT__;

	if(
		typeof __CLIENT__["ID"] == "undefined" ||
		typeof __CLIENT__["TOKEN"] == "undefined"
	) {
		console.log("-- Invalid request made --");
		res.status( RETURN_VALUES['INVALID_REQUEST'] );
		res.end();
		
		return;
	}

	let __ID__ = __CLIENT__.ID;
	let __TOKEN__ = __CLIENT__.TOKEN;

	//Let's validate this client
	let DBClient = new __DBCLIENT__( __MYSQL_CONNECTION__, __ID__, __TOKEN__);

	try{
		let validated_client = await DBClient.validate(__ID__, __TOKEN__);
		if( !validated_client) {
			res.status( RETURN_VALUES['NOT_AUTHORIZED'] );
			res.end();
		}
	}
	catch( error ) {
		console.log(error);
		res.end();
	}
	
	/*
	//Now let's validate the request
	let __REQUEST__ = __BODY__.__REQUEST__;
	let __SMS__ = __REQUEST__.__SMS__;

	let __MESSAGE__ = __SMS__.__MESSAGE__;
	let __PHONENUMBER__ = __SMS__.__PHONENUMBER__;

	//They should be some open socket it wants to send information to
	let __SOCKET__ = await socketCollection.find(__ID__, __TOKEN__);
	if( !__SOCKET__.transmit( __MESSAGE__, __PHONENUMBER__ ) ){
		res.status(__SOCKET__.getErrorCode() );
		res.end();

		return;
	}
	*/
	res.status( RETURN_VALUES['SUCCESS'] );
	res.end();
});

/*
app.get(COMPONENT + "/user/:token/request/:id", (req, res)=>{
	let __ID__ = req.id;

	let __TOKEN__ = req.token;

	if( await !DBClient.validateTokenOnly( __TOKEN__ ) ) {}

	//Get request data
	let __REQUEST__ = await requestCollection.find( __ID__ );
	if( !__REQUEST__.valid() ) {
		res.status(__REQUEST__.getErrorCode() );
		res.end();

		return;
	}

	res.status( RETURN_VALUES['SUCCESS'] );
	res.send( __REQUEST__.data() );
});

*/