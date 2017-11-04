'use strict';

module.exports = function (app) {
  app.remotes().phases
    .addBefore('invoke', 'options-from-request')
    .use(function (ctx, next) {
      if (ctx.req) {
        if (ctx.args.currCTX) {
          ctx.args.currCTX.req = ctx.req;
        } else if (ctx.args.options) {
          ctx.args.options.req = ctx.req;
        }
      }
      next();
    });
};
