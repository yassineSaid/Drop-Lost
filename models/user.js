const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    method: {
        type: String,
        enum: ['local', 'google', 'facebook'],
        required: true
    },
    
        nom:{
            type: String,
        },
        prenom:{
            type: String,
        },
        ville:{
            type: String,
        },
        adresse:{
            type: String,
        },
        numero:{
            type: Number,
        },
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
    
    
    


});

userSchema.pre('save', async function (next) {
    try {
        if (this.method != 'local') {
            next();
        }
        //generate a salt
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(this.password, salt);
        this.password = passwordHash;
        next();
    } catch (error) {
        next(error);
    }
});
userSchema.methods.isValidPassword = async function (newPass) {
    try {

        return await bcrypt.compare(newPass, this.password)

    } catch (error) {
        throw new Error(error);
    }
}
const User = mongoose.model('user', userSchema);

module.exports = User;