const express = require('express')
const productsDatabase = require('../db/products')
const productsIndexTemplate = require('../views/products/index')

const router = express.Router()

router.get('/', async (req, res) => {
  const products = await productsDatabase.getAll()
  res.send(productsIndexTemplate({ products }))
})

module.exports = router
