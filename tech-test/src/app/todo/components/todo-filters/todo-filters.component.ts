import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { buildLabelValueMap } from '../../../shared/helpers/label-value-map';
import { TodoCategory, TodoCategoryLabel } from '../../../core/models/todo.model';

@Component({
  selector: 'app-todo-filters',
  templateUrl: './todo-filters.component.html',
  styleUrls: ['./todo-filters.component.scss']
})
export class TodoFiltersComponent implements OnInit {

  @Input() public categorySelectionModel: SelectionModel<string>;
  @Output() public categorySelectionChange = new EventEmitter<void>();

  @Input() public mobileFilterOpen = false;
  @Output() public mobileFilterOpenChange = new EventEmitter<boolean>();

  public categories = buildLabelValueMap(TodoCategoryLabel, TodoCategory);

  constructor() {}

  ngOnInit(): void {}

  public toggleCategory(category: string, event: Event): void {
    this.categorySelectionModel.toggle(category);
    this.categorySelectionChange.emit();
    event.preventDefault();
    event.stopPropagation();
  }

}
