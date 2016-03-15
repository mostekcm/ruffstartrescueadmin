/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import path from 'path';
import jwt from 'express-jwt';
import config from './config/environment';

export default function(app) {
  // Auth0 Init
  var jwtCheck = jwt({
    secret: new Buffer(config.secrets.auth0.secret, 'base64'),
    audience: config.secrets.auth0.clientID
  });

  // Insert routes below
  app.use('/api/fetchEventsFromFacebook', require('./api/fetchEventsFromFacebook'));
  app.use('/api/events', jwtCheck);
  app.use('/api/events', require('./api/event'));
  app.use('/api/things', jwtCheck);
  app.use('/api/things', require('./api/thing'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get((req, res) => {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
}
