const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    method: {
        type: String,
        enum: ['local', 'google', 'facebook'],
        required: true
    },
    local: {
        email: {
            type: String,
            lowercase: true
        },
        password: {
            type: String,
        },
        secretToken: {
            type: String
        },
        Isactive: {
            type: Boolean
        },
        Passwordtoken:{
            type:String
        },

        PasswordResetDate: {
            type:Date
        }
    },
    google: {
        id: {
            type: String
        },
        email: {
            type: String,
            lowercase: true
        }
    },
    facebook: {
        id: {
            type: String
        },
        email: {
            type: String,
            lowercase: true
        }
    }


});

userSchema.pre('save', async function (next) {
    try {
        if (this.method != 'local') {
            console.log(this.method)
            next();
        }
        console.log("called!!!")
        //generate a salt
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(this.local.password, salt);
        console.log(passwordHash);
        this.local.password = passwordHash;
        console.log(this.local.password);
        next();
    } catch (error) {
        next(error);
    }
});
userSchema.methods.isValidPassword = async function (newPass) {
    try {

        return await bcrypt.compare(newPass, this.local.password)

    } catch (error) {
        throw new Error(error);
    }
}
const User = mongoose.model('user', userSchema);

module.exports = User;