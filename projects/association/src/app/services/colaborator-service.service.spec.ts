import { TestBed } from '@angular/core/testing';

import { ColaboratorServiceService } from './colaborator-service.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';


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

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
