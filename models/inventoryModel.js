const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    inventoryType: {
        type: String,
        required: [true, 'Inventory type is required'],
        enum:['in','out']
    },
    bloodGroup: {
        type: String,
        required: [true, 'bloodGroup is required'],
        enum:['O+','O-','A+','A-','B+','B-','AB+','AB-']
    },
    email: {
        type: String,
        required:true
    },
    quantity: {
        type: Number,
        required: [true, 'bloodGroup is required']
    },
    organisation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: [true, 'organisation is required']
    },
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: function () {
            if (this.inventoryType === 'out') {
                return true
            }
            return false
        }
    },
    donar: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: function () {
            if (this.inventoryType === 'in') {
                return true
            }
            return false
        }
    }
})
module.exports=mongoose.model('Inventory',inventorySchema)