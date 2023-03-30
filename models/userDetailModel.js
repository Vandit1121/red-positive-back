const mongoose = require('mongoose');

const userDetailSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    hobbies:{
        type:String,
        required:true
    }
});

module.exports = new mongoose.model("userDetail",userDetailSchema);