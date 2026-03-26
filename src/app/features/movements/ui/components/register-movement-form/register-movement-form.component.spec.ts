import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RegisterMovementFormComponent } from './register-movement-form.component';

describe('RegisterMovementFormComponent', () => {
  let component: RegisterMovementFormComponent;
  let fixture: ComponentFixture<RegisterMovementFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RegisterMovementFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterMovementFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
