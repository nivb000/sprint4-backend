const dbService = require('../db.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    query,
    getById,
    remove,
    add,
    update
}
// queryUserstays

async function query() {
    try {

        const collection = await dbService.getCollection('stay')
        let stays = await collection.find().toArray()
        return stays
    } catch (error) {
        throw error
    }
}
async function getById(id) {
    try {
        const collection = await dbService.getCollection('stay')
        const stay = collection.findOne({ _id: ObjectId(id) })
        return stay
    } catch (error) {
        throw error
    }
}
async function remove(id) {
    try {
        const collection = await dbService.getCollection('stay')
        await collection.deleteOne({ _id: ObjectId(id) })
        return id
    } catch (error) {
        throw error
    }
}

async function add(stay) {
    try {
        stay.createdAt = Date.now()
        const collection = await dbService.getCollection('stay')
        const addedStay = await collection.insertOne(stay)
        return addedStay
    } catch (error) {
        throw error
    }
}

async function update(stay) {
    try {
        let id = ObjectId(stay._id)
        delete stay._id
        const collection = await dbService.getCollection('stay')
        await collection.updateOne({_id: id},{$set: {...stay}})
        return stay
    } catch (error) {
        throw error
    }
}