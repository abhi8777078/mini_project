const mongoose=require('mongoose')

userSchema = new mongoose.Schema({
    role: {
        type: String,
        required: [true,'role is required'],
        enum:['donar',"hospital",'admin',"organisation"]
    },
    name: {
        type: String,
        required: function () {
            if (this.role === 'donar' || this.role === 'admin') {
                return true
            }
            return false
        }
    },
    hospitalName: {
        type: String,
        required: function () {
            if (this.role === 'hospital') {
                return true
            }
            return false
        }
    },
    organisationName: {
        type: String,
        required: function () {
            if (this.role === 'organisation') {
                return true
            }
            return false
        }
    },
    email: {
        type: String,
        required: [true,'email is required'],
    },
    password: {
        type: String,
        required: [true,'password is required'],
    },
    phone: {
        type: String,
        required: [true,'phone is required'],
    },
    address: {
        type: String,
        required: [true,'address is required'],
    }
})

module.exports = mongoose.model("users", userSchema);