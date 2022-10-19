import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { WizardFormService } from '@client/services/admin';

import { FieldI, FieldTypeE } from '@shared/interfaces';

@Component({
  selector: 'app-wizard-form-field-create',
  templateUrl: './wizard-form-field-create.component.html',
  styleUrls: ['./wizard-form-field-create.component.scss'],
})
export class WizardFormFieldCreateComponent implements OnInit {
  @Input()
  type: FieldTypeE | undefined;

  @Output()
  save = new EventEmitter<true>();

  @Output()
  discard = new EventEmitter<false>();

  field: FieldI | undefined;

  constructor(private readonly wizardFormService: WizardFormService) {}

  ngOnInit(): void {
    if (this.type) {
      this.field = {
        id: 'uuid',
        title: 'Passport',
        value: '',
        type: this.type,
        displayInTasks: true,
        required: true,

        canEditValidators: false,
        canEditRequired: false,

        formId: null,
        row: 0,
        column: 0,
      };
    }
  }

  // public setFieldChanges(): void {
  //   if (this.type) {
  //     this.wizardFormService.changeField(this.type);
  //   }
  // }

  onClickManageTranslations(): void {
    console.log('click manage translations');
  }
}
