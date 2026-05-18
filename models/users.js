const mongoose = require('mongoose');
const { timeStamp } = require('node:console');

const userSchema = mongoose.Schema({
    userName:{
        type:String,
        required:true,
        trim: true
    },
    email:{
        type:String,
        required:true,
        unique: true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type: String,
        enum:["student","mentor","alumni"],
        default:"student"
    }
},
{
    timestamps:true
})
module.exports = mongoose.model("User", userSchema);