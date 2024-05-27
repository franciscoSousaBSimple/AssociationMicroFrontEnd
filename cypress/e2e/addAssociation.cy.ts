describe('Testes para o componente add Association', () => {

    beforeEach(() => {
        cy.visit('/');
    });

    it('should call add-association on Adicionar Associação button click', () => {

        cy.get('.navbar-buttons .btn.btn-light').click();

        // Clica no botão
        cy.get('[id="add-association-btn1"]').click();

        //Verifica se o componente foi chamado
        cy.get('app-add-association').should('exist');

        cy.get('.add-association-form').should('be.visible');
        cy.get('.addAssociation-form').should('be.visible');
        cy.get('.addProject-form').should('be.visible');
        cy.get('[id="associationStartDate"]').should('be.visible');
        cy.get('[id="associationEndDate"]').should('be.visible');
        cy.get('.add-button').should('be.visible');
    });


    it('should display error message if required fields are empty', () => {
        cy.get('.navbar-buttons .btn.btn-light').click();
        cy.get('[id="add-association-btn1"]').click();

        // Clica no botão de adicionar sem preencher os campos
        cy.get('.add-button').click();

        // Verifica se a mensagem de erro é exibida
        cy.get('.error-message.text-danger').should('be.visible').and('contain', 'Os id de colab e projeto são obrigatórios');
    });

    // it('should add a new association when form is filled correctly', () => {

    //     cy.get('.navbar-buttons .btn.btn-light').click();

    //     cy.get('#associations-table').find('tbody tr').its('length').then((rowCount) => {
    //         const initialRowCount = rowCount;

    //         cy.get('[id="add-association-btn1"]').click();

    //         // Preenche os campos do formulário
    //         cy.get('#colaboratorId').select('1 - Vitor Ventira'); // Ajuste conforme necessário
    //         cy.get('#projectId').select('proj1'); // Ajuste conforme necessário
    //         cy.get('#associationStartDate').type('2024-05-08');
    //         cy.get('#associationEndDate').type('2024-05-10');

    //         // Clica no botão de adicionar
    //         cy.get('.add-button').click();
    //        // cy.wait(7500)

    //         //cy.get('#associations-table').find('tbody tr').its('length').should('eq', initialRowCount + 1);
    //         // Verifica se a associação foi adicionada (ajuste a verificação conforme necessário)
    //         cy.get('[id="associations-table"]').should('contain', 'Vitor Ventira');
    //         cy.get('[id="associations-table"]').should('contain', 'proj1');
    //         cy.get('[id="associations-table"]').should('contain', '2024-05-08');
    //         cy.get('[id="associations-table"]').should('contain', '2024-05-10');
    //     });

    //     it('should clear form fields after adding a new association', () => {
    //         cy.get('.navbar-buttons .btn.btn-light').click();
    //         cy.get('[id="add-association-btn1"]').click();

    //         // Preenche os campos do formulário
    //         cy.get('#colaboratorId').select('1 - Vitor Ventira'); // Ajuste conforme necessário
    //         cy.get('#projectId').select('proj1'); // Ajuste conforme necessário
    //         cy.get('#associationStartDate').type('2024-05-05');
    //         cy.get('#associationEndDate').type('2024-05-06');

    //         // Clica no botão de adicionar
    //         cy.get('.add-button').click();

    //         // Verifica se os campos foram limpos
    //         cy.get('[id="associations-table"]').should('have.value', '');
    //         cy.get('[id="associations-table"]').should('have.value', '');
    //         cy.get('[id="associations-table"]').should('have.value', '');
    //         cy.get('[id="associations-table"]').should('have.value', '');
    //     });
    // });
});