import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { TodoService } from '../../../core/services/todo.service';
import { ItemsViewType } from '../../../shared/enums/items-view-type.enum';
import { CustomOverlayService } from '../../../shared/services/overlay/custom-overlay.service';
import { preventScroll } from '../../../shared/helpers/scroll-control';
import { TodoFormComponent } from '../../components/todo-form/todo-form.component';
import { untilDestroyed } from '@ngneat/until-destroy';
import { TodoModel } from '../../../core/models/todo.model';
import {
  DeleteItemConfirmationDialogComponent
} from '../../components/delete-item-confirmation-dialog/delete-item-confirmation-dialog.component';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoListComponent implements OnInit {

  public mobileFilterOpen = false;
  public sortDropdownVisible = false;
  public viewType: ItemsViewType = ItemsViewType.LIST;
  public ItemsViewType = ItemsViewType;

  constructor(
    public todoService: TodoService,
    private overlay: CustomOverlayService,
    private cdr: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
    this.todoService.items$ = this.todoService.getTodos();
  }

  public toggleViewType(): void {
    this.viewType = this.viewType === ItemsViewType.LIST
      ? ItemsViewType.GRID
      : ItemsViewType.LIST;
  }

  public openEditDialog(todo: TodoModel): void {
    const scrollPosition = preventScroll();
    this.overlay.open(
      TodoFormComponent,
      { scrollPosition, todo },
      {panelClass: 'default-form-overlay'},
    )
      .afterClosed$
      .pipe(untilDestroyed(this))
      .subscribe(result => {
        if (result?.data?.todo) {
          this.todoService.items$ = this.todoService.getTodos();
          this.cdr.detectChanges();
        }
      });
  }

  public openDeleteDialog(todo: TodoModel): void {
    const scrollPosition = preventScroll();
    this.overlay.open(
      DeleteItemConfirmationDialogComponent,
      { scrollPosition, todo },
      {panelClass: 'default-form-overlay'},
    )
      .afterClosed$
      .pipe(untilDestroyed(this))
      .subscribe(result => {
        if (result) {
          this.todoService.items$ = this.todoService.getTodos();
          this.cdr.detectChanges();
        }
      });
  }
}
