import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostCreatePage } from './create-post.page';

describe('PostCreatePage', () => {
  let component: PostCreatePage;
  let fixture: ComponentFixture<PostCreatePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PostCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
