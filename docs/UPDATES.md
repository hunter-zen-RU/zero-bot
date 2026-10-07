# Updates & Checksums

This page documents official updates, patches, and checksums for Zero Bot.

---
<img width="100" height="100" alt="Suggestion" src="https://github.com/user-attachments/assets/576b9070-18cd-4190-9631-675d241704c0" /> 
<img width="100" height="100" alt="despicablememinionsGIF" src="https://github.com/user-attachments/assets/d18b2c6c-dd62-4184-ade6-fc3d7cb5b4e2" />

## Official Checksums (v4.0.0)

Use these SHA-256 checksums to verify your download integrity.
### v3.9.9   [[🔻](https://github.com/hunter-zen-RU/zero-bot/releases/download/4.0.0/zero-bot-v3.9.9-modular.zip)]
```
sha256:d8a79152dec26cfdbbdc012e95604f2938a4a151036affc9a273328a88c4f182
```
### v4.0.0-modular   [[🔻](https://github.com/hunter-zen-RU/zero-bot/releases/download/4.0.0/zero-bot-v3.9.9-modular.zip)]

```text
3585d498f750e372b4e74cf756666785b60e6f8dfe385ec56eb3a4fe889eff94
```

### v4.1.0-pro (Patch for v4.0.0-modular) [[🔻](https://github.com/hunter-zen-RU/zero-bot/releases/download/4.0.0/zero-bot-v4.0.0-elite.zip)]

```text
73f920092ff9b14b99cd2bc21087fb6b430ce6e6297d9891a3d69f4c5a5bc220
```
### zero-bot-v4.0.0-elite     [[🔻]()]
```
sha256:7d06830e0ab70d997cb5b37446bc104ad042d519fefdc7d215a553b8da042774
```
### zero-bot-v40.0.0-dragon    [[🔻](https://github.com/hunter-zen-RU/zero-bot/releases/download/4.0.0/zero-bot-v40.0.0-dragon.zip)]
```
sha256:66c5005c7ebe57ac7a2e4455580e5a91242a63ff78a6037ba8e1e6fcf2624b0c
```
### zero-bot-v40.0.0-dragon-v2    [[🔻](https://github.com/hunter-zen-RU/zero-bot/releases/download/4.0.0/zero-bot-v40_0_0-dragon-v2.zip)]
```
sha256:504862e6b558a133b3b4038dac2d17c2bda86327b327b24a291fd2365e8a3c23
```
### zero-bot-v4.0.0-dragon-termux.node-ready    [[🔻](https://github.com/hunter-zen-RU/zero-bot/releases/download/4.0.0/zero-bot-v4.0.0-dragon-termux.node-ready.zip)]
```
sha256:38fce5c16554d7607e746f84cbba7483cf423a8270a0f59089e9920bcc7077ec
```
### zero-bot-v4.0.0-dragon-termux     [[🔻](https://github.com/hunter-zen-RU/zero-bot/releases/download/4.0.0/zero-bot-v4.0.0-dragon-termux.zip)]
```
sha256:c3a5963e67190ee203a58831966c8062f36f50c3b4506e08c0c39f74cda8aabd
```

Always verify checksums before applying updates.

---

## v4.1.0-pro Patch (Optional)

**Target version:** `v4.0.0-modular`  
**Author:** Hunter Zen RU (Zero One Community)  
**Fallback version:** `v4.0.0-modular`

### Release Highlights

- **Advanced Diagnostics Suite**  
  New `.speedtest` and `.diagnostics` commands with:
  - Real-time ping
  - Memory heap usage
  - Uptime benchmark

- **Enhanced Version Banner**  
  Professional “zero-pill” visual banner with system health metrics  
  (`lib/versionBanner.js`)

- **Non-destructive Line Patch**  
  Updates core version to `4.1.0-pro` in `settings.js` without modifying:
  - API keys
  - Phone numbers
  - Other sensitive configuration

- **Cryptographic Verification**  
  Official update code (SHA-256) for automated verification against the Zero One release registry.

### Files Updated & Patched

1. `commands/speedtest.js` – Network and bot latency benchmarking suite  
2. `lib/versionBanner.js` – Terminal and web banner formatter  
3. `patch-instructions.json` – Targeted, non-destructive line updates for version bump

### Safe Recovery

Before applying the patch:

- A snapshot backup is created automatically.
- If anything goes wrong, use:
  - **Update Center → Backups & Rollback**  
  to restore `v4.0.0-modular` instantly.

---

## Future Updates

Additional patches and version bumps will be documented here, including:

- New feature flags
- Security fixes
- Compatibility notes for Node.js and OS versions
