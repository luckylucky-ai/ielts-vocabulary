const topics = window.IELTS_VOCAB_TOPICS || [];
const essays = window.IELTS_ESSAYS || [];

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
  mistakeFilter: prefs.mistakeFilter === "all" ? "all" : "topic",
  reading: null,
  expandedGroup: prefs.expandedGroup || "",
};

// 恢复上次话题时展开它所在的主话题
if (state.activeTopic !== "all") {
  const activeGroup = topics.find((topic) => topic.slug === state.activeTopic)?.group;
  if (activeGroup) state.expandedGroup = activeGroup;
}

const topicList = document.querySelector("#topicList");
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
const mistakeFilter = document.querySelector("#mistakeFilter");
const mistakeRetake = document.querySelector("#mistakeRetake");
const examDrawer = document.querySelector("#examDrawer");
const examBackdrop = document.querySelector("#examBackdrop");
const examClose = document.querySelector("#examClose");
const modalPrev = document.querySelector("#modalPrev");
const modalNext = document.querySelector("#modalNext");
const magnifier = document.querySelector("#magnifier");
const groupEyebrow = document.querySelector("#groupEyebrow");
const workbenchActions = document.querySelector("#workbenchActions");
const speakingModal = document.querySelector("#speakingModal");
const speakingClose = document.querySelector("#speakingClose");
const speakingGroupTitle = document.querySelector("#speakingGroupTitle");
const speakingList = document.querySelector("#speakingList");
const speakingRandom = document.querySelector("#speakingRandom");
const speakingCue = document.querySelector("#speakingCue");
const speakingRecord = document.querySelector("#speakingRecord");
const speakingTimer = document.querySelector("#speakingTimer");
const speakingTranscript = document.querySelector("#speakingTranscript");
const speakingCopy = document.querySelector("#speakingCopy");
const speakingReset = document.querySelector("#speakingReset");
const tipButton = document.querySelector("#tipButton");
const tipModal = document.querySelector("#tipModal");
const tipClose = document.querySelector("#tipClose");
const tipTabs = document.querySelector("#tipTabs");
const tipQr = document.querySelector("#tipQr");
const readingModal = document.querySelector("#readingModal");
const readingClose = document.querySelector("#readingClose");
const readingPassage = document.querySelector("#readingPassage");
const readingHeading = document.querySelector("#readingHeading");
const readingScore = document.querySelector("#readingScore");
const readingQuestions = document.querySelector("#readingQuestions");
const readingSubmit = document.querySelector("#readingSubmit");
const readingReset = document.querySelector("#readingReset");
const essayListDrawer = document.querySelector("#essayListDrawer");
const essayListBackdrop = document.querySelector("#essayListBackdrop");
const essayListClose = document.querySelector("#essayListClose");
const essayList = document.querySelector("#essayList");
const essayModal = document.querySelector("#essayModal");
const essayClose = document.querySelector("#essayClose");
const essayPassage = document.querySelector("#essayPassage");
const essayHeading = document.querySelector("#essayHeading");
const essayType = document.querySelector("#essayType");
const essayPanel = document.querySelector("#essayPanel");

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

// 列表里只显示中文名；标题里的英文部分有 "（…）"、"(…)"、"| …" 几种写法
function topicLabel(topic) {
  const title = topic.title || topic.shortTitle || "";
  // 英文部分的分隔方式有（、(、| 和纯空格四种
  const base = title.split(/（|\(|\||\s+[A-Za-z]/)[0].trim();
  // 第二轮进阶批次与第一轮同名，加 Ⅱ 区分
  return /round2$/i.test(topic.slug) ? `${base} Ⅱ` : base;
}

function topicGroupOf(slug) {
  return topics.find((topic) => topic.slug === slug)?.group || "";
}

function renderTopicLink(topic) {
  return `
    <button class="topic-link ${topic.slug === state.activeTopic ? "is-active" : ""}" type="button" data-topic="${escapeHtml(
      topic.slug,
    )}">
      <span>${escapeHtml(topic.title)}</span>
      <em>${topic.count}</em>
    </button>
  `;
}

function renderTopics() {
  const groups = window.IELTS_TOPIC_GROUPS || [];
  const allRow = renderTopicLink({ slug: "all", title: "全部话题", count: allCards().length });

  const groupRows = groups
    .map((group) => {
      const groupTopics = topics
        .filter((topic) => topic.group === group.key)
        .sort((a, b) => a.slug.localeCompare(b.slug)); // 第一轮排在 round2 前
      const groupEssays = essays.filter((essay) => essay.group === group.key);
      if (!groupTopics.length && !groupEssays.length) return "";
      const cardCount = groupTopics.reduce((sum, topic) => sum + topic.cards.length, 0);
      const expanded = state.expandedGroup === group.key;
      const links = groupTopics
        .map((topic) => renderTopicLink({ slug: topic.slug, title: topicLabel(topic), count: topic.cards.length }))
        .join("");
      const essayLinks = groupEssays
        .map(
          (essay) => `
            <button class="essay-link" type="button" data-essay="${escapeHtml(essay.slug)}">
              <span><i>范文</i>${escapeHtml(essay.titleCn || essay.title)}</span>
              <em>Task 2</em>
            </button>
          `,
        )
        .join("");
      const meta = `${groupTopics.length} 话题${groupEssays.length ? ` · ${groupEssays.length} 范文` : ""} · ${cardCount} 卡`;
      return `
        <div class="topic-group ${expanded ? "is-expanded" : ""}" data-group="${escapeHtml(group.key)}">
          <button class="topic-group-head" type="button" data-group-toggle="${escapeHtml(group.key)}" aria-expanded="${expanded}">
            <i class="topic-group-caret" aria-hidden="true"></i>
            <span>${escapeHtml(group.title)}</span>
            <em>${meta}</em>
          </button>
          <div class="topic-group-body" ${expanded ? "" : "hidden"}>${links}${essayLinks}</div>
        </div>
      `;
    })
    .join("");

  topicList.innerHTML = allRow + groupRows;
}

function renderGallery() {
  const cards = filteredCards();

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
            <img class="is-loading" src="${escapeHtml(card.image)}" alt="${escapeHtml(card.topicShortTitle)} ${escapeHtml(
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
  renderWorkbench();
}

// 阅读练习是话题专属的：只在选中某个带阅读的话题时提供入口
function currentReading() {
  const topic = topics.find((item) => item.slug === state.activeTopic);
  return topic?.reading || null;
}

// 写作范文挂在主话题（group）上：当前话题所属 group 的范文；「全部话题」时是全部范文
function currentEssays() {
  if (state.activeTopic === "all") return essays;
  const topic = topics.find((item) => item.slug === state.activeTopic);
  return topic ? essays.filter((essay) => essay.group === topic.group) : [];
}

// 口语题也挂主话题：当前话题所属 group 的 Part 2 题卡；「全部话题」时汇总全部
function currentSpeaking() {
  const groups = window.IELTS_SPEAKING || {};
  if (state.activeTopic === "all") {
    return Object.entries(groups).flatMap(([key, list]) => list.map((card) => ({ ...card, group: key })));
  }
  const topic = topics.find((item) => item.slug === state.activeTopic);
  return topic && groups[topic.group] ? groups[topic.group].map((card) => ({ ...card, group: topic.group })) : [];
}

// 话题工作台头部：话题名 + 该话题可练的技能动作
function renderWorkbench() {
  const query = normalize(state.query);
  const topic = topics.find((item) => item.slug === state.activeTopic);
  const group = topic ? (window.IELTS_TOPIC_GROUPS || []).find((g) => g.key === topic.group) : null;

  if (query) {
    groupEyebrow.hidden = true;
    pageTitle.textContent = `搜索结果 · ${filteredCards().length} 张（全部话题）`;
    workbenchActions.innerHTML = "";
    return;
  }

  groupEyebrow.hidden = !group;
  if (group) groupEyebrow.textContent = group.title;
  pageTitle.textContent = state.activeTopic === "all" ? "全部话题" : topic?.title || "雅思话题词汇卡片";

  const wordCount = wordsForTopic().length;
  const reading = currentReading();
  const topicEssays = currentEssays();

  // 上排：这个子话题的技能（词汇 / 阅读）
  const topicActions = [
    `<button class="wb-action wb-exam" type="button" data-wb="exam">
      <i class="wb-dot" aria-hidden="true"></i>单词考试<em>${wordCount} 词</em>
    </button>`,
  ];
  if (reading) {
    topicActions.push(`<button class="wb-action wb-reading" type="button" data-wb="reading">
      <i class="wb-dot" aria-hidden="true"></i>阅读练习<em>${reading.questionCount} 题</em>
    </button>`);
  }

  // 下排：所在大类共享的技能（写作 / 口语），雅思按大话题出题
  const topicSpeaking = currentSpeaking();
  const sharedActions = [];
  if (topicEssays.length) {
    sharedActions.push(`<button class="wb-action wb-essay" type="button" data-wb="essay">
      <i class="wb-dot" aria-hidden="true"></i>写作范文<em>${topicEssays.length} 篇</em>
    </button>`);
  }
  if (topicSpeaking.length) {
    sharedActions.push(`<button class="wb-action wb-speaking" type="button" data-wb="speaking">
      <i class="wb-dot" aria-hidden="true"></i>口语练习<em>${topicSpeaking.length} 题</em>
    </button>`);
  }

  const sharedLabel =
    state.activeTopic === "all" ? "全部话题共享" : group ? `${escapeHtml(group.title)} · 大类共享` : "大类共享";

  workbenchActions.innerHTML = `
    <div class="wb-group">
      <p class="wb-group-label"><span class="wb-group-scope">这个子话题</span></p>
      <div class="wb-row">${topicActions.join("")}</div>
    </div>
    ${
      sharedActions.length
        ? `<div class="wb-group wb-group-shared">
            <p class="wb-group-label"><span class="wb-group-scope">${sharedLabel}</span><span class="wb-group-note">雅思写作口语按大话题出题</span></p>
            <div class="wb-row">${sharedActions.join("")}</div>
          </div>`
        : ""
    }
  `;
}

function openEssayFromWorkbench() {
  const list = currentEssays();
  if (list.length === 1) openEssay(list[0].slug);
  else if (list.length > 1) openEssayList();
}

const reducedMotionQuery = window.matchMedia?.("(prefers-reduced-motion: reduce)");
function prefersReducedMotion() {
  return Boolean(reducedMotionQuery?.matches);
}

// 文章里的 **词** 是话题词汇，转成高亮
function markdownBold(text) {
  return escapeHtml(text).replace(/\*\*(.+?)\*\*/g, '<mark class="reading-term">$1</mark>');
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
  modalPrev.hidden = false;
  modalNext.hidden = false;
  imageModal.classList.remove("is-single");
  imageModal.classList.add("is-open");
  imageModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("has-modal");
  hideMagnifier();
}

// 直接查看一张指定图片（范文图卡等）：无前后翻页、无单词右栏，图片居中铺满
function openImageDirect(src, caption) {
  state.modalIndex = -1;
  modalImage.src = src;
  modalImage.alt = caption || "";
  modalCaption.textContent = caption || "";
  modalWords.innerHTML = "";
  modalWordZoom.classList.remove("is-visible");
  modalPrev.hidden = true;
  modalNext.hidden = true;
  imageModal.classList.add("is-single");
  imageModal.classList.add("is-open");
  imageModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("has-modal");
  hideMagnifier();
}

function stepModal(delta) {
  if (!imageModal.classList.contains("is-open") || state.modalIndex < 0) return;
  openImageModalByIndex(state.modalIndex + delta);
}

function closeImageModal() {
  imageModal.classList.remove("is-open");
  imageModal.setAttribute("aria-hidden", "true");
  // 大图可能叠在范文/阅读弹窗之上，底下还有弹窗时保持锁定页面滚动
  if (!essayModal.classList.contains("is-open") && !readingModal.classList.contains("is-open")) {
    document.body.classList.remove("has-modal");
  }
  modalImage.removeAttribute("src");
  modalWords.innerHTML = "";
  modalWordZoom.classList.remove("is-visible");
  hideMagnifier();
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

// 放大镜泡泡：镜片背景用同一张图，按缩放比例反向偏移，露出鼠标所在的局部
const magnifierZoom = 2.2;

function hideMagnifier() {
  magnifier.classList.remove("is-visible");
}

// object-fit: contain 会在 img 元素框内留白边，这里算出画面实际占据的矩形
function modalImageContentRect() {
  const box = modalImage.getBoundingClientRect();
  const naturalRatio = modalImage.naturalWidth / modalImage.naturalHeight;
  if (!naturalRatio || !box.width || !box.height) return null;
  const boxRatio = box.width / box.height;
  if (naturalRatio > boxRatio) {
    const height = box.width / naturalRatio;
    return { left: box.left, top: box.top + (box.height - height) / 2, width: box.width, height };
  }
  const width = box.height * naturalRatio;
  return { left: box.left + (box.width - width) / 2, top: box.top, width, height: box.height };
}

function updateMagnifier(event) {
  if (!modalImage.src || !modalImage.naturalWidth) {
    hideMagnifier();
    return;
  }
  const imgRect = modalImageContentRect();
  const inside =
    imgRect &&
    event.clientX >= imgRect.left &&
    event.clientX <= imgRect.left + imgRect.width &&
    event.clientY >= imgRect.top &&
    event.clientY <= imgRect.top + imgRect.height;
  if (!inside) {
    hideMagnifier();
    return;
  }
  const stageRect = modalStage.getBoundingClientRect();
  const radius = magnifier.offsetWidth / 2;
  const x = event.clientX - imgRect.left;
  const y = event.clientY - imgRect.top;
  magnifier.style.left = `${event.clientX - stageRect.left}px`;
  magnifier.style.top = `${event.clientY - stageRect.top}px`;
  magnifier.style.backgroundImage = `url("${modalImage.src}")`;
  magnifier.style.backgroundSize = `${imgRect.width * magnifierZoom}px ${imgRect.height * magnifierZoom}px`;
  magnifier.style.backgroundPosition = `${radius - x * magnifierZoom}px ${radius - y * magnifierZoom}px`;
  magnifier.classList.add("is-visible");
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

// 错题范围：跟随当前话题，或全部。在"全部话题"浏览时两者等价
function visibleMistakes() {
  const list = readMistakes();
  if (state.mistakeFilter === "all" || state.activeTopic === "all") return list;
  const topic = topics.find((item) => item.slug === state.activeTopic);
  if (!topic) return list;
  return list.filter((item) => item.topicTitle === topic.title);
}

function renderMistakes() {
  if (!mistakeList) return;
  const all = readMistakes();
  const list = visibleMistakes();

  mistakeFilter.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.filter === state.mistakeFilter);
  });

  mistakeRetake.disabled = !list.length;
  mistakeClear.disabled = !list.length;

  if (!list.length) {
    const hint =
      all.length && state.mistakeFilter === "topic"
        ? `当前话题没有错题，其他话题还有 ${all.length} 条，切"全部话题"查看。`
        : "还没有错题，考一轮试试。答对错题会自动移出错题本。";
    mistakeList.innerHTML = `<p class="mistake-empty">${hint}</p>`;
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

function clearVisibleMistakes() {
  const remaining = new Set(visibleMistakes().map((item) => normalizeAnswer(item.word)));
  writeMistakes(readMistakes().filter((item) => !remaining.has(normalizeAnswer(item.word))));
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
  const mistakes = visibleMistakes();
  if (!mistakes.length) {
    showToast("这个范围内没有错题");
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
    pronunciation: "听读音选中文",
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
          ${visibleMistakes().length ? `<button class="exam-start" type="button" data-exam-retake-mistakes>重考错题</button>` : ""}
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
    pronunciation: "听发音，选择正确的中文词义。",
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
              }</kbd>${escapeHtml(question.mode === "pronunciation" ? option.meaning : option.word)}</button>`,
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

// ---------- 阅读练习 ----------

function renderReadingPassage(reading) {
  const paragraphs = reading.paragraphs
    .map(
      (para) =>
        `<p class="reading-para"><span class="reading-para-label">${escapeHtml(para.label)}</span>${markdownBold(
          para.text,
        )}</p>`,
    )
    .join("");
  readingPassage.innerHTML = `
    <div class="reading-passage-head">
      <p class="eyebrow">Passage</p>
      <h2>${escapeHtml(reading.title)}</h2>
      ${reading.meta ? `<p class="reading-meta">${escapeHtml(reading.meta)}</p>` : ""}
    </div>
    ${paragraphs}
  `;
}

function renderReadingQuestions(reading) {
  readingQuestions.innerHTML = reading.groups
    .map((group) => {
      let body = "";
      if (group.type === "tfng") {
        body = group.questions
          .map(
            (q) => `
              <div class="reading-q" data-qnum="${q.number}">
                <p class="reading-q-text"><b>${q.number}.</b> ${escapeHtml(q.text)}</p>
                <div class="reading-choices">
                  ${group.options
                    .map(
                      (opt) =>
                        `<button class="reading-choice" type="button" data-value="${escapeHtml(opt)}">${escapeHtml(
                          opt,
                        )}</button>`,
                    )
                    .join("")}
                </div>
                <div class="reading-explain" hidden></div>
              </div>`,
          )
          .join("");
      } else if (group.type === "headings") {
        const headingRef = group.headings
          .map((h) => `<li><b>${escapeHtml(h.key)}.</b> ${escapeHtml(h.text)}</li>`)
          .join("");
        const options = group.headings
          .map((h) => `<option value="${escapeHtml(h.key)}">${escapeHtml(h.key)}. ${escapeHtml(h.text)}</option>`)
          .join("");
        body = `
          <ul class="reading-heading-ref">${headingRef}</ul>
          ${group.questions
            .map(
              (q) => `
              <div class="reading-q reading-q-row" data-qnum="${q.number}">
                <p class="reading-q-text"><b>${q.number}.</b> ${escapeHtml(q.text)}</p>
                <select class="reading-select">
                  <option value="">选择标题…</option>
                  ${options}
                </select>
                <div class="reading-explain" hidden></div>
              </div>`,
            )
            .join("")}
        `;
      } else if (group.type === "summary") {
        const inline = group.segments
          .map((seg) =>
            seg.blank
              ? `<span class="reading-blank-wrap" data-qnum="${seg.blank}"><input class="reading-blank" type="text" autocomplete="off" data-qnum="${seg.blank}" /><span class="reading-blank-num">${seg.blank}</span></span>`
              : `<span>${markdownBold(seg.text)}</span>`,
          )
          .join(" ");
        const explains = group.questions
          .map((q) => `<div class="reading-explain reading-explain-summary" data-qnum="${q.number}" hidden></div>`)
          .join("");
        body = `<p class="reading-summary">${inline}</p>${explains}`;
      } else if (group.type === "mcq") {
        body = group.questions
          .map(
            (q) => `
              <div class="reading-q" data-qnum="${q.number}">
                <p class="reading-q-text"><b>${q.number}.</b> ${escapeHtml(q.text)}</p>
                <div class="reading-choices reading-choices-col">
                  ${q.options
                    .map(
                      (opt) =>
                        `<button class="reading-choice reading-choice-mc" type="button" data-value="${escapeHtml(
                          opt.key,
                        )}"><b>${escapeHtml(opt.key)}</b> ${escapeHtml(opt.text)}</button>`,
                    )
                    .join("")}
                </div>
                <div class="reading-explain" hidden></div>
              </div>`,
          )
          .join("");
      } else if (group.type === "matching-info") {
        const options = (group.paragraphOptions || [])
          .map((label) => `<option value="${escapeHtml(label)}">段落 ${escapeHtml(label)}</option>`)
          .join("");
        body = group.questions
          .map(
            (q) => `
              <div class="reading-q reading-q-row" data-qnum="${q.number}">
                <p class="reading-q-text"><b>${q.number}.</b> ${escapeHtml(q.text)}</p>
                <select class="reading-select">
                  <option value="">选择段落…</option>
                  ${options}
                </select>
                <div class="reading-explain" hidden></div>
              </div>`,
          )
          .join("");
      }

      return `
        <section class="reading-group">
          <h4>${escapeHtml(group.title)}</h4>
          ${group.instruction ? `<p class="reading-instruction">${escapeHtml(group.instruction)}</p>` : ""}
          ${body}
        </section>
      `;
    })
    .join("");
}

function openReading() {
  const reading = currentReading();
  if (!reading) return;
  state.reading = { data: reading, submitted: false };
  readingHeading.textContent = reading.title;
  readingScore.textContent = `${reading.questionCount} 题 · 未提交`;
  renderReadingPassage(reading);
  renderReadingQuestions(reading);
  readingSubmit.hidden = false;
  readingModal.classList.add("is-open");
  readingModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("has-modal");
  readingPassage.scrollTop = 0;
  readingQuestions.scrollTop = 0;
}

function closeReading() {
  readingModal.classList.remove("is-open");
  readingModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("has-modal");
  state.reading = null;
}

function collectReadingAnswer(qnum) {
  const scope = readingQuestions;
  const tfngBtn = scope.querySelector(`.reading-q[data-qnum="${qnum}"] .reading-choice.is-picked`);
  if (tfngBtn) return tfngBtn.dataset.value;
  const select = scope.querySelector(`.reading-q[data-qnum="${qnum}"] .reading-select`);
  if (select) return select.value;
  const blank = scope.querySelector(`.reading-blank[data-qnum="${qnum}"]`);
  if (blank) return blank.value;
  return "";
}

function answersMatch(a, b) {
  return normalizeAnswer(a) === normalizeAnswer(b);
}

function submitReading() {
  const reading = state.reading?.data;
  if (!reading || state.reading.submitted) return;
  let correctCount = 0;
  const total = reading.questionCount;

  reading.groups.forEach((group) => {
    group.questions.forEach((q) => {
      const given = collectReadingAnswer(q.number);
      const isCorrect = given !== "" && answersMatch(given, q.answer || "");
      if (isCorrect) correctCount += 1;

      // 标记选择题/下拉/填空的对错
      const qBlock = readingQuestions.querySelector(`.reading-q[data-qnum="${q.number}"]`);
      const usesChoices = group.type === "tfng" || group.type === "mcq";
      const usesSelect = group.type === "headings" || group.type === "matching-info";
      if (usesChoices && qBlock) {
        qBlock.querySelectorAll(".reading-choice").forEach((btn) => {
          btn.disabled = true;
          if (answersMatch(btn.dataset.value, q.answer)) btn.classList.add("is-correct");
          else if (btn.classList.contains("is-picked")) btn.classList.add("is-wrong");
        });
      } else if (usesSelect && qBlock) {
        const select = qBlock.querySelector(".reading-select");
        select.disabled = true;
        select.classList.add(isCorrect ? "is-correct" : "is-wrong");
      } else if (group.type === "summary") {
        const blank = readingQuestions.querySelector(`.reading-blank[data-qnum="${q.number}"]`);
        if (blank) {
          blank.disabled = true;
          blank.classList.add(isCorrect ? "is-correct" : "is-wrong");
        }
      }

      // 解析（填空的解析块在段落下方，其余在题内）
      const explain =
        (qBlock && qBlock.querySelector(".reading-explain")) ||
        readingQuestions.querySelector(`.reading-explain-summary[data-qnum="${q.number}"]`);
      if (explain) {
        explain.hidden = false;
        explain.innerHTML = `
          <span class="reading-verdict ${isCorrect ? "right" : "wrong"}">${
            isCorrect ? "✓ 正确" : "✕ 正确答案：" + escapeHtml(q.answer || "-")
          }</span>
          ${q.explanation ? `<span class="reading-explain-text">${escapeHtml(q.explanation)}</span>` : ""}
        `;
      }
    });
  });

  state.reading.submitted = true;
  const percent = Math.round((correctCount / total) * 100);
  readingScore.textContent = `${correctCount}/${total} · ${percent} 分`;
  readingSubmit.hidden = true;
  showToast(`阅读批改完成：答对 ${correctCount}/${total}`);
}

// ---------- 写作范文 ----------

// 在范文原文里高亮重点短语：先按原文位置找出所有不重叠的匹配区间（长短语优先），再拼 HTML
function highlightEssayPhrases(text, phrases) {
  const ranges = [];
  const lower = text.toLowerCase();
  const sorted = [...phrases].sort((a, b) => b.en.length - a.en.length);
  for (const phrase of sorted) {
    const needle = phrase.en.toLowerCase();
    if (!needle) continue;
    let idx = 0;
    while ((idx = lower.indexOf(needle, idx)) !== -1) {
      const end = idx + needle.length;
      if (!ranges.some((r) => idx < r.end && end > r.start)) ranges.push({ start: idx, end, cn: phrase.cn });
      idx = end;
    }
  }
  ranges.sort((a, b) => a.start - b.start);
  let html = "";
  let pos = 0;
  for (const range of ranges) {
    html += escapeHtml(text.slice(pos, range.start));
    html += `<mark class="essay-phrase" data-tip="${escapeHtml(range.cn)}">${escapeHtml(text.slice(range.start, range.end))}</mark>`;
    pos = range.end;
  }
  html += escapeHtml(text.slice(pos));
  return html;
}

function openEssay(slug) {
  const essay = essays.find((item) => item.slug === slug);
  if (!essay) return;

  essayHeading.textContent = essay.titleCn || essay.title;
  essayType.textContent = essay.taskType || "Task 2";

  const paragraphs = essay.paragraphs
    .map((text, index) => {
      const row = essay.structure[index];
      const label = row
        ? `<p class="essay-para-label">${escapeHtml(row.paragraph)} · ${escapeHtml(row.functionCn)}</p>`
        : "";
      const zh = essay.translation[index];
      const translation = zh ? `<p class="essay-translation">${escapeHtml(zh)}</p>` : "";
      return `${label}<p class="reading-para essay-para">${highlightEssayPhrases(text, essay.phrases)}</p>${translation}`;
    })
    .join("");

  const hasTranslation = essay.translation.length > 0;
  essayPassage.classList.remove("show-translation");
  essayPassage.innerHTML = `
    <div class="reading-passage-head">
      <p class="eyebrow">Writing Task 2 · ${escapeHtml(essay.taskType)}</p>
      <h2>${escapeHtml(essay.title)}</h2>
      ${hasTranslation ? `<button class="essay-trans-toggle" id="essayTransToggle" type="button">显示译文</button>` : ""}
    </div>
    <div class="essay-question">
      <p>${escapeHtml(essay.question).replace(/\n{2,}/g, "</p><p>")}</p>
      ${essay.questionCn ? `<p class="essay-question-cn">${escapeHtml(essay.questionCn)}</p>` : ""}
    </div>
    <div class="essay-stance">
      <strong>${escapeHtml(essay.stanceEn)}</strong>
      <span>${escapeHtml(essay.stanceCn)}</span>
    </div>
    ${paragraphs}
  `;

  essayPanel.innerHTML = `
    <section class="reading-group">
      <h4>重点短语 <span class="essay-hint">点击发音，文中同步高亮</span></h4>
      <div class="essay-phrase-list">
        ${essay.phrases
          .map(
            (phrase) => `
              <button class="modal-word essay-phrase-item" type="button" data-word="${escapeHtml(phrase.en)}">
                <strong>${escapeHtml(phrase.en)}</strong>
                <span>${escapeHtml(phrase.cn)}</span>
              </button>
            `,
          )
          .join("")}
      </div>
    </section>
    ${
      essay.synonyms.length
        ? `
          <section class="reading-group">
            <h4>同义替换 <span class="essay-hint">同一组可互换，点词发音</span></h4>
            <div class="essay-syn-list">
              ${essay.synonyms
                .map(
                  (group) => `
                    <div class="essay-syn">
                      <span class="essay-syn-sense">${escapeHtml(group.sense)}</span>
                      <div class="essay-syn-words">
                        ${group.words
                          .map(
                            (word) =>
                              `<button class="essay-syn-word" type="button" data-word="${escapeHtml(word)}">${escapeHtml(
                                word,
                              )}</button>`,
                          )
                          .join("")}
                      </div>
                    </div>
                  `,
                )
                .join("")}
            </div>
          </section>
        `
        : ""
    }
    ${
      essay.scoring.length
        ? `
          <section class="reading-group">
            <h4>得分点 <span class="essay-hint">雅思四维评分标准</span></h4>
            <div class="essay-score-list">
              ${essay.scoring
                .map(
                  (item) => `
                    <div class="essay-score-item">
                      <strong>${escapeHtml(item.dimension)}</strong>
                      <span>${escapeHtml(item.detail)}</span>
                    </div>
                  `,
                )
                .join("")}
            </div>
          </section>
        `
        : ""
    }
    <section class="reading-group">
      <h4>同类话题观点库</h4>
      <ul class="essay-ideas">${essay.ideas.map((idea) => `<li>${escapeHtml(idea)}</li>`).join("")}</ul>
    </section>
    ${
      essay.images.length
        ? `
          <section class="reading-group">
            <h4>图卡速览</h4>
            <div class="essay-thumbs">
              ${essay.images
                .map(
                  (src, index) =>
                    `<button class="essay-thumb" type="button" data-image="${escapeHtml(src)}"><img src="${escapeHtml(
                      src,
                    )}" alt="图卡 ${index + 1}" loading="lazy" /></button>`,
                )
                .join("")}
            </div>
          </section>
        `
        : ""
    }
  `;

  essayModal.classList.add("is-open");
  essayModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("has-modal");
  essayPassage.scrollTop = 0;
  essayPanel.scrollTop = 0;
}

function closeEssay() {
  essayModal.classList.remove("is-open");
  essayModal.setAttribute("aria-hidden", "true");
  if (!essayListDrawer.classList.contains("is-open")) document.body.classList.remove("has-modal");
}

// 侧边栏一级入口：列出全部范文（按主话题分组）
const groupTitleOf = (key) => (window.IELTS_TOPIC_GROUPS || []).find((g) => g.key === key)?.title || "其他";

function renderEssayList() {
  const list = currentEssays();
  if (!list.length) {
    essayList.innerHTML = `<p class="mistake-empty">这个话题还没有范文。</p>`;
    return;
  }
  const byGroup = new Map();
  for (const essay of list) {
    if (!byGroup.has(essay.group)) byGroup.set(essay.group, []);
    byGroup.get(essay.group).push(essay);
  }
  const intro =
    state.activeTopic === "all"
      ? `<p class="essay-list-intro">雅思写作按大话题出题，以下是各大类的范文。</p>`
      : `<p class="essay-list-intro">这些是本大类共享的范文（同大类的子话题都会用到），不针对单个子话题。</p>`;
  essayList.innerHTML =
    intro +
    [...byGroup.entries()]
      .map(
      ([key, list]) => `
        <p class="essay-list-group">${escapeHtml(groupTitleOf(key))}</p>
        ${list
          .map(
            (essay) => `
              <button class="essay-list-card" type="button" data-essay="${escapeHtml(essay.slug)}">
                <strong>${escapeHtml(essay.titleCn || essay.title)}</strong>
                <span>${escapeHtml(essay.title)}</span>
                <em>Task 2 · ${escapeHtml(essay.taskType)}</em>
              </button>
            `,
          )
          .join("")}
      `,
    )
    .join("");
}

function openEssayList() {
  renderEssayList();
  essayListDrawer.classList.add("is-open");
  essayListDrawer.setAttribute("aria-hidden", "false");
  essayListBackdrop.hidden = false;
}

function closeEssayList() {
  essayListDrawer.classList.remove("is-open");
  essayListDrawer.setAttribute("aria-hidden", "true");
  essayListBackdrop.hidden = true;
}

// ---------- 口语练习 ----------
const speakingState = { cards: [], activeIndex: -1, recognition: null, recording: false, finalText: "", timerId: null, seconds: 0 };
const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;

function renderSpeakingList() {
  speakingList.innerHTML = speakingState.cards
    .map(
      (card, index) => `
        <button class="speaking-item ${index === speakingState.activeIndex ? "is-active" : ""}" type="button" data-index="${index}">
          <strong>${escapeHtml(card.title)}</strong>
          <span>${escapeHtml(card.cn || "")}</span>
        </button>
      `,
    )
    .join("");
}

function selectSpeakingCard(index) {
  const card = speakingState.cards[index];
  if (!card) return;
  speakingState.activeIndex = index;
  renderSpeakingList();
  speakingCue.innerHTML = `
    <p class="speaking-cue-lead">Describe the following. You have 1 minute to prepare and should speak for 1–2 minutes.</p>
    <h4>${escapeHtml(card.title)}</h4>
    <p class="speaking-cue-cn">${escapeHtml(card.cn || "")}</p>
    <p class="speaking-cue-say">You should say:</p>
    <ul>${(card.cues || []).map((c) => `<li>${escapeHtml(c)}</li>`).join("")}</ul>
  `;
}

function resetSpeakingTranscript() {
  speakingState.finalText = "";
  speakingTranscript.innerHTML = `<p class="speaking-placeholder">选一道题，点「开始录音」，你说的话会实时转成文字。</p>`;
}

function updateTimerLabel() {
  const m = String(Math.floor(speakingState.seconds / 60)).padStart(2, "0");
  const s = String(speakingState.seconds % 60).padStart(2, "0");
  speakingTimer.textContent = `${m}:${s}`;
}

function stopRecording() {
  speakingState.recording = false;
  speakingRecord.textContent = "开始录音";
  speakingRecord.classList.remove("is-recording");
  clearInterval(speakingState.timerId);
  try {
    speakingState.recognition?.stop();
  } catch {
    /* 忽略重复停止 */
  }
}

function startRecording() {
  if (!SpeechRecognitionCtor) {
    showToast("当前浏览器不支持语音识别，请用电脑版 Chrome");
    return;
  }
  const recognition = new SpeechRecognitionCtor();
  recognition.lang = /en-GB/i.test(state.selectedVoiceURI) ? "en-GB" : "en-US";
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onresult = (event) => {
    let interim = "";
    for (let i = event.resultIndex; i < event.results.length; i += 1) {
      const chunk = event.results[i][0].transcript;
      if (event.results[i].isFinal) speakingState.finalText += chunk + " ";
      else interim += chunk;
    }
    speakingTranscript.innerHTML =
      `<span class="speaking-final">${escapeHtml(speakingState.finalText)}</span>` +
      `<span class="speaking-interim">${escapeHtml(interim)}</span>`;
    speakingTranscript.scrollTop = speakingTranscript.scrollHeight;
  };
  recognition.onerror = (event) => {
    if (event.error === "not-allowed") showToast("需要麦克风权限才能录音");
    else if (event.error !== "aborted") showToast("语音识别出错，重试一下");
    stopRecording();
  };
  recognition.onend = () => {
    if (speakingState.recording) recognition.start(); // 连续模式下自动续接
  };

  speakingState.recognition = recognition;
  speakingState.recording = true;
  speakingState.finalText = "";
  speakingState.seconds = 0;
  updateTimerLabel();
  speakingTranscript.innerHTML = `<span class="speaking-interim">聆听中…</span>`;
  speakingRecord.textContent = "停止录音";
  speakingRecord.classList.add("is-recording");
  speakingState.timerId = setInterval(() => {
    speakingState.seconds += 1;
    updateTimerLabel();
  }, 1000);
  try {
    recognition.start();
  } catch {
    stopRecording();
  }
}

function openSpeaking() {
  speakingState.cards = currentSpeaking();
  speakingState.activeIndex = -1;
  const topic = topics.find((item) => item.slug === state.activeTopic);
  const group = topic ? (window.IELTS_TOPIC_GROUPS || []).find((g) => g.key === topic.group) : null;
  speakingGroupTitle.textContent = group ? `${group.title} · 口语` : "口语练习";
  renderSpeakingList();
  resetSpeakingTranscript();
  speakingState.seconds = 0;
  updateTimerLabel();
  speakingCue.innerHTML = `<p class="speaking-placeholder">从左侧选一道题，或点「随机一题」。</p>`;
  if (speakingState.cards.length) selectSpeakingCard(Math.floor(Math.random() * speakingState.cards.length));
  speakingModal.classList.add("is-open");
  speakingModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("has-modal");
}

function closeSpeaking() {
  stopRecording();
  speakingModal.classList.remove("is-open");
  speakingModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("has-modal");
}

// ---------- 打赏 ----------
const tipQrSrc = { wechat: "./assets/qr-wechat.png", alipay: "./assets/qr-alipay.png" };

function openTip() {
  tipModal.classList.add("is-open");
  tipModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("has-modal");
}

function closeTip() {
  tipModal.classList.remove("is-open");
  tipModal.setAttribute("aria-hidden", "true");
  if (!essayModal.classList.contains("is-open") && !readingModal.classList.contains("is-open")) {
    document.body.classList.remove("has-modal");
  }
}

function switchTipPay(pay) {
  tipTabs.querySelectorAll(".tip-tab").forEach((tab) => tab.classList.toggle("is-active", tab.dataset.pay === pay));
  tipQr.closest(".tip-qr").classList.remove("is-missing");
  tipQr.src = tipQrSrc[pay] || tipQrSrc.wechat;
}

// 头像加载失败时用首字母兜底，避免碎图（含 JS 执行前就已失败的情况）
function replaceWithInitial(img) {
  const fallback = document.createElement("span");
  fallback.className = img.className + " avatar-fallback";
  fallback.textContent = "椰";
  img.replaceWith(fallback);
}

function attachAvatarFallback() {
  document.querySelectorAll(".author-avatar, .tip-avatar").forEach((img) => {
    if (img.complete && img.naturalWidth === 0) replaceWithInitial(img);
    else img.addEventListener("error", () => replaceWithInitial(img));
  });
}

function attachEvents() {
  tipQr.addEventListener("error", () => tipQr.closest(".tip-qr").classList.add("is-missing"));

  tipButton.addEventListener("click", openTip);
  tipClose.addEventListener("click", closeTip);
  tipModal.addEventListener("click", (event) => {
    if (event.target === tipModal) closeTip();
  });
  tipTabs.addEventListener("click", (event) => {
    const tab = event.target.closest(".tip-tab");
    if (tab) switchTipPay(tab.dataset.pay);
  });

  topicList.addEventListener("click", (event) => {
    const toggle = event.target.closest("[data-group-toggle]");
    if (toggle) {
      const key = toggle.dataset.groupToggle;
      state.expandedGroup = state.expandedGroup === key ? "" : key;
      savePrefs({ expandedGroup: state.expandedGroup });
      renderTopics();
      return;
    }

    const essayLink = event.target.closest(".essay-link");
    if (essayLink) {
      openEssay(essayLink.dataset.essay);
      return;
    }

    const link = event.target.closest(".topic-link");
    if (!link || link.dataset.topic === state.activeTopic) return;
    state.activeTopic = link.dataset.topic;
    state.quiz = null;
    setExamActive(false);
    savePrefs({ activeTopic: state.activeTopic });
    render();
    renderExamIntro();
    renderMistakes();
  });

  let searchTimer;
  searchInput.addEventListener("input", (event) => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      state.query = event.target.value;
      renderGallery();
      renderWorkbench();
    }, 180);
  });

  workbenchActions.addEventListener("click", (event) => {
    const btn = event.target.closest(".wb-action");
    if (!btn) return;
    if (btn.dataset.wb === "exam") openExamDrawer();
    else if (btn.dataset.wb === "reading") openReading();
    else if (btn.dataset.wb === "essay") openEssayFromWorkbench();
    else if (btn.dataset.wb === "speaking") openSpeaking();
  });

  speakingClose.addEventListener("click", closeSpeaking);
  speakingModal.addEventListener("click", (event) => {
    if (event.target === speakingModal) closeSpeaking();
  });
  speakingList.addEventListener("click", (event) => {
    const item = event.target.closest(".speaking-item");
    if (item) selectSpeakingCard(Number(item.dataset.index));
  });
  speakingRandom.addEventListener("click", () => {
    if (speakingState.cards.length) selectSpeakingCard(Math.floor(Math.random() * speakingState.cards.length));
  });
  speakingRecord.addEventListener("click", () => {
    if (speakingState.recording) stopRecording();
    else startRecording();
  });
  speakingReset.addEventListener("click", () => {
    stopRecording();
    speakingState.seconds = 0;
    updateTimerLabel();
    resetSpeakingTranscript();
  });
  speakingCopy.addEventListener("click", () => {
    const text = speakingState.finalText.trim();
    if (!text) {
      showToast("还没有转录内容");
      return;
    }
    navigator.clipboard?.writeText(text).then(
      () => showToast("转录已复制，去问 AI 点评吧"),
      () => showToast("复制失败，手动选中复制"),
    );
  });

  examClose.addEventListener("click", closeExamDrawer);
  examBackdrop.addEventListener("click", closeExamDrawer);

  // 懒加载图片就位后移除 is-loading 触发淡入（load 不冒泡，用捕获阶段）
  gallery.addEventListener(
    "load",
    (event) => {
      if (event.target.tagName === "IMG") event.target.classList.remove("is-loading");
    },
    true,
  );
  gallery.addEventListener(
    "error",
    (event) => {
      if (event.target.tagName === "IMG") event.target.classList.remove("is-loading");
    },
    true,
  );

  essayListClose.addEventListener("click", closeEssayList);
  essayListBackdrop.addEventListener("click", closeEssayList);
  essayList.addEventListener("click", (event) => {
    const card = event.target.closest(".essay-list-card");
    if (!card) return;
    closeEssayList();
    openEssay(card.dataset.essay);
  });

  essayClose.addEventListener("click", closeEssay);
  essayModal.addEventListener("click", (event) => {
    if (event.target === essayModal) closeEssay();
  });

  // 文中高亮短语：悬停出中文提示，点击发音
  essayPassage.addEventListener("click", (event) => {
    const mark = event.target.closest(".essay-phrase");
    if (mark) speakExamWord(mark.textContent);
  });
  essayPassage.addEventListener("pointerover", (event) => {
    const mark = event.target.closest(".essay-phrase");
    if (mark) moveTooltip(mark);
  });
  essayPassage.addEventListener("pointerout", (event) => {
    const mark = event.target.closest(".essay-phrase");
    if (mark && !mark.contains(event.relatedTarget)) hideTooltip();
  });

  essayPanel.addEventListener("click", (event) => {
    const phrase = event.target.closest(".essay-phrase-item, .essay-syn-word");
    if (phrase) {
      speakExamWord(phrase.dataset.word);
      return;
    }
    const thumb = event.target.closest(".essay-thumb");
    if (thumb) openImageDirect(thumb.dataset.image, essayHeading.textContent);
  });

  // 中英对照开关
  essayPassage.addEventListener("click", (event) => {
    const toggle = event.target.closest("#essayTransToggle");
    if (!toggle) return;
    const on = essayPassage.classList.toggle("show-translation");
    toggle.textContent = on ? "隐藏译文" : "显示译文";
    toggle.classList.toggle("is-on", on);
  });

  readingClose.addEventListener("click", closeReading);
  readingSubmit.addEventListener("click", submitReading);
  readingReset.addEventListener("click", () => openReading());

  // TFNG 选项单选
  readingQuestions.addEventListener("click", (event) => {
    if (state.reading?.submitted) return;
    const choice = event.target.closest(".reading-choice");
    if (!choice) return;
    choice
      .closest(".reading-choices")
      .querySelectorAll(".reading-choice")
      .forEach((btn) => btn.classList.remove("is-picked"));
    choice.classList.add("is-picked");
  });

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

  mistakeClear.addEventListener("click", clearVisibleMistakes);

  mistakeFilter.addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (!button || button.dataset.filter === state.mistakeFilter) return;
    state.mistakeFilter = button.dataset.filter;
    savePrefs({ mistakeFilter: state.mistakeFilter });
    renderMistakes();
  });

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
    if (prefersReducedMotion()) return; // 尊重系统「减弱动态效果」
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

  // 舞台贴合图片真实比例，避免不同屏幕比例下图片两侧留白
  modalImage.addEventListener("load", () => {
    if (modalImage.naturalWidth && modalImage.naturalHeight) {
      modalStage.style.aspectRatio = `${modalImage.naturalWidth} / ${modalImage.naturalHeight}`;
    }
  });

  modalWords.addEventListener("click", (event) => {
    const button = event.target.closest(".modal-word");
    if (!button) return;
    showModalWord(button);
  });

  imageModal.addEventListener("click", (event) => {
    if (event.target === imageModal) closeImageModal();
  });

  imageModal.addEventListener("mousemove", updateMagnifier);
  imageModal.addEventListener("mouseleave", hideMagnifier);

  readingModal.addEventListener("click", (event) => {
    if (event.target === readingModal) closeReading();
  });

  document.addEventListener("keydown", (event) => {
    if (imageModal.classList.contains("is-open")) {
      if (event.key === "Escape") closeImageModal();
      if (event.key === "ArrowLeft") stepModal(-1);
      if (event.key === "ArrowRight") stepModal(1);
      return;
    }

    if (event.key === "Escape" && tipModal.classList.contains("is-open")) {
      closeTip();
      return;
    }

    if (event.key === "Escape" && speakingModal.classList.contains("is-open")) {
      closeSpeaking();
      return;
    }

    if (event.key === "Escape" && essayModal.classList.contains("is-open")) {
      closeEssay();
      return;
    }

    if (event.key === "Escape" && essayListDrawer.classList.contains("is-open")) {
      closeEssayList();
      return;
    }

    if (event.key === "Escape" && readingModal.classList.contains("is-open")) {
      closeReading();
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
renderWorkbench();
renderExamIntro();
renderMistakes();
loadVoices();
attachAvatarFallback();
attachEvents();
