const mogoose = require('mongoose')


const User = mogoose.model('User',{

    username: String,
    email: String,
    password: String,
    confirmPassword: String,
    img: String,
    ig: String,
    arrayLinks: Array,
    idURL: String,
    title: String,
    linkURL: String,
    idIconSocial: String,
    href: String,
    id: String
});

module.exports = User;