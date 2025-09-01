import { useEffect } from 'react';
import { db } from './db';

export function useVault<T>(state: T, setState: (s: T) => void) {
  useEffect(() => {
    db.appState.get('app').then((rec) => {
      if (rec) setState(rec.data as T);
    });
  }, [setState]);

  useEffect(() => {
    db.appState.put({ id: 'app', data: state });
  }, [state]);
}
