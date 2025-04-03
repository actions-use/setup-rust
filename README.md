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
        uses: actions-use/setup-rust@stable
        with:
          toolchain: stable
          components: rustfmt, clippy
      - run: rustup --version
      - run: cargo --version
```
