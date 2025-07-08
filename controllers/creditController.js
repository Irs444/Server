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

module.exports = { addCredit }