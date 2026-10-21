# cip68-222-minting

## Contract tests

`npm ci --ignore-scripts` installs the exact lockfile; `npm test` runs five parameter-boundary tests, four real harness regressions, then ten original TypeScript contract cases with `tsx`. `npm run test:contracts` runs those ten cases directly. Scoped packages are hosted on GitHub Packages. Use existing authorized read access locally; PR Actions requests only built-in `contents: read` and `packages: read`. The testing-package owner must grant this repository Actions read access. Never put an operator token in workflow secrets or substitute a compiler to bypass an unavailable archive.

The consumer intentionally pins the corrected immutable `kora-labs-contract-testing` **0.0.10** maintenance release, registry gitHead `c6f4116f9a2be6b3f62c0a4f8596015d38c382fc`. Its archive bytes/SHA512, source identity and exact `helios` **0.16.8-1** dependency were independently verified before updating this lock. The compiler and every other locked dependency's version/integrity are unchanged. This is the reviewed maintenance line rooted at published 0.0.7; it is not recovery or acceptance of current upstream master's missing 0.16.8-2. The maintenance publication leaves upstream's latest tag at 0.0.9.

All ten original approval/denial cases remain with expected outcomes unchanged. Cases run sequentially because they share mutable fixtures. The runner waits for completion and rejects failed or incomplete totals; the published harness otherwise only prints failures. No transaction is submitted and no live wallet credentials are needed.

### Root corrections and acceptance boundary

The deleted parameter endpoint is replaced only at the HTTP boundary with a static, unmodified snapshot of the locked compiler's documented offline unit-test baseline. Real harness parsing/evaluation remains; complete cost-model/limit preservation and corruption controls are tested. This is not a recording of the former endpoint or current-mainnet data. See [fixture provenance and acceptance limits](tests/support/README.md). The separate datum-conversion HTTPS dependency remains live.

The published 0.0.7 harness chose spending redeemers by last-input position, rejecting mint-only public-key inputs and missing non-last script inputs. Release 0.0.10 corrects that root cause by selecting the actual script-lock credential. The four consumer regressions use real transactions/compiler and retain missing-redeemer rejection; no node_modules patch or harness fork is used.

After that fix, nine original cases exposed another stale test-input mismatch: fixture policy IDs and script addresses came from default unoptimized compilation, while `Test.build` always builds optimized scripts. Fixture preparation now explicitly compiles the same optimized scripts; tracked contract sources, compiler, harness compilation behavior, transaction amounts and all approval/denial assertions are unchanged. The previous input preparation is the negative control: nine cases fail, while the one already using an optimized hash passes. With matching script identities, all ten cases pass, including all three exact denial messages.

These tests establish the existing contract unit cases against an explicit pinned baseline, not current-mainnet parameter accuracy, chain submission, exhaustive validator safety or live-chain acceptance. No new browser/e2e journey is run in Actions.
