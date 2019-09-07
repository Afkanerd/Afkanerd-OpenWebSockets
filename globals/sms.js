//TODO: number of modems
const Events = require('events');
const { spawnSync, spawn } = require ('child_process');
const Queue = require('./queue.js');


//TODO: SOC
/* 
- Multiple hardwares on a single machine -> route sms message to modem
ROUTE: 
	- conditions = matching the modem required specifications (service provider)
	- conditions = has the least amount of pending work (load balancig, making sure they always have the same amount of work


*/

class Modem extends Events {
	constructor () {
		super();
		this.fs = require('fs');
		this.rules = JSON.parse(this.fs.readFileSync('modem-rules.json', 'utf8'));
	}

	getRequestGroup( value ) {
		var groups = this.rules.group;
		for(let n in groups) {
			let group = groups[n];

			for(let i=0;i<Object.keys(value).length;++i) {
				let key = Object.keys(value)[i];
				let isDeterminer = group.determiners.hasOwnProperty(key);
				
				if( isDeterminer ) {
					let determinerRegex = group.determiners.key;
					let regex = RegExp(determinerRegex);
					if( regex.test(value[i]) ) { 
						return group.name;
					}
					
				}
			}
		}
	}

	probe() {
	}

}
class SMS {
	constructor( ) {
		//TODO: read files to get this rules
		this.modem = new Modem;
		this.rules = {
			"MTN" : "SSH",
			"ORANGE" : "MMCLI"
		}
		this.groupBindings = {}
		this.groupBindings["SSH"] = this.sshSend;
		this.groupBindings["MMCLI"] = this.mmcliSend;
		this.queueGroupContainer = {};

		this.initializeQueues().then(()=>{
			console.log("Done initializing...");
		});

	}

	initializeQueues() {
		return new Promise( resolve=> {
			for(let i in this.rules) this.queueGroupContainer[i] = new Queue();
			resolve();
		});
	}

	sshSend(message, phonenumber) {
		return new Promise((resolve)=> {
			console.log("SMS.sshSend=> sending message details:",message,phonenumber);
			resolve("SMS.sshSend.demo.output");
		});
	}

	mmcliSend(message, phonenumber) {
		return new Promise((resolve)=> {
			console.log("SMS.mmcliSend=> sending message details:",message,phonenumber);
			resolve("SMS.mmcliSend.demo.output");
		});
	}

	deQueueFor(group) {
		console.log("SMS.deQueue=> removing from queue:", group);
		console.log(this.groupGroupContainer);
		//let request = this.queueGroupContainer[group].next()
		//this.execEnv = this.groupBindings[this.rules[group]](request.message, request.phonenumber);
	}

	queueFor(group, request) {
		this.queueGroupContainer[ group ].insert(request);
	}

	queueLog() {
		//console.log(this.queueGroupContainer );
		console.log("sms.queueLog=> Queue log----------");
		for(let i in this.queueGroupContainer) {
			console.log(i, this.queueGroupContainer[i].size());
		}
	}

	sendSMS(message, phonenumber) {
		return new Promise( async (resolve, reject )=> {
			let request = {phonenumber: phonenumber, message : message };
			//let's sanitize the input
			for(let i in request)
				if(i=== undefined || request[i] === undefined){
					reject(new Error("invalid request"))
					return;
				}
			console.log("sms:sendSMS=> requesting", request);
			let group = this.modem.getRequestGroup(request)
			this.queueFor(group, request);
			//let output = await this.groupBindings[this.rules[group]](message, phonenumber);
			//resolve( output );
			resolve("done");
		});
	}
}


let modems = new Modem;
let data = [
	{
		phonenumber : "652156811",
		message : new Date()
	},
	{
		phonenumber : "0000000",
		message : new Date()
	}
]

let assert = require('assert');
try {
	var sms = new SMS;
	sms.sendSMS(data[0].message, data[0].phonenumber);
	sms.sendSMS(data[0].message, data[0].phonenumber);
	sms.queueLog();
}
catch(error) {
	console.log(error.message)
}

//TODO: which modem group does this message relate to?
//TODO: which modems in that group execute this command