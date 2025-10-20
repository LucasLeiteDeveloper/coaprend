import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClassPage } from './class.page';

describe('ClassPage', () => {
  let component: ClassPage;
  let fixture: ComponentFixture<ClassPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
