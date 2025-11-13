import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
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

  it('should format posts correctly from API response', (done) => {
    const mockResponse = [
      {
        id: 1,
        title: 'Post de Teste',
        author: 'Gabriel',
        items: '[{"content":"Conteúdo de teste"}]',
        options: '["A","B","C"]',
        created_at: '2025-11-12T00:00:00Z'
      }
    ];

    apiServiceSpy.get.and.returnValue(of(mockResponse));

    service.getAll().subscribe((posts) => {
      expect(posts.length).toBe(1);
      expect(posts[0].title).toBe('Post de Teste');
      expect(posts[0].items[0].content).toBe('Conteúdo de teste');
      expect(Array.isArray(posts[0].options)).toBeTrue();
      done();
    });
  });

  it('should handle invalid JSON gracefully', (done) => {
    const mockResponse = [
      { id: 1, title: 'Falha JSON', items: 'invalid', options: 'invalid' }
    ];

    apiServiceSpy.get.and.returnValue(of(mockResponse));

    service.getAll().subscribe((posts) => {
      expect(posts[0].items[0].content).toContain('Erro ao carregar');
      expect(posts[0].options).toEqual([]);
      done();
    });
  });
});
