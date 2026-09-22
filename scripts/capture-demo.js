/**
 * SchemaCraft AI - Automated 1080p Screenshot & Video Walkthrough Engine
 * Powered by Playwright Chromium
 */

const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const SCREENSHOT_DIR = path.join(__dirname, "../public/assets/screenshots");
const VIDEO_DIR = path.join(__dirname, "../public/assets/video");
const TEMP_VIDEO_DIR = path.join(__dirname, "../public/assets/video/_temp");

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function captureDemo() {
  console.log("==================================================");
  console.log("SchemaCraft AI: Automated Visual Media Capture");
  console.log("==================================================");

  // 1. Ensure target output directories exist
  [SCREENSHOT_DIR, VIDEO_DIR, TEMP_VIDEO_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  const targetUrl = process.env.TARGET_URL || "http://localhost:3000";
  console.log(`[INFO] Launching Chromium (1920x1080)... Target: ${targetUrl}`);

  const browser = await chromium.launch({
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
    recordVideo: {
      dir: TEMP_VIDEO_DIR,
      size: { width: 1920, height: 1080 },
    },
  });

  const page = await context.newPage();

  try {
    console.log(`[STEP 1] Navigating to ${targetUrl}...`);
    try {
      await page.goto(targetUrl, { waitUntil: "networkidle", timeout: 15000 });
    } catch (navErr) {
      console.warn(`[WARN] Localhost nav error, falling back to vercel or domcontentloaded: ${navErr.message}`);
      await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded", timeout: 15000 });
    }

    await sleep(2000);

    // SCREENSHOT 1: Hero & 3NF ERD Models
    console.log("[SCREENSHOT 1] Capturing 01_hero_and_erd.png...");
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "01_hero_and_erd.png"),
      fullPage: false,
    });
    console.log(" ✓ Saved 01_hero_and_erd.png");

    await sleep(1800);

    // SCREENSHOT 2: Click "B2B SaaS Platform" preset pill
    console.log("[STEP 2] Clicking 'B2B SaaS Platform' preset pill...");
    const saasPill = page.locator("button:has-text('B2B SaaS Platform')").first();
    if (await saasPill.isVisible()) {
      await saasPill.click();
    } else {
      console.log("Pill not directly found by text, searching buttons...");
      await page.click("button:has-text('B2B SaaS')");
    }

    await sleep(2200);

    console.log("[SCREENSHOT 2] Capturing 02_domain_presets.png...");
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "02_domain_presets.png"),
      fullPage: false,
    });
    console.log(" ✓ Saved 02_domain_presets.png");

    await sleep(1800);

    // SCREENSHOT 3: Tab navigation to Prisma and PostgreSQL DDL
    console.log("[STEP 3] Navigating to 'PostgreSQL DDL' tab and clicking 'Copy Code'...");
    const postgresTab = page.locator("button:has-text('PostgreSQL DDL')").first();
    await postgresTab.click();
    await sleep(1200);

    const copyBtn = page.locator("button:has-text('Copy Code')").first();
    if (await copyBtn.isVisible()) {
      await copyBtn.click();
      console.log(" ✓ Triggered 'Copy Code' (Toast & active state visible)");
    }

    await sleep(600);

    console.log("[SCREENSHOT 3] Capturing 03_prisma_and_sql.png...");
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "03_prisma_and_sql.png"),
      fullPage: false,
    });
    console.log(" ✓ Saved 03_prisma_and_sql.png");

    await sleep(2000);

    // SCREENSHOT 4: In-Memory Mock API tab & live telemetry
    console.log("[STEP 4] Navigating to 'In-Memory Mock API' tab...");
    const mockApiTab = page.locator("button:has-text('In-Memory Mock API')").first();
    await mockApiTab.click();
    await sleep(1500);

    console.log("[STEP 4b] Clicking 'Send Request' to trigger live sub-6ms telemetry...");
    const sendReqBtn = page.locator("button:has-text('Send Request')").first();
    if (await sendReqBtn.isVisible()) {
      await sendReqBtn.click();
    }
    await sleep(1200);

    console.log("[SCREENSHOT 4] Capturing 04_mock_api_telemetry.png...");
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "04_mock_api_telemetry.png"),
      fullPage: false,
    });
    console.log(" ✓ Saved 04_mock_api_telemetry.png");

    await sleep(2000);

    // SCREENSHOT 5: Hackathon Compliance & Documentation View
    console.log("[STEP 5] Switching to Relational ERD and capturing full studio compliance view...");
    const erdTab = page.locator("button:has-text('Relational ERD & Models')").first();
    await erdTab.click();
    await sleep(1500);

    console.log("[SCREENSHOT 5] Capturing 05_hackathon_compliance.png...");
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "05_hackathon_compliance.png"),
      fullPage: false,
    });
    console.log(" ✓ Saved 05_hackathon_compliance.png");

    await sleep(1500);

    console.log("[INFO] Video recording finishing...");
  } catch (error) {
    console.error("[ERROR] Visual capture failed:", error);
  } finally {
    // Close page and context to flush video
    const video = page.video();
    await page.close();
    await context.close();
    await browser.close();

    if (video) {
      const tempVideoPath = await video.path();
      const finalVideoPath = path.join(VIDEO_DIR, "schemacraft-demo.webm");

      if (fs.existsSync(tempVideoPath)) {
        fs.copyFileSync(tempVideoPath, finalVideoPath);
        console.log(`[SUCCESS] Demo video saved to: ${finalVideoPath}`);
        // Clean up temp dir
        try {
          fs.rmSync(TEMP_VIDEO_DIR, { recursive: true, force: true });
        } catch (_) {}
      }
    }

    console.log("==================================================");
    console.log("Visual assets capture completed successfully!");
    console.log("==================================================");
  }
}

captureDemo();
