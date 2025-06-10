"use strict";

const { describe, it, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const express = require("express");

const { resetDb } = require("../../db/db-test-utils");
const booksRouter = require("../routes/books-router");

const app = express();
app.use(express.json());
app.use("/api/books", booksRouter);

beforeEach(() => {
    resetDb();
});

describe("books router tests", () => {
    it("GET all books", async () => {
        const response = await request(app)
            .get("/api/books")
            .expect("Content-Type", /json/)
            .expect(200);

        assert.equal(response.body.length, 15);
    });

    it("GET one specific book by id", async () => {
        const bookId = 2;
        const response = await request(app)
            .get(`/api/books/${bookId}`)
            .set("Accept", "application/json");
        assert.match(response.headers["content-type"], /json/);
        assert.equal(response.status, 200);

        const { book_id, title, year, pages, genre, first_name, last_name } = response.body;
        assert.equal(typeof book_id, "number");
        assert.equal(typeof title, "string");
        assert.equal(typeof year, "number");
        assert.equal(typeof pages, "number");
        assert.equal(typeof genre, "string");
        assert.equal(typeof first_name, "string");
        assert.equal(typeof last_name, "string");
    });

    it("GET a book with an invalid id returns 404 not found", async () => {
        const bookId = 9000;
        await request(app)
            .get(`/api/books/${bookId}`)
            .expect("Content-Type", /json/)
            .expect(404);
    });
});
