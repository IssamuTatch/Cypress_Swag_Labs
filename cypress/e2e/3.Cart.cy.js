import products from '../fixtures/products.json'

let sortedProducts

//Function to Check the Products in Cart
function VerifyCart(products) {
  cy.get('[data-test="inventory-item"]').each(($item, index) =>{
    cy.wrap($item).within(() => {
      cy.get('[data-test="inventory-item-name"]').should('contain', products[index].name)
      cy.get('[data-test="inventory-item-desc"]').should('contain', products[index].desc)
      cy.get('[data-test="inventory-item-price"]').should('contain', '$'+products[index].price)
    })
  })
}

describe('3.1 - Functional', () => {
  beforeEach(() => {
    cy.setCookie('session-username', 'standard_user', {
      path: '/',
      secure: false,
      httpOnly: false,
      domain: 'www.saucedemo.com',
      expiry: -1,
    })
  })

  it('3.1.1 - Add to cart from product Details', () => {
    cy.visit('https://www.saucedemo.com/inventory.html', { failOnStatusCode: false})
    sortedProducts = products.toSorted((a, b)=>
      a.name.localeCompare(b.name))

      cy.get('[data-test="inventory-item-name"]').eq(0).should('contain', products[0].name)

      cy.get('[data-test="inventory-item-name"]').first().click()
      cy.url().should('include', '/inventory-item.html?id=4')

      cy.get('[data-test="inventory-item-name"]').should('contain', products[0].name)
      cy.get('[data-test="inventory-item-price"]').should('contain', '$'+products[0].price)

      cy.get('[data-test="add-to-cart"]').click()
      cy.getAllLocalStorage().then((result) => {
        expect(result['https://www.saucedemo.com']['cart-contents']).to.equal('[4]')
      })
      cy.get('[data-test="add-to-cart"]').should('not.exist')
      cy.get('[data-test="remove"]').should('exist')
      cy.get('[data-test="shopping-cart-badge"]').should('contain', '1')
      cy.get('[data-test="shopping-cart-badge"]').click()

      cy.url().should('include', '/cart.html')
      cy.get('[data-test="title"]').should('contain', 'Your Cart')

      cy.get('[data-test="inventory-item-name"]').should('contain', products[0].name)
      cy.get('[data-test="inventory-item-desc"]').should('contain', products[0].desc)
      cy.get('[data-test="inventory-item-price"]').should('contain', products[0].price)
      cy.get('[data-test="remove-sauce-labs-backpack"]').should('be.visible')
  })

    it('3.1.2 - Add multiples products from Catalog', () => {
      cy.visit('https://www.saucedemo.com/inventory.html', { failOnStatusCode: false})
      sortedProducts = products.toSorted((a, b)=>
      a.name.localeCompare(b.name))

      cy.get('[data-test="inventory-item-name"]').eq(0).should('contain', products[0].name)
      cy.get('[data-test="inventory-item-description"]').eq(0).should('contain', products[0].desc)
      cy.get('[data-test="inventory-item-price"]').eq(0).should('contain', '$'+products[0].price)
      cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click()
      cy.get('[data-test="add-to-cart-sauce-labs-backpack]').should('not.exist')
      cy.get('[data-test="shopping-cart-badge"]').should('contain', '1')
      cy.getAllLocalStorage().then((result) => {
        expect(result['https://www.saucedemo.com']['cart-contents']).to.equal('[4]')
      })

      cy.get('[data-test="inventory-item-name"]').eq(1).should('contain', products[1].name)
      cy.get('[data-test="inventory-item-description"]').eq(1).should('contain', products[1].desc)
      cy.get('[data-test="inventory-item-price"]').eq(1).should('contain', '$'+products[1].price)
      cy.get('[data-test="add-to-cart-sauce-labs-bike-light"]').click()
      cy.get('[data-test="add-to-cart-sauce-labs-bike-light]').should('not.exist')
      cy.get('[data-test="shopping-cart-badge"]').should('contain', '2')
      cy.getAllLocalStorage().then((result) => {
        expect(result['https://www.saucedemo.com']['cart-contents']).to.equal('[4,0]')
      })

      cy.get('[data-test="inventory-item-name"]').eq(2).should('contain', products[2].name)
      cy.get('[data-test="inventory-item-description"]').eq(2).should('contain', products[2].desc)
      cy.get('[data-test="inventory-item-price"]').eq(2).should('contain', '$'+products[2].price)
      cy.get('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click()
      cy.get('[data-test="add-to-cart-sauce-labs-bolt-t-shirt]').should('not.exist')
      cy.get('[data-test="shopping-cart-badge"]').should('contain', '3')
      cy.getAllLocalStorage().then((result) => {
        expect(result['https://www.saucedemo.com']['cart-contents']).to.equal('[4,0,1]')
      })

      cy.get('[data-test="remove-sauce-labs-backpack"]').should('exist')
      cy.get('[data-test="shopping-cart-badge"]').click()

      cy.url().should('include', '/cart.html')
      cy.get('[data-test="title"]').should('contain', 'Your Cart')

      VerifyCart(products)

      cy.get('[data-test="remove-sauce-labs-backpack"]').should('be.visible')
  })

  it('3.1.3 - Remove from Cart', () => {
    cy.window().then((win) => {
        win.localStorage.setItem('cart-contents', '[4,0,1]')
    }),
    cy.visit('https://www.saucedemo.com/cart.html', { failOnStatusCode: false})
    cy.url().should('include', '/cart.html')
    cy.get('[data-test="title"]').should('contain', 'Your Cart')

    cy.get('[data-test="remove-sauce-labs-bike-light"]').click()
    cy.get('[data-test="remove-sauce-labs-bike-light"]').should('not.exist')
    cy.get('[data-test="inventory-item"]').eq(2).should('not.exist')
    cy.get('[data-test="shopping-cart-badge"]').should('contain', '2')

    cy.getAllLocalStorage().then((result) => {
      expect(result['https://www.saucedemo.com']['cart-contents']).to.equal('[4,1]')
    })
  })

  it('3.1.4 - Continue Shopping button', () => {
    cy.window().then((win) => {
        win.localStorage.setItem('cart-contents', '[4,0,1]')
    }),
    cy.visit('https://www.saucedemo.com/cart.html', { failOnStatusCode: false})
    cy.url().should('include', '/cart.html')
    cy.get('[data-test="title"]').should('contain', 'Your Cart')
    cy.get('[data-test="continue-shopping"]').click()

    cy.url().should('include', 'inventory.html')
    cy.get('[data-test="title"]').should('contain', 'Products')
  })

  it('3.1.5 - Go to Checkout', () => {
    cy.window().then((win) => {
        win.localStorage.setItem('cart-contents', '[4,0,1]')
    }),
    cy.visit('https://www.saucedemo.com/cart.html', { failOnStatusCode: false})
    cy.url().should('include', '/cart.html')
    cy.get('[data-test="title"]').should('contain', 'Your Cart')
    cy.get('[data-test="checkout"]').click()

    cy.url().should('include', 'checkout-step-one.html')
    cy.get('[data-test="title"]').should('contain', 'Checkout: Your Information')
  })
})