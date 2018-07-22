const mongoose = require('mongoose')


const Comment = new mongoose.Schema({
 
  
  email: {
    type: String,
    default: ''
    },
    comment: {
        type: String,
        default: ''
    },
    date:{
      type:Date,
      default: Date.now
    }
})

module.exports = mongoose.model('comment', Comment)