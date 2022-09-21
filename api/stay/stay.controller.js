const stayService = require('./server.stay.service')

module.exports = {
    getStays,
    getStayById,
    addStay,
    updateStay,
    removeStay
}

async function getStays(req, res) {
    try {
        const stays = await stayService.query()
        res.json(stays)
    } catch (error) {
        res.status(500).send({ error: 'Failed to get all stays' })
    }
}

async function getStayById(req, res) {
    try {
        const { id } = req.params
        const stay = await stayService.getById(id)
        res.json(stay)
    } catch (error) {
        res.status(500).send({ error: 'Failed to get stay' })
    }
}

async function addStay(req, res) {
    try {
        const stay = req.body
        const newStay = await stayService.add(stay)
        res.json(newStay)
    } catch (error) {
        res.status(500).send({ error: 'Failed to add new stay' })
    }
}

async function updateStay(req, res) {
    try {
        const stay = req.body
        const updatedStay = await stayService.update(stay)
        res.json(updatedStay)
    } catch (error) {
        res.status(500).send({ error: 'Failed to update stay' })
    }
}

async function removeStay(req, res) {
    try {
        const { id } = req.params
        const removedStay = await stayService.remove(id)
        res.send(removedStay)
    } catch (error) {
        res.status(500).send({ error: 'Failed to remove stay' })
    }
}