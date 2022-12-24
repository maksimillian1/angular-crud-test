import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { CustomOverlayRef } from '../../../shared/services/overlay/custom-overlay-ref';
import { enableScroll } from '../../../shared/helpers/scroll-control';
import { TodoModel } from '../../../core/models/todo.model';
import { TodoService } from '../../../core/services/todo.service';
import { HttpErrorResponse } from '@angular/common/http';
import {
  DEFAULT_HTTP_ERROR_MESSAGE,
  SUCCESSFULLY_CREATED,
  SUCCESSFULLY_UPDATED
} from '../../../shared/constants/snackbar-messages';

@UntilDestroy()
@Component({
  selector: 'app-todo-form',
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.scss']
})
export class TodoFormComponent implements OnInit, OnDestroy {

  public todoForm: FormGroup;
  public todo?: TodoModel;

  constructor(
    private overlayRef: CustomOverlayRef<{todo?: TodoModel}, {scrollPosition: number, todo?: TodoModel}>,
    private todoService: TodoService,
    private fb: FormBuilder,
    private toastrService: ToastrService,
  ) {}

  public ngOnInit(): void {
    this.todo = this.overlayRef.data?.todo;

    this.initForm();

    if (this.todo) {
      this.patchFormData();
    }
  }

  public ngOnDestroy() {
    enableScroll(this.overlayRef.data?.scrollPosition);
  }

  public submit(): void {
    if (this.todoForm.invalid) {
      return this.todoForm.markAllAsTouched();
    }

    const payload = this.todoForm.getRawValue();

    const submitAction$ = this.todo
      ? this.todoService.updateTodo(this.todo.id, payload)
      : this.todoService.createTodo(payload);

    submitAction$
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (todo) => {
          const resultMessage = this.todo ? SUCCESSFULLY_UPDATED : SUCCESSFULLY_CREATED;
          this.toastrService.success(resultMessage);
          this.overlayRef.close({todo});
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

  private initForm(): void {
    this.todoForm = this.fb.group({
      label: ['', Validators.required],
      category: ['', Validators.required],
      description: [],
    });
  }

  private patchFormData(): void {
    this.todoForm.patchValue(this.todo);
  }

}
