const toyService = require('./server.toy.service')

module.exports = {
    getToys,
    getToyById,
    addToy,
    updateToy,
    removeToy
}

async function getToys(req, res) {
    try {
        const toys = await toyService.query()
        res.json(toys)
    } catch (error) {
        res.status(500).send({ error: 'Failed to get all toys' })
    }
}

async function getToyById(req, res) {
    try {
        const { id } = req.params
        const car = await toyService.getById(id)
        res.json(car)
    } catch (error) {
        res.status(500).send({ error: 'Failed to get toy' })
    }
}

async function addToy(req, res) {
    try {
        const toy = req.body
        const newToy = await toyService.add(toy)
        res.json(newToy)
    } catch (error) {
        res.status(500).send({ error: 'Failed to add new toy' })
    }
}

async function updateToy(req, res) {
    try {
        const toy = req.body
        const updatedToy = await toyService.update(toy)
        res.json(updatedToy)
    } catch (error) {
        res.status(500).send({ error: 'Failed to update toy' })
    }
}

async function removeToy(req, res) {
    try {
        const { id } = req.params
        const removedToy = await toyService.remove(id)
        res.send(removedToy)
    } catch (error) {
        res.status(500).send({ error: 'Failed to remove toy' })
    }
}