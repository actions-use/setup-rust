# setup-rust

Install the Rust toolchain

## Example workflow

```yaml
name: Test
on: [push, pull_request]

jobs:
  test:
    name: cargo test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Rust
        uses: actions-use/setup-rust@v1
        with:
          toolchain: stable
          components: rustfmt, clippy
      - run: rustup --version
      - run: cargo --version
```

## Versioning

Releases use semantic version tags such as `v1.2.3`:

- `v1` points to the latest compatible `v1.x.x` release and is recommended for most workflows.
- `v1.2.3` pins an exact release for reproducible workflows.
- `stable` remains available as a backwards-compatible alias, but new workflows should use a major version tag.

Breaking changes are released under a new major version. The existing major tags remain on their latest compatible releases.

## Releasing

Before releasing, commit the generated `dist` files together with the source changes. Then create and push an exact semantic version tag from the release commit:

```sh
git tag -a v1.2.3 -m "v1.2.3"
git push origin v1.2.3
```

The release workflow validates the tag, installs locked dependencies, runs the configured lint and test scripts, rebuilds `dist`, and verifies that the committed distribution is current. It then creates the GitHub Release and moves both the matching major tag (for example, `v1`) and the compatibility `stable` tag to the released commit.
