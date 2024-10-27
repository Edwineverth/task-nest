// eslint-disable-next-line import/no-named-as-default
import rateLimit from 'express-rate-limit';

export const createAccountLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 15, // Limita cada IP a 5 solicitudes por ventana de tiempo (aquí 15 minutos)
  message: 'Too many accounts created from this IP, please try again later.',
  standardHeaders: true, // Retorna información en las cabeceras `RateLimit-*`
  legacyHeaders: false, // Desactiva las cabeceras `X-RateLimit-*`
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 15, // Limita cada IP a 5 intentos de login por ventana de tiempo
  message: 'Too many login attempts from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
