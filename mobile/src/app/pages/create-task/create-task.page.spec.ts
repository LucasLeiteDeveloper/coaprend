import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateTaskPage } from './create-task.page';

describe('CreateTaskPage', () => {
  let component: CreateTaskPage;
  let fixture: ComponentFixture<CreateTaskPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTaskPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
