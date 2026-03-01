const { pool } = require('../config/database')

class Item {
    static async create({ name, quantity, cost_price, selling_price }) {
        try {
            const [result] = await pool.query(
                `INSERT INTO Items (name, quantity, cost_price, selling_price)
                VALUES (?, ?, ?, ?)`,
                [name, quantity, cost_price, selling_price]
            )
            return result.insertId
        } catch (error) {
            throw error;
        }
    }

    static async findById(id) {
        const [rows] = await pool.query(
            'SELECT * FROM Items WHERE id=?',
            [id]
        )
        return rows[0]
    }

    static async update(id, { name, quantity, cost_price, selling_price } = {}) {
        const [result] = await pool.query(
            `UPDATE Items SET 
                name=COALESCE(?, name), 
                quantity = COALESCE(?, quantity), 
                cost_price = COALESCE(?, cost_price),
                selling_price = COALESCE(?, selling_price) 
                WHERE id=?`,
            [name, quantity, cost_price, selling_price, id]
        )
        
        if (result.affectedRows === 0) return null
        return this.findById(id)
    }

    static async delete(id) {
        const deletedItem = this.findById(id)

        const [result] = await pool.query(
            'DELETE FROM Items WHERE id=?',
            [id]
        )
        
        if (result.affectedRows === 0) return null
        return deletedItem
    }   
}

module.exports = Item