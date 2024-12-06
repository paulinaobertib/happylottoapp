describe('Prueba base', () => {
   it('Carga correctamente la página de ejemplo', () => {
     cy.visit('http://localhost:5173/')
     cy.get('h1').should('contain', '¡Bienvenido a HappyLotto!')
   })
})