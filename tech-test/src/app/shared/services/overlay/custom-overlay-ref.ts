import { Subject } from 'rxjs';
import { OverlayRef } from '@angular/cdk/overlay';
import { TemplateRef, Type } from '@angular/core';
import { DialogConfig } from './dialog-config.interface';

export interface OverlayCloseEvent<R> {
  type: 'backdropClick' | 'close';
  data: R | null;
}

// R = Response Data Type, T = Data passed to Modal Type
export class CustomOverlayRef<R = any, T = any> {

  public afterClosed$ = new Subject<OverlayCloseEvent<R>>();

  constructor(
    public overlay: OverlayRef,
    public content: string | TemplateRef<any> | Type<any>,
    public data?: T,
    public config?: Partial<DialogConfig>,
  ) {
    this.initBackdropClickIfNeeded();
  }

  private initBackdropClickIfNeeded(): void {
    if (this.config?.disposeOnBackDropClick) {
      this.overlay.backdropClick().subscribe(() => {
        this._close('backdropClick', null);
      });
    }
  }

  public close(data: R | null): void {
    this._close('close', data);
  }

  private _close(type: 'backdropClick' | 'close', data: R | null) {
    this.overlay.dispose();
    this.afterClosed$.next({
      type,
      data,
    });

    this.afterClosed$.complete();
  }
}
