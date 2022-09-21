const userService = require('../user/user.service')
const stayService = require('../stay/server.stay.service')
const authService = require('../auth/auth.service')
const reviewService = require('./review.service')
// const socketService = require('../../services/socket.service')s

module.exports = {
    getReviews,
    deleteReview,
    addReview
}


async function getReviews(req, res) {
    try {
        const reviews = await reviewService.query(req.query)
        res.send(reviews)
    } catch (err) {
        res.status(500).send({ err: 'Failed to get reviews' })
    }
}

async function deleteReview(req, res) {
    try {
        const deletedCount = await reviewService.remove(req.params.id)
        if (deletedCount === 1) {
            res.send({ msg: 'Deleted successfully' })
        } else {
            res.status(400).send({ err: 'Cannot remove review' })
        }
    } catch (err) {
        res.status(500).send({ err: 'Failed to delete review' })
    }
}

async function addReview(req, res) {

    var loggedinUser = authService.validateToken(req.cookies.loginToken)

    try {
        let review = req.body
        review.userId = loggedinUser._id
        review = await reviewService.add(review)

        // prepare the updated review for sending out
        review.stay = await stayService.getById(review.stayId)

        loggedinUser = await userService.update(loggedinUser)
        review.user = loggedinUser

        // User info is saved also in the login-token, update it
        const loginToken = authService.getLoginToken(loggedinUser)
        res.cookie('loginToken', loginToken)

        delete review.userId
        delete review.stayId

        // socketService.broadcast({type: 'review-added', data: review, userId: loggedinUser._id})
        // socketService.emitToUser({type: 'review-about-you', data: review, userId: review.aboutUserId})
        // const fullUser = await userService.getById(loggedinUser._id)
        // socketService.emitTo({type: 'user-updated', data: fullUser, label: fullUser._id})

        res.send(review)

    } catch (err) {
        res.status(500).send({ err: 'Failed to add review' })
    }
}