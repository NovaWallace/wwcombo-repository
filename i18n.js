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
      'submission.helpSubmit': '先登记用户名和邮箱，再直接上传 .wwcombo.json 文件。投稿会进入后台审核，通过后公开。',
      'submission.helpWithdraw': '详情页可以发出撤回申请；邮箱与上传记录一致时自动撤回，否则进入人工处理。',
      'submission.helpReport': '用户名公开显示，邮箱始终脱敏；真实邮箱只用于审核和身份核对。',
      'submission.buttonTitle': '直接上传连段', 'submission.button': '上传连段',
      'profile.buttonAria': '用户资料', 'profile.guest': '登记资料', 'profile.title': '用户资料', 'profile.hint': '资料只保存在当前浏览器，投稿时发送给控制端。', 'profile.username': '用户名', 'profile.email': '邮箱', 'profile.avatar': '头像', 'profile.avatarNone': '未选择', 'profile.avatarClear': '不使用角色头像', 'profile.privacy': '公开页面显示完整用户名和脱敏邮箱，控制端保存完整邮箱用于撤回核验。', 'profile.save': '保存资料', 'profile.edit': '修改资料', 'profile.missing': '尚未登记', 'profile.required': '上传前请先登记用户名和邮箱。', 'profile.withdrawRequired': '撤回前请登记投稿时使用的用户名和邮箱。', 'profile.saved': '资料已保存在当前浏览器。',
      'upload.title': '上传连段', 'upload.hint': '文件会进入控制台审核，通过后公开。', 'upload.choose': '选择 .wwcombo.json 文件', 'upload.none': '尚未选择文件', 'upload.preview': '连段预览', 'upload.previewEmpty': '导入后会在这里预览连段图', 'upload.previewLoading': '正在生成连段预览', 'upload.previewTitle': '上传预览', 'upload.submit': '提交审核', 'upload.tooLarge': '文件不能超过 1 MB。', 'upload.sending': '正在提交，请稍候。', 'upload.success': '投稿成功，正在等待审核。', 'upload.invalidJson': '文件不是有效的 JSON。',
      'withdraw.button': '申请撤回', 'withdraw.confirm': '确认申请撤回“{title}”？', 'withdraw.done': '邮箱核验成功，连段已自动撤回。', 'withdraw.pending': '申请已提交，正在等待人工处理。', 'withdraw.failed': '撤回申请失败：{error}',
      'vote.rating': '评价', 'vote.summary': '赞 {up} · 踩 {down}', 'vote.downloadRequired': '下载后可以赞或踩，每个浏览器只能选择一次。', 'vote.ready': '已获得评价资格，只能选择一次。', 'vote.done': '你已完成评价，不能再次修改。', 'vote.failed': '评价失败：{error}',
      'hero.title': '早上好~椰之城——', 'status.loading': '正在读取索引',
      'search.titleLabel': '按标题搜索', 'search.titlePlaceholder': '搜索连段标题', 'search.clearTitle': '清空标题',
      'field.character': '角色', 'field.sort': '排序', 'field.tag': '标签',
      'sort.version': '版本顺序（新的优先）', 'sort.difficulty': '难度（从难到易）',
      'results.title': '社区连段', 'filters.reset': '重置筛选', 'filters.clear': '清除筛选',
      'empty.title': '没有找到对应连段', 'empty.body': '换一个标题、角色或标签试试。',
      'error.title': '暂时无法读取社区索引', 'error.later': '请稍后重试。', 'error.reload': '重新加载',
      'meta.rounds': '轮次', 'meta.duration': '轴长', 'meta.actions': '操作', 'meta.updated': '更新', 'meta.uploader': '上传者', 'meta.firstCharacter': '首发角色', 'meta.uploadVersion': '上传版本', 'meta.downloads': '下载次数',
      'card.details': '详情', 'card.untitled': '未命名连段', 'card.charactersMissing': '角色未标注',
      'character.all': '全部角色', 'character.select': '选择角色', 'character.hint': '最多选择 3 名角色，选择顺序不影响检索。', 'character.max': '最多只能选择 3 名角色。',
      'character.close': '关闭角色选择', 'character.search': '搜索角色', 'character.none': '没有找到角色', 'character.selected': '已选 {count} / {max}', 'character.selectedAria': '已选择 {names}', 'character.usedAria': '所用角色：{names}',
      'common.all': '全部', 'common.clear': '清空', 'common.done': '完成', 'common.close': '关闭', 'common.cancel': '取消', 'common.unknown': '未知',
      'detail.title': '连段详情', 'detail.close': '关闭连段详情', 'detail.description': '简介', 'detail.demo': '演示链接', 'detail.download': '下载连段',
      'submitter.historical': '历史投稿', 'submitter.noEmail': '未记录邮箱',
      'axis.title': '连段图', 'axis.loading': '正在读取连段数据', 'axis.iconStyle': '招式图标样式', 'axis.letters': '字母', 'axis.graphics': '图形', 'axis.importKeys': '导入按键设置', 'axis.keysImported': '已导入按键设置：{file}', 'axis.keysInvalid': '这不是有效的 WW Combo Trainer 按键设置文件。',
      'axis.startup': '启动轴', 'axis.loop': '循环轴', 'axis.loopNumber': '循环轴{number}', 'axis.full': '完整连段', 'axis.role': '角色 {number}',
      'axis.noActions': '该轮没有操作记录', 'axis.allRounds': '全部轮次', 'axis.summary': '{periods} · {steps} 步 · {blocks} 招式块', 'axis.invalid': '连段 JSON 缺少轴数据', 'axis.failed': '连段图生成失败：{error}', 'axis.unavailable': '无法读取轴数据',
      'status.ready': '{count} 个连段 · {date} 更新', 'status.indexFailed': '索引读取失败', 'status.readFailed': '读取 {source} 失败：{error}', 'status.invalidIndex': '索引格式不正确',
      'unit.seconds': '{count} 秒', 'unit.rounds': '{count} 轮', 'unit.actions': '{count} 步', 'unit.results': '{count} 个结果', 'unit.downloads': '{count} 次',
      'tag.冒烟': '冒烟', 'tag.进阶': '进阶', 'tag.基础': '基础', 'tag.轮椅': '轮椅', 'tag.错轮': '错轮', 'tag.全局': '全局'
    },
    'en-US': {
      'meta.description': 'A Wuthering Waves combo community for finding and downloading rotations by title, character, and tag.',
      'brand.home': 'Coconut Punk 2077 home',
      'language.label': 'Language', 'language.switch': 'Change language',
      'motion.enable': 'Enable animated background', 'motion.disable': 'Disable animated background',
      'theme.day': 'Switch to light mode', 'theme.night': 'Switch to dark mode',
      'submission.helpAria': 'View submission instructions', 'submission.helpTitle': 'Submissions and moderation',
      'submission.helpSubmit': 'Save a username and email, then upload a .wwcombo.json file directly. Submissions are published after moderation.',
      'submission.helpWithdraw': 'Request withdrawal from the details view. Matching emails are processed automatically; others are reviewed.',
      'submission.helpReport': 'Usernames are public and email addresses are masked. Full emails are used only for moderation and identity checks.',
      'submission.buttonTitle': 'Upload a combo directly', 'submission.button': 'Upload combo',
      'profile.buttonAria': 'User profile', 'profile.guest': 'Set profile', 'profile.title': 'User profile', 'profile.hint': 'Saved only in this browser and sent with submissions.', 'profile.username': 'Username', 'profile.email': 'Email', 'profile.avatar': 'Avatar', 'profile.avatarNone': 'Not selected', 'profile.avatarClear': 'Do not use a character avatar', 'profile.privacy': 'Your username is public; your email is masked. The control panel keeps the full email for withdrawal checks.', 'profile.save': 'Save profile', 'profile.edit': 'Edit profile', 'profile.missing': 'Not set', 'profile.required': 'Set a username and email before uploading.', 'profile.withdrawRequired': 'Enter the profile used for the submission before withdrawing.', 'profile.saved': 'Profile saved in this browser.',
      'upload.title': 'Upload combo', 'upload.hint': 'The file is published after moderation.', 'upload.choose': 'Choose a .wwcombo.json file', 'upload.none': 'No file selected', 'upload.preview': 'Combo preview', 'upload.previewEmpty': 'Import a file to preview its combo chart here', 'upload.previewLoading': 'Generating combo preview', 'upload.previewTitle': 'Upload preview', 'upload.submit': 'Submit for review', 'upload.tooLarge': 'The file must be 1 MB or smaller.', 'upload.sending': 'Submitting...', 'upload.success': 'Submitted successfully and awaiting review.', 'upload.invalidJson': 'The file is not valid JSON.',
      'withdraw.button': 'Request withdrawal', 'withdraw.confirm': 'Request withdrawal of “{title}”?', 'withdraw.done': 'Email verified. The combo was withdrawn.', 'withdraw.pending': 'Request submitted for manual review.', 'withdraw.failed': 'Withdrawal request failed: {error}',
      'vote.rating': 'Rating', 'vote.summary': '{up} up · {down} down', 'vote.downloadRequired': 'Download first to vote. Each browser can vote only once.', 'vote.ready': 'Voting unlocked. You can choose only once.', 'vote.done': 'You have voted and cannot change it.', 'vote.failed': 'Vote failed: {error}',
      'hero.title': 'Good morning, Coconut City.', 'status.loading': 'Loading index',
      'search.titleLabel': 'Search by title', 'search.titlePlaceholder': 'Search combo titles', 'search.clearTitle': 'Clear title',
      'field.character': 'Characters', 'field.sort': 'Sort', 'field.tag': 'Tags',
      'sort.version': 'Version (newest first)', 'sort.difficulty': 'Difficulty (hardest first)',
      'results.title': 'Community combos', 'filters.reset': 'Reset filters', 'filters.clear': 'Clear filters',
      'empty.title': 'No matching combos', 'empty.body': 'Try another title, character, or tag.',
      'error.title': 'The community index is unavailable', 'error.later': 'Please try again later.', 'error.reload': 'Reload',
      'meta.rounds': 'Rounds', 'meta.duration': 'Duration', 'meta.actions': 'Actions', 'meta.updated': 'Updated', 'meta.uploader': 'Uploader', 'meta.firstCharacter': 'Opening character', 'meta.uploadVersion': 'Game version', 'meta.downloads': 'Downloads',
      'card.details': 'Details', 'card.untitled': 'Untitled combo', 'card.charactersMissing': 'Characters not listed',
      'character.all': 'All characters', 'character.select': 'Select characters', 'character.hint': 'Select up to 3 characters. Selection order does not affect results.', 'character.max': 'You can select up to 3 characters.',
      'character.close': 'Close character picker', 'character.search': 'Search characters', 'character.none': 'No characters found', 'character.selected': '{count} / {max} selected', 'character.selectedAria': 'Selected: {names}', 'character.usedAria': 'Characters used: {names}',
      'common.all': 'All', 'common.clear': 'Clear', 'common.done': 'Done', 'common.close': 'Close', 'common.cancel': 'Cancel', 'common.unknown': 'Unknown',
      'detail.title': 'Combo details', 'detail.close': 'Close combo details', 'detail.description': 'Description', 'detail.demo': 'Demo link', 'detail.download': 'Download combo',
      'submitter.historical': 'Legacy submission', 'submitter.noEmail': 'Email not recorded',
      'axis.title': 'Combo chart', 'axis.loading': 'Loading combo data', 'axis.iconStyle': 'Action icon style', 'axis.letters': 'Letters', 'axis.graphics': 'Symbols', 'axis.importKeys': 'Import key settings', 'axis.keysImported': 'Key settings imported: {file}', 'axis.keysInvalid': 'This is not a valid WW Combo Trainer key settings file.',
      'axis.startup': 'Startup', 'axis.loop': 'Loop', 'axis.loopNumber': 'Loop {number}', 'axis.full': 'Full combo', 'axis.role': 'Character {number}',
      'axis.noActions': 'No actions recorded in this round', 'axis.allRounds': 'All rounds', 'axis.summary': '{periods} · {steps} actions · {blocks} blocks', 'axis.invalid': 'The combo JSON does not contain chart data', 'axis.failed': 'Could not generate the combo chart: {error}', 'axis.unavailable': 'Combo data unavailable',
      'status.ready': '{count} combos · updated {date}', 'status.indexFailed': 'Index load failed', 'status.readFailed': 'Could not load {source}: {error}', 'status.invalidIndex': 'Invalid index format',
      'unit.seconds': '{count} sec', 'unit.rounds': '{count} rounds', 'unit.actions': '{count} actions', 'unit.results': '{count} results', 'unit.downloads': '{count}',
      'tag.冒烟': 'Extreme', 'tag.进阶': 'Advanced', 'tag.基础': 'Basic', 'tag.轮椅': 'Easy', 'tag.错轮': 'Desynced', 'tag.全局': 'Global'
    },
    'ja-JP': {
      'meta.description': 'タイトル・キャラクター・タグからローテーションを検索してダウンロードできる鳴潮コンボコミュニティです。',
      'brand.home': '椰果パンク2077 ホーム',
      'language.label': '言語', 'language.switch': '言語を変更',
      'motion.enable': '動く背景を有効化', 'motion.disable': '動く背景を無効化',
      'theme.day': 'ライトモードに切り替え', 'theme.night': 'ダークモードに切り替え',
      'submission.helpAria': '投稿方法を見る', 'submission.helpTitle': '投稿と対応について',
      'submission.helpSubmit': 'ユーザー名とメールを登録し、.wwcombo.json を直接アップロードしてください。審査後に公開されます。',
      'submission.helpWithdraw': '詳細画面から取り下げを申請できます。メールが一致すれば自動処理されます。',
      'submission.helpReport': 'ユーザー名は公開され、メールは伏字になります。完全なメールは本人確認にのみ使用します。',
      'submission.buttonTitle': 'コンボを直接アップロード', 'submission.button': 'アップロード',
      'profile.buttonAria': 'ユーザー情報', 'profile.guest': '情報を登録', 'profile.title': 'ユーザー情報', 'profile.hint': 'このブラウザにのみ保存され、投稿時に送信されます。', 'profile.username': 'ユーザー名', 'profile.email': 'メール', 'profile.avatar': 'アバター', 'profile.avatarNone': '未選択', 'profile.avatarClear': 'キャラクターアバターを使用しない', 'profile.privacy': 'ユーザー名は公開、メールは伏字で表示されます。', 'profile.save': '保存', 'profile.edit': '変更', 'profile.missing': '未登録', 'profile.required': '先にユーザー名とメールを登録してください。', 'profile.withdrawRequired': '投稿時の情報を登録してください。', 'profile.saved': 'このブラウザに保存しました。',
      'upload.title': 'コンボをアップロード', 'upload.hint': '審査後に公開されます。', 'upload.choose': '.wwcombo.json を選択', 'upload.none': 'ファイル未選択', 'upload.preview': 'コンボプレビュー', 'upload.previewEmpty': 'ファイルを読み込むとコンボチャートを確認できます', 'upload.previewLoading': 'コンボプレビューを生成中', 'upload.previewTitle': 'アップロードプレビュー', 'upload.submit': '審査に送信', 'upload.tooLarge': 'ファイルは1MB以下にしてください。', 'upload.sending': '送信中です。', 'upload.success': '投稿しました。審査をお待ちください。', 'upload.invalidJson': '有効なJSONではありません。',
      'withdraw.button': '取り下げ申請', 'withdraw.confirm': '「{title}」を取り下げますか？', 'withdraw.done': 'メール確認済み。取り下げました。', 'withdraw.pending': '手動審査に送信しました。', 'withdraw.failed': '申請失敗：{error}',
      'vote.rating': '評価', 'vote.summary': '賛成 {up} · 反対 {down}', 'vote.downloadRequired': 'ダウンロード後に1回だけ評価できます。', 'vote.ready': '評価できます。選択は1回だけです。', 'vote.done': '評価済みです。変更できません。', 'vote.failed': '評価失敗：{error}',
      'hero.title': 'おはよう、椰子の街へ。', 'status.loading': 'インデックスを読み込み中',
      'search.titleLabel': 'タイトルで検索', 'search.titlePlaceholder': 'コンボタイトルを検索', 'search.clearTitle': 'タイトルを消去',
      'field.character': 'キャラクター', 'field.sort': '並び順', 'field.tag': 'タグ',
      'sort.version': 'バージョン（新しい順）', 'sort.difficulty': '難易度（高い順）',
      'results.title': 'コミュニティコンボ', 'filters.reset': 'フィルターをリセット', 'filters.clear': 'フィルターを解除',
      'empty.title': '該当するコンボがありません', 'empty.body': 'タイトル、キャラクター、タグを変えてみてください。',
      'error.title': 'コミュニティインデックスを取得できません', 'error.later': 'しばらくしてから再試行してください。', 'error.reload': '再読み込み',
      'meta.rounds': 'ラウンド', 'meta.duration': '長さ', 'meta.actions': '操作', 'meta.updated': '更新日', 'meta.uploader': '投稿者', 'meta.firstCharacter': '開始キャラ', 'meta.uploadVersion': 'ゲーム版', 'meta.downloads': 'ダウンロード数',
      'card.details': '詳細', 'card.untitled': '無題のコンボ', 'card.charactersMissing': 'キャラクター未設定',
      'character.all': 'すべてのキャラクター', 'character.select': 'キャラクターを選択', 'character.hint': '最大3人まで選択できます。選択順は検索に影響しません。', 'character.max': '選択できるのは最大3人です。',
      'character.close': 'キャラクター選択を閉じる', 'character.search': 'キャラクターを検索', 'character.none': 'キャラクターが見つかりません', 'character.selected': '{count} / {max} 選択済み', 'character.selectedAria': '選択中：{names}', 'character.usedAria': '使用キャラクター：{names}',
      'common.all': 'すべて', 'common.clear': 'クリア', 'common.done': '完了', 'common.close': '閉じる', 'common.cancel': 'キャンセル', 'common.unknown': '不明',
      'detail.title': 'コンボ詳細', 'detail.close': 'コンボ詳細を閉じる', 'detail.description': '説明', 'detail.demo': 'デモリンク', 'detail.download': 'コンボをダウンロード',
      'submitter.historical': '過去の投稿', 'submitter.noEmail': 'メール記録なし',
      'axis.title': 'コンボチャート', 'axis.loading': 'コンボデータを読み込み中', 'axis.iconStyle': '操作アイコン', 'axis.letters': '文字', 'axis.graphics': '図形', 'axis.importKeys': 'キー設定を読み込む', 'axis.keysImported': 'キー設定を読み込みました：{file}', 'axis.keysInvalid': '有効な WW Combo Trainer キー設定ファイルではありません。',
      'axis.startup': '開始軸', 'axis.loop': 'ループ軸', 'axis.loopNumber': 'ループ軸{number}', 'axis.full': 'コンボ全体', 'axis.role': 'キャラクター {number}',
      'axis.noActions': 'このラウンドには操作記録がありません', 'axis.allRounds': '全ラウンド', 'axis.summary': '{periods} · {steps} 操作 · {blocks} ブロック', 'axis.invalid': 'コンボJSONに軸データがありません', 'axis.failed': 'コンボチャート生成失敗：{error}', 'axis.unavailable': '軸データを読み込めません',
      'status.ready': '{count}件 · {date} 更新', 'status.indexFailed': 'インデックスの読み込みに失敗', 'status.readFailed': '{source} の読み込みに失敗：{error}', 'status.invalidIndex': 'インデックス形式が正しくありません',
      'unit.seconds': '{count}秒', 'unit.rounds': '{count}ラウンド', 'unit.actions': '{count}操作', 'unit.results': '{count}件', 'unit.downloads': '{count}回',
      'tag.冒烟': '最高難度', 'tag.进阶': '上級', 'tag.基础': '基本', 'tag.轮椅': '簡単', 'tag.错轮': 'ローテずれ', 'tag.全局': '全体'
    },
    'ko-KR': {
      'meta.description': '제목, 캐릭터, 태그로 로테이션을 검색하고 다운로드하는 명조 콤보 커뮤니티입니다.',
      'brand.home': '코코넛 펑크 2077 홈',
      'language.label': '언어', 'language.switch': '언어 변경',
      'motion.enable': '움직이는 배경 켜기', 'motion.disable': '움직이는 배경 끄기',
      'theme.day': '라이트 모드로 전환', 'theme.night': '다크 모드로 전환',
      'submission.helpAria': '투고 안내 보기', 'submission.helpTitle': '투고 및 처리 안내',
      'submission.helpSubmit': '사용자 이름과 이메일을 등록한 뒤 .wwcombo.json 파일을 직접 업로드하세요. 검토 후 공개됩니다.',
      'submission.helpWithdraw': '상세 화면에서 철회를 신청할 수 있습니다. 이메일이 일치하면 자동 처리됩니다.',
      'submission.helpReport': '사용자 이름은 공개되고 이메일은 마스킹됩니다. 전체 이메일은 본인 확인에만 사용됩니다.',
      'submission.buttonTitle': '콤보 직접 업로드', 'submission.button': '콤보 업로드',
      'profile.buttonAria': '사용자 정보', 'profile.guest': '정보 등록', 'profile.title': '사용자 정보', 'profile.hint': '현재 브라우저에만 저장되며 투고 시 전송됩니다.', 'profile.username': '사용자 이름', 'profile.email': '이메일', 'profile.avatar': '아바타', 'profile.avatarNone': '선택 안 함', 'profile.avatarClear': '캐릭터 아바타 사용 안 함', 'profile.privacy': '사용자 이름은 공개되고 이메일은 마스킹됩니다.', 'profile.save': '저장', 'profile.edit': '수정', 'profile.missing': '미등록', 'profile.required': '먼저 사용자 이름과 이메일을 등록하세요.', 'profile.withdrawRequired': '투고할 때 사용한 정보를 등록하세요.', 'profile.saved': '이 브라우저에 저장했습니다.',
      'upload.title': '콤보 업로드', 'upload.hint': '검토 후 공개됩니다.', 'upload.choose': '.wwcombo.json 파일 선택', 'upload.none': '선택한 파일 없음', 'upload.preview': '콤보 미리보기', 'upload.previewEmpty': '파일을 불러오면 콤보 차트를 확인할 수 있습니다', 'upload.previewLoading': '콤보 미리보기 생성 중', 'upload.previewTitle': '업로드 미리보기', 'upload.submit': '검토 요청', 'upload.tooLarge': '파일은 1MB 이하여야 합니다.', 'upload.sending': '전송 중입니다.', 'upload.success': '투고 완료. 검토를 기다려 주세요.', 'upload.invalidJson': '올바른 JSON 파일이 아닙니다.',
      'withdraw.button': '철회 신청', 'withdraw.confirm': '“{title}” 철회를 신청할까요?', 'withdraw.done': '이메일 확인 완료. 철회되었습니다.', 'withdraw.pending': '수동 검토 요청이 등록되었습니다.', 'withdraw.failed': '철회 신청 실패: {error}',
      'vote.rating': '평가', 'vote.summary': '추천 {up} · 비추천 {down}', 'vote.downloadRequired': '다운로드 후 한 번만 평가할 수 있습니다.', 'vote.ready': '평가할 수 있습니다. 한 번만 선택할 수 있습니다.', 'vote.done': '이미 평가했으며 변경할 수 없습니다.', 'vote.failed': '평가 실패: {error}',
      'hero.title': '좋은 아침, 코코넛 시티.', 'status.loading': '인덱스 불러오는 중',
      'search.titleLabel': '제목으로 검색', 'search.titlePlaceholder': '콤보 제목 검색', 'search.clearTitle': '제목 지우기',
      'field.character': '캐릭터', 'field.sort': '정렬', 'field.tag': '태그',
      'sort.version': '버전순(최신 우선)', 'sort.difficulty': '난이도순(어려운 순)',
      'results.title': '커뮤니티 콤보', 'filters.reset': '필터 초기화', 'filters.clear': '필터 지우기',
      'empty.title': '일치하는 콤보가 없습니다', 'empty.body': '다른 제목, 캐릭터 또는 태그를 시도해 보세요.',
      'error.title': '커뮤니티 인덱스를 불러올 수 없습니다', 'error.later': '잠시 후 다시 시도하세요.', 'error.reload': '다시 불러오기',
      'meta.rounds': '라운드', 'meta.duration': '길이', 'meta.actions': '동작', 'meta.updated': '업데이트', 'meta.uploader': '투고자', 'meta.firstCharacter': '시작 캐릭터', 'meta.uploadVersion': '게임 버전', 'meta.downloads': '다운로드 수',
      'card.details': '상세', 'card.untitled': '이름 없는 콤보', 'card.charactersMissing': '캐릭터 미표기',
      'character.all': '모든 캐릭터', 'character.select': '캐릭터 선택', 'character.hint': '최대 3명까지 선택할 수 있으며 선택 순서는 검색에 영향을 주지 않습니다.', 'character.max': '최대 3명까지 선택할 수 있습니다.',
      'character.close': '캐릭터 선택 닫기', 'character.search': '캐릭터 검색', 'character.none': '캐릭터를 찾을 수 없습니다', 'character.selected': '{count} / {max} 선택', 'character.selectedAria': '선택됨: {names}', 'character.usedAria': '사용 캐릭터: {names}',
      'common.all': '전체', 'common.clear': '지우기', 'common.done': '완료', 'common.close': '닫기', 'common.cancel': '취소', 'common.unknown': '알 수 없음',
      'detail.title': '콤보 상세', 'detail.close': '콤보 상세 닫기', 'detail.description': '설명', 'detail.demo': '시연 링크', 'detail.download': '콤보 다운로드',
      'submitter.historical': '이전 투고', 'submitter.noEmail': '이메일 기록 없음',
      'axis.title': '콤보 차트', 'axis.loading': '콤보 데이터 불러오는 중', 'axis.iconStyle': '동작 아이콘 스타일', 'axis.letters': '문자', 'axis.graphics': '도형', 'axis.importKeys': '키 설정 가져오기', 'axis.keysImported': '키 설정을 가져왔습니다: {file}', 'axis.keysInvalid': '올바른 WW Combo Trainer 키 설정 파일이 아닙니다.',
      'axis.startup': '시작 축', 'axis.loop': '루프 축', 'axis.loopNumber': '루프 축 {number}', 'axis.full': '전체 콤보', 'axis.role': '캐릭터 {number}',
      'axis.noActions': '이 라운드에는 기록된 동작이 없습니다', 'axis.allRounds': '전체 라운드', 'axis.summary': '{periods} · {steps} 동작 · {blocks} 블록', 'axis.invalid': '콤보 JSON에 축 데이터가 없습니다', 'axis.failed': '콤보 차트 생성 실패: {error}', 'axis.unavailable': '축 데이터를 불러올 수 없습니다',
      'status.ready': '{count}개 콤보 · {date} 업데이트', 'status.indexFailed': '인덱스 불러오기 실패', 'status.readFailed': '{source} 불러오기 실패: {error}', 'status.invalidIndex': '인덱스 형식이 올바르지 않습니다',
      'unit.seconds': '{count}초', 'unit.rounds': '{count}라운드', 'unit.actions': '{count}동작', 'unit.results': '{count}개 결과', 'unit.downloads': '{count}회',
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
