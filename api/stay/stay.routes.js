const express = require('express')
const { getStays, getStayById, addStay, updateStay, removeStay } = require('./stay.controller')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const router = express.Router()

module.exports = router

router.get('/', getStays)
router.get('/:id', getStayById)
router.post('/', requireAuth, addStay)
router.put('/:id', requireAuth, updateStay)
router.delete('/:id', requireAuth, requireAdmin, removeStay)