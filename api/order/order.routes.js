const express = require('express')
const { getOrders, getOrderById, addOrder, updateOrder, removeOrder } = require('./order.controller')
const { requireAuth } = require('../../middlewares/requireAuth.middleware')
const router = express.Router()

module.exports = router

router.get('/', requireAuth, getOrders)
router.get('/:id', getOrderById)
router.post('/', requireAuth, addOrder)
router.put('/:id', requireAuth, updateOrder)
router.delete('/:id', requireAuth, removeOrder)