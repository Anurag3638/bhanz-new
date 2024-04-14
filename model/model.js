const mongoose = require('mongoose');

const newProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true  // Not required since it's optional
  },
  countInStock: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
});

const Product = mongoose.model('Product', newProductSchema);
module.exports = Product;
