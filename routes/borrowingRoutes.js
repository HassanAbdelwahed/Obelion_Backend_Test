const express = require("express");
const router = express.Router();
const borrowingController = require("../controllers/borrowingController.js");
const { authenticate } = require("../controllers/userController.js");

/**
 * @swagger
 * tags:
 *   name: Borrowing
 *   description: Borrow and return books
 */

/**
 * @swagger
 * /api/borrow:
 *   post:
 *     summary: Borrow a book
 *     tags: [Borrowing]
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookId:
 *                 type: string
 *                 description: The ID of the book to borrow
 *     responses:
 *       200:
 *         description: Book borrowed successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Book not found
 */
router.post("/borrow", authenticate, borrowingController.borrowBook);

/**
 * @swagger
 * /api/return:
 *   post:
 *     summary: Return a borrowed book
 *     tags: [Borrowing]
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookId:
 *                 type: string
 *                 description: The ID of the book to return
 *     responses:
 *       200:
 *         description: Book returned successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Book not found
 */
router.post("/return", authenticate, borrowingController.returnBook);

/**
 * @swagger
 * /api/borrow/history:
 *   get:
 *     summary: Retrieve the borrowing history for the logged-in user
 *     tags: [Borrowing]
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Borrowing history retrieved successfully
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
  "/borrow/history",
  authenticate,
  borrowingController.getBorrowingHistory
);

module.exports = router;
