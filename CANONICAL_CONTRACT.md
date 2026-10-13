# cip68-222-minting canonical contract

**Status: proposal (ecosystem-ownership-plan row 5.3). Operator review pending.**

Legacy Helios CIP-68 222 minting/editing contracts. The code that holds the rules below is listed in [`.enclave`](./.enclave);
K.O.R.A.'s `merge_pr` asks the operator before a change to it merges into `master`.

## Source requirements

- Ecosystem `AGENTS.md` (koralabs root): "Critical Correctness" (addresses 100% correct, never
  double-mint, chain-accurate properties) and "Merging" (double-mint, contract/settings edits and
  automated burns need operator approval).
- kora-bot `v3/docs/ecosystem-ownership-plan.md` §6 decision 2 (enclave = key/security material,
  prompt files, and the files that define, support or enforce this contract) and Phase 5 row 5.3
  ("every remaining repo, even if the enclave is empty; each AGENTS.md points at both").
- kora-bot `v3/docs/tool-surface.md` (`merge_pr`): cards enclave paths merged into
  `master`/`main`/`mainnet`/`preprod`, reading a root `.enclave`.

## Must never be violated

1. **Validator source changes need operator approval**: they change script hashes and can strand or double-mint tokens. K.O.R.A. may sign preview only.

## Where it is enforced today

| # | Code |
|---|---|
| 1 | `minting.helios`, `editing.helios` |

## Refactor needed for enforcement

- No tests, no deploy plan. If this is retired, archive the repo rather than enclave it forever.
