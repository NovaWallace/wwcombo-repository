const CHARACTER_ICON_API = 'https://wuwa-hpyg-tool.200503.xyz/api/v1/batch-icons/character';
const CHARACTER_ICON_MANIFEST = './assets/character-icons.json';
const UNKNOWN_CHARACTER_ICON = './assets/unknown-character.jpg';
const CHARACTER_ICON_CACHE_KEY = 'wwcombo-character-icons-v2';
const APP_RELEASE_MANIFEST_PATH = '/api/project-assets/v1/app-release.json';
const PROJECT_ASSET_MANIFEST_PATH = '/api/project-assets/v1/manifest.json';
const APP_RELEASE_FALLBACK_ORIGIN = 'https://Nova.fb520.site';
const PROFILE_STORAGE_KEY = 'wwcombo-community-profile-v1';
const ACCOUNT_TOKEN_STORAGE_KEY = 'wwcombo-community-account-token-v1';
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
  tide: './assets/button-icons/tide',
  chinese: './assets/botton'
};
const TIDE_ICON_FILES = {
  'mouse-left': 'basic_attack',
  'mouse-left-hold': 'heavy_attack',
  skill: 'skill',
  'skill-hold': 'skill_hold',
  echo: 'echo',
  'echo-hold': 'echo_hold',
  liberation: 'liberation',
  'liberation-hold': 'liberation_hold',
  'mouse-right': 'dodge',
  'mouse-right-hold': 'dodge_hold',
  jump: 'jump',
  'jump-hold': 'jump_hold',
  tool: 'tool',
  intro: 'intro',
  outro: 'outro',
  finisher: 'finisher',
  forward: 'forward'
};
const GAMEPAD_ICON_CODES = {
  'mouse-left': 'GamepadX',
  'mouse-left-hold': 'GamepadXHold',
  skill: 'GamepadY',
  'skill-hold': 'GamepadYHold',
  echo: 'GamepadLT',
  'echo-hold': 'GamepadLTHold',
  liberation: 'GamepadRT',
  'liberation-hold': 'GamepadRTHold',
  'mouse-right': 'GamepadRB',
  'mouse-right-hold': 'GamepadRBHold',
  jump: 'GamepadA',
  'jump-hold': 'GamepadAHold',
  tool: 'GamepadLB+GamepadX',
  i: 'GamepadDPadUp',
  ii: 'GamepadDPadRight',
  iii: 'GamepadDPadDown'
};
const MAX_SELECTED_CHARACTERS = 3;
const DIFFICULTY_ORDER = ['错轮', '冒烟', '进阶', '标准', '基础', '轮椅'];
const TAG_GRADES = { '轮椅': 'C', '基础': 'B', '标准': 'A', '进阶': 'S', '冒烟': 'SS', '错轮': 'S' };
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
  ['finisher', '处决', '处决.png', ['f', 'F', '处决', '终结技']],
  ['forward', '前走', '前走.png', ['w', '前走']],
  ['iii', '3', 'iii.png', ['iii']],
  ['ii', '2', 'ii.png', ['ii']],
  ['i', '1', 'i.png', ['i']]
].map(([id, label, filename, triggers]) => {
  const tideFile = TIDE_ICON_FILES[id];
  const tideSrc = tideFile ? `${BUTTON_ICON_BASES.tide}/${tideFile}.png` : '';
  const gamepadCode = GAMEPAD_ICON_CODES[id];
  return {
    id,
    label,
    triggers,
    gamepadCode,
    tideSrc,
    englishSrc: `${BUTTON_ICON_BASES.english}/${id}.png`,
    xboxSrc: gamepadCode ? gamepadIconSource(gamepadCode, 'xbox') : tideSrc || `${BUTTON_ICON_BASES.chinese}/${encodeURIComponent(filename)}`,
    playstationSrc: gamepadCode ? gamepadIconSource(gamepadCode, 'playstation') : tideSrc || `${BUTTON_ICON_BASES.chinese}/${encodeURIComponent(filename)}`
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

function keyboardMouseIconWidthScale(code) {
  if (window.WWComboInputIcons?.keyboardMouseIconWidthScale) {
    return window.WWComboInputIcons.keyboardMouseIconWidthScale(code);
  }
  return String(code || '').includes('+') ? 49 / AXIS_ICON_SIZE : 1;
}

function normalizeAxisKeySettings(value) {
  if (!value || typeof value !== 'object' || value.kind !== 'wwcombo-input-settings' || ![1, 2, 3].includes(value.schemaVersion)) throw new Error('invalid-key-settings');
  if (!Array.isArray(value.keyboardMouseBindings) || !Array.isArray(value.gamepadBindings)) throw new Error('invalid-key-settings');
  const normalizeBindings = (items) => items.flatMap((item) => {
    if (!item || typeof item.moveId !== 'string' || !Array.isArray(item.inputs)) return [];
    const inputs = item.inputs.flatMap((input) => input && typeof input.code === 'string' && input.code.trim() ? [{ code: input.code.trim(), label: String(input.label || input.code).trim() }] : []);
    return inputs.length ? [{ moveId: item.moveId.trim(), inputs }] : [];
  });
  const customIconSources = value.customIconSources && typeof value.customIconSources === 'object' && !Array.isArray(value.customIconSources)
    ? Object.fromEntries(Object.entries(value.customIconSources)
      .filter(([key, source]) => key.length <= 96 && typeof source === 'string' && source.length <= 180000 && /^data:image\/(?:png|jpe?g|webp|gif);base64,/iu.test(source))
      .slice(0, 64))
    : {};
  return {
    kind: 'wwcombo-input-settings', schemaVersion: value.schemaVersion,
    keyboardMouseBindings: normalizeBindings(value.keyboardMouseBindings),
    gamepadBindings: normalizeBindings(value.gamepadBindings),
    customIconSources,
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

function savedAccountToken() {
  try {
    const token = String(localStorage.getItem(ACCOUNT_TOKEN_STORAGE_KEY) || '').trim();
    return token.length <= 2048 ? token : '';
  } catch {
    return '';
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
  characterBasePresets: new Map(),
  tag: '',
  sort: 'version',
  detailChart: null,
  detailPackage: null,
  detailOptions: null,
  uploadChart: null,
  uploadPackage: null,
  uploadSource: null,
  uploadPreflight: null,
  uploadMode: 'community',
  uploadCommissionId: '',
  clientLibrary: [],
  clientLibraryLoadingId: '',
  pendingUploadIntent: null,
  commissionLoadState: 'idle',
  commissionUpdatedAt: 0,
  commissionCreateCharacters: [],
  commissionCreateTag: '基础',
  commissionDetail: null,
  commissionResponse: null,
  commissionResponsePackage: null,
  commentsChart: null,
  commentsKind: 'combo',
  commentReplyTarget: null,
  // Comments are fetched from the community server when a thread is opened.
  commentsByChart: {},
  appDialogResolve: null,
  appDialogPreviousFocus: null,
  axisIconSet: 'english',
  axisScale: 1,
  axisMergeSameMove: false,
  axisKeySettings: savedKeys.settings,
  axisKeySettingsFile: savedKeys.fileName,
  chartPackages: new Map(),
  appRelease: null,
  appReleaseState: 'idle',
  accountToken: savedAccountToken(),
  accountSession: { authenticated: false, email: '', roles: [] },
  accountLoadState: 'idle'
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
  clientDownloadBackdrop: document.getElementById('clientDownloadBackdrop'),
  closeClientDownload: document.getElementById('closeClientDownloadBtn'),
  clientDownloadList: document.getElementById('clientDownloadList'),
  clientDownloadVersion: document.getElementById('clientDownloadVersion'),
  profileButton: document.getElementById('profileButton'),
  profileAvatar: document.getElementById('profileAvatar'),
  profileName: document.getElementById('profileName'),
  profileEmail: document.getElementById('profileEmail'),
  profileBackdrop: document.getElementById('profileBackdrop'),
  profileForm: document.getElementById('profileForm'),
  profileUsernameInput: document.getElementById('profileUsernameInput'),
  profileEmailInput: document.getElementById('profileEmailInput'),
  accountSession: document.querySelector('.profile-account-session'),
  accountStatus: document.getElementById('accountStatus'),
  accountStatusDetail: document.getElementById('accountStatusDetail'),
  accountLoginControls: document.getElementById('accountLoginControls'),
  accountCodeInput: document.getElementById('accountCodeInput'),
  sendAccountCode: document.getElementById('sendAccountCodeBtn'),
  verifyAccount: document.getElementById('verifyAccountBtn'),
  accountLogout: document.getElementById('accountLogoutBtn'),
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
  clientComboPicker: document.getElementById('clientComboPicker'),
  clientComboList: document.getElementById('clientComboList'),
  refreshClientCombos: document.getElementById('refreshClientCombosBtn'),
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
  commissionComments: document.getElementById('commissionCommentsBtn'),
  commissionDetailCommentCount: document.getElementById('commissionDetailCommentCount'),
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
  detailComments: document.getElementById('detailComments'),
  detailCommentCount: document.getElementById('detailCommentCount'),
  commentsBackdrop: document.getElementById('commentsBackdrop'),
  commentsComboTitle: document.getElementById('commentsComboTitle'),
  commentsCount: document.getElementById('commentsCount'),
  commentsList: document.getElementById('commentsList'),
  commentsEmpty: document.getElementById('commentsEmpty'),
  commentForm: document.getElementById('commentForm'),
  commentInput: document.getElementById('commentInput'),
  commentInputCount: document.getElementById('commentInputCount'),
  commentFormStatus: document.getElementById('commentFormStatus'),
  commentReplyContext: document.getElementById('commentReplyContext'),
  commentReplyLabel: document.getElementById('commentReplyLabel'),
  cancelCommentReply: document.getElementById('cancelCommentReplyBtn'),
  closeComments: document.getElementById('closeCommentsBtn'),
  cancelComments: document.getElementById('cancelCommentsBtn'),
  submitComment: document.getElementById('submitCommentBtn'),
  submitCommentLabel: document.getElementById('submitCommentLabel'),
  axisIconSetButtons: [...document.querySelectorAll('[data-icon-set]')],
  axisZoom: document.getElementById('axisZoom'),
  axisZoomValue: document.getElementById('axisZoomValue'),
  axisZoomControls: [...document.querySelectorAll('[data-axis-zoom]')],
  axisZoomValues: [...document.querySelectorAll('[data-axis-zoom-value]')],
  axisMergeSameMoveControls: [...document.querySelectorAll('[data-axis-merge-same-move]')],
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
const requestedCommissionSource = params.get('commissionSource') || '';

function trustedEmbeddedParentOrigin() {
  if (!isEmbeddedClient) return '';
  try {
    const origin = new URL(params.get('parentOrigin') || '').origin;
    const parsed = new URL(origin);
    const localWebOrigin = ['http:', 'https:'].includes(parsed.protocol) && ['127.0.0.1', 'localhost', 'tauri.localhost'].includes(parsed.hostname);
    return localWebOrigin || (parsed.protocol === 'tauri:' && parsed.hostname === 'localhost') ? origin : '';
  } catch {
    return '';
  }
}

const embeddedParentOrigin = trustedEmbeddedParentOrigin();

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
const commissionSourceUrl = requestedCommissionSource
  ? new URL(requestedCommissionSource, location.href).href
  : '/api/community/commissions';
state.view = params.get('view') === 'commissions' ? 'commissions' : 'combos';

function appReleaseManifestUrl() {
  if (location.protocol === 'file:') return `${APP_RELEASE_FALLBACK_ORIGIN}${APP_RELEASE_MANIFEST_PATH}`;
  if (location.hostname === 'Nova.fb520.site' || location.hostname === 'localhost' || location.hostname === '127.0.0.1') return APP_RELEASE_MANIFEST_PATH;
  return `${APP_RELEASE_FALLBACK_ORIGIN}${APP_RELEASE_MANIFEST_PATH}`;
}

const CLIENT_DOWNLOAD_CHANNELS = [
  { key: 'quark', label: '夸克网盘', icon: 'cloud-download' },
  { key: 'baidu', label: '百度网盘', icon: 'cloud' },
  { key: 'cloud123', label: '123 云盘', icon: 'archive' },
  { key: 'github', label: 'GitHub', icon: 'github' }
];

function appReleaseDownloadLinks(release) {
  const links = release?.downloadLinks && typeof release.downloadLinks === 'object' ? release.downloadLinks : {};
  const valid = (value) => typeof value === 'string' && /^https?:\/\//i.test(value) ? value : '';
  return {
    quark: valid(links.quark || links.china),
    baidu: valid(links.baidu),
    cloud123: valid(links.cloud123 || links.lanzou),
    github: valid(links.github || links.global)
  };
}

function appReleaseDownloadUrl(release, language = i18n.language) {
  const links = appReleaseDownloadLinks(release);
  return language === 'zh-CN'
    ? links.quark || links.baidu || links.cloud123 || links.github
    : links.github || links.quark || links.baidu || links.cloud123;
}

function refreshClientDownloadControl() {
  if (!els.clientDownloadButton) return;
  if (isEmbeddedClient) {
    els.clientDownloadButton.style.display = 'none';
    return;
  }
  const hasLink = Object.values(appReleaseDownloadLinks(state.appRelease)).some(Boolean);
  els.clientDownloadButton.disabled = state.appReleaseState === 'loading';
  els.clientDownloadButton.setAttribute('aria-busy', state.appReleaseState === 'loading' ? 'true' : 'false');
  els.clientDownloadButton.title = hasLink ? '下载客户端' : '下载线路尚未配置';
  els.clientDownloadButton.setAttribute('aria-label', els.clientDownloadButton.title);
}

function renderClientDownloadOptions() {
  if (!els.clientDownloadList) return;
  const links = appReleaseDownloadLinks(state.appRelease);
  els.clientDownloadVersion.textContent = state.appRelease?.version ? '当前版本：' + state.appRelease.version : '当前版本信息暂不可用';
  els.clientDownloadList.replaceChildren(...CLIENT_DOWNLOAD_CHANNELS.map((channel) => {
    const url = links[channel.key];
    const item = document.createElement(url ? 'a' : 'div');
    item.className = 'client-download-option' + (url ? '' : ' unavailable');
    if (url) {
      item.href = url;
      item.target = '_blank';
      item.rel = 'noopener noreferrer';
    }
    const icon = document.createElement('span');
    icon.className = 'client-download-option-icon';
    icon.innerHTML = '<i data-lucide="' + channel.icon + '" aria-hidden="true"></i>';
    const copy = document.createElement('span');
    copy.className = 'client-download-option-copy';
    const title = document.createElement('strong');
    title.textContent = channel.label;
    const status = document.createElement('small');
    status.textContent = url ? '点击打开下载地址' : '维护端尚未配置';
    copy.append(title, status);
    const arrow = document.createElement('i');
    arrow.className = 'client-download-option-arrow';
    arrow.dataset.lucide = url ? 'external-link' : 'minus';
    arrow.setAttribute('aria-hidden', 'true');
    item.append(icon, copy, arrow);
    return item;
  }));
  window.lucide?.createIcons();
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
  const count = appendAvatarSet(target, name, 'profile-avatar-image');
  if (count) {
    target.classList.add('profile-avatar');
    return;
  }
  target.classList.remove('avatar-stack');
  target.textContent = fallbackText;
}

function accountSessionHeaders() {
  return state.accountToken ? { authorization: `Bearer ${state.accountToken}`, 'x-wwcombo-account-client': '1' } : { 'x-wwcombo-account-client': '1' };
}

function postAccountSessionToParent() {
  if (!isEmbeddedClient || window.parent === window || !embeddedParentOrigin) return;
  window.parent.postMessage({
    type: 'wwcombo:community-account-session',
    version: 1,
    token: state.accountSession.authenticated ? state.accountToken : '',
    session: {
      authenticated: Boolean(state.accountSession.authenticated),
      email: String(state.accountSession.email || ''),
      roles: Array.isArray(state.accountSession.roles) ? state.accountSession.roles.filter((role) => typeof role === 'string').slice(0, 20) : [],
      expiresAt: Number(state.accountSession.expiresAt || 0) || 0
    }
  }, embeddedParentOrigin);
}

function renderAccountSession() {
  if (!els.accountSession || !els.accountStatus || !els.accountStatusDetail) return;
  const authenticated = Boolean(state.accountSession.authenticated && state.accountSession.email);
  els.accountSession.classList.toggle('authenticated', authenticated);
  els.accountSession.classList.toggle('error', state.accountLoadState === 'error');
  if (state.accountLoadState === 'loading' && !authenticated) {
    els.accountStatus.textContent = t('account.loading');
    els.accountStatusDetail.textContent = t('account.loadingHint');
  } else if (authenticated) {
    els.accountStatus.textContent = t('account.signedIn');
    els.accountStatusDetail.textContent = state.accountSession.roles.includes('wiki-admin')
      ? t('account.admin')
      : `${t('account.verified')} · ${maskProfileEmail(state.accountSession.email)}`;
  } else if (state.accountLoadState === 'error') {
    els.accountStatus.textContent = t('account.unavailable');
    els.accountStatusDetail.textContent = t('account.unavailableHint');
  } else {
    els.accountStatus.textContent = t('account.signedOut');
    els.accountStatusDetail.textContent = t('account.hint');
  }
  if (els.accountLoginControls) els.accountLoginControls.hidden = authenticated;
  if (els.accountLogout) els.accountLogout.hidden = !authenticated;
  if (els.accountCodeInput) els.accountCodeInput.disabled = authenticated;
  if (els.sendAccountCode) els.sendAccountCode.disabled = authenticated;
  if (els.verifyAccount) els.verifyAccount.disabled = authenticated;
}

function setAccountSession(session, token = '') {
  const authenticated = Boolean(session?.authenticated && typeof session.email === 'string' && session.email.trim());
  state.accountSession = {
    authenticated,
    email: authenticated ? session.email.trim().toLowerCase() : '',
    roles: authenticated && Array.isArray(session.roles) ? session.roles.filter((role) => typeof role === 'string').slice(0, 20) : [],
    expiresAt: authenticated ? Number(session.expiresAt || 0) || 0 : 0
  };
  if (authenticated && token) {
    state.accountToken = String(token).trim().slice(0, 2048);
    try { localStorage.setItem(ACCOUNT_TOKEN_STORAGE_KEY, state.accountToken); } catch {}
  } else if (!authenticated) {
    state.accountToken = '';
    try { localStorage.removeItem(ACCOUNT_TOKEN_STORAGE_KEY); } catch {}
  }
  state.accountLoadState = 'ready';
  renderAccountSession();
  postAccountSessionToParent();
}

async function loadAccountSession() {
  state.accountLoadState = 'loading';
  renderAccountSession();
  try {
    const response = await fetch('/api/community/account/session', { cache: 'no-store', credentials: 'include', headers: accountSessionHeaders() });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.error || `HTTP ${response.status}`);
    setAccountSession(body.session || {}, body.token || '');
  } catch (error) {
    state.accountLoadState = 'error';
    state.accountSession = { authenticated: false, email: '', roles: [] };
    renderAccountSession();
    postAccountSessionToParent();
    if (isEmbeddedClient) console.warn('Community account session unavailable', error);
  }
}

async function sendAccountCode() {
  const email = String(els.profileEmailInput?.value || '').trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+$/.test(email)) {
    if (els.accountStatusDetail) els.accountStatusDetail.textContent = t('account.emailRequired');
    return;
  }
  if (!els.sendAccountCode) return;
  els.sendAccountCode.disabled = true;
  els.sendAccountCode.textContent = t('account.sending');
  try {
    const response = await fetch('/api/community/account/code', { method: 'POST', headers: { 'content-type': 'application/json' }, credentials: 'include', body: JSON.stringify({ email }) });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.error || `HTTP ${response.status}`);
    if (els.accountStatusDetail) els.accountStatusDetail.textContent = t('account.codeSent');
    els.accountCodeInput?.focus();
  } catch (error) {
    if (els.accountStatusDetail) els.accountStatusDetail.textContent = `${t('account.codeFailed')} ${error.message || error}`;
  } finally {
    els.sendAccountCode.disabled = false;
    els.sendAccountCode.textContent = t('account.sendCode');
  }
}

async function verifyAccount() {
  const email = String(els.profileEmailInput?.value || '').trim().toLowerCase();
  const code = String(els.accountCodeInput?.value || '').trim();
  if (!email || !/^\d{6}$/.test(code)) {
    if (els.accountStatusDetail) els.accountStatusDetail.textContent = t('account.codeRequired');
    return;
  }
  if (!els.verifyAccount) return;
  els.verifyAccount.disabled = true;
  els.verifyAccount.textContent = t('account.verifying');
  try {
    const response = await fetch('/api/community/account/verify', { method: 'POST', headers: { 'content-type': 'application/json' }, credentials: 'include', body: JSON.stringify({ email, code }) });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.error || `HTTP ${response.status}`);
    state.profile = { ...state.profile, email };
    try { localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(state.profile)); } catch {}
    setAccountSession(body.session || {}, body.token || '');
    renderProfile();
    if (els.accountCodeInput) els.accountCodeInput.value = '';
  } catch (error) {
    if (els.accountStatusDetail) els.accountStatusDetail.textContent = `${t('account.verifyFailed')} ${error.message || error}`;
  } finally {
    if (!state.accountSession.authenticated && els.verifyAccount) {
      els.verifyAccount.disabled = false;
      els.verifyAccount.textContent = t('account.login');
    }
  }
}

async function logoutAccount() {
  try { await fetch('/api/community/account/logout', { method: 'POST', credentials: 'include' }); } catch {}
  setAccountSession({ authenticated: false });
}

function projectAssetManifestUrl() {
  if (location.hostname.toLowerCase() === 'nova.fb520.site') return PROJECT_ASSET_MANIFEST_PATH;
  if (['localhost', '127.0.0.1'].includes(location.hostname.toLowerCase())) return `${location.origin}${PROJECT_ASSET_MANIFEST_PATH}`;
  return `${APP_RELEASE_FALLBACK_ORIGIN}${PROJECT_ASSET_MANIFEST_PATH}`;
}

function replaceEmbeddedImportedCombos(comboIds) {
  if (!isEmbeddedClient) return;
  embeddedImportedCombos.clear();
  comboIds.forEach((comboId) => {
    const normalized = String(comboId || '').trim();
    if (normalized) embeddedImportedCombos.add(normalized);
  });
  try {
    localStorage.setItem(EMBEDDED_IMPORTED_COMBOS_STORAGE_KEY, JSON.stringify([...embeddedImportedCombos].slice(-500)));
  } catch {}
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
  renderAccountSession();
  els.profileFeedback.textContent = '';
  els.profileFeedback.className = 'form-feedback';
  els.profileBackdrop.hidden = false;
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => els.profileUsernameInput.focus());
}

function closeProfile() {
  state.pendingUploadIntent = null;
  state.profileDraftAvatar = state.profile.avatar;
  els.profileBackdrop.hidden = true;
  syncModalBody();
}

function openUpload(commissionId = '', initialPackage = null) {
  if (!state.profile.username || !state.profile.email) {
    state.pendingUploadIntent = { commissionId, initialPackage };
    openProfile();
    els.profileFeedback.textContent = t('profile.required');
    return;
  }
  state.uploadChart = null;
  state.uploadPackage = null;
  state.uploadSource = null;
  state.uploadPreflight = null;
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
  renderClientComboPicker();
  requestClientLibrary();
  els.uploadFeedback.textContent = '';
  els.uploadFeedback.className = 'form-feedback';
  els.confirmUpload.disabled = true;
  els.uploadBackdrop.hidden = false;
  document.body.style.overflow = 'hidden';
  if (initialPackage) applyUploadPackage(initialPackage, 'client');
 }

function closeUpload() {
  uploadPreviewToken += 1;
  state.uploadChart = null;
  state.uploadPackage = null;
  state.uploadSource = null;
  state.uploadPreflight = null;
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
  const characters = splitCharacterNames(Array.isArray(community.characters) ? community.characters : chart?.character).slice(0, 3);
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

function uploadPreflightMessage(preflight) {
  const issues = Array.isArray(preflight?.issues) ? preflight.issues.filter(Boolean) : [];
  const messages = {
    'zh-CN': issues.length ? `预审核提醒：${issues.join('；')}。仍可提交，投稿会进入人工审核。` : '预审核通过，可以提交。',
    'en-US': issues.length ? `Preflight warning: ${issues.join('; ')}. You can still submit; it will enter manual review.` : 'Preflight passed. You can submit.',
    'ja-JP': issues.length ? `事前チェック警告：${issues.join('；')}。そのまま投稿できますが、手動審査に送られます。` : '事前チェックに合格しました。投稿できます。',
    'ko-KR': issues.length ? `사전 검사 알림: ${issues.join('; ')}. 계속 제출할 수 있으며 수동 검토로 전송됩니다.` : '사전 검사를 통과했습니다. 제출할 수 있습니다.'
  };
  return messages[i18n.language] || messages['zh-CN'];
}

async function runUploadPreflight(content, previewToken) {
  els.confirmUpload.disabled = true;
  els.uploadFeedback.textContent = i18n.language === 'en-US'
    ? 'Running preflight check...'
    : '正在执行上传预审核...';
  els.uploadFeedback.className = 'form-feedback';
  try {
    const response = await fetch('/api/community/preflight', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(content)
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok || !body.preflight) throw new Error(body.error || `HTTP ${response.status}`);
    if (previewToken !== uploadPreviewToken || state.uploadPackage !== content) return;
    state.uploadPreflight = body.preflight;
    const passed = body.preflight.lowRisk === true;
    els.uploadFeedback.textContent = uploadPreflightMessage(body.preflight);
    els.uploadFeedback.className = `form-feedback${passed ? ' success' : ''}`;
    els.confirmUpload.disabled = false;
  } catch (error) {
    if (previewToken !== uploadPreviewToken || state.uploadPackage !== content) return;
    state.uploadPreflight = null;
    const unavailableMessages = {
      'zh-CN': `预审核暂时不可用，仍可提交：${error.message}`,
      'en-US': `Preflight is temporarily unavailable. You can still submit: ${error.message}`,
      'ja-JP': `事前チェックは一時的に利用できませんが、そのまま投稿できます：${error.message}`,
      'ko-KR': `사전 검사를 일시적으로 사용할 수 없지만 계속 제출할 수 있습니다: ${error.message}`
    };
    els.uploadFeedback.textContent = unavailableMessages[i18n.language] || unavailableMessages['zh-CN'];
    els.uploadFeedback.className = 'form-feedback';
    els.confirmUpload.disabled = false;
  }
}

function normalizedClientUploadPackage(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const filename = typeof value.filename === 'string' ? value.filename.trim().slice(0, 180) : '';
  const chartId = typeof value.chartId === 'string' ? value.chartId.trim().slice(0, 160) : '';
  if (!filename || !value.payload || typeof value.payload !== 'object') return null;
  return { chartId, filename, payload: value.payload };
}

function applyUploadPackage(value, source = 'client') {
  const packageValue = normalizedClientUploadPackage(value);
  if (!packageValue) return false;
  uploadPreviewToken += 1;
  state.uploadSource = { ...packageValue, source };
  state.uploadPackage = packageValue.payload;
  state.uploadChart = uploadedIndexChart(packageValue.payload, packageValue.filename);
  els.comboFile.value = '';
  els.comboFileName.textContent = packageValue.filename;
  els.uploadFeedback.textContent = '';
  els.uploadFeedback.className = 'form-feedback';
  state.uploadPreflight = null;
  renderUploadAxisPreview();
  renderClientComboPicker();
  void runUploadPreflight(packageValue.payload, uploadPreviewToken);
  return true;
}

function requestClientLibrary() {
  if (!isEmbeddedClient) return;
  window.parent.postMessage({ type: 'wwcombo:community-library-request', version: 1 }, '*');
}

const pendingClientLibraryRequests = new Map();

function requestClientLibraryItem(chartId) {
  if (!isEmbeddedClient || !chartId || state.clientLibraryLoadingId) return;
  const requestId = `library-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  state.clientLibraryLoadingId = chartId;
  pendingClientLibraryRequests.set(requestId, chartId);
  renderClientComboPicker();
  window.parent.postMessage({ type: 'wwcombo:community-library-item-request', version: 1, requestId, chartId }, '*');
}

function renderClientComboPicker() {
  if (!els.clientComboPicker || !els.clientComboList) return;
  els.clientComboPicker.hidden = !isEmbeddedClient;
  if (!isEmbeddedClient) return;
  const selectedChartId = state.uploadSource?.source === 'client' ? state.uploadSource.chartId : '';
  const nodes = state.clientLibrary.map((item) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `client-combo-card${selectedChartId === item.id ? ' selected' : ''}`;
    button.dataset.chartId = item.id;
    button.disabled = Boolean(state.clientLibraryLoadingId);
    const title = document.createElement('strong');
    title.textContent = item.title || t('card.untitled');
    const characters = document.createElement('span');
    characters.textContent = item.characters.length ? item.characters.join(' / ') : t('card.charactersMissing');
    const meta = document.createElement('small');
    meta.textContent = state.clientLibraryLoadingId === item.id
      ? t('upload.localComboLoading')
      : `${t('unit.actions', { count: item.stepCount })} · ${formatDate(item.updatedAt)}`;
    button.append(title, characters, meta);
    return button;
  });
  if (!nodes.length) {
    const empty = document.createElement('div');
    empty.className = 'client-combo-empty';
    empty.textContent = t('upload.localCombosEmpty');
    nodes.push(empty);
  }
  els.clientComboList.replaceChildren(...nodes);
}

async function previewUploadFile() {
  const file = els.comboFile.files?.[0];
  const previewToken = ++uploadPreviewToken;
  els.comboFileName.textContent = file?.name || t('upload.none');
  els.uploadFeedback.textContent = '';
  els.uploadFeedback.className = 'form-feedback';
  state.uploadChart = null;
  state.uploadPackage = null;
  state.uploadSource = null;
  state.uploadPreflight = null;
  els.confirmUpload.disabled = true;
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
    applyUploadPackage({ chartId: '', filename: file.name, payload: content }, 'file');
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
  const source = state.uploadSource;
  if (!source) return;
  const serialized = JSON.stringify(source.payload);
  if (new TextEncoder().encode(serialized).byteLength > 1024 * 1024) {
    els.uploadFeedback.textContent = t('upload.tooLarge');
    return;
  }
  els.confirmUpload.disabled = true;
  els.uploadFeedback.textContent = t('upload.sending');
  try {
    const commissionId = state.uploadMode === 'commission' ? state.uploadCommissionId : '';
    const response = await fetch(commissionId ? `/api/community/commissions/${encodeURIComponent(commissionId)}/responses` : '/api/community/submit', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ username: state.profile.username, email: state.profile.email, avatar: state.profile.avatar, fileName: source.filename, content: source.payload })
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
    state.uploadSource = null;
    state.uploadPreflight = null;
    resetUploadAxisPreview();
    renderClientComboPicker();
    if (commissionId && body.commission) {
      replaceCommission(body.commission);
      state.commissionDetail = body.commission;
      renderCommissionDetail();
      render();
    } else if (autoPublished) void loadIndex();
  } catch (error) {
    els.uploadFeedback.textContent = error instanceof SyntaxError ? t('upload.invalidJson') : error.message;
  } finally {
    els.confirmUpload.disabled = !state.uploadSource;
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

function canonicalCharacterName(value) {
  const name = String(value || '').trim();
  return name === '青霄' || name === '清宵' ? '清霄' : name;
}

function splitCharacterNames(value) {
  const values = Array.isArray(value) ? value : [value];
  return [...new Set(values.flatMap((item) => String(item || '')
    .split(/[\/／、,，;；]/)
    .map(canonicalCharacterName)
    .filter(Boolean)))];
}

function canonicalizeComboPackageCharacters(value) {
  if (!value || typeof value !== 'object') return value;
  const packageValue = Array.isArray(value) ? [...value] : { ...value };
  const charts = Array.isArray(packageValue)
    ? packageValue
    : Array.isArray(packageValue.charts)
      ? packageValue.charts
      : packageValue.chart && typeof packageValue.chart === 'object'
        ? [packageValue.chart]
        : [packageValue];
  const normalizedCharts = charts.map((source) => {
    if (!source || typeof source !== 'object') return source;
    const chart = { ...source };
    if (typeof chart.character === 'string') chart.character = splitCharacterNames(chart.character).join(' / ');
    if (chart.community && typeof chart.community === 'object') {
      chart.community = { ...chart.community, characters: splitCharacterNames(chart.community.characters) };
    }
    return chart;
  });
  if (Array.isArray(packageValue)) return normalizedCharts;
  if (Array.isArray(packageValue.charts)) packageValue.charts = normalizedCharts;
  else if (packageValue.chart && typeof packageValue.chart === 'object') packageValue.chart = normalizedCharts[0];
  else return normalizedCharts[0];
  return packageValue;
}

function uniqueSorted(values) {
  return [...new Set(values.filter(Boolean))].sort(collator.compare);
}

function normalizedTags(values) {
  return [...new Set((Array.isArray(values) ? values : []).filter(Boolean).map((tag) => tag === '全局' ? '错轮' : tag))];
}

function chartCharacters(chart) {
  if (Array.isArray(chart.characters) && chart.characters.length) return splitCharacterNames(chart.characters);
  return splitCharacterNames(chart.character);
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

function safeHttpUrl(value) {
  try {
    const url = new URL(String(value || '').trim());
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
  } catch {
    return '';
  }
}

function normalizedComment(value, fallbackId = '') {
  if (!value || typeof value !== 'object') return null;
  const body = String(value.body || value.text || '').trim().slice(0, 1000);
  if (!body) return null;
  const id = String(value.id || fallbackId).trim().slice(0, 120);
  if (!id) return null;
  return {
    id,
    parentId: String(value.parentId || '').trim().slice(0, 120),
    username: String(value.username || '').trim().slice(0, 40) || t('comments.guest'),
    avatar: String(value.avatar || '').trim().slice(0, 80),
    body,
    createdAt: Number(value.createdAt || Date.now()) || Date.now()
  };
}

function videoLinkPlatform(value) {
  const source = safeHttpUrl(value);
  if (!source) return '';
  const hostname = new URL(source).hostname.toLowerCase().replace(/^www\./, '');
  if (hostname === 'bilibili.com' || hostname.endsWith('.bilibili.com') || hostname === 'b23.tv') return 'bilibili';
  return 'video';
}

function filenameFor(chart) {
  const title = String(chart.title || 'wwcombo').replace(/[\\/:*?"<>|]+/g, '_').trim();
  return `${title}-${chart.id || 'community'}.wwcombo.json`;
}

function submitterFor(chart) {
  const nickname = String(chart.submitter?.nickname || '').trim();
  const email = String(chart.submitter?.email || '').trim();
  return {
    nickname: nickname || t('submitter.historical'),
    email: email || t('submitter.noEmail'),
    badge: String(chart.submitter?.badge || '').toUpperCase() === 'UP' ? 'UP' : '',
    avatars: splitCharacterNames(chart.submitter?.avatar)
  };
}

function characterIconMap(payload) {
  const entries = Array.isArray(payload)
    ? payload
    : payload && typeof payload === 'object'
      ? Object.entries(payload)
      : [];
  const icons = new Map();
  for (const item of entries) {
    if (!Array.isArray(item) || typeof item[0] !== 'string' || typeof item[1] !== 'string') continue;
    const name = canonicalCharacterName(item[0]);
    const source = item[1].trim();
    if (!name || !source || icons.has(name)) continue;
    try {
      const sourceUrl = new URL(source, location.href);
      if (['http:', 'https:'].includes(sourceUrl.protocol)) icons.set(name, sourceUrl.href);
    } catch {}
  }
  return icons;
}

function readCharacterIconCache() {
  try {
    const value = JSON.parse(localStorage.getItem(CHARACTER_ICON_CACHE_KEY) || '{}');
    return characterIconMap(value?.entries);
  } catch {
    return new Map();
  }
}

function writeCharacterIconCache(icons) {
  try {
    localStorage.setItem(CHARACTER_ICON_CACHE_KEY, JSON.stringify({
      version: 1,
      savedAt: Date.now(),
      entries: [...icons.entries()]
    }));
  } catch {}
}

function avatarLoadingMode(className) {
  return /(?:card-character-avatar|profile-avatar|submitter-avatar|character-avatar)/.test(className) ? 'eager' : 'lazy';
}

function unknownAvatarElement(className) {
  const fallback = document.createElement('img');
  fallback.className = `${className} unknown-avatar`;
  fallback.src = UNKNOWN_CHARACTER_ICON;
  fallback.alt = '';
  fallback.loading = 'eager';
  fallback.decoding = 'async';
  return fallback;
}

function avatarElement(name, className = 'mini-avatar') {
  const source = state.characterIcons.get(name);
  if (!source) return unknownAvatarElement(className);
  const image = document.createElement('img');
  image.className = className;
  image.src = source;
  image.alt = '';
  image.loading = avatarLoadingMode(className);
  image.decoding = 'async';
  image.fetchPriority = image.loading === 'eager' ? 'high' : 'low';
  let retried = false;
  image.addEventListener('error', () => {
    if (!retried && /^https?:/i.test(source)) {
      retried = true;
      window.setTimeout(() => {
        image.src = `${source}${source.includes('?') ? '&' : '?'}wwcombo-retry=1`;
      }, 240);
      return;
    }
    image.replaceWith(unknownAvatarElement(className));
  });
  return image;
}

function appendAvatarSet(target, names, className, limit = 3) {
  const validNames = splitCharacterNames(names).filter((name) => state.characterIcons.has(name)).slice(0, limit);
  target.replaceChildren();
  target.classList.toggle('avatar-stack', validNames.length > 1);
  for (const name of validNames) target.appendChild(avatarElement(name, className));
  return validNames.length;
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
    const payload = canonicalizeComboPackageCharacters(JSON.parse(source.replace(/^\uFEFF/, '')));
    if (isEmbeddedClient) {
      const requestId = crypto.randomUUID?.() || `community-${Date.now()}-${Math.random().toString(16).slice(2)}`;
      pendingClientImports.set(requestId, String(chart.id || ''));
      window.parent.postMessage({ type: 'wwcombo:community-import', version: 1, requestId, filename: filenameFor(chart), payload }, '*');
      chart.viewerDownloaded = true;
      chart.canVote = !chart.viewerVote;
      chart.canFeedback = !chart.feedbackSubmitted;
      renderVoteControls(chart);
      render();
      return;
    }
    const blobUrl = URL.createObjectURL(new Blob([`${JSON.stringify(payload, null, 2)}\n`], { type: response.headers.get('content-type') || 'application/json;charset=utf-8' }));
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
  if (result.type === 'wwcombo:community-account-session-request' && result.version === 1) {
    if (embeddedParentOrigin && event.origin === embeddedParentOrigin) postAccountSessionToParent();
    return;
  }
  if (result.type === 'wwcombo:community-input-settings' && result.version === 1) {
    try { applyAxisKeySettings(result.settings, 'WW Combo Trainer'); } catch {}
    return;
  }
  if (result.type === 'wwcombo:community-library' && result.version === 1 && Array.isArray(result.items)) {
    state.clientLibrary = result.items.slice(0, 200).flatMap((item) => {
      if (!item || typeof item !== 'object' || typeof item.id !== 'string' || !item.id.trim()) return [];
      return [{
        id: item.id.trim().slice(0, 160),
        title: typeof item.title === 'string' ? item.title.trim().slice(0, 120) : '',
        characters: splitCharacterNames(item.characters).map((name) => name.slice(0, 80)).slice(0, 3),
        stepCount: Math.max(0, Math.round(Number(item.stepCount) || 0)),
        updatedAt: Number(item.updatedAt) || 0
      }];
    });
    replaceEmbeddedImportedCombos(state.clientLibrary.map((item) => item.id));
    renderClientComboPicker();
    if (state.detailChart) updateEmbeddedClientControls(embeddedImportedCombos.has(String(state.detailChart.id || '')));
    return;
  }
  if (result.type === 'wwcombo:community-upload' && result.version === 1) {
    const packageValue = normalizedClientUploadPackage(result.package);
    if (packageValue) openUpload('', packageValue);
    return;
  }
  if (result.type === 'wwcombo:community-library-item-result' && result.version === 1 && typeof result.requestId === 'string') {
    const chartId = pendingClientLibraryRequests.get(result.requestId);
    if (chartId === undefined) return;
    pendingClientLibraryRequests.delete(result.requestId);
    state.clientLibraryLoadingId = '';
    if (result.ok && applyUploadPackage(result.package, 'client')) return;
    els.uploadFeedback.textContent = String(result.detail || t('upload.localComboFailed'));
    els.uploadFeedback.className = 'form-feedback';
    renderClientComboPicker();
    return;
  }
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
  if (!state.appRelease) await loadAppRelease();
  renderClientDownloadOptions();
  els.clientDownloadBackdrop.hidden = false;
  syncModalBody();
  requestAnimationFrame(() => els.closeClientDownload?.focus());
}

function closeClientDownload() {
  if (!els.clientDownloadBackdrop || els.clientDownloadBackdrop.hidden) return;
  els.clientDownloadBackdrop.hidden = true;
  syncModalBody();
}

function availableCharacters() {
  return uniqueSorted([
    ...state.characterIcons.keys(),
    ...state.charts.flatMap(chartCharacters),
    ...state.commissions.flatMap(commissionCharacters),
    ...state.commissions.flatMap((commission) => (commission.responses || []).flatMap((response) => splitCharacterNames(response.characters)))
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
  els.tagFilter.hidden = false;
  els.createCommission.hidden = true;
  els.resultsTitle.textContent = t(commissionView ? 'plaza.commissions' : 'results.title');
  els.title.placeholder = t(commissionView ? 'commission.searchPlaceholder' : 'search.titlePlaceholder');
  els.comboTab.classList.toggle('active', !commissionView);
  els.comboTab.setAttribute('aria-selected', String(!commissionView));
  els.commissionTab.classList.toggle('active', commissionView);
  els.commissionTab.setAttribute('aria-selected', String(commissionView));
  const tags = commissionView
    ? uniqueSorted(state.commissions.flatMap(commissionTags))
    : uniqueSorted(state.charts.flatMap((chart) => Array.isArray(chart.tags) ? chart.tags : []));
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
  updateSubmissionButton();
}

function updateSubmissionButton() {
  const commissionView = state.view === 'commissions';
  const label = t(commissionView ? 'commission.create' : 'submission.button');
  els.submissionButtonLabel.textContent = label;
  els.submissionButton.title = label;
  els.submissionButton.setAttribute('aria-label', label);
  const icon = els.submissionButton.querySelector('[data-lucide]');
  if (icon) icon.setAttribute('data-lucide', commissionView ? 'plus' : 'upload');
  window.lucide?.createIcons();
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

function chartMonthlyDownloadCount(chart) {
  const value = Number(chart?.monthlyDownloadCount ?? chart?.downloadCount ?? 0);
  return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
}

function currentWeekStart() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - ((date.getDay() + 6) % 7));
  return date.getTime();
}

function chartAddedThisWeek(chart) {
  const updatedAt = Number(chart?.updatedAt || 0);
  return Number.isFinite(updatedAt) && updatedAt >= currentWeekStart() && updatedAt <= Date.now();
}

function communityChartSections(charts) {
  const newCharts = charts.filter(chartAddedThisWeek);
  const oldCharts = charts.filter((chart) => !chartAddedThisWeek(chart));
  const popularCharts = [...oldCharts]
    .sort((left, right) => chartMonthlyDownloadCount(right) - chartMonthlyDownloadCount(left)
      || Number(right.updatedAt || 0) - Number(left.updatedAt || 0)
      || collator.compare(left.title || '', right.title || ''))
    .slice(0, 10);
  const popularIds = new Set(popularCharts.map((chart) => String(chart.id || '')));
  return [
    { group: 0, items: newCharts },
    { group: 1, items: popularCharts },
    { group: 2, items: oldCharts.filter((chart) => !popularIds.has(String(chart.id || ''))) }
  ].filter((section) => section.items.length > 0);
}

function renderCard(chart) {
  const card = els.template.content.firstElementChild.cloneNode(true);
  i18n.apply(card);
  const tags = Array.isArray(chart.tags) ? chart.tags.filter(Boolean) : [];
  const submitter = submitterFor(chart);
  card.style.setProperty('--accent', tagAccent(tags));
  card.querySelector('h3').textContent = chart.title || t('card.untitled');
  card.querySelector('.combo-card-meta').textContent = `${formatDate(chart.updatedAt)} · v${chart.uploadVersion || state.gameVersion} · ${Math.max(1, Number(chart.rounds || 1))}${t('meta.rounds')}`;
  card.querySelector('.submitter-name').textContent = submitter.nickname;
  const submitterEmail = card.querySelector('.submitter-email');
  const rawSubmitterEmail = String(submitter.email || '').trim();
  submitterEmail.textContent = rawSubmitterEmail.includes('@')
    ? (/^[^@]{2}\*+@/u.test(rawSubmitterEmail) ? rawSubmitterEmail : maskProfileEmail(rawSubmitterEmail))
    : rawSubmitterEmail;
  const submitterAvatar = card.querySelector('.submitter-avatar');
  submitterAvatar.replaceChildren();
  if (appendAvatarSet(submitterAvatar, submitter.avatars, 'submitter-avatar-img') < 1) {
    submitterAvatar.appendChild(unknownAvatarElement('submitter-avatar-img'));
  }
  submitterAvatar.hidden = false;
  const submitterBadge = card.querySelector('.submitter-badge');
  submitterBadge.hidden = !submitter.badge;
  submitterBadge.textContent = submitter.badge;

  const characters = chartCharacters(chart).slice(0, MAX_SELECTED_CHARACTERS);
  const decoration = card.querySelector('.combo-decoration');
  decoration.replaceChildren(...characters.map((name) => avatarElement(name, 'combo-decoration-avatar')));
  applyBaseDecoration(card.querySelector('.combo-base-decoration'), chart, characters);
  const longestCharacter = canonicalCharacterName(chart.longestCharacter || chart.firstCharacter || characters[0] || '');
  renderCommissionBaseDecorations(card.querySelector('.combo-base-layers'), longestCharacter ? [longestCharacter] : []);

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
  const downloadCount = Math.max(0, Math.floor(Number(chart.downloadCount || 0)) || 0);

  const videoLink = card.querySelector('.combo-video-link');
  const videoSource = safeHttpUrl(chart.link);
  const videoPlatform = videoLinkPlatform(videoSource);
  card.classList.toggle('has-video', Boolean(videoSource));
  videoLink.hidden = !videoSource;
  videoLink.classList.toggle('bilibili', videoPlatform === 'bilibili');
  videoLink.href = videoSource || '#';
  videoLink.title = t('detail.demo');
  videoLink.setAttribute('aria-label', t('detail.demo'));
  videoLink.innerHTML = videoPlatform === 'bilibili'
    ? '<img class="combo-video-logo" src="./assets/bilibili.png" alt="" aria-hidden="true">'
    : '<i data-lucide="video" aria-hidden="true"></i>';

  const videoAction = card.querySelector('.combo-video-action');
  videoAction.hidden = !videoSource;
  videoAction.href = videoSource || '#';
  videoAction.title = t('detail.demo');
  videoAction.setAttribute('aria-label', t('detail.demo'));
  videoAction.innerHTML = videoPlatform === 'bilibili'
    ? '<img class="combo-video-logo" src="./assets/bilibili.png" alt="" aria-hidden="true"><span>' + t('detail.demo') + '</span>'
    : '<i data-lucide="video" aria-hidden="true"></i><span>' + t('detail.demo') + '</span>';

  const detailButton = card.querySelector('.detail-button');
  const downloadBadge = card.querySelector('.detail-download-badge');
  downloadBadge.textContent = String(downloadCount);
  downloadBadge.setAttribute('aria-label', `${t('meta.downloads')}: ${downloadCount}`);
  const commentCount = Math.max(0, Math.floor(Number(chart.commentCount || 0)) || 0);
  const commentCountNode = document.createElement('strong');
  commentCountNode.className = 'combo-comment-count';
  commentCountNode.hidden = commentCount < 1;
  commentCountNode.textContent = commentCount > 0 ? String(commentCount) : '';
  commentCountNode.setAttribute('aria-label', `${t('comments.button')}: ${commentCount}`);
  detailButton.appendChild(commentCountNode);
  detailButton.setAttribute('aria-label', `${t('card.details')}: ${chart.title || t('card.untitled')}`);
  detailButton.addEventListener('click', () => openDetails(chart));
  card.addEventListener('click', (event) => {
    if (window.matchMedia('(max-width: 520px)').matches && !event.target.closest('button, a')) {
      card.classList.toggle('is-mobile-active');
    }
  });
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
  return splitCharacterNames(commission?.characters).slice(0, MAX_SELECTED_CHARACTERS);
}

function commissionTags(commission) {
  return normalizedTags(Array.isArray(commission?.tags) ? commission.tags : [commission?.tag]);
}

function commissionInterestSortCount(commission) {
  const count = Number(commission?.interestCount || 0);
  return Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0;
}

function commissionCreatedAt(commission) {
  const value = Number(commission?.createdAt || 0);
  return Number.isFinite(value) && value > 0 ? value : 0;
}

function commissionResponseCount(commission) {
  const value = Number(commission?.responseCount ?? commission?.responses?.length ?? 0);
  return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
}

function commissionTopInterestTiers(commissions) {
  return new Set([...new Set(commissions
    .filter((commission) => commission.status !== 'completed' && !commission.acceptedResponseId && commissionResponseCount(commission) === 0)
    .map(commissionInterestSortCount)
    .filter((count) => count > 0))]
    .sort((left, right) => right - left)
    .slice(0, 5));
}

function commissionSortGroup(commission, topInterestCounts) {
  if (commission.status === 'completed' || commission.acceptedResponseId) return 3;
  if (commissionResponseCount(commission) > 0) return 2;
  if (topInterestCounts.has(commissionInterestSortCount(commission))) return 0;
  return 1;
}

function filteredCommissions() {
  const titleQuery = normalizeText(state.title);
  const commissions = state.commissions.filter((commission) => {
    const titleMatches = !titleQuery || normalizeText(commission.title).includes(titleQuery);
    const characterMatches = state.characters.every((name) => commissionCharacters(commission).includes(name));
    const tagMatches = !state.tag || commissionTags(commission).includes(state.tag);
    return titleMatches && characterMatches && tagMatches;
  });
  const topInterestCounts = commissionTopInterestTiers(commissions);
  return commissions.sort((left, right) => {
    const leftGroup = commissionSortGroup(left, topInterestCounts);
    const rightGroup = commissionSortGroup(right, topInterestCounts);
    if (leftGroup !== rightGroup) return leftGroup - rightGroup;
    const leftInterest = commissionInterestSortCount(left);
    const rightInterest = commissionInterestSortCount(right);
    if (leftGroup === 0 && leftInterest !== rightInterest) return rightInterest - leftInterest;
    return commissionCreatedAt(right) - commissionCreatedAt(left)
      || collator.compare(left.title || '', right.title || '')
      || collator.compare(left.id || '', right.id || '');
  });
}

function commissionStatusLabel(commission) {
  return t(commission.status === 'completed' ? 'commission.completed' : 'commission.open');
}

function commissionGroupTitle(group) {
  const labels = {
    'zh-CN': ['大家想要', '看看这个', '等待采纳', '已完成'],
    'en-US': ['Most wanted', 'Take a look', 'Awaiting adoption', 'Completed'],
    'ja-JP': ['みんなが欲しい', 'こちらも注目', '採用待ち', '完了'],
    'ko-KR': ['모두가 원하는 것', '이것도 확인', '채택 대기', '완료']
  };
  return labels[i18n.language]?.[group] || labels['zh-CN'][group] || '';
}

function renderCommissionGroupHeading(group) {
  const heading = document.createElement('h3');
  heading.className = 'commission-group-heading';
  heading.dataset.group = String(group);
  const label = document.createElement('span');
  label.className = 'commission-group-heading-label';
  label.textContent = commissionGroupTitle(group);
  const artSources = [
    'assets/commission-heading-wanted.png',
    'assets/commission-open-jianxin.png',
    'assets/commission-heading-pending.png',
    'assets/commission-heading-completed.png'
  ];
  const art = document.createElement('img');
  art.className = 'commission-group-heading-art';
  art.src = artSources[group] || artSources[0];
  art.alt = '';
  art.setAttribute('aria-hidden', 'true');
  heading.append(art, label);
  return heading;
}

function renderCommunityGroupHeading(group) {
  const heading = document.createElement('h3');
  heading.className = 'community-group-heading';
  heading.dataset.group = String(group);
  const label = document.createElement('span');
  label.className = 'community-group-heading-label';
  label.textContent = t(['community.groupNew', 'community.groupPopular', 'community.groupPlaza'][group]);
  const artSources = [
    'assets/combo-heading-new.png',
    'assets/combo-heading-popular.png',
    'assets/combo-heading-plaza.png'
  ];
  const art = document.createElement('img');
  art.className = 'community-group-heading-art';
  art.src = artSources[group] || artSources[2];
  art.alt = '';
  art.setAttribute('aria-hidden', 'true');
  heading.append(art, label);
  return heading;
}

function commissionInterestTotal(commission) {
  const count = Number(commission?.interestCount || 0);
  return 1 + (Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0);
}

function commissionCommentsId(commission) {
  return commission?.id ? `commission:${commission.id}` : '';
}

function commentTargetId(target, kind = state.commentsKind) {
  if (!target?.id) return '';
  return kind === 'commission' ? commissionCommentsId(target) : String(target.id);
}

function commentCountFor(target, kind = 'combo') {
  const id = commentTargetId(target, kind);
  const loaded = state.commentsByChart[id];
  return Array.isArray(loaded) ? loaded.length : Math.max(0, Number(target?.commentCount || 0));
}

function renderCommissionCard(commission) {
  const card = els.commissionTemplate.content.firstElementChild.cloneNode(true);
  i18n.apply(card);
  card.classList.toggle('completed', commission.status === 'completed');
  const grade = gradeForTags(commission.tag || '基础');
  const gradeNode = card.querySelector('.commission-grade');
  gradeNode.textContent = grade.grade;
  gradeNode.dataset.grade = grade.grade;
  gradeNode.title = i18n.localizeTag(grade.tag);
  card.querySelector('.commission-updated').textContent = `${t('commission.created')} ${formatDate(commission.createdAt || commission.updatedAt)}`;
  card.querySelector('h3').textContent = commission.title || t('commission.untitled');
  card.querySelector('.commission-excerpt').textContent = commission.description || '';
  const characterNames = commissionCharacters(commission).slice(0, MAX_SELECTED_CHARACTERS);
  const characters = card.querySelector('.commission-characters');
  for (const name of characterNames) {
    const item = document.createElement('span');
    item.append(avatarElement(name), document.createTextNode(name));
    characters.appendChild(item);
  }
  renderCommissionBaseDecorations(card.querySelector('.commission-base-decorations'), characterNames);
  const owner = commission.owner || {};
  const ownerAvatar = card.querySelector('.commission-owner-avatar');
  renderProfileAvatarNode(ownerAvatar, owner.avatar, String(owner.nickname || '?').slice(0, 1));
  card.querySelector('.commission-owner strong').textContent = owner.nickname || t('common.unknown');
  card.querySelector('.commission-owner small').textContent = owner.email || '';
  const badge = card.querySelector('.commission-owner em');
  badge.hidden = !owner.badge;
  badge.textContent = owner.badge || '';
  const interestTotal = commissionInterestTotal(commission);
  const interestCount = card.querySelector('.commission-owner .commission-interest-count');
  interestCount.textContent = String(interestTotal);
  interestCount.parentElement.setAttribute('aria-label', `${t('commission.interestLabel')}: ${interestTotal}`);
  const hoverGrade = card.querySelector('.commission-hover-grade');
  hoverGrade.textContent = grade.grade;
  hoverGrade.dataset.grade = grade.grade;
  hoverGrade.title = i18n.localizeTag(grade.tag);
  const hoverInterestCount = card.querySelector('.commission-hover-interest .commission-interest-count');
  hoverInterestCount.textContent = String(interestTotal);
  hoverInterestCount.parentElement.setAttribute('aria-label', `${t('commission.interestLabel')}: ${interestTotal}`);
  const rawResponseTotal = Number(commission.responseCount || 0);
  const responseTotal = Number.isFinite(rawResponseTotal) ? Math.max(0, Math.floor(rawResponseTotal)) : 0;
  const responseCount = card.querySelector('.commission-response-count');
  responseCount.hidden = responseTotal < 1;
  responseCount.textContent = responseTotal > 0 ? String(responseTotal) : '';
  responseCount.setAttribute('aria-label', `${t('commission.responseLabel')}: ${responseTotal}`);
  const interest = card.querySelector('.commission-interest-button');
  const viewerInterested = Boolean(commission.viewerInterested || commission.viewerIsOwner);
  interest.disabled = commission.status === 'completed' || viewerInterested;
  interest.classList.toggle('selected', viewerInterested);
  interest.querySelector('span').textContent = viewerInterested ? t('commission.interested') : t('commission.interest');
  interest.addEventListener('click', () => { void addCommissionInterest(commission); });
  const actions = card.querySelector('.commission-card-actions');
  actions.addEventListener('pointermove', (event) => {
    if (!event.target.closest('button')) card.classList.add('commission-actions-open');
  });
  actions.addEventListener('pointerleave', () => card.classList.remove('commission-actions-open'));
  card.querySelector('.commission-detail-button').addEventListener('click', () => openCommissionDetail(commission));
  return card;
}

async function addCommissionInterest(commission) {
  if (!commission || commission.status === 'completed' || commission.viewerInterested || commission.viewerIsOwner) return;
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
    characters: response.characters?.length ? splitCharacterNames(response.characters) : chartCharacters(packageChart),
    character: splitCharacterNames(response.characters)?.[0] || packageChart.character,
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
  for (const name of splitCharacterNames(response.characters)) characters.appendChild(avatarElement(name));
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
    detailMetaRow(t('commission.interestLabel'), String(commissionInterestTotal(commission))),
    detailMetaRow(t('commission.responseLabel'), String(Number(commission.responseCount || 0))),
    detailMetaRow(t('commission.created'), formatDate(commission.createdAt)),
    detailMetaRow('ID', commission.id || t('common.unknown'))
  );
  const viewerInterested = Boolean(commission.viewerInterested || commission.viewerIsOwner);
  els.commissionInterest.disabled = commission.status === 'completed' || viewerInterested;
  els.commissionInterest.classList.toggle('selected', viewerInterested);
  els.commissionInterest.querySelector('span').textContent = viewerInterested ? t('commission.interested') : t('commission.interest');
  const commentTotal = commentCountFor(commission, 'commission');
  els.commissionDetailCommentCount.hidden = commentTotal < 1;
  els.commissionDetailCommentCount.textContent = commentTotal > 0 ? String(commentTotal) : '';
  els.commissionComments.setAttribute('aria-label', `${t('comments.button')} ${commentTotal}`);
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
  const canVote = chart.canVote === true && !vote;
  els.detailUpvote.querySelector('[data-vote-count]').textContent = String(Number(chart.votes?.up || 0));
  els.detailUpvote.classList.toggle('selected', vote === 'up');
  els.detailUpvote.disabled = !canVote;
  const commentCount = commentCountFor(chart, 'combo');
  els.detailCommentCount.textContent = String(commentCount);
  els.detailCommentCount.hidden = commentCount === 0;
  els.detailComments.disabled = false;
  els.detailComments.setAttribute('aria-label', `${t('comments.button')} ${commentCount}`);
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

function commentsFor(chart) {
  if (!chart?.id) return [];
  const chartId = commentTargetId(chart);
  const merged = new Map();
  for (const item of Array.isArray(chart.comments) ? chart.comments : []) {
    const comment = normalizedComment(item, `${chartId}-remote-${merged.size}`);
    if (comment) merged.set(comment.id, comment);
  }
  for (const item of state.commentsByChart[chartId] || []) merged.set(item.id, item);
  return [...merged.values()].sort((a, b) => a.createdAt - b.createdAt);
}

function commentAvatarNode(comment) {
  const avatar = document.createElement('span');
  avatar.className = 'comment-avatar profile-avatar';
  const name = String(comment.avatar || '').trim();
  if (name && state.characterIcons.has(name)) {
    avatar.appendChild(avatarElement(name, 'profile-avatar-image'));
    return avatar;
  }
  avatar.textContent = Array.from(comment.username || t('comments.guest'))[0]?.toUpperCase() || '?';
  return avatar;
}

function renderCommentItem(comment, parent = null) {
  const item = document.createElement('article');
  item.className = `comment-item${parent ? ' comment-reply' : ''}`;
  item.dataset.commentId = comment.id;
  const head = document.createElement('header');
  head.className = 'comment-item-head';
  const author = document.createElement('div');
  author.className = 'comment-author';
  const name = document.createElement('strong');
  name.textContent = comment.username;
  author.append(commentAvatarNode(comment), name);
  const date = document.createElement('time');
  date.dateTime = new Date(comment.createdAt).toISOString();
  date.textContent = formatDate(comment.createdAt);
  head.append(author, date);
  const body = document.createElement('p');
  body.textContent = comment.body;
  const actions = document.createElement('footer');
  actions.className = 'comment-item-actions';
  if (parent) {
    const replyTo = document.createElement('span');
    replyTo.textContent = t('comments.replying', { name: parent.username });
    actions.appendChild(replyTo);
  }
  const reply = document.createElement('button');
  reply.type = 'button';
  reply.dataset.commentReply = comment.id;
  reply.innerHTML = `<i data-lucide="corner-down-right" aria-hidden="true"></i><span>${t('comments.reply')}</span>`;
  actions.appendChild(reply);
  item.append(head, body, actions);
  return item;
}

function renderComments() {
  const chart = state.commentsChart;
  if (!chart) return;
  const comments = commentsFor(chart);
  const byId = new Map(comments.map((comment) => [comment.id, comment]));
  const grouped = new Map();
  for (const comment of comments) {
    let root = comment;
    const seen = new Set();
    while (root.parentId && byId.has(root.parentId) && !seen.has(root.id)) {
      seen.add(root.id);
      root = byId.get(root.parentId);
    }
    if (!grouped.has(root.id)) grouped.set(root.id, []);
    if (root.id !== comment.id) grouped.get(root.id).push(comment);
  }
  const fragment = document.createDocumentFragment();
  for (const root of comments.filter((comment) => !comment.parentId || !byId.has(comment.parentId))) {
    fragment.appendChild(renderCommentItem(root));
    for (const reply of (grouped.get(root.id) || []).sort((a, b) => a.createdAt - b.createdAt)) {
      fragment.appendChild(renderCommentItem(reply, root));
    }
  }
  els.commentsList.replaceChildren(fragment);
  els.commentsList.hidden = comments.length === 0;
  els.commentsEmpty.hidden = comments.length > 0;
  els.commentsComboTitle.textContent = chart.title || t('card.untitled');
  els.commentsCount.textContent = t('comments.count', { count: comments.length });
  if (state.commentReplyTarget) {
    els.commentReplyContext.hidden = false;
    els.commentReplyLabel.textContent = t('comments.replying', { name: state.commentReplyTarget.username });
    els.commentInput.placeholder = t('comments.replyPlaceholder', { name: state.commentReplyTarget.username });
    els.submitCommentLabel.textContent = t('comments.replySubmit');
  } else {
    els.commentReplyContext.hidden = true;
    els.commentInput.placeholder = t('comments.placeholder');
    els.submitCommentLabel.textContent = t('comments.submit');
  }
  window.lucide?.createIcons();
}

function updateCommentInputCount() {
  els.commentInputCount.textContent = `${els.commentInput.value.length} / 1000`;
}

function refreshCommentCount(target, kind) {
  if (kind === 'commission') {
    render();
    if (state.commissionDetail?.id === target.id) renderCommissionDetail();
    return;
  }
  renderVoteControls(target);
  render();
}

async function loadCommentsFor(chart, kind = state.commentsKind) {
  if (!chart?.id) return;
  const chartId = commentTargetId(chart, kind);
  try {
    const response = await fetch(`/api/community/comments/${encodeURIComponent(chartId)}`, { cache: 'no-store', credentials: 'same-origin' });
    const value = await response.json().catch(() => ({}));
    if (!response.ok || !Array.isArray(value.comments)) throw new Error(value.error || `HTTP ${response.status}`);
    state.commentsByChart[chartId] = value.comments.map((item, index) => normalizedComment(item, `${chartId}-${index}`)).filter(Boolean);
    chart.commentCount = Number(value.count || state.commentsByChart[chartId].length);
    if (state.commentsChart?.id === chart.id && state.commentsKind === kind) {
      renderComments();
      refreshCommentCount(chart, kind);
    }
  } catch (error) {
    if (state.commentsChart?.id === chart.id && state.commentsKind === kind) {
      els.commentFormStatus.textContent = `Comments could not be loaded: ${error.message}`;
      els.commentFormStatus.className = 'error';
    }
  }
}

function openComments(chart, kind = 'combo') {
  if (!chart?.id) return;
  state.commentsChart = chart;
  state.commentsKind = kind;
  state.commentReplyTarget = null;
  els.commentsBackdrop.hidden = false;
  els.commentInput.value = '';
  els.commentFormStatus.textContent = '';
  els.commentFormStatus.className = '';
  updateCommentInputCount();
  renderComments();
  syncModalBody();
  void loadCommentsFor(chart, kind);
  requestAnimationFrame(() => els.commentInput.focus());
}

function closeComments() {
  state.commentsChart = null;
  state.commentsKind = 'combo';
  state.commentReplyTarget = null;
  els.commentsBackdrop.hidden = true;
  syncModalBody();
}

function setCommentReplyTarget(commentId) {
  const comment = commentsFor(state.commentsChart).find((item) => item.id === commentId);
  if (!comment) return;
  state.commentReplyTarget = comment;
  renderComments();
  els.commentInput.focus();
}

async function submitComment(event) {
  event.preventDefault();
  const chart = state.commentsChart;
  const kind = state.commentsKind;
  const body = els.commentInput.value.trim();
  if (!chart?.id) return;
  if (!body) {
    els.commentFormStatus.textContent = t('comments.emptyHint');
    els.commentFormStatus.className = 'error';
    return;
  }
  const chartId = commentTargetId(chart, kind);
  const payload = {
    parentId: state.commentReplyTarget?.id || '',
    username: state.profile.username || t('comments.guest'),
    avatar: state.profile.avatar,
    body
  };
  els.commentFormStatus.textContent = 'Saving comment...';
  els.commentFormStatus.className = '';
  try {
    const response = await fetch(`/api/community/comments/${encodeURIComponent(chartId)}`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const value = await response.json().catch(() => ({}));
    if (!response.ok || !value.comment) throw new Error(value.error || `HTTP ${response.status}`);
    const comment = normalizedComment(value.comment);
    if (!comment) throw new Error('The server returned an invalid comment.');
    state.commentsByChart[chartId] = [...(state.commentsByChart[chartId] || []), comment].slice(-200);
    chart.commentCount = Number(value.count || state.commentsByChart[chartId].length);
  } catch (error) {
    els.commentFormStatus.textContent = `Comment could not be saved: ${error.message}`;
    els.commentFormStatus.className = 'error';
    return;
  }
  state.commentReplyTarget = null;
  els.commentInput.value = '';
  els.commentFormStatus.textContent = '';
  els.commentFormStatus.className = '';
  updateCommentInputCount();
  renderComments();
  refreshCommentCount(chart, kind);
  els.commentInput.focus();
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

function axisCustomIconSource(mode, code) {
  const key = window.WWComboInputIcons?.inputIconCustomizationKey?.(mode, code);
  return key ? String(state.axisKeySettings?.customIconSources?.[key] || '') : '';
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
  if (!state.axisKeySettings || !axisLabelMatchesMove(custom, step.moveId) || state.axisIconSet === 'tide') return { label, iconSrc: '', iconWidthScale: 1 };
  if (state.axisIconSet === 'english') {
    const code = axisBindingCode(step.moveId, 'keyboard');
    return { label, iconSrc: code ? axisCustomIconSource('keyboard', code) || keyboardMouseIconSource(code) || '' : '', iconWidthScale: keyboardMouseIconWidthScale(code) };
  }
  const code = axisBindingCode(step.moveId, 'gamepad');
  return { label, iconSrc: code ? axisCustomIconSource('gamepad', code) || gamepadIconSource(code, state.axisIconSet) || '' : '', iconWidthScale: code.includes('+') ? 49 / AXIS_ICON_SIZE : 1 };
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
    if (!current || slotFromSwitch || current.slot !== slot) {
      current = { slot, steps: [] };
      groups.push(current);
    }
    current.steps.push(step);
  }
  return groups;
}

function axisStepMergeIconKey(step, labels, display) {
  const custom = String(labels[step.id] || '').trim();
  if (!axisLabelMatchesMove(custom, step.moveId)) return '';
  if (display.iconSrc) return `${step.moveId}|src:${display.iconSrc}`;
  const parts = axisIconParts(display.label);
  const icons = parts.filter((part) => part.kind === 'icon');
  if (!icons.length || icons.length !== parts.length || !icons.every((part) => part.mapping.id === icons[0].mapping.id)) return '';
  return `${step.moveId}|icon:${icons[0].mapping.id}`;
}

function axisMoveActions(steps, labels) {
  const actions = [];
  for (const step of steps) {
    const display = axisStepDisplay(step, labels);
    const mergeKey = state.axisMergeSameMove ? axisStepMergeIconKey(step, labels, display) : '';
    const previous = actions[actions.length - 1];
    if (mergeKey && previous?.mergeKey === mergeKey) {
      previous.steps.push(step);
      previous.count += 1;
      continue;
    }
    actions.push({ steps: [step], display, count: 1, mergeKey });
  }
  return actions;
}

function estimateAxisActionWidth(display, count = 1) {
  let width;
  if (display.iconSrc) {
    width = AXIS_ICON_SIZE * (display.iconWidthScale || 1);
  } else {
    const parts = axisIconParts(display.label);
    const contentWidth = parts.reduce((contentWidth, part) => {
      if (part.kind === 'icon') {
        const wideGamepadIcon = ['xbox', 'playstation'].includes(state.axisIconSet) && part.mapping.gamepadCode?.includes('+');
        return contentWidth + (wideGamepadIcon ? 49 : AXIS_ICON_SIZE);
      }
      return contentWidth + Math.max(14, Array.from(part.value).length * 12);
    }, 0);
    width = Math.max(20, contentWidth + Math.max(0, parts.length - 1) * 2);
  }
  return count > 1 ? width + 8 + Math.max(26, `x${count}`.length * 14) : width;
}

function axisBlockMaxWidth(target = els.axisPreview) {
  return Math.max(220, target.clientWidth - 72);
}

function splitAxisMoveGroups(groups, labels, target = els.axisPreview) {
  const maxWidth = axisBlockMaxWidth(target);
  const scale = state.axisScale;
  const chunks = [];
  for (const group of groups) {
    const actions = axisMoveActions(group.steps, labels);
    let chunk = { slot: group.slot, steps: [], actions: [], showAvatar: true };
    let width = (20 + AXIS_AVATAR_SIZE + 8) * scale;
    for (const action of actions) {
      const actionWidth = estimateAxisActionWidth(action.display, action.count) * scale;
      const nextWidth = width + (chunk.actions.length ? 5 * scale : 0) + actionWidth;
      if (chunk.actions.length && nextWidth > maxWidth) {
        chunks.push(chunk);
        chunk = { slot: group.slot, steps: [], actions: [], showAvatar: false };
        width = 20 * scale;
      }
      width += (chunk.actions.length ? 5 * scale : 0) + actionWidth;
      chunk.actions.push(action);
      chunk.steps.push(...action.steps);
    }
    if (chunk.actions.length) chunks.push(chunk);
  }
  return chunks;
}

function axisActionContent(display, count = 1) {
  const action = document.createElement('span');
  action.className = 'axis-action';
  if (display.iconSrc) {
    const icon = document.createElement('img');
    icon.className = 'axis-action-icon';
    icon.style.setProperty('--axis-icon-width-scale', String(display.iconWidthScale || 1));
    icon.src = display.iconSrc;
    icon.alt = display.label;
    icon.title = display.label;
    action.appendChild(icon);
  } else {
    for (const part of axisIconParts(display.label)) {
      if (part.kind === 'text') {
        const text = document.createElement('span');
        text.textContent = part.value;
        action.appendChild(text);
        continue;
      }
      const icon = document.createElement('img');
      icon.className = 'axis-action-icon';
      icon.src = state.axisIconSet === 'tide'
        ? part.mapping.tideSrc || part.mapping.englishSrc
        : part.mapping[`${state.axisIconSet}Src`] || part.mapping.englishSrc;
      if (['xbox', 'playstation'].includes(state.axisIconSet) && part.mapping.gamepadCode?.includes('+')) {
        icon.classList.add('is-wide');
      }
      icon.alt = i18n.localizeMove(part.mapping.label);
      icon.title = i18n.localizeMove(part.mapping.label);
      action.appendChild(icon);
    }
  }
  if (count > 1) {
    const countLabel = document.createElement('span');
    countLabel.className = 'axis-action-count';
    countLabel.textContent = `x${count}`;
    action.appendChild(countLabel);
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
  const syncedFromClient = isEmbeddedClient && state.axisKeySettingsFile === 'WW Combo Trainer';
  for (const button of els.axisKeymapButtons) {
    button.classList.toggle('loaded', Boolean(state.axisKeySettings));
    button.disabled = syncedFromClient;
    const label = button.querySelector('span');
    if (label) label.textContent = syncedFromClient ? t('axis.keysSynced') : t('axis.importKeys');
    button.title = state.axisKeySettings
      ? syncedFromClient ? t('axis.keysSynced') : t('axis.keysImported', { file: state.axisKeySettingsFile || 'wwcombo-input-settings' })
      : t('axis.importKeys');
  }
}

function applyAxisKeySettings(value, fileName) {
  state.axisKeySettings = normalizeAxisKeySettings(value);
  state.axisKeySettingsFile = fileName;
  if (state.axisKeySettings.preferences.inputMode === 'gamepad') state.axisIconSet = state.axisKeySettings.preferences.gamepadIconSet;
  else state.axisIconSet = 'english';
  try { localStorage.setItem(AXIS_KEY_SETTINGS_STORAGE_KEY, JSON.stringify({ settings: state.axisKeySettings, fileName })); } catch {}
  renderAxisIconSet();
  renderAxisKeymapButtons();
  renderActiveAxisPreviews();
}

async function importAxisKeySettings(file) {
  if (!file) return;
  try {
    const value = JSON.parse((await file.text()).replace(/^\uFEFF/, ''));
    applyAxisKeySettings(value, file.name);
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

function syncAxisMergeSameMoveControls() {
  for (const input of els.axisMergeSameMoveControls) input.checked = state.axisMergeSameMove;
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
      const actions = moveGroup.actions || axisMoveActions(moveGroup.steps, labels);
      const actionLabels = actions.map((action) => action.count > 1 ? `${action.display.label} x${action.count}` : action.display.label);
      chip.title = `${character} · ${actionLabels.join('')} · ${formatDuration(firstStep.startMin)} - ${formatDuration(lastStep.startMin)}`;
      if (moveGroup.showAvatar) chip.appendChild(avatarElement(character));
      const content = document.createElement('div');
      content.className = 'axis-move-content';
      content.setAttribute('aria-label', actionLabels.join(''));
      for (const action of actions) content.appendChild(axisActionContent(action.display, action.count));
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
  const cards = [];
  if (commissionView) {
    const topInterestCounts = commissionTopInterestTiers(items);
    let previousGroup = -1;
    for (const item of items) {
      const currentGroup = commissionSortGroup(item, topInterestCounts);
      if (currentGroup !== previousGroup) {
        cards.push(renderCommissionGroupHeading(currentGroup));
        previousGroup = currentGroup;
      }
      cards.push(renderCommissionCard(item));
    }
  } else {
    for (const section of communityChartSections(items)) {
      cards.push(renderCommunityGroupHeading(section.group));
      cards.push(...section.items.map(renderCard));
    }
  }
  els.list.replaceChildren(...cards);
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
  renderAccountSession();
  renderFilters();
  render();
  renderAxisKeymapButtons();
  if (!els.characterPickerBackdrop.hidden) {
    setCharacterHint(false);
    renderCharacterPicker();
  }
  if (state.detailChart) void openDetails(state.detailChart, state.detailOptions || {});
  if (state.commentsChart) renderComments();
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
    renderClientComboPicker();
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
  const cachedIcons = readCharacterIconCache();
  if (cachedIcons.size) {
    state.characterIcons = cachedIcons;
    renderProfile();
    render();
  }
  try {
    let response = await fetch(CHARACTER_ICON_MANIFEST, { cache: 'force-cache' });
    if (!response.ok) response = await fetch(CHARACTER_ICON_API, { cache: 'force-cache' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    const icons = characterIconMap(payload);
    if (!icons.size) throw new Error('Character icon manifest is empty');
    writeCharacterIconCache(icons);
    state.characterIcons = icons;
    renderProfile();
    render();
    if (!els.characterPickerBackdrop.hidden) renderCharacterPicker();
  } catch {
    // Keep a previous manifest when the network or static host is briefly unavailable.
    if (!state.characterIcons.size && cachedIcons.size) {
      state.characterIcons = cachedIcons;
      renderProfile();
      render();
    }
  }
}

function characterBasePresetMap(payload, manifestUrl) {
  const entries = Array.isArray(payload?.characters) ? payload.characters : [];
  const presets = new Map();
  const resolvedManifestUrl = new URL(manifestUrl, location.href).href;
  for (const entry of entries) {
    const name = canonicalCharacterName(entry?.names?.['zh-CN']);
    const preset = entry?.basePreset;
    if (!name || !preset || typeof preset.src !== 'string') continue;
    try {
      const src = new URL(preset.src, resolvedManifestUrl).href;
      if (!['http:', 'https:'].includes(new URL(src).protocol)) continue;
      presets.set(name, {
        src,
        crop: preset.crop || {},
        imageWidth: Number(preset.imageWidth) || 426,
        imageHeight: Number(preset.imageHeight) || 426
      });
    } catch {}
  }
  return presets;
}

function commissionBasePresetFor(name) {
  const canonicalName = canonicalCharacterName(name);
  const aliases = {
    '秧秧·玄翎': '玄翎',
    '秧秧・玄翎': '玄翎',
    '秧秧.玄翎': '玄翎',
    '秧秧 · 玄翎': '玄翎',
    '漂泊者·气动': '风主',
    '漂泊者・气动': '风主',
    '漂泊者.气动': '风主',
    '漂泊者·湮灭': '暗主',
    '漂泊者・湮灭': '暗主',
    '漂泊者.湮灭': '暗主',
    '漂泊者·衍射': '光主',
    '漂泊者・衍射': '光主',
    '漂泊者.衍射': '光主',
    '漂泊者·电': '雷主',
    '漂泊者・电': '雷主',
    '漂泊者.电': '雷主',
    '漂泊者·雷': '雷主',
    '漂泊者・雷': '雷主',
    '漂泊者.雷': '雷主',
    '洛瑟菈': '洛瑟拉',
    '嘉贝莉娜': '嘉贝丽娜'
  };
  return state.characterBasePresets.get(canonicalName)
    || state.characterBasePresets.get(aliases[canonicalName] || '');
}

function renderCommissionBaseDecorations(target, characters) {
  if (!target) return;
  target.replaceChildren();
  characters.slice(0, MAX_SELECTED_CHARACTERS).forEach((name, index) => {
    const preset = commissionBasePresetFor(name);
    if (!preset?.src) return;
    const layer = document.createElement('span');
    layer.className = `commission-base-layer commission-base-layer-${index + 1}`;
    layer.dataset.character = name;
    const crop = preset.crop || {};
    // Narrow traveler banners use x as an editor guide, not as a hard left trim.
    const cropX = preset.imageHeight < 100 ? 0 : Math.max(0, Math.min(100, Number(crop.x) || 0));
    const cropY = Math.max(0, Math.min(100, Number(crop.y) || 0));
    const cropHeight = Math.max(.1, Math.min(100 - cropY, Number(crop.h) || 100));
    const image = document.createElement('img');
    image.src = preset.src;
    image.alt = '';
    layer.title = name;
    layer.appendChild(image);
    target.appendChild(layer);
    requestAnimationFrame(() => {
      if (!layer.isConnected || !layer.clientHeight) return;
      // The standard templates use 13% or 14% crop heights; normalize them so characters do not jump in scale.
      const renderCropHeight = preset.imageHeight === 426 ? Math.min(cropHeight, 13) : cropHeight;
      const renderedHeight = layer.clientHeight * 100 / renderCropHeight;
      const renderedWidth = renderedHeight * preset.imageWidth / preset.imageHeight;
      const cropLeft = renderedWidth * cropX / 100;
      image.style.width = `${renderedWidth}px`;
      image.style.height = `${renderedHeight}px`;
      image.style.left = `${-cropLeft}px`;
      const cropCenterY = cropY + cropHeight / 2;
      image.style.top = `${layer.clientHeight / 2 - renderedHeight * cropCenterY / 100}px`;
    });
  });
}

function applyBaseDecoration(target, chart, characters) {
  if (!target) return;
  target.replaceChildren();
  target.style.backgroundImage = '';
  const name = canonicalCharacterName(chart.longestCharacter || chart.firstCharacter || characters[0] || '');
  const preset = commissionBasePresetFor(name);
  if (!preset?.src) return;
  const crop = preset.crop || {};
  const y = Math.max(0, Math.min(100, Number(crop.y) || 0));
  const height = Math.max(.1, Math.min(100 - y, Number(crop.h) || 100));
  target.style.backgroundImage = `url("${preset.src.replace(/"/g, '%22')}")`;
  // Fit the cropped strip by height and let its width follow the source ratio.
  // The card clips the excess width instead of stretching the character.
  target.style.backgroundSize = `auto ${10000 / height}%`;
  const yPosition = height >= 100 ? 0 : y / (100 - height) * 100;
  target.style.backgroundPosition = `right ${yPosition}%`;
  // Cards are still detached while they are being built, so align after layout.
  requestAnimationFrame(() => {
    if (!target.isConnected || !target.clientWidth) return;
    const laidOutHeight = target.clientHeight * 100 / height;
    const laidOutWidth = laidOutHeight * preset.imageWidth / preset.imageHeight;
    target.style.backgroundPosition = `${target.clientWidth - laidOutWidth / 2 + 30}px ${yPosition}%`;
  });
  target.classList.add('is-ready');
}

async function loadCharacterBasePresets() {
  try {
    const manifestUrl = projectAssetManifestUrl();
    const response = await fetch(manifestUrl, { cache: 'no-cache' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    state.characterBasePresets = characterBasePresetMap(await response.json(), manifestUrl);
    render();
  } catch {
    state.characterBasePresets = new Map();
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
    void loadCharacterBasePresets();
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
    const response = await fetch(commissionSourceUrl, {
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
els.commissionComments?.addEventListener('click', () => { if (state.commissionDetail) openComments(state.commissionDetail, 'commission'); });
els.commissionResponseUpload?.addEventListener('click', () => { if (state.commissionDetail) openUpload(state.commissionDetail.id); });
els.commissionWithdraw?.addEventListener('click', () => { if (state.commissionDetail) void withdrawCommission(state.commissionDetail); });
els.languageSelect?.addEventListener('change', () => i18n.setLanguage(els.languageSelect.value));
window.addEventListener('wwcombo-languagechange', refreshLocalizedView);
els.clientDownloadButton?.addEventListener('click', () => { void openClientDownload(); });
els.closeClientDownload?.addEventListener('click', closeClientDownload);
els.clientDownloadBackdrop?.addEventListener('mousedown', (event) => { if (event.target === els.clientDownloadBackdrop) closeClientDownload(); });
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
    if (!['english', 'tide', 'xbox', 'playstation'].includes(next) || next === state.axisIconSet) return;
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
for (const input of els.axisMergeSameMoveControls) {
  input.addEventListener('change', () => {
    state.axisMergeSameMove = input.checked;
    syncAxisMergeSameMoveControls();
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
  else if (!els.clientDownloadBackdrop.hidden) closeClientDownload();
  else if (!els.commentsBackdrop.hidden) closeComments();
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
els.commentForm?.addEventListener('submit', submitComment);
document.addEventListener('click', (event) => {
  const trigger = event.target.closest?.('#detailComments');
  if (trigger && state.detailChart) openComments(state.detailChart);
});
els.commentInput?.addEventListener('input', updateCommentInputCount);
els.commentsList?.addEventListener('click', (event) => {
  const button = event.target.closest('[data-comment-reply]');
  if (button) setCommentReplyTarget(button.dataset.commentReply);
});
els.cancelCommentReply?.addEventListener('click', () => {
  state.commentReplyTarget = null;
  renderComments();
  els.commentInput.focus();
});
els.closeComments?.addEventListener('click', closeComments);
els.cancelComments?.addEventListener('click', closeComments);
els.commentsBackdrop?.addEventListener('mousedown', (event) => { if (event.target === els.commentsBackdrop) closeComments(); });
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
els.sendAccountCode?.addEventListener('click', () => { void sendAccountCode(); });
els.verifyAccount?.addEventListener('click', () => { void verifyAccount(); });
els.accountLogout?.addEventListener('click', () => { void logoutAccount(); });
els.profileForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const nextProfile = { ...state.profile, username: els.profileUsernameInput.value.trim().slice(0, 40), email: els.profileEmailInput.value.trim().toLowerCase().slice(0, 254), avatar: state.profileDraftAvatar };
  const accountChanged = state.accountSession.authenticated && state.accountSession.email !== nextProfile.email;
  state.profile = nextProfile;
  try { localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(state.profile)); } catch {}
  if (accountChanged) await logoutAccount();
  renderProfile();
  if (state.commissionLoadState !== 'idle') void loadCommissions();
  els.profileFeedback.textContent = t('profile.saved');
  els.profileFeedback.className = 'form-feedback success';
  const pendingUploadIntent = state.pendingUploadIntent;
  state.pendingUploadIntent = null;
  setTimeout(() => {
    closeProfile();
    if (pendingUploadIntent) openUpload(pendingUploadIntent.commissionId, pendingUploadIntent.initialPackage);
  }, 500);
});
els.clearProfile?.addEventListener('click', () => {
  state.profile = { username: '', email: '', avatar: '' };
  state.profileDraftAvatar = '';
  try { localStorage.removeItem(PROFILE_STORAGE_KEY); } catch {}
  els.profileUsernameInput.value = '';
  els.profileEmailInput.value = '';
  renderProfile();
  void logoutAccount();
  if (state.commissionLoadState !== 'idle') void loadCommissions();
});
els.profileAvatarGrid?.addEventListener('click', (event) => {
  const button = event.target.closest('.profile-avatar-option');
  if (!button) return;
  state.profileDraftAvatar = button.dataset.avatar || '';
  renderProfileAvatarGrid();
});
els.submissionButton?.addEventListener('click', () => {
  if (state.view === 'commissions') openCommissionCreate();
  else openUpload();
});
els.closeUpload?.addEventListener('click', closeUpload);
els.cancelUpload?.addEventListener('click', closeUpload);
els.uploadBackdrop?.addEventListener('mousedown', (event) => { if (event.target === els.uploadBackdrop) closeUpload(); });
els.editUploadProfile?.addEventListener('click', () => {
  state.pendingUploadIntent = { commissionId: state.uploadMode === 'commission' ? state.uploadCommissionId : '', initialPackage: state.uploadSource };
  closeUpload();
  openProfile();
});
els.clientComboList?.addEventListener('click', (event) => {
  const button = event.target.closest('.client-combo-card');
  if (button?.dataset.chartId) requestClientLibraryItem(button.dataset.chartId);
});
els.refreshClientCombos?.addEventListener('click', requestClientLibrary);
els.comboFile?.addEventListener('change', () => {
  void previewUploadFile();
});
els.uploadForm?.addEventListener('submit', submitCombo);

if (isEmbeddedClient) {
  i18n.setLanguage(params.get('lang'), false);
  setTheme(params.get('theme'), false);
  requestClientLibrary();
}
updateThemeControl();
updateMotionControl();
updateEmbeddedClientControls(false);
renderProfile();
renderAccountSession();
void loadAccountSession();
renderAxisKeymapButtons();
syncAxisMergeSameMoveControls();
els.languageSelect.value = i18n.language;
window.lucide?.createIcons();
initHeroSpine();
loadIndex();
void loadCommissions();
void loadAppRelease();
