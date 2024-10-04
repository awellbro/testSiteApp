const Author = require("..models/author");
const asyncHandler = require("express-async-handler");

//display list of all authors
exports.author_list = asyncHandler(async (req, res, next) => {
    res.send("Not Implemented: Author list");
});

//display detail page for specific author
exports.author_detail = asyncHandler(async (req, res, next) => {
    res.send(`Not Implemented: Author detail: ${req.params.id}`);
});

//display author create form on GET
exports.author_create_get = asyncHandler(async (req, res, next) => {
    res.send("Not Implemented: Author create GET");
});

//handle author create on post
exports.author_create_post = asyncHandler(async (req, res, next) => {
    res.send("NOT Implemented: Author create POST");
});

//display author delete form on GET
exports.author_delete_get = asyncHandler(async (req, res, next) => {
    res.send("Not Implemented: Author delete GET");
});

//handle author delete on POST
exports.author_delete_post = asyncHandler(async (req, res, next) => {
    res.send("Not Implemented: Author delete POST");
});

//display Author update form on GET
exports.author_update_get = asyncHandler(async (req, res, next) => {
    res.send("Not Implemented: Author update GET");
});

//Handle author update on POST
exports.author_update_post = asyncHandler(async (req, res, next) => {
    res.send("Not Implemented: Author update POST");
});
