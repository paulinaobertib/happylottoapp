describe('Lottery', () => {
    it('Se realiza correctamente el sorteo', () => {
      cy.visit('http://localhost:5173/')
      cy.get('h1').should('contain', '¡Bienvenido a HappyLotto!')
      cy.get('#name').type('Sorteo de Prueba');
      cy.get('#endDate').click();
      cy.get('#endDate').clear().type('2024-12-26'); 
      cy.get('#endDate').should('have.value', '2024-12-26');
      cy.get('[placeholder="Nombre"]').type('Paulina');
      cy.get('[placeholder="Correo electrónico"]').type('paulinaobertibusso@gmail.com');
      cy.get('.add-button').click();
      cy.get(':nth-child(3) > [placeholder="Nombre"]').type('Pau');
      cy.get(':nth-child(3) > [placeholder="Correo electrónico"]').click();
      cy.get(':nth-child(3) > [placeholder="Correo electrónico"]').type('paulinaobertibusso2@gmail.com');
      cy.get('.add-button').click();
      cy.get(':nth-child(4) > [placeholder="Nombre"]').type('Pauli');;
      cy.get(':nth-child(4) > [placeholder="Correo electrónico"]').type('pauobertibusso@gmail.com');
      cy.get('.submit-button').click();
      cy.get('.swal2-confirm', { timeout: 20000 }).should('be.visible');
      cy.get('.swal2-title', { timeout: 10000 }).should('contain', 'Sorteo Creado');
      cy.get('.swal2-confirm').click();
    })

    it('No hay nombre del sorteo', () => {
      cy.visit('http://localhost:5173/')
      cy.get('h1').should('contain', '¡Bienvenido a HappyLotto!')
      cy.get('#name').clear();
      cy.get('#endDate').click();
      cy.get('#endDate').clear().type('2024-12-26'); 
      cy.get('#endDate').should('have.value', '2024-12-26');
      cy.get('[placeholder="Nombre"]').type('Paulina');
      cy.get('[placeholder="Correo electrónico"]').type('paulinaobertibusso@gmail.com');
      cy.get('.add-button').click();
      cy.get(':nth-child(3) > [placeholder="Nombre"]').type('Pau');
      cy.get(':nth-child(3) > [placeholder="Correo electrónico"]').click();
      cy.get(':nth-child(3) > [placeholder="Correo electrónico"]').type('paulinaobertibusso2@gmail.com');
      cy.get('.add-button').click();
      cy.get(':nth-child(4) > [placeholder="Nombre"]').type('Pauli');;
      cy.get(':nth-child(4) > [placeholder="Correo electrónico"]').type('pauobertibusso@gmail.com');
      cy.get('.submit-button').click();
      cy.get('.swal2-popup', { timeout: 20000 }).should('contain', 'Errores de Validación')
      .and('contain', 'El nombre del sorteo es obligatorio')
      .and('contain', 'El nombre debe tener al menos 2 caracteres');
      cy.get('.swal2-confirm').click();
    })

    it('Nombre menor a 2 caracteres', () => {
      cy.visit('http://localhost:5173/')
      cy.get('h1').should('contain', '¡Bienvenido a HappyLotto!')
      cy.get('#name').type('S');
      cy.get('#endDate').click();
      cy.get('#endDate').clear().type('2024-12-26'); 
      cy.get('#endDate').should('have.value', '2024-12-26');
      cy.get('[placeholder="Nombre"]').type('Paulina');
      cy.get('[placeholder="Correo electrónico"]').type('paulinaobertibusso@gmail.com');
      cy.get('.add-button').click();
      cy.get(':nth-child(3) > [placeholder="Nombre"]').type('Pau');
      cy.get(':nth-child(3) > [placeholder="Correo electrónico"]').click();
      cy.get(':nth-child(3) > [placeholder="Correo electrónico"]').type('paulinaobertibusso2@gmail.com');
      cy.get('.add-button').click();
      cy.get(':nth-child(4) > [placeholder="Nombre"]').type('Pauli');;
      cy.get(':nth-child(4) > [placeholder="Correo electrónico"]').type('pauobertibusso@gmail.com');
      cy.get('.submit-button').click();
      cy.get('.swal2-popup', { timeout: 20000 }).should('contain', 'Errores de Validación')
      .and('contain', 'El nombre debe tener al menos 2 caracteres');
      cy.get('.swal2-confirm').click();
    })  

    it('Nombre generico', () => {
      cy.visit('http://localhost:5173/')
      cy.get('h1').should('contain', '¡Bienvenido a HappyLotto!')
      cy.get('#name').type('nombre');
      cy.get('#endDate').click();
      cy.get('#endDate').clear().type('2024-12-26'); 
      cy.get('#endDate').should('have.value', '2024-12-26');
      cy.get('[placeholder="Nombre"]').type('Paulina');
      cy.get('[placeholder="Correo electrónico"]').type('paulinaobertibusso@gmail.com');
      cy.get('.add-button').click();
      cy.get(':nth-child(3) > [placeholder="Nombre"]').type('Pau');
      cy.get(':nth-child(3) > [placeholder="Correo electrónico"]').click();
      cy.get(':nth-child(3) > [placeholder="Correo electrónico"]').type('paulinaobertibusso2@gmail.com');
      cy.get('.add-button').click();
      cy.get(':nth-child(4) > [placeholder="Nombre"]').type('Pauli');;
      cy.get(':nth-child(4) > [placeholder="Correo electrónico"]').type('pauobertibusso@gmail.com');
      cy.get('.submit-button').click();
      cy.get('.swal2-popup', { timeout: 20000 }).should('contain', 'Errores de Validación')
      .and('contain', 'El nombre no puede ser genérico');
      cy.get('.swal2-confirm').click();
    })  

    it('Nombre con caracteres repetidos', () => {
      cy.visit('http://localhost:5173/')
      cy.get('h1').should('contain', '¡Bienvenido a HappyLotto!')
      cy.get('#name').type('ssssssss');
      cy.get('#endDate').click();
      cy.get('#endDate').clear().type('2024-12-26'); 
      cy.get('#endDate').should('have.value', '2024-12-26');
      cy.get('[placeholder="Nombre"]').type('Paulina');
      cy.get('[placeholder="Correo electrónico"]').type('paulinaobertibusso@gmail.com');
      cy.get('.add-button').click();
      cy.get(':nth-child(3) > [placeholder="Nombre"]').type('Pau');
      cy.get(':nth-child(3) > [placeholder="Correo electrónico"]').click();
      cy.get(':nth-child(3) > [placeholder="Correo electrónico"]').type('paulinaobertibusso2@gmail.com');
      cy.get('.add-button').click();
      cy.get(':nth-child(4) > [placeholder="Nombre"]').type('Pauli');;
      cy.get(':nth-child(4) > [placeholder="Correo electrónico"]').type('pauobertibusso@gmail.com');
      cy.get('.submit-button').click();
      cy.get('.swal2-popup', { timeout: 20000 }).should('contain', 'Errores de Validación')
      .and('contain', 'El nombre no puede contener caracteres repetidos consecutivamente');
      cy.get('.swal2-confirm').click();
    }) 

    it('No hay fecha de fin', () => {
      cy.visit('http://localhost:5173/')
      cy.get('h1').should('contain', '¡Bienvenido a HappyLotto!')
      cy.get('#name').type('nombre');
      cy.get('#endDate').click();
      cy.get('#endDate').clear();
      cy.get('[placeholder="Nombre"]').type('Paulina');
      cy.get('[placeholder="Correo electrónico"]').type('paulinaobertibusso@gmail.com');
      cy.get('.add-button').click();
      cy.get(':nth-child(3) > [placeholder="Nombre"]').type('Pau');
      cy.get(':nth-child(3) > [placeholder="Correo electrónico"]').click();
      cy.get(':nth-child(3) > [placeholder="Correo electrónico"]').type('paulinaobertibusso2@gmail.com');
      cy.get('.add-button').click();
      cy.get(':nth-child(4) > [placeholder="Nombre"]').type('Pauli');;
      cy.get(':nth-child(4) > [placeholder="Correo electrónico"]').type('pauobertibusso@gmail.com');
      cy.get('.submit-button').click();
      cy.get('.swal2-popup', { timeout: 20000 }).should('contain', 'Errores de Validación')
      .and('contain', 'La fecha de finalización es obligatoria');
      cy.get('.swal2-confirm').click();
    }) 
    
    it('Fecha de finalizacion antes que la de incio', () => {
      cy.visit('http://localhost:5173/')
      cy.get('h1').should('contain', '¡Bienvenido a HappyLotto!')
      cy.get('#name').type('nombre');
      cy.get('#endDate').click();
      cy.get('#endDate').clear().type('2024-12-02'); 
      cy.get('#endDate').should('have.value', '2024-12-02');
      cy.get('[placeholder="Nombre"]').type('Paulina');
      cy.get('[placeholder="Correo electrónico"]').type('paulinaobertibusso@gmail.com');
      cy.get('.add-button').click();
      cy.get(':nth-child(3) > [placeholder="Nombre"]').type('Pau');
      cy.get(':nth-child(3) > [placeholder="Correo electrónico"]').click();
      cy.get(':nth-child(3) > [placeholder="Correo electrónico"]').type('paulinaobertibusso2@gmail.com');
      cy.get('.add-button').click();
      cy.get(':nth-child(4) > [placeholder="Nombre"]').type('Pauli');;
      cy.get(':nth-child(4) > [placeholder="Correo electrónico"]').type('pauobertibusso@gmail.com');
      cy.get('.submit-button').click();
      cy.get('.swal2-popup', { timeout: 20000 }).should('contain', 'Errores de Validación')
      .and('contain', 'La fecha de finalización debe ser posterior a la fecha de inicio');
      cy.get('.swal2-confirm').click();
    })  

    it('No hay nombre del participante', () => {
      cy.visit('http://localhost:5173/')
      cy.get('h1').should('contain', '¡Bienvenido a HappyLotto!')
      cy.get('#name').type('nombre');
      cy.get('#endDate').click();
      cy.get('#endDate').clear().type('2024-12-26'); 
      cy.get('#endDate').should('have.value', '2024-12-26');
      cy.get('[placeholder="Nombre"]').type('Paulina');
      cy.get('[placeholder="Correo electrónico"]').type('paulinaobertibusso@gmail.com');
      cy.get('.add-button').click();
      cy.get(':nth-child(3) > [placeholder="Nombre"]').clear();
      cy.get(':nth-child(3) > [placeholder="Correo electrónico"]').click();
      cy.get(':nth-child(3) > [placeholder="Correo electrónico"]').type('paulinaobertibusso2@gmail.com');
      cy.get('.add-button').click();
      cy.get(':nth-child(4) > [placeholder="Nombre"]').type('Pauli');;
      cy.get(':nth-child(4) > [placeholder="Correo electrónico"]').type('pauobertibusso@gmail.com');
      cy.get('.submit-button').click();
      cy.get('.swal2-popup', { timeout: 20000 }).should('contain', 'Errores de Validación')
      .and('contain', 'El nombre del participante es obligatorio');
      cy.get('.swal2-confirm').click();
    })

    it('Nombre del participante menor a 2 caracteres', () => {
      cy.visit('http://localhost:5173/')
      cy.get('h1').should('contain', '¡Bienvenido a HappyLotto!')
      cy.get('#name').type('nombre');
      cy.get('#endDate').click();
      cy.get('#endDate').clear().type('2024-12-26'); 
      cy.get('#endDate').should('have.value', '2024-12-26');
      cy.get('[placeholder="Nombre"]').type('Paulina');
      cy.get('[placeholder="Correo electrónico"]').type('paulinaobertibusso@gmail.com');
      cy.get('.add-button').click();
      cy.get(':nth-child(3) > [placeholder="Nombre"]').type('P');
      cy.get(':nth-child(3) > [placeholder="Correo electrónico"]').click();
      cy.get(':nth-child(3) > [placeholder="Correo electrónico"]').type('paulinaobertibusso2@gmail.com');
      cy.get('.add-button').click();
      cy.get(':nth-child(4) > [placeholder="Nombre"]').type('Pauli');;
      cy.get(':nth-child(4) > [placeholder="Correo electrónico"]').type('pauobertibusso@gmail.com');
      cy.get('.submit-button').click();
      cy.get('.swal2-popup', { timeout: 20000 }).should('contain', 'Errores de Validación')
      .and('contain', 'El nombre debe tener al menos 2 caracteres');
      cy.get('.swal2-confirm').click();
    })

    it('Nombre del participante generico', () => {
      cy.visit('http://localhost:5173/')
      cy.get('h1').should('contain', '¡Bienvenido a HappyLotto!')
      cy.get('#name').type('nombre');
      cy.get('#endDate').click();
      cy.get('#endDate').clear().type('2024-12-26'); 
      cy.get('#endDate').should('have.value', '2024-12-26');
      cy.get('[placeholder="Nombre"]').type('Paulina');
      cy.get('[placeholder="Correo electrónico"]').type('paulinaobertibusso@gmail.com');
      cy.get('.add-button').click();
      cy.get(':nth-child(3) > [placeholder="Nombre"]').type('n/a');
      cy.get(':nth-child(3) > [placeholder="Correo electrónico"]').click();
      cy.get(':nth-child(3) > [placeholder="Correo electrónico"]').type('paulinaobertibusso2@gmail.com');
      cy.get('.add-button').click();
      cy.get(':nth-child(4) > [placeholder="Nombre"]').type('Pauli');;
      cy.get(':nth-child(4) > [placeholder="Correo electrónico"]').type('pauobertibusso@gmail.com');
      cy.get('.submit-button').click();
      cy.get('.swal2-popup', { timeout: 20000 }).should('contain', 'Errores de Validación')
      .and('contain', 'El nombre no puede ser genérico');
      cy.get('.swal2-confirm').click();
    })

    it('No hay email del partipante', () => {
      cy.visit('http://localhost:5173/')
      cy.get('h1').should('contain', '¡Bienvenido a HappyLotto!')
      cy.get('#name').type('nombre');
      cy.get('#endDate').click();
      cy.get('#endDate').clear().type('2024-12-26'); 
      cy.get('#endDate').should('have.value', '2024-12-26');
      cy.get('[placeholder="Nombre"]').type('Paulina');
      cy.get('[placeholder="Correo electrónico"]').type('paulinaobertibusso@gmail.com');
      cy.get('.add-button').click();
      cy.get(':nth-child(3) > [placeholder="Nombre"]').type('Pau');
      cy.get(':nth-child(3) > [placeholder="Correo electrónico"]').click();
      cy.get(':nth-child(3) > [placeholder="Correo electrónico"]').clear();
      cy.get('.add-button').click();
      cy.get(':nth-child(4) > [placeholder="Nombre"]').type('Pauli');;
      cy.get(':nth-child(4) > [placeholder="Correo electrónico"]').type('pauobertibusso@gmail.com');
      cy.get('.submit-button').click();
      cy.get('.swal2-popup', { timeout: 20000 }).should('contain', 'Errores de Validación')
      .and('contain', 'El email del participante es obligatorio');
      cy.get('.swal2-confirm').click();
    })

    it('Email con formato invalido', () => {
      cy.visit('http://localhost:5173/')
      cy.get('h1').should('contain', '¡Bienvenido a HappyLotto!')
      cy.get('#name').type('nombre');
      cy.get('#endDate').click();
      cy.get('#endDate').clear().type('2024-12-26'); 
      cy.get('#endDate').should('have.value', '2024-12-26');
      cy.get('[placeholder="Nombre"]').type('Paulina');
      cy.get('[placeholder="Correo electrónico"]').type('paulinaobertibusso@gmail.com');
      cy.get('.add-button').click();
      cy.get(':nth-child(3) > [placeholder="Nombre"]').type('Pau');
      cy.get(':nth-child(3) > [placeholder="Correo electrónico"]').click();
      cy.get(':nth-child(3) > [placeholder="Correo electrónico"]').type('paulinaobertibusso2');
      cy.get('.add-button').click();
      cy.get(':nth-child(4) > [placeholder="Nombre"]').type('Pauli');;
      cy.get(':nth-child(4) > [placeholder="Correo electrónico"]').type('pauobertibusso@gmail.com');
      cy.get('.submit-button').click();
      cy.get('.swal2-popup', { timeout: 20000 }).should('contain', 'Errores de Validación')
      .and('contain', 'El email no tiene un formato válido');
      cy.get('.swal2-confirm').click();
    })

    it('No hay 3 participantes', () => {
      cy.visit('http://localhost:5173/')
      cy.get('h1').should('contain', '¡Bienvenido a HappyLotto!')
      cy.get('#name').type('nombre');
      cy.get('#endDate').click();
      cy.get('#endDate').clear().type('2024-12-26'); 
      cy.get('#endDate').should('have.value', '2024-12-26');
      cy.get('[placeholder="Nombre"]').type('Paulina');
      cy.get('[placeholder="Correo electrónico"]').type('paulinaobertibusso@gmail.com');
      cy.get('.add-button').click();
      cy.get(':nth-child(2) > [placeholder="Nombre"]').type('Pauli');;
      cy.get(':nth-child(2) > [placeholder="Correo electrónico"]').type('pauobertibusso@gmail.com');
      cy.get('.submit-button').click();
      cy.get('.swal2-popup', { timeout: 20000 }).should('contain', 'Errores de Validación')
      .and('contain', 'Debe haber al menos tres participantes');
      cy.get('.swal2-confirm').click();
    })

    it('Email repetido', () => {
      cy.visit('http://localhost:5173/')
      cy.get('h1').should('contain', '¡Bienvenido a HappyLotto!')
      cy.get('#name').type('Sorteo de Prueba');
      cy.get('#endDate').click();
      cy.get('#endDate').clear().type('2024-12-26'); 
      cy.get('#endDate').should('have.value', '2024-12-26');
      cy.get('[placeholder="Nombre"]').type('Paulina');
      cy.get('[placeholder="Correo electrónico"]').type('paulinaobertibusso@gmail.com');
      cy.get('.add-button').click();
      cy.get(':nth-child(3) > [placeholder="Nombre"]').type('Pau');
      cy.get(':nth-child(3) > [placeholder="Correo electrónico"]').click();
      cy.get(':nth-child(3) > [placeholder="Correo electrónico"]').type('paulinaobertibusso2@gmail.com');
      cy.get('.add-button').click();
      cy.get(':nth-child(4) > [placeholder="Nombre"]').type('Pauli');;
      cy.get(':nth-child(4) > [placeholder="Correo electrónico"]').type('paulinaobertibusso2@gmail.com');
      cy.get('.submit-button').click();
      cy.get('.swal2-popup', { timeout: 20000 }).should('contain', 'Errores de Validación')
      .and('contain', 'El correo electrónico no puede repetirse.');
      cy.get('.swal2-confirm').click();
    })

    it('Muestra error al recibir una mala respuesta del servidor', () => {
      // Interceptamos la llamada al endpoint para simular un error 500
      cy.intercept('POST', '**/api/l/lottery/create/**', {
          statusCode: 500,
          body: 'Error interno del servidor',
      }).as('createLotteryError');

      cy.visit('http://localhost:5173/');
      cy.get('h1').should('contain', '¡Bienvenido a HappyLotto!');
      cy.get('#name').type('Sorteo con error');
      cy.get('#endDate').clear().type('2024-12-26');
      cy.get('[placeholder="Nombre"]').type('Paulina');
      cy.get('[placeholder="Correo electrónico"]').type('paulinaobertibusso@gmail.com');
      cy.get('.add-button').click();
      cy.get(':nth-child(3) > [placeholder="Nombre"]').type('Pau');
      cy.get(':nth-child(3) > [placeholder="Correo electrónico"]').type('paulinaobertibusso2@gmail.com');
      cy.get('.add-button').click();
      cy.get(':nth-child(4) > [placeholder="Nombre"]').type('Pauli');
      cy.get(':nth-child(4) > [placeholder="Correo electrónico"]').type('pauobertibusso@gmail.com');
      cy.get('.submit-button').click();
      cy.wait('@createLotteryError');
      cy.get('.swal2-title', { timeout: 10000 }).should('contain', 'Error');
      cy.get('.swal2-html-container', { timeout: 10000 }).should('contain','Error interno del servidor');
  })
})