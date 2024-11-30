const author = require("../models/author");
const Author = require("../models/author");
const Book = require("../models/book");
const asyncHandler = require("express-async-handler");
const {body, validationResult} = require('express-validator');

//display list of all authors
exports.author_list = asyncHandler(async (req, res, next) => {
    const allAuthors = await Author.find().sort({family_name: 1}).exec();
    res.render('layout', {
                content: 'author_list',
                title: 'Author List',
                author_list: allAuthors,
    });

});

//display detail page for specific author
exports.author_detail = asyncHandler(async (req, res, next) => {
    const [author, booksByAuthor] = await Promise.all([
        Author.findById(req.params.id).exec(),
        Book.find({author: req.params.id}, 'title summary').exec(),
    ]);

    if (author === null){
        const err = new Error('Author Not Found');
        err.status = 404;
        return next(err);
    }

    res.render('layout', {
        content: 'author_detail',
        title: 'Author Detail',
        author: author,
        author_books: booksByAuthor,
    });
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
