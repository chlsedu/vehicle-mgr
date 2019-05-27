import { TestBed } from '@angular/core/testing';

import { ReuseTabService } from './reuse-tab.service';

describe('ReuseTabService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReuseTabService = TestBed.get(ReuseTabService);
    expect(service).toBeTruthy();
  });
});
