const dbService = require('../db.service')
const ObjectId = require('mongodb').ObjectId
const asyncLocalStorage = require('../als.service')

async function query(filterBy = {}) {
    try {
        const criteria = _buildCriteria(filterBy)
        const collection = await dbService.getCollection('review')
        // let reviews = await collection.find().toArray()
        let reviews = await collection.aggregate([
            {
                $match: criteria
            },
            {
                $lookup:
                {
                    localField: 'toyId',
                    from: 'toy',
                    foreignField: '_id',
                    as: 'toy'
                }
            },
            {
                $unwind: '$toy'
            },
            {
                $lookup:
                {
                    localField: 'userId',
                    from: 'user',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            }
        ]).toArray()
        reviews = reviews.map(review => {
            review.user = { _id: review.user._id, fullName: review.user.fullName }
            review.toy = { _id: review.toy._id, name: review.toy.name, price: review.toy.price }
            review.createdAt = ObjectId(review._id).getTimestamp()
            delete review.userId
            delete review.toyId
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
            toyId: ObjectId(review.toyId),
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
    if (filterBy.toyId) criteria.toyId = ObjectId(filterBy.toyId)
    return criteria
}

module.exports = {
    query,
    remove,
    add
}


