const express = require('express')
const { getToys, getToyById, addToy, updateToy, removeToy } = require('./toy.controller')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const router = express.Router()

module.exports = router

router.get('/', getToys)
router.get('/:id', getToyById)
router.post('/', requireAuth, addToy)
router.put('/:id', requireAuth, updateToy)
router.delete('/:id', requireAuth, requireAdmin, removeToy)