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

        const collection = await dbService.getCollection('toy')
        let toys = await collection.find().toArray()
        return toys
    } catch (error) {
        throw error
    }
}
async function getById(id) {
    try {
        const collection = await dbService.getCollection('toy')
        const toy = collection.findOne({ _id: ObjectId(id) })
        return toy
    } catch (error) {
        throw error
    }
}
async function remove(id) {
    try {
        const collection = await dbService.getCollection('toy')
        await collection.deleteOne({ _id: ObjectId(id) })
        return id
    } catch (error) {
        throw error
    }
}

async function add(toy) {
    try {
        toy.createdAt = Date.now()
        const collection = await dbService.getCollection('toy')
        const addedToy = await collection.insertOne(toy)
        return addedToy
    } catch (error) {
        throw error
    }
}

async function update(toy) {
    try {
        let id = ObjectId(toy._id)
        delete toy._id
        const collection = await dbService.getCollection('toy')
        await collection.updateOne({_id: id},{$set: {...toy}})
        return toy
    } catch (error) {
        throw error
    }
}