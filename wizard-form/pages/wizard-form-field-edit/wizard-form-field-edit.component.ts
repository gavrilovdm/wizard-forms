import { Component, EventEmitter, Input, Output } from '@angular/core';

import { WizardFormService } from '@client/services/admin';

import { FieldI } from '@shared/interfaces';

@Component({
  selector: 'app-wizard-form-field-edit',
  templateUrl: './wizard-form-field-edit.component.html',
  styleUrls: ['./wizard-form-field-edit.component.scss'],
})
export class WizardFormFieldEditComponent {
  @Input()
  field: FieldI | undefined;

  @Output()
  save = new EventEmitter<true>();

  @Output()
  discard = new EventEmitter<false>();

  constructor(private readonly wizardFormService: WizardFormService) {}

  public setFieldChanges(): void {
    if (this.field) {
      this.wizardFormService.changeField(this.field);
    }
  }

  onClickManageTranslations(): void {
    console.log('click manage translations');
  }
}
