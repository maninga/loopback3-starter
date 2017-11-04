/*
 * Copyright 2016 Red Hat Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */
'use strict';

const UUID = require('./../node_modules/@dd/keycloak-connect/uuid');

function forceLogin (keycloak, request, response) {
  let host = request.hostname;
  let headerHost = request.headers.host.split(':');
  let port = headerHost[1] || '';
  let protocol = keycloak.forwardedHeaderTokens(request.headers.forwarded).proto ||
    request.headers['x-forwarded-proto'] || request.protocol;
  let hasQuery = ~(request.originalUrl || request.url).indexOf('?'); // eslint-disable-line no-bitwise

  //let redirectUrl = protocol + '://' + host + (port === '' ? '' : ':' + port) + (request.originalUrl || request.url) + (hasQuery ? '&' : '?') + 'auth_callback=1&post_post_auth=' + request.headers.referer;
  let redirectUrl = protocol + '://' + host + (port === '' ? '' : ':' + port) + (request.originalUrl || request.url) + (hasQuery ? '&' : '?') + 'auth_callback=1' + (request.headers.referer ? ('&post_post_auth=' + request.headers.referer) : '');

  if (request.session) {
    request.session.auth_redirect_uri = redirectUrl; // eslint-disable-line camelcase
  }

  let uuid = UUID();
  let loginURL = keycloak.loginUrl(uuid, redirectUrl);
  //response.redirect(loginURL);
  response.status(314).json({location: loginURL});
}

function simpleGuard (role, token) {
  return token.hasRole(role);
}

module.exports = function (keycloak, spec) {
  let guard;

  if (typeof spec === 'function') {
    guard = spec;
  } else if (typeof spec === 'string') {
    guard = simpleGuard.bind(undefined, spec);
  }

  return function protect (request, response, next) {
    if (request.kauth && request.kauth.grant) {
      if (!guard || guard(request.kauth.grant.access_token, request, response)) {
        /*
         -- post successful auth && before entering api ecosystem
         -- Idea is to redirect the application back to where the api request was originated
         -- This middleware comes in action after this node_modules/keycloak-connect/middleware/post-auth.js, hence the param name is `post_post_auth`
         */
        const referrerRedirectIRI = request.query.post_post_auth;
        if (referrerRedirectIRI &&
          /^(ftp|http|https):\/\/[^ "]+$/.test(referrerRedirectIRI)) {
          return response.redirect(referrerRedirectIRI);
        }
        return next();
      }

      return keycloak.accessDenied(request, response, next);
    }

    if (keycloak.redirectToLogin(request)) {
      forceLogin(keycloak, request, response);
    } else {
      return keycloak.accessDenied(request, response, next);
    }
  };
};
