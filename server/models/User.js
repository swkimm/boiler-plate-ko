const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds= 10
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

userSchema.pre('save', function( next ) {
    var user = this;
    if(user.isModified('password')) {

        // 비밀번호를 암호화
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if(err) return next(err)
            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return next(err)  
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }
})

userSchema.methods.comparePassword = function(candidatePassword) {
    return new Promise((resolve, reject) => {
        // Your existing compare logic here, e.g., bcrypt.compare
        bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
            if (err) reject(err);
            resolve(isMatch);
        });
    });
};

userSchema.methods.generateToken = function() {
    var user = this;
    return new Promise((resolve, reject) => {
        var token = jwt.sign(user._id.toHexString(), 'secretToken');
        user.token = token;

        user.save().then(user => {
            resolve(user);
        }).catch(err => {
            reject(err);
        });
    });
};

userSchema.statics.findByToken = function(token) {
    var user = this;

    return new Promise((resolve, reject) => {
        jwt.verify(token, 'secretToken', function (err, decoded) {
            if (err) reject(err);

            user.findOne({ "_id": decoded, "token": token }).then(user => {
                resolve(user);
            }).catch(err => {
                reject(err);
            });
        });
    });
};

const User = mongoose.model('User', userSchema)

module.exports = { User }