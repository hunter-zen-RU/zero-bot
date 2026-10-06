<div align="center"> 
  <h1>⚡ ZERO BOT</h1>
  <p><strong>Next-Gen Modular Multi-Device WhatsApp Bot & WhatsApp Web Dashboard</strong></p>
  <p><strong>🐉 Crimson Dragon — Android / Termux Edition</strong></p>
  <p>Built for <strong>Zero One Community</strong> by <strong>Hunter Zen RU</strong></p>
  <img src="assets/bot_image.jpg" alt="Zero Bot" height="260" style="border-radius: 16px; margin: 12px 0;">
  <br/>
  <span style="background-color: #b3001b; color: white; padding: 4px 10px; border-radius: 12px; font-weight: bold;">v4.0.0-dragon-termux</span>
</div>

---

## 📖 About Zero Bot

**Zero Bot** is a high-performance, modular WhatsApp bot built on the Baileys library, engineered for group automation, media conversions, safety filters, and interactive management.

This **Termux Edition** is the same full bot, repackaged to install and run **natively on an Android phone through [Termux](https://f-droid.org/en/packages/com.termux/)** — no PC, no VPS, no cloud required. It adds one-command shell scripts, Termux:API device integrations, memory tuning for phones, and safe fallbacks so native desktop modules never crash the bot on Android.

Core features:
- **WhatsApp Web-Like Web Client**: A web dashboard with live chat view, direct command triggers, message sending, and group control.
- **Fully Customizable UI**: Switch between WhatsApp Dark, Cyber Emerald, Midnight Blue, and Dracula themes.
- **Modular Engine (`lib/modularEngine.js`)**: Group commands into clean modules with runtime toggles.
- **Optimized for Local Hosting**: Low RAM footprint, non-blocking sockets, auto-reconnect backoff, local JSON persistence.
- **Dual Authentication**: QR code scanning and direct 8-character pairing codes.

---

## 🤖 New in v4.0.0-dragon-termux

- **📱 One-command Termux setup** — `bash install.sh` installs Node, ffmpeg, Git, Python, build tools, Termux:API, and all npm deps.
- **▶️ Simple lifecycle scripts** — `start.sh`, `stop.sh`, `restart.sh`, `logs.sh`, `status.sh`, plus a headless `pair.sh` for terminal-only WhatsApp linking.
- **🔋 Android-aware runtime** — automatic `termux-wake-lock`, connect/disconnect **system notifications**, and a **low-battery watchdog** that warns the owner before Android kills the process.
- **🛠️ `.termux` command suite** — inspect battery/RAM/storage/uptime and control the device (notify, toast, TTS, vibrate, clipboard, wake-lock) straight from WhatsApp. See below.
- **🧩 Portable imaging layer (`lib/imaging.js`)** — `sharp` is now optional. Sticker→image and blur effects use `sharp` on desktop and automatically fall back to **ffmpeg** on Android, so the bot boots even when native image libs won't compile.
- **🚀 Auto-start on boot** — optional `Termux:Boot` integration relaunches the bot after a device reboot.
- **🪶 Phone memory profiles** — `--low` (256 MB) and default (384 MB) Node heap tuning for small devices.

### The `.termux` command

| Command | Description |
|---|---|
| `.termux` | Device + runtime snapshot (battery, RAM, storage, uptime, API status) |
| `.termux battery` | Detailed battery status |
| `.termux notify <text>` | Push an Android notification *(owner only)* |
| `.termux toast <text>` | Show a toast popup *(owner only)* |
| `.termux speak <text>` | Text-to-speech via the device *(owner only)* |
| `.termux copy <text>` | Copy text to the device clipboard *(owner only)* |
| `.termux vibrate [ms]` | Vibrate the device *(owner only)* |
| `.termux lock` / `.termux unlock` | Acquire / release the wake-lock *(owner only)* |
| `.termux help` | Show the menu |

> Device-control sub-commands are restricted to the bot owner / sudo users. `.termux` and `.termux battery` are safe for anyone.

---

## 📲 Quick Start on Android (Termux)

### 1. Install Termux
Get **Termux** (and optionally **Termux:API** + **Termux:Boot**) from **F-Droid** — the Play Store build is outdated.

### 2. Get the bot onto your phone
Copy the `zero-bot-v4.0.0-dragon-termux` folder into Termux home, or clone/download it there. For example, if you saved the zip to your Downloads folder:

```bash
termux-setup-storage           # accept the storage prompt
pkg install -y unzip
cd ~
unzip /sdcard/Download/zero-bot-v4.0.0-dragon-termux.zip
cd zero-bot-v4.0.0-dragon-termux
```

### 3. Install everything
```bash
bash install.sh
```
This updates packages, installs `nodejs git ffmpeg python make clang libvips termux-api`, runs `npm install` (with a native-safe retry), creates `.env`, and optionally sets up boot autostart.

### 4. Configure
```bash
nano .env
```
Set `PHONE_NUMBER` (with country code, no `+`) and, if you want Gemini AI, `GEMINI_API_KEY`. Save with `Ctrl+O`, exit with `Ctrl+X`.

### 5. Link WhatsApp & run
**Option A — terminal pairing / QR (headless, recommended on a phone):**
```bash
bash pair.sh 254712345678      # prints a pairing code, or a QR to scan
```

**Option B — full bot + web dashboard:**
```bash
bash start.sh                  # foreground, Ctrl+C to stop
# or
bash start.sh --bg             # background; then:
bash logs.sh                   # follow logs
bash status.sh                 # process + battery + dashboard status
bash stop.sh                   # stop it
```
Then open **http://localhost:3000** in a phone browser (or Chrome) for the dashboard, QR, and pairing-code UI.

> Keep the bot alive with the screen off: the scripts call `termux-wake-lock` automatically. Also disable battery optimization for Termux in Android settings.

---

## 💻 Quick Start on Desktop / VPS

The Termux edition still runs anywhere Node 20+ runs:

```bash
npm install --legacy-peer-deps
cp .env.example .env      # then edit
npm start                 # http://localhost:3000
```
On desktop, `sharp` installs normally for fastest image processing; on Android it is skipped in favor of the ffmpeg fallback.

---

## 🧩 Modular System Architecture

Zero Bot divides its 80+ commands into isolated modules that can be enabled or disabled dynamically without restarting the server:

| Module | Features & Commands |
|---|---|
| **Core** | `.help`, `.ping`, `.alive`, `.owner`, `.groupinfo`, `.staff` |
| **Moderation** | `.ban`, `.unban`, `.kick`, `.promote`, `.demote`, `.mute`, `.unmute`, `.warn`, `.antilink`, `.antibadword`, `.tagall`, `.hidetag` |
| **Automation** | Auto-Read, Auto-Typing, Auto-Status, Anti-Call, Anti-Delete, Welcome & Goodbye notices |
| **AI & Intelligence** | `.ai` (Gemini), `.imagine`, `.chatbot`, `.sora` |
| **Media & Stickers** | `.sticker`, `.crop`, `.removebg`, `.remini`, `.blur`, `.emojimix`, `.attp`, `.textmaker` |
| **Downloaders** | `.song`, `.play`, `.video`, `.spotify`, `.tiktok`, `.instagram`, `.facebook` |
| **Games** | `.tictactoe`, `.hangman`, `.trivia`, `.truth`, `.dare`, `.eightball` |
| **Fun & Social** | `.compliment`, `.insult`, `.flirt`, `.shayari`, `.character`, `.ship`, `.wasted`, `.tts`, `.weather` |
| **Device (Termux)** | `.termux` and its sub-commands (battery, notify, speak, lock, …) |
| **System** | `.settings`, `.sudo`, `.clearsession`, `.cleartmp`, `.update`, `.setpp` |

---

## 🗂️ Termux Scripts Reference

| Script | Purpose |
|---|---|
| `install.sh` | Full environment + dependency setup |
| `start.sh` | Run the bot (`--bg`, `--low`, `--high`, `--pair`) |
| `stop.sh` | Stop a background instance, release wake-lock |
| `restart.sh` | Stop + start in background |
| `logs.sh` | Tail the runtime log (`logs/bot.log`) |
| `status.sh` | Process, dashboard, battery, wake-lock status |
| `pair.sh` | Headless terminal pairing / QR linking |
| `termux-boot/start-zero-bot` | Optional boot autostart template |

---

## ⚠️ Termux Troubleshooting

- **`sharp` build errors during install** — expected and harmless; the installer retries with `--omit=optional` and image features fall back to ffmpeg.
- **Stickers/blur fail** — make sure ffmpeg is present: `pkg install ffmpeg`.
- **Bot dies when the screen turns off** — run `termux-wake-lock`, install Termux:Boot for autostart, and disable Android battery optimization for Termux.
- **Device features do nothing** — install the **Termux:API** app *and* run `pkg install termux-api`.
- **Port already in use** — set a different `PORT` in `.env`.

---

## 💳 Credits & Acknowledgements

- **Hunter Zen RU** — Lead Developer & Maintainer, Zero One Community
- **Zero One Community** — Community, Testing, and Features
- **Baileys Project** — WhatsApp Web API Library
- **Termux** — Terminal emulator & Linux environment for Android

---

## ⚠️ Disclaimer
This project is an unofficial community automation tool created for educational and administrative purposes. It is not affiliated with or endorsed by WhatsApp Inc. Run it responsibly to avoid account restrictions.
