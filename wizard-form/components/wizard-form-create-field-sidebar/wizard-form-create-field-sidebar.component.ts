import { Component, OnInit } from '@angular/core';

import { KenmoreOverlayRef } from '@client/services/shared';

import { SidebarI } from '@shared/interfaces';
import { SidebarComponent } from '@client/components/shared';

import { FieldTypeE } from '@shared/interfaces';

@Component({
  selector: 'kenmore-wizard-form-create-field-sidebar',
  templateUrl: './wizard-form-create-field-sidebar.component.html',
  styleUrls: ['./wizard-form-create-field-sidebar.component.scss'],
})
export class WizardFormCreateFieldSidebarComponent extends SidebarComponent implements OnInit {
  public data: SidebarI<FieldTypeE>;

  constructor(ref: KenmoreOverlayRef) {
    super(ref);

    this.data = {
      id: '',
      sidebarData: undefined,
    };
  }

  ngOnInit(): void {
    console.log(this.ref.data);
    if (this.ref.data) {
      const data = this.ref.data as SidebarI<FieldTypeE>;

      if (data.id) {
        this.data.id = data.id;
      }

      if (data.sidebarData) {
        this.data.sidebarData = data.sidebarData;
      }

      console.log(this.data);
    }
  }

  close(value: boolean): void {
    super.close(value);
  }
}
