"use strict";

const { describe, it, beforeEach } = require("node:test");
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
    it("GET all authors", (currTest, done) => {
        request(app)
            .get("/api/authors")
            .expect("Content-Type", /json/)
            .expect(200, done);
    });
});
