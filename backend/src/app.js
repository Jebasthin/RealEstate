import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';
import authRoutes from './routes/authRoutes.js';
import propertyRoutes from './routes/propertyRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
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

// Built-in parser middlewares (extended limit for Base64 image uploads)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

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

// Swagger API Docs route (Exposed at /api-docs as per technical assignment)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Authentication routes
app.use('/api/auth', authRoutes);

// Property listings routes
app.use('/api/properties', propertyRoutes);

// Admin moderation routes
app.use('/api/admin', adminRoutes);

// Customer enquiries routes
app.use('/api/enquiries', enquiryRoutes);

// Location lookup routes
app.use('/api/locations', locationRoutes);

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
