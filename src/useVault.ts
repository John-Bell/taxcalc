import { useEffect, useRef } from 'react';
import { createEmptyVault, type VaultV1 } from './model';
import { saveVault, loadVault } from './vaultStore';

export function useVault(state: VaultV1, setState: (s: VaultV1) => void, passphrase: string | null) {
    const readyRef = useRef(false);
    const lastPersistedRef = useRef<string | null>(null);
    const saveTokenRef = useRef(0);
    const passphraseRef = useRef<string | null>(null);

    useEffect(() => {
        passphraseRef.current = passphrase;
        readyRef.current = false;
        saveTokenRef.current += 1;
        const applySnapshot = (snapshot: VaultV1) => {
            setState(snapshot);
            lastPersistedRef.current = JSON.stringify(snapshot);
        };

        if (!passphrase) {
            applySnapshot(createEmptyVault());
            return;
        }

        let cancelled = false;
        loadVault(passphrase).then((v) => {
            if (cancelled) return;
            applySnapshot(v ?? createEmptyVault());
            readyRef.current = true;
        }).catch(() => {
            if (cancelled) return;
            applySnapshot(createEmptyVault());
            readyRef.current = true;
        });
        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [passphrase]);

    useEffect(() => {
        if (!readyRef.current) return;
        const pass = passphraseRef.current;
        if (!pass) return;
        const serialized = JSON.stringify(state);
        if (serialized === lastPersistedRef.current) return;
        const token = saveTokenRef.current + 1;
        saveTokenRef.current = token;
        saveVault(state, pass).then(() => {
            if (saveTokenRef.current === token) {
                lastPersistedRef.current = serialized;
            }
        }).catch(() => {
            // ignore errors
        });
    }, [state]);
}
