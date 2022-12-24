import { Pipe, PipeTransform } from '@angular/core';
import { findAndReceiveText } from '../helpers/static-dictionary';
import { LabelValueEntry } from '../helpers/label-value-map';

@Pipe({
  name: 'mapLabel',
})
export class MapLabelPipe implements PipeTransform {

  public transform(value: string, typeLabel: LabelValueEntry[], dashForMissing = true): string {
    const result = findAndReceiveText(typeLabel, value);

    if (!result) {
      console.error('Error in MapLabelPipe related with mapping');

      return dashForMissing ? '-' : '';
    }

    return result;
  }

}
