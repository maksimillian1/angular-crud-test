import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { HttpErrorResponse } from '@angular/common/http';

import { CustomOverlayRef } from '../../../shared/services/overlay/custom-overlay-ref';
import { TodoModel } from '../../../core/models/todo.model';
import { TodoService } from '../../../core/services/todo.service';
import { enableScroll } from '../../../shared/helpers/scroll-control';
import { DEFAULT_HTTP_ERROR_MESSAGE, SUCCESSFULLY_DELETED, } from '../../../shared/constants/snackbar-messages';

@UntilDestroy()
@Component({
  selector: 'app-delete-item-confirmation-dialog',
  templateUrl: './delete-item-confirmation-dialog.component.html',
  styleUrls: ['./delete-item-confirmation-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteItemConfirmationDialogComponent implements OnDestroy {

  constructor(
    public overlayRef: CustomOverlayRef<{todo?: TodoModel}, {scrollPosition: number, todo: TodoModel}>,
    private todoService: TodoService,
    private toastrService: ToastrService,
  ) {}

  public delete(): void {
    this.todoService.deleteTodo(this.overlayRef.data.todo.id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.toastrService.success(SUCCESSFULLY_DELETED);
          this.overlayRef.close({todo: this.overlayRef.data.todo});
        },
        error: (error: HttpErrorResponse) => {
          const errorMessage = error.status.toString().startsWith('4')
            ? error.message
            : DEFAULT_HTTP_ERROR_MESSAGE;

          this.toastrService.error(errorMessage);
        }
      });
  }

  public closeDialog(todo?: TodoModel) {
    this.overlayRef.close({todo});
  }

  public ngOnDestroy() {
    enableScroll(this.overlayRef.data?.scrollPosition);
  }

}
