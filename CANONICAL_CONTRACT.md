# cip68-222-minting canonical contract

Helios source of the CIP-68 minting and editing validators (`minting.helios`, `editing.helios`). Changing either changes a script hash.

1. A mint requires the `mint_config_444` reference input and the settings handle (as the source asserts); the mint fee and payment come from those datums.
