import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-todo-filters',
  templateUrl: './todo-filters.component.html',
  styleUrls: ['./todo-filters.component.scss']
})
export class TodoFiltersComponent implements OnInit {

  @Input() public mobileFilterOpen = false;
  @Output() public mobileFilterOpenChange = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

}
