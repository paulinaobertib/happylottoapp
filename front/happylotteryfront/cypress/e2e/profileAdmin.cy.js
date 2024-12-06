describe('Prueba base', () => {
    it('Carga correctamente la página del administrador', () => {
      cy.visit('http://localhost:5173/')
      cy.get('h1').should('contain', '¡Bienvenido a HappyLotto!')
      cy.get('[href="/login"]').click();
      cy.get('[type="text"]').type('happylottoapp@gmail.com');
      cy.get('.password-field > input').type('Paulina2003!');
      cy.get('[type="submit"]').click();
      cy.get('.swal2-confirm').click();
      cy.get('.username').click();
      cy.get('.profile-container > :nth-child(2)').should('contain', 'Sorteos Disponibles')
      cy.get('.profile-container > :nth-child(4)').should('contain', 'Usuarios Registrados')
    })

    it('Elimina correctamente al usuario', () => {
      cy.visit('http://localhost:5173/')
      cy.get('h1').should('contain', '¡Bienvenido a HappyLotto!')
      cy.get('[href="/login"]').click();
      cy.get('[type="text"]').type('happylottoapp@gmail.com');
      cy.get('.password-field > input').type('Paulina2003!');
      cy.get('[type="submit"]').click();
      cy.get('.swal2-confirm').click();
      cy.get('.username').click();
      cy.get('.profile-container > :nth-child(2)').should('contain', 'Sorteos Disponibles')
      cy.get('.profile-container > :nth-child(4)').should('contain', 'Usuarios Registrados')
      cy.get('tbody > :nth-child(2) > :nth-child(5) > :nth-child(1)').click();
      cy.get('.swal2-confirm').click();
      cy.get('.swal2-popup', { timeout: 20000 }).should('contain', 'Eliminado')
      .and('contain', 'El usuario ha sido eliminado.');
      cy.get('.swal2-confirm').click();
    })
 })