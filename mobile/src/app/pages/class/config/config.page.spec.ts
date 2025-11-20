import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigPage } from './config.page';

describe('ConfigPage', () => {
  let component: ConfigPage;
  let fixture: ComponentFixture<ConfigPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
