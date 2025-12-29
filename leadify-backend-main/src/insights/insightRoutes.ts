import express from 'express';
import insightController from './insightController';
import { authenticateUser, HasPermission } from '../middleware/authMiddleware';
import {
  FinancialAndBusinessMetricsWidgetsPermissionsEnum,
  LeadAndSalesWidgetsPermissionsEnum,
  PerformanceAndHRWidgetsPermissionsEnum,
  ProjectsAndOperationsWidgetsPermissionsEnum
} from '../role/roleEnum';

const router = express.Router();

/**
 * @swagger
 * /api/insights/leads-sales:
 *   get:
 *     tags: [Insights]
 *     description: Returns Leads & Sales Widgets:.
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Internal server error
 */
router.get(
  '/leads-sales',
  authenticateUser,
  HasPermission([LeadAndSalesWidgetsPermissionsEnum.VIEW_GLOBAL_LEAD_SALES_WIDGETS, LeadAndSalesWidgetsPermissionsEnum.VIEW_OWN_LEAD_SALES_WIDGETS]),
  insightController.getLeadsSalesInsights
);

/**
 * @swagger
 * /api/insights/projects-operations:
 *   get:
 *     tags: [Insights]
 *     description: Returns Projects & Operations Widgets:.
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Internal server error
 */
router.get(
  '/projects-operations',
  authenticateUser,
  HasPermission([
    ProjectsAndOperationsWidgetsPermissionsEnum.VIEW_GLOBAL_PROJECTS_OPERATIONS_WIDGETS,
    ProjectsAndOperationsWidgetsPermissionsEnum.VIEW_OWN_PROJECTS_OPERATIONS_WIDGETS
  ]),
  insightController.getProjectsOperationsInsights
);

/**
 * @swagger
 * /api/insights/financial-business-metrics:
 *   get:
 *     tags: [Insights]
 *     description: Returns Financial & Business Metrics Widgets:.
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Internal server error
 */
router.get(
  '/financial-business-metrics',
  authenticateUser,
  HasPermission([
    FinancialAndBusinessMetricsWidgetsPermissionsEnum.VIEW_GLOBAL_FINANCIAL_BUSINESS_METRICS_WIDGETS,
    FinancialAndBusinessMetricsWidgetsPermissionsEnum.VIEW_OWN_FINANCIAL_BUSINESS_METRICS_WIDGETS
  ]),
  insightController.getFinancialAndBusinessMetricsInsights
);

/**
 * @swagger
 * /api/insights/performance-hr:
 *   get:
 *     tags: [Insights]
 *     description: Returns Performance & HR Widgets:.
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Internal server error
 */
router.get(
  '/performance-hr',
  authenticateUser,
  HasPermission([
    PerformanceAndHRWidgetsPermissionsEnum.VIEW_GLOBAL_PERFORMANCE_HR_WIDGETS,
    PerformanceAndHRWidgetsPermissionsEnum.VIEW_OWN_PERFORMANCE_HR_WIDGETS
  ]),
  insightController.getPerformanceAndHRInsights
);

export default router;
