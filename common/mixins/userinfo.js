module.exports = function(Model, options) {
	'use strict';

	let _ = require('lodash'),
		userInfo = {},
		userInfoFieldName = options && options.userInfoFieldName,
		creationTSFieldName = options && options.creationTSFieldName;

	Model.observe('before save', function event(ctx, next) {
		if (ctx.options && ctx.options.req) {
			let req = ctx.options.req;
			if (req.kauth) {
				let userdata = req.kauth.grant.access_token.content;
				userInfo = {
					email:  userdata.email,
					fullName: userdata.name
				};
			}
		}
		if(userInfoFieldName) {
			if (ctx.instance) {
				ctx.instance.__data[userInfoFieldName] = userInfo || {"cause": "The context was not available :("};
			} else {
				ctx.data[userInfoFieldName] = userInfo || {"cause": "the context was not available :("};
			}
		}
		if(creationTSFieldName) {
			if (ctx.instance) {
				ctx.instance.__data[creationTSFieldName] = Date.now();
			} else {
				ctx.data[creationTSFieldName] = Date.now();
			}
		}
		next();
	});
};
