const { pool } = require('../config/database')

const getItems = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Items')

        if (rows.length === 0) return res.json({ message: 'No items listed yet!'})

        res.json(rows)
        
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Internal server error' })
    }
}

const getItemById = async (req, res) => {
    try {
        const id = req.params.id
        const [rows] = await pool.query('SELECT * FROM Items WHERE id=?',
            [id]
        )

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Item not found' }) 
        }

        res.json(rows[0])

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Internal server error' })
    }
}

const addItem = async (req, res) => {
    try {
        const { name, quantity, price } = req.body

        if (!name || !name.trim()) {
            return res.status(400).json({ error: 'Name required'})
        }

        if (!quantity) {
            return res.status(400).json({ error: 'Quantity required'})
        }

        if (!price) {
            return res.status(400).json({ error: 'Price required'})
        }

        const [result] = await pool.query(
            'INSERT INTO Items (name, quantity, price) values (?, ?, ?)',
            [name, quantity, price]
        ) 

        const [rows] = await pool.query(
            'SELECT * FROM Items WHERE id=?',
            [result.insertId]
        )

        const newItem = rows[0]

        res.status(200).json({
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
        const { name, quantity, price } = req.body

        const [result] = await pool.query(
            `UPDATE Items SET 
                name=COALESCE(?, name), 
                quantity = COALESCE(?, quantity), 
                price = COALESCE(?, price) 
                WHERE id=?`,
            [name, quantity, price, id]
        )

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Item not found" })
        }

        const [rows] = await pool.query(
            'SELECT * FROM Items WHERE id=?',
            [id]
        )

        const updatedItem = rows[0]

        return res.status(200).json({
            message: "Item updated successfully",
            data: updatedItem
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Internal server error" })
    }
}

const deleteItem = async (req, res) => {
    try {
        const id = req.params.id

        const [rows] = await pool.query(
            'SELECT * FROM Items WHERE id=?',
            [id]
        )

        const [result] = await pool.query(
            'DELETE FROM Items WHERE id=?',
            [id]
        )

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Item not found"})
        }

        const deletedItem = rows[0]

        return res.status(200).json({
            message: "Item deleted successfully",
            data: deletedItem
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Internal server error" })
    }
}

module.exports = {
    getItems,
    getItemById,
    addItem,
    updateItem,
    deleteItem,
}