import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { TodoService } from '../../../core/services/todo.service';
import { ItemsViewType } from '../../../shared/enums/items-view-type.enum';
import { CustomOverlayService } from '../../../shared/services/overlay/custom-overlay.service';
import { preventScroll } from '../../../shared/helpers/scroll-control';
import { TodoFormComponent } from '../../components/todo-form/todo-form.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TodoModel } from '../../../core/models/todo.model';
import {
  DeleteItemConfirmationDialogComponent
} from '../../components/delete-item-confirmation-dialog/delete-item-confirmation-dialog.component';
import { SelectionModel } from '@angular/cdk/collections';
import { DEFAULT_HTTP_ERROR_MESSAGE, SUCCESSFULLY_STATUS_CHANGED } from '../../../shared/constants/snackbar-messages';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, filter, skip } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@UntilDestroy()
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
  public categorySelectionModel = new SelectionModel<string>(true);
  public search = '';

  constructor(
    public todoService: TodoService,
    private overlay: CustomOverlayService,
    private cdr: ChangeDetectorRef,
    private toastrService: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  public ngOnInit(): void {
    this.parseQueryParams();

    this.fetchItems();

    this.todoService.refreshTrigger$
      .pipe(untilDestroyed(this))
      .subscribe(() => this.fetchItems());

    this.todoService.search$
      .pipe(skip(1), untilDestroyed(this), distinctUntilChanged(), debounceTime(500))
      .subscribe(value => {
        this.search = value;
        this.fetchItems();
      });
  }

  public toggleViewType(): void {
    this.viewType = this.viewType === ItemsViewType.LIST
      ? ItemsViewType.GRID
      : ItemsViewType.LIST;
  }

  public onCategorySelectionChange(): void {
    this.fetchItems();
  }

  public openEditDialog(todo: TodoModel): void {
    const scrollPosition = preventScroll();
    this.overlay.open(
      TodoFormComponent,
      { scrollPosition, todo },
      {panelClass: 'default-form-overlay'},
    )
      .afterClosed$
      .pipe(untilDestroyed(this), filter(result => result?.data?.todo))
      .subscribe(() => this.fetchItems());
  }

  public openDeleteDialog(todo: TodoModel): void {
    const scrollPosition = preventScroll();
    this.overlay.open(
      DeleteItemConfirmationDialogComponent,
      { scrollPosition, todo },
      {panelClass: 'default-form-overlay'},
    )
      .afterClosed$
      .pipe(untilDestroyed(this), filter(result => result?.data?.todo))
      .subscribe(() => this.fetchItems());
  }

  public onDoneClick(todo: TodoModel): void {
    this.todoService.updateTodo(todo.id, {
      ...todo,
      ...(todo.done ? {done: null} : {done: new Date().toISOString()}),
    })
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.toastrService.success(SUCCESSFULLY_STATUS_CHANGED);
          this.fetchItems();
        },
        error: (error: HttpErrorResponse) => {
          const errorMessage = error.status.toString().startsWith('4')
            ? error.message
            : DEFAULT_HTTP_ERROR_MESSAGE;

          this.toastrService.error(errorMessage);
        }
      });
  }

  private fetchItems(): void {
    let params = new HttpParams();

    this.categorySelectionModel.selected.forEach(category => {
      params = params.append('category', category);
    });

    if (this.search) {
      params = params.set('q', this.search);
    }

    this.router.navigateByUrl(`?${params.toString()}`);

    this.todoService.items$ = this.todoService.getTodos(params);
    this.cdr.detectChanges();
  }

  private parseQueryParams(): void {
    const {category, q} = this.route.snapshot.queryParams;

    if (category) {
      this.categorySelectionModel.select(category);
    }
    this.search = q;
  }

}
