"use strict";

const router = require("express").Router();

const authorsController = require("../controllers/authors-controller");

router.get("/", authorsController.getAuthors);

router.get("/:authorId", authorsController.getAuthor);

router.post("/", authorsController.postAuthor);

router.patch("/:authorId", authorsController.patchAuthor);

router.delete("/:authorId", authorsController.deleteAuthor);

module.exports = router;
