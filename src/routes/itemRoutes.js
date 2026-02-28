const express = require('express')
const router = express.Router()
const { getItems, getItem, addItem, updateItem, deleteItem } = require('../controllers/itemController')

router.get('/', getItems)
router.get('/:id', getItem)
router.post('/', addItem)
router.patch("/:id", updateItem)
router.delete('/:id', deleteItem)

module.exports = router