const mongoose = require('mongoose')
const Schema = mongoose.Schema
const patientSchema = new Schema({
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
    },
    dateofbirth:{
        type:Date,
        required:true,
    },
    tel:{
        type:String,
        required:true
    },
    email:String,
    address:String,
    createdAt:{
        type:Date,
        immutable:true,
        default:()=>Date.now()
    }
})
module.exports = mongoose.model('Patient',patientSchema)