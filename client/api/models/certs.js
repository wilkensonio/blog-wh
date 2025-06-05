const mongoose = require("mongoose"); 
const slugify = require("slugify"); 
 

const certSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    }, 
   
    imageUrl: {
        type: String,
        default: "/assets/img/certs/certfied.png"
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
  
    createdAt: {
        type: Date, 
        default: new Date()
    },
    
}); 

certSchema.pre('validate', function(next) {
    if (this.title) {
        this.slug = slugify(this.title, {lower: true, strict: true});
    }
    next();
});


const Certs = mongoose.model('certs', certSchema);
module.exports = Certs;