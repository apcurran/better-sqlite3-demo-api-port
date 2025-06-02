"use strict";

const { z } = require("zod/v4");

const authorIdSchema = z.strictObject({
    authorId: z.coerce.number().int().positive(),
});

const postAuthorSchema = z.strictObject({
    firstName: z.string("First name is required").trim(),
    lastName: z.string("Last name is required").trim(),
});

module.exports = {
    authorIdSchema,
    postAuthorSchema,
};
