const mongoose = require('mongoose')

const creditSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', require: true },
    creditLimit: { type: Number, require: true },
    availableCredit: { type: Number, require: true },
    effectiveFrom: { type: Date, require: true },
    effectiveTo: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }
}, { timestamps: true })

const Credit = mongoose.model('credits', creditSchema)

module.exports = Credit