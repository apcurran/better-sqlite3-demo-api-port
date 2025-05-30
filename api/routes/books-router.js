"use strict";

const router = require("express").Router();

const booksController = require("../controllers/books-controller");

router.get("/", booksController.getBooks);

router.get("/:bookId", booksController.getBook);

router.post("/", booksController.postBook);

router.delete("/:bookId", booksController.deleteBook);

module.exports = router;
