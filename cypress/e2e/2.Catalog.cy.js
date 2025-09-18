import products from '../fixtures/products.json'

let sortedProducts

const login = ["standard_user", "invalid_User", "locked_out_user", "problem_user", "performance_glitch_user"]

// Function to check the order of the Products
function VerifyCatalog(products) {
  cy.get('[data-test="inventory-item"]').each(($item, index) => {
    cy.wrap($item).within(() => {

      cy.get('[data-test="inventory-item-name"]').should('contain', products[index].name)

      cy.get('.inventory_item_img img').should('have.attr', 'src', products[index].img)
      cy.get('.inventory_item_img img').should('be.visible')

      cy.get('[data-test="inventory-item-description"]').should('contain', products[index].desc)

      cy.get('[data-test="inventory-item-price"]').should('contain', '$'+products[index].price)

      cy.get('button.btn_inventory')
        .should('contain.text', 'Add to cart')
    })
  })
}



describe('2.1 - Filter', () => {
  beforeEach(() => {
    cy.setCookie('session-username', 'standard_user', {
      path: '/',
      secure: false,
      httpOnly: false,
      domain: 'www.saucedemo.com',
      expiry: -1,
    })
    cy.visit('https://www.saucedemo.com/inventory.html', { failOnStatusCode: false})
  })

  it('2.1.1 - Default filter A - Z', () => {
    sortedProducts = products.toSorted((a, b)=>
      a.name.localeCompare(b.name))
    VerifyCatalog(sortedProducts)
  })

  it('2.1.2 - Filter by Z to A', () => {
    sortedProducts = products.toSorted((a, b)=>
      b.name.localeCompare(a.name))
    cy.get('.product_sort_container').select('Name (Z to A)')
    VerifyCatalog(sortedProducts)
  })

  it('2.1.2 - Filter by Price (Low to High)', () => {
    sortedProducts = products.toSorted((a, b)=>
      a.price - b.price)
    cy.get('.product_sort_container').select('Price (low to high)')
    VerifyCatalog(sortedProducts)
  })

  it('2.1.2 - Filter by Price (High to Low)', () => {
    sortedProducts = products.toSorted((a, b)=>
      b.price - a.price)
    cy.get('.product_sort_container').select('Price (high to low)')
    VerifyCatalog(sortedProducts)
  })
})

describe('2.2 - Product Details', () => {
  beforeEach(() => {
    cy.setCookie('session-username', 'standard_user', {
      path: '/',
      secure: false,
      httpOnly: false,
      domain: 'www.saucedemo.com',
      expiry: -1,
    })
    cy.visit('https://www.saucedemo.com/inventory.html', { failOnStatusCode: false})
  })

  it('2.2.1 - Check Details', () => {
    sortedProducts = products.toSorted((a, b)=>
      a.name.localeCompare(b.name))

      cy.get('[data-test="inventory-item-name"]').eq(0).should('contain', products[0].name)

      cy.get('[data-test="inventory-item-name"]').first().click()
      cy.url().should('include', '/inventory-item.html?id=4')

      cy.get('[data-test="inventory-item-name"]').should('contain', products[0].name)
      cy.get('[data-test="item-sauce-labs-backpack-img"]').should('have.attr', 'src', products[0].img)
      cy.get('[data-test="item-sauce-labs-backpack-img"]').should('be.visible')
      cy.get('[data-test="inventory-item-desc"]').should('contain', products[0].desc)
      cy.get('[data-test="inventory-item-price"]').should('contain', '$'+products[0].price)
  })

  it('2.2.2 - Click the back Button to return to Catalog', () => {
    sortedProducts = products.toSorted((a, b)=>
      a.name.localeCompare(b.name))

      cy.get('[data-test="inventory-item-name"]').eq(0).should('contain', products[0].name)

      cy.get('[data-test="inventory-item-name"]').first().click()
      cy.url().should('include', '/inventory-item.html?id=4')
      cy.get('.inventory_details_back_button').click()

      cy.url().should('include', '/inventory.html')
      cy.get('[data-test="title"]').should('contain', 'Products')
  })
})