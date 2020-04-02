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
	request.post({url: url, form: {content: message}}, (err, res, body) => {
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

function validate(){
	setInterval(() => {
		if(index == amount) return process.exit();

		var code = gen(giftLength);
		let apiUrl = `https://discordapp.com/api/v6/entitlements/gift-codes/${code}?with_application=true&with_subscription_plan=true`;

		console.log(`[ ${index} ] Validating giftcode... ( ${code} ) -> `);

		request(apiUrl, (err, res, body) => {
			if(err) throw err;

			console.log(`(${body})\n`);
			fs.appendFile(path, `[ ${index} ] ( ${code} ) -> (${body})\n\r`, (err) => {
				if(err) throw err;
			});
		});
		index++;
	}, timeout);
}

validate();
//sendMessage(`Starting to validate ${amount} generated giftcodes! <@153216541725294592>`);