import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CustomOverlayService } from '../../../shared/services/overlay/custom-overlay.service';
import { preventScroll } from '../../../shared/helpers/scroll-control';
import { TodoFormComponent } from '../../../todo/components/todo-form/todo-form.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TodoService } from '../../services/todo.service';
import { ActivatedRoute } from '@angular/router';

@UntilDestroy()
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {

  public search = '';

  constructor(
    private overlay: CustomOverlayService,
    private todoService: TodoService,
    private route: ActivatedRoute,
  ) {}

  public ngOnInit(): void {
    this.search = this.route.snapshot.queryParams.q;
  }

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
          this.todoService.refreshTrigger$.next();
        }
      });
  }

  public onSearchChange(search: string): void {
    this.todoService.search$.next(search);
  }
}
