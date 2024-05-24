describe('Testes para o componente Association', () => {

    beforeEach(() => {
        cy.visit('/');
    });

        it('has the correct title', () => {
            cy.title().should('equal', 'Association');
        });

        // Verifica se o <h1> contém o texto "Welcome to the Home Page"
        it('should display the home page heading', () => {
            cy.get('h1').should('contain.text', 'Associações');
        });

        // Verifica se o parágrafo contém o texto correto
        it('should display the correct home page description', () => {
            cy.get('p').should('contain.text', 'Associações');
        });

        // Verifica se o clique no botão chama o componente app-association
      it('should have app-association visible', () => {

        cy.get('.navbar-buttons .btn.btn-light').click();

        // Verifica se o componente está na página
        cy.get('app-association').should('exist');

        cy.get('[id="add-association-btn1"]').should('exist');
        // cy.get('.add-association-form').should('be.visible');

        // Verifica se o botão de pesquisar e o campo de pesquisa estão visíveis
        cy.get('.search-input').should('exist');
        cy.get('.search-button').should('exist');

        // Verifica se a tabela de associações é visível
        cy.get('table').should('exist');
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

    it('should filter associations based on search query', () => {
        cy.get('.navbar-buttons .btn.btn-light').click();

        // Entra uma query de pesquisa
        cy.get('.search-input').type('Vitor');
        // Clica no botão de pesquisar
        cy.get('.search-button').click();

        // Verifica se a tabela foi filtrada corretamente
        cy.get('[id="associations-table"]').should('exist');
        cy.get('[id="associations-table"]').find('[id="associations"]').each(($item) => {
            cy.wrap($item).should('contain', 'Vitor');
        });
    });

    it('should toggle the add association form on button click', () => {
        cy.get('.navbar-buttons .btn.btn-light').click();
        cy.get('[id="add-association-btn1"]').click();

        // Verifica se o formulário de adição de associação é visível
        cy.get('.add-association-form').should('be.visible');
        // Clica no botão de fechar
        cy.get('.close').click();
        // Verifica se o formulário de adição de associação não é mais visível
        cy.get('.add-association-form').should('not.exist');
    });

});
