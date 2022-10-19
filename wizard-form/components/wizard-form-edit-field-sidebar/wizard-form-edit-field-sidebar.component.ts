import { Component, OnInit } from '@angular/core';

import { KenmoreOverlayRef } from '@client/services/shared';

import { SidebarI } from '@shared/interfaces';
import { SidebarComponent } from '@client/components/shared';

import { FieldI } from '@shared/interfaces';
import { slideInOut } from './wizard-form-edit-field-sidebar.animation';

@Component({
  selector: 'kenmore-wizard-form-edit-field-sidebar',
  templateUrl: './wizard-form-edit-field-sidebar.component.html',
  styleUrls: ['./wizard-form-edit-field-sidebar.component.scss'],
  animations: [slideInOut],
})
export class WizardFormEditFieldSidebarComponent extends SidebarComponent implements OnInit {
  public data: SidebarI<FieldI>;

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
      const data = this.ref.data as SidebarI<FieldI>;

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
