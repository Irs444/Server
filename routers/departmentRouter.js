const express = require('express');
const { authMiddleware } = require('../middlewares/multerMiddleware');
const { addDepartment, getAllDepartment, updateDepartment } = require('../controllers/departmentController');
const router = express.Router();

router.post("/add", authMiddleware, addDepartment)
router.get("/list", authMiddleware, getAllDepartment)
router.put("/:id/update", authMiddleware, updateDepartment)

module.exports = router