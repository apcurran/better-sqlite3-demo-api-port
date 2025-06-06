"use strict";

const { describe, it, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const express = require("express");

const { resetDb } = require("../../db/db-test-utils");
const authorsRouter = require("../routes/authors-router");

const app = express();
app.use(express.json());
app.use("/api/authors", authorsRouter);

beforeEach(() => {
    resetDb();
});

describe("author tests", function () {
    it("GET all authors", async () => {
        const response = await request(app)
            .get("/api/authors")
            .expect("Content-Type", /json/)
            .expect(200);

        assert.strictEqual(response.body.length, 9);
    });

    it("GET one specific author by id", async () => {
        const authorId = 3;
        const response = await request(app)
            .get(`/api/authors/${authorId}`)
            .set("Accept", "application/json");
        assert.match(response.headers["content-type"], /json/);
        assert.equal(response.status, 200);
        assert.ok(typeof response.body.author_id === "number", "author_id should be a number");
        assert.ok(typeof response.body.first_name === "string", "first_name should be a string");
        assert.ok(typeof response.body.last_name === "string", "last_name should be a string");
    });

    it("POST adds one new author, 'William Shakespeare'", async () => {
        const firstName = "William";
        const lastName = "Shakespeare";
        const response = await request(app)
            .post("/api/authors")
            .send({ firstName, lastName })
            .set("Accept", "application/json");
        assert.match(response.headers["content-type"], /json/);
        assert.equal(response.status, 201);
        assert.ok(typeof response.body.authorId === "number", "authorId field should be a number");
        assert.ok(typeof response.body.message === "string", "message field should be a string");
    });

    it("DELETE one author by id", async () => {
        const authorId = 8;
        const response = await request(app)
            .delete(`/api/authors/${authorId}`)
            .set("Accept", "application/json");
        assert.match(response.headers["content-type"], /json/);
        assert.equal(response.status, 200);
        assert.ok(typeof response.body.message === "string", "message field should be a string");

        const followUpCheck = await request(app)
            .get(`/api/authors/${authorId}`)
            .set("Accept", "application/json");

        assert.equal(followUpCheck.status, 404, "Deleted author should be gone.");
    });
});
