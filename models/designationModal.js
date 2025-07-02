const mongoose = require('mongoose')

const designationSchema = new mongoose.Schema({
    name: { type: String, require: true },
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'departments' }
}, { timestamps: true })

const Designation = mongoose.model('designations', designationSchema)

module.exports = Designation