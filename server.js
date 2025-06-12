"use strict";

const express = require("express");

const authorsRouter = require("./api/routes/authors-router");
const booksRouter = require("./api/routes/books-router");

const app = express();

app.use(express.json());

if (process.env.DEV_DEBUG === "true") {
    const morgan = require("morgan");
    app.use(morgan("dev"));
}

// API routers
app.use("/api/authors", authorsRouter);
app.use("/api/books", booksRouter);

// general server error handler
app.use((err, req, res, _next) => {
    console.error(err.stack || err);

    // check for nonsensical status codes by eliminating non ints
    const statusCode = err.status && Number.isInteger(err.status) ? err.status : 500;
    let errorDetails = {
        error: {
            message: err.message || "Server error",
            stack: "",
        },
    };

    if (process.env.DEV_DEBUG === "true") {
        errorDetails.error.stack = err.stack;
    }

    res.status(statusCode).json(errorDetails);
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}, debug mode ${process.env.DEV_DEBUG ? "on" : "off"}.`);
});
