let mongoose = require('mongoose');

let helperSchema = new mongoose.Schema({
    helperName: {
        type: String,
        required: [true, 'name is required']
    },
    helperEmail: {
        type: String,
        required: [true, 'email is required'],
        trim: true,
        lowercase: true,
        unique: true
    },
    helperProfile: {
        type: String,
        required: [true, 'helper profile is required']
    },
    helperPhone: {
        type: Number,
        unique: true,
        minlength: [10, "Phone no must be at least 10 digits long"]
    },
    helperPassword: {
        type: String,
        minlength: [8, 'password min 8 digits'],
        required: [true, 'password is required'],
        trim: true
    },
    helperStatus: {
        type: Boolean,
        default: false
    },
    otp: {
        type: Number
    },
});

let helperModel = mongoose.model('helper', helperSchema);
module.exports = { helperModel };
