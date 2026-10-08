import './polyfills.js';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import businessRoutes from './routes/businessRoutes.js';
import complianceRoutes from './routes/complianceRoutes.js';
import schemeRoutes from './routes/schemeRoutes.js';
import tenderRoutes from './routes/tenderRoutes.js';
import certificationRoutes from './routes/certificationRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import deadlineRoutes from './routes/deadlineRoutes.js';
import actionRoutes from './routes/actionRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import ragRoutes from './routes/ragRoutes.js';
import opportunityRoutes from './routes/opportunityRoutes.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Database connection
connectDB();
// API Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'MSME AI Operating System API', timestamp: new Date() });
});
// REST API Route Registrations
app.use('/api/auth', authRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/compliance', complianceRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/tenders', tenderRoutes);
app.use('/api/certifications', certificationRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/deadlines', deadlineRoutes);
app.use('/api/actions', actionRoutes);
app.use('/api/assistant', aiRoutes);
app.use('/api/rag', ragRoutes);
app.use('/api/opportunities', opportunityRoutes);
// Global Error Handler
app.use(errorHandler);
app.listen(PORT, () => {
    console.log(`🌐 MSME AI Express Server listening on http://localhost:${PORT}`);
});
