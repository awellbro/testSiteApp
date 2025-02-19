const mongoose = require('mongoose');
const {DateTime} = require('luxon');
const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
    first_name: {type: String, required: true, maxLength: 100},
    family_name: {type: String, required: true, maxLength: 100},
    date_of_birth: {type: Date},
    date_of_death: {type: Date},
});

AuthorSchema.virtual("name").get(function(){
    let fullname = "";
    if(this.first_name && this.family_name){
        fullname = `${this.family_name}, ${this.first_name}`;
    };

    return fullname
});

AuthorSchema.virtual("url").get(function(){
    return `/catalog/author/${this._id}`
});

AuthorSchema.virtual('date_of_birth_formatted').get(function(){
// if this.d_o_b exists, return DateTime formatting, if not, return empty string.
    return this.date_of_birth ? 
    DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED) : '';
});

AuthorSchema.virtual('date_of_death_formatted').get(function(){
    return this.date_of_death ?
    DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED) : '';
});

AuthorSchema.virtual('date_of_birth_form').get(function(){
    // if this.d_o_b exists, return DateTime formatting, if not, return empty string.
        return this.date_of_birth ? 
        this.date_of_birth.toISOString().split('T')[0] : '';
    });
    
    AuthorSchema.virtual('date_of_death_form').get(function(){
        return this.date_of_death ?
        this.date_of_death.toISOString().split('T')[0] : '';
    });

AuthorSchema.virtual('lifespan').get(function(){
    const dobFormatted = this.date_of_birth ? DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED) : '';
    const dodFormatted = this.date_of_death ? DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED) : '';

    return `${dobFormatted} - ${dodFormatted}`;
});

module.exports = mongoose.model('Author', AuthorSchema);