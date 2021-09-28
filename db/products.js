const Database = require('./db')

class ProductsDatabase extends Database {}

module.exports = new ProductsDatabase('products.json')
