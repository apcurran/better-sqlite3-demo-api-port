"use strict";

const { z } = require("zod/v4");

const { db } = require("../../db/index");
const { authorIdSchema, postAuthorSchema } = require("../validators/author-validators");

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
        // validate user input first
        const validAuthorId = authorIdSchema.safeParse(req.params);

        if (!validAuthorId.success) {
            // send back an error
            res.status(400).json({
                message: "Validation failed",
                errors: z.flattenError(validAuthorId.error),
            });

            return;
        }

        const { authorId } = validAuthorId.data;
        const statement = db.prepare(`
            SELECT *
            FROM author
            WHERE author_id = ?;    
        `);
        const author = statement.get(authorId);

        if (!author) {
            res.status(404).json({ message: "Author not found." });
            
            return;
        }
    
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
