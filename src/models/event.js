const mongoose = require('mongoose')


const Event = new mongoose.Schema({

  
    email: {
      type: String,
      required:true
    },
    text: {
      type: String,
      required:true
  },
    date:{
      type: Date,
      default: Date.now
    },
    
    where:{
      type:String,
      required:true
    }

})

module.exports = mongoose.model('event', Event)