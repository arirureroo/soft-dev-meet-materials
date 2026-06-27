import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import studentRouter from './routes/student.router.js';
import courseRouter from './routes/course.router.js';
import enrollmentRouter from './routes/enrollment.router.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

// CORS must be configured BEFORE any routes.
// It tells the browser which frontend origins are allowed to receive our responses.
// This is what prevents the "Cross-Origin Request Blocked" error in the browser.
const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:5173';
app.use(cors({ origin: allowedOrigin }));

// Middleware: parse incoming JSON request bodies automatically.
app.use(express.json());

app.get('/ping', (req, res) => res.send('pong'));

app.use('/students', studentRouter);
app.use('/courses', courseRouter);
app.use('/enrollments', enrollmentRouter);

// 404 fallback for any unmatched route
app.use((req, res) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.path}` });
});

// Centralized error handler.
// MUST be the last middleware registered
// Express.js identifies it by its 4 parameters.
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Campus Portal API is running on http://localhost:${PORT}`);
});
