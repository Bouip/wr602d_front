describe('Vroum Vroum - Tests E2E', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173')
    cy.clearLocalStorage()
    cy.reload()
  })

  it('affiche l\'écran de connexion au démarrage', () => {
    cy.get('#auth').should('exist')
    cy.contains('VROUM').should('exist')
  })

  it('peut jouer en invité', () => {
    cy.get('#guestBtn').click()
    cy.get('#menu').should('exist')
  })

  it('affiche le menu principal après connexion en invité', () => {
    cy.get('#guestBtn').click()
    cy.get('.af-play-btn').should('exist')
  })

  it('peut sélectionner un niveau de difficulté', () => {
    cy.get('#guestBtn').click()
    cy.get('[data-level="2"]').click()
    cy.get('[data-level="2"]').should('have.class', 'active')
  })

  it('lance le jeu en cliquant sur JOUER', () => {
    cy.get('#guestBtn').click()
    cy.get('#startBtn').click()
    cy.get('#hud').should('exist')
    cy.get('#score').should('exist')
  })

  it('affiche le HUD pendant la partie', () => {
    cy.get('#guestBtn').click()
    cy.get('#startBtn').click()
    cy.get('#lives').should('exist')
    cy.get('#level').should('exist')
  })

  it('peut mettre le jeu en pause avec le bouton', () => {
    cy.get('#guestBtn').click()
    cy.get('#startBtn').click()
    cy.get('#pauseBtn').click({ force: true })
    cy.get('#pause-overlay').should('exist')
  })

  it('peut reprendre après la pause', () => {
    cy.get('#guestBtn').click()
    cy.get('#startBtn').click()
    cy.get('#pauseBtn').click({ force: true })
    cy.get('#resumeBtn').click()
    cy.get('#pause-overlay').should('not.exist')
  })

  it('affiche une erreur si login incorrect', () => {
    cy.get('#loginEmail').type('faux@email.com')
    cy.get('#loginPassword').type('mauvais')
    cy.get('#loginBtn').click()
    cy.get('#authError').should('not.be.empty')
  })

  it('peut accéder à l\'écran d\'inscription', () => {
    cy.get('#registerTab').click()
    cy.get('#registerForm').should('exist')
    cy.get('#regUsername').should('exist')
  })
})