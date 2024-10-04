const express = require("express");
const router = express.Router();

const book_controller = require("../controllers/bookController");
const author_controller = require("../controllers/authorController");
const genre_controller = require("../controllers/genreController");
const book_instance_controller = require("../controllers/bookinstanceController");

//########################################## Book Routes

//catalog home page
router.get("/", book_controller.index);

//GET request for creating new book
router.get("/book/create", book_controller.book_create_get);

//POST request for creating a new book
router.post("/book/create", book_controller.book_create_post);

//GET request for deleting a book
router.get("/book/:id/delete", book_controller.book_delete_get);

//POST request for deleting a book
router.get("/book/:id/delete", book_controller.book_delete_post);

// GET request to update Book.
router.get("/book/:id/update", book_controller.book_update_get);

// POST request to update Book.
router.post("/book/:id/update", book_controller.book_update_post);

//GET for a book
router.get("/book/:id", book_controller.book_detail);

//GET for a list of all books
router.get("/books/", book_controller.book_list);

//#################################### Author Routes

//GET for creating a new author
router.get("/author/create", author_controller.author_create_get);

//POST for creating a new author
router.post("/author/create", author_controller.author_create_post);

//GET for deleting an author
router.get("/author/:id/delete", author_controller.author_delete_get);

//POST for deleteing an author
router.post("/author/:id/delete", author_controller.author_delete_post);

//GET for updating author
router.get("/author/:id/update", author_controller.author_update_get);

//POST for updating author
router.post("/author/:id/update", author_controller.author_update_post);

//GET for an Author
router.get("/author/:id", author_controller.author_detail);

//GET for list of all authors
router.get("/authors", author_controller.author_list);

//################################## Genre Routes

// GET request for creating a genre
router.get('/genre/create', genre_controller.genre_create_get);

// POST request for creating Genre.
router.post('/genre/create', genre_controller.genre_create_post);

// GET request for deleting a genre
router.get('/genre/:id/delete', genre_controller.genre_delete_get);

// POST request for deleting a genre
router.post('/genre/:id/delete', genre_controller.genre_delete_post);

// GET request to update genre
router.get('/genre/:id/update', genre_controller.genre_update_get);

// POST request to update genre
router.post("/genre/:id/update", genre_controller.genre_update_post);

// GET request for one Genre
router.get('/genre/:id', genre_controller.genre_detail);

// GET request for a list of all Genres
router.get('/genres', genre_controller.genre_list);

//####################################### Book Instance Routes

// GET request for creating a BookInstance
router.get("/bookinstance/create", book_instance_controller.bookinstance_create_get);
  
// POST request for creating BookInstance.
router.post("/bookinstance/create", book_instance_controller.bookinstance_create_post);
  
// GET request to delete BookInstance.
router.get("/bookinstance/:id/delete", book_instance_controller.bookinstance_delete_get);
  
// POST request to delete BookInstance.
router.post("/bookinstance/:id/delete", book_instance_controller.bookinstance_delete_post);
  
// GET request to update BookInstance.
router.get("/bookinstance/:id/update", book_instance_controller.bookinstance_update_get);
  
// POST request to update BookInstance.
router.post("/bookinstance/:id/update", book_instance_controller.bookinstance_update_post);
  
// GET request for one BookInstance.
router.get("/bookinstance/:id", book_instance_controller.bookinstance_detail);
  
// GET request for list of all BookInstance.
router.get("/bookinstances", book_instance_controller.bookinstance_list);
  
module.exports = router;