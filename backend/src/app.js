import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import { errorHandler } from './middleware/errorMiddleware.js';

const app = express();

// Config CORS with credential support for HTTP-Only cookies
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// Built-in parser middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser for reading HttpOnly refresh token cookies
app.use(cookieParser());

// Base healthcheck route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Real estate API is running',
    timestamp: new Date().toISOString(),
  });
});

// Authentication routes
app.use('/api/auth', authRoutes);

// Wildcard for unhandled routes
app.all('*', (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

// Global central error handler middleware
app.use(errorHandler);

export default app;
