const mongoose = require('mongoose');
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

AuthorSchema.virtual('age').get(function(){
    if (!this.date_of_birth) return null;

    const birthDate = new Date(this.date_of_birth);
    const deathDate = this.date_of_death ? new Date(this.date_of_death) : new Date();
    let age = deathDate.getFullYear() - birthDate.getFullYear();

    if (
        deathDate.getMonth() < birthDate.getMonth() ||
        (deathDate.getMonth() === birthDate.getMonth() && deathDate.getDate() < birthDate.getDate())
    ) {
        age--;
    }
    return age;
});

module.exports = mongoose.model('Author', AuthorSchema);