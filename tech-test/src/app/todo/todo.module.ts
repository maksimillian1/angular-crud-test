import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {
  DeleteItemConfirmationDialogComponent
} from './components/delete-item-confirmation-dialog/delete-item-confirmation-dialog.component';
import { TodoListComponent } from './containers/todo-list/todo-list.component';
import { SharedModule } from '../shared/shared.module';
import { TodoFormComponent } from './components/todo-form/todo-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TodoFiltersComponent } from './components/todo-filters/todo-filters.component';
import { TodoItemComponent } from './components/todo-item/todo-item.component';

const ROUTES: Routes = [
  {
    path: '',
    component: TodoListComponent,
  },
  {
    path: '**',
    redirectTo: '',
  }
];

@NgModule({
  declarations: [
    DeleteItemConfirmationDialogComponent,
    TodoListComponent,
    TodoFormComponent,
    TodoFiltersComponent,
    TodoItemComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class TodoModule {}
