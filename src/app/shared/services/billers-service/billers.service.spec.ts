import { TestBed } from '@angular/core/testing';

import { BillersService } from './billers.service';

describe('BillersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BillersService = TestBed.get(BillersService);
    expect(service).toBeTruthy();
  });
});
