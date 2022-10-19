import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WizardFormsComponent } from './wizard-forms.component';

describe('FilterComponent', () => {
  let component: WizardFormsComponent;
  let fixture: ComponentFixture<WizardFormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WizardFormsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WizardFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
