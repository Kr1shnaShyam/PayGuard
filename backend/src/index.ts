import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';

import authRoutes from './routes/auth.routes';
import txRoutes from './routes/tx.routes';

dotenv.config();
const app = express();

// Middlewares
app.use(helmet());
app.use(cors({ origin: true }));
app.use(express.json());

// Health Check
app.get('/health', (_, res) => res.json({ ok: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tx', txRoutes);

// Global Error Handler
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ success: false, message: err.message || "Server error" });
});

const PORT = process.env.PORT || 4000;
const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/payguard_dev';

// Connect to MongoDB & Start Server
mongoose.connect(MONGO)
  .then(() => {
    console.log('Mongo connected');
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  })
  .catch(err => {
    console.error('Mongo connection failed:', err);
    process.exit(1);
  });
