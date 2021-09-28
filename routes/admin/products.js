const express = require('express')
const multer = require('multer')

const { handleErrors, requireAuth } = require('./middlewares')
const productsDatabase = require('../../db/products')
const productsNewTemplate = require('../../views/admin/products/new')
const productsIndexTemplate = require('../../views/admin/products/index')
const productsEditTemplate = require('../../views/admin/products/edit')
const { requireTitle, requirePrice } = require('./validators')

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })

router.get('/admin/products', requireAuth, async (req, res) => {
  const products = await productsDatabase.getAll()
  res.send(productsIndexTemplate({ products }))
})

router.get('/admin/products/new', requireAuth, (req, res) => {
  res.send(productsNewTemplate({}))
})

router.post(
  '/admin/products/new',
  requireAuth,
  upload.single('image'),
  [requireTitle, requirePrice],
  handleErrors(productsNewTemplate),
  async (req, res) => {
    // turn the file into a string (lol) so we can save it in our json db (lol)
    const image = req.file.buffer.toString('base64')
    const { title, price } = req.body
    await productsDatabase.create({ title, price, image })

    // redirect after successfully creating a new product
    res.redirect('/admin/products')
  }
)

router.get('/admin/products/:id/edit', requireAuth, async (req, res) => {
  const product = await productsDatabase.getOne(req.params.id)

  if (!product) {
    return res.send('Product not found')
  }

  res.send(productsEditTemplate({ product }))
})

router.post(
  '/admin/products/:id/edit',
  requireAuth,
  upload.single('image'),
  [requireTitle, requirePrice],
  handleErrors(productsEditTemplate, async (req) => {
    const product = await productsDatabase.getOne(req.params.id)
    return { product }
  }),
  async (req, res) => {
    const changes = req.body

    if (req.file) {
      changes.image = req.file.buffer.toString('base64')
    }
    try {
      await productsDatabase.update(req.params.id, changes)
    } catch (err) {
      return res.send('Could not find item')
    }

    res.redirect('/admin/products')
  }
)

router.post('/admin/products/:id/delete', requireAuth, async (req, res) => {
  await productsDatabase.delete(req.params.id)

  res.redirect('/admin/products')
})

module.exports = router
