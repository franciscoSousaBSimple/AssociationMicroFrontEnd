import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [CommonModule]
})
class FakeAssociationMainModule {}

describe('Route Module Loading Tests', () => {
  let router: Router;
  let loadChildrenSpy: jasmine.Spy;

  const routes: Routes = [
    {
      path: '',
      loadChildren: () => import('../../association-main/association-main.module').then(m => m.AssociationMainModule)
    }
  ];

  beforeEach(async () => {
    loadChildrenSpy = jasmine.createSpy('loadChildrenSpy').and.returnValue(Promise.resolve(FakeAssociationMainModule));

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: '', loadChildren: loadChildrenSpy }
        ])
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
  });

  it('should load AssociationMainModule for the default route', fakeAsync(() => {
    router.navigate(['']);
    tick();
    expect(loadChildrenSpy).toHaveBeenCalled();
  }));
});
