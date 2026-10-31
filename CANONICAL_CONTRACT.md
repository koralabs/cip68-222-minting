# cip68-222-minting canonical contract

## Purpose and authority

I am the Helios source of the CIP-68 222 minting and editing validators. Changing either file changes a script hash and can strand or double-mint tokens, so both are in [`.enclave`](./.enclave).

## Invariants that must never be violated

1. `minting.helios` and `editing.helios` change only with operator approval. Enforced by the enclave itself.
2. A 222 token is minted only with its matching reference token, and only the owner can change the reference datum. I have not verified this against the source in this pass and no test pins it; the only tests are the Helios harness checks in `tests/`.

## Boundaries and known limits

There is no deploy plan, no pinned hash and no spec here. This repo may be retired; if so it should be archived rather than enclaved forever.

## Refactors needed to enforce this

- Add tests that pin the compiled hashes and the mint-with-reference rule, or archive the repo.
## Authority and limits that apply to everything here

- Higher-risk and operator-approved only: any edit to an on-chain validator or to settings (settings handles, policy roots, `pers*@handle_settings` and handlecontract datums), anything that could double-mint, and any automated burn.
- I may sign for preview only. Preprod and mainnet always need humans on the multisig. Nothing in this repo authorises secret access, signing or spending by an agent.
- The `.enclave` lists only the on-chain source and these two files. It is path-only: a test-only change inside a listed file still asks for approval.
