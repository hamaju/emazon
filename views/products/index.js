const layout = require('../layout')

module.exports = ({ products }) => {
  const renderedProducts = products
    .map((product) => {
      return `
        <div class="column is-one-quarter">
          <div class="card product-card">
            <figure>
              <img src="data:image/png;base64, ${product.image}"/>
            </figure>
            <div class="card-content">
              <h3 class="subtitle has-text-weight-semibold">${product.title}</h3>
              <h5>$${product.price}</h5>
            </div>
            <footer class="card-footer">
              <form action="/cart/products" method="POST">
                <input hidden value="${product.id}" name="productId" />
                <button class="button has-icon is-inverted">
                  <i class="fa fa-shopping-cart"></i> Add to cart
                </button>
              </form>
            </footer>
          </div>
        </div>
      `
    })
    .join('\n')

{/* <h3 class="title is-4 text-center">Featured Items</h3> */}

  return layout({
    content: `
      <section>
        <div class="container">
          <div class="columns">
            <div class="column"></div>
            <div class="column is-four-fifths">
              <div>
                
                <div class="columns products">
                  ${renderedProducts}  
                </div>
              </div>
            </div>
            <div class="column"></div>
          </div>
        </div>
      </section>
    `,
  })
}
