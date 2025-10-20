import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TfaPage } from './tfa.page';

describe('TfaPage', () => {
  let component: TfaPage;
  let fixture: ComponentFixture<TfaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TfaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
