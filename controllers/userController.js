const User = require("../models/userModal")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { generateOTP } = require("../utils/otpGenerator")
const { sendOTPEmail } = require("../services/emailService")
require('dotenv').config()

const addEmployee = async (req, res) => {
    try {
        const currentUser = req.user
        const { name, email, password, role, level, reportsTo, department, position } = req.body

        // check permission
        if (currentUser.role == 'employee') return res.status(403).send({ message: 'Access denied. Employee cannot create user' })
        if ((role == 'admin' || role == 'manager') && currentUser.role !== 'admin') {
            return res.status(403).send({ message: 'Only admin can create admin and manager' })
        }

        const existEmail = await User.findOne({ email })
        if (existEmail) return res.status(400).send({ message: 'Email already exist' })

        // validate reporting to
        let reportingManager = null
        if (reportsTo) {
            reportingManager = await User.findById(reportsTo)
            if (!reportingManager) return res.status(400).send({ message: 'Reporting manager not found' })
            if (reportingManager.level >= level) {
                return res.status(400).send({ message: 'Reporting manager must be a heigher level' })
            }
        } else if (role !== 'admin') return res.status(400).send({ message: 'Non-admin user must have reporting manager' })

        const newEmployee = new User({
            name,
            email,
            password,
            role,
            level,
            reportsTo: reportingManager ? reportingManager._id : null,
            department,
            position
        })

        await newEmployee.save();

        return res.status(201).send({ message: 'New employee created successfully', newEmployee })

    } catch (err) {
        return res.status(500).send({ message: err.message })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (email == '' || password == '') return res.status(400).send({ message: 'Fields cannot be empty' })
        const user = await User.findOne({ email })
        if (!user) return res.status(400).send({ message: 'Email not register' })
        const comparePassword = await bcrypt.compare(password, user.password)
        if (!comparePassword) return res.status(400).send({ message: 'Password not matched' })
        const token = await jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' })
        return res.status(200).send({
            message: 'Login successfully',
            token,
            role: user.role
        })

    } catch (err) {
        return res.status(500).send({ message: err.message })
    }
}

const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body
        if (email == '') return res.status(400).send({ message: 'Field cannot be empty' })
        const user = await User.findOne({ email })
        if (!user) return res.status(400).send({ message: 'User not found with this email' })
        const otp = generateOTP();
        const otpExpire = new Date(Date.now() + 10 * 60 * 1000) // otp expire in 10 minute.

        user.otp = otp;
        user.otpExpire = otpExpire;
        await user.save();

        await sendOTPEmail(email, otp)

        return res.status(200).send({ message: 'OTP send to your email', otp })
    } catch (err) {
        return res.status(500).send({ message: err.message })
    }
}

const resetPassword = async (req, res) => {
    try {
        const { otp, newPassword, confirmNewPassword } = req.body
        if (newPassword !== confirmNewPassword) return res.status(400).send({ message: 'Password do not match' })
        const user = await User.findOne({ otp, otpExpire: { $gt: Date.now() } })
        if (!user || user.otp !== otp) return res.status(400).send({ message: 'Invalide or expired OTP' })

        user.password = newPassword;
        user.otp = undefined;
        user.otpExpire = undefined;

        await user.save();
        return res.status(200).send({ message: 'Password reset successfully' })
    } catch (err) {
        return res.status(500).send({ message: err.message })
    }
}

module.exports = { addEmployee, login, forgetPassword, resetPassword }