"use strict";

const { z } = require("zod/v4");

const authorIdSchema = z.strictObject({
    authorId: z.coerce.number().int().positive(),
});

const postAuthorSchema = z.strictObject({
    firstName: z.string("Valid first name is required").trim(),
    lastName: z.string("Valid last name is required").trim(),
});

const patchAuthorSchema = postAuthorSchema.partial();

module.exports = {
    authorIdSchema,
    postAuthorSchema,
    patchAuthorSchema,
};
