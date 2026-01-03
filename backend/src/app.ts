import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import middleware from 'i18next-http-middleware';
import path from 'path';
import assetRoutes from './asset/assetRoutes';
import clientRoutes from './client/clientRoutes';
import { swaggerDocs, swaggerUi } from './config/swagger';
import dealRoutes from './deal/dealRoutes';
import leadRoutes from './lead/leadRoutes';
import manpowerRoutes from './manpower/manpowerRoutes';
import AdditionalMaterialRoutes from './additionalMaterial/additionalMaterialRoutes';
import materialRoutes from './material/materialRoutes';
import notificationRoutes from './notification/notificationRoutes';
import opportunityRoutes from './opportunity/opportunityRoutes';
import projectRoutes from './project/projectRoutes';
import projectManpowerRoutes from './projectManpower/projectManpowerRoutes';
import proposalRoutes from './proposal/proposalRoutes';
import proposalContentRoutes from './proposalContent/proposalContentRoutes';
import serviceRoutes from './service/serviceRoutes';
import UploaderRoutes from './uploader/uploader.routes';
import authRoutes from './user/authenticationRoutes';
import userRoutes from './user/userRoutes';
import ErrorHandler from './utils/error/ErrorHandler';
import vehicleRoutes from './vehicle/vehicleRoutes';
import ActivityRoutes from './activity-logs/activityRoutes';
import proposalFinanceTableItemRoutes from './ProposalFinanceTableItem/proposalFinanceTableItemRoutes';
import proposalFinanceTableRoutes from './proposalFinanceTable/proposalFinanceTableRoutes';
import proposalLogRoutes from './proposalLog/proposalLogRoutes';
import roleRoutes from './role/roleRoutes';
import settingRoutes from './setting/settingRoutes';
import insightRoutes from './insights/insightRoutes';
import dailyTaskRoutes from './dailyTask/dailyTaskRoutes';
import { rateLimiter, loginRateLimiter } from './utils/rateLimiter';

const fileUpload = require('express-fileupload');

const app: Application = express();
i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    backend: {
      // Use __dirname so it works after build (dist/).
      loadPath: path.join(__dirname, 'utils', 'error', 'locales', '{{lng}}', 'translation.json')
    },
    fallbackLng: 'en-US'
  });
// Attach i18next middleware
app.use(middleware.handle(i18next));

// Middleware to parse incoming JSON requests
app.use(express.json());

// Rate limiting middleware
app.use('/api', rateLimiter({ maxRequests: 100, windowMs: 60000 }));
app.use('/api/auth/login', loginRateLimiter());

const corsOrigins = (process.env.CORS_ORIGIN || '').split(',').map(s => s.trim()).filter(Boolean);
app.use(
  cors({
    origin: corsOrigins.length ? corsOrigins : true,
    credentials: true
  })
);

// Middleware for uploading files
app.use(
  fileUpload({
    limits: {
      fileSize: (Number(process.env.UPLOAD_MAX_SIZE_MB || 25) || 25) * 1024 * 1024
    },
    abortOnLimit: true,
    useTempFiles: false
  })
);

app.use('/api/insights', insightRoutes);
app.use('/api/role', roleRoutes);
app.use('/api/proposal-log', proposalLogRoutes);
app.use('/api/proposal-finance-table-item', proposalFinanceTableItemRoutes);
app.use('/api/proposal-finance-table', proposalFinanceTableRoutes);
app.use('/api/proposal-content', proposalContentRoutes);
app.use('/api/proposal', proposalRoutes);
app.use('/api/project-manpower', projectManpowerRoutes);
app.use('/api/project', projectRoutes);
app.use('/api/asset', assetRoutes);
app.use('/api/service', serviceRoutes);
app.use('/api/upload', UploaderRoutes);
app.use('/api/additional-material', AdditionalMaterialRoutes);
app.use('/api/material', materialRoutes);
app.use('/api/vehicle', vehicleRoutes);
app.use('/api/manpower', manpowerRoutes);
app.use('/api/deal', dealRoutes);
app.use('/api/notification', notificationRoutes);
app.use('/api/opportunity', opportunityRoutes);
app.use('/api/lead', leadRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/activity', ActivityRoutes);
app.use('/api/users', userRoutes);
app.use('/api/setting', settingRoutes);
app.use('/api/daily-task', dailyTaskRoutes);

// Authentication routes
app.use('/api', authRoutes); // Use /api for authentication-related routes

// Serve static files from the 'public' directory
app.use('/assets', express.static('public/uploads'));

// Set up Swagger documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Error Handling Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  ErrorHandler(err, req, res, next);
});

export default app;
