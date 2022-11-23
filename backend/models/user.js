const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Schema = mongoose.Schema
const userSchema = new Schema({
    firstname:{
        type:String,
        required:true,
        trim:true,
    },
    lastname:{
        type:String,
        required:true,
        trim:true,
    },
    username:{
        type:String,
        required:true,
        trim:true,
        unique:true,
    },
    isActive:{
        type:Boolean
    },
    email: {
        type:String,
        required:true,
        trim:true,
    },
    password: {
        type:String,
        required:true,
        minlength:6,
    },
    tokens: [{
        token:{
            type: String,
            required: true,
        }
    }],
    designation:{
        type:String,
        required:true,
        trim:true,
    },
    createdAt:{
        type:Date,
        immutable:true,
        default:()=>Date.now()
    }
})
userSchema.virtual('assessments',{
    ref:"Assessment",
    localField: "_id",
    foreignField: "owner",
})
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.token
    return userObject
}
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign(
        { _id: user.id.toString() },
        process.env.PHYSIOAPP_SECRET
    );

    user.tokens = user.tokens.concat({ token });
    await user.save();

    return token;
};
userSchema.statics.findByCredentials = async (username, password) => {
    const user = await User.findOne({ username });

    if (!user) {
        throw new Error("Unable to Login");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Unable to Login");
    }

    return user;
};
userSchema.pre('save', async function(next) {
    const user = this
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password,8)
    }
    next()
})
module.exports = mongoose.model('User',userSchema)