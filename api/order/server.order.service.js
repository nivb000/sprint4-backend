const dbService = require('../db.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    query,
    getById,
    remove,
    add,
    update
}
// queryUsertoys

async function query() {
    try {

        const collection = await dbService.getCollection('order')
        let orders = await collection.find().toArray()
        return orders
    } catch (error) {
        throw error
    }
}
async function getById(id) {
    try {
        const collection = await dbService.getCollection('order')
        const order = collection.findOne({ _id: ObjectId(id) })
        return order
    } catch (error) {
        throw error
    }
}
async function remove(id) {
    try {
        const collection = await dbService.getCollection('order')
        await collection.deleteOne({ _id: ObjectId(id) })
        return id
    } catch (error) {
        throw error
    }
}

async function add(order) {
    try {
        order.createdAt = Date.now()
        const collection = await dbService.getCollection('order')
        const addedOrder = await collection.insertOne(order)
        return addedOrder
    } catch (error) {
        throw error
    }
}

async function update(order) {
    try {
        let id = ObjectId(order._id)
        delete order._id
        const collection = await dbService.getCollection('order')
        await collection.updateOne({_id: id},{$set: {...order}})
        return order
    } catch (error) {
        throw error
    }
}