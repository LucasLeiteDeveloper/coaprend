import { TestBed } from '@angular/core/testing';
import { HideOnScrollService } from './hide-on-scroll-service';

describe('HideOnScrollService', () => {
  let service: HideOnScrollService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HideOnScrollService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
