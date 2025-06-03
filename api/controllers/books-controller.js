"use strict";

const { z } = require("zod/v4");
const { db } = require("../../db/index");
const { bookIdSchema, postBookSchema } = require("../validators/book-validators");

/** @type {import("express").RequestHandler} */
function getBooks(req, res, next) {
    try {
        const statement = db.prepare(`
            SELECT
                book.book_id,
                book.title,
                book.year,
                book.pages,
                book.genre,
                author.first_name,
                author.last_name
            FROM book INNER JOIN author
                ON book.author_id = author.author_id;
        `);
        const books = statement.all();

        res.status(200).json(books);

    } catch (err) {
        next(err);
    }
}

/** @type {import("express").RequestHandler} */
function getBook(req, res, next) {
    try {
        // validate id param first
        const validationResult = bookIdSchema.safeParse(req.params);

        if (!validationResult.success) {
            res.status(400).json({
                message: "Validation error",
                errors: z.flattenError(validationResult.error),
            });

            return;
        }

        const { bookId } = validationResult.data;
        const statement = db.prepare(`
            SELECT
                book.book_id,
                book.title,
                book.year,
                book.pages,
                book.genre,
                author.first_name,
                author.last_name
            FROM book INNER JOIN author
                ON book.author_id = author.author_id
            WHERE book.book_id = ?;
        `);
        const book = statement.get(bookId);
        
        if (!book) {
            res.status(404).json({ message: "Book not found." });
            
            return;
        }

        res.status(200).json(book);

    } catch (err) {
        next(err);
    }
}

/** @type {import("express").RequestHandler} */
function postBook(req, res, next) {
    try {
        const {
            title,
            year,
            pages,
            genre,
            authorFirstName,
            authorLastName,
        } = req.body;

        // get author_id by using firstName and lastName cols
        const selectAuthorStatement = db.prepare(`
            SELECT author_id
            FROM author
            WHERE first_name = ? AND last_name = ?;    
        `);
        const author = selectAuthorStatement.get(authorFirstName, authorLastName);

        if (!author) {
            res.status(404).json({ message: "Author not found; create the author first before adding a book." });

            return;
        }

        const authorId = author.author_id;

        const insertBookStatement = db.prepare(`
            INSERT INTO book
                (title, year, pages, genre, author_id)
            VALUES
                (?, ?, ?, ?, ?);
        `);
        const infoObj = insertBookStatement.run(title, year, pages, genre, authorId);

        if (infoObj.changes === 0) {
            res.status(500).json({ message: "Book was not added, aborting operation." });

            return;
        }

        res.status(201).json({ message: "Book was added successfully." });

    } catch (err) {
        next(err);
    }
}

/** @type {import("express").RequestHandler} */
function deleteBook(req, res, next) {
    try {
        const validationResult = bookIdSchema.safeParse(req.params);

        if (!validationResult.success) {
            res.status(400).json({
                message: "Validation failed",
                errors: z.flattenError(validationResult.error),
            });

            return;
        }

        const { bookId } = validationResult.data;
        const statement = db.prepare(`
            DELETE FROM book
            WHERE book_id = ?;
        `);
        const infoObj = statement.run(bookId);

        if (infoObj.changes === 0) {
            res.status(404).json({ message: "Book not found." });

            return; // stop execution early to not run the later response
        }

        res.status(200).json({ message: "Book has been deleted." });

    } catch (err) {
        next(err);
    }
}

module.exports = {
    getBooks,
    getBook,
    postBook,
    deleteBook,
};
