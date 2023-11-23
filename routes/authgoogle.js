// authgoogle.js
import express from 'express';
import passport from 'passport';

const router = express.Router();

// Ruta para iniciar la autenticación con Google
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Ruta para manejar el callback después de la autenticación de Google
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // En caso de éxito, redirigir al usuario a otra parte de tu aplicación
    res.redirect('/profile');
  }
);

export default router;
