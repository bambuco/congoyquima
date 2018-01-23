/** @hidden */
export function isTrueProperty(val: any): boolean {
  if (typeof val === 'string') {
    val = val.toLowerCase().trim();
    return (val === 'true' || val === 'on' || val === '');
  }
  return !!val;
}

/** @hidden */
export function reorderArray(array: any[], indexes: {from: number, to: number}): any[] {
  const element = array[indexes.from];
  array.splice(indexes.from, 1);
  array.splice(indexes.to, 0, element);
  return array;
}
