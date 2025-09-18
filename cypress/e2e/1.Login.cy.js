/*
For the Variable login:
index - login 
0 - standard_User
1 - invalid_User
2 - locked_out_user
3 - problem_user
4 - performance_glitch_user
*/

const login = ["standard_user", "invalid_User", "locked_out_user", "problem_user", "performance_glitch_user"]

// Same password for all Users in this test
const password = "secret_sauce"

describe('1.1 - Sucessfull Login', () => {
  beforeEach(() => {
    cy.visit('https://www.saucedemo.com')
  })

  it('1.1.1 - Using Login Button', () => {
    cy.get('[data-test="username"]').type(login[0])
    cy.get('[data-test="password"]').type("secret_sauce")

    cy.get('[id="login-button"]').click()

    cy.url().should('include', 'inventory.html')

    cy.get('[data-test="title"]').should('contain', 'Products')
  })

  it('1.1.2 - Using enter Key to Login', () => {
    cy.get('[data-test="username"]').type(login[0])
    cy.get('[data-test="password"]').type("secret_sauce").type("{enter}")

    cy.url().should('include', '/inventory.html')

    cy.get('[data-test="title"]').should('contain', 'Products')
  })
})

describe('1.2 - Error Messages for login', () => {
  beforeEach(() => {
    cy.visit('https://www.saucedemo.com')
  })

  it('1.2.1 - Try to Login without username', () => {

    cy.get('[data-test="password"]').type(password)

    cy.get('[id="login-button"]').click()

    cy.get('[data-test="error"]').should('contain', 'Epic sadface: Username is required')
  })

  it('1.2.2 - Try to Login without password', () => {

    cy.get('[data-test="username"]').type(login[0])

    cy.get('[id="login-button"]').click()

    cy.get('[data-test="error"]').should('contain', 'Epic sadface: Password is required')
  })

  it('1.2.3 - Login as Invalid User', () => {
      cy.get('[data-test="username"]').type(login[1])
      cy.get('[data-test="password"]').type(password)

      cy.get('[id="login-button"]').click()

      cy.get('[data-test="error"]').should('contain', 'Epic sadface: Username and password do not match any user in this service')
    })

  it('1.2.4 - Login as Locked User', () =>{
    cy.get('[data-test="username"]').type(login[2])
    cy.get('[data-test="password"]').type(password)

    cy.get('[id="login-button"]').click()

    cy.get('[data-test="error"]').should('contain', 'Epic sadface: Sorry, this user has been locked out.')
  })
})

