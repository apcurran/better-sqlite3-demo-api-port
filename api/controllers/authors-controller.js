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
    
}

/** @type {import("express").RequestHandler} */
function postAuthor(req, res, next) {
    
}

/** @type {import("express").RequestHandler} */
function deleteAuthor(req, res, next) {
    
}

module.exports = {
    getAuthors,
    getAuthor,
    postAuthor,
    deleteAuthor,
};
