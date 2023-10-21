const { Schema, model } = require('mongoose');

const userSchema = new Schema ({
    email:{
        type:String,
        required: true
    },
    password:{
        type:String,
        required: true
    },
    role:{
        type:Number,
        default: 2001,
    }
}, {timestamps:true});

module.exports = model('users',userSchema); 