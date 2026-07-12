import dotenv from 'dotenv';
import app from './src/app.js';
import prisma from './src/config/db.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to database and verify connection before starting the server
const startServer = async () => {
  try {
    // Attempt database connection check
    await prisma.$connect();
    console.log('Successfully connected to the PostgreSQL database via Prisma.');

    const server = app.listen(PORT, () => {
      console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });

    // Graceful shutdown helpers
    const shutdown = async (signal) => {
      console.log(`Received ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        console.log('Express server closed.');
        await prisma.$disconnect();
        console.log('Prisma Client disconnected.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (error) {
    console.error('Failed to initialize database connection. Server starting aborted.');
    console.error(error);
    process.exit(1);
  }
};

// Handle global unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  console.error(err.stack);
  process.exit(1);
});

// Handle global uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message);
  console.error(err.stack);
  process.exit(1);
});

startServer();
