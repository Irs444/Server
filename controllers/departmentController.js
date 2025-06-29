const Department = require("../models/departmentModal")

const addDepartment = async (req, res) => {
    try {
        const { name } = req.body
        const currentUser = req.user
        if (currentUser.role !== "admin") return res.status(403).send({ message: 'Access denied. Only admin can create department' })
        if (name == '') return res.status(400).send({ message: 'Field cannot be empty' })
        const department = await Department.findOne({ name })
        if (department) return res.status(400).send({ message: 'Department already exist' })
        const newDepartment = new Department({ name })
        await newDepartment.save();
        return res.status(201).send({ message: 'Department created successfully', newDepartment })
    } catch (err) {
        return res.status(500).send({ message: err.message })
    }
}

module.exports = { addDepartment }