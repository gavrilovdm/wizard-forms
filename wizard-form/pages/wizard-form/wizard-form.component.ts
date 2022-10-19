import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  Renderer2,
  ViewChildren,
} from '@angular/core';

import _ from 'lodash';

import {
  WizardFormCreateFieldSidebarComponent,
  WizardFormEditFieldSidebarComponent,
} from '@client/components/admin';
import {
  OverlayWizardFormCreateFieldSidebarService,
  OverlayWizardFormEditFieldSidebarService,
  WizardFormService,
} from '@client/services/admin';

import { SidebarI, FieldI, fields, sidebarFields, FieldTypeE } from '@shared/interfaces';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

interface AnyObjectI {
  [index: string]: string;
}

declare global {
  interface Array<T> {
    insert(
      index: number,
      object: AnyObjectI | AnyObjectI[] | AnyObjectI[][] | FieldI | FieldI[],
    ): Array<T>;
  }
}

Array.prototype.insert = function (
  index: number,
  object: AnyObjectI | AnyObjectI[] | AnyObjectI[][],
) {
  return this.splice(index, 0, object) as Array<[]>;
};

@Component({
  selector: 'app-wizard-form',
  templateUrl: './wizard-form.component.html',
  styleUrls: ['./wizard-form.component.scss'],
})
export class WizardFormComponent implements OnInit, AfterViewInit {
  public sidebarData = sidebarFields;

  public formData: FieldI[][] = [[]];

  private refData: SidebarI<FieldI | FieldTypeE> = {
    id: '',
    sidebarData: undefined,
  };

  public createView = false;

  public fieldTypeE = FieldTypeE;

  public isEdit = false;
  public editableField: FieldI | undefined;

  public isCreate = false;

  public wizardFormEditFieldSidebarComponent = WizardFormEditFieldSidebarComponent;
  public wizardFormCreateFieldSidebarComponent = WizardFormCreateFieldSidebarComponent;

  @ViewChildren('rowDrop')
  rowDrops!: QueryList<ElementRef<HTMLElement>>;

  @ViewChildren('columnDrop')
  columnDrops!: QueryList<ElementRef<HTMLElement>>;

  public isDraggingRow!: boolean;
  public draggingRowElement!: FieldI[] | null;

  public isDraggingColumn!: boolean;
  public draggingColumnElement!: FieldI | null;

  constructor(
    private overlayFieldEditService: OverlayWizardFormEditFieldSidebarService,
    private overlayFieldCreateService: OverlayWizardFormCreateFieldSidebarService,
    private readonly wizardFormService: WizardFormService,
    protected readonly renderer: Renderer2,
  ) {}

  ngOnInit(): void {
    this.convertResponseToData();
  }

  ngAfterViewInit(): void {
    this.wizardFormService.field$
      .pipe(debounceTime(250), distinctUntilChanged())
      .subscribe((field) => (this.editableField = field));

    // console.log(this.sidebarData);
    // console.log(this.formData);
  }

  private convertResponseToData(): void {
    let currentRow: number;

    for (const i of fields) {
      currentRow = i.row;

      if (!this.formData[currentRow]) {
        // @ts-ignore
        this.formData[currentRow] = [];
      }

      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      this.formData[i.row].push(i);
      // console.log(this.formData);
    }
  }

  public changeView(): void {
    this.createView = !this.createView;
  }

  public onDragEndRow(event: DragEvent): void {
    event.preventDefault();

    this.draggingColumnElement = null;
    this.draggingRowElement = null;
    this.isDraggingRow = false;
    this.isDraggingColumn = false;
    this.renderer.removeClass(event.target, 'dd-row_active');

    this.columnDrops.toArray().map((element) => {
      this.renderer.removeClass(element.nativeElement, 'hidden');
      this.renderer.removeClass(element.nativeElement, 'visible');
    });

    this.rowDrops.toArray().map((element) => {
      this.renderer.removeClass(element.nativeElement, 'hidden');
      this.renderer.removeClass(element.nativeElement, 'visible');
    });
  }

  public onDragLeaveRow(event: DragEvent): void {
    this.renderer.removeClass(event.target, 'dd-row_active');
  }

  public onDragOverRow(event: DragEvent): void {
    event.preventDefault();

    if (!(event.target as HTMLElement).classList.contains('dd-row_drag')) {
      this.renderer.addClass(event.target, 'dd-row_active');
    }
  }

  public onDropRow(event: DragEvent, index: number): void {
    event.preventDefault();

    this.isDraggingRow = false;
    this.isDraggingColumn = false;

    if (this.draggingColumnElement) {
      this.formData = this.formData
        .map((row) => row.filter((column) => column !== this.draggingColumnElement))
        .filter((row) => row.length);

      this.formData.insert(index, [this.draggingColumnElement]);

      if (this.sidebarData.includes(this.draggingColumnElement)) {
        this.sidebarData.splice(this.sidebarData.indexOf(this.draggingColumnElement), 1);
      }
    }

    if (this.draggingRowElement && !this.draggingColumnElement) {
      this.formData.splice(this.formData.indexOf(this.draggingRowElement), 1);
      if (index !== 0) {
        this.formData.insert(index - 1, this.draggingRowElement);
      } else {
        this.formData.insert(index, this.draggingRowElement);
      }
    }

    this.draggingRowElement = null;
    this.draggingColumnElement = null;
  }

  public onDragStartRow({ target }: DragEvent, row: FieldI[]): void {
    this.isDraggingRow = true;
    this.draggingRowElement = row;

    (target as HTMLElement).previousElementSibling?.classList.contains('dd-row_drop') &&
      this.renderer.addClass((target as HTMLElement).previousElementSibling, 'hidden');

    (target as HTMLElement).nextElementSibling?.classList.contains('dd-row_drop') &&
      this.renderer.addClass((target as HTMLElement).nextElementSibling, 'hidden');
  }

  public onDragEndColumn(event: DragEvent): void {
    event.preventDefault();

    this.isDraggingRow = false;
    this.isDraggingColumn = false;
    this.renderer.removeClass(event.target, 'dd-row_active');
    this.columnDrops
      .toArray()
      .map((element) => this.renderer.removeClass(element.nativeElement, 'hidden'));
  }

  public onDragLeaveColumn(event: DragEvent): void {
    this.renderer.removeClass(event.target, 'dd-column_active');
  }

  public onDragOverColumn(event: DragEvent): void {
    event.preventDefault();

    if (!(event.target as HTMLElement).classList.contains('dd-column_drag')) {
      this.renderer.addClass(event.target, 'dd-column_active');
    }
  }

  public onDragStartColumn({ target }: DragEvent, column: FieldI): void {
    this.isDraggingColumn = true;
    this.draggingColumnElement = column;

    Array.from((target as HTMLElement).parentNode?.parentNode?.children as HTMLCollection).map(
      (element) => {
        const fields = Array.from(element.children).filter((field) =>
          field.classList.contains('dd-column_drag'),
        );

        if (fields.length === 3 && fields[0]?.parentNode !== (target as HTMLElement).parentNode) {
          Array.from(fields[0]?.parentNode?.children as HTMLCollection)
            .filter((drop) => drop.classList.contains('dd-column_drop'))
            .map((drop) => this.renderer.addClass(drop, 'hidden'));
        }
      },
    );

    if (
      ((target as HTMLElement).parentNode as HTMLElement).classList.contains(
        'dd-row_all-unused-fields',
      )
    ) {
      [...new Set(this.columnDrops.toArray().map((element) => element.nativeElement.parentNode))]
        .filter(
          (element) =>
            Array.from(element?.children as HTMLCollection).filter((element) =>
              element.classList.contains('dd-column_drop'),
            ) && element?.children.length === 7,
        )
        .map((column) =>
          Array.from(column?.children as HTMLCollection).map(
            (element) =>
              element.classList.contains('dd-column_drop') &&
              this.renderer.addClass(element, 'hidden'),
          ),
        );
    }

    (target as HTMLElement).previousElementSibling?.classList.contains('dd-column_drop') &&
      this.renderer.addClass((target as HTMLElement).previousElementSibling, 'hidden');

    (target as HTMLElement).nextElementSibling?.classList.contains('dd-column_drop') &&
      this.renderer.addClass((target as HTMLElement).nextElementSibling, 'hidden');
  }

  public onDropColumn(event: DragEvent, row: FieldI[], index: number): void {
    event.preventDefault();

    this.columnDrops.toArray().map((element) => {
      this.renderer.removeClass(element.nativeElement, 'hidden');
      this.renderer.removeClass(element.nativeElement, 'visible');
    });

    if (this.draggingColumnElement && this.sidebarData.includes(this.draggingColumnElement)) {
      this.sidebarData.splice(this.sidebarData.indexOf(this.draggingColumnElement), 1);
    }

    this.formData = this.formData
      .map((i) => {
        if (i === row && this.draggingColumnElement) {
          if (i.includes(this.draggingColumnElement)) {
            i.splice(row.indexOf(this.draggingColumnElement), 1);
            i.insert(index, this.draggingColumnElement);
          } else {
            i.insert(index, this.draggingColumnElement);
          }
        }

        return i;
      })
      .map((i) => {
        if (this.draggingColumnElement) {
          if (i !== row && i.includes(this.draggingColumnElement)) {
            i.splice(i.indexOf(this.draggingColumnElement), 1);
          }
        }

        return i;
      })
      .filter((i) => i.length);

    this.isDraggingColumn = false;
    this.isDraggingRow = false;

    this.draggingRowElement = null;
    this.draggingColumnElement = null;

    this.renderer.removeClass(event.target, 'dd-column_active');
  }

  public onDragRemoveColumn(field: FieldI): void {
    this.formData = this.formData
      .map((row) => row.filter((column) => column !== field))
      .filter((row) => row.length);
    this.sidebarData.push(field);

    this.sidebarData = _.sortBy(this.sidebarData);
  }

  public onDragEditColumn(field: FieldI): void {
    this.refData.sidebarData = field;
    this.editableField = field;
    this.isEdit = true;
    const ref = this.overlayFieldEditService.open(
      this.wizardFormEditFieldSidebarComponent,
      this.refData,
    );

    ref.afterClosed$.subscribe((res) => {
      console.log(res);
      this.isEdit = false;
    });
  }

  public openCreateSidebar(type: FieldTypeE): void {
    this.refData.sidebarData = type;
    this.isCreate = true;
    const ref = this.overlayFieldCreateService.open(
      this.wizardFormCreateFieldSidebarComponent,
      this.refData,
    );

    ref.afterClosed$.subscribe((res) => {
      console.log(res);
      this.isEdit = false;
    });
  }
}
