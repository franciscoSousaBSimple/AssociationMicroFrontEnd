import { TestBed } from '@angular/core/testing';

import { AssociationServiceService } from './association-service.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

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

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
