// this syntax imports the entire mongoose package
//mongoose.model
const mongoose = require("mongoose");
// this is {destructuirng syntax} - import only specified parts of a package
// DateTime.now() - oppossed to luxon.DateTime.now(), if the whole package was imported
const {DateTime} = require('luxon');

const Schema = mongoose.Schema;

const BookInstanceSchema = new Schema({
  book: { type: Schema.Types.ObjectId, ref: "Book", required: true }, // reference to the associated book
  imprint: { type: String, required: true },
  status: {
    type: String,
    required: true,
    //enum allows you to set allowable values of a string
    enum: ["Available", "Maintenance", "Loaned", "Reserved"],
    default: "Maintenance",
  },
  due_back: { type: Date, default: Date.now },
});

// Virtual for bookinstance's URL
BookInstanceSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/bookinstance/${this._id}`;
});

BookInstanceSchema.virtual('due_back_formatted').get(function(){
  return DateTime.fromJSDate(this.due_back).toLocaleString(DateTime.DATE_MED);
});

// Export model
module.exports = mongoose.model("BookInstance", BookInstanceSchema);