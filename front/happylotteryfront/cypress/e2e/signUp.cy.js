describe('Register', () => {
    it('Registro exitoso', () => {
      cy.visit('http://localhost:5173/')
      cy.get('h1').should('contain', '¡Bienvenido a HappyLotto!')
      cy.get('[href="/register"]').click();
      cy.get('[placeholder="Nombre"]').type('Paulina');
      cy.get('[placeholder="Email"]').type('prubacypress@gmail.com');
      cy.get('[placeholder="Numero (opcional)"]').type('3513264538');
      cy.get(':nth-child(4) > input').type('Paulina2003!');
      cy.get('.register > :nth-child(5)').click();
      cy.get(':nth-child(5) > input').type('Paulina2003!');
      cy.get('[type="submit"]').click();
      cy.get('.swal2-popup', { timeout: 20000 }).should('contain', 'Registro exitoso')
      .and('contain', '¡Te has registrado correctamente!');
      cy.get('.swal2-confirm').click();
    })

    it('No hay datos', () => {
        cy.visit('http://localhost:5173/')
        cy.get('h1').should('contain', '¡Bienvenido a HappyLotto!')
        cy.get('[href="/register"]').click();
        cy.get('[placeholder="Nombre"]').clear();
        cy.get('[placeholder="Email"]').clear();
        cy.get('[placeholder="Numero (opcional)"]').clear();
        cy.get(':nth-child(4) > input').clear();
        cy.get('.register > :nth-child(5)').click();
        cy.get(':nth-child(5) > input').clear();
        cy.get('[type="submit"]').click();
        cy.get('.swal2-popup', { timeout: 20000 }).should('contain', 'Error de Validación')
        .and('contain', 'Debe ingresar los campos obligatorios para que se realice el registro');
        cy.get('.swal2-confirm').click();
    })

    it('No hay nombre', () => {
        cy.visit('http://localhost:5173/')
        cy.get('h1').should('contain', '¡Bienvenido a HappyLotto!')
        cy.get('[href="/register"]').click();
        cy.get('[placeholder="Nombre"]').clear();
        cy.get('[placeholder="Email"]').type('prubacypress@gmail.com');
        cy.get('[placeholder="Numero (opcional)"]').type('3513264538');
        cy.get(':nth-child(4) > input').type('Paulina2003!');
        cy.get('.register > :nth-child(5)').click();
        cy.get(':nth-child(5) > input').type('Paulina2003!');
        cy.get('[type="submit"]').click();
        cy.get('.swal2-popup', { timeout: 20000 }).should('contain', 'Error de Validación')
        .and('contain', 'El campo de nombre es obligatorio');
        cy.get('.swal2-confirm').click();
    })

    it('Nombre menor a 2 caracteres', () => {
        cy.visit('http://localhost:5173/')
        cy.get('h1').should('contain', '¡Bienvenido a HappyLotto!')
        cy.get('[href="/register"]').click();
        cy.get('[placeholder="Nombre"]').type('P');
        cy.get('[placeholder="Email"]').type('prubacypress@gmail.com');
        cy.get('[placeholder="Numero (opcional)"]').type('3513264538');
        cy.get(':nth-child(4) > input').type('Paulina2003!');
        cy.get('.register > :nth-child(5)').click();
        cy.get(':nth-child(5) > input').type('Paulina2003!');
        cy.get('[type="submit"]').click();
        cy.get('.swal2-popup', { timeout: 20000 }).should('contain', 'Error de Validación')
        .and('contain', 'El nombre debe tener al menos 2 caracteres');
        cy.get('.swal2-confirm').click();
    })

    it('Nombre generico', () => {
        cy.visit('http://localhost:5173/')
        cy.get('h1').should('contain', '¡Bienvenido a HappyLotto!')
        cy.get('[href="/register"]').click();
        cy.get('[placeholder="Nombre"]').type('n/a');
        cy.get('[placeholder="Email"]').type('prubacypress@gmail.com');
        cy.get('[placeholder="Numero (opcional)"]').type('3513264538');
        cy.get(':nth-child(4) > input').type('Paulina2003!');
        cy.get('.register > :nth-child(5)').click();
        cy.get(':nth-child(5) > input').type('Paulina2003!');
        cy.get('[type="submit"]').click();
        cy.get('.swal2-popup', { timeout: 20000 }).should('contain', 'Error de Validación')
        .and('contain', 'El nombre no puede ser genérico');
        cy.get('.swal2-confirm').click();
    })

    it('Nombre con numeros', () => {
        cy.visit('http://localhost:5173/')
        cy.get('h1').should('contain', '¡Bienvenido a HappyLotto!')
        cy.get('[href="/register"]').click();
        cy.get('[placeholder="Nombre"]').type('Pau55');
        cy.get('[placeholder="Email"]').type('prubacypress@gmail.com');
        cy.get('[placeholder="Numero (opcional)"]').type('3513264538');
        cy.get(':nth-child(4) > input').type('Paulina2003!');
        cy.get('.register > :nth-child(5)').click();
        cy.get(':nth-child(5) > input').type('Paulina2003!');
        cy.get('[type="submit"]').click();
        cy.get('.swal2-popup', { timeout: 20000 }).should('contain', 'Error de Validación')
        .and('contain', 'El nombre no puede contener números ni caracteres especiales');
        cy.get('.swal2-confirm').click();
    })

    it('No hay email', () => {
        cy.visit('http://localhost:5173/')
        cy.get('h1').should('contain', '¡Bienvenido a HappyLotto!')
        cy.get('[href="/register"]').click();
        cy.get('[placeholder="Nombre"]').type('Paulina');
        cy.get('[placeholder="Email"]').clear();
        cy.get('[placeholder="Numero (opcional)"]').type('3513264538');
        cy.get(':nth-child(4) > input').type('Paulina2003!');
        cy.get('.register > :nth-child(5)').click();
        cy.get(':nth-child(5) > input').type('Paulina2003!');
        cy.get('[type="submit"]').click();
        cy.get('.swal2-popup', { timeout: 20000 }).should('contain', 'Error de Validación')
        .and('contain', 'El campo de email es obligatorio');
        cy.get('.swal2-confirm').click();
    })

    it('Email sin formato valido', () => {
        cy.visit('http://localhost:5173/')
        cy.get('h1').should('contain', '¡Bienvenido a HappyLotto!')
        cy.get('[href="/register"]').click();
        cy.get('[placeholder="Nombre"]').type('Paulina');
        cy.get('[placeholder="Email"]').type('paulinaobertibusso');
        cy.get('[placeholder="Numero (opcional)"]').type('3513264538');
        cy.get(':nth-child(4) > input').type('Paulina2003!');
        cy.get('.register > :nth-child(5)').click();
        cy.get(':nth-child(5) > input').type('Paulina2003!');
        cy.get('[type="submit"]').click();
        cy.get('.swal2-popup', { timeout: 20000 }).should('contain', 'Error de Validación')
        .and('contain', 'El email no tiene un formato válido');
        cy.get('.swal2-confirm').click();
    })

    it('No hay contraseña', () => {
        cy.visit('http://localhost:5173/')
        cy.get('h1').should('contain', '¡Bienvenido a HappyLotto!')
        cy.get('[href="/register"]').click();
        cy.get('[placeholder="Nombre"]').type('Paulina');
        cy.get('[placeholder="Email"]').type('prubacypress@gmail.com');
        cy.get('[placeholder="Numero (opcional)"]').type('3513264538');
        cy.get(':nth-child(4) > input').clear();
        cy.get('.register > :nth-child(5)').click();
        cy.get(':nth-child(5) > input').type('Paulina2003!');
        cy.get('[type="submit"]').click();
        cy.get('.swal2-popup', { timeout: 20000 }).should('contain', 'Error de Validación')
        .and('contain', 'El campo de contraseña es obligatorio');
        cy.get('.swal2-confirm').click();
    })

    it('Contraseña menor a 8 caracteres', () => {
        cy.visit('http://localhost:5173/')
        cy.get('h1').should('contain', '¡Bienvenido a HappyLotto!')
        cy.get('[href="/register"]').click();
        cy.get('[placeholder="Nombre"]').type('Paulina');
        cy.get('[placeholder="Email"]').type('prubacypress@gmail.com');
        cy.get('[placeholder="Numero (opcional)"]').type('3513264538');
        cy.get(':nth-child(4) > input').type('P2!');
        cy.get('.register > :nth-child(5)').click();
        cy.get(':nth-child(5) > input').type('Paulina2003!');
        cy.get('[type="submit"]').click();
        cy.get('.swal2-popup', { timeout: 20000 }).should('contain', 'Error de Validación')
        .and('contain', 'La contraseña debe tener al menos 8 caracteres');
        cy.get('.swal2-confirm').click();
    })

    it('Contraseña sin letra mayuscula', () => {
        cy.visit('http://localhost:5173/')
        cy.get('h1').should('contain', '¡Bienvenido a HappyLotto!')
        cy.get('[href="/register"]').click();
        cy.get('[placeholder="Nombre"]').type('Paulina');
        cy.get('[placeholder="Email"]').type('prubacypress@gmail.com');
        cy.get('[placeholder="Numero (opcional)"]').type('3513264538');
        cy.get(':nth-child(4) > input').type('paulina2003!');
        cy.get('.register > :nth-child(5)').click();
        cy.get(':nth-child(5) > input').type('Paulina2003!');
        cy.get('[type="submit"]').click();
        cy.get('.swal2-popup', { timeout: 20000 }).should('contain', 'Error de Validación')
        .and('contain', 'La contraseña debe incluir al menos una letra mayúscula');
        cy.get('.swal2-confirm').click();
    })

    it('Contraseña sin numero', () => {
        cy.visit('http://localhost:5173/')
        cy.get('h1').should('contain', '¡Bienvenido a HappyLotto!')
        cy.get('[href="/register"]').click();
        cy.get('[placeholder="Nombre"]').type('Paulina');
        cy.get('[placeholder="Email"]').type('prubacypress@gmail.com');
        cy.get('[placeholder="Numero (opcional)"]').type('3513264538');
        cy.get(':nth-child(4) > input').type('Paulina!');
        cy.get('.register > :nth-child(5)').click();
        cy.get(':nth-child(5) > input').type('Paulina2003!');
        cy.get('[type="submit"]').click();
        cy.get('.swal2-popup', { timeout: 20000 }).should('contain', 'Error de Validación')
        .and('contain', 'La contraseña debe incluir al menos un número');
        cy.get('.swal2-confirm').click();
    })

    it('Contraseñas no coinciden', () => {
        cy.visit('http://localhost:5173/')
        cy.get('h1').should('contain', '¡Bienvenido a HappyLotto!')
        cy.get('[href="/register"]').click();
        cy.get('[placeholder="Nombre"]').type('Paulina');
        cy.get('[placeholder="Email"]').type('prubacypress@gmail.com');
        cy.get('[placeholder="Numero (opcional)"]').type('3513264538');
        cy.get(':nth-child(4) > input').type('Paulina2!');
        cy.get('.register > :nth-child(5)').click();
        cy.get(':nth-child(5) > input').type('Paulina2003!');
        cy.get('[type="submit"]').click();
        cy.get('.swal2-popup', { timeout: 20000 }).should('contain', 'Error de Validación')
        .and('contain', 'Las contraseñas no coinciden');
        cy.get('.swal2-confirm').click();
    })

    it('Muestra error al recibir una mala respuesta del servidor', () => {
        // Interceptamos la llamada al endpoint para simular un error 500
        cy.intercept('POST', '**/api/u/user/public/signUp', {
        statusCode: 500,
        body: 'Error interno del servidor',
        }).as('createLotteryError');

        cy.visit('http://localhost:5173/')
        cy.get('h1').should('contain', '¡Bienvenido a HappyLotto!')
        cy.get('[href="/register"]').click();
        cy.get('[placeholder="Nombre"]').type('Paulina');
        cy.get('[placeholder="Email"]').type('prubacypress@gmail.com');
        cy.get('[placeholder="Numero (opcional)"]').type('3513264538');
        cy.get(':nth-child(4) > input').type('Paulina2003!');
        cy.get('.register > :nth-child(5)').click();
        cy.get(':nth-child(5) > input').type('Paulina2003!');
        cy.get('[type="submit"]').click();
        cy.get('.swal2-popup', { timeout: 20000 }).should('contain', 'Error en el registro')
        .and('contain', 'Ocurrió un error al registrarse. Intenta nuevamente.');
        cy.get('.swal2-confirm').click();
    })
})