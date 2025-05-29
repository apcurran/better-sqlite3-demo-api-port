"use strict";

const router = require("express").Router();

const authorsController = require("../controllers/authors-controller");

router.get("/", authorsController.getAuthors);

router.get("/:authorId", authorsController.getAuthor);

router.get("/", authorsController.postAuthor);

router.get("/:authorId", authorsController.deleteAuthor);

module.exports = router;
