/**
 * SchemaCraft AI - Synchronized Neural Voiceover & Video Presentation Generator
 * Uses Microsoft Edge Neural TTS + Playwright + FFmpeg
 */

const { chromium } = require("playwright");
const { execSync, spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const ffmpegPath = require("ffmpeg-static");

const ASSETS_DIR = path.join(__dirname, "../public/assets");
const VIDEO_DIR = path.join(ASSETS_DIR, "video");
const AUDIO_DIR = path.join(VIDEO_DIR, "audio_segments");
const TEMP_RECORD_DIR = path.join(VIDEO_DIR, "_temp_rec");

const SCRIPT_SEGMENTS = [
  {
    id: "part1_intro",
    name: "Part 1: Hook & Intro",
    text: "Every developer faces the same bottleneck: spending hours designing database schemas and mock APIs before writing any business logic. Meet SchemaCraft AI — an autonomous, zero-backend 3NF relational schema architect and in-memory mock API runtime.",
    action: "hero",
  },
  {
    id: "part2_synthesis",
    name: "Part 2: Synthesis Demo",
    text: "Describe your domain or choose a preset like Healthcare or B2B SaaS. In under 15 milliseconds, our client engine compiles a Third Normal Form relational graph with automatic UUID primary keys, indexed foreign keys, and cascading referential integrity.",
    action: "presets_and_erd",
  },
  {
    id: "part3_code_gen",
    name: "Part 3: Production Code",
    text: "Inspect production-ready Prisma models with bidirectional relations, ANSI SQL DDL, and strict TypeScript interfaces — fully copyable and exportable with one click.",
    action: "prisma_and_sql",
  },
  {
    id: "part4_mock_api",
    name: "Part 4: In-Memory Sandbox",
    text: "The edge in-memory REST sandbox boots referentially linked seed data with sub-6ms query telemetry, eliminating backend test servers.",
    action: "mock_api",
  },
  {
    id: "part5_compliance",
    name: "Part 5: Compliance & Close",
    text: "Built for Devpost Build With AI with strict scope, PRD, and spec compliance. SchemaCraft AI: Zero backend, zero latency, instant architecture.",
    action: "compliance_close",
  },
];

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Helper to get media file duration in seconds via ffmpeg
function getMediaDuration(filePath) {
  try {
    const result = spawnSync(ffmpegPath, ["-i", filePath], { encoding: "utf8" });
    const output = (result.stdout || "") + (result.stderr || "");
    const match = output.match(/Duration: (\d{2}):(\d{2}):(\d{2}\.\d{2})/);
    if (match) {
      const hours = parseFloat(match[1]);
      const minutes = parseFloat(match[2]);
      const seconds = parseFloat(match[3]);
      return hours * 3600 + minutes * 60 + seconds;
    }
  } catch (err) {
    console.warn(`[WARN] Failed to read duration for ${filePath}: ${err.message}`);
  }
  return 12.0; // fallback duration estimate
}

async function generateAudioSegments() {
  console.log("\n=======================================================");
  console.log("1. SYNTHESIZING NEURAL AUDIO SEGMENTS (edge-tts)");
  console.log("=======================================================");

  if (!fs.existsSync(AUDIO_DIR)) {
    fs.mkdirSync(AUDIO_DIR, { recursive: true });
  }

  const voiceName = "en-US-ChristopherNeural";
  const segmentFiles = [];
  const segmentDurations = [];

  for (let i = 0; i < SCRIPT_SEGMENTS.length; i++) {
    const seg = SCRIPT_SEGMENTS[i];
    const outputFile = path.join(AUDIO_DIR, `${seg.id}.mp3`);
    console.log(`\n[AUDIO] Synthesizing ${seg.name}...`);
    console.log(`        "${seg.text.slice(0, 80)}..."`);

    // Call edge-tts
    const ttsCmd = `python -m edge_tts --voice ${voiceName} --text "${seg.text.replace(/"/g, '\\"')}" --write-media "${outputFile}"`;
    execSync(ttsCmd, { stdio: "inherit" });

    const duration = getMediaDuration(outputFile);
    console.log(`        ✓ Duration: ${duration.toFixed(2)} seconds`);

    segmentFiles.push(outputFile);
    segmentDurations.push(duration);
  }

  // Concatenate all segments with ffmpeg concat demuxer
  console.log("\n[AUDIO] Concatenating audio segments into master voiceover...");
  const concatListFile = path.join(AUDIO_DIR, "concat_list.txt");
  const concatContent = segmentFiles
    .map((file) => `file '${file.replace(/\\/g, "/")}'`)
    .join("\n");
  fs.writeFileSync(concatListFile, concatContent, "utf8");

  const masterAudioFile = path.join(VIDEO_DIR, "voiceover.mp3");
  const ffmpegConcatCmd = `"${ffmpegPath}" -y -f concat -safe 0 -i "${concatListFile}" -c copy "${masterAudioFile}"`;
  execSync(ffmpegConcatCmd, { stdio: "ignore" });

  const totalAudioDuration = getMediaDuration(masterAudioFile);
  console.log(`[SUCCESS] Master audio generated: ${masterAudioFile}`);
  console.log(`          Total Audio Duration: ${totalAudioDuration.toFixed(2)} seconds`);

  return { segmentDurations, totalAudioDuration, masterAudioFile };
}

async function recordSynchronizedWalkthrough(durations) {
  console.log("\n=======================================================");
  console.log("2. RECORDING SYNCHRONIZED BROWSER WALKTHROUGH");
  console.log("=======================================================");

  if (!fs.existsSync(TEMP_RECORD_DIR)) {
    fs.mkdirSync(TEMP_RECORD_DIR, { recursive: true });
  }

  const targetUrl = process.env.TARGET_URL || "http://localhost:3000";
  console.log(`[INFO] Launching Chromium 1920x1080 at ${targetUrl}...`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
    recordVideo: {
      dir: TEMP_RECORD_DIR,
      size: { width: 1920, height: 1080 },
    },
  });

  const page = await context.newPage();

  try {
    await page.goto(targetUrl, { waitUntil: "domcontentloaded", timeout: 15000 });
    await sleep(1500);

    // -------------------------------------------------------------------------
    // SCENE 1: Hook & Intro (matches duration of Part 1)
    // -------------------------------------------------------------------------
    const dur1 = Math.max(durations[0] * 1000, 10000);
    console.log(`[SCENE 1] Hook & Intro (Holding for ${Math.round(dur1 / 1000)}s)...`);
    // Gentle scroll to display the 3NF ERD models
    await sleep(2000);
    await page.evaluate(() => window.scrollBy({ top: 120, behavior: "smooth" }));
    await sleep(dur1 - 2000);

    // -------------------------------------------------------------------------
    // SCENE 2: Synthesis Demo & Presets (matches duration of Part 2)
    // -------------------------------------------------------------------------
    const dur2 = Math.max(durations[1] * 1000, 12000);
    console.log(`[SCENE 2] Presets & 3NF Synthesis (Holding for ${Math.round(dur2 / 1000)}s)...`);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
    await sleep(1000);

    // Click "B2B SaaS Platform" preset pill
    const saasPill = page.locator("button:has-text('B2B SaaS Platform')").first();
    if (await saasPill.isVisible()) {
      await saasPill.click();
    }
    await sleep(2000);

    // Scroll to see the newly generated SaaS tables
    await page.evaluate(() => window.scrollBy({ top: 180, behavior: "smooth" }));
    await sleep(dur2 - 3000);

    // -------------------------------------------------------------------------
    // SCENE 3: Production Code Gen (matches duration of Part 3)
    // -------------------------------------------------------------------------
    const dur3 = Math.max(durations[2] * 1000, 12000);
    console.log(`[SCENE 3] Prisma & PostgreSQL DDL (Holding for ${Math.round(dur3 / 1000)}s)...`);
    await page.evaluate(() => window.scrollTo({ top: 140, behavior: "smooth" }));
    await sleep(800);

    // Click Prisma tab
    const prismaTab = page.locator("button:has-text('Prisma Schema')").first();
    await prismaTab.click();
    await sleep(1500);

    // Click Copy Code in Prisma
    const copyPrismaBtn = page.locator("button:has-text('Copy Code')").first();
    if (await copyPrismaBtn.isVisible()) {
      await copyPrismaBtn.click();
    }
    await sleep(2000);

    // Switch to PostgreSQL DDL tab
    const postgresTab = page.locator("button:has-text('PostgreSQL DDL')").first();
    await postgresTab.click();
    await sleep(1500);

    // Click Copy Code in SQL to show toast
    const copySqlBtn = page.locator("button:has-text('Copy Code')").first();
    if (await copySqlBtn.isVisible()) {
      await copySqlBtn.click();
    }
    await sleep(dur3 - 5800);

    // -------------------------------------------------------------------------
    // SCENE 4: In-Memory REST Sandbox (matches duration of Part 4)
    // -------------------------------------------------------------------------
    const dur4 = Math.max(durations[3] * 1000, 10000);
    console.log(`[SCENE 4] In-Memory Mock API (Holding for ${Math.round(dur4 / 1000)}s)...`);
    const mockApiTab = page.locator("button:has-text('In-Memory Mock API')").first();
    await mockApiTab.click();
    await sleep(1500);

    // Click Send Request to update live telemetry
    const sendReqBtn = page.locator("button:has-text('Send Request')").first();
    if (await sendReqBtn.isVisible()) {
      await sendReqBtn.click();
    }
    await sleep(1500);

    // Filter search interaction
    const searchInput = page.locator("input[placeholder*='Filter response']").first();
    if (await searchInput.isVisible()) {
      await searchInput.fill("admin");
    }
    await sleep(dur4 - 3000);

    // -------------------------------------------------------------------------
    // SCENE 5: Compliance & Close (matches duration of Part 5)
    // -------------------------------------------------------------------------
    const dur5 = Math.max(durations[4] * 1000, 8000);
    console.log(`[SCENE 5] Compliance & Closing (Holding for ${Math.round(dur5 / 1000)}s)...`);
    const erdTab = page.locator("button:has-text('Relational ERD & Models')").first();
    await erdTab.click();
    await sleep(1000);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
    await sleep(dur5 - 1000);
  } catch (err) {
    console.error("[ERROR] Browser walkthrough failed:", err);
  } finally {
    const video = page.video();
    await page.close();
    await context.close();
    await browser.close();

    if (video) {
      const rawVideoPath = await video.path();
      const rawDest = path.join(VIDEO_DIR, "raw_walkthrough.webm");
      if (fs.existsSync(rawVideoPath)) {
        fs.copyFileSync(rawVideoPath, rawDest);
        console.log(`[SUCCESS] Raw walkthrough video recorded: ${rawDest}`);
        try {
          fs.rmSync(TEMP_RECORD_DIR, { recursive: true, force: true });
        } catch (_) {}
        return rawDest;
      }
    }
  }

  throw new Error("Failed to record video");
}

function mergeVideoAndAudio(rawVideoPath, audioPath) {
  console.log("\n=======================================================");
  console.log("3. MERGING WALKTHROUGH & NEURAL AUDIO INTO MP4");
  console.log("=======================================================");

  const outputMp4 = path.join(VIDEO_DIR, "schemacraft-presentation-voiceover.mp4");

  // FFmpeg command: merge video + audio, encode with H.264 (libx264) + AAC
  // '-shortest' ensures video and audio end together cleanly
  const ffmpegCmd = `"${ffmpegPath}" -y -i "${rawVideoPath}" -i "${audioPath}" -c:v libx264 -pix_fmt yuv420p -preset fast -crf 22 -c:a aac -b:a 192k -movflags +faststart -shortest "${outputMp4}"`;

  console.log("[FFMPEG] Encoding H.264 / AAC 1080p presentation video...");
  execSync(ffmpegCmd, { stdio: "inherit" });

  if (fs.existsSync(outputMp4)) {
    const stats = fs.statSync(outputMp4);
    const sizeMb = (stats.size / (1024 * 1024)).toFixed(2);
    const duration = getMediaDuration(outputMp4);
    console.log("\n=======================================================");
    console.log(`[SUCCESS] Presentation video created successfully!`);
    console.log(`          File:     ${outputMp4}`);
    console.log(`          Size:     ${sizeMb} MB`);
    console.log(`          Duration: ${duration.toFixed(2)} seconds`);
    console.log("=======================================================");
    return outputMp4;
  } else {
    throw new Error(`Output file was not created: ${outputMp4}`);
  }
}

async function main() {
  try {
    // 1. Synthesize audio
    const { segmentDurations, totalAudioDuration, masterAudioFile } =
      await generateAudioSegments();

    // 2. Record browser actions synchronized with segment durations
    const rawVideoPath = await recordSynchronizedWalkthrough(segmentDurations);

    // 3. Merge video and audio into MP4
    const finalMp4Path = mergeVideoAndAudio(rawVideoPath, masterAudioFile);

    // 4. Open Windows Explorer at public/assets/video/
    console.log(`\n[INFO] Opening Windows File Explorer at ${VIDEO_DIR}...`);
    try {
      execSync(`explorer.exe "${VIDEO_DIR}"`);
    } catch (_) {}

    console.log(`\n[COMPLETE] All tasks finished cleanly!`);
    console.log(`Master Video Path: ${finalMp4Path}\n`);
  } catch (err) {
    console.error("[FATAL ERROR]", err);
    process.exit(1);
  }
}

main();
