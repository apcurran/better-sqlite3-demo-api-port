"use strict";

const { z } = require("zod/v4");

const { db } = require("../../db/index");
const { authorIdSchema, postAuthorSchema, patchAuthorSchema } = require("../validators/author-validators");

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
        // validate user data from req body first
        const validationResult = postAuthorSchema.safeParse(req.body);

        if (!validationResult.success) {
            res.status(400).json({
                message: "Validation failed.",
                errors: z.flattenError(validationResult.error),
            });

            return;
        }

        const { firstName, lastName } = validationResult.data;
        const statement = db.prepare(`
            INSERT INTO author
                (first_name, last_name)
            VALUES
                (?, ?);
        `);
        const info = statement.run(firstName, lastName);

        res.status(201).json({ message: "Author has been added.", authorId: info.lastInsertRowid });

    } catch (err) {
        next(err);
    }
}

/** @type {import("express").RequestHandler} */
function patchAuthor(req, res, next) {
    try {
        // validate data
        const validAuthorId = authorIdSchema.safeParse(req.params);
        
        if (!validAuthorId.success) {
            res.status(400).json({
                message: "Validation failed.",
                errors: z.flattenError(validAuthorId.error),
            });

            return;
        }

        const bodyValidation = patchAuthorSchema.safeParse(req.body);

        if (!bodyValidation.success) {
            res.status(400).json({
                message: "Validation failed.",
                errors: z.flattenError(bodyValidation.error),
            });

            return;
        }

        const { authorId } = validAuthorId.data;
        const validatedBody = bodyValidation.data;
        const fieldsToUpdate = Object.keys(validatedBody);

        if (fieldsToUpdate.length === 0) {
            res.status(400).json({ message: "Please give fields to update, none were provided." });

            return;
        }

        // create the SET portion of the SQL query
        const setClause = fieldsToUpdate
            .map(function convertSnakecaseToCamelcase(key) {
                const dbColumn = key === "firstName" ? "first_name" : "last_name";

                return `${dbColumn} = @${key}`; // ex. "first_name = @firstName"
            })
            .join(", ");
        const statement = db.prepare(`
            UPDATE author
            SET ${setClause}
            WHERE author_id = @authorId;   
        `);
        const namedParams = {
            ...validatedBody,
            authorId,
        };

        // execute and send back a response
        const info = statement.run(namedParams);

        if (info.changes === 0) {
            res.status(404).json({ message: "Author not found" });
            
            return;
        }
        
        res.status(200).json({ message: "Author updated successfully" });

    } catch (err) {
        next(err);
    }
}

/** @type {import("express").RequestHandler} */
function deleteAuthor(req, res, next) {
    try {
        // validate param data
        const validAuthorId = authorIdSchema.safeParse(req.params);

        if (!validAuthorId.success) {
            res.status(400).json({
                message: "Validation failed.",
                errors: z.flattenError(validAuthorId.error),
            });

            return;
        }

        const { authorId } = validAuthorId.data;
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
    patchAuthor,
    deleteAuthor,
};
