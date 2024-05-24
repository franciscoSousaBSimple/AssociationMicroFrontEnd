import { TestBed } from '@angular/core/testing';

import { ColaboratorServiceService } from './colaborator-service.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IColaborator } from '../model/IColaborator';
import { HttpErrorResponse } from '@angular/common/http';


describe('ColaboratorServiceService', () => {
  let service: ColaboratorServiceService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(ColaboratorServiceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

it('should retrieve colabs from the API via GET and return an Observable of IColaborator[]', () => {
  const dummyColabs: IColaborator[] = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com' }
  ];

  service.getColabs().subscribe(colabs => {
    expect(colabs.length).toBe(2);
    expect(colabs).toEqual(dummyColabs);
  });

  const request = httpMock.expectOne(`${service.urlGet}/api/Colaborator`);
  expect(request.request.method).toBe('GET');
  request.flush(dummyColabs);
});


it('should handle HTTP errors safely in getColabs method', () => {
  const errorResponse = new HttpErrorResponse({
    error: 'test error',
    status: 500, statusText: 'Server Error'
  });

  service.getColabs().subscribe(
    colabs => fail('should have failed with the 500 error'),
    error => {
      expect(error.status).toEqual(500);
      expect(error.statusText).toEqual('Server Error');
    }
  );

  const request = httpMock.expectOne(`${service.urlGet}/api/Colaborator`);
  request.flush('Something went wrong', errorResponse);
});


it('should throw and log an error message when an error occurs', () => {
  const errorResponse = new HttpErrorResponse({
    error: 'fatal error',
    status: 404, statusText: 'Not Found'
  });

  service.handleError(errorResponse).subscribe(
    response => fail('expected an error, not success'),
    error => {
      expect(error).toBe(errorResponse);
    }
  );
});



});
