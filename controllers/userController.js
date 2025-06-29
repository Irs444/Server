const User = require("../models/userModal")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
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

        const existEmail = await User.findOne({email})
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
        const user = await User.findOne({email})
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

module.exports = { addEmployee , login}