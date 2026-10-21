import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import * as helios from '@koralabs/helios';
import { ContractTester } from '@koralabs/kora-labs-contract-testing';
import { withParameterHttpFixture } from './support/parameter-http-fixture.ts';

const address = helios.Address.fromHash(new helios.PubKeyHash('11'.repeat(28)));
function assertBaseline(tester: ContractTester) {
    assert.deepEqual(tester.networkParams.txFeeParams, [155381, 44]);
    assert.deepEqual(tester.networkParams.exFeeParams, [0.0577, 0.0000721]);
    assert.deepEqual(tester.networkParams.maxTxExecutionBudget, [14000000, 10000000000]);
    assert.equal(tester.networkParams.maxTxSize, 16384);
    assert.equal(tester.networkParams.lovelacePerUTXOByte, 4310);
    assert.equal(tester.networkParams.getCostModelParameter('cekApplyCost-exBudgetCPU'), 23000);
}

test('real harness HTTP initialization retains the pinned fee, budget and cost-model baseline', async () => {
    const originalFetch = globalThis.fetch;
    const tester = new ContractTester(address);
    await withParameterHttpFixture(() => tester.init());
    assertBaseline(tester);
    assert.deepEqual(tester.networkParams.raw, helios.rawNetworkEmulatorParams);
    assert.equal(globalThis.fetch, originalFetch);
});

test('an unexpected host is rejected instead of reaching the network', async () => {
    await assert.rejects(withParameterHttpFixture(() => fetch('https://unexpected.invalid/mainnet.json')), /AssertionError/);
});

test('malformed JSON fails in the real harness parser and restores fetch', async () => {
    const originalFetch = globalThis.fetch;
    const tester = new ContractTester(address);
    await assert.rejects(withParameterHttpFixture(() => tester.init(), '{malformed'), SyntaxError);
    assert.equal(globalThis.fetch, originalFetch);
});

test('negative control: a corrupted HTTP fee response fails the same baseline assertions', async () => {
    const raw = JSON.parse(readFileSync(new URL('./support/network-parameters.json', import.meta.url), 'utf8'));
    raw.latestParams.txFeeFixed = 0;
    const tester = new ContractTester(address);
    await withParameterHttpFixture(() => tester.init(), JSON.stringify(raw));
    assert.throws(() => assertBaseline(tester), /AssertionError/);
});

test('missing cost-model data remains a real evaluation failure, not a fixture fallback', async () => {
    const raw = JSON.parse(readFileSync(new URL('./support/network-parameters.json', import.meta.url), 'utf8'));
    delete raw.latestParams.costModels;
    const tester = new ContractTester(address);
    await withParameterHttpFixture(() => tester.init(), JSON.stringify(raw));
    assert.throws(() => tester.networkParams.getCostModelParameter('cekApplyCost-exBudgetCPU'), /undefined/);
});
