import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wizard-forms',
  templateUrl: './wizard-forms.component.html',
  styleUrls: ['./wizard-forms.component.scss'],
})
export class WizardFormsComponent {
  public data = [
    {
      id: '1',
    },
    {
      id: '2',
    },
  ];

  constructor(private router: Router) {}

  openForm(id: string): void {
    void this.router.navigate(['app', 'wizard-forms', id]);
  }
}
