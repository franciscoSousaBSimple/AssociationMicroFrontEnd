import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProjectServiceService } from './project-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { IProject } from '../model/IProject';

describe('ProjectServiceService', () => {
  let service: ProjectServiceService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(ProjectServiceService);
    httpMock = TestBed.inject(HttpTestingController);

  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve projects from the API via GET and return an Observable of IProject[]', () => {
    const dummyProjects: IProject[] = [
      { id: 1, name: 'Project 1', startDate: "2024-05-05", endDate: "2024-05-10"},
      { id: 2, name: 'Project 2', startDate: "2024-05-06", endDate: "2024-05-11" }
    ];
  
    service.getProjects().subscribe(projects => {
      expect(projects.length).toBe(2);
      expect(projects).toEqual(dummyProjects);
    });
  
    const request = httpMock.expectOne(`${service.urlGet}/api/Project`);
    expect(request.request.method).toBe('GET');
    request.flush(dummyProjects);
  });

  it('should handle HTTP errors safely', () => {
    const errorResponse = new HttpErrorResponse({
      error: 'test 404 error',
      status: 404, statusText: 'Not Found'
    });

    service.getProjects().subscribe(
      projects => fail('should have failed with the 404 error'),
      error => {
        expect(error.status).toEqual(404);
        expect(error.statusText).toEqual('Not Found');
      }
    );

    const request = httpMock.expectOne(`${service.urlGet}/api/Project`);
    request.flush('Something went wrong', errorResponse);
  });

  it('should throw an error message with the right format', () => {
    const errorResponse = new HttpErrorResponse({
      error: 'test error',
      status: 500, statusText: 'Server Error'
    });
  
    service.handleError(errorResponse).subscribe(
      response => fail('expected an error, not projects'),
      error => {
        expect(error).toBe(errorResponse);
      }
    );
  
    // Você pode precisar espionar o console.log se ainda não estiver fazendo isso
  });

});
