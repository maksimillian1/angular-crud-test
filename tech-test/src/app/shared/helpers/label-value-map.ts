export interface LabelValueEntry {
  label: string;
  value?: string;
  styleOverride?: string;
}

export const buildLabelValueMap = (texts: any, values: any): LabelValueEntry[] => {
  return Object
    .keys(texts)
    .map(item => ({ label: texts[item], value: values[item] }));
};
