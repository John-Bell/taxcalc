import { useEffect, useRef } from 'react';
import type { VaultV1 } from './model';
import { saveVault, exportEnvelope, importEnvelope } from './vaultStore';

interface Props {
    state: VaultV1;
    setState: (v: VaultV1) => void;
    passphrase: string | null;
}

export function BackupPanel({ state, setState, passphrase }: Props) {
    const importRef = useRef<HTMLInputElement>(null);
    const verifyRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        navigator.storage?.persist().then((granted) => {
            console.log('Persistence', granted ? 'granted' : 'not granted');
        });
    }, []);

    const exportBackup = async () => {
        if (!passphrase) {
            alert('No passphrase set');
            return;
        }
        await saveVault(state, passphrase);
        const envelope = await exportEnvelope();
        if (!envelope) return;
        const blob = new Blob([envelope], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'retirement.enc';
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleFiles = async (file: File | null, verifyOnly = false) => {
        if (!file) return;
        const buf = await file.arrayBuffer();
        if (!passphrase) {
            alert('No passphrase set');
            return;
        }
        try {
            const data = await importEnvelope(buf, passphrase, verifyOnly);
            if (verifyOnly) {
                alert('Backup verified successfully');
            } else {
                setState(data);
                alert('Backup imported');
            }
        } catch {
            alert('Decryption failed');
        }
    };

    return (
        <div className="mt-8 space-x-4">
            <button onClick={exportBackup}>Export Backup</button>
            <button onClick={() => importRef.current?.click()}>Import Backup</button>
            <button onClick={() => verifyRef.current?.click()}>Verify Backup</button>
            <input
                type="file"
                accept=".enc"
                ref={importRef}
                style={{ display: 'none' }}
                onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    e.target.value = '';
                    handleFiles(file, false);
                }}
            />
            <input
                type="file"
                accept=".enc"
                ref={verifyRef}
                style={{ display: 'none' }}
                onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    e.target.value = '';
                    handleFiles(file, true);
                }}
            />
        </div>
    );
}
