"use strict";

const { db } = require("../../db/index");

/** @type {import("express").RequestHandler} */
function getAuthors(req, res, next) {
    try {
        // SQL query here
        const statement = db.prepare(`
            SELECT *
            FROM author;
        `);
        const rows = statement.all();

        res.status(200).json(rows);

    } catch (err) {
        next(err);
    }
}

/** @type {import("express").RequestHandler} */
function getAuthor(req, res, next) {
    try {
        const { authorId } = req.params;
        const statement = db.prepare(`
            SELECT *
            FROM author
            WHERE author_id = ?;    
        `);
        const author = statement.get(authorId);
    
        res.status(200).json(author);

    } catch (err) {
        next(err);
    }
}

/** @type {import("express").RequestHandler} */
function postAuthor(req, res, next) {
    try {
        const { firstName, lastName } = req.body;
        const statement = db.prepare(`
            INSERT INTO author
                (first_name, last_name)
            VALUES
                (?, ?);
        `);
        statement.run(firstName, lastName);

        res.status(201).json({ message: "Author has been added." });
        
    } catch (err) {
        next(err);
    }
}

/** @type {import("express").RequestHandler} */
function deleteAuthor(req, res, next) {
    try {
        const { authorId } = req.params;
        const statement = db.prepare(`
            DELETE FROM author
            WHERE author_id = ?;
        `);
        const infoObj = statement.run(authorId);

        if (infoObj.changes === 0) {
            res.status(404).json({ message: "Author not found." });

            return; // stop execution early to not run the later response
        }

        res.status(200).json({ message: "Author deleted." });
        
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getAuthors,
    getAuthor,
    postAuthor,
    deleteAuthor,
};
