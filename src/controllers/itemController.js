const { pool } = require('../config/database')
const Item = require('../models/Item')
const { z } = require('zod')

const ItemSchema = z.object({
    name: z.string().trim().min(1),
    quantity: z.number().int().nonnegative(),
    cost_price: z.number().nonnegative(),
    selling_price: z.number().nonnegative(),
})

const getItems = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Items')

        if (rows.length === 0) return res.json({ message: 'No items listed yet!' })

        res.json(rows)
        
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Internal server error' })
    }
}

const getItem = async (req, res) => {
    try {
        const id = req.params.id
        const item = await Item.findById(id)

        if (!item) {
            return res.status(404).json({ error: 'Item not found' }) 
        }
        console.log(item)
        res.json({ success: true, data: { item } })

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Internal server error' })
    }
}

const addItem = async (req, res) => {
    try {
        const parsed = ItemSchema.safeParse(req.body)

        if (!parsed.success) {
            return res.status(400).json({ errors: parsed.error })
        }

        const item = await Item.create(parsed.data)
        const newItem = await Item.findById(item)

        res.status(201).json({
            message: "Item added successfully",
            data: newItem
        })

    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Item already exists' })
        }

        console.error(err)
        res.status(500).json({ error: 'Internal server error' })
    }
}

const updateItem = async (req, res) => {
    try {
        const id = req.params.id
        const parsed = ItemSchema.partial().safeParse(req.body)

        if (!parsed.success) {
            return res.status(400).json({ errors: parsed.error })
        }

        const updatedItem = await Item.update(id, parsed.data)

        if (!updatedItem) {
            return res.status(409).json({ error: 'Item does not exist' })
        }

        return res.status(200).json({
            message: "Item updated successfully",
            updated_data: updatedItem
        })

    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Item already exists' })
        }

        console.error(err)
        res.status(500).json({ error: "Internal server error" })
    }
}

const deleteItem = async (req, res) => {
    try {
        const id = req.params.id
        const deletedItem = await Item.delete(id)

        if (!deletedItem) return res.status(409).json({ error: 'Item does not exist' })

        return res.status(200).json({
            message: "Item deleted successfully",
            deleted_data: deletedItem
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Internal server error" })
    }
}

module.exports = {
    getItems,
    getItem,
    addItem,
    updateItem,
    deleteItem,
}