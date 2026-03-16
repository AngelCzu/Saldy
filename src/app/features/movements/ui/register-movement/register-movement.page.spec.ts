import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterMovementPage } from './register-movement.page';

describe('RegisterMovementPage', () => {
  let component: RegisterMovementPage;
  let fixture: ComponentFixture<RegisterMovementPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterMovementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
