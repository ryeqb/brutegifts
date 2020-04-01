const fs = require('fs');
const request = require('request');
const giftLength = 16; //Current code length for disord gifts
const amount = 1000000; //Amount of generated and validated codes
const timeout = 5000; //Timeout in ms to prevent discord api ratelimiting
const path = "./gifts.txt";
var index = 0;
const webhookId = '';
const webhookToken = '';
const url = `https://discordapp.com/api/webhooks/${webhookId}/${webhookToken}`;

function sendMessage(message){

	const data = {
		content: message
	}

	request.post({url: url, form: data}, (err, res, body) => {
		if(err) throw err;
	});
}


function gen(length) {
   let result = '';
   const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   for ( var i = 0; i < length; i++ ) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
   }
   return result;
}

function validate() {
	setInterval(() => {
		var code = gen(giftLength);
		let url = `https://discordapp.com/api/v6/entitlements/gift-codes/${code}?with_application=true&with_subscription_plan=true`
		if(index == amount) return process.exit();
		request(url, (error, response, body) => {
			let json = JSON.parse(body);
			if(json.message !== "Unknown Gift Code"){
				sendMessage(`[ ${index} ] Successfully breached gift code! [ ${code} ] - ${url}`);
				fs.appendFile(path, `[ ${index} ] Successfully breached gift code! [ ${code} ] - ${url}`, (err) => {
					if (err) throw err;
				});
			}
			console.log(`[ ${index} ] ` + json.message + ` ( ${code} )`);
		});
		index++;
	}, timeout);
}

validate();
