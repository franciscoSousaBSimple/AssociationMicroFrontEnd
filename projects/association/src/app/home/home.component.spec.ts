import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { AssociationServiceService } from '../services/association-service.service';
import { By } from '@angular/platform-browser';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let associationService: jasmine.SpyObj<AssociationServiceService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const associationSpy = jasmine.createSpyObj('AssociationServiceService', ['getAssociations']);

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set associacaoCriada to true when addAssociacoes is called', () => {
    expect(component.associacaoCriada).toBeFalse();
    component.addAssociacoes();
    expect(component.associacaoCriada).toBeTrue();
});

it('should set associacaoCarregada to false when fecharAssociacoes is called', () => {
  component.fecharAssociacoes();
  expect(component.associacaoCarregada).toBeFalse();
});

// it('should handle loaded associations from the service', () => {
//   const spy = spyOn(component.associationService, 'loadAssociations').and.returnValue(of({ data: 'Some Association Data' }));
//   component.loadAssociacoes();
//   expect(spy).toHaveBeenCalled();
//   expect(component.associacaoCarregada).toBeTrue();
//   // Verificar se a lógica adicional é executada baseada nos dados carregados
// });

it('should display <app-association> only when associacaoCarregada is true', () => {
  component.associacaoCarregada = false;
  fixture.detectChanges();
  let element = fixture.debugElement.query(By.css('app-association'));
  expect(element).toBeNull();

  component.associacaoCarregada = true;
  fixture.detectChanges();
  element = fixture.debugElement.query(By.css('app-association'));
  expect(element).not.toBeNull();
});

});
