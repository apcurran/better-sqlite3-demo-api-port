"use strict";

const path = require("path");

const Database = require("better-sqlite3");
const db = new Database(path.join(__dirname, "books.db"));
db.pragma("journal_mode = WAL");

module.exports = { db };
