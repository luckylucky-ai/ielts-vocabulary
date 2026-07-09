const topics = window.IELTS_VOCAB_TOPICS || [];

const prefsKey = "ielts-vocab-prefs-v1";

function readPrefs() {
  try {
    return JSON.parse(localStorage.getItem(prefsKey)) || {};
  } catch {
    return {};
  }
}

function savePrefs(patch) {
  localStorage.setItem(prefsKey, JSON.stringify({ ...readPrefs(), ...patch }));
}

const prefs = readPrefs();

const state = {
  activeTopic: topics.some((topic) => topic.slug === prefs.activeTopic) ? prefs.activeTopic : "all",
  query: "",
  voices: [],
  selectedVoiceURI: prefs.selectedVoiceURI || "",
  quiz: null,
  modalIndex: -1,
};

const topicSelect = document.querySelector("#topicSelect");
const gallery = document.querySelector("#gallery");
const searchInput = document.querySelector("#searchInput");
const pageTitle = document.querySelector("#pageTitle");
const stats = document.querySelector("#stats");
const voiceSelect = document.querySelector("#voiceSelect");
const toast = document.querySelector("#toast");
const wordTooltip = document.querySelector("#wordTooltip");
const imageModal = document.querySelector("#imageModal");
const modalClose = document.querySelector("#modalClose");
const modalStage = document.querySelector("#modalStage");
const modalImage = document.querySelector("#modalImage");
const modalCaption = document.querySelector("#modalCaption");
const modalWords = document.querySelector("#modalWords");
const modalWordZoom = document.querySelector("#modalWordZoom");
const examMode = document.querySelector("#examMode");
const examCount = document.querySelector("#examCount");
const examStart = document.querySelector("#examStart");
const examBoard = document.querySelector("#examBoard");
const examScore = document.querySelector("#examScore");
const mistakeList = document.querySelector("#mistakeList");
const mistakeClear = document.querySelector("#mistakeClear");
const mistakeRetake = document.querySelector("#mistakeRetake");
const examDrawer = document.querySelector("#examDrawer");
const examBackdrop = document.querySelector("#examBackdrop");
const examClose = document.querySelector("#examClose");
const examEntry = document.querySelector("#examEntry");
const examEntryBadge = document.querySelector("#examEntryBadge");
const modalPrev = document.querySelector("#modalPrev");
const modalNext = document.querySelector("#modalNext");

function allCards() {
  return topics.flatMap((topic) =>
    topic.cards.map((card) => ({
      ...card,
      topicSlug: topic.slug,
      topicTitle: topic.title,
      topicShortTitle: topic.shortTitle,
    })),
  );
}

function wordsForTopic(slug = state.activeTopic) {
  const sourceTopics = slug === "all" ? topics : topics.filter((topic) => topic.slug === slug);
  const seen = new Set();
  return sourceTopics.flatMap((topic) =>
    topic.cards.flatMap((card) =>
      card.words
        .filter((word) => {
          const key = word.word.toLowerCase();
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        })
        .map((word) => ({ ...word, topicTitle: topic.title, cardTitle: card.subtitle })),
    ),
  );
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function normalize(value) {
  return String(value).toLowerCase().trim();
}

function cardMatches(card, query) {
  if (!query) return true;
  const haystack = [
    card.topicTitle,
    card.topicShortTitle,
    card.subtitle,
    ...card.words.flatMap((word) => [word.word, word.ipa, word.pos, word.meaning]),
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(query);
}

function filteredCards() {
  const query = normalize(state.query);
  return allCards().filter((card) => {
    // 有搜索词时跨全部话题查找，避免"在当前话题里搜不到"的困惑
    const topicOk = query ? true : state.activeTopic === "all" || card.topicSlug === state.activeTopic;
    return topicOk && cardMatches(card, query);
  });
}

function renderStats() {
  const wordCount = topics.reduce(
    (sum, topic) => sum + topic.cards.reduce((inner, card) => inner + card.words.length, 0),
    0,
  );
  const cardCount = topics.reduce((sum, topic) => sum + topic.cards.length, 0);
  const mistakeCount = readMistakes().length;
  stats.innerHTML = `
    <div class="stat"><strong>${topics.length}</strong><span>话题</span></div>
    <div class="stat"><strong>${wordCount}</strong><span>可发音单词</span></div>
    <div class="stat"><strong>${cardCount}</strong><span>图片卡片</span></div>
    <div class="stat"><strong>${mistakeCount}</strong><span>待消灭错题</span></div>
  `;
}

function topicLabel(topic) {
  return topic.title || topic.shortTitle;
}

function renderTopics() {
  const options = [
    { slug: "all", title: "全部话题（All Topics）", count: allCards().length },
    ...topics.map((topic) => ({ slug: topic.slug, title: topicLabel(topic), count: topic.cards.length })),
  ];

  topicSelect.innerHTML = options
    .map(
      (topic) => `
        <option value="${escapeHtml(topic.slug)}" ${topic.slug === state.activeTopic ? "selected" : ""}>
          ${escapeHtml(topic.title)} · ${topic.count} 张
        </option>
      `,
    )
    .join("");
}

function renderGallery() {
  const cards = filteredCards();
  const active = topics.find((topic) => topic.slug === state.activeTopic);
  pageTitle.textContent = normalize(state.query)
    ? `搜索结果 · ${cards.length} 张（全部话题）`
    : state.activeTopic === "all"
      ? "雅思话题词汇卡片"
      : active?.title || "雅思话题词汇卡片";

  if (!cards.length) {
    gallery.innerHTML = `<div class="empty">没有找到匹配的卡片，换个关键词试试。</div>`;
    return;
  }

  gallery.innerHTML = cards
    .map((card, index) => {
      const words = card.words
        .map((word) => {
          const tip = `${word.ipa} ${word.pos}. ${word.meaning}`.replace(/\s+/g, " ");
          return `<button class="word-button" data-word="${escapeHtml(word.word)}" data-tip="${escapeHtml(
            tip,
          )}" data-ipa="${escapeHtml(word.ipa)}" data-pos="${escapeHtml(word.pos)}" data-meaning="${escapeHtml(
            word.meaning,
          )}">${escapeHtml(word.word)}</button>`;
        })
        .join("");

      return `
        <article class="vocab-card" data-card data-index="${index}">
          <div class="image-wrap" data-open-image data-image="${escapeHtml(card.image)}" data-caption="${escapeHtml(
            `${card.topicTitle} · ${card.subtitle}`,
          )}">
            <img src="${escapeHtml(card.image)}" alt="${escapeHtml(card.topicShortTitle)} ${escapeHtml(
              card.subtitle,
            )}" loading="lazy" />
            <div class="image-word-zoom" aria-hidden="true">
              <strong></strong>
              <span></span>
            </div>
            <div class="card-label">
              <strong>${escapeHtml(card.subtitle)}</strong>
              <span>${escapeHtml(card.topicShortTitle)} · ${card.words.length} words</span>
            </div>
          </div>
          <div class="card-body">
            <div class="card-title">
              <h3>${escapeHtml(card.subtitle)}</h3>
              <span>${escapeHtml(card.topicShortTitle)}</span>
            </div>
            <div class="word-grid">${words}</div>
          </div>
        </article>
      `;
    })
    .join("");
}

function render() {
  renderTopics();
  renderGallery();
}

function pickDefaultVoice(voices) {
  return (
    voices.find((voice) => /en-GB/i.test(voice.lang)) ||
    voices.find((voice) => /en-US/i.test(voice.lang)) ||
    voices.find((voice) => /^en/i.test(voice.lang)) ||
    voices[0]
  );
}

function loadVoices() {
  state.voices = window.speechSynthesis?.getVoices?.() || [];
  const englishVoices = state.voices.filter((voice) => /^en/i.test(voice.lang));
  const usableVoices = englishVoices.length ? englishVoices : state.voices;
  const chosen = usableVoices.find((voice) => voice.voiceURI === state.selectedVoiceURI) || pickDefaultVoice(usableVoices);
  state.selectedVoiceURI = chosen?.voiceURI || "";

  voiceSelect.innerHTML = usableVoices
    .map(
      (voice) =>
        `<option value="${escapeHtml(voice.voiceURI)}" ${
          voice.voiceURI === state.selectedVoiceURI ? "selected" : ""
        }>${escapeHtml(voice.name)} · ${escapeHtml(voice.lang)}</option>`,
    )
    .join("");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("is-visible"), 1600);
}

function speak(word, button) {
  if (!("speechSynthesis" in window)) {
    showToast("当前浏览器不支持发音功能");
    return;
  }

  window.speechSynthesis.cancel();
  document.querySelectorAll(".word-button.is-speaking").forEach((item) => item.classList.remove("is-speaking"));
  button.classList.add("is-speaking");

  const utterance = new SpeechSynthesisUtterance(word);
  const voice = state.voices.find((item) => item.voiceURI === state.selectedVoiceURI) || pickDefaultVoice(state.voices);
  if (voice) utterance.voice = voice;
  utterance.lang = voice?.lang || "en-GB";
  utterance.rate = 0.82;
  utterance.pitch = 1;
  utterance.onend = () => button.classList.remove("is-speaking");
  utterance.onerror = () => button.classList.remove("is-speaking");
  window.speechSynthesis.speak(utterance);
  showToast(`发音：${word}`);
}

function highlightImageWord(button) {
  const card = button.closest("[data-card]");
  if (!card) return;

  const zoom = card.querySelector(".image-word-zoom");
  const imageWrap = card.querySelector(".image-wrap");
  if (!zoom || !imageWrap) return;

  document.querySelectorAll(".image-word-zoom.is-visible").forEach((item) => {
    if (item !== zoom) item.classList.remove("is-visible");
  });
  document.querySelectorAll(".image-wrap.is-word-focused").forEach((item) => {
    if (item !== imageWrap) item.classList.remove("is-word-focused");
  });

  zoom.querySelector("strong").textContent = button.dataset.word;
  zoom.querySelector("span").textContent = `${button.dataset.ipa} ${button.dataset.pos}. ${button.dataset.meaning}`;
  zoom.classList.remove("is-visible");
  imageWrap.classList.remove("is-word-focused");
  void zoom.offsetWidth;
  zoom.classList.add("is-visible");
  imageWrap.classList.add("is-word-focused");

  clearTimeout(highlightImageWord.timer);
  highlightImageWord.timer = setTimeout(() => {
    zoom.classList.remove("is-visible");
    imageWrap.classList.remove("is-word-focused");
  }, 2600);
}

function moveTooltip(button) {
  if (!wordTooltip) return;
  const rect = button.getBoundingClientRect();
  const margin = 12;
  const desiredLeft = rect.left + rect.width / 2;
  wordTooltip.textContent = button.dataset.tip;
  wordTooltip.classList.add("is-visible");

  const tooltipRect = wordTooltip.getBoundingClientRect();
  const clampedLeft = Math.min(
    window.innerWidth - tooltipRect.width / 2 - margin,
    Math.max(tooltipRect.width / 2 + margin, desiredLeft),
  );
  const topAbove = rect.top - tooltipRect.height - 10;
  const top = topAbove > margin ? topAbove : rect.bottom + 10;
  wordTooltip.style.left = `${clampedLeft}px`;
  wordTooltip.style.top = `${top}px`;
}

function hideTooltip() {
  wordTooltip?.classList.remove("is-visible");
}

function openImageModalByIndex(index) {
  const cards = filteredCards();
  if (!cards.length) return;
  state.modalIndex = ((index % cards.length) + cards.length) % cards.length;
  const card = cards[state.modalIndex];
  const caption = `${card.topicTitle} · ${card.subtitle}`;

  modalImage.src = card.image;
  modalImage.alt = `${card.topicShortTitle} ${card.subtitle}`;
  modalCaption.textContent = `${caption}（${state.modalIndex + 1} / ${cards.length}）`;
  modalWords.innerHTML = card.words
    .map(
      (word) => `
        <button class="modal-word" type="button" data-word="${escapeHtml(word.word)}" data-ipa="${escapeHtml(
          word.ipa,
        )}" data-pos="${escapeHtml(word.pos)}" data-meaning="${escapeHtml(word.meaning)}">
          <strong>${escapeHtml(word.word)}</strong>
          <span>${escapeHtml(word.ipa)} · ${escapeHtml(word.meaning)}</span>
        </button>
      `,
    )
    .join("");
  modalWordZoom.classList.remove("is-visible");
  imageModal.classList.add("is-open");
  imageModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("has-modal");
  updateSpotlight(50, 50);
}

function stepModal(delta) {
  if (!imageModal.classList.contains("is-open")) return;
  openImageModalByIndex(state.modalIndex + delta);
}

function closeImageModal() {
  imageModal.classList.remove("is-open");
  imageModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("has-modal");
  modalImage.removeAttribute("src");
  modalWords.innerHTML = "";
  modalWordZoom.classList.remove("is-visible");
  state.modalIndex = -1;
}

function showModalWord(button) {
  modalWords.querySelectorAll(".modal-word.is-active").forEach((item) => item.classList.remove("is-active"));
  button.classList.add("is-active");
  modalWordZoom.querySelector("strong").textContent = button.dataset.word;
  modalWordZoom.querySelector("span").textContent = `${button.dataset.ipa} ${button.dataset.pos}. ${button.dataset.meaning}`;
  modalWordZoom.classList.remove("is-visible");
  void modalWordZoom.offsetWidth;
  modalWordZoom.classList.add("is-visible");
  speakExamWord(button.dataset.word);
}

function updateSpotlight(xPercent, yPercent) {
  modalStage.style.setProperty("--spot-x", `${xPercent}%`);
  modalStage.style.setProperty("--spot-y", `${yPercent}%`);
}



const mistakeKey = "ielts-vocab-mistakes-v2";
const legacyMistakeKey = "ielts-vocab-mistakes-v1";

// 旧版按话题分桶存储，切话题后错题会"消失"；v2 统一为一个列表
function migrateLegacyMistakes() {
  if (localStorage.getItem(mistakeKey)) return;
  let legacy;
  try {
    legacy = JSON.parse(localStorage.getItem(legacyMistakeKey));
  } catch {
    legacy = null;
  }
  if (!legacy || typeof legacy !== "object") return;
  const merged = [];
  Object.values(legacy).forEach((list) => {
    (Array.isArray(list) ? list : []).forEach((item) => {
      const existing = merged.find((entry) => normalizeAnswer(entry.word) === normalizeAnswer(item.word));
      if (existing) {
        existing.count = (existing.count || 1) + (item.count || 1);
        if ((item.updatedAt || 0) > (existing.updatedAt || 0)) Object.assign(existing, item, { count: existing.count });
      } else {
        merged.push({ ...item });
      }
    });
  });
  merged.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  writeMistakes(merged);
  localStorage.removeItem(legacyMistakeKey);
}

function readMistakes() {
  try {
    const list = JSON.parse(localStorage.getItem(mistakeKey));
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function writeMistakes(list) {
  localStorage.setItem(mistakeKey, JSON.stringify(list));
}

function addMistake(word, givenAnswer) {
  const list = readMistakes();
  const topic = topics.find((item) => item.slug === state.activeTopic);
  const existing = list.find((item) => normalizeAnswer(item.word) === normalizeAnswer(word.word));
  const payload = {
    word: word.word,
    ipa: word.ipa,
    pos: word.pos,
    meaning: word.meaning,
    topicTitle: word.topicTitle || topic?.title || "全部话题",
    cardTitle: word.cardTitle || "",
    lastAnswer: givenAnswer || "",
    updatedAt: Date.now(),
  };
  if (existing) {
    Object.assign(existing, payload, { count: (existing.count || 1) + 1 });
  } else {
    list.unshift({ ...payload, count: 1 });
  }
  writeMistakes(list.sort((a, b) => b.updatedAt - a.updatedAt));
  renderMistakes();
}

function removeMistake(word) {
  const list = readMistakes().filter((item) => normalizeAnswer(item.word) !== normalizeAnswer(word));
  writeMistakes(list);
  renderMistakes();
}

function renderMistakes() {
  if (!mistakeList) return;
  const list = readMistakes();
  mistakeRetake.disabled = !list.length;
  examEntryBadge.hidden = !list.length;
  examEntryBadge.textContent = list.length ? `错题 ${list.length}` : "";
  if (!list.length) {
    mistakeList.innerHTML = `<p class="mistake-empty">还没有错题，考一轮试试。答对错题会自动移出错题本。</p>`;
  } else {
    mistakeList.innerHTML = list
      .map(
        (item) => `
          <div class="mistake-item" data-word="${escapeHtml(item.word)}" role="button" tabindex="0">
            <button class="mistake-remove" type="button" data-remove="${escapeHtml(item.word)}" aria-label="移除 ${escapeHtml(
              item.word,
            )}">×</button>
            <strong>${escapeHtml(item.word)}</strong>
            <span>${escapeHtml(item.ipa)} · ${escapeHtml(item.meaning)}</span>
            <em>错 ${item.count || 1} 次 · ${escapeHtml(item.topicTitle || "")}</em>
          </div>
        `,
      )
      .join("");
  }
  renderStats();
}

function clearAllMistakes() {
  writeMistakes([]);
  renderMistakes();
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function normalizeAnswer(value) {
  return String(value).trim().toLowerCase().replace(/[\s-]+/g, " ");
}

function quizTitle() {
  const topic = topics.find((item) => item.slug === state.activeTopic);
  return topic ? topic.title : "全部话题";
}

function buildQuestion(word, mode, pool) {
  const resolvedMode = mode === "mixed" ? shuffle(["meaning", "pronunciation", "spelling"])[0] : mode;
  const distractors = shuffle(pool.filter((item) => item.word !== word.word)).slice(0, 3);
  return {
    mode: resolvedMode,
    word,
    options: resolvedMode === "spelling" ? [] : shuffle([word, ...distractors]),
  };
}

function renderExamIntro() {
  examScore.textContent = "未开始";
  examBoard.innerHTML = `<p>当前范围：${escapeHtml(quizTitle())}。选择形式和题数后开始。答题可用键盘：1-4 选答案，Enter 下一题。</p>`;
}

function setExamActive(active) {
  document.body.classList.toggle("is-exam-active", Boolean(active));
}

function startQuiz(selectedWords, pool, fromMistakes = false) {
  state.quiz = {
    questions: selectedWords.map((word) => buildQuestion(word, examMode.value, pool)),
    index: 0,
    score: 0,
    answered: false,
    results: [],
    fromMistakes,
  };
  setExamActive(true);
  renderExamQuestion();
}

function startExam() {
  const pool = wordsForTopic();
  if (pool.length < 4) {
    examBoard.innerHTML = `<p>这个话题词汇太少，暂时不能生成选择题。</p>`;
    return;
  }

  const requestedCount = examCount.value === "all" ? pool.length : Number(examCount.value);
  startQuiz(shuffle(pool).slice(0, Math.min(requestedCount, pool.length)), pool);
}

function startMistakeExam() {
  const mistakes = readMistakes();
  if (!mistakes.length) {
    showToast("错题本是空的，先考一轮吧");
    return;
  }
  // 干扰项从全部话题的词库里抽，错题本身作为考题
  const pool = wordsForTopic("all");
  startQuiz(shuffle(mistakes), pool, true);
  showToast(`错题重考：共 ${mistakes.length} 词，答对自动移出错题本`);
}

function modeLabel(mode) {
  return {
    meaning: "看中文选英文",
    pronunciation: "听读音选英文",
    spelling: "拼写填空",
  }[mode];
}

function renderExamQuestion() {
  const quiz = state.quiz;
  if (!quiz) {
    renderExamIntro();
    return;
  }

  if (quiz.index >= quiz.questions.length) {
    const percent = Math.round((quiz.score / quiz.questions.length) * 100);
    const wrongCount = quiz.questions.length - quiz.score;
    examScore.textContent = `${quiz.score}/${quiz.questions.length}`;
    setExamActive(false);
    examBoard.innerHTML = `
      <div class="exam-result">
        <strong>${percent} 分</strong>
        <span>答对 ${quiz.score} / ${quiz.questions.length} 题${wrongCount ? `，${wrongCount} 个错词已记入错题本` : "，全对！"}</span>
        <div class="exam-result-actions">
          <button class="exam-start" type="button" data-exam-restart>再考一次</button>
          ${readMistakes().length ? `<button class="exam-start" type="button" data-exam-retake-mistakes>重考错题</button>` : ""}
        </div>
      </div>
    `;
    return;
  }

  const question = quiz.questions[quiz.index];
  const progress = `${quiz.index + 1}/${quiz.questions.length}`;
  const progressPercent = Math.round((quiz.index / quiz.questions.length) * 100);
  examScore.textContent = `得分 ${quiz.score} · ${progress}`;

  const prompt = {
    meaning: `“${question.word.meaning}” 对应哪个英文单词？`,
    pronunciation: "听发音，选择你听到的英文单词。",
    spelling: `根据中文和音标拼写单词：${question.word.meaning} · ${question.word.ipa}`,
  }[question.mode];

  const body = question.mode === "spelling"
    ? `
      <div class="spelling-row">
        <input id="spellingInput" type="text" autocomplete="off" placeholder="输入英文单词" />
        <button class="exam-start" type="button" data-exam-submit>提交</button>
      </div>
    `
    : `
      <div class="exam-options">
        ${question.options
          .map(
            (option, optionIndex) =>
              `<button class="exam-option" type="button" data-answer="${escapeHtml(option.word)}"><kbd>${
                optionIndex + 1
              }</kbd>${escapeHtml(option.word)}</button>`,
          )
          .join("")}
      </div>
    `;

  examBoard.innerHTML = `
    <div class="exam-question">
      <div class="exam-meta">
        <span>${escapeHtml(modeLabel(question.mode))}${quiz.fromMistakes ? " · 错题重考" : ""}</span>
        <span>${progress}</span>
      </div>
      <div class="exam-progress"><span style="width: ${progressPercent}%"></span></div>
      <h4>${escapeHtml(prompt)}</h4>
      ${question.mode === "pronunciation" ? `<button class="listen-button" type="button" data-exam-play>播放读音</button>` : ""}
      ${body}
      <div class="exam-feedback" id="examFeedback"></div>
    </div>
  `;

  if (question.mode === "pronunciation") speakExamWord(question.word.word);
  if (question.mode === "spelling") document.querySelector("#spellingInput")?.focus();
}

function speakExamWord(word) {
  if (!("speechSynthesis" in window)) {
    showToast("当前浏览器不支持发音功能");
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(word);
  const voice = state.voices.find((item) => item.voiceURI === state.selectedVoiceURI) || pickDefaultVoice(state.voices);
  if (voice) utterance.voice = voice;
  utterance.lang = voice?.lang || "en-GB";
  utterance.rate = 0.82;
  window.speechSynthesis.speak(utterance);
}

function answerExam(value) {
  const quiz = state.quiz;
  if (!quiz || quiz.answered) return;
  const question = quiz.questions[quiz.index];
  const correct = normalizeAnswer(value) === normalizeAnswer(question.word.word);
  quiz.answered = true;
  if (correct) quiz.score += 1;
  quiz.results.push({ word: question.word.word, correct });
  if (!correct) addMistake(question.word, value);
  if (correct && quiz.fromMistakes) removeMistake(question.word.word);
  speakExamWord(question.word.word);

  document.querySelectorAll(".exam-option").forEach((button) => {
    button.disabled = true;
    if (normalizeAnswer(button.dataset.answer) === normalizeAnswer(question.word.word)) button.classList.add("is-correct");
    if (normalizeAnswer(button.dataset.answer) === normalizeAnswer(value) && !correct) button.classList.add("is-wrong");
  });

  const input = document.querySelector("#spellingInput");
  if (input) {
    input.disabled = true;
    input.classList.add(correct ? "is-correct" : "is-wrong");
  }

  const feedback = document.querySelector("#examFeedback");
  feedback.innerHTML = `
    <div class="${correct ? "right" : "wrong"}">
      ${correct ? "答对了" : "再记一次"}：<strong>${escapeHtml(question.word.word)}</strong>
      <span>${escapeHtml(question.word.ipa)} · ${escapeHtml(question.word.meaning)}</span>
    </div>
    <button class="exam-next" type="button" data-exam-next>${
      quiz.index + 1 === quiz.questions.length ? "查看成绩" : "下一题"
    } <kbd>Enter</kbd></button>
  `;
  examScore.textContent = `得分 ${quiz.score} · ${quiz.index + 1}/${quiz.questions.length}`;
}

function nextExamQuestion() {
  if (!state.quiz) return;
  state.quiz.index += 1;
  state.quiz.answered = false;
  renderExamQuestion();
}

function examDrawerOpen() {
  return examDrawer.classList.contains("is-open");
}

function openExamDrawer() {
  examDrawer.classList.add("is-open");
  examDrawer.setAttribute("aria-hidden", "false");
  examBackdrop.hidden = false;
  // 有进行中的考试就恢复画廊虚化
  setExamActive(state.quiz && state.quiz.index < state.quiz.questions.length);
}

function closeExamDrawer() {
  examDrawer.classList.remove("is-open");
  examDrawer.setAttribute("aria-hidden", "true");
  examBackdrop.hidden = true;
  setExamActive(false);
}

function attachEvents() {
  topicSelect.addEventListener("change", (event) => {
    state.activeTopic = event.target.value;
    state.quiz = null;
    setExamActive(false);
    savePrefs({ activeTopic: state.activeTopic });
    render();
    renderExamIntro();
  });

  let searchTimer;
  searchInput.addEventListener("input", (event) => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      state.query = event.target.value;
      renderGallery();
    }, 180);
  });

  examEntry.addEventListener("click", openExamDrawer);
  examClose.addEventListener("click", closeExamDrawer);
  examBackdrop.addEventListener("click", closeExamDrawer);

  examStart.addEventListener("click", startExam);
  mistakeRetake.addEventListener("click", startMistakeExam);

  mistakeList.addEventListener("click", (event) => {
    const remove = event.target.closest("[data-remove]");
    if (remove) {
      removeMistake(remove.dataset.remove);
      return;
    }
    const item = event.target.closest(".mistake-item");
    if (!item) return;
    speakExamWord(item.dataset.word);
  });

  mistakeClear.addEventListener("click", clearAllMistakes);

  examBoard.addEventListener("click", (event) => {
    const option = event.target.closest(".exam-option");
    if (option) {
      answerExam(option.dataset.answer);
      return;
    }

    if (event.target.closest("[data-exam-submit]")) {
      answerExam(document.querySelector("#spellingInput")?.value || "");
      return;
    }

    if (event.target.closest("[data-exam-next]")) {
      nextExamQuestion();
      return;
    }

    if (event.target.closest("[data-exam-restart]")) {
      if (state.quiz?.fromMistakes) {
        startMistakeExam();
      } else {
        startExam();
      }
      return;
    }

    if (event.target.closest("[data-exam-retake-mistakes]")) {
      startMistakeExam();
      return;
    }

    if (event.target.closest("[data-exam-play]")) {
      const question = state.quiz?.questions[state.quiz.index];
      if (question) speakExamWord(question.word.word);
    }
  });

  examBoard.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && event.target.id === "spellingInput") {
      event.stopPropagation();
      answerExam(event.target.value);
    }
  });

  gallery.addEventListener("click", (event) => {
    const button = event.target.closest(".word-button");
    if (button) {
      highlightImageWord(button);
      speak(button.dataset.word, button);
      return;
    }

    // 只有点图片区域才放大，避免点到单词间空隙时误触弹窗
    const imageWrap = event.target.closest("[data-open-image]");
    if (!imageWrap) return;
    const card = imageWrap.closest("[data-card]");
    openImageModalByIndex(Number(card?.dataset.index || 0));
  });

  gallery.addEventListener("pointerover", (event) => {
    const button = event.target.closest(".word-button");
    if (!button) return;
    moveTooltip(button);
  });

  gallery.addEventListener("focusin", (event) => {
    const button = event.target.closest(".word-button");
    if (!button) return;
    moveTooltip(button);
  });

  gallery.addEventListener("pointerout", (event) => {
    const button = event.target.closest(".word-button");
    if (button && !button.contains(event.relatedTarget)) hideTooltip();
  });

  gallery.addEventListener("focusout", (event) => {
    if (event.target.closest(".word-button")) hideTooltip();
  });

  gallery.addEventListener("pointermove", (event) => {
    const button = event.target.closest(".word-button");
    if (button) {
      moveTooltip(button);
      return;
    }
    const card = event.target.closest("[data-card]");
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(900px) rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 5).toFixed(
      2,
    )}deg) translateY(-4px)`;
  });

  gallery.addEventListener("mouseleave", () => {
    hideTooltip();
    document.querySelectorAll("[data-card]").forEach((card) => {
      card.style.transform = "";
    });
  });

  gallery.addEventListener("pointerout", (event) => {
    const card = event.target.closest("[data-card]");
    if (card && !card.contains(event.relatedTarget)) card.style.transform = "";
  });

  voiceSelect.addEventListener("change", (event) => {
    state.selectedVoiceURI = event.target.value;
    savePrefs({ selectedVoiceURI: state.selectedVoiceURI });
  });

  modalClose.addEventListener("click", closeImageModal);
  modalPrev.addEventListener("click", () => stepModal(-1));
  modalNext.addEventListener("click", () => stepModal(1));

  modalWords.addEventListener("click", (event) => {
    const button = event.target.closest(".modal-word");
    if (!button) return;
    showModalWord(button);
  });

  imageModal.addEventListener("click", (event) => {
    if (event.target === imageModal) closeImageModal();
  });

  imageModal.addEventListener("mousemove", (event) => {
    const rect = modalStage.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    updateSpotlight(Math.max(0, Math.min(100, x)), Math.max(0, Math.min(100, y)));
  });

  imageModal.addEventListener("mouseleave", () => updateSpotlight(50, 50));

  document.addEventListener("keydown", (event) => {
    if (imageModal.classList.contains("is-open")) {
      if (event.key === "Escape") closeImageModal();
      if (event.key === "ArrowLeft") stepModal(-1);
      if (event.key === "ArrowRight") stepModal(1);
      return;
    }

    if (event.key === "Escape" && examDrawerOpen()) {
      closeExamDrawer();
      return;
    }

    const quiz = state.quiz;
    if (!quiz || quiz.index >= quiz.questions.length) return;
    const typing = event.target instanceof Element && event.target.matches("input, textarea, select");

    // 答完题按 Enter / 空格进入下一题（拼写框里的 Enter 已被提交逻辑消费）
    if (quiz.answered && !typing && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      nextExamQuestion();
      return;
    }

    // 未作答时按 1-4 选择对应选项
    if (!quiz.answered && !typing && /^[1-4]$/.test(event.key)) {
      const option = examBoard.querySelectorAll(".exam-option")[Number(event.key) - 1];
      if (option) {
        event.preventDefault();
        answerExam(option.dataset.answer);
      }
    }
  });

  if ("speechSynthesis" in window) {
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
  }
}

migrateLegacyMistakes();
renderStats();
renderTopics();
renderGallery();
renderExamIntro();
renderMistakes();
loadVoices();
attachEvents();
