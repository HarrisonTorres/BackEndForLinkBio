const { ObjectId } = require('mongodb');
const mogoose = require('mongoose')


const User = mogoose.model('User',{
    _id: {type: String, required: true, unique: true},
    username: {type: String},
    email: {type: String},
    password: {type: String},
    confirmPassword: {type: String},
    img: {type: String},
    ig: {type: String},
    arrayLinks: Array,
    idURL: {type: String},
    title: {type: String},
    linkURL: {type: String},
    idIconSocial: {type: String},
    href: {type: String},
    id: {type: String}
});

module.exports = User;