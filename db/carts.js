const Database = require('./db')

class CartsDatabase extends Database {}

module.exports = new CartsDatabase('carts.json')
