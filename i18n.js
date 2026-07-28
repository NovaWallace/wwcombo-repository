(() => {
  const STORAGE_KEY = 'ww-combo-trainer-language-v1';
  const LANGUAGES = ['zh-CN', 'en-US', 'ja-JP', 'ko-KR'];
  const catalogs = {
    'zh-CN': {
      'meta.description': '鸣潮连段社区，按标题、角色和标签检索并下载连段谱。',
      'brand.home': '椰果朋克2077首页',
      'language.label': '语言', 'language.switch': '切换语言',
      'motion.enable': '开启动态背景', 'motion.disable': '关闭动态背景',
      'theme.day': '切换到白天模式', 'theme.night': '切换到夜间模式',
      'submission.helpAria': '查看投稿说明', 'submission.helpTitle': '投稿与处理说明',
      'submission.helpSubmit': '将 .wwcombo.json 文件作为附件发送到 2728756958@qq.com。系统每 10 分钟自动收取并检查格式，格式正确后直接发布，无需人工审核。',
      'submission.helpWithdraw': '需要撤回时，请使用投稿邮箱发信，主题写“撤回”，正文填写连段 ID；身份核对成功后会自动删除，无法核对的申请会转为人工处理。',
      'submission.helpReport': '需要投诉时，主题写“投诉”，正文填写连段 ID，维护者会在控制台处理。',
      'submission.buttonTitle': '复制投稿邮箱并打开 QQ 邮箱', 'submission.button': '上传连段', 'submission.copied': '邮箱已复制', 'submission.copyFailed': '复制失败',
      'hero.title': '早上好~椰之城——', 'status.loading': '正在读取索引',
      'search.titleLabel': '按标题搜索', 'search.titlePlaceholder': '搜索连段标题', 'search.clearTitle': '清空标题',
      'field.character': '角色', 'field.sort': '排序', 'field.tag': '标签',
      'sort.version': '版本顺序（新的优先）', 'sort.difficulty': '难度（从难到易）',
      'results.title': '社区连段', 'filters.reset': '重置筛选', 'filters.clear': '清除筛选',
      'empty.title': '没有找到对应连段', 'empty.body': '换一个标题、角色或标签试试。',
      'error.title': '暂时无法读取社区索引', 'error.later': '请稍后重试。', 'error.reload': '重新加载',
      'meta.rounds': '轮次', 'meta.duration': '轴长', 'meta.actions': '操作', 'meta.updated': '更新', 'meta.uploader': '上传者', 'meta.firstCharacter': '首发角色', 'meta.uploadVersion': '上传版本',
      'card.details': '详情', 'card.untitled': '未命名连段', 'card.charactersMissing': '角色未标注',
      'character.all': '全部角色', 'character.select': '选择角色', 'character.hint': '最多选择 3 名角色，选择顺序不影响检索。', 'character.max': '最多只能选择 3 名角色。',
      'character.close': '关闭角色选择', 'character.search': '搜索角色', 'character.none': '没有找到角色', 'character.selected': '已选 {count} / {max}', 'character.selectedAria': '已选择 {names}', 'character.usedAria': '所用角色：{names}',
      'common.all': '全部', 'common.clear': '清空', 'common.done': '完成', 'common.close': '关闭', 'common.unknown': '未知',
      'detail.title': '连段详情', 'detail.close': '关闭连段详情', 'detail.description': '简介', 'detail.demo': '演示链接', 'detail.download': '下载连段',
      'submitter.historical': '历史投稿', 'submitter.noEmail': '未记录邮箱',
      'axis.title': '连段图', 'axis.loading': '正在读取连段数据', 'axis.iconStyle': '招式图标样式', 'axis.letters': '字母', 'axis.graphics': '图形', 'axis.experimental': '实验功能',
      'axis.startup': '启动轴', 'axis.loop': '循环轴', 'axis.loopNumber': '循环轴{number}', 'axis.full': '完整连段', 'axis.role': '角色 {number}',
      'axis.noActions': '该轮没有操作记录', 'axis.allRounds': '全部轮次', 'axis.summary': '{periods} · {steps} 步 · {blocks} 招式块', 'axis.invalid': '连段 JSON 缺少轴数据', 'axis.failed': '连段图生成失败：{error}', 'axis.unavailable': '无法读取轴数据',
      'status.ready': '{count} 个连段 · {date} 更新', 'status.indexFailed': '索引读取失败', 'status.readFailed': '读取 {source} 失败：{error}', 'status.invalidIndex': '索引格式不正确',
      'unit.seconds': '{count} 秒', 'unit.rounds': '{count} 轮', 'unit.actions': '{count} 步', 'unit.results': '{count} 个结果',
      'tag.冒烟': '冒烟', 'tag.进阶': '进阶', 'tag.基础': '基础', 'tag.轮椅': '轮椅', 'tag.错轮': '错轮', 'tag.全局': '全局'
    },
    'en-US': {
      'meta.description': 'A Wuthering Waves combo community for finding and downloading rotations by title, character, and tag.',
      'brand.home': 'Coconut Punk 2077 home',
      'language.label': 'Language', 'language.switch': 'Change language',
      'motion.enable': 'Enable animated background', 'motion.disable': 'Disable animated background',
      'theme.day': 'Switch to light mode', 'theme.night': 'Switch to dark mode',
      'submission.helpAria': 'View submission instructions', 'submission.helpTitle': 'Submissions and moderation',
      'submission.helpSubmit': 'Email the .wwcombo.json file as an attachment to 2728756958@qq.com. The system checks for new mail every 10 minutes and publishes valid files automatically.',
      'submission.helpWithdraw': 'To withdraw a combo, email from the submitting address with “撤回” as the subject and the combo ID in the message. Verified requests are removed automatically; others are reviewed manually.',
      'submission.helpReport': 'To report a combo, use “投诉” as the subject and put the combo ID in the message. A maintainer will review it.',
      'submission.buttonTitle': 'Copy the submission address and open QQ Mail', 'submission.button': 'Submit combo', 'submission.copied': 'Email copied', 'submission.copyFailed': 'Copy failed',
      'hero.title': 'Good morning, Coconut City.', 'status.loading': 'Loading index',
      'search.titleLabel': 'Search by title', 'search.titlePlaceholder': 'Search combo titles', 'search.clearTitle': 'Clear title',
      'field.character': 'Characters', 'field.sort': 'Sort', 'field.tag': 'Tags',
      'sort.version': 'Version (newest first)', 'sort.difficulty': 'Difficulty (hardest first)',
      'results.title': 'Community combos', 'filters.reset': 'Reset filters', 'filters.clear': 'Clear filters',
      'empty.title': 'No matching combos', 'empty.body': 'Try another title, character, or tag.',
      'error.title': 'The community index is unavailable', 'error.later': 'Please try again later.', 'error.reload': 'Reload',
      'meta.rounds': 'Rounds', 'meta.duration': 'Duration', 'meta.actions': 'Actions', 'meta.updated': 'Updated', 'meta.uploader': 'Uploader', 'meta.firstCharacter': 'Opening character', 'meta.uploadVersion': 'Game version',
      'card.details': 'Details', 'card.untitled': 'Untitled combo', 'card.charactersMissing': 'Characters not listed',
      'character.all': 'All characters', 'character.select': 'Select characters', 'character.hint': 'Select up to 3 characters. Selection order does not affect results.', 'character.max': 'You can select up to 3 characters.',
      'character.close': 'Close character picker', 'character.search': 'Search characters', 'character.none': 'No characters found', 'character.selected': '{count} / {max} selected', 'character.selectedAria': 'Selected: {names}', 'character.usedAria': 'Characters used: {names}',
      'common.all': 'All', 'common.clear': 'Clear', 'common.done': 'Done', 'common.close': 'Close', 'common.unknown': 'Unknown',
      'detail.title': 'Combo details', 'detail.close': 'Close combo details', 'detail.description': 'Description', 'detail.demo': 'Demo link', 'detail.download': 'Download combo',
      'submitter.historical': 'Legacy submission', 'submitter.noEmail': 'Email not recorded',
      'axis.title': 'Combo chart', 'axis.loading': 'Loading combo data', 'axis.iconStyle': 'Action icon style', 'axis.letters': 'Letters', 'axis.graphics': 'Symbols', 'axis.experimental': 'Experimental',
      'axis.startup': 'Startup', 'axis.loop': 'Loop', 'axis.loopNumber': 'Loop {number}', 'axis.full': 'Full combo', 'axis.role': 'Character {number}',
      'axis.noActions': 'No actions recorded in this round', 'axis.allRounds': 'All rounds', 'axis.summary': '{periods} · {steps} actions · {blocks} blocks', 'axis.invalid': 'The combo JSON does not contain chart data', 'axis.failed': 'Could not generate the combo chart: {error}', 'axis.unavailable': 'Combo data unavailable',
      'status.ready': '{count} combos · updated {date}', 'status.indexFailed': 'Index load failed', 'status.readFailed': 'Could not load {source}: {error}', 'status.invalidIndex': 'Invalid index format',
      'unit.seconds': '{count} sec', 'unit.rounds': '{count} rounds', 'unit.actions': '{count} actions', 'unit.results': '{count} results',
      'tag.冒烟': 'Extreme', 'tag.进阶': 'Advanced', 'tag.基础': 'Basic', 'tag.轮椅': 'Easy', 'tag.错轮': 'Desynced', 'tag.全局': 'Global'
    },
    'ja-JP': {
      'meta.description': 'タイトル・キャラクター・タグからローテーションを検索してダウンロードできる鳴潮コンボコミュニティです。',
      'brand.home': '椰果パンク2077 ホーム',
      'language.label': '言語', 'language.switch': '言語を変更',
      'motion.enable': '動く背景を有効化', 'motion.disable': '動く背景を無効化',
      'theme.day': 'ライトモードに切り替え', 'theme.night': 'ダークモードに切り替え',
      'submission.helpAria': '投稿方法を見る', 'submission.helpTitle': '投稿と対応について',
      'submission.helpSubmit': '.wwcombo.json ファイルを添付して 2728756958@qq.com へ送信してください。10分ごとに自動確認され、形式が正しければそのまま公開されます。',
      'submission.helpWithdraw': '取り下げる場合は投稿時のメールアドレスから、件名を「撤回」、本文にコンボIDを記載して送信してください。本人確認できない場合は手動対応になります。',
      'submission.helpReport': '通報する場合は件名を「投诉」、本文にコンボIDを記載してください。管理者が確認します。',
      'submission.buttonTitle': '投稿先をコピーしてQQメールを開く', 'submission.button': 'コンボを投稿', 'submission.copied': 'アドレスをコピーしました', 'submission.copyFailed': 'コピー失敗',
      'hero.title': 'おはよう、椰子の街へ。', 'status.loading': 'インデックスを読み込み中',
      'search.titleLabel': 'タイトルで検索', 'search.titlePlaceholder': 'コンボタイトルを検索', 'search.clearTitle': 'タイトルを消去',
      'field.character': 'キャラクター', 'field.sort': '並び順', 'field.tag': 'タグ',
      'sort.version': 'バージョン（新しい順）', 'sort.difficulty': '難易度（高い順）',
      'results.title': 'コミュニティコンボ', 'filters.reset': 'フィルターをリセット', 'filters.clear': 'フィルターを解除',
      'empty.title': '該当するコンボがありません', 'empty.body': 'タイトル、キャラクター、タグを変えてみてください。',
      'error.title': 'コミュニティインデックスを取得できません', 'error.later': 'しばらくしてから再試行してください。', 'error.reload': '再読み込み',
      'meta.rounds': 'ラウンド', 'meta.duration': '長さ', 'meta.actions': '操作', 'meta.updated': '更新日', 'meta.uploader': '投稿者', 'meta.firstCharacter': '開始キャラ', 'meta.uploadVersion': 'ゲーム版',
      'card.details': '詳細', 'card.untitled': '無題のコンボ', 'card.charactersMissing': 'キャラクター未設定',
      'character.all': 'すべてのキャラクター', 'character.select': 'キャラクターを選択', 'character.hint': '最大3人まで選択できます。選択順は検索に影響しません。', 'character.max': '選択できるのは最大3人です。',
      'character.close': 'キャラクター選択を閉じる', 'character.search': 'キャラクターを検索', 'character.none': 'キャラクターが見つかりません', 'character.selected': '{count} / {max} 選択済み', 'character.selectedAria': '選択中：{names}', 'character.usedAria': '使用キャラクター：{names}',
      'common.all': 'すべて', 'common.clear': 'クリア', 'common.done': '完了', 'common.close': '閉じる', 'common.unknown': '不明',
      'detail.title': 'コンボ詳細', 'detail.close': 'コンボ詳細を閉じる', 'detail.description': '説明', 'detail.demo': 'デモリンク', 'detail.download': 'コンボをダウンロード',
      'submitter.historical': '過去の投稿', 'submitter.noEmail': 'メール記録なし',
      'axis.title': 'コンボチャート', 'axis.loading': 'コンボデータを読み込み中', 'axis.iconStyle': '操作アイコン', 'axis.letters': '文字', 'axis.graphics': '図形', 'axis.experimental': '試験機能',
      'axis.startup': '開始軸', 'axis.loop': 'ループ軸', 'axis.loopNumber': 'ループ軸{number}', 'axis.full': 'コンボ全体', 'axis.role': 'キャラクター {number}',
      'axis.noActions': 'このラウンドには操作記録がありません', 'axis.allRounds': '全ラウンド', 'axis.summary': '{periods} · {steps} 操作 · {blocks} ブロック', 'axis.invalid': 'コンボJSONに軸データがありません', 'axis.failed': 'コンボチャート生成失敗：{error}', 'axis.unavailable': '軸データを読み込めません',
      'status.ready': '{count}件 · {date} 更新', 'status.indexFailed': 'インデックスの読み込みに失敗', 'status.readFailed': '{source} の読み込みに失敗：{error}', 'status.invalidIndex': 'インデックス形式が正しくありません',
      'unit.seconds': '{count}秒', 'unit.rounds': '{count}ラウンド', 'unit.actions': '{count}操作', 'unit.results': '{count}件',
      'tag.冒烟': '最高難度', 'tag.进阶': '上級', 'tag.基础': '基本', 'tag.轮椅': '簡単', 'tag.错轮': 'ローテずれ', 'tag.全局': '全体'
    },
    'ko-KR': {
      'meta.description': '제목, 캐릭터, 태그로 로테이션을 검색하고 다운로드하는 명조 콤보 커뮤니티입니다.',
      'brand.home': '코코넛 펑크 2077 홈',
      'language.label': '언어', 'language.switch': '언어 변경',
      'motion.enable': '움직이는 배경 켜기', 'motion.disable': '움직이는 배경 끄기',
      'theme.day': '라이트 모드로 전환', 'theme.night': '다크 모드로 전환',
      'submission.helpAria': '투고 안내 보기', 'submission.helpTitle': '투고 및 처리 안내',
      'submission.helpSubmit': '.wwcombo.json 파일을 첨부하여 2728756958@qq.com 으로 보내세요. 시스템이 10분마다 확인하며 형식이 올바르면 자동으로 게시합니다.',
      'submission.helpWithdraw': '철회하려면 투고한 이메일 주소로 제목에 “撤回”, 본문에 콤보 ID를 적어 보내세요. 본인 확인이 되지 않으면 수동으로 처리됩니다.',
      'submission.helpReport': '신고하려면 제목에 “投诉”, 본문에 콤보 ID를 적어 보내세요. 관리자가 확인합니다.',
      'submission.buttonTitle': '투고 주소를 복사하고 QQ 메일 열기', 'submission.button': '콤보 투고', 'submission.copied': '주소 복사됨', 'submission.copyFailed': '복사 실패',
      'hero.title': '좋은 아침, 코코넛 시티.', 'status.loading': '인덱스 불러오는 중',
      'search.titleLabel': '제목으로 검색', 'search.titlePlaceholder': '콤보 제목 검색', 'search.clearTitle': '제목 지우기',
      'field.character': '캐릭터', 'field.sort': '정렬', 'field.tag': '태그',
      'sort.version': '버전순(최신 우선)', 'sort.difficulty': '난이도순(어려운 순)',
      'results.title': '커뮤니티 콤보', 'filters.reset': '필터 초기화', 'filters.clear': '필터 지우기',
      'empty.title': '일치하는 콤보가 없습니다', 'empty.body': '다른 제목, 캐릭터 또는 태그를 시도해 보세요.',
      'error.title': '커뮤니티 인덱스를 불러올 수 없습니다', 'error.later': '잠시 후 다시 시도하세요.', 'error.reload': '다시 불러오기',
      'meta.rounds': '라운드', 'meta.duration': '길이', 'meta.actions': '동작', 'meta.updated': '업데이트', 'meta.uploader': '투고자', 'meta.firstCharacter': '시작 캐릭터', 'meta.uploadVersion': '게임 버전',
      'card.details': '상세', 'card.untitled': '이름 없는 콤보', 'card.charactersMissing': '캐릭터 미표기',
      'character.all': '모든 캐릭터', 'character.select': '캐릭터 선택', 'character.hint': '최대 3명까지 선택할 수 있으며 선택 순서는 검색에 영향을 주지 않습니다.', 'character.max': '최대 3명까지 선택할 수 있습니다.',
      'character.close': '캐릭터 선택 닫기', 'character.search': '캐릭터 검색', 'character.none': '캐릭터를 찾을 수 없습니다', 'character.selected': '{count} / {max} 선택', 'character.selectedAria': '선택됨: {names}', 'character.usedAria': '사용 캐릭터: {names}',
      'common.all': '전체', 'common.clear': '지우기', 'common.done': '완료', 'common.close': '닫기', 'common.unknown': '알 수 없음',
      'detail.title': '콤보 상세', 'detail.close': '콤보 상세 닫기', 'detail.description': '설명', 'detail.demo': '시연 링크', 'detail.download': '콤보 다운로드',
      'submitter.historical': '이전 투고', 'submitter.noEmail': '이메일 기록 없음',
      'axis.title': '콤보 차트', 'axis.loading': '콤보 데이터 불러오는 중', 'axis.iconStyle': '동작 아이콘 스타일', 'axis.letters': '문자', 'axis.graphics': '도형', 'axis.experimental': '실험 기능',
      'axis.startup': '시작 축', 'axis.loop': '루프 축', 'axis.loopNumber': '루프 축 {number}', 'axis.full': '전체 콤보', 'axis.role': '캐릭터 {number}',
      'axis.noActions': '이 라운드에는 기록된 동작이 없습니다', 'axis.allRounds': '전체 라운드', 'axis.summary': '{periods} · {steps} 동작 · {blocks} 블록', 'axis.invalid': '콤보 JSON에 축 데이터가 없습니다', 'axis.failed': '콤보 차트 생성 실패: {error}', 'axis.unavailable': '축 데이터를 불러올 수 없습니다',
      'status.ready': '{count}개 콤보 · {date} 업데이트', 'status.indexFailed': '인덱스 불러오기 실패', 'status.readFailed': '{source} 불러오기 실패: {error}', 'status.invalidIndex': '인덱스 형식이 올바르지 않습니다',
      'unit.seconds': '{count}초', 'unit.rounds': '{count}라운드', 'unit.actions': '{count}동작', 'unit.results': '{count}개 결과',
      'tag.冒烟': '최고 난도', 'tag.进阶': '상급', 'tag.基础': '기본', 'tag.轮椅': '쉬움', 'tag.错轮': '로테이션 어긋남', 'tag.全局': '전체'
    }
  };

  const moveLabels = {
    '长按闪避': ['Hold Dodge', '回避長押し', '회피 길게 누르기'], '重击': ['Heavy Attack', '重撃', '강공격'],
    '长按技能': ['Hold Skill', '共鳴スキル長押し', '공명 스킬 길게 누르기'], '长按声骸': ['Hold Echo', '音骸長押し', '에코 길게 누르기'],
    '长按解放': ['Hold Liberation', '共鳴解放長押し', '공명 해방 길게 누르기'], '长按跳跃': ['Hold Jump', 'ジャンプ長押し', '점프 길게 누르기'],
    '普攻': ['Basic Attack', '通常攻撃', '일반 공격'], '技能': ['Resonance Skill', '共鳴スキル', '공명 스킬'],
    '声骸': ['Echo Skill', '音骸スキル', '에코 스킬'], '共鸣解放': ['Resonance Liberation', '共鳴解放', '공명 해방'],
    '闪避': ['Dodge', '回避', '회피'], '跳跃': ['Jump', 'ジャンプ', '점프'], '工具': ['Utility', '探索モジュール', '도구'],
    '变奏': ['Intro Skill', '変奏スキル', '변주 스킬'], '延奏': ['Outro Skill', '終奏スキル', '반주 스킬'],
    '处决': ['Finisher', 'フィニッシュ', '처형'], '前走': ['Move Forward', '前進', '앞으로 이동']
  };

  function normalizedLanguage(value) {
    if (LANGUAGES.includes(value)) return value;
    const prefix = String(value || '').toLowerCase().slice(0, 2);
    return LANGUAGES.find((item) => item.toLowerCase().startsWith(prefix)) || '';
  }

  function initialLanguage() {
    try {
      const saved = normalizedLanguage(localStorage.getItem(STORAGE_KEY));
      if (saved) return saved;
    } catch {}
    for (const candidate of navigator.languages || [navigator.language]) {
      const detected = normalizedLanguage(candidate);
      if (detected) return detected;
    }
    return 'zh-CN';
  }

  let language = initialLanguage();

  function interpolate(template, values = {}) {
    return String(template).replace(/\{(\w+)\}/g, (match, key) => values[key] ?? match);
  }

  function t(key, values) {
    return interpolate(catalogs[language]?.[key] ?? catalogs['en-US'][key] ?? catalogs['zh-CN'][key] ?? key, values);
  }

  function apply(root = document) {
    document.documentElement.lang = language;
    for (const element of root.querySelectorAll('[data-i18n]')) element.textContent = t(element.dataset.i18n);
    for (const [attribute, datasetKey] of [['placeholder', 'i18nPlaceholder'], ['aria-label', 'i18nAriaLabel'], ['title', 'i18nTitle'], ['content', 'i18nContent']]) {
      for (const element of root.querySelectorAll(`[data-${datasetKey.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}]`)) {
        element.setAttribute(attribute, t(element.dataset[datasetKey]));
      }
    }
    const select = root.querySelector('#languageSelect');
    if (select) select.value = language;
  }

  function setLanguage(next) {
    const normalized = normalizedLanguage(next);
    if (!normalized || normalized === language) return;
    language = normalized;
    try { localStorage.setItem(STORAGE_KEY, language); } catch {}
    apply();
    window.dispatchEvent(new CustomEvent('wwcombo-languagechange', { detail: { language } }));
  }

  function localizeTag(value) {
    return t(`tag.${value}`) === `tag.${value}` ? String(value || '') : t(`tag.${value}`);
  }

  function localizeMove(value) {
    const translations = moveLabels[value];
    if (!translations || language === 'zh-CN') return value;
    return translations[{ 'en-US': 0, 'ja-JP': 1, 'ko-KR': 2 }[language]] || value;
  }

  window.wwcomboI18n = {
    get language() { return language; },
    languages: [...LANGUAGES],
    t,
    apply,
    setLanguage,
    localizeTag,
    localizeMove
  };
  apply();
})();
