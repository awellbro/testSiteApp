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
exports.author_create_get = (req, res, next) => {
    res.render('layout', {content: 'author_form', title: 'Create Author', errors: []})
};

//handle author create on post
exports.author_create_post = [
    //validate and sanitize all fields
    body('first_name')
    .trim()
    .isLength({min: 1})
    .escape()
    .withMessage('Enter a first name')
    .isAlphanumeric()
    .withMessage('First Name contains non-alphanumeric characters'),
    body('family_name')
    .trim()
    .isLength({min: 1})
    .escape()
    .withMessage('Enter last name')
    .isAlphanumeric()
    .withMessage('Last Name contains non-alphanumeric characters'),
    body('date_of_birth', 'Invalid date of birth')
    // optional ensures that null or empty values will not send an error during validation
    .optional({nullable: true, checkFalsy: true})
    .isISO8601()
    .toDate(),
    body('date_of_death', 'Invalid date of death')
    .optional({nullable: true, checkFalsy: true})
    .isISO8601()
    .toDate(),

    //process request after vali/tization
    asyncHandler(async (req, res, next) => {
        //extract validation errors
        //express-validator attaches the results of validation checks to the req object
        // body(ex) === req.body.ex - req.errors is passed in the below snippet, not the whole req object
        const errors = validationResult(req);

        // create Author object with escaped and trimmed data
        const author = new Author({
            first_name: req.body.first_name,
            family_name: req.body.family_name,
            date_of_birth: req.body.date_of_birth,
            date_of_death: req.body.date_of_death,
        });
    
        if(!errors.isEmpty()){
            res.render('layout', {
                content: 'author_form',
                title: 'Create Author',
                author: author,
                errors: errors.array(),
            });
            return;
        } else {
            // no errors
            await author.save();
            res.redirect(author.url);
        }
    }),
];

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
