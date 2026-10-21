# cip68-222-minting

## Contract tests

`npm ci --ignore-scripts` installs the exact lockfile; `npm test` runs the tracked TypeScript contract cases with `tsx`. The scoped packages are hosted on GitHub Packages. Use existing authorized read access locally; PR Actions requests only built-in `contents: read` and `packages: read`. Package owners must grant this repository Actions read access to the three scoped packages if it is not already granted. Never put an operator token in workflow secrets or change dependency versions to bypass an unavailable archive.

The three GitHub tarball URLs were verified against the existing lockfile's unchanged SHA-512 values. Published `kora-labs-contract-testing` 0.0.7 requires `helios` 0.16.8-1, not the 0.16.8-2 required by the testing library's newer source. No compiler downgrade or archive reconstruction is involved.

All ten original approval/denial cases remain, with their expected outcomes unchanged. Cases run sequentially because they share mutable fixtures. The runner waits for completion and rejects failed or incomplete evaluation totals; the published harness otherwise only prints failures. No transaction is submitted and no live wallet credentials are needed.

### Known failures, not acceptance

The suite currently fails before contract evaluation because the published harness loads network parameters from a removed CloudFront hostname (`d1t0d7c2nekuk0.cloudfront.net`). A local diagnostic using the locked compiler's emulator parameters (not retained as a replacement baseline) exposed a second failure: the 0.0.7 harness attaches the mint redeemer to the last public-key input in `Test.build`, which throws `input isn't locked by a script`. These are real test-dependency gaps. No arbitrary parameter replacement, transaction-fixture distortion, harness copy, skipped cases, or fake passing gate is provided here. PR CI must stay red/unmerged until those upstream inputs/behaviors are correctly resolved; these tooling changes are not full contract acceptance.