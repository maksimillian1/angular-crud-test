import { Component } from '@angular/core';
import { CustomOverlayService } from '../../../shared/services/overlay/custom-overlay.service';
import { preventScroll } from '../../../shared/helpers/scroll-control';
import { TodoFormComponent } from '../../../todo/components/todo-form/todo-form.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TodoService } from '../../services/todo.service';

@UntilDestroy()
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(
    private overlay: CustomOverlayService,
    private todoService: TodoService,
  ) {}

  public openCreationDialog(): void {
    const scrollPosition = preventScroll();
    this.overlay.open(
      TodoFormComponent,
      { scrollPosition },
      {panelClass: 'default-form-overlay'},
    )
      .afterClosed$
      .pipe(untilDestroyed(this))
      .subscribe(result => {
        if (result) {
          this.todoService.items$ = this.todoService.getTodos();
        }
      });
  }

}
