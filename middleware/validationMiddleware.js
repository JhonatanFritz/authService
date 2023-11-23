// /auth-service/middleware/validationMiddleware.js
import { body } from 'express-validator';

export const registerValidation = [
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  // Agrega más validaciones según tus requisitos
];

// Otros middleware y validaciones
