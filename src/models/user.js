const mongoose = require('mongoose')



const UserSchema = new mongoose.Schema({
    password: {
        type: String,
        require: true
    },
   
    email: {
        type: String,
        unique: true,
       
    },
    name: {
        type: String
       
    },
    surname: {
        type: String
       
    },
    phone:{
        type: Number,
        default: 0,

    },
    age:{
        type: Number
    }

})

module.exports = mongoose.model('hi', UserSchema)