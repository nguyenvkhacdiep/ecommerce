import { useState, useCallback } from 'react';
import { FormInstance } from 'antd/es/form';

function isValuesEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (typeof a !== 'object' || typeof b !== 'object' || !a || !b) return false;
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;

  for (const key of aKeys) {
    if (!isValuesEqual(a[key], b[key])) return false;
  }
  return true;
}

export function useFormChanged<T = any>(form: FormInstance<T>, initialValues: T) {
  const [isChanged, setIsChanged] = useState(false);

  const handleValuesChange = useCallback(() => {
    const currentValues = form.getFieldsValue();
    const changed = !isValuesEqual(initialValues, currentValues);
    setIsChanged(changed);
  }, [form, initialValues]);

  return { isChanged, handleValuesChange };
}
