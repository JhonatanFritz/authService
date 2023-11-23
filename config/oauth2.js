// oauth2.js
import oauth2orize from 'oauth2orize';
import passport from 'passport';
import crypto from 'crypto';
import User from '../models/User';
import Client from '../models/Client';
import AccessToken from '../models/AccessToken';
import RefreshToken from '../models/RefreshToken';

const server = oauth2orize.createServer();

// Configuración del código de autorización
server.grant(oauth2orize.grant.code(async (client, redirectUri, user, ares, done) => {
  try {
    const code = crypto.randomBytes(16).toString('hex');
    const accessToken = crypto.randomBytes(32).toString('hex');
    const refreshToken = crypto.randomBytes(32).toString('hex');

    const token = new AccessToken({ token: accessToken, userId: user.id, clientId: client.id });
    const refreshTokenObject = new RefreshToken({ token: refreshToken, userId: user.id, clientId: client.id });

    await Promise.all([token.save(), refreshTokenObject.save()]);

    done(null, code);
  } catch (error) {
    done(error);
  }
}));

// Configuración del intercambio de código por token de acceso
server.exchange(oauth2orize.exchange.code(async (client, code, redirectUri, done) => {
  try {
    const accessToken = crypto.randomBytes(32).toString('hex');
    const refreshToken = crypto.randomBytes(32).toString('hex');

    const token = new AccessToken({ token: accessToken, clientId: client.id });
    const refreshTokenObject = new RefreshToken({ token: refreshToken, clientId: client.id });

    await Promise.all([token.save(), refreshTokenObject.save()]);

    done(null, accessToken, refreshToken, { expires_in: 3600 });
  } catch (error) {
    done(error);
  }
}));

// Configuración del middleware de autorización
export const authorization = [
  server.authorization(async (clientId, redirectUri, done) => {
    try {
      const client = await Client.findOne({ clientId: clientId, redirectUri: redirectUri });
      if (!client) {
        return done(null, false);
      }
      return done(null, client, redirectUri);
    } catch (error) {
      return done(error);
    }
  }),
  (req, res) => {
    res.render('authorization', { transactionID: req.oauth2.transactionID, user: req.user, client: req.oauth2.client });
  },
];

// Configuración del middleware para el manejo de decisiones de usuario
export const decision = [
  server.decision(),
];

// Configuración del middleware de intercambio de contraseña de usuario
export const token = [
  passport.authenticate(['local', 'oauth2-client-password'], { session: false }),
  server.token(),
  server.errorHandler(),
];

export { server };
