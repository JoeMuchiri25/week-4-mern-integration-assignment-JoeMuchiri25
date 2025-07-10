import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './db.js';

import categoryRoutes from './routes/categoryRoutes.js';
import postRoutes from './routes/postRoutes.js';
import authRoutes from './routes/auth.js';
import commentRoutes from './routes/commentRoutes.js';

import errorMiddleware from './middleware/errorMiddleware.js';

dotenv.config();
const app = express();

// 🔐 Middleware
app.use(cors());
app.use(express.json());

// 🧩 Route Handlers
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/comments', commentRoutes);

// 🖼 Serve uploaded images
app.use('/uploads', express.static('uploads'));

// 🏠 Base route
app.get('/', (req, res) => res.send('✅ API is running'));

// 🚨 Error handler
app.use(errorMiddleware);

// 🔌 Connect to DB and start server
connectDB()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error('🔥 Failed to start server:', err.message);
  });
