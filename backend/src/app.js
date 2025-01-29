import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler } from './utilis/ApiError.js';

const app = express();

// CORS configuration
const allowedOrigins = [
  'https://clever-stardust-0e1a3b.netlify.app', // Your Netlify frontend
  'http://localhost:3000', // Add localhost for local development
  // Add any other allowed origins if needed
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true); // Allow the origin
        } else {
            callback(new Error('Not allowed by CORS'), false); // Block the origin
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Allow credentials (cookies, authorization headers)
    preflightContinue: false, // Allow the middleware to handle OPTIONS requests
}));

// Body parser middleware
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Static files middleware (if needed)
app.use(express.static("public"));

// Cookie parser
app.use(cookieParser());

// Basic health check route
app.get('/', (req, res) => {
    res.send("Backend is ready");
});

// Import routes
import adminRouter from './routes/admin.routes.js';
import patientRouter from './routes/patient.routes.js';
import doctorRouter from './routes/doctor.routes.js';
import blogRouter from './routes/blog.routes.js';
import messageRouter from './routes/message.routes.js';

// Register routes
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/patient', patientRouter);
app.use('/api/v1/doctor', doctorRouter);
app.use('/api/v1/blogs', blogRouter);
app.use('/api/v1/contact', messageRouter);

// Global error handler middleware
app.use(errorHandler);

// Export the app for use in serverless or other environments
export { app };
