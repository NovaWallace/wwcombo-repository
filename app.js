const CHARACTER_ICON_API = 'https://wuwa-hpyg-tool.200503.xyz/api/v1/icons/character';
const CHARACTER_ICON_MANIFEST = './assets/character-icons.json';
const UNKNOWN_CHARACTER_ICON = './assets/unknown-character.jpg';
const SUBMISSION_EMAIL = '2728756958@qq.com';
const HERO_SPINE_ASSETS = {
  night: {
    binaryUrl: 'assets/spine/luckdraw-jiabeilina/jiabeilina.skel',
    atlasUrl: 'assets/spine/luckdraw-jiabeilina/jiabeilina.atlas'
  },
  day: {
    binaryUrl: 'assets/spine/luckdraw-feibi/feibi.skel',
    atlasUrl: 'assets/spine/luckdraw-feibi/feibi.atlas'
  }
};
const BUTTON_ICON_BASES = {
  english: './assets/button-icons',
  graphic: './assets/graphic-icons',
  chinese: './assets/botton'
};
const PURE_GRAPHIC_ICON_IDS = new Set([
  'echo-hold', 'echo', 'finisher', 'jump-hold', 'jump',
  'liberation-hold', 'liberation', 'mouse-left-hold', 'mouse-left',
  'mouse-right-hold', 'mouse-right', 'skill-hold', 'skill', 'tool'
]);
const GAMEPAD_ICON_CODES = {
  'mouse-left': 'GamepadX',
  'mouse-left-hold': 'GamepadXHold',
  skill: 'GamepadY',
  'skill-hold': 'GamepadYHold',
  echo: 'GamepadLT',
  'echo-hold': 'GamepadLTHold',
  liberation: 'GamepadRB',
  'liberation-hold': 'GamepadRBHold',
  'mouse-right': 'GamepadRT',
  'mouse-right-hold': 'GamepadRTHold',
  jump: 'GamepadA',
  'jump-hold': 'GamepadAHold',
  tool: 'GamepadLB+GamepadX',
  i: 'GamepadDPadUp',
  ii: 'GamepadDPadRight',
  iii: 'GamepadDPadDown'
};
const MAX_SELECTED_CHARACTERS = 3;
const DIFFICULTY_ORDER = ['冒烟', '进阶', '基础', '轮椅'];
const ROLE_COLORS = ['#d84f55', '#44c8c6', '#d7ad52'];
const AXIS_ICON_SIZE = 31;
const AXIS_AVATAR_SIZE = 34;
const DEFAULT_MOVE_LABELS = {
  basic_attack: 'a',
  heavy_attack: 'z',
  skill: 'e',
  skill_hold: 'E',
  echo: 'q',
  echo_hold: 'Q',
  liberation: 'r',
  liberation_hold: 'R',
  dodge: 's',
  dodge_hold: 'S',
  jump: 'j',
  jump_hold: 'J',
  tool: 't',
  finisher: 'f',
  forward: 'w',
  switch_1: 'i',
  switch_2: 'ii',
  switch_3: 'iii'
};
const AXIS_ICON_MAPPINGS = [
  ['mouse-right-hold', '长按闪避', '长按闪避.png', ['S', 'D', '闪', '长按闪避']],
  ['mouse-left-hold', '重击', '重击.png', ['z', 'Z', '长按普攻', '重击']],
  ['skill-hold', '长按技能', '长按技能.png', ['E', '长按技能']],
  ['echo-hold', '长按声骸', '长按声骸.png', ['Q', '长按声骸']],
  ['liberation-hold', '长按解放', '长按解放.png', ['R', '长按解放', '长按共鸣解放']],
  ['jump-hold', '长按跳跃', '长按跳跃.png', ['J', '长按跳跃']],
  ['mouse-left', '普攻', '普攻.png', ['a', '普攻']],
  ['skill', '技能', '技能.png', ['e', '技能']],
  ['echo', '声骸', '声骸.png', ['q', '声骸']],
  ['liberation', '共鸣解放', '解放.png', ['r', '共鸣解放']],
  ['mouse-right', '闪避', '闪避.png', ['s', 'd', '闪避']],
  ['jump', '跳跃', '跳跃.png', ['j', '跳跃', '跳']],
  ['tool', '工具', '工具.png', ['t', '工具']],
  ['intro', '变奏', '变奏.png', ['b', '变奏']],
  ['outro', '延奏', '延奏.png', ['y', '延奏']],
  ['finisher', '处决', '处决.png', ['f', '处决', '终结技']],
  ['forward', '前走', '前走.png', ['w', '前走']],
  ['iii', '3', 'iii.png', ['iii']],
  ['ii', '2', 'ii.png', ['ii']],
  ['i', '1', 'i.png', ['i']]
].map(([id, label, filename, triggers]) => {
  const graphicSrc = PURE_GRAPHIC_ICON_IDS.has(id)
    ? `${BUTTON_ICON_BASES.graphic}/${id}.png`
    : `${BUTTON_ICON_BASES.chinese}/${encodeURIComponent(filename)}`;
  const gamepadCode = GAMEPAD_ICON_CODES[id];
  return {
    id,
    label,
    triggers,
    gamepadCode,
    graphicSrc,
    englishSrc: `${BUTTON_ICON_BASES.english}/${id}.png`,
    xboxSrc: gamepadCode ? gamepadIconSource(gamepadCode, 'xbox') : graphicSrc,
    playstationSrc: gamepadCode ? gamepadIconSource(gamepadCode, 'playstation') : graphicSrc
  };
});
const AXIS_ICON_TRIGGERS = AXIS_ICON_MAPPINGS
  .flatMap((mapping) => mapping.triggers.map((trigger) => ({ trigger, mapping })))
  .sort((left, right) => right.trigger.length - left.trigger.length);

function gamepadSvgDataUri(svg) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function gamepadFaceGlyph(core, iconSet) {
  const xboxColors = { A: '#67b843', B: '#df4b43', X: '#36a9db', Y: '#f2c443' };
  if (!(core in xboxColors)) return null;
  if (iconSet === 'xbox') {
    return `<circle cx="64" cy="64" r="45" fill="${xboxColors[core]}" stroke="#fff" stroke-width="7"/><circle cx="64" cy="64" r="51" fill="none" stroke="#15191c" stroke-width="4"/><text x="64" y="78" text-anchor="middle" font-family="Arial Black,Arial,sans-serif" font-size="42" font-weight="900" fill="#171b1e">${core}</text>`;
  }
  const symbolColors = { A: '#5ba9e6', B: '#e35d6a', X: '#dd75c4', Y: '#62c99b' };
  const symbol = core === 'A'
    ? '<path d="M45 45L83 83M83 45L45 83"/>'
    : core === 'B'
      ? '<circle cx="64" cy="64" r="22"/>'
      : core === 'X'
        ? '<rect x="43" y="43" width="42" height="42" rx="2"/>'
        : '<path d="M64 39L88 82H40Z"/>';
  return `<circle cx="64" cy="64" r="50" fill="#252a2e" stroke="#fff" stroke-width="7"/><g fill="none" stroke="${symbolColors[core]}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round">${symbol}</g>`;
}

function gamepadShoulderGlyph(core, iconSet) {
  const labels = iconSet === 'playstation'
    ? { LB: 'L1', RB: 'R1', LT: 'L2', RT: 'R2' }
    : { LB: 'LB', RB: 'RB', LT: 'LT', RT: 'RT' };
  const label = labels[core];
  if (!label) return null;
  const trigger = core === 'LT' || core === 'RT';
  const path = trigger ? 'M25 88L31 38Q33 25 47 23H81Q95 25 97 38L103 88Z' : 'M22 38Q22 25 35 25H93Q106 25 106 38V91H22Z';
  return `<path d="${path}" fill="#252a2e" stroke="#fff" stroke-width="7" stroke-linejoin="round"/><text x="64" y="73" text-anchor="middle" font-family="Arial Black,Arial,sans-serif" font-size="34" font-weight="900" fill="#fff">${label}</text>`;
}

function gamepadDpadGlyph(core, iconSet) {
  if (!core.startsWith('DPad')) return null;
  const rotations = { Up: 0, Right: 90, Down: 180, Left: 270 };
  const direction = core.slice(4);
  if (!(direction in rotations)) return null;
  const accent = iconSet === 'playstation' ? '#5ba9e6' : '#df4b43';
  return `<path d="M49 17H79V47H109V81H79V111H49V81H19V47H49Z" fill="#252a2e" stroke="#fff" stroke-width="7" stroke-linejoin="round"/><g transform="rotate(${rotations[direction]} 64 64)"><path d="M50 48L64 29L78 48Z" fill="${accent}"/><rect x="51" y="46" width="26" height="20" rx="3" fill="${accent}"/></g>`;
}

function gamepadSingleGlyph(core, iconSet) {
  return gamepadFaceGlyph(core, iconSet) ?? gamepadShoulderGlyph(core, iconSet) ?? gamepadDpadGlyph(core, iconSet);
}

function gamepadIconSource(code, iconSet) {
  const parts = code.split('+').map((part) => {
    const body = part.replace(/^Gamepad/, '');
    const hold = body.endsWith('Hold');
    return { core: hold ? body.slice(0, -4) : body, hold };
  });
  if (!parts.length || parts.some(({ core }) => !gamepadSingleGlyph(core, iconSet))) return undefined;
  const isCombo = parts.length > 1;
  const width = isCombo ? 210 : 128;
  const glyphs = isCombo
    ? parts.slice(0, 2).map((part, index) => `<g transform="translate(${index * 90 + 3} 19) scale(.7)">${gamepadSingleGlyph(part.core, iconSet)}${part.hold ? '<circle cx="64" cy="64" r="57" fill="none" stroke="#ffd43b" stroke-width="6" stroke-dasharray="62 18"/>' : ''}</g>`).join('')
    : `${gamepadSingleGlyph(parts[0].core, iconSet)}${parts[0].hold ? '<circle cx="64" cy="64" r="57" fill="none" stroke="#ffd43b" stroke-width="6" stroke-dasharray="62 18"/>' : ''}`;
  const plus = isCombo ? '<path d="M105 49V79M90 64H120" stroke="#fff" stroke-width="8" stroke-linecap="round"/><path d="M105 49V79M90 64H120" stroke="#171b1e" stroke-width="3" stroke-linecap="round"/>' : '';
  return gamepadSvgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} 128">${glyphs}${plus}</svg>`);
}

function savedHeroMotionEnabled() {
  try {
    return localStorage.getItem('wwcombo-hero-motion') === 'enabled';
  } catch {
    return false;
  }
}

const state = {
  charts: [],
  theme: document.documentElement.dataset.theme === 'day' ? 'day' : 'night',
  heroMotionEnabled: savedHeroMotionEnabled(),
  gameVersion: '3.5',
  title: '',
  characters: [],
  characterQuery: '',
  characterIcons: new Map(),
  tag: '',
  sort: 'version',
  detailChart: null,
  detailPackage: null,
  axisIconSet: 'english',
  axisScale: 1,
  chartPackages: new Map()
};

const els = {
  motionToggle: document.getElementById('motionToggle'),
  themeToggle: document.getElementById('themeToggle'),
  submissionButton: document.getElementById('submissionButton'),
  submissionButtonLabel: document.getElementById('submissionButtonLabel'),
  form: document.getElementById('searchForm'),
  title: document.getElementById('titleInput'),
  clearTitle: document.getElementById('clearSearchBtn'),
  characterPickerButton: document.getElementById('characterPickerButton'),
  characterPickerValue: document.getElementById('characterPickerValue'),
  selectedAvatarStack: document.getElementById('selectedAvatarStack'),
  characterPickerBackdrop: document.getElementById('characterPickerBackdrop'),
  closeCharacterPicker: document.getElementById('closeCharacterPickerBtn'),
  characterSearch: document.getElementById('characterSearchInput'),
  characterGrid: document.getElementById('characterGrid'),
  characterPickerHint: document.getElementById('characterPickerHint'),
  characterSelectedCount: document.getElementById('characterSelectedCount'),
  clearCharacters: document.getElementById('clearCharactersBtn'),
  confirmCharacters: document.getElementById('confirmCharactersBtn'),
  sort: document.getElementById('sortSelect'),
  tags: document.getElementById('tagList'),
  status: document.getElementById('indexStatus'),
  count: document.getElementById('resultCount'),
  list: document.getElementById('comboList'),
  empty: document.getElementById('emptyState'),
  error: document.getElementById('errorState'),
  errorMessage: document.getElementById('errorMessage'),
  reset: document.getElementById('resetBtn'),
  emptyReset: document.getElementById('emptyResetBtn'),
  retry: document.getElementById('retryBtn'),
  template: document.getElementById('comboTemplate'),
  detailBackdrop: document.getElementById('detailBackdrop'),
  closeDetail: document.getElementById('closeDetailBtn'),
  detailTitle: document.getElementById('detailTitle'),
  detailCharacters: document.getElementById('detailCharacters'),
  detailTags: document.getElementById('detailTags'),
  detailMeta: document.getElementById('detailMeta'),
  detailDescriptionSection: document.getElementById('detailDescriptionSection'),
  detailDescription: document.getElementById('detailDescription'),
  detailSubmitter: document.getElementById('detailSubmitter'),
  detailSourceLink: document.getElementById('detailSourceLink'),
  detailDownload: document.getElementById('detailDownload'),
  axisIconSetButtons: [...document.querySelectorAll('[data-icon-set]')],
  axisZoom: document.getElementById('axisZoom'),
  axisZoomValue: document.getElementById('axisZoomValue'),
  axisPreview: document.getElementById('axisPreview'),
  axisPreviewSummary: document.getElementById('axisPreviewSummary')
};

const collator = new Intl.Collator('zh-CN-u-co-pinyin', { sensitivity: 'base', numeric: true });
const params = new URLSearchParams(location.search);
const isLocalPreview = location.hostname === '127.0.0.1' || location.hostname === 'localhost';
const sourceUrl = params.get('source') || (isLocalPreview ? './demo-index.json' : './community-index.json');

async function copySubmissionEmail() {
  let copied = false;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(SUBMISSION_EMAIL);
      copied = true;
    }
  } catch {
    copied = false;
  }

  if (!copied) {
    try {
      const input = document.createElement('textarea');
      input.value = SUBMISSION_EMAIL;
      input.setAttribute('readonly', '');
      input.style.position = 'fixed';
      input.style.opacity = '0';
      document.body.append(input);
      input.select();
      copied = document.execCommand('copy');
      input.remove();
    } catch {
      copied = false;
    }
  }

  if (!els.submissionButton || !els.submissionButtonLabel) return;
  els.submissionButton.classList.toggle('is-copied', copied);
  els.submissionButtonLabel.textContent = copied ? '邮箱已复制' : '复制失败';
  clearTimeout(copySubmissionEmail.feedbackTimer);
  copySubmissionEmail.feedbackTimer = setTimeout(() => {
    els.submissionButton.classList.remove('is-copied');
    els.submissionButtonLabel.textContent = '上传连段';
  }, 1800);
}

let heroSpinePlayer = null;
let heroSpineGeneration = 0;

function updateMotionControl() {
  if (!els.motionToggle) return;
  const enabled = state.heroMotionEnabled;
  const label = enabled ? '关闭动态背景' : '开启动态背景';
  const icon = document.createElement('i');
  icon.dataset.lucide = enabled ? 'pause' : 'play';
  icon.setAttribute('aria-hidden', 'true');
  els.motionToggle.replaceChildren(icon);
  els.motionToggle.setAttribute('aria-checked', String(enabled));
  els.motionToggle.setAttribute('aria-label', label);
  els.motionToggle.title = label;
  window.lucide?.createIcons();
}

function setHeroMotionEnabled(enabled, persist = true) {
  state.heroMotionEnabled = Boolean(enabled);
  if (persist) {
    try {
      localStorage.setItem('wwcombo-hero-motion', state.heroMotionEnabled ? 'enabled' : 'disabled');
    } catch {
      // Motion preference remains active for the current page.
    }
  }
  updateMotionControl();
  initHeroSpine();
}

function updateThemeControl() {
  if (!els.themeToggle) return;
  const isDay = state.theme === 'day';
  const label = isDay ? '切换到夜间模式' : '切换到白天模式';
  const icon = document.createElement('i');
  icon.dataset.lucide = isDay ? 'moon' : 'sun';
  icon.setAttribute('aria-hidden', 'true');
  els.themeToggle.replaceChildren(icon);
  els.themeToggle.setAttribute('aria-label', label);
  els.themeToggle.title = label;
  window.lucide?.createIcons();
}

function setTheme(theme, persist = true) {
  state.theme = theme === 'day' ? 'day' : 'night';
  document.documentElement.dataset.theme = state.theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', state.theme === 'day' ? '#edf3f4' : '#161a1d');
  if (persist) {
    try {
      localStorage.setItem('wwcombo-theme', state.theme);
    } catch {
      // Theme persistence is optional when storage is unavailable.
    }
  }
  updateThemeControl();
  initHeroSpine();
}

function initHeroSpine() {
  const layer = document.getElementById('heroSpineLayer');
  const host = document.getElementById('heroSpine');
  if (!layer || !host) return;
  const theme = state.theme;
  const assets = HERO_SPINE_ASSETS[theme];
  const generation = ++heroSpineGeneration;
  heroSpinePlayer?.dispose?.();
  heroSpinePlayer = null;
  host.replaceChildren();
  delete host.dataset.animation;
  delete host.dataset.animationDuration;
  layer.dataset.theme = theme;
  layer.classList.remove('is-ready', 'is-fallback');
  if (!state.heroMotionEnabled) return;
  if (!window.spine?.SpinePlayer) {
    layer.classList.add('is-fallback');
    return;
  }
  try {
    const player = new window.spine.SpinePlayer(host, {
      binaryUrl: assets.binaryUrl,
      atlasUrl: assets.atlasUrl,
      alpha: true,
      backgroundColor: '#00000000',
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
      showControls: false,
      showLoading: false,
      viewport: {
        padLeft: '0%',
        padRight: '0%',
        padTop: '0%',
        padBottom: '0%'
      },
      success(player) {
        if (generation !== heroSpineGeneration || state.theme !== theme || !state.heroMotionEnabled) {
          player.dispose?.();
          return;
        }
        const animations = player.skeleton?.data?.animations || [];
        const idle = animations.find((animation) => animation.name === 'idle') || animations[0];
        if (idle) {
          player.setAnimation(idle, true);
          player.play();
          host.dataset.animation = idle.name;
          host.dataset.animationDuration = String(idle.duration || 0);
        }
        layer.classList.add('is-ready');
      },
      error() {
        if (generation === heroSpineGeneration) layer.classList.add('is-fallback');
      }
    });
    heroSpinePlayer = player;
  } catch {
    layer.classList.add('is-fallback');
  }
}

function normalizeText(value) {
  return String(value || '').trim().toLocaleLowerCase('zh-CN');
}

function uniqueSorted(values) {
  return [...new Set(values.filter(Boolean))].sort(collator.compare);
}

function chartCharacters(chart) {
  if (Array.isArray(chart.characters) && chart.characters.length) return chart.characters.filter(Boolean);
  return String(chart.character || '').split('/').map((item) => item.trim()).filter(Boolean);
}

function formatDuration(ms) {
  const seconds = Math.max(0, Math.round(Number(ms || 0) / 1000));
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return minutes ? `${minutes}:${String(remainder).padStart(2, '0')}` : `${remainder} 秒`;
}

function formatDate(timestamp) {
  if (!Number(timestamp)) return '未知';
  return new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(Number(timestamp)));
}

function compareVersions(left, right) {
  const leftParts = String(left || '0').split('.').map((part) => Number(part) || 0);
  const rightParts = String(right || '0').split('.').map((part) => Number(part) || 0);
  const length = Math.max(leftParts.length, rightParts.length);
  for (let index = 0; index < length; index += 1) {
    const difference = (rightParts[index] || 0) - (leftParts[index] || 0);
    if (difference) return difference;
  }
  return 0;
}

function chartDifficulty(chart) {
  const tags = Array.isArray(chart.tags) ? chart.tags : [];
  const rank = DIFFICULTY_ORDER.findIndex((tag) => tags.includes(tag));
  return rank === -1 ? DIFFICULTY_ORDER.length : rank;
}

function tagAccent(tags) {
  if (tags.includes('轮椅')) return '#44c8c6';
  if (tags.includes('基础')) return '#4bd29c';
  if (tags.includes('进阶')) return '#d7ad52';
  if (tags.includes('冒烟')) return '#eb5f69';
  return '#d71920';
}

function filenameFor(chart) {
  const title = String(chart.title || 'wwcombo').replace(/[\\/:*?"<>|]+/g, '_').trim();
  return `${title}-${chart.id || 'community'}.wwcombo.json`;
}

function submitterFor(chart) {
  const nickname = String(chart.submitter?.nickname || '').trim();
  const email = String(chart.submitter?.email || '').trim();
  return {
    nickname: nickname || '历史投稿',
    email: email || '未记录邮箱'
  };
}

function avatarElement(name, className = 'mini-avatar') {
  const source = state.characterIcons.get(name);
  if (!source) {
    const fallback = document.createElement('img');
    fallback.className = `${className} unknown-avatar`;
    fallback.src = UNKNOWN_CHARACTER_ICON;
    fallback.alt = '';
    fallback.loading = 'lazy';
    return fallback;
  }
  const image = document.createElement('img');
  image.className = className;
  image.src = source;
  image.alt = '';
  image.loading = 'lazy';
  image.addEventListener('error', () => {
    const fallback = document.createElement('img');
    fallback.className = `${className} unknown-avatar`;
    fallback.src = UNKNOWN_CHARACTER_ICON;
    fallback.alt = '';
    image.replaceWith(fallback);
  }, { once: true });
  return image;
}

async function downloadChart(event, chart) {
  const link = event.currentTarget;
  const url = chart.url || '';
  if (!url) return;
  event.preventDefault();
  link.setAttribute('aria-busy', 'true');
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const blobUrl = URL.createObjectURL(await response.blob());
    const anchor = document.createElement('a');
    anchor.href = blobUrl;
    anchor.download = filenameFor(chart);
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
  } catch {
    location.href = url;
  } finally {
    link.removeAttribute('aria-busy');
  }
}

function availableCharacters() {
  return uniqueSorted([...state.characterIcons.keys(), ...state.charts.flatMap(chartCharacters)]);
}

function renderCharacterTrigger() {
  els.selectedAvatarStack.replaceChildren(...state.characters.map((name) => avatarElement(name)));
  els.characterPickerValue.textContent = state.characters.length ? state.characters.join(' / ') : '全部角色';
  els.characterPickerButton.setAttribute('aria-label', state.characters.length ? `已选择 ${state.characters.join('、')}` : '选择角色');
}

function setCharacterHint(warning = false) {
  els.characterPickerHint.textContent = warning
    ? '最多只能选择 3 名角色。'
    : '最多选择 3 名角色，选择顺序不影响检索。';
  els.characterPickerHint.style.color = warning ? '#ff8b90' : '';
}

function renderCharacterPicker() {
  const query = normalizeText(state.characterQuery);
  const characters = availableCharacters().filter((name) => !query || normalizeText(name).includes(query));
  els.characterGrid.replaceChildren();
  for (const name of characters) {
    const selected = state.characters.includes(name);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `character-option${selected ? ' selected' : ''}`;
    button.dataset.character = name;
    button.setAttribute('aria-pressed', String(selected));
    button.appendChild(avatarElement(name, 'character-avatar'));
    const label = document.createElement('strong');
    label.textContent = name;
    button.appendChild(label);
    const check = document.createElement('span');
    check.className = 'selected-check';
    check.innerHTML = '<i data-lucide="check" aria-hidden="true"></i>';
    button.appendChild(check);
    els.characterGrid.appendChild(button);
  }
  if (!characters.length) {
    const empty = document.createElement('div');
    empty.className = 'axis-empty';
    empty.textContent = '没有找到角色';
    els.characterGrid.appendChild(empty);
  }
  els.characterSelectedCount.textContent = `已选 ${state.characters.length} / ${MAX_SELECTED_CHARACTERS}`;
  renderCharacterTrigger();
  window.lucide?.createIcons();
}

function toggleCharacter(name) {
  setCharacterHint(false);
  if (state.characters.includes(name)) state.characters = state.characters.filter((item) => item !== name);
  else if (state.characters.length < MAX_SELECTED_CHARACTERS) state.characters = [...state.characters, name];
  else {
    setCharacterHint(true);
    return;
  }
  renderCharacterPicker();
  render();
}

function openCharacterPicker() {
  state.characterQuery = '';
  els.characterSearch.value = '';
  setCharacterHint(false);
  renderCharacterPicker();
  els.characterPickerBackdrop.hidden = false;
  els.characterPickerButton.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => els.characterSearch.focus());
}

function closeCharacterPicker() {
  els.characterPickerBackdrop.hidden = true;
  els.characterPickerButton.setAttribute('aria-expanded', 'false');
  if (els.detailBackdrop.hidden) document.body.style.overflow = '';
  els.characterPickerButton.focus();
}

function renderFilters() {
  renderCharacterTrigger();
  const tags = uniqueSorted(state.charts.flatMap((chart) => Array.isArray(chart.tags) ? chart.tags : []));
  els.tags.replaceChildren();
  const all = document.createElement('button');
  all.type = 'button';
  all.className = `tag-button${state.tag ? '' : ' active'}`;
  all.textContent = '全部';
  all.dataset.tag = '';
  els.tags.appendChild(all);
  for (const tag of tags) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `tag-button${state.tag === tag ? ' active' : ''}`;
    button.textContent = tag;
    button.dataset.tag = tag;
    els.tags.appendChild(button);
  }
}

function filteredCharts() {
  const titleQuery = normalizeText(state.title);
  const result = state.charts.filter((chart) => {
    const characters = chartCharacters(chart);
    const titleMatches = !titleQuery || normalizeText(chart.title).includes(titleQuery);
    const characterMatches = state.characters.every((name) => characters.includes(name));
    const tagMatches = !state.tag || (Array.isArray(chart.tags) && chart.tags.includes(state.tag));
    return titleMatches && characterMatches && tagMatches;
  });
  return result.sort((left, right) => {
    if (state.sort === 'difficulty') {
      return chartDifficulty(left) - chartDifficulty(right)
        || compareVersions(left.uploadVersion, right.uploadVersion)
        || Number(right.updatedAt || 0) - Number(left.updatedAt || 0);
    }
    return compareVersions(left.uploadVersion, right.uploadVersion)
      || Number(right.updatedAt || 0) - Number(left.updatedAt || 0)
      || collator.compare(left.title || '', right.title || '');
  });
}

function renderCard(chart) {
  const card = els.template.content.firstElementChild.cloneNode(true);
  const tags = Array.isArray(chart.tags) ? chart.tags.filter(Boolean) : [];
  const submitter = submitterFor(chart);
  card.style.setProperty('--accent', tagAccent(tags));
  card.querySelector('h3').textContent = chart.title || '未命名连段';
  card.querySelector('.characters').textContent = chartCharacters(chart).join(' / ') || '角色未标注';
  card.querySelector('.rounds').textContent = `${Math.max(1, Number(chart.rounds || 1))} 轮`;
  card.querySelector('.duration').textContent = formatDuration(chart.durationMs);
  card.querySelector('.steps').textContent = `${Number(chart.stepCount || 0)} 步`;
  card.querySelector('.updated').textContent = formatDate(chart.updatedAt);
  card.querySelector('.submitter-name').textContent = submitter.nickname;
  card.querySelector('.submitter-email').textContent = submitter.email;

  const characters = chartCharacters(chart).slice(0, MAX_SELECTED_CHARACTERS);
  const characterContainer = card.querySelector('.card-characters');
  characterContainer.setAttribute('aria-label', characters.length ? `所用角色：${characters.join('、')}` : '角色未标注');
  for (const name of characters) {
    const avatar = avatarElement(name, 'card-character-avatar');
    avatar.title = name;
    characterContainer.appendChild(avatar);
  }

  const tagContainer = card.querySelector('.combo-tags');
  for (const tag of tags) {
    const item = document.createElement('span');
    item.className = 'combo-tag';
    item.textContent = tag;
    tagContainer.appendChild(item);
  }

  const detailButton = card.querySelector('.detail-button');
  detailButton.setAttribute('aria-label', `查看 ${chart.title || '连段'} 详情`);
  detailButton.addEventListener('click', () => openDetails(chart));
  return card;
}

function detailMetaRow(label, value) {
  const row = document.createElement('div');
  const term = document.createElement('dt');
  const definition = document.createElement('dd');
  term.textContent = label;
  definition.textContent = value;
  row.append(term, definition);
  return row;
}

function renderDetailCharacters(chart) {
  els.detailCharacters.replaceChildren();
  for (const name of chartCharacters(chart)) {
    const item = document.createElement('span');
    item.className = 'detail-character';
    item.append(avatarElement(name), document.createTextNode(name));
    els.detailCharacters.appendChild(item);
  }
}

function renderDetailTags(chart) {
  els.detailTags.replaceChildren();
  for (const tag of Array.isArray(chart.tags) ? chart.tags.filter(Boolean) : []) {
    const item = document.createElement('span');
    item.className = 'detail-tag';
    item.textContent = tag;
    els.detailTags.appendChild(item);
  }
}

function axisPeriodLabel(period, loopCount) {
  const source = String(period.label || '').trim();
  if (period.kind === 'startup_axis') return source || '启动轴';
  if (source) return source;
  return loopCount > 1 ? `循环轴${period.loopIndex || 1}` : '循环轴';
}

function axisStepLabel(step, labels) {
  const custom = String(labels[step.id] || '').trim();
  return custom || DEFAULT_MOVE_LABELS[step.moveId] || String(step.label || step.moveId || '操作');
}

function axisIconParts(value) {
  const text = String(value || '');
  if (!text) return [];
  const parts = [];
  let buffer = '';
  let index = 0;
  const pushText = () => {
    if (buffer) parts.push({ kind: 'text', value: buffer });
    buffer = '';
  };
  while (index < text.length) {
    const match = AXIS_ICON_TRIGGERS.find(({ trigger }) => text.startsWith(trigger, index));
    if (!match) {
      buffer += text[index];
      index += 1;
      continue;
    }
    pushText();
    parts.push({ kind: 'icon', mapping: match.mapping });
    index += match.trigger.length;
  }
  pushText();
  return parts;
}

function groupAxisSteps(steps) {
  const groups = [];
  let current = null;
  for (const step of steps) {
    const slotFromSwitch = /^switch_([123])$/.exec(String(step.moveId || ''));
    const slot = Math.max(1, Math.min(3, Number(step.characterSlot || slotFromSwitch?.[1] || 1)));
    if (!current || slotFromSwitch) {
      current = { slot, steps: [] };
      groups.push(current);
    }
    current.steps.push(step);
  }
  return groups;
}

function estimateAxisActionWidth(value) {
  const parts = axisIconParts(value);
  const contentWidth = parts.reduce((width, part) => {
    if (part.kind === 'icon') {
      const wideGamepadIcon = ['xbox', 'playstation'].includes(state.axisIconSet) && part.mapping.gamepadCode?.includes('+');
      return width + (wideGamepadIcon ? 49 : AXIS_ICON_SIZE);
    }
    return width + Math.max(14, Array.from(part.value).length * 12);
  }, 0);
  return Math.max(20, contentWidth + Math.max(0, parts.length - 1) * 2);
}

function axisBlockMaxWidth() {
  return Math.max(220, els.axisPreview.clientWidth - 72);
}

function splitAxisMoveGroups(groups, labels) {
  const maxWidth = axisBlockMaxWidth();
  const scale = state.axisScale;
  const chunks = [];
  for (const group of groups) {
    let chunk = { slot: group.slot, steps: [], showAvatar: true };
    let width = (20 + AXIS_AVATAR_SIZE + 8) * scale;
    for (const step of group.steps) {
      const actionWidth = estimateAxisActionWidth(axisStepLabel(step, labels)) * scale;
      const nextWidth = width + (chunk.steps.length ? 5 * scale : 0) + actionWidth;
      if (chunk.steps.length && nextWidth > maxWidth) {
        chunks.push(chunk);
        chunk = { slot: group.slot, steps: [], showAvatar: false };
        width = 20 * scale;
      }
      width += (chunk.steps.length ? 5 * scale : 0) + actionWidth;
      chunk.steps.push(step);
    }
    if (chunk.steps.length) chunks.push(chunk);
  }
  return chunks;
}

function axisActionContent(value) {
  const action = document.createElement('span');
  action.className = 'axis-action';
  for (const part of axisIconParts(value)) {
    if (part.kind === 'text') {
      const text = document.createElement('span');
      text.textContent = part.value;
      action.appendChild(text);
      continue;
    }
    const icon = document.createElement('img');
    icon.className = 'axis-action-icon';
    icon.src = part.mapping[`${state.axisIconSet}Src`] || part.mapping.englishSrc;
    if (['xbox', 'playstation'].includes(state.axisIconSet) && part.mapping.gamepadCode?.includes('+')) {
      icon.classList.add('is-wide');
    }
    icon.alt = part.mapping.label;
    icon.title = part.mapping.label;
    action.appendChild(icon);
  }
  return action;
}

function renderAxisIconSet() {
  for (const button of els.axisIconSetButtons) {
    const active = button.dataset.iconSet === state.axisIconSet;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  }
}

function renderAxisPreview(pack, indexChart) {
  const chart = pack?.chart || (Array.isArray(pack?.charts) ? pack.charts[0] : null);
  if (!chart || !Array.isArray(chart.steps)) throw new Error('连段 JSON 缺少轴数据');
  const allPeriods = Array.isArray(chart.periods)
    ? chart.periods.filter((period) => period?.kind === 'startup_axis' || period?.kind === 'loop_axis')
      .sort((left, right) => Number(left.startMs || 0) - Number(right.startMs || 0))
    : [];
  const startup = allPeriods.find((period) => period.kind === 'startup_axis');
  const loops = allPeriods.filter((period) => period.kind === 'loop_axis');
  const previewTags = new Set([
    ...(Array.isArray(indexChart.tags) ? indexChart.tags : []),
    ...(Array.isArray(chart.community?.tags) ? chart.community.tags : [])
  ]);
  const showAllReasons = ['错轮', '全局'].filter((tag) => previewTags.has(tag));
  const showAll = showAllReasons.length > 0;
  let periods = showAll ? allPeriods : [startup, loops[0]].filter(Boolean);
  if (!periods.length) {
    const endMs = chart.steps.reduce((max, step) => Math.max(max, Number(step.startMax || step.startMin || 0) + Number(step.durationMax || 0)), 0);
    periods = [{ id: 'full-chart', kind: 'startup_axis', label: '完整连段', startMs: 0, endMs }];
  }

  const labels = pack.contentLabels && typeof pack.contentLabels === 'object' ? pack.contentLabels : {};
  const characters = chartCharacters(indexChart);
  const fragment = document.createDocumentFragment();
  let visibleStepCount = 0;
  let visibleBlockCount = 0;
  for (const period of periods) {
    const start = Number(period.startMs || 0);
    const end = Number(period.endMs || Number.POSITIVE_INFINITY);
    const steps = chart.steps
      .filter((step) => Number(step.startMin || 0) >= start && Number(step.startMin || 0) < end)
      .sort((left, right) => Number(left.startMin || 0) - Number(right.startMin || 0) || String(left.id || '').localeCompare(String(right.id || '')));
    visibleStepCount += steps.length;
    const moveGroups = splitAxisMoveGroups(groupAxisSteps(steps), labels);
    visibleBlockCount += moveGroups.length;
    const group = document.createElement('section');
    group.className = 'axis-group';
    group.style.setProperty('--axis-scale', String(state.axisScale));
    group.style.setProperty('--axis-color', period.kind === 'startup_axis' ? '#d7ad52' : '#44c8c6');
    const heading = document.createElement('div');
    heading.className = 'axis-group-head';
    const title = document.createElement('strong');
    title.textContent = axisPeriodLabel(period, loops.length);
    const range = document.createElement('span');
    range.textContent = `${formatDuration(start)} - ${formatDuration(Number.isFinite(end) ? end : start)}`;
    heading.append(title, range);
    const flow = document.createElement('div');
    flow.className = 'axis-flow';
    for (const moveGroup of moveGroups) {
      const slot = moveGroup.slot;
      const character = characters[slot - 1] || `角色 ${slot}`;
      const chip = document.createElement('div');
      chip.className = `axis-step axis-move-block${moveGroup.showAvatar ? '' : ' axis-move-continuation'}`;
      chip.style.setProperty('--role-color', ROLE_COLORS[slot - 1]);
      const firstStep = moveGroup.steps[0];
      const lastStep = moveGroup.steps[moveGroup.steps.length - 1];
      const actionLabels = moveGroup.steps.map((step) => axisStepLabel(step, labels));
      chip.title = `${character} · ${actionLabels.join('')} · ${formatDuration(firstStep.startMin)} - ${formatDuration(lastStep.startMin)}`;
      if (moveGroup.showAvatar) chip.appendChild(avatarElement(character));
      const content = document.createElement('div');
      content.className = 'axis-move-content';
      content.setAttribute('aria-label', actionLabels.join(''));
      for (const actionLabel of actionLabels) content.appendChild(axisActionContent(actionLabel));
      chip.appendChild(content);
      flow.appendChild(chip);
    }
    if (!steps.length) {
      const empty = document.createElement('span');
      empty.className = 'axis-empty';
      empty.textContent = '该轮没有操作记录';
      flow.appendChild(empty);
    }
    group.append(heading, flow);
    fragment.appendChild(group);
  }
  els.axisPreview.replaceChildren(fragment);
  const periodText = showAll ? `${showAllReasons.join(' / ')} · 全部轮次` : periods.map((period) => axisPeriodLabel(period, loops.length)).join(' + ');
  els.axisPreviewSummary.textContent = `${periodText} · ${visibleStepCount} 步 · ${visibleBlockCount} 招式块`;
}

async function loadChartPackage(chart) {
  if (state.chartPackages.has(chart.url)) return state.chartPackages.get(chart.url);
  const request = fetch(chart.url, { cache: 'force-cache' }).then(async (response) => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  });
  state.chartPackages.set(chart.url, request);
  try {
    return await request;
  } catch (error) {
    state.chartPackages.delete(chart.url);
    throw error;
  }
}

async function openDetails(chart) {
  state.detailChart = chart;
  state.detailPackage = null;
  renderAxisIconSet();
  const submitter = submitterFor(chart);
  els.detailTitle.textContent = chart.title || '未命名连段';
  renderDetailCharacters(chart);
  renderDetailTags(chart);
  els.detailMeta.replaceChildren(
    detailMetaRow('轮次', `${Math.max(1, Number(chart.rounds || 1))} 轮`),
    detailMetaRow('首发角色', chart.firstCharacter || chartCharacters(chart)[0] || '未知'),
    detailMetaRow('操作', `${Number(chart.stepCount || 0)} 步`),
    detailMetaRow('更新', formatDate(chart.updatedAt)),
    detailMetaRow('上传版本', chart.uploadVersion || state.gameVersion),
    detailMetaRow('ID', chart.id || '未知')
  );
  els.detailDescription.textContent = chart.description || '';
  els.detailDescriptionSection.hidden = !chart.description;
  els.detailSubmitter.textContent = `${submitter.nickname} · ${submitter.email}`;
  els.detailSourceLink.hidden = !chart.link;
  els.detailSourceLink.href = chart.link || '#';
  els.detailDownload.href = chart.url || '#';
  els.detailDownload.download = filenameFor(chart);
  els.detailDownload.onclick = (event) => downloadChart(event, chart);
  els.axisPreviewSummary.textContent = '正在读取连段数据';
  els.axisPreview.innerHTML = '<div class="axis-loading"><span></span><span></span><span></span></div>';
  els.detailBackdrop.hidden = false;
  document.body.style.overflow = 'hidden';
  window.lucide?.createIcons();

  try {
    const pack = await loadChartPackage(chart);
    if (state.detailChart?.id !== chart.id) return;
    state.detailPackage = pack;
    renderAxisPreview(pack, chart);
  } catch (error) {
    if (state.detailChart?.id !== chart.id) return;
    els.axisPreview.innerHTML = '';
    const failure = document.createElement('div');
    failure.className = 'axis-error';
    failure.textContent = `连段图生成失败：${error.message}`;
    els.axisPreview.appendChild(failure);
    els.axisPreviewSummary.textContent = '无法读取轴数据';
  }
}

function closeDetails() {
  state.detailChart = null;
  state.detailPackage = null;
  els.detailBackdrop.hidden = true;
  if (els.characterPickerBackdrop.hidden) document.body.style.overflow = '';
}

function syncUrl() {
  const next = new URLSearchParams(location.search);
  next.delete('character');
  const values = [
    ['q', state.title],
    ['characters', state.characters.join(',')],
    ['tag', state.tag],
    ['sort', state.sort === 'version' ? '' : state.sort]
  ];
  for (const [key, value] of values) {
    if (value) next.set(key, value);
    else next.delete(key);
  }
  history.replaceState(null, '', `${location.pathname}${next.size ? `?${next}` : ''}${location.hash}`);
}

function render() {
  const charts = filteredCharts();
  els.list.replaceChildren(...charts.map(renderCard));
  els.count.textContent = `${charts.length} 个结果`;
  els.empty.hidden = charts.length > 0;
  els.list.hidden = charts.length === 0;
  els.clearTitle.classList.toggle('visible', Boolean(state.title));
  els.sort.value = state.sort;
  renderCharacterTrigger();
  for (const button of els.tags.querySelectorAll('.tag-button')) button.classList.toggle('active', button.dataset.tag === state.tag);
  syncUrl();
  window.lucide?.createIcons();
}

function resetFilters() {
  state.title = '';
  state.characters = [];
  state.tag = '';
  state.sort = 'version';
  els.title.value = '';
  renderCharacterPicker();
  render();
}

function setStatus(kind, text) {
  els.status.className = `index-status ${kind}`;
  els.status.lastElementChild.textContent = text;
}

async function loadCharacterIcons() {
  try {
    let response = await fetch(CHARACTER_ICON_MANIFEST, { cache: 'no-cache' });
    if (!response.ok) response = await fetch(CHARACTER_ICON_API, { cache: 'force-cache' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    if (!Array.isArray(payload)) return;
    const icons = new Map();
    for (const item of payload) {
      if (!Array.isArray(item) || typeof item[0] !== 'string' || typeof item[1] !== 'string') continue;
      const name = item[0].trim();
      const source = item[1].trim();
      if (name && /^https?:\/\//i.test(source) && !icons.has(name)) icons.set(name, source);
    }
    state.characterIcons = icons;
    render();
    if (!els.characterPickerBackdrop.hidden) renderCharacterPicker();
  } catch {
    state.characterIcons = new Map();
  }
}

async function loadIndex() {
  els.error.hidden = true;
  els.list.hidden = false;
  setStatus('', '正在读取索引');
  try {
    const response = await fetch(sourceUrl, { cache: 'no-cache' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (data.type !== 'wwcombo-community-index' || !Array.isArray(data.charts)) throw new Error('索引格式不正确');
    state.charts = data.charts;
    state.gameVersion = /^\d+\.\d+$/.test(String(data.gameVersion || '')) ? String(data.gameVersion) : '3.5';
    state.title = params.get('q') || '';
    const characterParam = params.get('characters') || params.get('character') || '';
    state.characters = uniqueSorted(characterParam.split(',').map((item) => item.trim())).slice(0, MAX_SELECTED_CHARACTERS);
    state.tag = params.get('tag') || '';
    state.sort = ['version', 'difficulty'].includes(params.get('sort')) ? params.get('sort') : 'version';
    els.title.value = state.title;
    renderFilters();
    render();
    setStatus('ready', `${state.charts.length} 个连段 · ${formatDate(data.updatedAt)} 更新`);
    void loadCharacterIcons();
  } catch (error) {
    state.charts = [];
    els.list.replaceChildren();
    els.list.hidden = true;
    els.empty.hidden = true;
    els.error.hidden = false;
    els.errorMessage.textContent = `读取 ${sourceUrl} 失败：${error.message}`;
    setStatus('error', '索引读取失败');
  }
}

els.form.addEventListener('submit', (event) => event.preventDefault());
els.title.addEventListener('input', () => { state.title = els.title.value; render(); });
els.clearTitle.addEventListener('click', () => { state.title = ''; els.title.value = ''; els.title.focus(); render(); });
els.characterPickerButton.addEventListener('click', openCharacterPicker);
els.closeCharacterPicker.addEventListener('click', closeCharacterPicker);
els.confirmCharacters.addEventListener('click', closeCharacterPicker);
els.clearCharacters.addEventListener('click', () => { state.characters = []; setCharacterHint(false); renderCharacterPicker(); render(); });
els.characterSearch.addEventListener('input', () => { state.characterQuery = els.characterSearch.value; renderCharacterPicker(); });
els.characterGrid.addEventListener('click', (event) => {
  const button = event.target.closest('.character-option');
  if (button) toggleCharacter(button.dataset.character || '');
});
els.characterPickerBackdrop.addEventListener('mousedown', (event) => { if (event.target === els.characterPickerBackdrop) closeCharacterPicker(); });
els.sort.addEventListener('change', () => { state.sort = els.sort.value; render(); });
els.tags.addEventListener('click', (event) => {
  const button = event.target.closest('.tag-button');
  if (!button) return;
  state.tag = button.dataset.tag || '';
  render();
});
els.closeDetail.addEventListener('click', closeDetails);
els.detailBackdrop.addEventListener('mousedown', (event) => { if (event.target === els.detailBackdrop) closeDetails(); });
for (const button of els.axisIconSetButtons) {
  button.addEventListener('click', () => {
    const next = button.dataset.iconSet;
    if (!['english', 'graphic', 'xbox', 'playstation'].includes(next) || next === state.axisIconSet) return;
    state.axisIconSet = next;
    renderAxisIconSet();
    if (state.detailChart && state.detailPackage) renderAxisPreview(state.detailPackage, state.detailChart);
  });
}
els.axisZoom?.addEventListener('input', () => {
  state.axisScale = Math.max(0.8, Math.min(1.8, Number(els.axisZoom.value || 100) / 100));
  els.axisZoomValue.value = `${Math.round(state.axisScale * 100)}%`;
  if (state.detailChart && state.detailPackage) renderAxisPreview(state.detailPackage, state.detailChart);
});
let axisResizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(axisResizeTimer);
  if (!state.detailChart || !state.detailPackage) return;
  axisResizeTimer = setTimeout(() => renderAxisPreview(state.detailPackage, state.detailChart), 120);
});
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  if (!els.detailBackdrop.hidden) closeDetails();
  else if (!els.characterPickerBackdrop.hidden) closeCharacterPicker();
});
els.reset.addEventListener('click', resetFilters);
els.emptyReset.addEventListener('click', resetFilters);
els.retry.addEventListener('click', loadIndex);
els.themeToggle?.addEventListener('click', () => {
  setTheme(state.theme === 'day' ? 'night' : 'day');
});
els.motionToggle?.addEventListener('click', () => {
  setHeroMotionEnabled(!state.heroMotionEnabled);
});
els.submissionButton?.addEventListener('click', () => {
  void copySubmissionEmail();
});

updateThemeControl();
updateMotionControl();
window.lucide?.createIcons();
initHeroSpine();
loadIndex();
