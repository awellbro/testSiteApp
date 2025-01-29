const Genre = require("../models/genre");
const Book = require('../models/book');
const asyncHandler = require("express-async-handler");
const {body, validationResult} = require('express-validator');

// Display list of all Genre.
exports.genre_list = asyncHandler(async (req, res, next) => {
  const allGenres = await Genre.find().sort({name: 1}).exec();

  res.render('layout', {
    content: 'genre_list',
    title: 'Genre List',
    genre_list: allGenres,
  });
});

// Display detail page for a specific Genre.
exports.genre_detail = asyncHandler(async (req, res, next) => {
  const [genre, booksInGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    // filter search by genre's matching req.params.id,
    // title summary = optional projection param. include only 'title' and 'summary' in results (space seperated)
    Book.find({genre: req.params.id}, 'title summary').exec(),
  ]);
  if (genre === null){
    const err = new Error('Genre not found');
    err.status = 404;
    return next(err);
  }

  res.render('layout', {
    content: 'genre_detail',
    title: 'Genre Detail',
    genre: genre,
    genre_books: booksInGenre,
  });
});

// Display Genre create form on GET.
exports.genre_create_get = (req, res, next) => {
  res.render('layout', {content: 'genre_form', title: 'Create Genre', errors: [],});
};

// Handle Genre create on POST.
exports.genre_create_post = [
  //validate and sanitize 'name' field
  body('name', "Genre name must contain at least 3 characters")
  .trim()
  .isLength({min: 3})
  .escape(),

  // process request after validated and santized
  asyncHandler(async (req, res, next) => {
    // extract the validation errors from a request
    const errors = validationResult(req);

    // create a genre object with escaped and trimmed data
    const genre = new Genre({name: req.body.name});

    if(!errors.isEmpty()){
      // if there are errors, render the form again with sanitized values/error messages
      res.render('layout', {
        content: 'genre_form',
        title: 'Create Genre',
        genre: genre,
        errors: errors.array(),
      });
      return;
    } else {
      // data from form is valid - no errors
      // check if Genre with same name already exists
      const genreExists = await Genre.findOne({name: req.body.name})
      // collation ensures case sensitivity
      //    locale - check string against english comparison
      //    strength - case and diacritic sensitive (cafe = cafe and cafe'(with accent over e))
      .collation({locale: 'en', strength: 2})
      .exec();

      if (genreExists) {
        // redirect to Genre detail page if Genre exists
        res.redirect(genreExists.url);
      } else {
        await genre.save();
        // new Genre saved. redirect to Genre detail page
        res.redirect(genre.url);
      }
    }
}),
];

// Display Genre delete form on GET.
exports.genre_delete_get = asyncHandler(async (req, res, next) => {
  const [genre, booksInGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({genre: req.params.id}, "title summary").exec(),
  ]);

  if(genre === null){
    // no associated genre
    res.redirect('/catalog/genres')
  }

  res.render('layout', {
    content: 'genre_delete',
    title: 'Delete Genre',
    genre: genre,
    genre_books: booksInGenre,
  });
});

// Handle Genre delete on POST.
exports.genre_delete_post = asyncHandler(async (req, res, next) => {
  const [genre, booksInGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({genre: req.params.id}, "title summary").exec(),
  ]);

  if (booksInGenre.length > 0){
    // there are books associated with genre
    res.render('layout', {
      content: 'genre_delete',
      title: 'Delete Genre',
      genre: genre,
      genre_books: booksInGenre,
    });
  } else {
    //genre is nota associated with any books - delete object and return to list
    // of genres
    await Genre.findByIdAndDelete(req.body.genreid);
    res.redirect('/catalog/genres');
  }
});

// Display Genre update form on GET.
exports.genre_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre update GET");
});

// Handle Genre update on POST.
exports.genre_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre update POST");
});
