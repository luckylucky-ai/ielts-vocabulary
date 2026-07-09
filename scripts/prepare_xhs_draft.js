#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const WORKSPACE = path.resolve(__dirname, "..");
const DEFAULT_CREATOR_URL = "https://creator.xiaohongshu.com/";
const DEFAULT_PROFILE_DIR = path.join(WORKSPACE, ".xhs-browser-profile");
const PLAYWRIGHT_MODULE =
  process.env.PLAYWRIGHT_MODULE ||
  "/Users/lucky/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright";

function usage() {
  console.log(`Usage:
  node scripts/prepare_xhs_draft.js --latest [--dry-run]
  node scripts/prepare_xhs_draft.js 14-transportation-and-transit.md

Options:
  --latest                 Use the highest numbered topic that has generated-with-text images.
  --dry-run                Parse title/body/images only; do not open browser.
  --profile-dir <path>     Browser profile dir for reusing Xiaohongshu login.
  --chrome-executable <path>
                          Chrome/Chromium executable. Defaults to installed Chrome on macOS.
  --url <url>              Creator URL to open. Default: ${DEFAULT_CREATOR_URL}
  --no-upload              Fill/copy title/body only; skip image upload.

The script never clicks the final publish button. It stops for manual review.
`);
}

function parseArgs(argv) {
  const args = {
    topicArg: null,
    latest: false,
    dryRun: false,
    noUpload: false,
    profileDir: DEFAULT_PROFILE_DIR,
    chromeExecutable: process.env.CHROME_EXECUTABLE || findChromeExecutable(),
    url: DEFAULT_CREATOR_URL,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === "--help" || a === "-h") {
      args.help = true;
    } else if (a === "--latest") {
      args.latest = true;
    } else if (a === "--dry-run") {
      args.dryRun = true;
    } else if (a === "--no-upload") {
      args.noUpload = true;
    } else if (a === "--profile-dir") {
      args.profileDir = path.resolve(argv[++i]);
    } else if (a === "--chrome-executable") {
      args.chromeExecutable = path.resolve(argv[++i]);
    } else if (a === "--url") {
      args.url = argv[++i];
    } else if (!a.startsWith("--") && !args.topicArg) {
      args.topicArg = a;
    } else {
      throw new Error(`Unknown argument: ${a}`);
    }
  }

  if (!args.help && !args.latest && !args.topicArg) {
    throw new Error("Provide a topic markdown file or --latest.");
  }
  return args;
}

function findChromeExecutable() {
  const candidates = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
  ];
  return candidates.find((candidate) => fs.existsSync(candidate)) || null;
}

function listTopicFiles() {
  return fs
    .readdirSync(WORKSPACE)
    .filter((name) => /^\d+-.+\.md$/.test(name))
    .map((name) => {
      const m = name.match(/^(\d+)-(.+)\.md$/);
      return { name, number: Number(m[1]), slug: `${m[1]}-${m[2]}` };
    })
    .sort((a, b) => a.number - b.number || a.name.localeCompare(b.name));
}

function generatedImagesFor(slug) {
  const dir = path.join(WORKSPACE, "outputs", slug, "generated-with-text");
  if (!fs.existsSync(dir)) return { dir, images: [] };
  const images = fs
    .readdirSync(dir)
    .filter((name) => /\.(png|jpe?g|webp)$/i.test(name))
    .filter((name) => !/^preview/i.test(name))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((name) => path.join(dir, name));
  return { dir, images };
}

function resolveTopic(args) {
  if (args.latest) {
    const candidates = listTopicFiles()
      .map((topic) => ({ ...topic, ...generatedImagesFor(topic.slug) }))
      .filter((topic) => topic.images.length >= 5);
    if (!candidates.length) {
      throw new Error("No numbered topic has at least five generated-with-text images.");
    }
    const topic = candidates[candidates.length - 1];
    return path.join(WORKSPACE, topic.name);
  }
  return path.resolve(WORKSPACE, args.topicArg);
}

function extractPublishingCopy(markdownPath) {
  const text = fs.readFileSync(markdownPath, "utf8");
  const titleMatch = text.match(/\*\*标题：\*\*\s*(.+)/);
  const bodyMatch = text.match(/\*\*正文：\*\*\s*\n([\s\S]+)$/);
  if (!titleMatch) throw new Error(`Cannot find "**标题：**" in ${markdownPath}`);
  if (!bodyMatch) throw new Error(`Cannot find "**正文：**" in ${markdownPath}`);

  const title = titleMatch[1].trim();
  const body = bodyMatch[1]
    .replace(/\r/g, "")
    .split("\n")
    .map((line) =>
      line
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/\*(.*?)\*/g, "$1")
        .replace(/^\s*>+\s?/, "")
        .trimEnd()
    )
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return { title, body };
}

function topicSlugFromPath(markdownPath) {
  const base = path.basename(markdownPath, ".md");
  const m = base.match(/^(\d+-.+)$/);
  if (!m) throw new Error(`Topic file must be numbered like 14-topic.md: ${markdownPath}`);
  return m[1];
}

function createRunPlan(markdownPath) {
  if (!fs.existsSync(markdownPath)) throw new Error(`Markdown not found: ${markdownPath}`);
  const slug = topicSlugFromPath(markdownPath);
  const copy = extractPublishingCopy(markdownPath);
  const { dir, images } = generatedImagesFor(slug);
  if (images.length < 5) {
    throw new Error(`Expected at least 5 generated images in ${dir}; found ${images.length}.`);
  }
  return {
    workspace: WORKSPACE,
    markdownPath,
    slug,
    imageDir: dir,
    images: images.slice(0, 5),
    ...copy,
    logPath: path.join(WORKSPACE, "outputs", slug, "xhs-draft-session.json"),
  };
}

function writeSessionLog(plan, status, extra = {}) {
  fs.writeFileSync(
    plan.logPath,
    JSON.stringify(
      {
        createdAt: new Date().toISOString(),
        status,
        markdownPath: plan.markdownPath,
        title: plan.title,
        body: plan.body,
        images: plan.images,
        ...extra,
      },
      null,
      2
    )
  );
}

function writeManualFallbackFiles(plan) {
  const titlePath = path.join(WORKSPACE, "outputs", plan.slug, "xhs-title.txt");
  const bodyPath = path.join(WORKSPACE, "outputs", plan.slug, "xhs-body.txt");
  const imagesPath = path.join(WORKSPACE, "outputs", plan.slug, "xhs-images.txt");
  fs.writeFileSync(titlePath, plan.title);
  fs.writeFileSync(bodyPath, plan.body);
  fs.writeFileSync(imagesPath, `${plan.images.join("\n")}\n`);
  return { titlePath, bodyPath, imagesPath };
}

function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(question, (answer) => {
    rl.close();
    resolve(answer);
  }));
}

async function fillFirstWorking(page, selectors, value, label) {
  for (const selector of selectors) {
    const locator = page.locator(selector);
    const count = await locator.count().catch(() => 0);
    if (count === 1) {
      await locator.fill(value);
      console.log(`Filled ${label} with selector: ${selector}`);
      return true;
    }
  }
  console.log(`Could not find a unique ${label} field. Copied ${label} to clipboard for manual paste.`);
  await page.context().grantPermissions(["clipboard-read", "clipboard-write"]).catch(() => {});
  await page.evaluate(async (text) => navigator.clipboard.writeText(text), value).catch(() => {});
  return false;
}

async function setFileInput(page, imagePaths) {
  const inputs = page.locator('input[type="file"]');
  const count = await inputs.count().catch(() => 0);
  if (!count) return false;
  for (let i = 0; i < count; i += 1) {
    const input = inputs.nth(i);
    const accept = (await input.getAttribute("accept").catch(() => "")) || "";
    if (!accept || /image|\*/i.test(accept)) {
      await input.setInputFiles(imagePaths);
      console.log(`Uploaded images with file input #${i + 1}.`);
      return true;
    }
  }
  return false;
}

async function runBrowser(plan, args) {
  const { chromium } = require(PLAYWRIGHT_MODULE);
  fs.mkdirSync(args.profileDir, { recursive: true });
  const launchOptions = {
    headless: false,
    viewport: { width: 1440, height: 1000 },
    acceptDownloads: true,
    args: ["--disable-crash-reporter", "--disable-crashpad"],
    env: {
      ...process.env,
      HOME: args.profileDir,
      XDG_CONFIG_HOME: path.join(args.profileDir, ".config"),
      XDG_CACHE_HOME: path.join(args.profileDir, ".cache"),
    },
  };
  if (args.chromeExecutable) {
    launchOptions.executablePath = args.chromeExecutable;
  }
  const context = await chromium.launchPersistentContext(args.profileDir, launchOptions);
  const page = context.pages()[0] || (await context.newPage());

  console.log(`Opening Xiaohongshu creator: ${args.url}`);
  await page.goto(args.url, { waitUntil: "domcontentloaded", timeout: 60000 }).catch(() => {});
  console.log("If a login page appears, scan the code and navigate to the note publishing page.");
  await ask("Press Enter when the publishing editor is visible and ready...");

  const result = {
    urlBeforeFill: page.url(),
    uploadedImages: false,
    titleFilled: false,
    bodyFilled: false,
  };
  result.manualFiles = writeManualFallbackFiles(plan);

  if (!args.noUpload) {
    result.uploadedImages = await setFileInput(page, plan.images);
    if (!result.uploadedImages) {
      console.log("No image file input was found. Click the image upload area manually, then select:");
      plan.images.forEach((img) => console.log(`  ${img}`));
      console.log(`Image path list saved: ${result.manualFiles.imagesPath}`);
    }
  }

  result.titleFilled = await fillFirstWorking(
    page,
    [
      'input[placeholder*="标题"]',
      'textarea[placeholder*="标题"]',
      '[contenteditable="true"][data-placeholder*="标题"]',
      '[contenteditable="true"][placeholder*="标题"]',
    ],
    plan.title,
    "title"
  );

  result.bodyFilled = await fillFirstWorking(
    page,
    [
      'textarea[placeholder*="正文"]',
      'textarea[placeholder*="描述"]',
      'textarea[placeholder*="分享"]',
      '[contenteditable="true"][data-placeholder*="正文"]',
      '[contenteditable="true"][data-placeholder*="描述"]',
      '[contenteditable="true"]',
    ],
    plan.body,
    "body"
  );

  if (!result.titleFilled || !result.bodyFilled) {
    console.log(`Manual title file: ${result.manualFiles.titlePath}`);
    console.log(`Manual body file: ${result.manualFiles.bodyPath}`);
  }

  result.urlAfterFill = page.url();
  writeSessionLog(plan, "prepared-for-review", result);
  console.log(`Session log written: ${plan.logPath}`);
  console.log("Review the page manually. This script will not click publish.");
  await ask("Press Enter to close the browser, or leave this terminal open while you review...");
  await context.close();
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    usage();
    return;
  }

  const markdownPath = resolveTopic(args);
  const plan = createRunPlan(markdownPath);
  console.log(JSON.stringify({
    markdownPath: plan.markdownPath,
    title: plan.title,
    bodyLength: plan.body.length,
    images: plan.images,
    logPath: plan.logPath,
  }, null, 2));

  if (args.dryRun) {
    writeSessionLog(plan, "dry-run");
    console.log(`Dry-run log written: ${plan.logPath}`);
    return;
  }

  await runBrowser(plan, args);
}

main().catch((err) => {
  console.error(err.stack || err.message || String(err));
  process.exit(1);
});
