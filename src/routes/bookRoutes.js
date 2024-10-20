const express = require("express");
const bookController = require("../controllers/bookController.js");

const {
  authenticate,
  restrictTo,
} = require("../controllers/userController.js");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Book management and catalog
 */

// Books endpoints

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Retrieve a list of available books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: List of books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */
router.get("/books", bookController.getAvailableBooks);

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Add a new book (admin only)
 *     tags: [Books]
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               totalCopies:
 *                 type: number
 *     responses:
 *       201:
 *         description: Book added successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/books",
  authenticate,
  restrictTo("ADMIN"),
  bookController.createBook
);

/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     summary: Update book details (admin only)
 *     tags: [Books]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the book to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: Book updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Book not found
 *       401:
 *         description: Unauthorized
 */
router.put(
  "/books/:id",
  authenticate,
  restrictTo("ADMIN"),
  bookController.updateBook
);

/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     summary: Delete a book by ID (admin only)
 *     tags: [Books]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the book to delete
 *     responses:
 *       204:
 *         description: Book deleted successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Book not found
 *       401:
 *         description: Unauthorized
 */
router.delete(
  "/books/:id",
  authenticate,
  restrictTo("ADMIN"),
  bookController.deleteBook
);

module.exports = router;
