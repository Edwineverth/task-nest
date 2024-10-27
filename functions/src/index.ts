import 'reflect-metadata';
import 'dotenv/config';
import './config/container';
import { https } from 'firebase-functions';
import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import taskRoutes from './routes/taskRoutes';
import { authenticatorMiddleware } from './middleware/authenticator';
import authRoutes from './routes/authRoutes';

const app = express();

// Middleware para permitir CORS
app.use(cors({ origin: true }));

// Middleware para parsear JSON
app.use(express.json());

// Rutas
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', authenticatorMiddleware, taskRoutes);

exports.api = https.onRequest(app);
