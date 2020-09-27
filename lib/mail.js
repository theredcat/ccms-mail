var nodemailer = require("nodemailer");
var uuid = require('node-uuid');

var Mail = function(){};

Mail.prototype = {
	_options : false,
	_transport : false,

	load : function(options){
		if(!this._options){
			this._options = options;
			switch(options.transport){
				case 'smtp':
					var tmpOptions = {
						debug: (typeof(options.debug) == 'boolean' && options.debug == true) ? true : false,
						port:(typeof(options.port) == 'integer' && options.port < 65536 && options.port > 0 && options.port == parseInt(options.port)) ? options.port : 25,
						host:(typeof(options.host) == 'string' && options.host.length > 0) ? options.host : "localhost",
						secureConnection: (typeof(options.smtps) == 'boolean' && options.smtps == true) ? true : false,
					}

					var auth = {}
					auth.username = (typeof(options.username) == 'string' && options.username.length > 0) ? options.username : null;
					auth.password = (typeof(options.password) == 'string' && options.password.length > 0) ? options.password : null;

					if(auth.username != null && auth.password != null)
						tmpOptions.auth = auth;

					this._transport = nodemailer.createTransport("SMTP", tmpOptions);
				break;

				case 'direct':
				default:
					this._transport = nodemailer.createTransport("direct", {debug:options.debug});
				break;
			}
		}
	},
	send:  function(to,subject,content,callback){
		var id = uuid.v4();
		var mailOptions = {
			from: this._options.sender,
			to: to,
			messageId: id,
			subject: subject,
			html: content
		};
		if(callback){
			this._transport.sendMail(mailOptions,function(error, response){
				if(error){
					throw error;
				}else{
					callback(response);
				}
			});
		}else{
			this._transport.sendMail(mailOptions);
		}
	},
	sendWithFiles:  function(to,subject,content,files,callback){
		var id = uuid.v4();
		var mailOptions = {
			attachments: files,
			from: this._options.sender,
			to: to,
			messageId: id,
			subject: subject,
			html: content
		};
		if(callback){
			this._transport.sendMail(mailOptions,function(error, response){
				if(error){
					throw error;
				}else{
					callback(response);
				}
			});
		}else{
			this._transport.sendMail(mailOptions);
		}
	},
	close: function(){
		this._options = false;
		this._transport.transport.close();
	}
}

module.exports = exports = new Mail();
