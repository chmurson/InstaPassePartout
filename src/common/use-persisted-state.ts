import { useCallback, useState } from "react";

export function usePersistedState<T>(
  defaultValue: T,
  storageKey: string,
  converter?: {
    toString: (arg: T) => string;
    fromString: (arg: string) => T;
  },
): readonly [T, (arg: ((x: T) => T) | T) => void] {
  if (converter == null && typeof defaultValue !== "string") {
    throw new Error("If converted is skipped, value has to be of string type");
  }

  const [state, setState] = useState<T>(() => {
    const value = localStorage.getItem(storageKey);
    if (value) {
      try {
        return converter ? converter.fromString(value) : (value as T);
      } catch (e) {
        console.warn(e);
      }
    }
    return defaultValue;
  });

  const setPersistedState = useCallback(
    (arg: ((x: T) => T) | T) => {
      setState((prevState) => {
        const newValue = typeof arg === "function" ? (arg as (arg0: T) => T)(prevState) : arg;

        localStorage.setItem(storageKey, converter ? converter.toString(newValue) : (newValue as string));

        return newValue;
      });
    },
    [converter, storageKey],
  );

  return [state, setPersistedState] as const;
}
