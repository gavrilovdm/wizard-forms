import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WizardFormFieldEditComponent } from './wizard-form-field-edit.component';

describe('FilterComponent', () => {
  let component: WizardFormFieldEditComponent;
  let fixture: ComponentFixture<WizardFormFieldEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WizardFormFieldEditComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WizardFormFieldEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
