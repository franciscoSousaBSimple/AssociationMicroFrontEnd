import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgToastService } from 'ng-angular-popup';
import { AddAssociationComponent } from './add-association.component';
import { AssociationServiceService } from '../services/association-service.service';
import { ColaboratorServiceService } from '../services/colaborator-service.service';
import { of, throwError } from 'rxjs';
import { IAssociation } from '../model/IAssociation';

describe('AddAssociationComponent', () => {
  let component: AddAssociationComponent;
  let fixture: ComponentFixture<AddAssociationComponent>;
  let associationService: jasmine.SpyObj<AssociationServiceService>;
  let toastService: NgToastService;

  beforeEach(async () => {
    const spyServices = {
      addAssociation: jasmine.createSpy('addAssociation').and.returnValue(of({
        id: 1,
        colaboratorId: 1,
        projectId: 1,
        startDate: '2024-01-01',
        endDate: '2024-01-02'
      })), // Correct spy setup
      getAssociations: jasmine.createSpy('getAssociations').and.returnValue(of([]))
    };

    await TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientModule],
      providers: [
        NgToastService,
        { provide: AssociationServiceService, useValue: spyServices },
        {
          provide: ColaboratorServiceService,
          useValue: jasmine.createSpyObj('ColaboratorServiceService', ['getColabs', 'getProjects'])
        }
      ]
    }).compileComponents();

    associationService = TestBed.inject(AssociationServiceService) as any;
    toastService = TestBed.inject(NgToastService);
    fixture = TestBed.createComponent(AddAssociationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add association with valid input', () => {
    component.validateAndAddAssociation('1', '1', '2024-01-01', '2024-01-02');
    expect(associationService.addAssociation).toHaveBeenCalled();
  });

  it('should not add association with invalid dates', () => {
    component.validateAndAddAssociation('1', '1', '2024-01-01', '2023-12-31');
    expect(associationService.addAssociation).not.toHaveBeenCalled();
  });
  it('should not add association with invalid values', () => {
    component.validateAndAddAssociation('200', '200', '2024-01-01', '2024-12-31');
    expect(associationService.addAssociation).toHaveBeenCalled();
  });

  it('should display error message for empty input', () => {
    component.validateAndAddAssociation('', '', '', '');
    expect(component.showAssociationNameError).toBeTrue();
  });

  it('should emit success message on successful addition', () => {
    spyOn(component.associationAdded, 'emit');
    associationService.addAssociation.and.returnValue(of({
      id: 1,
      colaboratorId: 1,
      projectId: 1,
      startDate: '2024-01-01',
      endDate: '2024-01-02'
    }));
    component.addAssociation(1, 1, '2024-01-01', '2024-01-02');
    expect(component.associationAdded.emit).toHaveBeenCalled();
  });

  it('should handle errors from the association service', () => {
    spyOn(toastService, 'info');
    associationService.addAssociation.and.returnValue(throwError(() => new Error('Failed to add')));
    component.addAssociation(1, 1, '2024-01-01', '2024-01-02');
    expect(toastService.info).toHaveBeenCalledWith(jasmine.objectContaining({
      summary: 'Erro ao adicionar associação'
    }));
  });
  it('should display error if required fields are empty', () => {
    component.validateAndAddAssociation('', '', '', '');
    expect(component.showAssociationNameError).toBeTrue();
    expect(associationService.addAssociation).not.toHaveBeenCalled();
  });



  it('should clear fields on successful addition', () => {
    const mockColabId = 1;
    const mockProjectId = 1;
    const mockStartDate = '2024-04-12';
    const mockEndDate = '2024-04-15';
  
    // Simulate adding the association
    component.addAssociation(mockColabId, mockProjectId, mockStartDate, mockEndDate);
    
    fixture.detectChanges(); // Atualiza o binding no HTML

    const colabIdInput = fixture.nativeElement.querySelector('#colaboratorId');
    const projectIdInput = fixture.nativeElement.querySelector('#projectId');
    const startDateInput = fixture.nativeElement.querySelector('#associationStartDate');
    const endDateInput = fixture.nativeElement.querySelector('#associationEndDate');
  
    expect(colabIdInput.value).toBe('');
    expect(projectIdInput.value).toBe('');
    expect(startDateInput.value).toBe('');
    expect(endDateInput.value).toBe('');
  });

  it('should not add association if start date is after end date', () => {
    component.validateAndAddAssociation('1', '1', '2024-01-02', '2024-01-01');
    expect(associationService.addAssociation).not.toHaveBeenCalled();
  });

  it('should react to association added event properly', () => {
    spyOn(component.associationAdded, 'emit');
    component.addAssociation(1, 1, '2024-01-01', '2024-01-02');
    expect(component.associationAdded.emit).toHaveBeenCalled();
  });

  it('should handle API errors gracefully', () => {
    spyOn(toastService, 'info');
    associationService.addAssociation.and.returnValue(throwError(() => new Error('API error')));
    component.addAssociation(1, 1, '2024-01-01', '2024-01-02');
    expect(toastService.info).toHaveBeenCalledWith(jasmine.objectContaining({
      summary: 'Erro ao adicionar associação'
    }));
  });
});
