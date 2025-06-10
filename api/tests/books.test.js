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
});
