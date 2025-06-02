"use strict";

const { z } = require("zod/v4");

const bookIdSchema = z.strictObject({
    bookId: z.coerce.number().int().positive(),
});

const postBookSchema = z.strictObject({
    title: z.string().trim(),
    year: z.int().positive(),
    pages: z.int().positive(),
    genre: z.enum([
        "fantasy",
        "sci-fi",
        "mystery",
        "non-fiction",
        "fiction",
        "romance",
        "horror",
    ]),
    authorFirstName: z.string().trim(),
    authorLastName: z.string().trim(),
});

module.exports = {
    bookIdSchema,
    postBookSchema,
};
