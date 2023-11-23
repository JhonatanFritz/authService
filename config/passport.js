// passport.js
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User';

// Configuración de la estrategia local para la autenticación con nombre de usuario y contraseña
passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user || !user.comparePassword(password)) {
        return done(null, false, { message: 'Nombre de usuario o contraseña incorrectos' });
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

// Configuración de la estrategia de Google OAuth2.0
passport.use(new GoogleStrategy({
  clientID: '694403492885-32g0voosa03776qpl1slc7d044d1cms3.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: 'http://localhost:3000/auth/google/callback',
},
async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      // Crea un nuevo usuario si no existe
      user = new User({ googleId: profile.id, username: profile.displayName });
      await user.save();
    }
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

// Serialización de usuario para almacenar en la sesión
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialización de usuario al recuperar de la sesión
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
