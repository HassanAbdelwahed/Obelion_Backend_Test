const express = require("express");
const router = express.Router();
const ReportController = require("../controllers/reportController.js");
const {
  authenticate,
  restrictTo,
} = require("../controllers/userController.js");

// Reports(Admin);

/**
 * @swagger
 * /api/reports/borrowed:
 *   get:
 *     summary: Get a report of currently borrowed books
 *     tags: [Reports]
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Report of borrowed books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BorrowingHistory'
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/reports/borrowed",
  authenticate,
  restrictTo("ADMIN"),
  ReportController.getBorrowedBooksReport
);

/**
 * @swagger
 * /api/reports/popular:
 *   get:
 *     summary: Get a report of the most popular books
 *     tags: [Reports]
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Report of popular books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PopularBooks'
 *       401:
 *         description: Unauthorized
 */

router.get(
  "/reports/popular",
  authenticate,
  restrictTo("ADMIN"),
  ReportController.getPopularBooksReport
);

module.exports = router;
