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
    authorFirstName: z.string("Author first name is required.").trim(),
    authorLastName: z.string("Author last name is required.").trim(),
});

// create a copy of postBookSchema to prevent code duplication
// however, make fields optional and add a check using .refine() with a custom error message
const patchBookSchema = postBookSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, { message: "You must provide at least one field to update." });

module.exports = {
    bookIdSchema,
    postBookSchema,
    patchBookSchema,
};
