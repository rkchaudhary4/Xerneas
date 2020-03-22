import { TestBed } from '@angular/core/testing';

import { ManageService } from './manage.service';

describe('ManageService', () => {
  let service: ManageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
