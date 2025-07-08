const { default: mongoose } = require("mongoose");
const Credit = require("../models/creditModal");

const addCredit = async (req, res) => {
    try {
        const { employeeId, creditLimit, effectiveFrom, effectiveTo } = req.body;
        const currentUser = req.user;
        if (currentUser.role !== 'admin') return res.status(403).send({ message: 'Access denied. Only admin can create credits' })
        if (employeeId === currentUser.id) return res.status(403).send({ message: 'You cannot assign credit to yourself' })
        if (employeeId === '' || creditLimit === '' || effectiveFrom === '' || effectiveTo === '') {
            return res.status(400).send({ message: 'Fields cannot be empty' })
        }
        const existingCredit = await Credit.findOne({
            employeeId,
            effectiveFrom: { $lte: new Date(effectiveTo) },
            effectiveTo: { $gte: new Date(effectiveFrom) }
        });
        if (existingCredit) return res.status(400).send({ message: 'Credit already exist for this employee' })
        const credit = new Credit({
            employeeId,
            creditLimit,
            availableCredit: creditLimit,
            effectiveFrom,
            effectiveTo,
            createdBy: currentUser.id
        });

        await credit.save();
        return res.status(201).send({ message: 'Credit create successfully' })
    } catch (err) {
        return res.status(500).send({ message: err.message })
    }
}

const getAllCredit = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // for filter and search
        const { employeeId } = req.query;
        const matchStage = {};

        if (employeeId && mongoose.Types.ObjectId.isValid(employeeId)) {
            matchStage.employeeId = new mongoose.Types.ObjectId(employeeId)
        }

        const totalCount = await Credit.aggregate([
            { $match: matchStage },
            {
                $lookup: {
                    from: 'users',
                    localField: "employeeId",
                    foreignField: "_id",
                    as: "User"
                }
            },
            { $unwind: '$User' },
            { $count: 'total' }
        ]);

        const total = totalCount[0]?.total || 0;
        const data = await Credit.aggregate([
            { $match: matchStage },
            {
                $lookup: {
                    from: 'users',
                    localField: "employeeId",
                    foreignField: "_id",
                    as: "User"
                }
            },
            { $unwind: '$User' },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit }
        ])

        return res.status(200).send({
            message: 'Credit fetch successfully',
            page,
            total,
            pages: Math.ceil(total / limit),
            data
        })
    } catch (err) {
        return res.status(500).send({ message: err.message })
    }
}

module.exports = { addCredit, getAllCredit }