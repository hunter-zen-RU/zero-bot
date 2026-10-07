# Installation Guide

This guide explains how to install and run Zero Bot `v4.0.0-modular` on Windows.  
Steps for other variants are similar unless otherwise noted.

> **Prerequisites:**  
> - Git (optional, for cloning)  
> - Node.js (LTS recommended)  
> - Basic familiarity with terminal/command prompt

---

## 1. Download and Extract

1. Download the release archive:  
   [zero-bot-v4.0.0-modular.zip](https://github.com/hunter-zen-RU/zero-bot/releases/download/4.0.0/zero-bot-v4.0.0-modular.zip)
2. Extract the ZIP to a folder of your choice.
3. Do **not** modify credential files immediately; misconfiguration is a common source of issues.

---

## 2. Install Node.js

Ensure Node.js is installed. For LTS:

```powershell
winget install OpenJS.NodeJS.LTS
```

For the latest version:

```powershell
winget install OpenJS.NodeJS
```

Verify installation:

```powershell
node -v
npm -v
```

---

## 3. Prepare the Project Directory

Open a terminal in the project directory (the folder containing `index.js`), then clean any previous installations:

```powershell
Remove-Item -Recurse -Force node_modules, package-lock.json -ErrorAction SilentlyContinue
npm cache clean --force
```

This removes potentially broken or cached binaries.

---

## 4. Install Dependencies

Install core dependencies without running build scripts:

```powershell
npm install --ignore-scripts
```

This avoids issues with native modules (e.g., `sharp`) during initial setup.

---

## 5. (Optional) Fix `sharp` for Image Commands

If you use image-related commands (e.g., `simage`) and encounter `sharp` errors (common on newer Node versions), reinstall `sharp` with scripts enabled:

```powershell
npm install sharp@latest --ignore-scripts=false
```

> Skip this step if your installation works without it.

---

## 6. (Optional) Install `pkg` for EXE Builds

If you plan to package the bot as a Windows executable:

```powershell
npm install -g pkg
```

You can then use `pkg` to build distributable binaries.

---

## 7. Run the Bot

Start the bot:

```powershell
npm start
```

If running locally with the default port (`3000`), open:

- Web UI: <http://127.0.0.1:3000/>

Follow any on-screen instructions to complete WhatsApp pairing and configuration.

---

## Troubleshooting Tips

- If commands fail after updates, re-run:
  ```powershell
  Remove-Item -Recurse -Force node_modules
  npm cache clean --force
  npm install --ignore-scripts
  ```
- Ensure no other process is using port `3000` (or your configured port).
- Check that credential files match the expected format for your variant.
