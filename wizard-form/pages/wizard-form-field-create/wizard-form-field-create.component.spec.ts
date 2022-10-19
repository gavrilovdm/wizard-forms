import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WizardFormFieldCreateComponent } from './wizard-form-field-create.component';

describe('FilterComponent', () => {
  let component: WizardFormFieldCreateComponent;
  let fixture: ComponentFixture<WizardFormFieldCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WizardFormFieldCreateComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WizardFormFieldCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
