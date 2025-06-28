const mongoose = require('mongoose')


const departmentSchema = new mongoose.Schema({
    name: { type: String, require: true },
}, { timestamps: true })

const Department = mongoose.model('departments', departmentSchema)

module.exports = Department