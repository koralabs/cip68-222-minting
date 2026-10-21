# cip68-222-minting

## Contract tests

`npm ci --ignore-scripts` installs the exact lockfile; `npm test` runs the parameter-boundary and harness regression tests, then the tracked TypeScript contract cases with `tsx`. `npm run test:contracts` runs those ten original cases directly. The scoped packages are hosted on GitHub Packages. Use existing authorized read access locally; PR Actions requests only built-in `contents: read` and `packages: read`. Package owners must grant this repository Actions read access to the three scoped packages if it is not already granted. Never put an operator token in workflow secrets or change dependency versions to bypass an unavailable archive.

The three GitHub tarball URLs were verified against the existing lockfile's unchanged SHA-512 values. Published `kora-labs-contract-testing` 0.0.7 requires `helios` 0.16.8-1, not the 0.16.8-2 required by the testing library's newer source. No compiler downgrade or archive reconstruction is involved.

All ten original approval/denial cases remain, with their expected outcomes unchanged. Cases run sequentially because they share mutable fixtures. The runner waits for completion and rejects failed or incomplete evaluation totals; the published harness otherwise only prints failures. No transaction is submitted and no live wallet credentials are needed.

### Known failures, not acceptance

The deleted parameter endpoint is now replaced only at the HTTP boundary with a static, unmodified snapshot of the locked compiler's documented offline unit-test baseline. The real harness still parses the response and evaluates transactions; complete cost-model/limit preservation and negative controls are tested. This is explicitly not a recording of the former endpoint or current-mainnet data. See [fixture provenance and acceptance limits](tests/support/README.md).

The 0.0.7 harness still attaches the mint redeemer to the last public-key input in `Test.build`, which throws `input isn't locked by a script`; it also fails when a spending script input is not last. The new real construction regressions reproduce both defects without patching the dependency or changing transaction/validator expectations. The public-key-only and missing-redeemer checks remain valid. No transaction-fixture distortion, harness copy, skipped cases, package migration or fake passing gate is provided. PR CI stays red/unmerged until the harness is correctly fixed and released upstream; these tooling changes are not full contract acceptance.