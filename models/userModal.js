const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    name: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true },
    otp: { type: String },
    otpExpire: { type: Date },
    role: { type: String, enum: ['employee', 'manager', 'admin'], default: 'employee' },
    level: { type: Number, enum: [1, 2, 3], default: 3 },
    reportsTo: { type: mongoose.Schema.Types.ObjectId, ref: 'users', default: null },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'departments' },
    position: { type: String },
    isActive: { type: Boolean, default: true }

}, { timestamps: true })

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hashSync(this.password, 10)
    next();
})

const User = mongoose.model('users', userSchema)

module.exports = User