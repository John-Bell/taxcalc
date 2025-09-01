import { useEffect, useRef } from 'react';
import { encryptState, decryptState, EncryptedPayload } from './crypto';
import { useVault } from './useVault';


interface ControlsProps<T> {
  state: T;
  setState: (s: T) => void;
}

export function VaultControls<T>({ state, setState }: ControlsProps<T>) {
  useVault(state, setState);
  const importRef = useRef<HTMLInputElement>(null);
  const verifyRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    navigator.storage?.persist().then((granted) => {
      console.log('Persistence', granted ? 'granted' : 'not granted');
    });
  }, []);

  const exportBackup = async () => {
    const pass = prompt('Enter a passphrase to encrypt backup');
    if (!pass) return;
    const payload = await encryptState(state, pass);
    const blob = new Blob([JSON.stringify(payload)], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backup.enc';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFiles = async (file: File | null, verifyOnly = false) => {
    if (!file) return;
    const text = await file.text();
    let payload: EncryptedPayload;
    try {
      payload = JSON.parse(text);
    } catch {
      alert('Invalid file');
      return;
    }
    const pass = prompt('Enter passphrase');
    if (!pass) return;
    try {
      const data = await decryptState(payload, pass);
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
