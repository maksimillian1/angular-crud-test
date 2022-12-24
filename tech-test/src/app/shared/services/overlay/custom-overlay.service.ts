import { Injectable, Injector } from '@angular/core';
import { ComponentType, Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { DialogConfig } from './dialog-config.interface';
import { CustomOverlayRef } from './custom-overlay-ref';

@Injectable({
  providedIn: 'root',
})
export class CustomOverlayService {

  public static DEFAULT_CONFIG: DialogConfig = {
    hasBackdrop: true,
    backdropClass: 'dark-backdrop',
    panelClass: 'default-overlay',
    disposeOnNavigation: true,
    disposeOnBackDropClick: true,
  };

  public currentDialog: CustomOverlayRef | null = null;

  constructor(
    private overlay: Overlay,
    private injector: Injector,
  ) {}

  public open<R = any, T = any>(
    component: ComponentType<any>,
    data?: T,
    config?: Partial<DialogConfig>,
  ): CustomOverlayRef<R> {
    const dialogConfig = { ...CustomOverlayService.DEFAULT_CONFIG, ...config };
    const overlayRef = this.createOverlay(dialogConfig);

    const myOverlayRef = new CustomOverlayRef<R, T>(overlayRef, component, data, dialogConfig);
    const injector = this.createInjector(myOverlayRef, this.injector);

    overlayRef.attach(new ComponentPortal(component, null, injector));

    this.currentDialog = myOverlayRef;
    return myOverlayRef;
  }

  private createOverlay(config: DialogConfig): OverlayRef {
    const overlayConfig = this.getOverlayConfig(config);
    return this.overlay.create(overlayConfig);
  }

  private getOverlayConfig(config: DialogConfig): OverlayConfig {
    const positionStrategy = this.overlay.position()
      .global()
      .centerHorizontally()
      .centerVertically();

    return new OverlayConfig({
      hasBackdrop: config.hasBackdrop,
      backdropClass: config.backdropClass,
      panelClass: config.panelClass,
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy,
    });
  }

  private createInjector(ref: CustomOverlayRef, inj: Injector): Injector {
    return Injector.create({
      parent: inj,
      providers: [{ provide: CustomOverlayRef, useValue: ref }],
    });
  }

}
