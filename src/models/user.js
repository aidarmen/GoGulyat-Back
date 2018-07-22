const mongoose = require('mongoose')



const UserSchema = new mongoose.Schema({
    password: {
        type: String,
        require: true
    },
   
    email: {
        type: String,
        unique: true
       
    },
    name: {
        type: String
       
    },
    surname: {
        type: String
       
    },
    phone:{
        type: String
        

    },
    age:{
        type: Number
    }
    

})

module.exports = mongoose.model('user', UserSchema)