# Updates & Checksums

This page documents official updates, patches, and checksums for Zero Bot.

---

## Official Checksums (v4.0.0)

Use these SHA-256 checksums to verify your download integrity.

### v4.0.0-modular

```text
3585d498f750e372b4e74cf756666785b60e6f8dfe385ec56eb3a4fe889eff94
```

### v4.1.0-pro (Patch for v4.0.0-modular)

```text
73f920092ff9b14b99cd2bc21087fb6b430ce6e6297d9891a3d69f4c5a5bc220
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
