"use strict";

const path = require("path");
const Database = require("better-sqlite3");

const booksDbPath = path.join(__dirname, "books.db");
const db = new Database(process.env.NODE_ENV === "test" ? ":memory:" : booksDbPath);
db.pragma("journal_mode = WAL");

module.exports = { db };
