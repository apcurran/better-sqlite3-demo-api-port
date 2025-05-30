"use strict";

const { db } = require("../../db/index");

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
        const { bookId } = req.params;
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


    } catch (err) {
        next(err);
    }
}

/** @type {import("express").RequestHandler} */
function deleteBook(req, res, next) {
    try {
        const { bookId } = req.params;
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
