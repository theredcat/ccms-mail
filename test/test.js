Mail = require("../lib/mail.js");

var arguments = {};
var argumentsList = ["port","host","username","password","smtps","transport","debug","to","sender"];

for(var i = 0; argumentsList.length > i; i++){

	var optionValue = process.env['npm_config_'+argumentsList[i]] || process.env['npm_package_config_'+argumentsList[i]];

	if(!isNaN(optionValue))
		optionValue = +optionValue;

	switch(argumentsList[i]){
		case "transport":
			if(['smtp','direct'].indexOf(optionValue) != -1)
				arguments.transport = optionValue;
		break;

		case "to":
			if(typeof(optionValue) == 'string' && optionValue.length > 0)
				to = optionValue;
			else
				throw new Error("Receiver must be a valid email");
		break;

		case "sender":
			if(typeof(optionValue) == 'string' && optionValue.length > 0)
				arguments.sender = optionValue;
			else
				throw new Error("Sender must be a valid email");
		break;

		case "username":
			if(typeof(optionValue) == 'string' && optionValue.length > 0)
				arguments.username = optionValue;
		break;

		case "password":
			if(typeof(optionValue) == 'string' && optionValue.length > 0)
				arguments.password = optionValue;
		break;
		
		case "port":
			if(typeof(optionValue) == 'number' && optionValue == parseInt(optionValue) && optionValue > 0 && optionValue < 65536)
				arguments.port = optionValue;
			else
				throw new Error("Port must be aninteger between 0 and 65536");
		break;

		case "host":
			if(typeof(optionValue) == 'string' && optionValue.length > 0)
				arguments.host = optionValue;
			else
				throw new Error("Host must be an non-empty string");
		break;

		case "smtps":
			if(['true','false'].indexOf(optionValue) != -1)
				arguments.smtps = (optionValue == "true") ? true : false;
			else
				throw new Error("SMTPS must be a boolean");
		break;

		case "debug":
			if(['true','false'].indexOf(optionValue) != -1)
				arguments.debug = (optionValue == "true") ? true : false;
			else
				throw new Error("debug must be a boolean");
		break;
	}
}

console.log('Sending a test mail to '+to+' with this options : ');
console.log(arguments);

Mail.load(arguments);
Mail.send(to,"Test","Yipiee! You've received the ccms-mail test message!",function(){
	Mail.close();
});

