const express = require('express');
const { authMiddleware } = require('../middlewares/multerMiddleware');
const { addDesignation, getAllDesignation, updateDesignation, deleteDesignation } = require('../controllers/designationController');
const router = express.Router();

router.post("/add", authMiddleware, addDesignation)
router.get("/list", authMiddleware, getAllDesignation)
router.put("/:id/update", authMiddleware, updateDesignation)
router.delete("/:id", authMiddleware, deleteDesignation)

module.exports = router