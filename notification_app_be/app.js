import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import Log from '../logging_middleware/logger.js';
import notificationRoutes from './routes/notificationRoutes.js';
import { PORT } from './config/config.js';
const app = express();
app.use(express.json());
app.use('/api/notifications', notificationRoutes);
app.listen(PORT, async () => {
  await Log("backend", "info", "config",
    `Notification service started on port ${PORT}`
  );
  console.log(`Server running on port ${PORT}`);
});