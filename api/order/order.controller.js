const orderService = require('./server.order.service')

module.exports = {
    getOrders,
    getOrderById,
    addOrder,
    updateOrder,
    removeOrder
}

async function getOrders(req, res) {
    try {
        const orders = await orderService.query(req.query)
        res.json(orders)
    } catch (error) {
        res.status(500).send({ error: 'Failed to get all orders' })
    }
}

async function getOrderById(req, res) {
    try {
        const { id } = req.params
        const order = await orderService.getById(id)
        res.json(order)
    } catch (error) {
        res.status(500).send({ error: 'Failed to get order' })
    }
}

async function addOrder(req, res) {
    try {
        const order = req.body
        const newOrder = await orderService.add(order)
        res.json(newOrder)
    } catch (error) {
        res.status(500).send({ error: 'Failed to add new order' })
    }
}

async function updateOrder(req, res) {
    try {
        const order = req.body
        const updatedOrder = await orderService.update(order)
        res.json(updatedOrder)
    } catch (error) {
        res.status(500).send({ error: 'Failed to update order' })
    }
}

async function removeOrder(req, res) {
    try {
        const { id } = req.params
        const removedOrder = await orderService.remove(id)
        res.send(removedOrder)
    } catch (error) {
        res.status(500).send({ error: 'Failed to remove order' })
    }
}