const express = require('express')
const cartsDatabase = require('../db/carts')
const productsDatabase = require('../db/products')
const cartShowTemplate = require('../views/carts/show')

const router = express.Router()

// receive a post request to add an item to a cart
router.post('/cart/products/', async (req, res) => {
  let cart
  if (!req.session.cartId) {
    cart = await cartsDatabase.create({ items: [] })
    req.session.cartId = cart.id
  } else {
    cart = await cartsDatabase.getOne(req.session.cartId)
  }

  const existingItem = cart.items.find((item) => item.id === req.body.productId)
  if (existingItem) {
    existingItem.quantity++
  } else {
    cart.items.push({ id: req.body.productId, quantity: 1 })
  }

  await cartsDatabase.update(cart.id, { items: cart.items })

  res.redirect('/cart')
})

// receive a GET request to show all items in a cart
router.get('/cart', async (req, res) => {
  if (!req.session.cartId) {
    return res.redirect('/')
  }

  const cart = await cartsDatabase.getOne(req.session.cartId)

  for (let item of cart.items) {
    const product = await productsDatabase.getOne(item.id)

    item.product = product
  }

  res.send(cartShowTemplate({ items: cart.items }))
})

// receive a post request to delete an item from a cart
router.post('/cart/products/delete', async (req, res) => {
  const { itemId } = req.body
  const cart = await cartsDatabase.getOne(req.session.cartId)

  // find the matching itemId and delete it
  // filter all the items that don't match the item that's to be deleted
  const items = cart.items.filter((item) => item.id !== itemId)

  await cartsDatabase.update(req.session.cartId, { items })

  res.redirect('/cart')
})

module.exports = router
