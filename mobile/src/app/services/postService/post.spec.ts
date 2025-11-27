import { TestBed } from '@angular/core/testing';
import { PostService } from './post';
import { ApiService } from '../apiService/api-service';

describe('PostService', () => {
  let service: PostService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ApiService', ['get', 'post', 'put', 'delete']);

    TestBed.configureTestingModule({
      providers: [
        PostService,
        { provide: ApiService, useValue: spy }
      ]
    });

    service = TestBed.inject(PostService);
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
})