const dbService = require('../db.service')
const ObjectId = require('mongodb').ObjectId
const asyncLocalStorage = require('../als.service')

async function query(filterBy = {}) {
    try {
        const criteria = _buildCriteria(filterBy)
        const collection = await dbService.getCollection('review')
        let reviews = await collection.find().toArray()
        // let reviews = await collection.aggregate([
        //     {
        //         $match: criteria
        //     },
        //     {
        //         $lookup:
        //         {
        //             localField: 'stayId',
        //             from: 'stay',
        //             foreignField: '_id',
        //             as: 'stay'
        //         }
        //     },
        //     {
        //         $unwind: '$stay'
        //     },
        //     {
        //         $lookup:
        //         {
        //             localField: 'userId',
        //             from: 'user',
        //             foreignField: '_id',
        //             as: 'user'
        //         }
        //     },
        //     {
        //         $unwind: '$user'
        //     }
        // ]).toArray()
        reviews = reviews.map(review => {
            review.user = { _id: review.user._id, fullName: review.user.fullName }
            review.stay = { _id: review.stay._id, name: review.stay.name, price: review.stay.price }
            review.createdAt = ObjectId(review._id).getTimestamp()
            delete review.userId
            delete review.stayId
            return review
        })
        return reviews
    } catch (err) {
        throw err
    }
}

async function remove(reviewId) {
    try {
        const store = asyncLocalStorage.getStore()
        const { loggedinUser } = store
        const collection = await dbService.getCollection('review')
        // remove only if user is owner/admin
        const criteria = { _id: ObjectId(reviewId) }
        if (!loggedinUser.isAdmin) criteria.userId = ObjectId(loggedinUser._id)
        const { deletedCount } = await collection.deleteOne(criteria)
        return deletedCount
    } catch (err) {
        throw err
    }
}


async function add(review) {
    try {
        const reviewToAdd = {
            userId: ObjectId(review.userId),
            stayId: ObjectId(review.stayId),
            content: review.content
        }
        const collection = await dbService.getCollection('review')
        await collection.insertOne(reviewToAdd)
        return reviewToAdd
    } catch (err) {
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.stayId) criteria.stayId = ObjectId(filterBy.stayId)
    return criteria
}

module.exports = {
    query,
    remove,
    add
}


