import { TestBed } from '@angular/core/testing';

import { ActivationOtfService } from './activation-otf.service';

describe('ActivationOtfService', () => {
  let service: ActivationOtfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivationOtfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
