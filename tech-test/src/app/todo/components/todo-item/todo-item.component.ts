import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { TodoCategory, TodoCategoryLabel, TodoModel } from '../../../core/models/todo.model';
import { buildLabelValueMap } from '../../../shared/helpers/label-value-map';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoItemComponent {

  @Input() public type: 'line' | 'card';
  @Input() public item: TodoModel;

  @Output() public doneClicked = new EventEmitter<void>();
  @Output() public editClicked = new EventEmitter<void>();
  @Output() public deleteClicked = new EventEmitter<void>();
  public categories = buildLabelValueMap(TodoCategoryLabel, TodoCategory);

}
