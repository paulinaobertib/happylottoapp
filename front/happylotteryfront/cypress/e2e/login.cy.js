describe('Mi primera prueba', () => {
    it('Login exitoso', () => {
      cy.visit('http://localhost:5173/')
      cy.get('h1').should('contain', '¡Bienvenido a HappyLotto!')
      cy.get('[href="/login"]').click();
      cy.get('[type="text"]').type('paulinaobertibusso2@gmail.com');
      cy.get('.password-field > input').type('Paulina2003!');
      cy.get('[type="submit"]').click();
      cy.get('.swal2-popup', { timeout: 20000 }).should('contain', 'Inicio de sesión exitoso')
        .and('contain', '¡Bienvenido de nuevo!');
        cy.get('.swal2-confirm').click();
    })

    it('Credenciales equivocadas', () => {
        cy.visit('http://localhost:5173/')
        cy.get('h1').should('contain', '¡Bienvenido a HappyLotto!')
        cy.get('[href="/login"]').click();
        cy.get('[type="text"]').type('paulinaobertibusso2@gmail.com');
        cy.get('.password-field > input').type('Paulina2003');
        cy.get('[type="submit"]').click();
        cy.get('.swal2-popup', { timeout: 20000 }).should('contain', 'Error de solicitud')
          .and('contain', 'Las credenciales son incorrectas.');
          cy.get('.swal2-confirm').click();
    })

    it('No hay datos', () => {
        cy.visit('http://localhost:5173/')
        cy.get('h1').should('contain', '¡Bienvenido a HappyLotto!')
        cy.get('[href="/login"]').click();
        cy.get('[type="text"]').clear();
        cy.get('.password-field > input').clear();
        cy.get('[type="submit"]').click();
        cy.get('.swal2-popup', { timeout: 20000 }).should('contain', 'Error de Validación')
          .and('contain', 'Debes llenar ambos campos para poder ingresar');
          cy.get('.swal2-confirm').click();
    })

    it('No hay email', () => {
        cy.visit('http://localhost:5173/')
        cy.get('h1').should('contain', '¡Bienvenido a HappyLotto!')
        cy.get('[href="/login"]').click();
        cy.get('[type="text"]').clear();
        cy.get('.password-field > input').type('Paulina2003');
        cy.get('[type="submit"]').click();
        cy.get('.swal2-popup', { timeout: 20000 }).should('contain', 'Error de Validación')
          .and('contain', 'El campo de email es obligatorio');
        cy.get('.swal2-confirm').click();
    })
})