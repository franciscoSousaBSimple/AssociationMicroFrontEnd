import { TestBed } from '@angular/core/testing';

import { AssociationServiceService } from './association-service.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IAssociation } from '../model/IAssociation';
import { HttpErrorResponse } from '@angular/common/http';

describe('AssociationServiceService', () => {
  let service: AssociationServiceService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({      
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(AssociationServiceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve associations from the API via GET', () => {
    const dummyAssociations: IAssociation[] = [
      {  id: 1, colaboratorId: 1, projectId: 1, startDate: "2024-05-05", endDate: "2024-05-10" },
      {  id: 2, colaboratorId: 2, projectId: 2, startDate: "2024-05-06", endDate: "2024-05-09" }
    ];
  
    service.getAssociations().subscribe(associations => {
      expect(associations.length).toBe(2);
      expect(associations).toEqual(dummyAssociations);
    });
  
    const req = httpMock.expectOne(`${service.urlGet}/api/Association`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyAssociations);
  });
  
  
  it('should post the association data to the server', () => {
    const newAssociation: IAssociation = { id: 3, colaboratorId: 3, projectId: 3, startDate: "2024-05-05", endDate: "2024-05-10" };
  
    service.addAssociation(newAssociation).subscribe(association => {
      expect(association).toEqual(newAssociation);
    });
  
    const req = httpMock.expectOne(`${service.urlPost}/api/Association`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newAssociation);
    req.flush(newAssociation);
  });
  
  
  it('should update the association data on the server', () => {
    const updatedAssociation: IAssociation = {  id: 3, colaboratorId: 1, projectId: 1, startDate: "2024-05-06", endDate: "2024-05-10" };
  
    service.editAssociation(updatedAssociation).subscribe(association => {
      expect(association).toEqual(updatedAssociation);
    });
  
    const req = httpMock.expectOne(`${service.urlPost}/api/Association/${updatedAssociation.id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedAssociation);
    req.flush(updatedAssociation);
  });
  
  
  it('should handle errors correctly', () => {
    const errorResponse = new HttpErrorResponse({
      error: 'test 404 error',
      status: 404, statusText: 'Not Found'
    });
  
    service.getAssociations().subscribe(
      response => fail('expected an error, not associations'),
      error => {
        expect(error.status).toEqual(404);
        expect(error.statusText).toEqual('Not Found');
      }
    );
  
    const req = httpMock.expectOne(`${service.urlGet}/api/Association`);
    req.flush('test error', errorResponse);
  
  });
});
