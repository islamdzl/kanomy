const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://legbedjislam:uFheLK2zDUUYNpFF@isodpl.cqon59s.mongodb.net/?retryWrites=true&w=majority&appName=isodpl')
.then(()=>{
    console.log('connected successfully')
}).catch((eroor)=>{
    console.log('Error : ', eroor)
})
// Password : uFheLK2zDUUYNpFF

const Schema = mongoose.Schema
const users = new Schema({
        name:String,
        age:Number,
        email:String,
        password:String,
        country:String,
        ws:String
})
module.exports = mongoose.model('user',users)