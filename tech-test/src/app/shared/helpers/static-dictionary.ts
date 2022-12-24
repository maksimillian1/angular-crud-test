import { LabelValueEntry } from './label-value-map';

function findAndReceiveText(arr: LabelValueEntry[], value: string): string | undefined {
  return arr && arr.find(item => item.value === value)?.label;
}

export { findAndReceiveText };
