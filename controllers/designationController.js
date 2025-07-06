const mongoose = require("mongoose");
const Designation = require("../models/designationModal");
const User = require("../models/userModal");

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
        return res.status(201).send({ message: 'Designation created successfully', newDesignation })
    } catch (err) {
        return res.status(500).send({ message: err.message })
    }
}

const getAllDesignation = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit

        // for filter and search
        const { departmentId, search } = req.query;
        const matchStage = {};

        if (departmentId && mongoose.Types.ObjectId.isValid(departmentId)) {
            matchStage.departmentId = new mongoose.Types.ObjectId(departmentId);
        }

        if (search) {
            matchStage.name = { $regex: search, $options: 'i' }; // case sensitive
        }

        const totalCount = await Designation.aggregate([
            { $match: matchStage },
            {
                $lookup: {
                    from: 'departments',
                    localField: 'departmentId',
                    foreignField: '_id',
                    as: 'Department'
                }
            },
            { $unwind: '$Department' },
            { $count: 'total' }
        ]);

        const total = totalCount[0]?.total || 0;
        const data = await Designation.aggregate([
            { $match: matchStage },
            {
                $lookup: {
                    from: 'departments',
                    localField: 'departmentId',
                    foreignField: '_id',
                    as: 'Department'
                }
            },
            { $unwind: '$Department' },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit }
        ])

        return res.status(200).send({
            message: 'Fetch all designation successfully',
            page,
            total,
            pages: Math.ceil(total / limit),
            data
        })
    } catch (err) {
        return res.status(500).send({ message: err.message })
    }
}

const updateDesignation = async (req, res) => {
    try {
        const { id } = req.params
        const { name, departmentId } = req.body
        const currentUser = req.user
        if (currentUser.role !== "admin") return res.status(403).send({ message: 'Access denied. Only admin can update designation' })
        if (name == '' || departmentId == '') return res.status(400).send({ message: 'Fields cannot be empty' })
        const designation = await Designation.findOne({ name, departmentId })
        if (designation) return res.status(400).send({ message: 'Designation already exist' })
        const updatedDesignation = await Designation.updateOne({ _id: id }, { $set: { name, departmentId } })
        if (updatedDesignation.acknowledged !== true) return res.status(404).send({ message: 'Designation not found' })
        return res.status(200).send({ message: 'Designation update successfully' })
    } catch (err) {
        return res.status(500).send({ message: err.message })
    }
}

const deleteDesignation = async (req, res) => {
    try {
        const { id } = req.params
        const currentUser = req.user
        if (currentUser.role !== 'admin') return res.status(403).send({ message: 'Access denied. Only admin can delete designation' })
        const designation = await Designation.findById(id)
        if (!designation) return res.status(404).send({ message: 'Designation not found' })
        const employee = await User.find({ designation: id })
        if (employee.length > 0) return res.status(400).send({ message: 'Access denied. Employee assign to this designation' })
        await Designation.findByIdAndDelete(id)
        return res.status(200).send({ message: 'Designation delete successfully' })
    } catch (err) {
        return res.status(500).send({ message: err.message })
    }
}

module.exports = { addDesignation, getAllDesignation, updateDesignation, deleteDesignation }