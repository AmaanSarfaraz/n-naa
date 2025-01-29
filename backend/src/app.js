import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler } from './utilis/ApiError.js';

const app = express();

// Enhanced CORS configuration
const allowedOrigins = [
    'https://advanced-hospital-management-1ers.vercel.app' // Add local development
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'CORS policy: Origin not allowed';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept'
    ],
    credentials: true,
    maxAge: 86400 // Cache preflight for 24hrs
}));

// Middleware order is correct
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes
app.get('/', (req, res) => {
    res.send("backend is ready");
});

// Import routes
import adminRouter from './routes/admin.routes.js';
import patientRouter from './routes/patient.routes.js';
import doctorRouter from './routes/doctor.routes.js';
import blogRouter from './routes/blog.routes.js';
import messageRouter from './routes/message.routes.js';

app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/patient', patientRouter);
app.use('/api/v1/doctor', doctorRouter);
app.use('/api/v1/blogs', blogRouter);
app.use('/api/v1/contact', messageRouter);

app.use(errorHandler);

export { app };