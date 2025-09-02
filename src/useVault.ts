import { useEffect } from 'react';
import type { VaultV1 } from './model';
import { saveVault, loadVault } from './vaultStore';

export function useVault(state: VaultV1, setState: (s: VaultV1) => void, passphrase: string | null) {
    useEffect(() => {
        if (!passphrase) return;
        loadVault(passphrase).then((v) => {
            if (v) setState(v);
        }).catch(() => {
            // ignore errors
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [passphrase]);

    useEffect(() => {
        if (!passphrase) return;
        saveVault(state, passphrase).catch(() => {
            // ignore errors
        });
    }, [state, passphrase]);
}
