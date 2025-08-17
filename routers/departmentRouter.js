const express = require('express');
const { authMiddleware } = require('../middlewares/multerMiddleware');
const { addDepartment, getAllDepartment, updateDepartment, deleteDepartment } = require('../controllers/departmentController');
const { addDepartmentValidator } = require('../validators/department');
const { runValidation } = require('../validators');
const router = express.Router();

router.post("/add", authMiddleware, addDepartmentValidator, runValidation, addDepartment)
router.get("/list", authMiddleware, getAllDepartment)
router.put("/:id/update", authMiddleware, updateDepartment)
router.delete("/:id", authMiddleware, deleteDepartment)

module.exports = router