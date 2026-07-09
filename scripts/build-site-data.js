const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const outputsDir = path.join(root, "outputs");
const siteDir = path.join(root, "site");

function titleCase(slug) {
  return slug
    .replace(/^\d+-/, "")
    .replace(/^SP\d+-/i, "")
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function cleanCell(value) {
  return value.replace(/\*\*/g, "").replace(/<br\s*\/?>/gi, " ").trim();
}

function parseMarkdown(filePath) {
  const text = fs.readFileSync(filePath, "utf8");
  const heading = text.match(/^#\s*(.+)$/m)?.[1]?.replace(/^📚\s*/, "").trim();
  const sections = text.split(/\n---+\n/g);
  const cards = [];

  for (const section of sections) {
    const cardMatch = section.match(/##\s*卡片\s*(\d+)\/\d+\s*[-—]\s*(.+)/);
    if (!cardMatch) continue;

    const cardNumber = Number(cardMatch[1]);
    const subtitle = cardMatch[2].trim();
    const rows = [];
    const lines = section.split("\n");

    for (const line of lines) {
      if (!/^\|\s*\d+\s*\|/.test(line)) continue;
      const cells = line.split("|").slice(1, -1).map(cleanCell);
      if (cells.length < 5) continue;
      rows.push({
        word: cells[1],
        ipa: cells[2],
        pos: cells[3].replace(/\.$/, ""),
        meaning: cells[4],
      });
    }

    cards.push({ cardNumber, subtitle, words: rows });
  }

  return { heading, cards };
}

function findCardImages(topicSlug) {
  const topicDir = path.join(outputsDir, topicSlug);
  if (!fs.existsSync(topicDir)) return new Map();

  const candidates = [];
  const stack = [topicDir];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
      } else if (/card-\d+.*\.png$/i.test(entry.name)) {
        candidates.push(fullPath);
      }
    }
  }

  const score = (filePath) => {
    const rel = path.relative(topicDir, filePath);
    let value = 0;
    if (rel.includes("generated-with-text")) value += 50;
    if (/generated-text\.png$/i.test(rel)) value += 20;
    if (/text-heavier|font-size-adjusted|nodup/i.test(rel)) value += 12;
    if (rel.split(path.sep).length === 1) value += 5;
    if (/preview|background|style/i.test(rel)) value -= 100;
    return value;
  };

  const selected = new Map();
  for (const imagePath of candidates.sort((a, b) => score(b) - score(a))) {
    const cardNumber = Number(path.basename(imagePath).match(/card-(\d+)/i)?.[1]);
    if (!cardNumber || selected.has(cardNumber)) continue;
    selected.set(cardNumber, path.relative(siteDir, imagePath).split(path.sep).join("/"));
  }
  return selected;
}

const topics = fs
  .readdirSync(root)
  .filter((name) => /\.md$/i.test(name) && !name.includes("text-heavier"))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  .map((fileName) => {
    const slug = fileName.replace(/\.md$/i, "");
    const parsed = parseMarkdown(path.join(root, fileName));
    const images = findCardImages(slug);
    const cards = parsed.cards
      .map((card) => ({
        ...card,
        image: images.get(card.cardNumber) || "",
      }))
      .filter((card) => card.image);

    return {
      slug,
      title: parsed.heading || titleCase(slug),
      shortTitle: titleCase(slug),
      cards,
    };
  })
  .filter((topic) => topic.cards.length);

const payload = `window.IELTS_VOCAB_TOPICS = ${JSON.stringify(topics, null, 2)};\n`;
fs.mkdirSync(siteDir, { recursive: true });
fs.writeFileSync(path.join(siteDir, "data.js"), payload);

const imageCount = topics.reduce((total, topic) => total + topic.cards.length, 0);
console.log(`Built ${topics.length} topics and ${imageCount} cards.`);
