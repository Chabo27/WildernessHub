import { TestBed } from '@angular/core/testing';

import { AdminPurchaseService } from './admin-purchase.service';

describe('AdminPurchaseService', () => {
  let service: AdminPurchaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminPurchaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
