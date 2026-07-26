const state = {
  charts: [],
  title: '',
  character: '',
  tag: '',
  sort: 'updated'
};

const els = {
  form: document.getElementById('searchForm'),
  title: document.getElementById('titleInput'),
  clearTitle: document.getElementById('clearSearchBtn'),
  character: document.getElementById('characterSelect'),
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
  template: document.getElementById('comboTemplate')
};

const collator = new Intl.Collator('zh-CN-u-co-pinyin', { sensitivity: 'base', numeric: true });
const params = new URLSearchParams(location.search);
const isLocalPreview = location.hostname === '127.0.0.1' || location.hostname === 'localhost';
const sourceUrl = params.get('source') || (isLocalPreview ? './demo-index.json' : './community-index.json');

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

function formatBytes(bytes) {
  const size = Number(bytes || 0);
  if (!size) return '';
  if (size < 1024) return `${size} B`;
  return `${Math.round(size / 1024)} KB`;
}

function formatDate(timestamp) {
  if (!Number(timestamp)) return '未知';
  return new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(Number(timestamp)));
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

async function downloadChart(event, chart) {
  const link = event.currentTarget;
  const url = chart.url || '';
  if (!url) return;
  event.preventDefault();
  const previousText = link.lastChild?.textContent;
  link.setAttribute('aria-busy', 'true');
  if (link.lastChild) link.lastChild.textContent = ' 下载中';
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
    if (link.lastChild && previousText !== undefined) link.lastChild.textContent = previousText;
  }
}

function renderFilters() {
  const characters = uniqueSorted(state.charts.flatMap(chartCharacters));
  els.character.replaceChildren(new Option('全部角色', ''));
  for (const character of characters) els.character.add(new Option(character, character));
  els.character.value = state.character;

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
    const titleMatches = !titleQuery || normalizeText(chart.title).includes(titleQuery);
    const characterMatches = !state.character || chartCharacters(chart).includes(state.character);
    const tagMatches = !state.tag || (Array.isArray(chart.tags) && chart.tags.includes(state.tag));
    return titleMatches && characterMatches && tagMatches;
  });
  return result.sort((left, right) => {
    if (state.sort === 'title') return collator.compare(left.title || '', right.title || '');
    if (state.sort === 'duration') return Number(left.durationMs || 0) - Number(right.durationMs || 0) || collator.compare(left.title || '', right.title || '');
    return Number(right.updatedAt || 0) - Number(left.updatedAt || 0);
  });
}

function renderCard(chart) {
  const card = els.template.content.firstElementChild.cloneNode(true);
  const tags = Array.isArray(chart.tags) ? chart.tags.filter(Boolean) : [];
  card.style.setProperty('--accent', tagAccent(tags));
  card.querySelector('h3').textContent = chart.title || '未命名连段';
  card.querySelector('.characters').textContent = chartCharacters(chart).join(' / ') || '角色未标注';
  const submitter = card.querySelector('.submitter');
  const submitterName = String(chart.submitter?.nickname || '').trim();
  const submitterEmail = String(chart.submitter?.email || '').trim();
  submitter.textContent = submitterName && submitterEmail ? `投稿者 ${submitterName} · ${submitterEmail}` : '';
  card.querySelector('.description').textContent = chart.description || '';
  card.querySelector('.rounds').textContent = `${Math.max(1, Number(chart.rounds || 1))} 轮`;
  card.querySelector('.duration').textContent = formatDuration(chart.durationMs);
  card.querySelector('.steps').textContent = `${Number(chart.stepCount || 0)} 步`;
  card.querySelector('.updated').textContent = formatDate(chart.updatedAt);
  card.querySelector('.file-size').textContent = formatBytes(chart.sizeBytes);

  const tagContainer = card.querySelector('.combo-tags');
  for (const tag of tags) {
    const item = document.createElement('span');
    item.className = 'combo-tag';
    item.textContent = tag;
    tagContainer.appendChild(item);
  }

  const download = card.querySelector('.download-button');
  download.href = chart.url || '#';
  download.download = filenameFor(chart);
  download.setAttribute('aria-label', `下载 ${chart.title || '连段'}`);
  download.addEventListener('click', (event) => downloadChart(event, chart));

  return card;
}

function syncUrl() {
  const next = new URLSearchParams(location.search);
  for (const [key, value] of [['q', state.title], ['character', state.character], ['tag', state.tag], ['sort', state.sort === 'updated' ? '' : state.sort]]) {
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
  els.character.value = state.character;
  for (const button of els.tags.querySelectorAll('.tag-button')) button.classList.toggle('active', button.dataset.tag === state.tag);
  syncUrl();
  window.lucide?.createIcons();
}

function resetFilters() {
  state.title = '';
  state.character = '';
  state.tag = '';
  state.sort = 'updated';
  els.title.value = '';
  render();
}

function setStatus(kind, text) {
  els.status.className = `index-status ${kind}`;
  els.status.lastElementChild.textContent = text;
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
    state.title = params.get('q') || '';
    state.character = params.get('character') || '';
    state.tag = params.get('tag') || '';
    state.sort = ['updated', 'title', 'duration'].includes(params.get('sort')) ? params.get('sort') : 'updated';
    els.title.value = state.title;
    renderFilters();
    render();
    setStatus('ready', `${state.charts.length} 个连段 · ${formatDate(data.updatedAt)} 更新`);
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
els.character.addEventListener('change', () => { state.character = els.character.value; render(); });
els.sort.addEventListener('change', () => { state.sort = els.sort.value; render(); });
els.tags.addEventListener('click', (event) => {
  const button = event.target.closest('.tag-button');
  if (!button) return;
  state.tag = button.dataset.tag || '';
  render();
});
els.reset.addEventListener('click', resetFilters);
els.emptyReset.addEventListener('click', resetFilters);
els.retry.addEventListener('click', loadIndex);

window.lucide?.createIcons();
loadIndex();
