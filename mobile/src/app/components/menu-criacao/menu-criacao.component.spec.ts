import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MenuCriacaoComponent } from './menu-criacao.component';

describe('MenuCriacaoComponent', () => {
  let component: MenuCriacaoComponent;
  let fixture: ComponentFixture<MenuCriacaoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MenuCriacaoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuCriacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
