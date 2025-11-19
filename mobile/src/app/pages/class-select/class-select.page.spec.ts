import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClassSelectPage } from './class-select.page';

describe('ClassSelectPage', () => {
  let component: ClassSelectPage;
  let fixture: ComponentFixture<ClassSelectPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassSelectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
