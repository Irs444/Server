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

const getAllDepartment = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const department = await Department.find().skip(skip).limit(limit);
        const total = await Department.countDocuments();

        return res.status(200).send({
            message: 'Fetch all department successfully',
            page,
            total,
            pages: Math.ceil(total / limit),
            department
        })
    } catch (err) {
        return res.status(500).send({ message: err.message })
    }
}

const updateDepartment = async (req, res) => {
    try {
        const { id } = req.params
        const { name } = req.body
        const currentUser = req.user
        if (currentUser.role !== "admin") return res.status(403).send({ message: 'Access denied. Only admin can update department' })
        if (name == '') return res.status(400).send({ message: 'Field cannot be empty' })
        const department = await Department.findOne({ name })
        if (department) return res.status(400).send({ message: 'Department already exist' })
        const updatedDepartment = await Department.updateOne({ _id: id }, { $set: { name } })
        if (updatedDepartment.acknowledged !== true) return res.status(404).send({ message: 'Department not found' })
        return res.status(200).send({ message: 'Department update successfully' })
    } catch (err) {
        return res.status(500).send({ message: err.message })
    }
}

module.exports = { addDepartment, getAllDepartment, updateDepartment }