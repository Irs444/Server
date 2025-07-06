const express = require('express');
const { authMiddleware } = require('../middlewares/multerMiddleware');
const { addDepartment, getAllDepartment, updateDepartment, deleteDepartment } = require('../controllers/departmentController');
const router = express.Router();

router.post("/add", authMiddleware, addDepartment)
router.get("/list", authMiddleware, getAllDepartment)
router.put("/:id/update", authMiddleware, updateDepartment)
router.delete("/:id", authMiddleware, deleteDepartment)

module.exports = router