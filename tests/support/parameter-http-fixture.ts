import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { mock } from 'node:test';

const body = readFileSync(new URL('./network-parameters.json', import.meta.url), 'utf8');

// Static wire data from the already locked Helios 0.16.8-1 emulator baseline.
// This is not a recovered recording of the deleted mainnet endpoint or current-chain data.
export async function withParameterHttpFixture<T>(run: () => Promise<T>, responseBody = body): Promise<T> {
    const replacement = mock.method(globalThis, 'fetch', async (input: Parameters<typeof fetch>[0], init?: Parameters<typeof fetch>[1]) => {
        assert.equal(String(input), 'https://d1t0d7c2nekuk0.cloudfront.net/mainnet.json');
        assert.equal(init?.method ?? 'GET', 'GET');
        assert.equal(init?.body, undefined);
        return new Response(responseBody, { status: 200, headers: { 'Content-Type': 'application/json' } });
    });
    try {
        return await run();
    } finally {
        replacement.mock.restore();
    }
}
