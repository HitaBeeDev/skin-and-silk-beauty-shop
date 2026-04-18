import { useEffect, useState } from 'react';

function getInitialValue<T>(key: string, initialValue: T): T {
  if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
    return initialValue;
  }

  try {
    const storedValue = window.localStorage.getItem(key);

    if (storedValue === null) return initialValue;

    return JSON.parse(storedValue) as T;
  } catch {
    return initialValue;
  }
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(() => getInitialValue(key, initialValue));

  useEffect(() => {
    setValue(getInitialValue(key, initialValue));
  }, [initialValue, key]);

  function updateValue(nextValue: T): void {
    setValue(nextValue);

    if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
      return;
    }

    try {
      window.localStorage.setItem(key, JSON.stringify(nextValue));
    } catch {
      // Ignore storage write failures and keep in-memory state in sync.
    }
  }

  return [value, updateValue];
}

export default useLocalStorage;
