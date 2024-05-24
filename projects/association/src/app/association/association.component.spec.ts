import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgToastService } from 'ng-angular-popup';
import { of } from 'rxjs';
import { AssociationComponent } from './association.component';
import { AssociationServiceService } from '../services/association-service.service';
import { ColaboratorServiceService } from '../services/colaborator-service.service';
import { ProjectServiceService } from '../services/project-service.service';
import { IAssociation } from '../model/IAssociation';
import { IColaborator } from '../model/IColaborator';
import { IProject } from '../model/IProject';
import { AddAssociationComponent } from '../add-association/add-association.component';
import { By } from '@angular/platform-browser';

describe('AssociationComponent', () => {
  let component: AssociationComponent;
  let fixture: ComponentFixture<AssociationComponent>;
  let associationService: jasmine.SpyObj<AssociationServiceService>;
  let colabService: jasmine.SpyObj<ColaboratorServiceService>;
  let projectService: jasmine.SpyObj<ProjectServiceService>;
  let httpMock: HttpClientModule;
  let toastService: NgToastService;
  //let toastService: jasmine.SpyObj<NgToastService>;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });

  });

  beforeEach(async () => {
    const associationSpy = jasmine.createSpyObj('AssociationServiceService', ['getAssociations']);
    const colabSpy = jasmine.createSpyObj('ColaboratorServiceService', ['getColabs']);
    const projectSpy = jasmine.createSpyObj('ProjectServiceService', ['getProjects']);
    const toastServiceSpy = jasmine.createSpyObj('ToastService', ['info', 'success']);

    // Dados fictícios para o serviço de associações
    const mockAssociations = [
      { id: 1, name: 'Associação 1', description: 'Descrição da Associação 1' },
      // ... outros dados fictícios de associações
    ];

    // Dados fictícios para o serviço de colaboradores
    const mockColabs = [
      { id: 1, name: 'Colaborador 1', role: 'Papel 1' },
      // ... outros dados fictícios de colaboradores
    ];

    // Dados fictícios para o serviço de projetos
    const mockProjects = [
      { id: 1, title: 'Projeto 1', description: 'Descrição do Projeto 1' },
      // ... outros dados fictícios de projetos
    ];

    // Simule os retornos dos métodos dos serviços com os dados fictícios
    associationSpy.getAssociations.and.returnValue(of(mockAssociations));
    colabSpy.getColabs.and.returnValue(of(mockColabs));
    projectSpy.getProjects.and.returnValue(of(mockProjects));

    // ... o restante do seu código de teste ...


    await TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientModule, CommonModule, AssociationComponent, AddAssociationComponent],
      providers: [
        { provide: AssociationServiceService, useValue: associationSpy },
        { provide: ColaboratorServiceService, useValue: colabSpy },
        { provide: ProjectServiceService, useValue: projectSpy },
        { provide: NgToastService, useValue: toastService },
        NgToastService
      ]
    }).compileComponents();

    associationService = TestBed.inject(AssociationServiceService) as jasmine.SpyObj<AssociationServiceService>;
    colabService = TestBed.inject(ColaboratorServiceService) as jasmine.SpyObj<ColaboratorServiceService>;
    projectService = TestBed.inject(ProjectServiceService) as jasmine.SpyObj<ProjectServiceService>;
    toastService = TestBed.inject(NgToastService) as jasmine.SpyObj<NgToastService>;

  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssociationComponent);
    component = fixture.componentInstance;
    toastService = TestBed.inject(NgToastService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load collaborators and associations on initialization', () => {
    expect(colabService.getColabs).toHaveBeenCalled();
    expect(associationService.getAssociations).toHaveBeenCalled();
    expect(component.colaboratorsLista.length).toBe(1);
    expect(component.associationsLista.length).toBe(1);
  });

  it('should fetch associations on initialization', () => {
    const mockAssociations: IAssociation[] = [
      { id: 1, colaboratorId: 1, projectId: 1, startDate: '2022-01-01', endDate: '2022-01-31' },
      { id: 2, colaboratorId: 2, projectId: 2, startDate: '2022-02-01', endDate: '2022-02-28' }
    ];
    associationService.getAssociations.and.returnValue(of(mockAssociations));

    component.ngOnInit();

    expect(associationService.getAssociations).toHaveBeenCalled();
    expect(component.associationsLista).toEqual(mockAssociations);
    expect(component.filteredAssociations).toEqual(mockAssociations);
  });

  it('should filter associations based on search query', () => {
    const mockAssociations: IAssociation[] = [
      { id: 1, colaboratorId: 1, projectId: 1, startDate: '2022-01-01', endDate: '2022-01-31' },
      { id: 2, colaboratorId: 2, projectId: 2, startDate: '2022-02-01', endDate: '2022-02-28' }
    ];
    component.associationsLista = mockAssociations;
    component.searchQuery = '2022-01-01';

    component.search();

    expect(component.filteredAssociations.length).toBe(1);
    expect(component.filteredAssociations[0].id).toBe(1);
  });

  it('should fetch collaborators on initialization', () => {
    // Mock dos colaboradores retornados pelo serviço
    const mockCollaborators: IColaborator[] = [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
    ];
    // Espionando o método getColabs() do serviço e configurando-o para retornar os colaboradores mockados
    colabService.getColabs.and.returnValue(of(mockCollaborators));

    // Chamando o método ngOnInit() que deveria buscar os colaboradores
    component.ngOnInit();

    // Verificando se o método getColabs() foi chamado
    expect(colabService.getColabs).toHaveBeenCalled();
    // Verificando se os colaboradores buscados são os mesmos que foram mockados
    expect(component.colaboradoresAssocLista).toEqual(mockCollaborators);
  });

  it('should fetch projects on initialization', () => {
    // Mock dos projetos retornados pelo serviço
    const mockProjects: IProject[] = [
      { id: 1, name: 'Project A', startDate: '2024-01-03', endDate: '2024-01-10' },
      { id: 2, name: 'Project B', startDate: '2024-01-04', endDate: '2024-01-11' }
    ];
    // Espionando o método getProjects() do serviço e configurando-o para retornar os projetos mockados
    projectService.getProjects.and.returnValue(of(mockProjects));

    // Chamando o método ngOnInit() que deveria buscar os projetos
    component.ngOnInit();

    // Verificando se o método getProjects() foi chamado
    expect(projectService.getProjects).toHaveBeenCalled();
    // Verificando se os projetos buscados são os mesmos que foram mockados
    expect(component.projectsAssocLista).toEqual(mockProjects);
  });

  // it('should toggle create association component and show app-add-association component when "Criar Associationo" button is clicked', () => {
  //   // Garantir que o estado inicial permite a renderização do botão
  //   component.showCreateAssociation = false;
  //   fixture.detectChanges(); // Assegura que o estado inicial seja aplicado ao template

  //   // Configurar o spy no método toggleCreateAssociation antes de simular o clique
  //   spyOn(component, 'toggleCreateAssociation').and.callThrough();

  //   // Buscar o botão e verificar se ele está presente no DOM
  //   const button = fixture.debugElement.query(By.css('.action-button'));
  //   expect(button).toBeTruthy('O botão "Criar Associationo" deve estar presente');

  //   // Simular o clique no botão
  //   button.nativeElement.click();
  //   fixture.detectChanges(); // Atualizar o estado após o clique

  //   // Verificar se o método toggleCreateAssociation foi realmente chamado
  //   expect(component.toggleCreateAssociation).toHaveBeenCalled();

  //   // Verificar se o estado showCreateAssociation mudou para true
  //   expect(component.showCreateAssociation).toBeTrue();

  //   // Verificar a renderização do componente app-add-association
  //   const addAssociationComponent = fixture.debugElement.query(By.directive(AddAssociationComponent));
  //   expect(addAssociationComponent).toBeTruthy('O componente app-add-association deve ser renderizado após o clique');
  // });

  it('should close the component', () => {
    // Espionando o evento fecharAssociationEvent
    spyOn(component.fecharAssociationEvent, 'emit');

    // Chamando o método para fechar o componente
    component.fecharComponente();

    // Verificando se o evento fecharAssociationEvent foi emitido
    expect(component.fecharAssociationEvent.emit).toHaveBeenCalled();
  });

  it('should display AddAssociationComponent when showCreateAssociation is true', () => {
    component.showCreateAssociation = true;
    fixture.detectChanges();
    const addAssociationElement = fixture.debugElement.query(By.directive(AddAssociationComponent));
    expect(addAssociationElement).not.toBeNull();
  });

  // it('should show toast on polling limit reached with no success', fakeAsync(() => {
  //   spyOn(toastService, 'success');

  //   // Simulate reaching the polling limit without success
  //   component.maxPollingCount = 3; // Set maxPollingCount to a testable value
  //   for (let i = 0; i < component.maxPollingCount; i++) {
  //     component.onAssociationAdded();
  //   }

  //   // Trigger the interval function manually since setInterval won't execute immediately
  //   for (let i = 0; i < component.maxPollingCount; i++) {
  //     tick(5000);
  //   }

  //   // Verify the toast was called
  //   expect(toastService.success).toHaveBeenCalledWith({
  //     detail: 'New Association added!',
  //     summary: 'Success',
  //     duration: 5000,
  //   });
  // }));


});

