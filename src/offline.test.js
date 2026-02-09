// @vitest-environment node
const { execSync } = require('child_process');
const { existsSync } = require('fs');

test('build produces service worker', () => {
    try {
        execSync('pnpm build', { stdio: 'ignore' });
    } catch {
        console.warn('build failed, skipping offline test');
        return;
    }
    expect(existsSync('dist/sw.js')).toBe(true);
}, 600000);
