const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({

  formData: {
    type: Object,
  },


  
})

module.exports = mongoose.model('posts', postSchema)


