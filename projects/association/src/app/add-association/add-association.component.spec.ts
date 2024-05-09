import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgToastService } from 'ng-angular-popup';
import { AddAssociationComponent } from './add-association.component';
import { AssociationServiceService } from '../services/association-service.service';
import { ColaboratorServiceService } from '../services/colaborator-service.service';
import { of } from 'rxjs';

describe('AddAssociationComponent', () => {
  let component: AddAssociationComponent;
  let fixture: ComponentFixture<AddAssociationComponent>;
  let associationService: AssociationServiceService;
  let colabService: ColaboratorServiceService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientModule, AddAssociationComponent],
      providers: [
        NgToastService,
        {
          provide: AssociationServiceService,
          useValue: {
            addAssociation: jasmine.createSpy('addAssociation').and.returnValue(of({})),
            getAssociations: jasmine.createSpy('getAssociations').and.returnValue(of([]))
          }
        },
        {
          provide: ColaboratorServiceService,
          useValue: {
            getColabs: jasmine.createSpy('getColabs').and.returnValue(of([]))
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddAssociationComponent);
    component = fixture.componentInstance;
    associationService = TestBed.inject(AssociationServiceService);
    colabService = TestBed.inject(ColaboratorServiceService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should load collaborators and associations on initialization', () => {
  //   expect(colabService.getColabs).toHaveBeenCalled();
  //   expect(associationService.getAssociations).toHaveBeenCalled();
  //   expect(component.colaboratorsLista.length).toBe(0);
  //   expect(component.associationsLista.length).toBe(0);
  // });

  it('should add association with valid input', () => {
    const mockColabId = '1';
    const mockProjectId = '1';
    const mockStartDate = '2024-04-12';
    const mockEndDate = '2024-04-15';

    spyOn(component, 'addAssociation').and.callThrough();

    component.validateAndAddAssociation(mockColabId, mockProjectId, mockStartDate, mockEndDate);

    expect(component.showAssociationNameError).toBeFalse();
    expect(component.addAssociation).toHaveBeenCalledWith(1, 1, '2024-04-12', '2024-04-15');
  });

  it('should show error message for empty input', () => {
    component.validateAndAddAssociation('', '', '', '');

    expect(component.showAssociationNameError).toBeTrue();
    expect(associationService.addAssociation).not.toHaveBeenCalled();
  });
});

