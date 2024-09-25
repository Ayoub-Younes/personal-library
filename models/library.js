const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.connect(process.env.MONGO_URI)



const librarySchema = new Schema({
  title: {
  type: String,
  required: true
},
  comments: {
  type: Array,
  default: []
},
  commentcount: {
  type: Number,
  default: 0
}
  
});

const Library = mongoose.model('Library', librarySchema);
module.exports = Library;
