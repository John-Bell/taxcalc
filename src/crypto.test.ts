import { encrypt, decrypt } from './crypto';

interface Sample {
    foo: string;
}

test('encrypt/decrypt round-trip', async () => {
    const vault: Sample = { foo: 'bar' };
    const pass = 'secret';
    const env = await encrypt(vault, pass);
    const dec = await decrypt<Sample>(env, pass);
    expect(dec).toEqual(vault);
});

test('tamper detection', async () => {
    const vault: Sample = { foo: 'bar' };
    const pass = 'secret';
    const env = await encrypt(vault, pass);
    const arr = new Uint8Array(env);
    arr[arr.length - 1] ^= 1;
    await expect(decrypt<Sample>(arr.buffer, pass)).rejects.toThrow();
});
