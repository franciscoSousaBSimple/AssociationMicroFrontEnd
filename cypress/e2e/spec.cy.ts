describe('Testes para o componente home', () => {

  beforeEach(() => {
    cy.visit('/');
  });


  // Verifica se o botão "Get Started" está presente e é clicável
  it('should have a Carregar Associacoes', () => {
    cy.get('.navbar-buttons .btn.btn-light').should('exist').and('be.visible').click().and('contain.text', 'Carregar Associacoes');
  });

  // Verifica se o clique no botão chama o componente app-association
  it('should call app-association on button click', () => {
    // Clica no botão
    cy.get('.navbar-buttons .btn.btn-light').click();

    // Verifica se o componente foi chamado
    cy.get('app-association').should('exist');

    cy.get('[id="add-association-btn1"]').should('exist');
    // cy.get('.add-association-form').should('be.visible');

    // Verifica se o botão de pesquisar e o campo de pesquisa estão visíveis
    cy.get('.search-input').should('exist');
    cy.get('.search-button').should('exist');

    // Verifica se a tabela de associações é visível
    cy.get('table').should('exist');
  });
  
});