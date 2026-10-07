
## v3.9.9
### 1. WhatsApp Web Core Messaging Features
- Message Reactions Bar: Hovering over any incoming or outgoing message bubble displays a reaction palette (❤️, 👍, 😂, 🔥). Selected reactions sync to the live socket and render on the message bubble.
- Quoted / Reply-To Preview: Click the reply icon on any message to trigger a WhatsApp-style quote banner above the composer (Replying to ...), with cancellation controls and context attachments on send.
- Starred Messages: Toggle message stars (⭐) with visual indicators that persist in the session store.
- Message Deletion: Delete message action with Baileys remote deletion protocol dispatch.
- In-Chat Message Search: Search bar within the active chat header that filters conversation messages in real-time with match counters.
- Pinned Chats: Pin priority chats to the top of the conversation list with visual pin icons.
- Poll Creator: Dedicated modal to create multi-option polls (/api/chats/:jid/poll) that render natively in chat and can be sent to groups or direct chats.
- Emoji Palette & Attachments Drawer: Quick-insert emoji drawer (😀, 😂, 🔥, ⚡, 👍, 🎉, 🚀, etc.) and attachment menu for Polls, Voice Notes (TTS), and Sticker creation.
- Export Chat: One-click conversation export to clean .txt or .json archives.
### 2. Advanced Command IDE & Modular Engine
- Command Wizard: Define command name, calling aliases, module category, and template (Basic Text Reply, Group Action, REST API Call).
- Code Editor: Monospace code editor with instant Save & Hot-Reload (no server restarts required).
- Live VM Sandbox: Test custom commands in an isolated VM environment before deploying to live WhatsApp groups.
### 3. Configuration & Shield Hub
- Module Matrix: Toggle entire functional modules (Core, Moderation, Automation, AI, Media, Downloaders, Games, Fun, System, Custom) or inspect command counts.
- Custom Auto-Replies Engine: Add trigger rules (contains, exact, startsWith) with automated responses.
- Scheduler & Cron Automation: Schedule recurring announcements and group broadcasts.
- Economy & Gamification: User coin balance tracking, daily reward claims (+200 coins with streak count), interactive Coinflip and Slot Machine games, and rank leaderboard.
- Reddit & GitHub Feeds: Live feeds from r/memes and r/programmerhumor with 1-click Send to WhatsApp Chat, alongside repository telemetry for hunter-zen-RU/zero-bot.
### 4. Brand & Local Hosting Optimization
- Configured specifically for Zero One Community by Hunter Zen RU.
- Memory usage monitoring, ring-buffered SSE logs stream, and responsive dark-mode WhatsApp Web layout.

## v4.0.0-modular
### 1. UPDATE_PATCH.zip Architecture:
- update-doc.txt: Machine- and human-readable manifest specifying NEW_VERSION, COMPATIBLE_VERSIONS, AUTHOR, FALLBACK_VERSION, UPDATE_CODE (SHA-256 checksum), FILES_TO_UPDATE, and HELP_INFO.
- update-info.md: Formatted Markdown release notes rendered directly in the Update Center interface with feature highlights, changelog, and safety warnings.
- patch-instructions.json & patch-diff.txt: Non-destructive line-level patching engine supporting targeted line modifications (search_replace, line_replace, insert_before, insert_after) across UI, server, and command files.
- files/ payload: Full file additions and replacements.
### 2. Update Center UI:
- Navigation & Status: Dedicated Update Center icon in the navigation bar with release channel badge, installed core version, and backup count.
- Side-by-Side Manifest Viewer: Interactive view showing rendered release notes (update-info.md), raw manifest (update-doc.txt), file payload list, and targeted line patches.
- Cryptographic SHA-256 Update Code: Automated calculation and online verification against official release registries with verified badges.
- Verbose Pre-Flight Dry-Run Compiler & Tester: Executes syntax verification and line-patch dry-runs inside an isolated Node VM (vm.Script) with real-time streaming console logs, syntax pass counters, and error traps.
- Snapshot Backups & Rollback Engine: Automatic safety snapshot created in backups/ before any update is applied, with one-click instant rollback to previous versions.
- Custom Patch Generator & Syntax Spec: Visual tool to author, specify line diffs, package, calculate checksums, and generate downloadable custom personal update patches.
### 3. Official Template Patch:
- Generated UPDATE_PATCH.zip (and update_patch.zip) in the project root containing an upgrade package with .speedtest diagnostic suite, version banner formatter, and line updates, available for immediate download and editing.

### MODULAR v2
### 1. WhatsApp Web Message Revelation & Phone History Sync
- messaging-history.set Ingestion: Fully integrated with Baileys multi-device protocol to automatically synchronize and reveal all messages, chats, contacts, and unread counts from the linked phone upon connection.
- Full Message Metadata Extraction: Normalizes text, media attachments, sender identity (pushName or JID), timestamps, quoted/replied contexts, and delivery receipt ticks (✓ sent, ✓✓ delivered, sky-blue ✓✓ read).
- Anti-Delete Message Vault: Intercepts WhatsApp message revocation events (protocolMessage type 0) and retains original content with a distinct warning badge ([⚠️ Intercepted by Anti-Delete: Message revoked by sender]), preventing message deletion from the host dashboard.
### 2. Media Upload & Download Pipeline
- Attachment Composer Menu: Direct upload support via the chat input bar for:
- 📷 Photos & Videos: With image lightbox preview and inline video playback.
- 📄 Document Files: With file size calculation, type icons, and one-click download.
- 🎤 Audio & Voice Notes: Interactive waveform player for .mp3, .ogg, and PTT voice notes.
- Local Media Vault (data/media/): On-demand downloading and persistent caching for incoming and outgoing media assets, ensuring fast rendering and offline review on local hosting.
### 3. Local Hosting Storage Manager
- Storage Diagnostics & Metrics:
- Live breakdown of Total Local Disk Space, Media Storage Vault, Chat History DB, and Safety Backups.
- Categorized counts for images, videos, audio notes, and documents.
- Disk Governance Actions:
- Purge Temp & Cache: Cleans temporary buffers and ephemeral scratch files.
- Clear Media Vault: Empties media storage while preserving all text and metadata.
- Chat Export Engine: One-click download of individual chat logs (.txt or .json) or the full multi-chat database (.json).
- Retention Configurator: Adjustable chat retention limits (100 to 5,000 messages or unlimited) and automated media download toggles.
### 4. Staged Architecture Diagnostics & Verification Suite
- Accessible from the Update Center > Staged Diagnostics & Tests tab, running an automated 5-layer diagnostic suite:
```
    Stage 1 (Core Files Integrity): Validates syntax, imports, and presence of all 7 core runtime modules.
    Stage 2 (Database & Phone History Engine): Verifies multi-device chat indexing, message ordering, and contact mapping.
    Stage 3 (Media Pipeline & Local Vault): Tests base64 intake, disk storage, and streaming in data/media/.
    Stage 4 (Storage Manager & Quota Diagnostics): Verifies real-time disk breakdown calculation and export generators.
    Stage 5 (Update Patch & Rollback System): Verifies UPDATE_PATCH.zip archive integrity, cryptographic SHA-256 update code (feebdcf6eca8...), and snapshot rollback readiness.
 ```
### 5. Updated UPDATE_PATCH.zip
- The official template patch in the project root has been upgraded to v4.2.0-storage-pro, packaging storageManager.js, updated lightweight_store.js, .speedtest suite, version banner formatter, line patch instructions, and documentation ready for deployment or customization.



## v4.0.0-dragon

### `lib/telegramBridge.js` — New file (280 lines)
A complete Telegram integration built on **axios** (already in your `package.json` — no new SDK needed):
- **Bidirectional relay**: WhatsApp → Telegram and Telegram → WhatsApp
- **Polling engine** with configurable interval (default 3s), auto-start when token is set
- **Webhook support**: `POST /api/telegram/webhook` for production deployments
- **Bridge link manager**: map any WhatsApp JID ↔ Telegram chat ID, with per-link stats
- **Ring-buffer interaction log** (200 entries) with direction, sender, status, and timestamps
- **Analytics endpoint** with aggregate counts and recent log preview

### `config.js` — Section 4 added
```js
telegram: {
    botToken,          // TELEGRAM_BOT_TOKEN env
    pollingIntervalMs, // TELEGRAM_POLL_INTERVAL env (default 3000)
    webhookUrl,        // TELEGRAM_WEBHOOK_URL env
    relayMode,         // 'polling' | 'webhook'
    relayEnabled: true
}
```

### `server.js` — 33 new routes (+380 lines)

| Group | Routes |
|---|---|
| **GitHub Search Engine** | `GET /api/github/search` · `GET /api/github/users` · `GET /api/github/user/:username` · `GET /api/github/repo-details` · `GET/POST /api/github/config` |
| **Agent Engine** | `GET/POST /api/agents` · `PUT/DELETE /api/agents/:id` · `POST /api/agents/:id/activate` · `POST /api/agents/chat` · `POST /api/agents/action` · `GET /api/agents/logs` |
| **MCP Servers** | `GET/POST /api/agents/mcp` · `DELETE /api/agents/mcp/:id` · `POST /api/agents/mcp/:id/discover` |
| **Telegram Bridge** | `GET /api/telegram/status` · `POST /api/telegram/token` · `GET /api/telegram/bot-info` · polling start/stop · webhook set/delete/update handler · `POST /api/telegram/send` · bridge CRUD · `GET /api/telegram/logs` |

### `.env.example` — Updated
Documents all new vars: `GITHUB_TOKEN`, `OPENAI_*`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_WEBHOOK_URL`, `TELEGRAM_RELAY_MODE`.

### `package.json`
Added `node-telegram-bot-api: ^0.66.0` (optional — the bridge uses raw axios calls and doesn't require it at runtime, but it's declared for completeness).

---

## Setup steps

1. **Telegram bot**: Message `@BotFather` → `/newbot` → copy the token → set `TELEGRAM_BOT_TOKEN=...` in `.env`
2. **GitHub token** (optional, 60→5000 req/hr): `github.com/settings/tokens` → set `GITHUB_TOKEN=...`
3. **AI agents**: Set `GEMINI_API_KEY` for Gemini, or `OPENAI_API_KEY` + `OPENAI_BASE_URL` for any OpenAI-compatible endpoint (Groq, DeepSeek, Ollama)
4. **Bridge a WhatsApp group to Telegram**: `POST /api/telegram/bridges` with `{ whatsappJid, telegramChatId }`


