describe('Prueba base', () => {
    it('Carga correctamente la página del usuario', () => {
      cy.visit('http://localhost:5173/')
      cy.get('h1').should('contain', '¡Bienvenido a HappyLotto!')
      cy.get('[href="/login"]').click();
      cy.get('[type="text"]').type('paulinaobertibusso2@gmail.com');
      cy.get('.password-field > input').type('Paulina2003!');
      cy.get('[type="submit"]').click();
      cy.get('.swal2-confirm').click();
      cy.get('.username').click();
      cy.get('.profile-title').should('contain', '¡Bienvenido, Paulina!')
    })

    it('Muestra los sorteos del usuario', () => {
        cy.visit('http://localhost:5173/')
        cy.get('h1').should('contain', '¡Bienvenido a HappyLotto!')
        cy.get('[href="/login"]').click();
        cy.get('[type="text"]').type('paulinaobertibusso2@gmail.com');
        cy.get('.password-field > input').type('Paulina2003!');
        cy.get('[type="submit"]').click();
        cy.get('.swal2-confirm').click();
        cy.get('.username').click();
        cy.get('.profile-title').should('contain', '¡Bienvenido, Paulina!');
        cy.get('tbody > tr > :nth-child(1)').should('contain', 'Primer Sorteo');
    })

    it('Elimina el usuario', () => {
        cy.visit('http://localhost:5173/')
        cy.get('h1').should('contain', '¡Bienvenido a HappyLotto!');
        cy.get('[href="/login"]').click();
        cy.get('[type="text"]').type('paulinaobertibusso2@gmail.com');
        cy.get('.password-field > input').type('Paulina2003!');
        cy.get('[type="submit"]').click();
        cy.get('.swal2-confirm').click();
        cy.get('.username').click();
        cy.get('.profile-title').should('contain', '¡Bienvenido, Paulina!');
        cy.get('.profile-delete-button').click();
        cy.get('.swal2-confirm').click();
        cy.get('#swal2-html-container').click();
        cy.get('.swal2-popup', { timeout: 20000 }).should('contain', 'Eliminado')
        .and('contain', 'El usuario ha sido eliminado.');
        cy.get('.swal2-confirm').click();
    })
 })