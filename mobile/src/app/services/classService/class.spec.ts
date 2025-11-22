import { TestBed } from '@angular/core/testing';

import { ClassService } from './class';

describe('Class', () => {
  let service: ClassService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClassService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
