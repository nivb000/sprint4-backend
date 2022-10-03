const dbService = require('../db.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    query,
    getById,
    remove,
    add,
    update
}

async function query(filterBy = {}) {
    try {
        const collection = await dbService.getCollection('order')
        const criteria = _buildCriteria(filterBy)
        let orders = await collection.find(criteria).toArray()
        // let orders = await collection.aggregate([
        //     {
        //         $lookup:
        //         {
        //             localField: 'hostId',
        //             from: 'user',
        //             foreignField: '_id',
        //             as: 'host'
        //         }
        //     },
        //     {
        //         $unwind: '$host'
        //     },
        // ]).toArray()
        // orders = orders.map(order => {
        //     console.log('order after aggregate', order);
        //     return orders
        //     stay.seller = { _id: review.byUser._id, fullname: review.byUser.fullname, }
        //     delete review.byUserId
        //     delete review.aboutUserId
        //     return review
        // })
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
        await collection.updateOne({ _id: id }, { $set: { ...order } })
        return order
    } catch (error) {
        throw error
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.hostId) criteria.hostId = filterBy.hostId
    return criteria
}