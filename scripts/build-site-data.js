const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

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

function cleanInline(value) {
  return value.replace(/\s+/g, " ").trim();
}

// 从答案区的表格里提取 题号 → { answer, explanation }
function parseAnswerTable(answersText) {
  const map = {};
  for (const line of answersText.split("\n")) {
    const cells = line.split("|").map((cell) => cell.trim());
    if (cells.length < 4) continue;
    // 去掉首尾因 | 分割产生的空串
    const inner = cells.slice(1, -1);
    const number = Number(inner[0]);
    if (!Number.isInteger(number)) continue;
    let answer = inner[1].replace(/\*\*/g, "").trim();
    // Matching Headings 答案形如 "ii — Analysing..."，只取罗马数字键
    const dashSplit = answer.split(/\s+[—–-]\s+/);
    answer = dashSplit[0].trim();
    const explanation = cleanInline(inner.slice(2).join(" · "));
    map[number] = { answer, explanation };
  }
  return map;
}

function detectQuestionType(title) {
  if (/true\s*\/?\s*false|not\s*given|t\s*\/\s*f/i.test(title)) return "tfng";
  if (/heading/i.test(title)) return "headings";
  if (/matching\s*information|which\s*paragraph/i.test(title)) return "matching-info";
  if (/multiple\s*choice|choose.*letter/i.test(title)) return "mcq";
  if (/summary|completion|note|table/i.test(title)) return "summary";
  return "unsupported";
}

// 题目/说明里题号有 `1.` 与 `**1.**` 两种写法；行首统一剥离
const NUMBERED = /^\s*(?:\*\*)?(\d+)[.．](?:\*\*)?\s+(.+)/;

// 说明文字有 `> 引用` 和 `*斜体*` 两种写法
function collectInstruction(block) {
  const parts = [];
  for (const raw of block.split("\n")) {
    const line = raw.trim();
    if (line.startsWith(">")) parts.push(line.replace(/^>\s?/, ""));
    else if (line.startsWith("*") && !line.startsWith("**") && line.endsWith("*") && !line.endsWith("**"))
      parts.push(line.replace(/^\*+|\*+$/g, ""));
  }
  return cleanInline(parts.join(" "));
}

function parseReading(topicSlug) {
  const topicDir = path.join(outputsDir, topicSlug);
  if (!fs.existsSync(topicDir)) return null;
  const mdFile = fs.readdirSync(topicDir).find((name) => /reading.*\.md$/i.test(name));
  if (!mdFile) return null;

  const text = fs.readFileSync(path.join(topicDir, mdFile), "utf8");
  const sections = text.split(/\n(?=##\s)/);
  const sectionByKind = { passage: "", questions: "", answers: "" };
  for (const section of sections) {
    const heading = section.match(/^##\s+(.+)/)?.[1] || "";
    if (/passage/i.test(heading)) sectionByKind.passage = section;
    else if (/answers|explanation/i.test(heading)) sectionByKind.answers = section;
    else if (/questions/i.test(heading)) sectionByKind.questions = section;
  }
  if (!sectionByKind.passage || !sectionByKind.questions) return null;

  // 文章：标题、元信息、A-G 段落（保留 **加粗** 供前端高亮话题词汇）
  const passageTitle = cleanInline(sectionByKind.passage.match(/Passage[:：]\s*(.+)/)?.[1] || "");
  const meta = cleanInline(sectionByKind.passage.match(/\*\((.+?)\)\*/)?.[1] || "");
  const paragraphs = [];
  for (const line of sectionByKind.passage.split("\n")) {
    // 段落标签两种写法都支持：**A.** 或 **A**
    const match = line.match(/^\*\*([A-Z])\.?\*\*\s*(.+)$/);
    if (match) paragraphs.push({ label: match[1], text: match[2].trim() });
  }

  const answerMap = parseAnswerTable(sectionByKind.answers);

  // 题目：按 ### 子块拆分，逐块识别题型
  const groups = [];
  const blocks = sectionByKind.questions.split(/\n(?=###\s)/).slice(1);
  for (const block of blocks) {
    const head = block.match(/###\s*Questions?\s*(\d+)\s*[-–—]\s*(\d+)\s*[:：]\s*(.+)/i);
    if (!head) continue;
    const type = detectQuestionType(head[3]);
    if (type === "unsupported") continue;
    const instruction = collectInstruction(block);
    const group = { type, title: cleanInline(`Questions ${head[1]}-${head[2]}: ${head[3]}`), instruction, questions: [] };

    const lines = block.split("\n");
    // 题目/选项/标题可能整体处在 > 引用块里，匹配前剥离引用符（摘要除外，见下）
    const qlines = lines.map((line) => line.replace(/^\s*>\s?/, ""));

    if (type === "tfng") {
      for (const line of qlines) {
        const q = line.match(NUMBERED);
        if (q) group.questions.push({ number: Number(q[1]), text: cleanInline(q[2]) });
      }
      group.options = ["TRUE", "FALSE", "NOT GIVEN"];
    } else if (type === "headings") {
      // 标题列表两种写法：表格 | i | 文本 | 或 列表 i. 文本
      group.headings = [];
      for (const line of qlines) {
        const table = line.match(/^\|\s*([ivx]+)\s*\|\s*(.+?)\s*\|/i);
        const list = line.match(/^\s*([ivx]+)[.．)]\s+(.+)/i);
        const h = table || list;
        if (h) group.headings.push({ key: h[1].toLowerCase(), text: cleanInline(h[2]) });
        // 题目：6. Paragraph B → ___ / **6.** ... / 6. Paragraph B ______
        const q = line.match(/^\s*(?:\*\*)?(\d+)[.．](?:\*\*)?\s*(?:Paragraph|段落)?\s*([A-Z])\b/);
        if (q) group.questions.push({ number: Number(q[1]), text: `Paragraph ${q[2]}` });
      }
    } else if (type === "matching-info") {
      // "以下信息出现在哪一段"：选项是文章段落字母
      for (const line of qlines) {
        const q = line.match(NUMBERED);
        if (q) group.questions.push({ number: Number(q[1]), text: cleanInline(q[2]) });
      }
      group.paragraphOptions = paragraphs.map((para) => para.label);
    } else if (type === "mcq") {
      // 题干 + 缩进的 A/B/C/D 选项（选项前可能有 - 或 * 列表符号）
      let current = null;
      for (const line of qlines) {
        const opt = line.match(/^\s*[-*]?\s*([A-D])[.．)]\s+(.+)/);
        if (opt && current) {
          current.options.push({ key: opt[1].toUpperCase(), text: cleanInline(opt[2]) });
          continue;
        }
        const q = line.match(NUMBERED);
        if (q) {
          current = { number: Number(q[1]), text: cleanInline(q[2]), options: [] };
          group.questions.push(current);
        }
      }
    } else if (type === "summary") {
      // 摘要正文：排除引用/表格/标题/整行斜体说明，保留含填空的正文
      const bodyLines = lines.filter((line) => {
        const t = line.trim();
        if (!t || t.startsWith(">") || t.startsWith("|") || t.startsWith("###")) return false;
        if (t.startsWith("*") && !t.startsWith("**") && t.endsWith("*") && !t.endsWith("**")) return false;
        return true;
      });
      const raw = bodyLines.join(" ");
      const segments = [];
      // 填空标记多种写法都支持：(10)__ / **10** ___ / ***(10)***___ /
      // **10. \_\_\_**（转义下划线、数字后带句点） / **__(10)__**（下划线在数字两侧）
      const regex = /\*{0,3}(?:\(?(\d+)\)?[.．]?\*{0,3}\s*[\\_]{2,}|[\\_]{2,}\(?(\d+)\)?[\\_]{2,})\*{0,3}/g;
      let lastIndex = 0;
      let m;
      while ((m = regex.exec(raw)) !== null) {
        const num = Number(m[1] || m[2]);
        const before = raw.slice(lastIndex, m.index);
        if (before.trim()) segments.push({ text: cleanInline(before) });
        segments.push({ blank: num });
        group.questions.push({ number: num, text: "" });
        lastIndex = regex.lastIndex;
      }
      const tail = raw.slice(lastIndex);
      if (tail.trim()) segments.push({ text: cleanInline(tail) });
      group.segments = segments;
    }

    // 回填答案与解析
    for (const question of group.questions) {
      const found = answerMap[question.number];
      if (found) {
        question.answer = found.answer;
        question.explanation = found.explanation;
      }
    }
    if (group.questions.length) groups.push(group);
  }

  if (!paragraphs.length || !groups.length) return null;
  const questionCount = groups.reduce((sum, group) => sum + group.questions.length, 0);
  return { title: passageTitle, meta, paragraphs, groups, questionCount };
}

// 单词元信息（词频 level + 高频例句），按小写词全局匹配
let wordMeta = {};
try {
  wordMeta = JSON.parse(fs.readFileSync(path.join(root, "word-meta.json"), "utf8")).words || {};
} catch {
  wordMeta = {};
}

function enrichWord(word) {
  const meta = wordMeta[word.word.toLowerCase().trim()];
  if (!meta) return word;
  const enriched = { ...word, level: meta.level };
  if (meta.example) enriched.example = meta.example;
  return enriched;
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
        words: card.words.map(enrichWord),
        image: images.get(card.cardNumber) || "",
      }))
      .filter((card) => card.image);

    return {
      slug,
      title: parsed.heading || titleCase(slug),
      shortTitle: titleCase(slug),
      cards,
      reading: parseReading(slug),
    };
  })
  .filter((topic) => topic.cards.length);

// ---------- 词频标签完整性检查 ----------
// 每个单词的 level（高频/中频/低频）来自 word-meta.json。若有词缺 level，
// 前端就不会显示频率标签。这里在构建时把缺失的词全部列出来提醒，
// 补进 word-meta.json 后重新构建即可。
{
  const missing = [];
  for (const topic of topics) {
    for (const card of topic.cards) {
      for (const word of card.words) {
        if (!word.level) missing.push(`${topic.slug} / ${word.word}`);
      }
    }
  }
  if (missing.length) {
    console.warn(
      `\n⚠️  有 ${missing.length} 个词缺少 level（词频标签不会显示），请在 word-meta.json 补上：`,
    );
    for (const m of missing) console.warn(`   - ${m}`);
    console.warn("");
  } else {
    console.log("✓ 所有单词都有词频 level 标签。");
  }
}

// ---------- 写作范文 ----------
// 笔记库是唯一数据源；本机构建时自动同步进仓库 essays/，其他环境直接用仓库内容
const essaysSrc = "/Users/lucky/Documents/MyTreasure/My Treasure/雅思/IELTS-essay-visual-cards";
const essaysDir = path.join(root, "essays");

function parseFrontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const data = {};
  let listKey = null;
  for (const line of match[1].split("\n")) {
    const item = line.match(/^\s+-\s+(.+)/);
    if (item && listKey) {
      data[listKey].push(item[1].trim());
      continue;
    }
    const kv = line.match(/^([\w_]+):\s*(.*)$/);
    if (!kv) continue;
    if (kv[2] === "") {
      listKey = kv[1];
      data[listKey] = [];
    } else {
      data[kv[1]] = kv[2].trim();
      listKey = null;
    }
  }
  return data;
}

function essaySections(text) {
  const body = text.replace(/^---\n[\s\S]*?\n---/, "");
  const sections = {};
  for (const block of body.split(/\n(?=##\s)/)) {
    const heading = block.match(/^##\s+(.+)/)?.[1]?.trim();
    if (heading) sections[heading] = block.replace(/^##\s+.+\n?/, "").trim();
  }
  return sections;
}

function parseTableRows(text) {
  return (text || "")
    .split("\n")
    .filter((line) => line.trim().startsWith("|") && !/^\|[\s:-]+\|/.test(line.trim().replace(/\|/g, "|")))
    .map((line) => line.split("|").slice(1, -1).map((cell) => cell.trim()))
    .filter((cells) => cells.length >= 2 && !/^[-\s:]+$/.test(cells[0]) && !/^(Paragraph|Phrase|意义|维度)$/i.test(cells[0]));
}

function parseEssayDir(dirName) {
  const dir = path.join(essaysDir, dirName);
  const mdFile = fs.readdirSync(dir).find((name) => /band8-notes\.md$/i.test(name));
  if (!mdFile) return null;
  const text = fs.readFileSync(path.join(dir, mdFile), "utf8");
  const meta = parseFrontmatter(text);
  const sections = essaySections(text);

  const essayText = sections["Band 8 Sample Essay"] || "";
  const paragraphs = essayText.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const stanceLines = (sections["Core Stance"] || "").split("\n").map((l) => l.trim()).filter(Boolean);
  const structure = parseTableRows(sections["文章结构"]).map((cells) => ({
    paragraph: cells[0],
    functionCn: cells[1],
    point: cells[2] || "",
  }));
  const phrases = parseTableRows(sections["重点短语"]).map((cells) => ({ en: cells[0], cn: cells[1] }));
  const ideas = (sections["观点库"] || "")
    .split("\n")
    .map((line) => line.match(/^-\s+(.+)/)?.[1])
    .filter(Boolean);

  // 全文翻译：逐段，与范文段落一一对应
  const translation = (sections["全文翻译"] || "").split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  // 同义替换：每行一组「意义 → 同义词列表」
  const synonyms = parseTableRows(sections["同义替换"]).map((cells) => ({
    sense: cells[0],
    words: cells[1].split(/[,，]/).map((w) => w.trim()).filter(Boolean),
  }));
  // 得分点：雅思四维 → 这篇的体现
  const scoring = parseTableRows(sections["得分点"]).map((cells) => ({ dimension: cells[0], detail: cells[1] }));

  // 校验：短语必须在范文中逐字出现（供前端高亮）
  for (const phrase of phrases) {
    if (!essayText.toLowerCase().includes(phrase.en.toLowerCase())) {
      console.warn(`⚠ 范文 ${dirName}: 短语 "${phrase.en}" 未在正文中逐字出现，将无法高亮`);
    }
  }
  if (!meta.group) console.warn(`⚠ 范文 ${dirName}: frontmatter 缺 group 字段`);

  return {
    slug: meta.slug || dirName,
    group: meta.group || "other",
    task: meta.task || "task2",
    taskType: meta.task_type || "",
    title: meta.title || dirName,
    titleCn: meta.title_cn || "",
    date: meta.date || "",
    question: sections["Question"] || "",
    questionCn: sections["中文题目"] || "",
    stanceEn: stanceLines[0] || "",
    stanceCn: stanceLines[1] || "",
    paragraphs,
    translation,
    structure,
    phrases,
    synonyms,
    scoring,
    ideas,
    images: (meta.cards || []).map((file) => `../essays/${dirName}/${file}`),
  };
}

function syncAndParseEssays() {
  // 同步：只拷贝 md 和 frontmatter 里列出的卡片图
  if (fs.existsSync(essaysSrc)) {
    for (const entry of fs.readdirSync(essaysSrc, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const srcDir = path.join(essaysSrc, entry.name);
      const mdFile = fs.readdirSync(srcDir).find((name) => /band8-notes\.md$/i.test(name));
      if (!mdFile) continue;
      const text = fs.readFileSync(path.join(srcDir, mdFile), "utf8");
      const meta = parseFrontmatter(text);
      const destDir = path.join(essaysDir, entry.name);
      fs.mkdirSync(destDir, { recursive: true });
      fs.copyFileSync(path.join(srcDir, mdFile), path.join(destDir, mdFile));
      for (const card of meta.cards || []) {
        const srcCard = path.join(srcDir, card);
        if (fs.existsSync(srcCard)) fs.copyFileSync(srcCard, path.join(destDir, card));
        else console.warn(`⚠ 范文 ${entry.name}: 找不到配图 ${card}`);
      }
    }
  }

  if (!fs.existsSync(essaysDir)) return [];
  return fs
    .readdirSync(essaysDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => parseEssayDir(entry.name))
    .filter(Boolean)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

const essays = syncAndParseEssays();

// 两级话题分组：读取 topic-groups.json，给每个话题打上主话题 key
const groupConfig = JSON.parse(fs.readFileSync(path.join(root, "topic-groups.json"), "utf8")).groups;
const slugToGroup = new Map();
for (const group of groupConfig) for (const slug of group.slugs) slugToGroup.set(slug, group.key);

const unmapped = [];
for (const topic of topics) {
  topic.group = slugToGroup.get(topic.slug) || "other";
  if (topic.group === "other") unmapped.push(topic.slug);
}
const groupList = groupConfig.map(({ key, title }) => ({ key, title }));
if (unmapped.length) {
  groupList.push({ key: "other", title: "其他" });
  console.warn(`⚠ 未分组话题（已归入「其他」，请补充 topic-groups.json）: ${unmapped.join(", ")}`);
}

// 口语题库（Part 2 题卡，按主话题 group 归类）
let speaking = {};
try {
  speaking = JSON.parse(fs.readFileSync(path.join(root, "speaking-topics.json"), "utf8")).groups || {};
} catch {
  speaking = {};
}
const speakingCount = Object.values(speaking).reduce((sum, list) => sum + list.length, 0);

const payload =
  `window.IELTS_TOPIC_GROUPS = ${JSON.stringify(groupList, null, 2)};\n` +
  `window.IELTS_VOCAB_TOPICS = ${JSON.stringify(topics, null, 2)};\n` +
  `window.IELTS_ESSAYS = ${JSON.stringify(essays, null, 2)};\n` +
  `window.IELTS_SPEAKING = ${JSON.stringify(speaking, null, 2)};\n`;
fs.mkdirSync(siteDir, { recursive: true });
fs.writeFileSync(path.join(siteDir, "data.js"), payload);

// 缓存刷新：给 index.html 里的 css/js 引用加内容哈希版本号，
// 内容一变哈希就变，浏览器自动拉取新文件，用户不必手动强刷。
function bustCache() {
  const indexPath = path.join(siteDir, "index.html");
  if (!fs.existsSync(indexPath)) return;
  let html = fs.readFileSync(indexPath, "utf8");
  for (const asset of ["styles.css", "data.js", "app.js"]) {
    const assetPath = path.join(siteDir, asset);
    if (!fs.existsSync(assetPath)) continue;
    const hash = crypto.createHash("sha1").update(fs.readFileSync(assetPath)).digest("hex").slice(0, 8);
    const escaped = asset.replace(/\./g, "\\.");
    const regex = new RegExp(`(\\./${escaped})(\\?v=[a-f0-9]+)?`, "g");
    html = html.replace(regex, `./${asset}?v=${hash}`);
  }
  fs.writeFileSync(indexPath, html);
}

bustCache();

const imageCount = topics.reduce((total, topic) => total + topic.cards.length, 0);
const readingCount = topics.filter((topic) => topic.reading).length;
console.log(
  `Built ${topics.length} topics, ${imageCount} cards, ${readingCount} reading passages, ${essays.length} essays, ${speakingCount} speaking cards.`,
);
