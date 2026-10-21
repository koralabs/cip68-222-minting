import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import * as helios from '@koralabs/helios';
import { Fixture, Test } from '@koralabs/kora-labs-contract-testing';

// These tests exercise the real published Test.build with the unchanged tracked
// programs. No evaluator, Test method, compiler, transaction input or redeemer is mocked.
const minting = helios.Program.new(readFileSync(new URL('../minting.helios', import.meta.url), 'utf8'));
minting.parameters.SETTINGS_HANDLE_NAME = 'settings';
const mintingHash = minting.compile(true).mintingPolicyHash;
const editing = helios.Program.new(readFileSync(new URL('../editing.helios', import.meta.url), 'utf8'));
editing.parameters.SETTINGS_HANDLE_NAME = 'settings';
editing.parameters.MINTING_POLICY_ID = mintingHash.hex;
const scriptAddress = helios.Address.fromHash(editing.compile(true).validatorHash);
const walletAddress = helios.Address.fromHash(new helios.PubKeyHash('11'.repeat(28)));
const redeemer = helios.UplcData.fromCbor('d8799fff');

function input(index: number, address: helios.Address) {
    return new helios.TxInput(new helios.TxOutputId(`${'00'.repeat(32)}#${index}`),
        new helios.TxOutput(address, new helios.Value(10000000n),
            address.validatorHash ? helios.Datum.inline(new helios.IntData(42n)) : null));
}

test('mint-only fixture attaches the redeemer to minting, never a public-key input', async () => {
    const tx = await new Test(minting, hash => {
        const fixture = new Fixture(hash);
        fixture.inputs = [input(0, walletAddress)];
        fixture.minted = [['00', 1n]];
        fixture.redeemer = redeemer;
        return fixture;
    }, undefined, true).build();
    assert.equal(tx.body.inputs.length, 1);
    assert.equal(tx.witnesses.redeemers.length, 1);
    assert(tx.witnesses.redeemers[0] instanceof helios.MintingRedeemer);
    assert.deepEqual(tx.witnesses.redeemers[0].data.toCbor(), redeemer.toCbor());
});

test('spending fixture attaches its redeemer to the script input even when a public-key input follows it', async () => {
    const tx = await new Test(editing, hash => {
        const fixture = new Fixture(hash);
        fixture.inputs = [input(0, scriptAddress), input(1, walletAddress)];
        fixture.redeemer = redeemer;
        return fixture;
    }, undefined, true).build();
    assert.equal(tx.body.inputs.length, 2);
    assert.equal(tx.witnesses.redeemers.length, 1);
    assert(tx.witnesses.redeemers[0] instanceof helios.SpendingRedeemer);
    assert.deepEqual(tx.witnesses.redeemers[0].data.toCbor(), redeemer.toCbor());
});

test('public-key-only fixtures do not invent a spending redeemer', async () => {
    const tx = await new Test(minting, hash => {
        const fixture = new Fixture(hash);
        fixture.inputs = [input(0, walletAddress)];
        return fixture;
    }, undefined, true).build();
    assert.equal(tx.body.inputs.length, 1);
    assert.equal(tx.witnesses.redeemers.length, 0);
});

test('script inputs missing a redeemer remain rejected by the real compiler transaction API', async () => {
    await assert.rejects(new Test(editing, hash => {
        const fixture = new Fixture(hash);
        fixture.inputs = [input(0, scriptAddress)];
        return fixture;
    }, undefined, true).build(), /input is locked by a script, but redeemer isn't specified/);
});
