import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateClassPage } from './create-class.page';

describe('CreateClassPage', () => {
  let component: CreateClassPage;
  let fixture: ComponentFixture<CreateClassPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateClassPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
