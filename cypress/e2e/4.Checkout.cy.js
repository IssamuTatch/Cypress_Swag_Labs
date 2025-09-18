import products from '../fixtures/products.json'

//Function to Check the Products in the Checkout
function VerifyCheckout(products) {
  cy.get('[data-test="inventory-item"]').each(($item, index) =>{
    cy.wrap($item).within(() => {
      cy.get('[data-test="inventory-item-name"]').should('contain', products[index].name)
      cy.get('[data-test="inventory-item-desc"]').should('contain', products[index].desc)
      cy.get('[data-test="inventory-item-price"]').should('contain', '$'+products[index].price)
    })
  })
}

describe('4.1 - Functional', () => {
  beforeEach(() => {
    cy.setCookie('session-username', 'standard_user', {
      path: '/',
      secure: false,
      httpOnly: false,
      domain: 'www.saucedemo.com',
      expiry: -1,
    })
    cy.window().then((win) => {
        win.localStorage.setItem('cart-contents', '[4,0,1]')
    }),
    cy.visit('https://www.saucedemo.com/checkout-step-one.html', { failOnStatusCode: false})

    cy.get('[data-test="title"]').should('contain', 'Checkout: Your Information')
  })

  it('4.1.1 - Complete Checkout', ()=>{
    cy.get('[data-test="firstName"]').type('Jorge')
    cy.get('[data-test="lastName"]').type('Silva')
    cy.get('[data-test="postalCode"]').type('00000-000')
    cy.get('[data-test="continue"]').click()

    cy.url().should('include', 'checkout-step-two.html')
    cy.get('[data-test="title"]').should('contain', 'Checkout: Overview')

    VerifyCheckout(products)

    cy.get('[data-test="payment-info-label"]').should('contain', 'Payment Information:')
    cy.get('[data-test="payment-info-value"]').should('contain', 'SauceCard #31337')

    cy.get('[data-test="shipping-info-label"]').should('contain', 'Shipping Information:')
    cy.get('[data-test="shipping-info-value"]').should('contain', 'Free Pony Express Delivery!')

    cy.get('[data-test="total-info-label"]').should('contain', 'Price Total')
    cy.get('[data-test="subtotal-label"]').should('contain', 'Item total: $' + (products[0].price + products[1].price + products[2].price))
    cy.get('[data-test="tax-label"]').should('contain', 'Tax: $4.48')
    cy.get('[data-test="total-label"]').should('contain', 'Total: $'+ ((products[0].price + products[1].price + products[2].price) + 4.48))

    cy.get('[data-test="finish"]').click()

    cy.url().should('include', 'checkout-complete.html')
    cy.get('[data-test="title"]').should('contain', 'Checkout: Complete!')
    cy.get('[data-test="pony-express"]').should('be.visible')
    cy.get('[data-test="complete-header"]').should('contain', 'Thank you for your order!')
    cy.get('[data-test="complete-text"]').should('contain', 'Your order has been dispatched, and will arrive just as fast as the pony can get there!')

    cy.get('[data-test="back-to-products"]').click()

    cy.url().should('include', 'inventory.html')
    cy.get('[data-test="title"]').should('contain', 'Products')

    cy.getAllLocalStorage().then((result) => {
      expect(result['https://www.saucedemo.com']).to.not.have.property('cart-contents')
    })
  })

  it('4.1.2 - Cancel Step One', ()=>{
    cy.get('[data-test="cancel"]').click()

    cy.url().should('include', 'cart.html')
    cy.get('[data-test="title"]').should('contain', 'Your Cart')

    VerifyCheckout(products)
  })

  it('4.1.3 - Cancel Step Two', ()=>{
    cy.get('[data-test="firstName"]').type('Jorge')
    cy.get('[data-test="lastName"]').type('Silva')
    cy.get('[data-test="postalCode"]').type('00000-000')
    cy.get('[data-test="continue"]').click()

    cy.url().should('include', 'checkout-step-two.html')
    cy.get('[data-test="title"]').should('contain', 'Checkout: Overview')

    cy.get('[data-test="cancel"]').click()

    cy.url().should('include', 'inventory.html')
    cy.get('[data-test="title"]').should('contain', 'Products')

    cy.getAllLocalStorage().then((result) => {
        expect(result['https://www.saucedemo.com']['cart-contents']).to.equal('[4,0,1]')
    })
  })
})


describe('4.2 - Error Messages for Checkout', () => {
  beforeEach(() => {
    cy.setCookie('session-username', 'standard_user', {
      path: '/',
      secure: false,
      httpOnly: false,
      domain: 'www.saucedemo.com',
      expiry: -1,
    })
    cy.window().then((win) => {
        win.localStorage.setItem('cart-contents', '[4,0,1]')
    }),
    cy.visit('https://www.saucedemo.com/checkout-step-one.html', { failOnStatusCode: false})

    cy.get('[data-test="title"]').should('contain', 'Checkout: Your Information')
  })

  it('4.2.1 - Empty form', ()=>{
    cy.get('[data-test="continue"]').click()

    cy.get('[data-test="error"]').should('contain', 'Error: First Name is required')
  })

  it('4.2.2 - Without First Name', ()=>{
    cy.get('[data-test="lastName"]').type('Silva')
    cy.get('[data-test="postalCode"]').type('00000-000')
    cy.get('[data-test="continue"]').click()

    cy.get('[data-test="error"]').should('contain', 'Error: First Name is required')
  })

  it('4.2.3 - Without Last Name', ()=>{
    cy.get('[data-test="firstName"]').type('Jorge')
    cy.get('[data-test="postalCode"]').type('00000-000')
    cy.get('[data-test="continue"]').click()

    cy.get('[data-test="error"]').should('contain', 'Error: Last Name is required')
  })
  
  it('4.2.4 - Without Postal Code', ()=>{
    cy.get('[data-test="firstName"]').type('Jorge')
    cy.get('[data-test="lastName"]').type('Silva')
    cy.get('[data-test="continue"]').click()

    cy.get('[data-test="error"]').should('contain', 'Error: Postal Code is required')
  })
})