const Designation = require("../models/designationModal");

const addDesignation = async (req, res) => {
    try {
        const { name, departmentId } = req.body;
        const currentUser = req.user;
        if (name == '' || departmentId == '') return res.status(400).send({ message: 'Fields cannot be empty' })
        if (currentUser.role !== 'admin') return res.status(400).send({ message: 'Access denied. Only admin can add designation' })
        const designation = await Designation.findOne({ name, departmentId })
        if (designation) return res.status(400).send({ message: 'Designation already exist' })
        const newDesignation = new Designation({ name, departmentId })
        await newDesignation.save();
        return res.status(201).send({ message: 'Designation created successfully' })
    } catch (err) {
        return res.status(500).send({ message: err.message })
    }
}

module.exports = { addDesignation }