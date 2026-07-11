const axios = require('axios');
const yts = require('yt-search');
const fs = require('fs');
const path = require('path');
const { toAudio } = require('../lib/converter');

const AXIOS_DEFAULTS = {
    timeout: 60000,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*'
    }
};

async function tryRequest(getter, attempts = 3) {
    let lastError;
    for (let attempt = 1; attempt <= attempts; attempt++) {
        try {
            return await getter();
        } catch (err) {
            lastError = err;
            if (attempt < attempts) {
                await new Promise(r => setTimeout(r, 1000 * attempt));
            }
        }
    }
    throw lastError;
}

// EliteProTech API - Primary
async function getEliteProTechDownloadByUrl(youtubeUrl) {
    const apiUrl = `https://eliteprotech-apis.zone.id/ytdown?url=${encodeURIComponent(youtubeUrl)}&format=mp3`;
    const res = await tryRequest(() => axios.get(apiUrl, AXIOS_DEFAULTS));
    if (res?.data?.success && res?.data?.downloadURL) {
        return {
            download: res.data.downloadURL,
            title: res.data.title
        };
    }
    throw new Error('EliteProTech ytdown returned no download');
}

async function getYupraDownloadByUrl(youtubeUrl) {
    const apiUrl = `https://api.yupra.my.id/api/downloader/ytmp3?url=${encodeURIComponent(youtubeUrl)}`;
    const res = await tryRequest(() => axios.get(apiUrl, AXIOS_DEFAULTS));
    if (res?.data?.success && res?.data?.data?.download_url) {
        return {
            download: res.data.data.download_url,
            title: res.data.data.title,
            thumbnail: res.data.data.thumbnail
        };
    }
    throw new Error('Yupra returned no download');
}

async function getOkatsuDownloadByUrl(youtubeUrl) {
    const apiUrl = `https://okatsu-rolezapiiz.vercel.app/downloader/ytmp3?url=${encodeURIComponent(youtubeUrl)}`;
    const res = await tryRequest(() => axios.get(apiUrl, AXIOS_DEFAULTS));
    if (res?.data?.dl) {
        return {
            download: res.data.dl,
            title: res.data.title,
            thumbnail: res.data.thumb
        };
    }
    throw new Error('Okatsu ytmp3 returned no download');
}

// ─── Download helper (extracted so it can be reused for 'all') ───

async function downloadSingleAudio(video) {
    let audioData;
    let audioBuffer;
    let downloadSuccess = false;

    const apiMethods = [
        { name: 'EliteProTech', method: () => getEliteProTechDownloadByUrl(video.url) },
        { name: 'Yupra', method: () => getYupraDownloadByUrl(video.url) },
        { name: 'Okatsu', method: () => getOkatsuDownloadByUrl(video.url) }
    ];

    for (const apiMethod of apiMethods) {
        try {
            audioData = await apiMethod.method();
            const audioUrl = audioData.download || audioData.dl || audioData.url;

            if (!audioUrl) {
                console.log(`${apiMethod.name} returned no download URL, trying next API...`);
                continue;
            }

            try {
                const audioResponse = await axios.get(audioUrl, {
                    responseType: 'arraybuffer',
                    timeout: 90000,
                    maxContentLength: Infinity,
                    maxBodyLength: Infinity,
                    decompress: true,
                    validateStatus: s => s >= 200 && s < 400,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                        'Accept': '*/*',
                        'Accept-Encoding': 'identity'
                    }
                });
                audioBuffer = Buffer.from(audioResponse.data);

                if (audioBuffer && audioBuffer.length > 0) {
                    downloadSuccess = true;
                    break;
                }
            } catch (downloadErr) {
                const statusCode = downloadErr.response?.status || downloadErr.status;
                if (statusCode === 451) {
                    console.log(`Download blocked (451) from ${apiMethod.name}, trying next API...`);
                    continue;
                }

                try {
                    const audioResponse = await axios.get(audioUrl, {
                        responseType: 'stream',
                        timeout: 90000,
                        maxContentLength: Infinity,
                        maxBodyLength: Infinity,
                        validateStatus: s => s >= 200 && s < 400,
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                            'Accept': '*/*',
                            'Accept-Encoding': 'identity'
                        }
                    });
                    const chunks = [];
                    await new Promise((resolve, reject) => {
                        audioResponse.data.on('data', c => chunks.push(c));
                        audioResponse.data.on('end', resolve);
                        audioResponse.data.on('error', reject);
                    });
                    audioBuffer = Buffer.concat(chunks);

                    if (audioBuffer && audioBuffer.length > 0) {
                        downloadSuccess = true;
                        break;
                    }
                } catch (streamErr) {
                    const streamStatusCode = streamErr.response?.status || streamErr.status;
                    if (streamStatusCode === 451) {
                        console.log(`Stream download blocked (451) from ${apiMethod.name}, trying next API...`);
                    } else {
                        console.log(`Stream download failed from ${apiMethod.name}:`, streamErr.message);
                    }
                    continue;
                }
            }
        } catch (apiErr) {
            console.log(`${apiMethod.name} API failed:`, apiErr.message);
            continue;
        }
    }

    if (!downloadSuccess || !audioBuffer) {
        return null;
    }

    // ── Detect actual file format ──
    const firstBytes = audioBuffer.slice(0, 12);
    const hexSignature = firstBytes.toString('hex');
    const asciiSignature = firstBytes.toString('ascii', 4, 8);

    let actualMimetype = 'audio/mpeg';
    let fileExtension = 'mp3';
    let detectedFormat = 'unknown';

    if (asciiSignature === 'ftyp' || hexSignature.startsWith('000000')) {
        const ftypBox = audioBuffer.slice(4, 8).toString('ascii');
        if (ftypBox === 'ftyp') {
            detectedFormat = 'M4A/MP4';
            actualMimetype = 'audio/mp4';
            fileExtension = 'm4a';
        }
    } else if (audioBuffer.toString('ascii', 0, 3) === 'ID3' ||
        (audioBuffer[0] === 0xFF && (audioBuffer[1] & 0xE0) === 0xE0)) {
        detectedFormat = 'MP3';
        actualMimetype = 'audio/mpeg';
        fileExtension = 'mp3';
    } else if (audioBuffer.toString('ascii', 0, 4) === 'OggS') {
        detectedFormat = 'OGG/Opus';
        actualMimetype = 'audio/ogg; codecs=opus';
        fileExtension = 'ogg';
    } else if (audioBuffer.toString('ascii', 0, 4) === 'RIFF') {
        detectedFormat = 'WAV';
        actualMimetype = 'audio/wav';
        fileExtension = 'wav';
    } else {
        actualMimetype = 'audio/mp4';
        fileExtension = 'm4a';
        detectedFormat = 'Unknown (defaulting to M4A)';
    }

    // ── Convert to MP3 if needed ──
    let finalBuffer = audioBuffer;
    if (fileExtension !== 'mp3') {
        finalBuffer = await toAudio(audioBuffer, fileExtension);
        if (!finalBuffer || finalBuffer.length === 0) {
            throw new Error(`Failed to convert ${detectedFormat} to MP3`);
        }
    }

    // Cleanup temp files from conversion
    try {
        const tempDir = path.join(__dirname, '../temp');
        if (fs.existsSync(tempDir)) {
            const files = fs.readdirSync(tempDir);
            const now = Date.now();
            files.forEach(file => {
                const filePath = path.join(tempDir, file);
                try {
                    const stats = fs.statSync(filePath);
                    if (now - stats.mtimeMs > 10000) {
                        if (file.endsWith('.mp3') || file.endsWith('.m4a') || /^\d+\.(mp3|m4a)$/.test(file)) {
                            fs.unlinkSync(filePath);
                        }
                    }
                } catch (e) { }
            });
        }
    } catch (e) { }

    return {
        buffer: finalBuffer,
        title: audioData?.title || video.title || 'song'
    };
}

// ─── Send helper (handles doc/audio/voice) ───

async function sendAudio(sock, chatId, message, buffer, title, timestamp, sendType, quotedMsg) {
    const cleanTitle = (title || 'song').replace(/[^\w\s\-().]/g, '').trim();
    const fileName = `${cleanTitle}.mp3`;

    switch (sendType) {
        case 'doc':
            await sock.sendMessage(chatId, {
                document: buffer,
                mimetype: 'audio/mpeg',
                fileName: fileName,
                caption: `🎵 *${cleanTitle}*\n⏱ ${timestamp || 'N/A'}`
            }, { quoted: quotedMsg });
            break;

        case 'audio':
            await sock.sendMessage(chatId, {
                audio: buffer,
                mimetype: 'audio/mpeg',
                fileName: fileName,
                ptt: false
            }, { quoted: quotedMsg });
            break;

        default: // 'voice' or 'all'
            await sock.sendMessage(chatId, {
                audio: buffer,
                mimetype: 'audio/mpeg',
                fileName: fileName,
                ptt: true
            }, { quoted: quotedMsg });
            break;
    }
}

// ─── Main command ───

async function songCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
        if (!text) {
            await sock.sendMessage(chatId, { text: 'Usage: .song <query>\nUsage: .play [doc|audio|voice|all] <query>' }, { quoted: message });
            return;
        }

        // ── Parse command + type ──────────────────────────────
        const isPlay = /^\.play(\s|$)/i.test(text);
        let sendType = 'voice';
        let query = '';

        if (isPlay) {
            const afterCmd = text.replace(/^\.play\s*/i, '').trim();
            const firstWord = afterCmd.split(/\s+/)[0]?.toLowerCase();

            if (['doc', 'audio', 'voice', 'all'].includes(firstWord)) {
                sendType = firstWord;
                query = afterCmd.split(/\s+/).slice(1).join(' ').trim();
            } else {
                query = afterCmd;
            }
        } else {
            // .song — always voice, no type parsing
            query = text.replace(/^\.song\s*/i, '').trim();
        }

        if (!query) {
            const usage = isPlay
                ? '❌ Usage: .play [doc|audio|voice|all] <song name or link>\n\n*Types:*\n• voice — Voice note (default)\n• audio — Audio file\n• doc — Document file\n• all — Download top 5 results'
                : '❌ Usage: .song <song name or link>';
            await sock.sendMessage(chatId, { text: usage }, { quoted: message });
            return;
        }

        // ── Search / resolve video(s) ────────────────────────
        let videos = [];
        if (query.includes('youtube.com') || query.includes('youtu.be')) {
            videos = [{ url: query }];
        } else {
            const search = await yts(query);
            if (!search || !search.videos.length) {
                await sock.sendMessage(chatId, { text: '❌ No results found.' }, { quoted: message });
                return;
            }
            if (sendType === 'all') {
                videos = search.videos.slice(0, 5);
            } else {
                videos = [search.videos[0]];
            }
        }

        // ── 'all' intro message ──────────────────────────────
        if (sendType === 'all' && videos.length > 1) {
            await sock.sendMessage(chatId, {
                text: `🎵 *Queueing ${videos.length} songs for:*\n"${query}"`
            }, { quoted: message });
        }

        // ── Process each video ───────────────────────────────
        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < videos.length; i++) {
            const video = videos[i];
            const isMulti = videos.length > 1;
            const counter = isMulti ? `[${i + 1}/${videos.length}] ` : '';

            // Status message
            if (isMulti) {
                await sock.sendMessage(chatId, {
                    text: `⬇️ ${counter}Downloading: *${video.title}*\n⏱ ${video.timestamp}`
                });
            } else {
                await sock.sendMessage(chatId, {
                    image: { url: video.thumbnail },
                    caption: `🎵 Downloading: *${video.title}*\n⏱ Duration: ${video.timestamp}`
                }, { quoted: message });
            }

            // Download + convert
            try {
                const result = await downloadSingleAudio(video);

                if (!result || !result.buffer) {
                    if (isMulti) {
                        failCount++;
                        await sock.sendMessage(chatId, {
                            text: `⚠️ ${counter}Failed: *${video.title}*`
                        });
                        continue;
                    }
                    throw new Error('All download sources failed. The content may be unavailable or blocked in your region.');
                }

                // Only quote the original message on the first send
                const quotedMsg = (i === 0) ? message : undefined;

                await sendAudio(sock, chatId, message, result.buffer, result.title, video.timestamp, sendType, quotedMsg);
                successCount++;

                // Small delay between sends in queue mode to avoid rate limits
                if (isMulti && i < videos.length - 1) {
                    await new Promise(r => setTimeout(r, 2000));
                }

            } catch (err) {
                if (isMulti) {
                    failCount++;
                    await sock.sendMessage(chatId, {
                        text: `⚠️ ${counter}Failed: *${video.title}*\n_${err.message}_`
                    });
                    continue;
                }
                // Single download — throw to outer catch
                throw err;
            }
        }

        // ── 'all' summary ───────────────────────────────────
        if (sendType === 'all' && videos.length > 1) {
            const icon = failCount === 0 ? '✅' : '⚠️';
            await sock.sendMessage(chatId, {
                text: `${icon} Done! ${successCount}/${videos.length} songs downloaded` +
                    (failCount > 0 ? ` (${failCount} failed)` : '')
            });
        }

    } catch (err) {
        console.error('Song command error:', err);

        let errorMessage = '❌ Failed to download song.';
        if (err.message && err.message.includes('blocked')) {
            errorMessage = '❌ Download blocked. The content may be unavailable in your region or due to legal restrictions.';
        } else if (err.response?.status === 451 || err.status === 451) {
            errorMessage = '❌ Content unavailable (451). This may be due to legal restrictions or regional blocking.';
        } else if (err.message && err.message.includes('All download sources failed')) {
            errorMessage = '❌ All download sources failed. The content may be unavailable or blocked.';
        } else if (err.message && err.message.includes('convert')) {
            errorMessage = `❌ ${err.message}`;
        }

        await sock.sendMessage(chatId, {
            text: errorMessage
        }, { quoted: message });
    }
}

module.exports = songCommand;
