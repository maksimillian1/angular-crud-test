import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapLabelPipe } from './pipes/map-label.pipe';


@NgModule({
  declarations: [
    MapLabelPipe,
  ],
  exports: [
    MapLabelPipe
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
