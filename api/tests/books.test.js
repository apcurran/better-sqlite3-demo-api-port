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

    it("POST adds one new book, 'The Fellowship of the Ring'", async () => {
        const book = {
            title: "The Fellowship of the Ring",
            year: 1954,
            pages: 432,
            genre: "fantasy",
            authorFirstName: "J.R.R.",
            authorLastName: "Tolkien",
        };
        const response = await request(app)
            .post("/api/books")
            .send(book)
            .set("Accept", "application/json");
        assert.match(response.headers["content-type"], /json/);
        assert.equal(response.status, 201);
        assert.equal(typeof response.body.message, "string", "message field should be a string");
        assert.equal(typeof response.body.bookId, "number", "bookId should be a number");
    });

    it("PATCH updates one book by ID", async () => {
        const bookId = 3;
        const updatedYear = 2000;
        const updatedPageCount = 500;
        const originalAuthorId = 3;

        const response = await request(app)
            .patch(`/api/books/${bookId}`)
            .send({
                "year": updatedYear, // change from 2001
                "pages": updatedPageCount, // change from 480
                "authorId": originalAuthorId, // must have authorId in req
            });

        assert.match(response.headers["content-type"], /json/, "PATCH response should be JSON data");
        assert.equal(response.status, 200);
        assert.equal(typeof response.body.message, "string", "message field should be a string");
    });

    it("DELETE one book by id", async () => {
        const bookId = 3;
        const response = await request(app)
            .delete(`/api/books/${bookId}`)
            .set("Accept", "application/json");
        assert.match(response.headers["content-type"], /json/);
        assert.equal(response.status, 200);
        assert.equal(typeof response.body.message, "string", "expected message field should be a string");

        const followUpCheck = await request(app)
            .get(`/api/books/${bookId}`)
            .set("Accept", "application/json");
        assert.equal(followUpCheck.status, 404, "Deleted book should be gone now");
    });
});
