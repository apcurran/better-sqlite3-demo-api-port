"use strict";

const { z } = require("zod/v4");

const authorIdSchema = z.strictObject({
    authorId: z
        .preprocess(function convertIdToInt(id) {
            return Number(id);
        }, z.int().positive()),
});

const postAuthorSchema = z.strictObject({
    firstName: z.string().trim().min(1, "First name is required"),
    lastName: z.string().trim().min(1, "Last name is required"),
});

module.exports = {
    authorIdSchema,
    postAuthorSchema,
};
