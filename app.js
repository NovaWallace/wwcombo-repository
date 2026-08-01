const CHARACTER_ICON_API = 'https://wuwa-hpyg-tool.200503.xyz/api/v1/icons/character';
const CHARACTER_ICON_MANIFEST = './assets/character-icons.json';
const UNKNOWN_CHARACTER_ICON = './assets/unknown-character.jpg';
const APP_RELEASE_MANIFEST_PATH = '/api/project-assets/v1/app-release.json';
const APP_RELEASE_FALLBACK_ORIGIN = 'https://Nova.fb520.site';
const PROFILE_STORAGE_KEY = 'wwcombo-community-profile-v1';
const AXIS_KEY_SETTINGS_STORAGE_KEY = 'wwcombo-community-axis-key-settings-v1';
const EMBEDDED_VOTER_TOKEN_STORAGE_KEY = 'wwcombo-community-client-voter-v1';
const EMBEDDED_IMPORTED_COMBOS_STORAGE_KEY = 'wwcombo-community-client-imports-v1';
const i18n = window.wwcomboI18n;
if (!i18n) throw new Error('Community i18n runtime is unavailable.');
const t = (key, values) => i18n.t(key, values);
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
const DIFFICULTY_ORDER = ['错轮', '冒烟', '进阶', '标准', '基础', '轮椅'];
const TAG_GRADES = { '轮椅': 'C', '基础': 'B', '标准': 'A', '进阶': 'S', '冒烟': 'SS', '错轮': 'SSS' };
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
  if (window.WWComboInputIcons) return window.WWComboInputIcons.gamepadIconSource(code, iconSet);
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

function keyboardCodeLabel(code) {
  const labels = {
    MouseLeft: 'LMB', MouseRight: 'RMB', MouseMiddle: 'MMB', Space: 'Space',
    ShiftLeft: 'Shift', ShiftRight: 'Shift', ControlLeft: 'Ctrl', ControlRight: 'Ctrl',
    AltLeft: 'Alt', AltRight: 'Alt', Escape: 'Esc', Enter: 'Enter', Tab: 'Tab'
  };
  if (labels[code]) return labels[code];
  if (/^Key[A-Z]$/.test(code)) return code.slice(3);
  if (/^Digit[0-9]$/.test(code)) return code.slice(5);
  return code.replace(/^(Numpad|Arrow)/, '');
}

function keyboardMouseIconSource(code) {
  if (window.WWComboInputIcons) return window.WWComboInputIcons.keyboardMouseIconSource(code);
  const parts = String(code || '').split('+').map((source) => {
    const hold = source.endsWith('Hold');
    const core = hold ? source.slice(0, -4) : source;
    return { label: keyboardCodeLabel(core), hold };
  }).filter((part) => part.label);
  if (!parts.length || parts.length > 2) return undefined;
  const width = parts.length > 1 ? 236 : 128;
  const keyWidth = parts.length > 1 ? 94 : 104;
  const keys = parts.map((part, index) => {
    const x = parts.length > 1 ? 3 + index * 136 : 12;
    const fontSize = part.label.length > 5 ? 22 : part.label.length > 3 ? 28 : 38;
    const marker = part.hold ? `<rect x="${x + 4}" y="7" width="${keyWidth - 8}" height="114" rx="18" fill="none" stroke="#ffd43b" stroke-width="6" stroke-dasharray="46 14"/>` : '';
    return `<rect x="${x}" y="12" width="${keyWidth}" height="104" rx="18" fill="#252a2e" stroke="#fff" stroke-width="7"/><text x="${x + keyWidth / 2}" y="76" text-anchor="middle" font-family="Arial Black,Arial,sans-serif" font-size="${fontSize}" font-weight="900" fill="#fff">${part.label.replaceAll('&', '&amp;').replaceAll('<', '&lt;')}</text>${marker}`;
  }).join('');
  const plus = parts.length > 1 ? '<path d="M118 49V79M103 64H133" stroke="#fff" stroke-width="8" stroke-linecap="round"/>' : '';
  return gamepadSvgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} 128">${keys}${plus}</svg>`);
}

function normalizeAxisKeySettings(value) {
  if (!value || typeof value !== 'object' || value.kind !== 'wwcombo-input-settings' || ![1, 2].includes(value.schemaVersion)) throw new Error('invalid-key-settings');
  if (!Array.isArray(value.keyboardMouseBindings) || !Array.isArray(value.gamepadBindings)) throw new Error('invalid-key-settings');
  const normalizeBindings = (items) => items.flatMap((item) => {
    if (!item || typeof item.moveId !== 'string' || !Array.isArray(item.inputs)) return [];
    const inputs = item.inputs.flatMap((input) => input && typeof input.code === 'string' && input.code.trim() ? [{ code: input.code.trim(), label: String(input.label || input.code).trim() }] : []);
    return inputs.length ? [{ moveId: item.moveId.trim(), inputs }] : [];
  });
  return {
    kind: 'wwcombo-input-settings', schemaVersion: value.schemaVersion,
    keyboardMouseBindings: normalizeBindings(value.keyboardMouseBindings),
    gamepadBindings: normalizeBindings(value.gamepadBindings),
    preferences: {
      inputMode: value.preferences?.inputMode === 'gamepad' ? 'gamepad' : 'keyboard',
      keyboardIconMode: value.preferences?.keyboardIconMode === 'actual' ? 'actual' : 'default',
      gamepadIconSet: value.preferences?.gamepadIconSet === 'playstation' ? 'playstation' : 'xbox'
    }
  };
}

function savedAxisKeySettings() {
  try {
    const stored = JSON.parse(localStorage.getItem(AXIS_KEY_SETTINGS_STORAGE_KEY) || 'null');
    if (!stored?.settings) return { settings: null, fileName: '' };
    return { settings: normalizeAxisKeySettings(stored.settings), fileName: String(stored.fileName || '') };
  } catch {
    return { settings: null, fileName: '' };
  }
}

function savedHeroMotionEnabled() {
  try {
    return localStorage.getItem('wwcombo-hero-motion') === 'enabled';
  } catch {
    return false;
  }
}

const savedKeys = savedAxisKeySettings();
const state = {
  charts: [],
  commissions: [],
  view: 'combos',
  theme: document.documentElement.dataset.theme === 'day' ? 'day' : 'night',
  heroMotionEnabled: savedHeroMotionEnabled(),
  gameVersion: '3.5',
  indexUpdatedAt: 0,
  indexLoadState: 'loading',
  title: '',
  characters: [],
  characterQuery: '',
  characterIcons: new Map(),
  tag: '',
  sort: 'version',
  detailChart: null,
  detailPackage: null,
  detailOptions: null,
  uploadChart: null,
  uploadPackage: null,
  uploadMode: 'community',
  uploadCommissionId: '',
  commissionLoadState: 'idle',
  commissionUpdatedAt: 0,
  commissionCreateCharacters: [],
  commissionCreateTag: '基础',
  commissionDetail: null,
  commissionResponse: null,
  commissionResponsePackage: null,
  feedbackChart: null,
  appDialogResolve: null,
  appDialogPreviousFocus: null,
  axisIconSet: 'english',
  axisScale: 1,
  axisKeySettings: savedKeys.settings,
  axisKeySettingsFile: savedKeys.fileName,
  chartPackages: new Map(),
  appRelease: null,
  appReleaseState: 'idle'
};
if (state.axisKeySettings?.preferences.inputMode === 'gamepad') state.axisIconSet = state.axisKeySettings.preferences.gamepadIconSet;

function savedProfile() {
  try {
    const value = JSON.parse(localStorage.getItem(PROFILE_STORAGE_KEY) || '{}');
    return { username: String(value.username || '').trim().slice(0, 40), email: String(value.email || '').trim().toLowerCase().slice(0, 254), avatar: String(value.avatar || '').trim().slice(0, 80) };
  } catch {
    return { username: '', email: '', avatar: '' };
  }
}

state.profile = savedProfile();
state.profileDraftAvatar = state.profile.avatar;
let uploadPreviewToken = 0;

const els = {
  languageSelect: document.getElementById('languageSelect'),
  motionToggle: document.getElementById('motionToggle'),
  themeToggle: document.getElementById('themeToggle'),
  submissionButton: document.getElementById('submissionButton'),
  submissionButtonLabel: document.getElementById('submissionButtonLabel'),
  clientDownloadButton: document.getElementById('clientDownloadButton'),
  profileButton: document.getElementById('profileButton'),
  profileAvatar: document.getElementById('profileAvatar'),
  profileName: document.getElementById('profileName'),
  profileEmail: document.getElementById('profileEmail'),
  profileBackdrop: document.getElementById('profileBackdrop'),
  profileForm: document.getElementById('profileForm'),
  profileUsernameInput: document.getElementById('profileUsernameInput'),
  profileEmailInput: document.getElementById('profileEmailInput'),
  profileAvatarGrid: document.getElementById('profileAvatarGrid'),
  profileAvatarChoice: document.getElementById('profileAvatarChoice'),
  profileFeedback: document.getElementById('profileFeedback'),
  closeProfile: document.getElementById('closeProfileBtn'),
  clearProfile: document.getElementById('clearProfileBtn'),
  uploadBackdrop: document.getElementById('uploadBackdrop'),
  uploadForm: document.getElementById('uploadForm'),
  closeUpload: document.getElementById('closeUploadBtn'),
  cancelUpload: document.getElementById('cancelUploadBtn'),
  editUploadProfile: document.getElementById('editUploadProfileBtn'),
  uploadAvatar: document.getElementById('uploadAvatar'),
  uploadUsername: document.getElementById('uploadUsername'),
  uploadEmail: document.getElementById('uploadEmail'),
  comboFile: document.getElementById('comboFileInput'),
  comboFileName: document.getElementById('comboFileName'),
  uploadAxisSection: document.getElementById('uploadAxisSection'),
  uploadAxisPreview: document.getElementById('uploadAxisPreview'),
  uploadAxisSummary: document.getElementById('uploadAxisSummary'),
  uploadFeedback: document.getElementById('uploadFeedback'),
  confirmUpload: document.getElementById('confirmUploadBtn'),
  uploadTitle: document.getElementById('uploadTitle'),
  uploadHint: document.getElementById('uploadHint'),
  confirmUploadLabel: document.getElementById('confirmUploadLabel'),
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
  sortField: document.getElementById('sortField'),
  tags: document.getElementById('tagList'),
  tagFilter: document.getElementById('tagFilter'),
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
  commissionTemplate: document.getElementById('commissionTemplate'),
  comboTab: document.getElementById('comboTabButton'),
  commissionTab: document.getElementById('commissionTabButton'),
  resultsTitle: document.getElementById('resultsTitle'),
  createCommission: document.getElementById('createCommissionBtn'),
  commissionCreateBackdrop: document.getElementById('commissionCreateBackdrop'),
  commissionCreateForm: document.getElementById('commissionCreateForm'),
  closeCommissionCreate: document.getElementById('closeCommissionCreateBtn'),
  cancelCommissionCreate: document.getElementById('cancelCommissionCreateBtn'),
  editCommissionProfile: document.getElementById('editCommissionProfileBtn'),
  commissionCreateAvatar: document.getElementById('commissionCreateAvatar'),
  commissionCreateUsername: document.getElementById('commissionCreateUsername'),
  commissionCreateEmail: document.getElementById('commissionCreateEmail'),
  commissionTitleInput: document.getElementById('commissionTitleInput'),
  commissionCharacterGrid: document.getElementById('commissionCharacterGrid'),
  commissionCharacterHint: document.getElementById('commissionCharacterHint'),
  commissionTagGrid: document.getElementById('commissionTagGrid'),
  commissionDescriptionInput: document.getElementById('commissionDescriptionInput'),
  commissionCreateFeedback: document.getElementById('commissionCreateFeedback'),
  confirmCommissionCreate: document.getElementById('confirmCommissionCreateBtn'),
  commissionDetailBackdrop: document.getElementById('commissionDetailBackdrop'),
  closeCommissionDetail: document.getElementById('closeCommissionDetailBtn'),
  commissionDetailTitle: document.getElementById('commissionDetailTitle'),
  commissionDetailStatus: document.getElementById('commissionDetailStatus'),
  commissionDetailCharacters: document.getElementById('commissionDetailCharacters'),
  commissionDetailDescription: document.getElementById('commissionDetailDescription'),
  commissionDetailOwner: document.getElementById('commissionDetailOwner'),
  commissionDetailMeta: document.getElementById('commissionDetailMeta'),
  commissionInterest: document.getElementById('commissionInterestBtn'),
  commissionResponseUpload: document.getElementById('commissionResponseUploadBtn'),
  commissionWithdraw: document.getElementById('commissionWithdrawBtn'),
  commissionResponseSummary: document.getElementById('commissionResponseSummary'),
  commissionResponseList: document.getElementById('commissionResponseList'),
  commissionResponseEmpty: document.getElementById('commissionResponseEmpty'),
  commissionAxisPanel: document.getElementById('commissionAxisPanel'),
  commissionAxisTitle: document.getElementById('commissionAxisTitle'),
  commissionAxisPreview: document.getElementById('commissionAxisPreview'),
  commissionAxisSummary: document.getElementById('commissionAxisSummary'),
  appDialogBackdrop: document.getElementById('appDialogBackdrop'),
  appDialogEyebrow: document.getElementById('appDialogEyebrow'),
  appDialogTitle: document.getElementById('appDialogTitle'),
  appDialogMessage: document.getElementById('appDialogMessage'),
  appDialogCancel: document.getElementById('appDialogCancelBtn'),
  appDialogAccept: document.getElementById('appDialogAcceptBtn'),
  detailBackdrop: document.getElementById('detailBackdrop'),
  closeDetail: document.getElementById('closeDetailBtn'),
  detailTitle: document.getElementById('detailTitle'),
  detailCharacters: document.getElementById('detailCharacters'),
  detailTags: document.getElementById('detailTags'),
  detailMeta: document.getElementById('detailMeta'),
  detailDescriptionSection: document.getElementById('detailDescriptionSection'),
  detailDescription: document.getElementById('detailDescription'),
  detailSubmitter: document.getElementById('detailSubmitter'),
  detailVoteSection: document.getElementById('detailVoteSection'),
  detailSourceLink: document.getElementById('detailSourceLink'),
  detailDownload: document.getElementById('detailDownload'),
  detailWithdraw: document.getElementById('detailWithdraw'),
  detailUpvote: document.getElementById('detailUpvote'),
  detailFeedback: document.getElementById('detailFeedback'),
  detailVoteHint: document.getElementById('detailVoteHint'),
  feedbackBackdrop: document.getElementById('feedbackBackdrop'),
  feedbackForm: document.getElementById('feedbackForm'),
  feedbackReason: document.getElementById('feedbackReason'),
  feedbackReasonCount: document.getElementById('feedbackReasonCount'),
  feedbackFormStatus: document.getElementById('feedbackFormStatus'),
  closeFeedback: document.getElementById('closeFeedbackBtn'),
  cancelFeedback: document.getElementById('cancelFeedbackBtn'),
  submitFeedback: document.getElementById('submitFeedbackBtn'),
  axisIconSetButtons: [...document.querySelectorAll('[data-icon-set]')],
  axisZoom: document.getElementById('axisZoom'),
  axisZoomValue: document.getElementById('axisZoomValue'),
  axisZoomControls: [...document.querySelectorAll('[data-axis-zoom]')],
  axisZoomValues: [...document.querySelectorAll('[data-axis-zoom-value]')],
  axisKeymapButtons: [...document.querySelectorAll('[data-axis-keymap-import]')],
  axisKeymapInput: document.getElementById('axisKeymapInput'),
  axisPreview: document.getElementById('axisPreview'),
  axisPreviewSummary: document.getElementById('axisPreviewSummary')
};

const collator = new Intl.Collator('zh-CN-u-co-pinyin', { sensitivity: 'base', numeric: true });
const params = new URLSearchParams(location.search);
const isFilePreview = location.protocol === 'file:';
const isEmbeddedClient = params.get('client') === '1' && window.parent !== window;
const requestedSource = params.get('source') || '';

function sameOriginUrl(value) {
  try {
    return new URL(value, location.href).origin === location.origin;
  } catch {
    return false;
  }
}

function savedEmbeddedVoterToken() {
  if (!isEmbeddedClient) return '';
  try {
    const token = String(localStorage.getItem(EMBEDDED_VOTER_TOKEN_STORAGE_KEY) || '').trim();
    return token.length <= 512 ? token : '';
  } catch {
    return '';
  }
}

function saveEmbeddedVoterToken(token) {
  if (!isEmbeddedClient || !token || token.length > 512) return;
  try {
    localStorage.setItem(EMBEDDED_VOTER_TOKEN_STORAGE_KEY, token);
  } catch {}
}

function embeddedVoterHeaders(url, headers = {}) {
  if (!isEmbeddedClient || !sameOriginUrl(url)) return headers;
  const token = savedEmbeddedVoterToken();
  return token ? { ...headers, 'x-wwcombo-voter': token } : headers;
}

function rememberEmbeddedVoterToken(response, url) {
  if (!isEmbeddedClient || !sameOriginUrl(url)) return;
  const token = String(response.headers.get('x-wwcombo-voter-token') || '').trim();
  if (token) saveEmbeddedVoterToken(token);
}

function savedEmbeddedImportedCombos() {
  if (!isEmbeddedClient) return new Set();
  try {
    const values = JSON.parse(localStorage.getItem(EMBEDDED_IMPORTED_COMBOS_STORAGE_KEY) || '[]');
    return new Set(Array.isArray(values) ? values.filter((value) => typeof value === 'string' && value.trim()).slice(-500) : []);
  } catch {
    return new Set();
  }
}

const embeddedImportedCombos = savedEmbeddedImportedCombos();

function rememberEmbeddedImportedCombo(comboId) {
  if (!isEmbeddedClient || !comboId) return;
  embeddedImportedCombos.add(comboId);
  try {
    localStorage.setItem(EMBEDDED_IMPORTED_COMBOS_STORAGE_KEY, JSON.stringify([...embeddedImportedCombos].slice(-500)));
  } catch {}
}

function syncModalBody() {
  document.body.style.overflow = document.querySelector('.modal-backdrop:not([hidden])') ? 'hidden' : '';
}

function closeAppDialog(result = false) {
  if (els.appDialogBackdrop.hidden) return;
  els.appDialogBackdrop.hidden = true;
  const resolve = state.appDialogResolve;
  const previousFocus = state.appDialogPreviousFocus;
  state.appDialogResolve = null;
  state.appDialogPreviousFocus = null;
  syncModalBody();
  if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus();
  if (resolve) resolve(result);
}

function openAppDialog(message, options = {}) {
  if (state.appDialogResolve) closeAppDialog(false);
  const confirmation = Boolean(options.confirmation);
  state.appDialogPreviousFocus = document.activeElement;
  els.appDialogEyebrow.textContent = confirmation ? 'CONFIRM ACTION' : 'NOTICE';
  els.appDialogTitle.textContent = options.title || t(confirmation ? 'dialog.confirm' : 'dialog.notice');
  els.appDialogMessage.textContent = String(message || '');
  els.appDialogCancel.hidden = !confirmation;
  els.appDialogCancel.textContent = options.cancelText || t('common.cancel');
  els.appDialogAccept.textContent = options.confirmText || t(confirmation ? 'common.done' : 'common.done');
  els.appDialogAccept.classList.toggle('danger', Boolean(options.danger));
  els.appDialogBackdrop.hidden = false;
  syncModalBody();
  requestAnimationFrame(() => els.appDialogAccept.focus());
  return new Promise((resolve) => { state.appDialogResolve = resolve; });
}

function showAppMessage(message, options = {}) {
  return openAppDialog(message, options);
}

function askAppConfirmation(message, options = {}) {
  return openAppDialog(message, { ...options, confirmation: true });
}
const sourceUrl = (!isFilePreview && /(^|\/)demo-index\.json(?:$|\?)/i.test(requestedSource))
  ? './community-index.json'
  : requestedSource || (isFilePreview ? './demo-index.json' : './community-index.json');
state.view = params.get('view') === 'commissions' ? 'commissions' : 'combos';

function appReleaseManifestUrl() {
  if (location.protocol === 'file:') return `${APP_RELEASE_FALLBACK_ORIGIN}${APP_RELEASE_MANIFEST_PATH}`;
  if (location.hostname === 'Nova.fb520.site' || location.hostname === 'localhost' || location.hostname === '127.0.0.1') return APP_RELEASE_MANIFEST_PATH;
  return `${APP_RELEASE_FALLBACK_ORIGIN}${APP_RELEASE_MANIFEST_PATH}`;
}

function appReleaseDownloadUrl(release, language = i18n.language) {
  const links = release?.downloadLinks;
  if (!links || typeof links !== 'object') return '';
  const value = language === 'zh-CN' ? links.china : links.global;
  return typeof value === 'string' && /^https?:\/\//i.test(value) ? value : '';
}

function refreshClientDownloadControl() {
  if (!els.clientDownloadButton) return;
  if (isEmbeddedClient) {
    els.clientDownloadButton.style.display = 'none';
    return;
  }
  const hasLink = Boolean(appReleaseDownloadUrl(state.appRelease));
  els.clientDownloadButton.disabled = state.appReleaseState === 'loading';
  els.clientDownloadButton.setAttribute('aria-busy', state.appReleaseState === 'loading' ? 'true' : 'false');
  els.clientDownloadButton.title = hasLink ? (i18n.language === 'zh-CN' ? '下载客户端' : 'Download client') : (i18n.language === 'zh-CN' ? '暂未配置客户端下载地址' : 'Client download is not configured');
  els.clientDownloadButton.setAttribute('aria-label', els.clientDownloadButton.title);
}

function maskProfileEmail(value) {
  const email = String(value || '').trim().toLowerCase();
  const at = email.lastIndexOf('@');
  if (at < 1) return '';
  return `${Array.from(email.slice(0, at)).slice(0, 2).join('')}***${email.slice(at)}`;
}

function profileInitial() {
  return Array.from(state.profile.username || '?')[0]?.toUpperCase() || '?';
}

function renderProfileAvatarNode(target, name, fallbackText = profileInitial()) {
  target.replaceChildren();
  const avatarName = String(name || '').trim();
  if (avatarName && state.characterIcons.has(avatarName)) {
    const image = avatarElement(avatarName, 'profile-avatar-image');
    image.title = avatarName;
    target.appendChild(image);
    return;
  }
  target.textContent = fallbackText;
}

function renderProfile() {
  const ready = Boolean(state.profile.username && state.profile.email);
  renderProfileAvatarNode(els.profileAvatar, state.profile.avatar);
  els.profileName.textContent = ready ? state.profile.username : t('profile.guest');
  els.profileEmail.textContent = ready ? maskProfileEmail(state.profile.email) : '';
  renderProfileAvatarNode(els.uploadAvatar, state.profile.avatar);
  els.uploadUsername.textContent = ready ? state.profile.username : t('profile.guest');
  els.uploadEmail.textContent = ready ? maskProfileEmail(state.profile.email) : t('profile.missing');
  renderProfileAvatarNode(els.commissionCreateAvatar, state.profile.avatar);
  els.commissionCreateUsername.textContent = ready ? state.profile.username : t('profile.guest');
  els.commissionCreateEmail.textContent = ready ? maskProfileEmail(state.profile.email) : t('profile.missing');
  if (els.profileAvatarChoice) els.profileAvatarChoice.textContent = state.profile.avatar || t('profile.avatarNone');
  renderProfileAvatarGrid();
}

function openProfile() {
  state.profileDraftAvatar = state.profile.avatar;
  els.profileUsernameInput.value = state.profile.username;
  els.profileEmailInput.value = state.profile.email;
  renderProfileAvatarGrid();
  els.profileFeedback.textContent = '';
  els.profileFeedback.className = 'form-feedback';
  els.profileBackdrop.hidden = false;
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => els.profileUsernameInput.focus());
}

function closeProfile() {
  state.profileDraftAvatar = state.profile.avatar;
  els.profileBackdrop.hidden = true;
  syncModalBody();
}

function openUpload(commissionId = '') {
  if (!state.profile.username || !state.profile.email) {
    openProfile();
    els.profileFeedback.textContent = t('profile.required');
    return;
  }
  state.uploadChart = null;
  state.uploadPackage = null;
  state.uploadMode = commissionId ? 'commission' : 'community';
  state.uploadCommissionId = commissionId;
  if (commissionId && !els.commissionDetailBackdrop.hidden) {
    els.commissionDetailBackdrop.inert = true;
    els.commissionDetailBackdrop.setAttribute('aria-hidden', 'true');
  }
  els.uploadTitle.textContent = t(commissionId ? 'commission.uploadResponse' : 'upload.title');
  els.uploadHint.textContent = t(commissionId ? 'commission.uploadHint' : 'upload.hint');
  els.confirmUploadLabel.textContent = t(commissionId ? 'commission.submitResponse' : 'upload.submit');
  renderProfile();
  renderAxisIconSet();
  syncAxisScaleControls();
  uploadPreviewToken += 1;
  els.comboFile.value = '';
  els.comboFileName.textContent = t('upload.none');
  resetUploadAxisPreview();
  els.uploadFeedback.textContent = '';
  els.uploadFeedback.className = 'form-feedback';
  els.uploadBackdrop.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeUpload() {
  uploadPreviewToken += 1;
  state.uploadChart = null;
  state.uploadPackage = null;
  state.uploadMode = 'community';
  state.uploadCommissionId = '';
  els.uploadBackdrop.hidden = true;
  els.commissionDetailBackdrop.inert = false;
  els.commissionDetailBackdrop.removeAttribute('aria-hidden');
  syncModalBody();
}

function uploadedIndexChart(pack, fileName = '') {
  const chart = pack?.chart || (Array.isArray(pack?.charts) ? pack.charts[0] : null) || (Array.isArray(pack?.steps) ? pack : null);
  const community = chart?.community || {};
  const characters = (Array.isArray(community.characters) ? community.characters : [chart?.character]).filter(Boolean).slice(0, 3);
  const firstStep = [...(Array.isArray(chart?.steps) ? chart.steps : [])].sort((left, right) => Number(left.startMin || 0) - Number(right.startMin || 0))[0];
  const firstSlot = Math.max(1, Math.round(Number(firstStep?.characterSlot || 1)));
  return {
    id: community.id || chart?.id || fileName || 'upload-preview',
    title: community.name || community.title || chart?.title || fileName || t('upload.previewTitle'),
    characters,
    character: characters[0] || chart?.character || '',
    firstCharacter: characters[firstSlot - 1] || characters[0] || '',
    tags: normalizedTags(Array.isArray(community.tags) ? community.tags : chart?.tags || []),
    rounds: Number(community.rounds || 1),
    uploadVersion: String(community.uploadVersion || ''),
    description: typeof community.description === 'string' ? community.description : '',
    link: typeof community.link === 'string' && /^https?:\/\//i.test(community.link) ? community.link : ''
  };
}

function resetUploadAxisPreview() {
  els.uploadAxisSummary.textContent = t('upload.previewEmpty');
  const empty = document.createElement('div');
  empty.className = 'axis-empty';
  empty.textContent = t('upload.previewEmpty');
  els.uploadAxisPreview.replaceChildren(empty);
}

function renderUploadAxisPreview() {
  if (!state.uploadChart || !state.uploadPackage) return;
  renderAxisPreview(state.uploadPackage, state.uploadChart, { preview: els.uploadAxisPreview, summary: els.uploadAxisSummary });
}

async function previewUploadFile() {
  const file = els.comboFile.files?.[0];
  const previewToken = ++uploadPreviewToken;
  els.comboFileName.textContent = file?.name || t('upload.none');
  els.uploadFeedback.textContent = '';
  els.uploadFeedback.className = 'form-feedback';
  state.uploadChart = null;
  state.uploadPackage = null;
  els.uploadAxisPreview.replaceChildren();
  if (!file) {
    resetUploadAxisPreview();
    return;
  }
  if (file.size > 1024 * 1024) {
    els.uploadFeedback.textContent = t('upload.tooLarge');
    resetUploadAxisPreview();
    return;
  }
  els.uploadAxisSummary.textContent = t('upload.previewLoading');
  els.uploadAxisPreview.innerHTML = '<div class="axis-loading"><span></span><span></span><span></span></div>';
  try {
    const content = JSON.parse((await file.text()).replace(/^\ufeff/, ''));
    if (previewToken !== uploadPreviewToken || els.comboFile.files?.[0] !== file) return;
    state.uploadPackage = content;
    state.uploadChart = uploadedIndexChart(content, file.name);
    renderUploadAxisPreview();
  } catch (error) {
    if (previewToken !== uploadPreviewToken || els.comboFile.files?.[0] !== file) return;
    els.uploadAxisPreview.replaceChildren();
    const failure = document.createElement('div');
    failure.className = 'axis-error';
    failure.textContent = error instanceof SyntaxError ? t('upload.invalidJson') : t('axis.failed', { error: error.message });
    els.uploadAxisPreview.appendChild(failure);
    els.uploadAxisSummary.textContent = t('axis.unavailable');
  }
}

async function submitCombo(event) {
  event.preventDefault();
  const file = els.comboFile.files?.[0];
  if (!file) return;
  if (file.size > 1024 * 1024) {
    els.uploadFeedback.textContent = t('upload.tooLarge');
    return;
  }
  els.confirmUpload.disabled = true;
  els.uploadFeedback.textContent = t('upload.sending');
  try {
    const content = JSON.parse((await file.text()).replace(/^\ufeff/, ''));
    const commissionId = state.uploadMode === 'commission' ? state.uploadCommissionId : '';
    const response = await fetch(commissionId ? `/api/community/commissions/${encodeURIComponent(commissionId)}/responses` : '/api/community/submit', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ username: state.profile.username, email: state.profile.email, avatar: state.profile.avatar, fileName: file.name, content })
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.error || `HTTP ${response.status}`);
    const autoPublished = !commissionId && body.status === 'published';
    els.uploadFeedback.textContent = t(commissionId ? 'commission.responseSuccess' : autoPublished ? 'upload.autoPublished' : 'upload.success');
    els.uploadFeedback.className = 'form-feedback success';
    els.comboFile.value = '';
    els.comboFileName.textContent = t('upload.none');
    state.uploadChart = null;
    state.uploadPackage = null;
    resetUploadAxisPreview();
    if (commissionId && body.commission) {
      replaceCommission(body.commission);
      state.commissionDetail = body.commission;
      renderCommissionDetail();
      render();
    } else if (autoPublished) void loadIndex();
  } catch (error) {
    els.uploadFeedback.textContent = error instanceof SyntaxError ? t('upload.invalidJson') : error.message;
  } finally {
    els.confirmUpload.disabled = false;
  }
}

let heroSpinePlayer = null;
let heroSpineGeneration = 0;

function updateMotionControl() {
  if (!els.motionToggle) return;
  const enabled = state.heroMotionEnabled;
  const label = enabled ? t('motion.disable') : t('motion.enable');
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
  const label = isDay ? t('theme.night') : t('theme.day');
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

function normalizedTags(values) {
  return [...new Set((Array.isArray(values) ? values : []).filter(Boolean).map((tag) => tag === '全局' ? '错轮' : tag))];
}

function chartCharacters(chart) {
  if (Array.isArray(chart.characters) && chart.characters.length) return chart.characters.filter(Boolean);
  return String(chart.character || '').split('/').map((item) => item.trim()).filter(Boolean);
}

function formatDuration(ms) {
  const seconds = Math.max(0, Math.round(Number(ms || 0) / 1000));
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return minutes ? `${minutes}:${String(remainder).padStart(2, '0')}` : t('unit.seconds', { count: remainder });
}

function formatDate(timestamp) {
  if (!Number(timestamp)) return t('common.unknown');
  return new Intl.DateTimeFormat(i18n.language, { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(Number(timestamp)));
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

function gradeForTags(value) {
  const tags = (Array.isArray(value) ? value : [value]).map((tag) => tag === '全局' ? '错轮' : tag);
  const tag = DIFFICULTY_ORDER.find((item) => tags.includes(item)) || '';
  return { tag, grade: TAG_GRADES[tag] || '' };
}

function tagAccent(tags) {
  if (tags.includes('错轮') || tags.includes('全局')) return '#d71920';
  if (tags.includes('轮椅')) return '#44c8c6';
  if (tags.includes('基础')) return '#4bd29c';
  if (tags.includes('标准')) return '#9aa4a8';
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
    nickname: /^unknown$/i.test(nickname) ? 'known' : nickname || t('submitter.historical'),
    email: email || t('submitter.noEmail'),
    badge: String(chart.submitter?.badge || '').toUpperCase() === 'UP' ? 'UP' : '',
    avatar: String(chart.submitter?.avatar || '').trim()
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
  const url = chart.downloadUrl || chart.url || '';
  if (!url) return;
  event.preventDefault();
  link.setAttribute('aria-busy', 'true');
  try {
    const response = await fetch(url, { credentials: 'same-origin', headers: embeddedVoterHeaders(url) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    rememberEmbeddedVoterToken(response, url);
    const source = await response.text();
    if (isEmbeddedClient) {
      const requestId = crypto.randomUUID?.() || `community-${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const payload = JSON.parse(source.replace(/^\uFEFF/, ''));
      pendingClientImports.set(requestId, String(chart.id || ''));
      window.parent.postMessage({ type: 'wwcombo:community-import', version: 1, requestId, filename: filenameFor(chart), payload }, '*');
      chart.viewerDownloaded = true;
      chart.canVote = !chart.viewerVote;
      chart.canFeedback = !chart.feedbackSubmitted;
      renderVoteControls(chart);
      render();
      return;
    }
    const blobUrl = URL.createObjectURL(new Blob([source], { type: response.headers.get('content-type') || 'application/json;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = blobUrl;
    anchor.download = filenameFor(chart);
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    chart.viewerDownloaded = true;
    chart.canVote = !chart.viewerVote;
    chart.canFeedback = !chart.feedbackSubmitted;
    renderVoteControls(chart);
    render();
  } catch (error) {
    if (isEmbeddedClient) void showAppMessage(t('detail.importFailed', { error: error instanceof Error ? error.message : String(error) }));
    else location.href = url;
  } finally {
    link.removeAttribute('aria-busy');
  }
}

const pendingClientImports = new Map();

function updateEmbeddedClientControls(imported = false) {
  if (!isEmbeddedClient) return;
  document.documentElement.dataset.clientEmbedded = 'true';
  if (els.clientDownloadButton) els.clientDownloadButton.style.display = 'none';
  const label = els.detailDownload?.querySelector('span');
  if (label) label.textContent = t(imported ? 'detail.importedClient' : 'detail.importClient');
}

window.addEventListener('message', (event) => {
  if (!isEmbeddedClient || event.source !== window.parent || !event.data || typeof event.data !== 'object') return;
  const result = event.data;
  if (result.type !== 'wwcombo:community-import-result' || result.version !== 1 || typeof result.requestId !== 'string') return;
  const comboId = pendingClientImports.get(result.requestId);
  if (comboId === undefined) return;
  pendingClientImports.delete(result.requestId);
  if (!result.ok) {
    void showAppMessage(t('detail.importFailed', { error: String(result.detail || t('common.unknown')) }));
    return;
  }
  rememberEmbeddedImportedCombo(comboId);
  if (String(state.detailChart?.id || '') === comboId) updateEmbeddedClientControls(true);
});

async function openClientDownload() {
  const popup = window.open('about:blank', '_blank');
  if (!state.appRelease) await loadAppRelease();
  const url = appReleaseDownloadUrl(state.appRelease);
  if (!url) {
    popup?.close();
    refreshClientDownloadControl();
    return;
  }
  if (popup) popup.location.href = url;
  else window.location.href = url;
}

function availableCharacters() {
  return uniqueSorted([
    ...state.characterIcons.keys(),
    ...state.charts.flatMap(chartCharacters),
    ...state.commissions.flatMap(commissionCharacters),
    ...state.commissions.flatMap((commission) => (commission.responses || []).flatMap((response) => response.characters || []))
  ]);
}

function renderProfileAvatarGrid() {
  if (!els.profileAvatarGrid) return;
  const names = availableCharacters();
  const buttons = [];
  const clear = document.createElement('button');
  clear.type = 'button';
  clear.className = `profile-avatar-option${state.profileDraftAvatar ? '' : ' selected'}`;
  clear.dataset.avatar = '';
  clear.textContent = profileInitial();
  clear.title = t('profile.avatarClear');
  buttons.push(clear);
  for (const name of names) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `profile-avatar-option${state.profileDraftAvatar === name ? ' selected' : ''}`;
    button.dataset.avatar = name;
    button.title = name;
    button.appendChild(avatarElement(name, 'profile-avatar-choice-image'));
    buttons.push(button);
  }
  els.profileAvatarGrid.replaceChildren(...buttons);
  if (els.profileAvatarChoice) els.profileAvatarChoice.textContent = state.profileDraftAvatar || t('profile.avatarNone');
}

function renderCharacterTrigger() {
  els.selectedAvatarStack.replaceChildren(...state.characters.map((name) => avatarElement(name)));
  els.characterPickerValue.textContent = state.characters.length ? state.characters.join(' / ') : t('character.all');
  els.characterPickerButton.setAttribute('aria-label', state.characters.length ? t('character.selectedAria', { names: state.characters.join(', ') }) : t('character.select'));
}

function setCharacterHint(warning = false) {
  els.characterPickerHint.textContent = warning
    ? t('character.max')
    : t('character.hint');
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
    empty.textContent = t('character.none');
    els.characterGrid.appendChild(empty);
  }
  els.characterSelectedCount.textContent = t('character.selected', { count: state.characters.length, max: MAX_SELECTED_CHARACTERS });
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
  syncModalBody();
  els.characterPickerButton.focus();
}

function renderFilters() {
  renderCharacterTrigger();
  const commissionView = state.view === 'commissions';
  els.sortField.hidden = commissionView;
  els.tagFilter.hidden = commissionView;
  els.createCommission.hidden = !commissionView;
  els.resultsTitle.textContent = t(commissionView ? 'plaza.commissions' : 'results.title');
  els.title.placeholder = t(commissionView ? 'commission.searchPlaceholder' : 'search.titlePlaceholder');
  els.comboTab.classList.toggle('active', !commissionView);
  els.comboTab.setAttribute('aria-selected', String(!commissionView));
  els.commissionTab.classList.toggle('active', commissionView);
  els.commissionTab.setAttribute('aria-selected', String(commissionView));
  const tags = uniqueSorted(state.charts.flatMap((chart) => Array.isArray(chart.tags) ? chart.tags : []));
  els.tags.replaceChildren();
  const all = document.createElement('button');
  all.type = 'button';
  all.className = `tag-button${state.tag ? '' : ' active'}`;
  all.textContent = t('common.all');
  all.dataset.tag = '';
  els.tags.appendChild(all);
  for (const tag of tags) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `tag-button${state.tag === tag ? ' active' : ''}`;
    button.textContent = i18n.localizeTag(tag);
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
  i18n.apply(card);
  const tags = Array.isArray(chart.tags) ? chart.tags.filter(Boolean) : [];
  const submitter = submitterFor(chart);
  card.style.setProperty('--accent', tagAccent(tags));
  card.querySelector('h3').textContent = chart.title || t('card.untitled');
  card.querySelector('.characters').textContent = chartCharacters(chart).join(' / ') || t('card.charactersMissing');
  card.querySelector('.rounds').textContent = t('unit.rounds', { count: Math.max(1, Number(chart.rounds || 1)) });
  card.querySelector('.duration').textContent = formatDuration(chart.durationMs);
  card.querySelector('.steps').textContent = t('unit.switches', { count: Number(chart.loopSwitchCount || 0) });
  card.querySelector('.updated').textContent = formatDate(chart.updatedAt);
  card.querySelector('.votes').textContent = t('vote.summary', { up: Number(chart.votes?.up || 0) });
  card.querySelector('.submitter-name').textContent = submitter.nickname;
  card.querySelector('.submitter-email').textContent = submitter.email;
  const submitterAvatar = card.querySelector('.submitter-avatar');
  submitterAvatar.replaceChildren();
  if (submitter.avatar) submitterAvatar.appendChild(avatarElement(submitter.avatar, 'submitter-avatar-img'));
  submitterAvatar.hidden = !submitter.avatar;
  const submitterBadge = card.querySelector('.submitter-badge');
  submitterBadge.hidden = !submitter.badge;
  submitterBadge.textContent = submitter.badge;

  const characters = chartCharacters(chart).slice(0, MAX_SELECTED_CHARACTERS);
  const characterContainer = card.querySelector('.card-characters');
  characterContainer.setAttribute('aria-label', characters.length ? t('character.usedAria', { names: characters.join(', ') }) : t('card.charactersMissing'));
  for (const name of characters) {
    const avatar = avatarElement(name, 'card-character-avatar');
    avatar.title = name;
    characterContainer.appendChild(avatar);
  }

  const tagContainer = card.querySelector('.combo-tags');
  for (const tag of tags) {
    const item = document.createElement('span');
    item.className = 'combo-tag';
    item.textContent = i18n.localizeTag(tag);
    tagContainer.appendChild(item);
  }
  const comboGrade = card.querySelector('.combo-grade');
  const grade = gradeForTags(tags);
  comboGrade.textContent = grade.grade;
  comboGrade.dataset.grade = grade.grade;
  comboGrade.hidden = !grade.grade;
  if (grade.tag) comboGrade.title = i18n.localizeTag(grade.tag);

  const detailButton = card.querySelector('.detail-button');
  detailButton.setAttribute('aria-label', `${t('card.details')}: ${chart.title || t('card.untitled')}`);
  detailButton.addEventListener('click', () => openDetails(chart));
  return card;
}

function replaceCommission(commission) {
  const index = state.commissions.findIndex((item) => item.id === commission.id);
  if (index >= 0) state.commissions.splice(index, 1, commission);
  else state.commissions.unshift(commission);
  state.commissionUpdatedAt = Math.max(state.commissionUpdatedAt, Number(commission.updatedAt || commission.createdAt || Date.now()));
  if (state.view === 'commissions') setStatus('ready', commissionReadyStatus());
}

function commissionReadyStatus() {
  return state.commissionUpdatedAt
    ? t('commission.ready', { count: state.commissions.length, date: formatDate(state.commissionUpdatedAt) })
    : t('commission.results', { count: state.commissions.length });
}

function commissionCharacters(commission) {
  return Array.isArray(commission?.characters) ? commission.characters.filter(Boolean).slice(0, MAX_SELECTED_CHARACTERS) : [];
}

function filteredCommissions() {
  const titleQuery = normalizeText(state.title);
  return state.commissions.filter((commission) => {
    const titleMatches = !titleQuery || normalizeText(commission.title).includes(titleQuery);
    const characterMatches = state.characters.every((name) => commissionCharacters(commission).includes(name));
    return titleMatches && characterMatches;
  }).sort((left, right) => Number(left.status === 'completed') - Number(right.status === 'completed') || Number(right.updatedAt || 0) - Number(left.updatedAt || 0));
}

function commissionStatusLabel(commission) {
  return t(commission.status === 'completed' ? 'commission.completed' : 'commission.open');
}

function renderCommissionCard(commission) {
  const card = els.commissionTemplate.content.firstElementChild.cloneNode(true);
  i18n.apply(card);
  card.classList.toggle('completed', commission.status === 'completed');
  const status = card.querySelector('.commission-status');
  status.textContent = commissionStatusLabel(commission);
  status.classList.toggle('completed', commission.status === 'completed');
  const grade = gradeForTags(commission.tag || '基础');
  const gradeNode = card.querySelector('.commission-grade');
  gradeNode.textContent = grade.grade;
  gradeNode.dataset.grade = grade.grade;
  gradeNode.title = i18n.localizeTag(grade.tag);
  card.querySelector('.commission-updated').textContent = formatDate(commission.updatedAt);
  card.querySelector('h3').textContent = commission.title || t('commission.untitled');
  card.querySelector('.commission-excerpt').textContent = commission.description || '';
  const characters = card.querySelector('.commission-characters');
  for (const name of commissionCharacters(commission)) {
    const item = document.createElement('span');
    item.append(avatarElement(name), document.createTextNode(name));
    characters.appendChild(item);
  }
  const owner = commission.owner || {};
  const ownerAvatar = card.querySelector('.commission-owner-avatar');
  renderProfileAvatarNode(ownerAvatar, owner.avatar, String(owner.nickname || '?').slice(0, 1));
  card.querySelector('.commission-owner strong').textContent = owner.nickname || t('common.unknown');
  card.querySelector('.commission-owner small').textContent = owner.email || '';
  const badge = card.querySelector('.commission-owner em');
  badge.hidden = !owner.badge;
  badge.textContent = owner.badge || '';
  card.querySelector('.commission-interest-count').textContent = t('commission.interestCount', { count: Number(commission.interestCount || 0) });
  card.querySelector('.commission-response-count').textContent = t('commission.responseCount', { count: Number(commission.responseCount || 0) });
  const interest = card.querySelector('.commission-interest-button');
  interest.disabled = commission.status === 'completed' || commission.viewerInterested;
  interest.classList.toggle('selected', Boolean(commission.viewerInterested));
  interest.querySelector('span').textContent = commission.viewerInterested ? t('commission.interested') : '+1';
  interest.addEventListener('click', () => { void addCommissionInterest(commission); });
  card.querySelector('.commission-detail-button').addEventListener('click', () => openCommissionDetail(commission));
  return card;
}

async function addCommissionInterest(commission) {
  if (!commission || commission.status === 'completed' || commission.viewerInterested) return;
  try {
    const response = await fetch(`/api/community/commissions/${encodeURIComponent(commission.id)}/interest`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: state.profile.email ? { 'x-wwcombo-profile-email': state.profile.email } : {}
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.error || `HTTP ${response.status}`);
    replaceCommission(body.commission);
    if (state.commissionDetail?.id === body.commission.id) state.commissionDetail = body.commission;
    render();
    if (state.commissionDetail?.id === body.commission.id) renderCommissionDetail();
  } catch (error) {
    void showAppMessage(t('commission.interestFailed', { error: error.message }));
  }
}

function renderCommissionCreateCharacters() {
  els.commissionCharacterGrid.replaceChildren();
  for (const name of availableCharacters()) {
    const selected = state.commissionCreateCharacters.includes(name);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `commission-character-option${selected ? ' selected' : ''}`;
    button.dataset.character = name;
    button.setAttribute('aria-pressed', String(selected));
    button.append(avatarElement(name), document.createTextNode(name));
    els.commissionCharacterGrid.appendChild(button);
  }
  els.commissionCharacterHint.textContent = t('commission.characterCount', { count: state.commissionCreateCharacters.length, max: MAX_SELECTED_CHARACTERS });
}

function renderCommissionCreateTag() {
  for (const button of els.commissionTagGrid?.querySelectorAll('[data-commission-tag]') || []) {
    const selected = button.dataset.commissionTag === state.commissionCreateTag;
    button.classList.toggle('selected', selected);
    button.setAttribute('aria-pressed', String(selected));
  }
}

function openCommissionCreate() {
  if (!state.profile.username || !state.profile.email) {
    openProfile();
    els.profileFeedback.textContent = t('profile.required');
    return;
  }
  state.commissionCreateCharacters = [];
  state.commissionCreateTag = '基础';
  els.commissionTitleInput.value = '';
  els.commissionDescriptionInput.value = '';
  els.commissionCreateFeedback.textContent = '';
  els.commissionCreateFeedback.className = 'form-feedback';
  renderProfile();
  renderCommissionCreateCharacters();
  renderCommissionCreateTag();
  els.commissionCreateBackdrop.hidden = false;
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => els.commissionTitleInput.focus());
}

function closeCommissionCreate() {
  els.commissionCreateBackdrop.hidden = true;
  syncModalBody();
}

async function submitCommission(event) {
  event.preventDefault();
  if (!state.commissionCreateCharacters.length) {
    els.commissionCreateFeedback.textContent = t('commission.characterRequired');
    return;
  }
  els.confirmCommissionCreate.disabled = true;
  els.commissionCreateFeedback.textContent = t('commission.publishing');
  try {
    const response = await fetch('/api/community/commissions', {
      method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        username: state.profile.username, email: state.profile.email, avatar: state.profile.avatar,
        title: els.commissionTitleInput.value.trim(), description: els.commissionDescriptionInput.value.trim(),
        characters: state.commissionCreateCharacters, tag: state.commissionCreateTag
      })
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.error || `HTTP ${response.status}`);
    replaceCommission(body.commission);
    closeCommissionCreate();
    render();
    openCommissionDetail(body.commission);
  } catch (error) {
    els.commissionCreateFeedback.textContent = error.message;
  } finally {
    els.confirmCommissionCreate.disabled = false;
  }
}

function isLikelyCommissionOwner(commission) {
  return commission?.viewerIsOwner === true;
}

function isCommissionResponseSubmitter(response) {
  return response?.viewerIsSubmitter === true;
}

function responseDetailChart(pack, response) {
  const packageChart = uploadedIndexChart(pack, response.fileName);
  return {
    ...packageChart,
    id: response.id,
    title: response.title || packageChart.title,
    characters: response.characters?.length ? response.characters : packageChart.characters,
    character: response.characters?.[0] || packageChart.character,
    tags: response.tags?.length ? response.tags : packageChart.tags,
    rounds: response.rounds || packageChart.rounds || 1,
    durationMs: response.durationMs || 0,
    loopSwitchCount: response.loopSwitchCount || 0,
    updatedAt: response.submittedAt || 0,
    submitter: response.submitter || {},
    url: response.packageUrl
  };
}

async function previewCommissionResponse(commission, response, trigger) {
  state.commissionResponse = response;
  if (trigger) {
    trigger.disabled = true;
    trigger.setAttribute('aria-busy', 'true');
  }
  try {
    const pack = await loadChartPackage({ url: response.packageUrl });
    if (state.commissionDetail?.id !== commission.id || state.commissionResponse?.id !== response.id) return;
    await openDetails(responseDetailChart(pack, response), { context: 'commission-response', response, package: pack });
  } catch (error) {
    void showAppMessage(t('axis.failed', { error: error.message }));
  } finally {
    if (trigger?.isConnected) {
      trigger.disabled = false;
      trigger.removeAttribute('aria-busy');
    }
  }
}

async function downloadCommissionResponse(response) {
  try {
    const request = await fetch(response.packageUrl, { credentials: 'same-origin' });
    if (!request.ok) throw new Error(`HTTP ${request.status}`);
    const source = await request.text();
    const blobUrl = URL.createObjectURL(new Blob([source], { type: 'application/json;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = blobUrl;
    anchor.download = response.fileName || `${response.title || 'commission-response'}.wwcombo.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
  } catch (error) {
    void showAppMessage(t('commission.downloadFailed', { error: error.message }));
  }
}

async function adoptCommissionResponse(commission, response) {
  if (!state.profile.email) {
    openProfile();
    return;
  }
  if (!await askAppConfirmation(t('commission.adoptConfirm', { title: response.title || t('upload.previewTitle') }), { danger: true })) return;
  try {
    const request = await fetch(`/api/community/commissions/${encodeURIComponent(commission.id)}/responses/${encodeURIComponent(response.id)}/adopt`, {
      method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: state.profile.email })
    });
    const body = await request.json().catch(() => ({}));
    if (!request.ok) throw new Error(body.error || `HTTP ${request.status}`);
    replaceCommission(body.commission);
    state.commissionDetail = body.commission;
    render();
    renderCommissionDetail();
  } catch (error) {
    void showAppMessage(t('commission.adoptFailed', { error: error.message }));
  }
}

async function withdrawCommissionResponse(commission, response) {
  if (!state.profile.email) {
    openProfile();
    return;
  }
  if (!await askAppConfirmation(t('commission.responseWithdrawConfirm', { title: response.title || t('upload.previewTitle') }), { danger: true })) return;
  try {
    const request = await fetch(`/api/community/commissions/${encodeURIComponent(commission.id)}/responses/${encodeURIComponent(response.id)}/withdraw`, {
      method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: state.profile.email })
    });
    const body = await request.json().catch(() => ({}));
    if (!request.ok) throw new Error(body.error || `HTTP ${request.status}`);
    replaceCommission(body.commission);
    state.commissionDetail = body.commission;
    if (state.commissionResponse?.id === response.id) {
      state.commissionResponse = null;
      state.commissionResponsePackage = null;
    }
    render();
    renderCommissionDetail();
    await showAppMessage(t('commission.responseWithdrawDone'));
  } catch (error) {
    void showAppMessage(t('commission.responseWithdrawFailed', { error: error.message }));
  }
}

async function withdrawCommission(commission) {
  if (!state.profile.email) {
    openProfile();
    els.profileFeedback.textContent = t('profile.withdrawRequired');
    return;
  }
  if (!await askAppConfirmation(t('commission.withdrawConfirm', { title: commission.title || t('commission.untitled') }), { danger: true })) return;
  els.commissionWithdraw.disabled = true;
  try {
    const request = await fetch(`/api/community/commissions/${encodeURIComponent(commission.id)}/withdraw`, {
      method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: state.profile.email })
    });
    const body = await request.json().catch(() => ({}));
    if (!request.ok) throw new Error(body.error || `HTTP ${request.status}`);
    state.commissions = state.commissions.filter((item) => item.id !== commission.id);
    state.commissionUpdatedAt = Math.max(0, ...state.commissions.map((item) => Number(item.updatedAt || item.createdAt || 0)));
    closeCommissionDetail();
    render();
    setStatus('ready', commissionReadyStatus());
    await showAppMessage(t('commission.withdrawDone'));
  } catch (error) {
    void showAppMessage(t('commission.withdrawFailed', { error: error.message }));
  } finally {
    els.commissionWithdraw.disabled = false;
  }
}

function renderCommissionResponseCard(commission, response) {
  const card = document.createElement('article');
  const accepted = response.id === commission.acceptedResponseId || response.status === 'accepted';
  card.className = `commission-response-card${accepted ? ' accepted' : ''}${state.commissionResponse?.id === response.id ? ' selected' : ''}`;
  const head = document.createElement('div');
  head.className = 'commission-response-card-head';
  const title = document.createElement('h4');
  title.textContent = response.title || t('upload.previewTitle');
  head.appendChild(title);
  if (accepted) {
    const mark = document.createElement('span');
    mark.textContent = t('commission.accepted');
    head.appendChild(mark);
  }
  const characters = document.createElement('div');
  characters.className = 'commission-response-characters';
  for (const name of response.characters || []) characters.appendChild(avatarElement(name));
  const submitter = document.createElement('p');
  submitter.textContent = `${response.submitter?.nickname || t('common.unknown')} · ${response.submitter?.email || ''}`;
  const meta = document.createElement('small');
  meta.textContent = `${t('unit.rounds', { count: Number(response.rounds || 1) })} · ${t('unit.switches', { count: Number(response.loopSwitchCount || 0) })} · ${formatDate(response.submittedAt)}`;
  const actions = document.createElement('div');
  actions.className = 'commission-response-actions';
  const preview = document.createElement('button');
  preview.type = 'button';
  preview.className = 'secondary-button';
  preview.innerHTML = '<i data-lucide="workflow" aria-hidden="true"></i>';
  preview.appendChild(document.createTextNode(t('commission.previewResponse')));
  preview.addEventListener('click', () => { void previewCommissionResponse(commission, response, preview); });
  const download = document.createElement('button');
  download.type = 'button';
  download.className = 'secondary-button';
  download.innerHTML = '<i data-lucide="download" aria-hidden="true"></i>';
  download.appendChild(document.createTextNode(t('detail.download')));
  download.addEventListener('click', () => { void downloadCommissionResponse(response); });
  actions.append(preview, download);
  if (commission.status !== 'completed' && isCommissionResponseSubmitter(response)) {
    const withdraw = document.createElement('button');
    withdraw.type = 'button';
    withdraw.className = 'secondary-button danger';
    withdraw.innerHTML = '<i data-lucide="undo-2" aria-hidden="true"></i>';
    withdraw.appendChild(document.createTextNode(t('commission.responseWithdraw')));
    withdraw.addEventListener('click', () => { void withdrawCommissionResponse(commission, response); });
    actions.appendChild(withdraw);
  } else if (commission.status !== 'completed' && isLikelyCommissionOwner(commission)) {
    const adopt = document.createElement('button');
    adopt.type = 'button';
    adopt.className = 'primary-button';
    adopt.innerHTML = '<i data-lucide="check" aria-hidden="true"></i>';
    adopt.appendChild(document.createTextNode(t('commission.adopt')));
    adopt.addEventListener('click', () => { void adoptCommissionResponse(commission, response); });
    actions.appendChild(adopt);
  }
  card.append(head, characters, submitter, meta, actions);
  return card;
}

function renderCommissionDetail() {
  const commission = state.commissionDetail;
  if (!commission) return;
  els.commissionDetailTitle.textContent = commission.title || t('commission.untitled');
  els.commissionDetailStatus.textContent = commissionStatusLabel(commission);
  els.commissionDetailStatus.classList.toggle('completed', commission.status === 'completed');
  els.commissionDetailCharacters.replaceChildren();
  for (const name of commissionCharacters(commission)) {
    const item = document.createElement('span');
    item.className = 'detail-character';
    item.append(avatarElement(name), document.createTextNode(name));
    els.commissionDetailCharacters.appendChild(item);
  }
  els.commissionDetailDescription.textContent = commission.description || '';
  els.commissionDetailOwner.replaceChildren();
  const ownerAvatar = document.createElement('span');
  ownerAvatar.className = 'profile-avatar';
  renderProfileAvatarNode(ownerAvatar, commission.owner?.avatar, String(commission.owner?.nickname || '?').slice(0, 1));
  const ownerCopy = document.createElement('span');
  ownerCopy.innerHTML = `<strong></strong><small></small>`;
  ownerCopy.querySelector('strong').textContent = `${commission.owner?.nickname || t('common.unknown')}${commission.owner?.badge ? ` · ${commission.owner.badge}` : ''}`;
  ownerCopy.querySelector('small').textContent = commission.owner?.email || '';
  els.commissionDetailOwner.append(ownerAvatar, ownerCopy);
  els.commissionDetailMeta.replaceChildren(
    detailMetaRow(t('commission.tag'), `${gradeForTags(commission.tag || '基础').grade} · ${i18n.localizeTag(commission.tag || '基础')}`),
    detailMetaRow(t('commission.interestLabel'), String(Number(commission.interestCount || 0))),
    detailMetaRow(t('commission.responseLabel'), String(Number(commission.responseCount || 0))),
    detailMetaRow(t('commission.created'), formatDate(commission.createdAt)),
    detailMetaRow('ID', commission.id || t('common.unknown'))
  );
  els.commissionInterest.disabled = commission.status === 'completed' || commission.viewerInterested;
  els.commissionInterest.querySelector('span').textContent = commission.viewerInterested ? t('commission.interested') : t('commission.interest');
  els.commissionResponseUpload.disabled = commission.status === 'completed';
  els.commissionWithdraw.hidden = commission.status === 'completed' || !isLikelyCommissionOwner(commission);
  els.commissionWithdraw.disabled = false;
  els.commissionResponseSummary.textContent = t('commission.responseCount', { count: Number(commission.responseCount || 0) });
  els.commissionResponseList.replaceChildren(...(commission.responses || []).map((response) => renderCommissionResponseCard(commission, response)));
  els.commissionResponseEmpty.hidden = Boolean(commission.responses?.length);
  els.commissionResponseList.hidden = !commission.responses?.length;
  if (!state.commissionResponse) els.commissionAxisPanel.hidden = true;
  window.lucide?.createIcons();
}

function openCommissionDetail(commission) {
  state.commissionDetail = commission;
  state.commissionResponse = null;
  state.commissionResponsePackage = null;
  els.commissionAxisPanel.hidden = true;
  renderCommissionDetail();
  els.commissionDetailBackdrop.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeCommissionDetail() {
  state.commissionDetail = null;
  state.commissionResponse = null;
  state.commissionResponsePackage = null;
  els.commissionDetailBackdrop.hidden = true;
  syncModalBody();
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
    item.textContent = i18n.localizeTag(tag);
    els.detailTags.appendChild(item);
  }
}

function renderVoteControls(chart) {
  const vote = chart.viewerVote === 'up' || chart.viewerVote === 'down' ? chart.viewerVote : '';
  const downloaded = chart.viewerDownloaded === true || chart.canVote === true || chart.canFeedback === true;
  const canVote = chart.canVote === true && !vote;
  const feedbackSubmitted = chart.feedbackSubmitted === true;
  const canFeedback = chart.canFeedback === true && !feedbackSubmitted;
  els.detailUpvote.querySelector('[data-vote-count]').textContent = String(Number(chart.votes?.up || 0));
  els.detailUpvote.classList.toggle('selected', vote === 'up');
  els.detailUpvote.disabled = !canVote;
  els.detailFeedback.classList.toggle('selected', feedbackSubmitted);
  els.detailFeedback.disabled = !canFeedback;
  els.detailFeedback.querySelector('span').textContent = t(feedbackSubmitted ? 'feedback.sent' : 'feedback.button');
  const hintKey = !downloaded
    ? 'vote.downloadRequired'
    : feedbackSubmitted && vote
      ? 'vote.done'
      : feedbackSubmitted
        ? 'feedback.sentHint'
        : vote
          ? 'feedback.ready'
          : 'vote.ready';
  els.detailVoteHint.textContent = t(hintKey);
}

async function castVote(chart) {
  if (!chart?.id || chart.viewerVote) return;
  els.detailUpvote.disabled = true;
  try {
    const response = await fetch('/api/community/vote', {
      method: 'POST', credentials: 'same-origin', headers: embeddedVoterHeaders('/api/community/vote', { 'content-type': 'application/json' }),
      body: JSON.stringify({ comboId: chart.id, vote: 'up' })
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.error || `HTTP ${response.status}`);
    chart.votes = body.votes;
    chart.viewerVote = body.viewerVote;
    chart.canVote = false;
    renderVoteControls(chart);
    render();
  } catch (error) {
    renderVoteControls(chart);
    void showAppMessage(t('vote.failed', { error: error.message }));
  }
}

function closeFeedback() {
  state.feedbackChart = null;
  els.feedbackBackdrop.hidden = true;
  syncModalBody();
}

function updateFeedbackCount() {
  els.feedbackReasonCount.value = `${els.feedbackReason.value.length} / 1000`;
  els.feedbackReasonCount.textContent = els.feedbackReasonCount.value;
}

function openFeedback(chart) {
  if (!chart?.id) return;
  if (chart.feedbackSubmitted) {
    void showAppMessage(t('feedback.sentHint'));
    return;
  }
  if (!chart.canFeedback) {
    void showAppMessage(t('feedback.downloadRequired'));
    return;
  }
  state.feedbackChart = chart;
  els.feedbackReason.value = '';
  els.feedbackFormStatus.textContent = '';
  els.feedbackFormStatus.className = '';
  updateFeedbackCount();
  els.feedbackBackdrop.hidden = false;
  syncModalBody();
  requestAnimationFrame(() => els.feedbackReason.focus());
}

async function submitFeedback(event) {
  event.preventDefault();
  const chart = state.feedbackChart;
  const reason = els.feedbackReason.value.trim();
  if (!chart?.id || reason.length < 5) {
    els.feedbackFormStatus.textContent = t('feedback.tooShort');
    els.feedbackFormStatus.className = 'error';
    return;
  }
  els.submitFeedback.disabled = true;
  els.feedbackFormStatus.textContent = t('feedback.sending');
  els.feedbackFormStatus.className = '';
  try {
    const response = await fetch('/api/community/feedback', {
      method: 'POST', credentials: 'same-origin', headers: embeddedVoterHeaders('/api/community/feedback', { 'content-type': 'application/json' }),
      body: JSON.stringify({ comboId: chart.id, reason })
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.error || `HTTP ${response.status}`);
    chart.feedbackSubmitted = true;
    chart.canFeedback = false;
    closeFeedback();
    renderVoteControls(chart);
    render();
    void showAppMessage(t('feedback.success'));
  } catch (error) {
    els.feedbackFormStatus.textContent = t('feedback.failed', { error: error.message });
    els.feedbackFormStatus.className = 'error';
  } finally {
    els.submitFeedback.disabled = false;
  }
}

function axisPeriodLabel(period, loopCount) {
  const source = String(period.label || '').trim();
  if (period.kind === 'startup_axis') return source && source !== '启动轴' && source !== '完整连段' ? source : t(source === '完整连段' ? 'axis.full' : 'axis.startup');
  if (source && !/^循环轴\d*$/.test(source)) return source;
  return loopCount > 1 ? t('axis.loopNumber', { number: period.loopIndex || 1 }) : t('axis.loop');
}

function axisStepLabel(step, labels) {
  const custom = String(labels[step.id] || '').trim();
  return custom || DEFAULT_MOVE_LABELS[step.moveId] || String(step.label || step.moveId || t('meta.actions'));
}

function axisBindingCode(moveId, mode) {
  const source = mode === 'gamepad' ? state.axisKeySettings?.gamepadBindings : state.axisKeySettings?.keyboardMouseBindings;
  return source?.find((binding) => binding.moveId === moveId)?.inputs.find((input) => input.code)?.code || '';
}

function axisLabelMatchesMove(label, moveId) {
  const value = String(label || '').trim();
  if (!value || value.includes('[') || value.includes(']')) return !value;
  if (value === DEFAULT_MOVE_LABELS[moveId]) return true;
  const mappingId = {
    basic_attack: 'mouse-left', heavy_attack: 'mouse-left-hold',
    skill: 'skill', skill_hold: 'skill-hold',
    echo: 'echo', echo_hold: 'echo-hold',
    liberation: 'liberation', liberation_hold: 'liberation-hold',
    dodge: 'mouse-right', dodge_hold: 'mouse-right-hold',
    jump: 'jump', jump_hold: 'jump-hold', tool: 'tool',
    finisher: 'finisher', forward: 'forward',
    switch_1: 'i', switch_2: 'ii', switch_3: 'iii'
  }[moveId];
  const mapping = AXIS_ICON_MAPPINGS.find((item) => item.id === mappingId);
  return Boolean(mapping?.triggers.includes(value));
}

function axisStepDisplay(step, labels) {
  const label = axisStepLabel(step, labels);
  const custom = String(labels[step.id] || '').trim();
  if (!state.axisKeySettings || !axisLabelMatchesMove(custom, step.moveId) || state.axisIconSet === 'graphic') return { label, iconSrc: '', wide: false };
  if (state.axisIconSet === 'english') {
    const code = axisBindingCode(step.moveId, 'keyboard');
    return { label, iconSrc: code ? keyboardMouseIconSource(code) || '' : '', wide: code.includes('+') };
  }
  const code = axisBindingCode(step.moveId, 'gamepad');
  return { label, iconSrc: code ? gamepadIconSource(code, state.axisIconSet) || '' : '', wide: code.includes('+') };
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
    if (text[index] === '[') {
      const closingIndex = text.indexOf(']', index + 1);
      if (closingIndex >= 0) {
        pushText();
        const literalText = text.slice(index + 1, closingIndex);
        if (literalText) parts.push({ kind: 'text', value: literalText });
        index = closingIndex + 1;
        continue;
      }
    }
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

function estimateAxisActionWidth(display) {
  if (display.iconSrc) return display.wide ? 49 : AXIS_ICON_SIZE;
  const parts = axisIconParts(display.label);
  const contentWidth = parts.reduce((width, part) => {
    if (part.kind === 'icon') {
      const wideGamepadIcon = ['xbox', 'playstation'].includes(state.axisIconSet) && part.mapping.gamepadCode?.includes('+');
      return width + (wideGamepadIcon ? 49 : AXIS_ICON_SIZE);
    }
    return width + Math.max(14, Array.from(part.value).length * 12);
  }, 0);
  return Math.max(20, contentWidth + Math.max(0, parts.length - 1) * 2);
}

function axisBlockMaxWidth(target = els.axisPreview) {
  return Math.max(220, target.clientWidth - 72);
}

function splitAxisMoveGroups(groups, labels, target = els.axisPreview) {
  const maxWidth = axisBlockMaxWidth(target);
  const scale = state.axisScale;
  const chunks = [];
  for (const group of groups) {
    let chunk = { slot: group.slot, steps: [], showAvatar: true };
    let width = (20 + AXIS_AVATAR_SIZE + 8) * scale;
    for (const step of group.steps) {
      const actionWidth = estimateAxisActionWidth(axisStepDisplay(step, labels)) * scale;
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

function axisActionContent(display) {
  const action = document.createElement('span');
  action.className = 'axis-action';
  if (display.iconSrc) {
    const icon = document.createElement('img');
    icon.className = 'axis-action-icon';
    if (display.wide) icon.classList.add('is-wide');
    icon.src = display.iconSrc;
    icon.alt = display.label;
    icon.title = display.label;
    action.appendChild(icon);
    return action;
  }
  for (const part of axisIconParts(display.label)) {
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
    icon.alt = i18n.localizeMove(part.mapping.label);
    icon.title = i18n.localizeMove(part.mapping.label);
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

function renderAxisKeymapButtons() {
  for (const button of els.axisKeymapButtons) {
    button.classList.toggle('loaded', Boolean(state.axisKeySettings));
    button.title = state.axisKeySettings
      ? t('axis.keysImported', { file: state.axisKeySettingsFile || 'wwcombo-input-settings' })
      : t('axis.importKeys');
  }
}

async function importAxisKeySettings(file) {
  if (!file) return;
  try {
    const value = JSON.parse((await file.text()).replace(/^\uFEFF/, ''));
    state.axisKeySettings = normalizeAxisKeySettings(value);
    state.axisKeySettingsFile = file.name;
    if (state.axisKeySettings.preferences.inputMode === 'gamepad') state.axisIconSet = state.axisKeySettings.preferences.gamepadIconSet;
    else state.axisIconSet = 'english';
    try { localStorage.setItem(AXIS_KEY_SETTINGS_STORAGE_KEY, JSON.stringify({ settings: state.axisKeySettings, fileName: file.name })); } catch {}
    renderAxisIconSet();
    renderAxisKeymapButtons();
    renderActiveAxisPreviews();
    void showAppMessage(t('axis.keysImported', { file: file.name }));
  } catch {
    void showAppMessage(t('axis.keysInvalid'));
  } finally {
    els.axisKeymapInput.value = '';
  }
}

function syncAxisScaleControls() {
  const percent = Math.round(state.axisScale * 100);
  for (const input of els.axisZoomControls) input.value = String(percent);
  for (const output of els.axisZoomValues) output.value = `${percent}%`;
}

function renderActiveAxisPreviews() {
  if (state.detailChart && state.detailPackage) renderAxisPreview(state.detailPackage, state.detailChart);
  renderUploadAxisPreview();
  if (state.commissionResponse && state.commissionResponsePackage) {
    renderAxisPreview(state.commissionResponsePackage, responseIndexChart(state.commissionResponse), { preview: els.commissionAxisPreview, summary: els.commissionAxisSummary });
  }
}

function renderAxisPreview(pack, indexChart, targets = {}) {
  const previewTarget = targets.preview || els.axisPreview;
  const summaryTarget = targets.summary || els.axisPreviewSummary;
  const chart = pack?.chart || (Array.isArray(pack?.charts) ? pack.charts[0] : null) || (Array.isArray(pack?.steps) ? pack : null);
  if (!chart || !Array.isArray(chart.steps)) throw new Error(t('axis.invalid'));
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
  const showAllReasons = ['错轮'].filter((tag) => previewTags.has(tag));
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
    const moveGroups = splitAxisMoveGroups(groupAxisSteps(steps), labels, previewTarget);
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
      const character = characters[slot - 1] || t('axis.role', { number: slot });
      const chip = document.createElement('div');
      chip.className = `axis-step axis-move-block${moveGroup.showAvatar ? '' : ' axis-move-continuation'}`;
      chip.style.setProperty('--role-color', ROLE_COLORS[slot - 1]);
      const firstStep = moveGroup.steps[0];
      const lastStep = moveGroup.steps[moveGroup.steps.length - 1];
      const actionDisplays = moveGroup.steps.map((step) => axisStepDisplay(step, labels));
      const actionLabels = actionDisplays.map((display) => display.label);
      chip.title = `${character} · ${actionLabels.join('')} · ${formatDuration(firstStep.startMin)} - ${formatDuration(lastStep.startMin)}`;
      if (moveGroup.showAvatar) chip.appendChild(avatarElement(character));
      const content = document.createElement('div');
      content.className = 'axis-move-content';
      content.setAttribute('aria-label', actionLabels.join(''));
      for (const display of actionDisplays) content.appendChild(axisActionContent(display));
      chip.appendChild(content);
      flow.appendChild(chip);
    }
    if (!steps.length) {
      const empty = document.createElement('span');
      empty.className = 'axis-empty';
      empty.textContent = t('axis.noActions');
      flow.appendChild(empty);
    }
    group.append(heading, flow);
    fragment.appendChild(group);
  }
  previewTarget.replaceChildren(fragment);
  const periodText = showAll
    ? `${showAllReasons.map((tag) => i18n.localizeTag(tag)).join(' / ')} · ${t('axis.allRounds')}`
    : periods.map((period) => axisPeriodLabel(period, loops.length)).join(' + ');
  summaryTarget.textContent = t('axis.summary', { periods: periodText, steps: visibleStepCount, blocks: visibleBlockCount });
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

async function requestWithdrawal(chart) {
  if (!state.profile.username || !state.profile.email) {
    openProfile();
    els.profileFeedback.textContent = t('profile.withdrawRequired');
    return;
  }
  if (!await askAppConfirmation(t('withdraw.confirm', { title: chart.title || t('card.untitled') }), { danger: true })) return;
  els.detailWithdraw.disabled = true;
  try {
    const response = await fetch('/api/community/withdraw', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ comboId: chart.id, username: state.profile.username, email: state.profile.email })
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.error || `HTTP ${response.status}`);
    await showAppMessage(body.status === 'withdrawn' ? t('withdraw.done') : t('withdraw.pending'));
    if (body.status === 'withdrawn') {
      closeDetails();
      await loadIndex();
    }
  } catch (error) {
    void showAppMessage(t('withdraw.failed', { error: error.message }));
  } finally {
    els.detailWithdraw.disabled = false;
  }
}

async function openDetails(chart, options = {}) {
  const responseMode = options.context === 'commission-response';
  state.detailChart = chart;
  state.detailPackage = options.package || null;
  state.detailOptions = options;
  if (responseMode && !els.commissionDetailBackdrop.hidden) {
    els.commissionDetailBackdrop.inert = true;
    els.commissionDetailBackdrop.setAttribute('aria-hidden', 'true');
  }
  renderAxisIconSet();
  const submitter = submitterFor(chart);
  els.detailTitle.textContent = chart.title || t('card.untitled');
  renderDetailCharacters(chart);
  renderDetailTags(chart);
  const detailRows = [
    detailMetaRow(t('meta.rounds'), t('unit.rounds', { count: Math.max(1, Number(chart.rounds || 1)) })),
    detailMetaRow(t('meta.firstCharacter'), chart.firstCharacter || chartCharacters(chart)[0] || t('common.unknown')),
    detailMetaRow(t('meta.loopSwitches'), t('unit.switches', { count: Number(chart.loopSwitchCount || 0) })),
    detailMetaRow(t('meta.updated'), formatDate(chart.updatedAt)),
    detailMetaRow(t('meta.uploadVersion'), chart.uploadVersion || state.gameVersion)
  ];
  if (!responseMode) detailRows.push(detailMetaRow(t('meta.downloads'), t('unit.downloads', { count: Number(chart.downloadCount || 0) })));
  detailRows.push(detailMetaRow('ID', chart.id || t('common.unknown')));
  els.detailMeta.replaceChildren(...detailRows);
  els.detailDescription.textContent = chart.description || '';
  els.detailDescriptionSection.hidden = !chart.description;
  els.detailSubmitter.textContent = `${submitter.nickname}${submitter.badge ? ` · ${submitter.badge}` : ''} · ${submitter.email}`;
  els.detailSourceLink.hidden = !chart.link;
  els.detailSourceLink.href = chart.link || '#';
  els.detailDownload.href = chart.downloadUrl || chart.url || '#';
  els.detailDownload.download = filenameFor(chart);
  els.detailDownload.onclick = responseMode
    ? (event) => { event.preventDefault(); void downloadCommissionResponse(options.response); }
    : (event) => downloadChart(event, chart);
  if (!responseMode) updateEmbeddedClientControls(embeddedImportedCombos.has(String(chart.id || '')));
  els.detailVoteSection.hidden = responseMode;
  els.detailWithdraw.hidden = responseMode;
  els.detailWithdraw.onclick = () => requestWithdrawal(chart);
  els.detailUpvote.onclick = () => { void castVote(chart); };
  els.detailFeedback.onclick = () => openFeedback(chart);
  if (!responseMode) renderVoteControls(chart);
  els.detailBackdrop.hidden = false;
  document.body.style.overflow = 'hidden';
  window.lucide?.createIcons();

  if (options.package) {
    renderAxisPreview(options.package, chart);
    return;
  }

  els.axisPreviewSummary.textContent = t('axis.loading');
  els.axisPreview.innerHTML = '<div class="axis-loading"><span></span><span></span><span></span></div>';

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
    failure.textContent = t('axis.failed', { error: error.message });
    els.axisPreview.appendChild(failure);
    els.axisPreviewSummary.textContent = t('axis.unavailable');
  }
}

function closeDetails() {
  if (state.detailOptions?.context === 'commission-response') {
    els.commissionDetailBackdrop.inert = false;
    els.commissionDetailBackdrop.removeAttribute('aria-hidden');
  }
  state.detailChart = null;
  state.detailPackage = null;
  state.detailOptions = null;
  els.detailBackdrop.hidden = true;
  syncModalBody();
}

function syncUrl() {
  const next = new URLSearchParams(location.search);
  next.delete('character');
  const values = [
    ['q', state.title],
    ['characters', state.characters.join(',')],
    ['tag', state.tag],
    ['sort', state.sort === 'version' ? '' : state.sort],
    ['view', state.view === 'commissions' ? 'commissions' : '']
  ];
  for (const [key, value] of values) {
    if (value) next.set(key, value);
    else next.delete(key);
  }
  history.replaceState(null, '', `${location.pathname}${next.size ? `?${next}` : ''}${location.hash}`);
}

function render() {
  const commissionView = state.view === 'commissions';
  const items = commissionView ? filteredCommissions() : filteredCharts();
  els.list.classList.toggle('commission-list', commissionView);
  els.list.replaceChildren(...items.map((item) => commissionView ? renderCommissionCard(item) : renderCard(item)));
  els.count.textContent = t(commissionView ? 'commission.results' : 'unit.results', { count: items.length });
  els.empty.querySelector('strong').textContent = t(commissionView ? 'commission.empty' : 'empty.title');
  els.empty.querySelector('span').textContent = t(commissionView ? 'commission.emptyHint' : 'empty.body');
  els.empty.hidden = items.length > 0;
  els.list.hidden = items.length === 0;
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

function setCommunityView(view) {
  const next = view === 'commissions' ? 'commissions' : 'combos';
  if (state.view === next) return;
  state.view = next;
  state.tag = '';
  els.error.hidden = true;
  renderFilters();
  render();
  if (next === 'commissions' && state.commissionLoadState === 'idle') void loadCommissions();
  if (next === 'commissions') {
    if (state.commissionLoadState === 'loading') setStatus('', t('commission.loading'));
    else if (state.commissionLoadState === 'ready') setStatus('ready', commissionReadyStatus());
    else if (state.commissionLoadState === 'error') {
      els.error.hidden = false;
      els.errorMessage.textContent = t('commission.loadError', { error: t('error.later') });
      setStatus('error', t('commission.loadFailed'));
    }
  } else if (state.indexLoadState === 'ready') setStatus('ready', t('status.ready', { count: state.charts.length, date: formatDate(state.indexUpdatedAt) }));
  else if (state.indexLoadState === 'error') {
    els.error.hidden = false;
    setStatus('error', t('status.indexFailed'));
  }
}

function setStatus(kind, text) {
  els.status.className = `index-status ${kind}`;
  els.status.lastElementChild.textContent = text;
}

function refreshLocalizedView() {
  updateThemeControl();
  updateMotionControl();
  refreshClientDownloadControl();
  renderProfile();
  renderFilters();
  render();
  renderAxisKeymapButtons();
  if (!els.characterPickerBackdrop.hidden) {
    setCharacterHint(false);
    renderCharacterPicker();
  }
  if (state.detailChart) void openDetails(state.detailChart, state.detailOptions || {});
  if (state.commissionDetail) renderCommissionDetail();
  if (!els.uploadBackdrop.hidden) {
    const commissionUpload = state.uploadMode === 'commission';
    els.uploadTitle.textContent = t(commissionUpload ? 'commission.uploadResponse' : 'upload.title');
    els.uploadHint.textContent = t(commissionUpload ? 'commission.uploadHint' : 'upload.hint');
    els.confirmUploadLabel.textContent = t(commissionUpload ? 'commission.submitResponse' : 'upload.submit');
    renderAxisIconSet();
    syncAxisScaleControls();
    if (state.uploadChart && state.uploadPackage) renderUploadAxisPreview();
    else resetUploadAxisPreview();
  }
  if (state.view === 'commissions') {
    if (state.commissionLoadState === 'loading' || state.commissionLoadState === 'idle') setStatus('', t('commission.loading'));
    else if (state.commissionLoadState === 'ready') setStatus('ready', commissionReadyStatus());
    else setStatus('error', t('commission.loadFailed'));
  } else if (state.indexLoadState === 'loading') setStatus('', t('status.loading'));
  else if (state.indexLoadState === 'ready') setStatus('ready', t('status.ready', { count: state.charts.length, date: formatDate(state.indexUpdatedAt) }));
  else setStatus('error', t('status.indexFailed'));
  updateEmbeddedClientControls(Boolean(state.detailChart && embeddedImportedCombos.has(String(state.detailChart.id || ''))));
  window.lucide?.createIcons();
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
    renderProfile();
    render();
    if (!els.characterPickerBackdrop.hidden) renderCharacterPicker();
  } catch {
    state.characterIcons = new Map();
  }
}

async function loadAppRelease() {
  state.appReleaseState = 'loading';
  refreshClientDownloadControl();
  try {
    const response = await fetch(appReleaseManifestUrl(), { cache: 'no-cache' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const value = await response.json();
    if (value?.schemaVersion !== 1 || typeof value.version !== 'string') throw new Error('Invalid app release manifest');
    state.appRelease = value;
    state.appReleaseState = 'ready';
  } catch {
    state.appRelease = null;
    state.appReleaseState = 'error';
  }
  refreshClientDownloadControl();
}

async function loadIndex() {
  if (state.view === 'combos') els.error.hidden = true;
  els.list.hidden = false;
  state.indexLoadState = 'loading';
  if (state.view === 'combos') setStatus('', t('status.loading'));
  try {
    const response = await fetch(sourceUrl, { cache: 'no-cache', credentials: 'same-origin', headers: embeddedVoterHeaders(sourceUrl) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (data.type !== 'wwcombo-community-index' || !Array.isArray(data.charts)) throw new Error(t('status.invalidIndex'));
    state.charts = data.charts.map((chart) => ({ ...chart, tags: normalizedTags(chart.tags) }));
    state.gameVersion = /^\d+\.\d+$/.test(String(data.gameVersion || '')) ? String(data.gameVersion) : '3.5';
    state.indexUpdatedAt = Number(data.updatedAt || 0);
    state.indexLoadState = 'ready';
    state.title = params.get('q') || '';
    const characterParam = params.get('characters') || params.get('character') || '';
    state.characters = uniqueSorted(characterParam.split(',').map((item) => item.trim())).slice(0, MAX_SELECTED_CHARACTERS);
    state.tag = params.get('tag') || '';
    state.sort = ['version', 'difficulty'].includes(params.get('sort')) ? params.get('sort') : 'version';
    els.title.value = state.title;
    renderFilters();
    render();
    if (state.view === 'combos') setStatus('ready', t('status.ready', { count: state.charts.length, date: formatDate(data.updatedAt) }));
    void loadCharacterIcons();
  } catch (error) {
    state.charts = [];
    state.indexLoadState = 'error';
    if (state.view === 'combos') {
      els.list.replaceChildren();
      els.list.hidden = true;
      els.empty.hidden = true;
      els.error.hidden = false;
      els.errorMessage.textContent = t('status.readFailed', { source: sourceUrl, error: error.message });
      setStatus('error', t('status.indexFailed'));
    }
  }
}

async function loadCommissions() {
  state.commissionLoadState = 'loading';
  if (state.view === 'commissions') setStatus('', t('commission.loading'));
  try {
    const response = await fetch('/api/community/commissions', {
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: state.profile.email ? { 'x-wwcombo-profile-email': state.profile.email } : {}
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data.commissions)) throw new Error(t('status.invalidIndex'));
    state.commissions = data.commissions;
    state.commissionUpdatedAt = Number(data.updatedAt || 0);
    state.commissionLoadState = 'ready';
    renderFilters();
    render();
    if (state.view === 'commissions') setStatus('ready', commissionReadyStatus());
  } catch (error) {
    state.commissions = [];
    state.commissionLoadState = 'error';
    if (state.view === 'commissions') {
      els.list.replaceChildren();
      els.list.hidden = true;
      els.empty.hidden = true;
      els.error.hidden = false;
      els.errorMessage.textContent = t('commission.loadError', { error: error.message });
      setStatus('error', t('commission.loadFailed'));
    }
  }
}

els.form.addEventListener('submit', (event) => event.preventDefault());
els.comboTab?.addEventListener('click', () => setCommunityView('combos'));
els.commissionTab?.addEventListener('click', () => setCommunityView('commissions'));
els.createCommission?.addEventListener('click', openCommissionCreate);
els.closeCommissionCreate?.addEventListener('click', closeCommissionCreate);
els.cancelCommissionCreate?.addEventListener('click', closeCommissionCreate);
els.commissionCreateBackdrop?.addEventListener('mousedown', (event) => { if (event.target === els.commissionCreateBackdrop) closeCommissionCreate(); });
els.editCommissionProfile?.addEventListener('click', () => { closeCommissionCreate(); openProfile(); });
els.commissionCharacterGrid?.addEventListener('click', (event) => {
  const button = event.target.closest('.commission-character-option');
  const name = button?.dataset.character || '';
  if (!name) return;
  if (state.commissionCreateCharacters.includes(name)) state.commissionCreateCharacters = state.commissionCreateCharacters.filter((item) => item !== name);
  else if (state.commissionCreateCharacters.length < MAX_SELECTED_CHARACTERS) state.commissionCreateCharacters = [...state.commissionCreateCharacters, name];
  renderCommissionCreateCharacters();
});
els.commissionTagGrid?.addEventListener('click', (event) => {
  const button = event.target.closest('[data-commission-tag]');
  if (!button?.dataset.commissionTag) return;
  state.commissionCreateTag = button.dataset.commissionTag;
  renderCommissionCreateTag();
});
els.commissionCreateForm?.addEventListener('submit', submitCommission);
els.closeCommissionDetail?.addEventListener('click', closeCommissionDetail);
els.commissionDetailBackdrop?.addEventListener('mousedown', (event) => { if (event.target === els.commissionDetailBackdrop) closeCommissionDetail(); });
els.commissionInterest?.addEventListener('click', () => { if (state.commissionDetail) void addCommissionInterest(state.commissionDetail); });
els.commissionResponseUpload?.addEventListener('click', () => { if (state.commissionDetail) openUpload(state.commissionDetail.id); });
els.commissionWithdraw?.addEventListener('click', () => { if (state.commissionDetail) void withdrawCommission(state.commissionDetail); });
els.languageSelect?.addEventListener('change', () => i18n.setLanguage(els.languageSelect.value));
window.addEventListener('wwcombo-languagechange', refreshLocalizedView);
els.clientDownloadButton?.addEventListener('click', () => { void openClientDownload(); });
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
    renderActiveAxisPreviews();
  });
}
for (const button of els.axisKeymapButtons) button.addEventListener('click', () => els.axisKeymapInput.click());
els.axisKeymapInput.addEventListener('change', () => { void importAxisKeySettings(els.axisKeymapInput.files?.[0]); });
for (const input of els.axisZoomControls) {
  input.addEventListener('input', () => {
    state.axisScale = Math.max(0.8, Math.min(1.8, Number(input.value || 100) / 100));
    syncAxisScaleControls();
    renderActiveAxisPreviews();
  });
}
let axisResizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(axisResizeTimer);
  if ((!state.detailChart || !state.detailPackage) && (!state.uploadChart || !state.uploadPackage) && (!state.commissionResponse || !state.commissionResponsePackage)) return;
  axisResizeTimer = setTimeout(renderActiveAxisPreviews, 120);
});
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  if (!els.appDialogBackdrop.hidden) closeAppDialog(false);
  else if (!els.feedbackBackdrop.hidden) closeFeedback();
  else if (!els.uploadBackdrop.hidden) closeUpload();
  else if (!els.profileBackdrop.hidden) closeProfile();
  else if (!els.detailBackdrop.hidden) closeDetails();
  else if (!els.commissionDetailBackdrop.hidden) closeCommissionDetail();
  else if (!els.commissionCreateBackdrop.hidden) closeCommissionCreate();
  else if (!els.characterPickerBackdrop.hidden) closeCharacterPicker();
});
els.appDialogCancel?.addEventListener('click', () => closeAppDialog(false));
els.appDialogAccept?.addEventListener('click', () => closeAppDialog(true));
els.appDialogBackdrop?.addEventListener('mousedown', (event) => { if (event.target === els.appDialogBackdrop) closeAppDialog(false); });
els.feedbackForm?.addEventListener('submit', submitFeedback);
els.feedbackReason?.addEventListener('input', updateFeedbackCount);
els.closeFeedback?.addEventListener('click', closeFeedback);
els.cancelFeedback?.addEventListener('click', closeFeedback);
els.feedbackBackdrop?.addEventListener('mousedown', (event) => { if (event.target === els.feedbackBackdrop) closeFeedback(); });
els.reset.addEventListener('click', resetFilters);
els.emptyReset.addEventListener('click', resetFilters);
els.retry.addEventListener('click', () => { els.error.hidden = true; if (state.view === 'commissions') void loadCommissions(); else void loadIndex(); });
els.themeToggle?.addEventListener('click', () => {
  setTheme(state.theme === 'day' ? 'night' : 'day');
});
els.motionToggle?.addEventListener('click', () => {
  setHeroMotionEnabled(!state.heroMotionEnabled);
});
els.profileButton?.addEventListener('click', openProfile);
els.closeProfile?.addEventListener('click', closeProfile);
els.profileBackdrop?.addEventListener('mousedown', (event) => { if (event.target === els.profileBackdrop) closeProfile(); });
els.profileForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  state.profile = { ...state.profile, username: els.profileUsernameInput.value.trim().slice(0, 40), email: els.profileEmailInput.value.trim().toLowerCase().slice(0, 254), avatar: state.profileDraftAvatar };
  try { localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(state.profile)); } catch {}
  renderProfile();
  if (state.commissionLoadState !== 'idle') void loadCommissions();
  els.profileFeedback.textContent = t('profile.saved');
  els.profileFeedback.className = 'form-feedback success';
  setTimeout(closeProfile, 500);
});
els.clearProfile?.addEventListener('click', () => {
  state.profile = { username: '', email: '', avatar: '' };
  state.profileDraftAvatar = '';
  try { localStorage.removeItem(PROFILE_STORAGE_KEY); } catch {}
  els.profileUsernameInput.value = '';
  els.profileEmailInput.value = '';
  renderProfile();
  if (state.commissionLoadState !== 'idle') void loadCommissions();
});
els.profileAvatarGrid?.addEventListener('click', (event) => {
  const button = event.target.closest('.profile-avatar-option');
  if (!button) return;
  state.profileDraftAvatar = button.dataset.avatar || '';
  renderProfileAvatarGrid();
});
els.submissionButton?.addEventListener('click', () => openUpload());
els.closeUpload?.addEventListener('click', closeUpload);
els.cancelUpload?.addEventListener('click', closeUpload);
els.uploadBackdrop?.addEventListener('mousedown', (event) => { if (event.target === els.uploadBackdrop) closeUpload(); });
els.editUploadProfile?.addEventListener('click', () => { closeUpload(); openProfile(); });
els.comboFile?.addEventListener('change', () => {
  void previewUploadFile();
});
els.uploadForm?.addEventListener('submit', submitCombo);

if (isEmbeddedClient) {
  i18n.setLanguage(params.get('lang'), false);
  setTheme(params.get('theme'), false);
}
updateThemeControl();
updateMotionControl();
updateEmbeddedClientControls(false);
renderProfile();
renderAxisKeymapButtons();
els.languageSelect.value = i18n.language;
window.lucide?.createIcons();
initHeroSpine();
loadIndex();
void loadCommissions();
void loadAppRelease();
