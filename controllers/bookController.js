const Book = require("../models/book");
const Author = require('../models/author');
const Genre = require('../models/genre');
const BookInstance = require('../models/bookinstance');

const asyncHandler = require("express-async-handler");

const {body, validationResult} = require('express-validator');

exports.index = asyncHandler(async (req, res, next) => {
  //get details of books, book instance, authors and genre counts
  const [
    numBooks,
    numBookInstances,
    numAvailableBookInstances,
    numAuthors,
    numGenres,
  // Promise.all is used to all run queries (countDocuments.exec) in parallel
  //once all promises are fulfilled, the results populate the array of values above ^
  ] = await Promise.all([
    Book.countDocuments({}).exec(),
    BookInstance.countDocuments({}).exec(),
    BookInstance.countDocuments({status: "Available"}).exec(),
    Author.countDocuments({}).exec(),
    Genre.countDocuments({}).exec(),
  ]);
  res.render("layout", {
    content: 'index',
    title: "Local Library Heime",
    book_count: numBooks,
    book_instance_count: numBookInstances,
    book_instance_count_available: numAvailableBookInstances,
    author_count: numAuthors,
    genre_count: numGenres,
  });
});

// Display list of all books.
exports.book_list = asyncHandler(async (req, res, next) => {
  const allBooks = await Book.find({}, "title author")
    .sort({title: 1})
    .populate("author")
    .exec();

  res.render("layout", {content: 'book_list', title: "Book List", book_list: allBooks});
});

// Display detail page for a specific book.
exports.book_detail = asyncHandler(async (req, res, next) => {
  const [book, bookInstances] = await Promise.all([
    Book.findById(req.params.id).populate('author').populate('genre').exec(),
    BookInstance.find({ book: req.params.id }).exec(),
  ]);
  if (book === null){
    const err = new Error('Book not found');
    err.status = 404;
    return next(err);
  }
  res.render('layout', {
    content: 'book_detail',
    title: book.title,
    book: book,
    book_instances: bookInstances,
  });
});

// Display book create form on GET.
exports.book_create_get = asyncHandler(async (req, res, next) => {
  const [allAuthors, allGenres] = await Promise.all([
    Author.find().sort({family_name: 1}).exec(),
    Genre.find().sort({name: 1}).exec(),
  ]);
  res.render('layout',{
    content: 'book_form',
    title: "Create Book",
    authors: allAuthors,
    genres: allGenres,
    errors: [],
    book: '',
  });
});

// Handle book create on POST.
exports.book_create_post = [
  // Convert the genre to an array.
  (req, res, next) => {
    if (!Array.isArray(req.body.genre)) {
      req.body.genre =
        typeof req.body.genre === "undefined" ? [] : [req.body.genre];
    }
    next();
  },

  // Validate and sanitize fields.
  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("author", "Author must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("summary", "Summary must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("isbn", "ISBN must not be empty").trim().isLength({ min: 1 }).escape(),
  body("genre.*").escape(),
  // Process request after validation and sanitization.

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Book object with escaped and trimmed data.
    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: req.body.genre,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all authors and genres for form.
      const [allAuthors, allGenres] = await Promise.all([
        Author.find().sort({ family_name: 1 }).exec(),
        Genre.find().sort({ name: 1 }).exec(),
      ]);

      // Mark our selected genres as checked.
      for (const genre of allGenres) {
        if (book.genre.includes(genre._id)) {
          genre.checked = "true";
        }
      }
      res.render("book_form", {
        title: "Create Book",
        authors: allAuthors,
        genres: allGenres,
        book: book,
        errors: errors.array(),
      });
    } else {
      // Data from form is valid. Save book.
      await book.save();
      res.redirect(book.url);
    }
  }),
];


// Display book delete form on GET.
exports.book_delete_get = asyncHandler(async (req, res, next) => {
  // get books and book instance details
  const [book, allBookInstances] = await Promise.all([
    Book.findById(req.params.id).populate('author').populate('genre').exec(),
    BookInstance.find({book: req.params.id}, "isbn").exec(),
  ]);

  if (book === null){
    res.redirect('/catalog/books')
  };

  res.render('layout', {
    content: 'book_delete',
    title: 'Book Delete',
    book: book,
    book_instances: allBookInstances,
  });
});

// Handle book delete on POST.
exports.book_delete_post = asyncHandler(async (req, res, next) => {
  const [book, allBookInstances] = await Promise.all([
    Book.findById(req.params.id).populate('author').populate('genre').exec(),
    BookInstance.find({book: req.params.id}).populate('book').exec(),
  ]);

  if(allBookInstances.length > 0){
    // if book has book instances
    res.render('layout', {
      content: 'book_delete',
      title: 'Book Delete',
      book: book,
      book_instances: allBookInstances,
    });
    console.log(allBookInstances)
    return;
  } else {
    
    // book has no instances
    await Book.findByIdAndDelete(req.body.bookid);
    res.redirect('/catalog/books');
  }
});

// Display book update form on GET.
exports.book_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Book update GET");
});

// Handle book update on POST.
exports.book_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Book update POST");
});
