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
      'upload.title': '上传连段', 'upload.hint': '文件会进入控制台审核，通过后公开。', 'upload.choose': '选择 .wwcombo.json 文件', 'upload.none': '尚未选择文件', 'upload.preview': '连段预览', 'upload.previewEmpty': '导入后会在这里预览连段图', 'upload.previewLoading': '正在生成连段预览', 'upload.previewTitle': '上传预览', 'upload.submit': '提交审核', 'upload.tooLarge': '文件不能超过 1 MB。', 'upload.sending': '正在提交，请稍候。', 'upload.success': '投稿成功，正在等待审核。', 'upload.autoPublished': '预审核通过，连段已自动发布。', 'upload.invalidJson': '文件不是有效的 JSON。',
      'withdraw.button': '申请撤回', 'withdraw.confirm': '确认申请撤回“{title}”？', 'withdraw.done': '邮箱核验成功，连段已自动撤回。', 'withdraw.pending': '申请已提交，正在等待人工处理。', 'withdraw.failed': '撤回申请失败：{error}',
      'vote.rating': '评价与反馈', 'vote.summary': '赞 {up}', 'vote.downloadRequired': '下载后可以点赞或发送一次匿名反馈。', 'vote.ready': '已获得点赞和反馈资格；每项功能对同一连段只能使用一次。', 'vote.done': '你已点赞并发送过反馈。', 'vote.failed': '点赞失败：{error}',
      'feedback.button': '反馈', 'feedback.sent': '已反馈', 'feedback.title': '向上传者反馈', 'feedback.hint': '反馈会匿名发送到上传者邮箱，每个浏览器对同一连段只能发送一次。', 'feedback.reason': '反馈理由', 'feedback.placeholder': '请具体说明问题或建议', 'feedback.submit': '发送反馈', 'feedback.sending': '正在发送。', 'feedback.tooShort': '反馈理由至少需要 5 个字符。', 'feedback.success': '反馈已匿名发送给上传者。', 'feedback.failed': '反馈发送失败：{error}', 'feedback.downloadRequired': '请先下载该连段，再向上传者发送反馈。', 'feedback.ready': '你已点赞，仍可发送一次匿名反馈。', 'feedback.sentHint': '你已向该连段的上传者发送过反馈。',
      'hero.title': '早上好~椰之城——', 'status.loading': '正在读取索引',
      'search.titleLabel': '按标题搜索', 'search.titlePlaceholder': '搜索连段标题', 'search.clearTitle': '清空标题',
      'field.character': '角色', 'field.sort': '排序', 'field.tag': '标签',
      'sort.version': '版本顺序（新的优先）', 'sort.difficulty': '难度（从难到易）',
      'results.title': '社区连段', 'filters.reset': '重置筛选', 'filters.clear': '清除筛选',
      'plaza.tabsAria': '社区内容', 'plaza.combos': '社区连段', 'plaza.commissions': '委托广场',
      'commission.create': '发布委托', 'commission.createHint': '说明想要的角色与流程，其他用户可以提交方案。', 'commission.title': '委托标题', 'commission.characters': '需要角色（最多 3 名）', 'commission.characterHint': '至少选择 1 名角色。', 'commission.characterCount': '已选 {count} / {max}', 'commission.tag': '委托标签', 'commission.description': '流程具体描述', 'commission.publish': '发布委托', 'commission.publishing': '正在发布委托。', 'commission.characterRequired': '请至少选择 1 名角色。',
      'commission.searchPlaceholder': '搜索委托标题', 'commission.results': '{count} 个委托', 'commission.empty': '没有找到对应委托', 'commission.emptyHint': '换一个标题或角色试试。', 'commission.open': '征集中', 'commission.completed': '已完成', 'commission.untitled': '未命名委托',
      'commission.interestCount': '+1 {count}', 'commission.responseCount': '{count} 个方案', 'commission.interested': '已 +1', 'commission.interestFailed': '+1 失败：{error}', 'commission.detail': '委托详情', 'commission.owner': '委托人', 'commission.interest': '我也想要 +1', 'commission.uploadResponse': '上传方案', 'commission.adoptNote': '采纳后，方案会自动进入连段社区审核流程。', 'commission.responses': '收到的方案', 'commission.noResponses': '还没有人提交方案。',
      'commission.interestLabel': '想要人数', 'commission.responseLabel': '方案数量', 'commission.created': '发布时间', 'commission.uploadHint': '方案会先保存到当前委托；被委托人采纳后自动进入社区审核。', 'commission.submitResponse': '提交方案', 'commission.responseSuccess': '方案已提交，委托人会收到邮件提醒。', 'commission.previewResponse': '预览', 'commission.downloadFailed': '下载方案失败：{error}', 'commission.adopt': '采纳', 'commission.adoptConfirm': '确认采纳“{title}”？方案将自动进入连段社区审核流程。', 'commission.adoptFailed': '采纳失败：{error}', 'commission.accepted': '已采纳', 'commission.withdraw': '撤回委托', 'commission.withdrawConfirm': '确认撤回委托“{title}”？收到的方案也会一并删除，此操作无法恢复。', 'commission.withdrawDone': '委托已撤回。', 'commission.withdrawFailed': '撤回委托失败：{error}',
      'commission.loading': '正在读取委托广场', 'commission.ready': '{count} 个委托 · {date} 更新', 'commission.loadFailed': '委托广场读取失败', 'commission.loadError': '读取委托广场失败：{error}',
      'empty.title': '没有找到对应连段', 'empty.body': '换一个标题、角色或标签试试。',
      'error.title': '暂时无法读取社区索引', 'error.later': '请稍后重试。', 'error.reload': '重新加载',
      'meta.rounds': '轮次', 'meta.duration': '轴长', 'meta.actions': '操作', 'meta.loopSwitches': '循环轴切人', 'meta.updated': '更新', 'meta.uploader': '上传者', 'meta.firstCharacter': '首发角色', 'meta.uploadVersion': '上传版本', 'meta.downloads': '下载次数',
      'card.details': '详情', 'card.untitled': '未命名连段', 'card.charactersMissing': '角色未标注',
      'character.all': '全部角色', 'character.select': '选择角色', 'character.hint': '最多选择 3 名角色，选择顺序不影响检索。', 'character.max': '最多只能选择 3 名角色。',
      'character.close': '关闭角色选择', 'character.search': '搜索角色', 'character.none': '没有找到角色', 'character.selected': '已选 {count} / {max}', 'character.selectedAria': '已选择 {names}', 'character.usedAria': '所用角色：{names}',
      'common.all': '全部', 'common.clear': '清空', 'common.done': '完成', 'common.close': '关闭', 'common.cancel': '取消', 'common.unknown': '未知', 'dialog.notice': '提示', 'dialog.confirm': '确认操作',
      'detail.title': '连段详情', 'detail.close': '关闭连段详情', 'detail.description': '简介', 'detail.demo': '演示链接', 'detail.download': '下载连段', 'detail.importClient': '导入到客户端', 'detail.importedClient': '已导入客户端', 'detail.importFailed': '导入失败：{error}',
      'submitter.historical': '历史投稿', 'submitter.noEmail': '未记录邮箱',
      'axis.title': '连段图', 'axis.loading': '正在读取连段数据', 'axis.iconStyle': '招式图标样式', 'axis.letters': '字母', 'axis.graphics': '图形', 'axis.importKeys': '导入按键设置', 'axis.keysImported': '已导入按键设置：{file}', 'axis.keysInvalid': '这不是有效的 WW Combo Trainer 按键设置文件。',
      'axis.startup': '启动轴', 'axis.loop': '循环轴', 'axis.loopNumber': '循环轴{number}', 'axis.full': '完整连段', 'axis.role': '角色 {number}',
      'axis.noActions': '该轮没有操作记录', 'axis.allRounds': '全部轮次', 'axis.summary': '{periods} · {steps} 步 · {blocks} 招式块', 'axis.invalid': '连段 JSON 缺少轴数据', 'axis.failed': '连段图生成失败：{error}', 'axis.unavailable': '无法读取轴数据',
      'status.ready': '{count} 个连段 · {date} 更新', 'status.indexFailed': '索引读取失败', 'status.readFailed': '读取 {source} 失败：{error}', 'status.invalidIndex': '索引格式不正确',
      'unit.seconds': '{count} 秒', 'unit.rounds': '{count} 轮', 'unit.actions': '{count} 步', 'unit.switches': '{count} 次', 'unit.results': '{count} 个结果', 'unit.downloads': '{count} 次',
      'tag.冒烟': '冒烟', 'tag.进阶': '进阶', 'tag.标准': '标准', 'tag.基础': '基础', 'tag.轮椅': '轮椅', 'tag.错轮': '错轮', 'tag.全局': '全局'
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
      'upload.title': 'Upload combo', 'upload.hint': 'The file is published after moderation.', 'upload.choose': 'Choose a .wwcombo.json file', 'upload.none': 'No file selected', 'upload.preview': 'Combo preview', 'upload.previewEmpty': 'Import a file to preview its combo chart here', 'upload.previewLoading': 'Generating combo preview', 'upload.previewTitle': 'Upload preview', 'upload.submit': 'Submit for review', 'upload.tooLarge': 'The file must be 1 MB or smaller.', 'upload.sending': 'Submitting...', 'upload.success': 'Submitted successfully and awaiting review.', 'upload.autoPublished': 'Preflight passed and the combo was published automatically.', 'upload.invalidJson': 'The file is not valid JSON.',
      'withdraw.button': 'Request withdrawal', 'withdraw.confirm': 'Request withdrawal of “{title}”?', 'withdraw.done': 'Email verified. The combo was withdrawn.', 'withdraw.pending': 'Request submitted for manual review.', 'withdraw.failed': 'Withdrawal request failed: {error}',
      'vote.rating': 'Rating and feedback', 'vote.summary': '{up} likes', 'vote.downloadRequired': 'Download first to like the combo or send one anonymous feedback message.', 'vote.ready': 'Like and feedback are unlocked. Each can be used once per combo.', 'vote.done': 'You have liked this combo and sent feedback.', 'vote.failed': 'Like failed: {error}',
      'feedback.button': 'Feedback', 'feedback.sent': 'Sent', 'feedback.title': 'Send feedback to the uploader', 'feedback.hint': 'Your message is emailed anonymously to the uploader. Each browser can send one message per combo.', 'feedback.reason': 'Reason', 'feedback.placeholder': 'Describe the issue or suggestion clearly', 'feedback.submit': 'Send feedback', 'feedback.sending': 'Sending...', 'feedback.tooShort': 'Feedback must be at least 5 characters.', 'feedback.success': 'Your anonymous feedback was sent to the uploader.', 'feedback.failed': 'Could not send feedback: {error}', 'feedback.downloadRequired': 'Download this combo before sending feedback to its uploader.', 'feedback.ready': 'You have liked this combo and can still send one anonymous feedback message.', 'feedback.sentHint': 'You have already sent feedback to this uploader for this combo.',
      'hero.title': 'Good morning, Coconut City.', 'status.loading': 'Loading index',
      'search.titleLabel': 'Search by title', 'search.titlePlaceholder': 'Search combo titles', 'search.clearTitle': 'Clear title',
      'field.character': 'Characters', 'field.sort': 'Sort', 'field.tag': 'Tags',
      'sort.version': 'Version (newest first)', 'sort.difficulty': 'Difficulty (hardest first)',
      'results.title': 'Community combos', 'filters.reset': 'Reset filters', 'filters.clear': 'Clear filters',
      'plaza.tabsAria': 'Community content', 'plaza.combos': 'Community combos', 'plaza.commissions': 'Commission plaza',
      'commission.create': 'Post commission', 'commission.createHint': 'Describe the characters and rotation you need so others can submit solutions.', 'commission.title': 'Commission title', 'commission.characters': 'Required characters (up to 3)', 'commission.characterHint': 'Select at least one character.', 'commission.characterCount': '{count} / {max} selected', 'commission.tag': 'Commission tag', 'commission.description': 'Detailed rotation requirements', 'commission.publish': 'Post commission', 'commission.publishing': 'Posting commission...', 'commission.characterRequired': 'Select at least one character.',
      'commission.searchPlaceholder': 'Search commission titles', 'commission.results': '{count} commissions', 'commission.empty': 'No matching commissions', 'commission.emptyHint': 'Try another title or character.', 'commission.open': 'Open', 'commission.completed': 'Completed', 'commission.untitled': 'Untitled commission',
      'commission.interestCount': '+1 {count}', 'commission.responseCount': '{count} solutions', 'commission.interested': 'Added +1', 'commission.interestFailed': 'Could not add +1: {error}', 'commission.detail': 'Commission details', 'commission.owner': 'Owner', 'commission.interest': 'I want this too +1', 'commission.uploadResponse': 'Upload solution', 'commission.adoptNote': 'Adopted solutions automatically enter community moderation.', 'commission.responses': 'Submitted solutions', 'commission.noResponses': 'No solutions have been submitted yet.',
      'commission.interestLabel': 'Interested', 'commission.responseLabel': 'Solutions', 'commission.created': 'Posted', 'commission.uploadHint': 'The solution stays with this commission until the owner adopts it, then it enters community moderation.', 'commission.submitResponse': 'Submit solution', 'commission.responseSuccess': 'Solution submitted. The owner will receive an email notification.', 'commission.previewResponse': 'Preview', 'commission.downloadFailed': 'Could not download solution: {error}', 'commission.adopt': 'Adopt', 'commission.adoptConfirm': 'Adopt “{title}”? It will automatically enter community moderation.', 'commission.adoptFailed': 'Adoption failed: {error}', 'commission.accepted': 'Accepted', 'commission.withdraw': 'Withdraw commission', 'commission.withdrawConfirm': 'Withdraw “{title}”? All submitted solutions will also be deleted. This cannot be undone.', 'commission.withdrawDone': 'Commission withdrawn.', 'commission.withdrawFailed': 'Could not withdraw commission: {error}',
      'commission.loading': 'Loading commission plaza', 'commission.ready': '{count} commissions · updated {date}', 'commission.loadFailed': 'Commission plaza unavailable', 'commission.loadError': 'Could not load commission plaza: {error}',
      'empty.title': 'No matching combos', 'empty.body': 'Try another title, character, or tag.',
      'error.title': 'The community index is unavailable', 'error.later': 'Please try again later.', 'error.reload': 'Reload',
      'meta.rounds': 'Rounds', 'meta.duration': 'Duration', 'meta.actions': 'Actions', 'meta.loopSwitches': 'Loop switches', 'meta.updated': 'Updated', 'meta.uploader': 'Uploader', 'meta.firstCharacter': 'Opening character', 'meta.uploadVersion': 'Game version', 'meta.downloads': 'Downloads',
      'card.details': 'Details', 'card.untitled': 'Untitled combo', 'card.charactersMissing': 'Characters not listed',
      'character.all': 'All characters', 'character.select': 'Select characters', 'character.hint': 'Select up to 3 characters. Selection order does not affect results.', 'character.max': 'You can select up to 3 characters.',
      'character.close': 'Close character picker', 'character.search': 'Search characters', 'character.none': 'No characters found', 'character.selected': '{count} / {max} selected', 'character.selectedAria': 'Selected: {names}', 'character.usedAria': 'Characters used: {names}',
      'common.all': 'All', 'common.clear': 'Clear', 'common.done': 'Done', 'common.close': 'Close', 'common.cancel': 'Cancel', 'common.unknown': 'Unknown', 'dialog.notice': 'Notice', 'dialog.confirm': 'Confirm action',
      'detail.title': 'Combo details', 'detail.close': 'Close combo details', 'detail.description': 'Description', 'detail.demo': 'Demo link', 'detail.download': 'Download combo', 'detail.importClient': 'Import into client', 'detail.importedClient': 'Imported into client', 'detail.importFailed': 'Import failed: {error}',
      'submitter.historical': 'Legacy submission', 'submitter.noEmail': 'Email not recorded',
      'axis.title': 'Combo chart', 'axis.loading': 'Loading combo data', 'axis.iconStyle': 'Action icon style', 'axis.letters': 'Letters', 'axis.graphics': 'Symbols', 'axis.importKeys': 'Import key settings', 'axis.keysImported': 'Key settings imported: {file}', 'axis.keysInvalid': 'This is not a valid WW Combo Trainer key settings file.',
      'axis.startup': 'Startup', 'axis.loop': 'Loop', 'axis.loopNumber': 'Loop {number}', 'axis.full': 'Full combo', 'axis.role': 'Character {number}',
      'axis.noActions': 'No actions recorded in this round', 'axis.allRounds': 'All rounds', 'axis.summary': '{periods} · {steps} actions · {blocks} blocks', 'axis.invalid': 'The combo JSON does not contain chart data', 'axis.failed': 'Could not generate the combo chart: {error}', 'axis.unavailable': 'Combo data unavailable',
      'status.ready': '{count} combos · updated {date}', 'status.indexFailed': 'Index load failed', 'status.readFailed': 'Could not load {source}: {error}', 'status.invalidIndex': 'Invalid index format',
      'unit.seconds': '{count} sec', 'unit.rounds': '{count} rounds', 'unit.actions': '{count} actions', 'unit.switches': '{count}', 'unit.results': '{count} results', 'unit.downloads': '{count}',
      'tag.冒烟': 'Extreme', 'tag.进阶': 'Advanced', 'tag.标准': 'Standard', 'tag.基础': 'Basic', 'tag.轮椅': 'Easy', 'tag.错轮': 'Desynced', 'tag.全局': 'Global'
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
      'upload.title': 'コンボをアップロード', 'upload.hint': '審査後に公開されます。', 'upload.choose': '.wwcombo.json を選択', 'upload.none': 'ファイル未選択', 'upload.preview': 'コンボプレビュー', 'upload.previewEmpty': 'ファイルを読み込むとコンボチャートを確認できます', 'upload.previewLoading': 'コンボプレビューを生成中', 'upload.previewTitle': 'アップロードプレビュー', 'upload.submit': '審査に送信', 'upload.tooLarge': 'ファイルは1MB以下にしてください。', 'upload.sending': '送信中です。', 'upload.success': '投稿しました。審査をお待ちください。', 'upload.autoPublished': '事前審査に合格し、自動公開されました。', 'upload.invalidJson': '有効なJSONではありません。',
      'withdraw.button': '取り下げ申請', 'withdraw.confirm': '「{title}」を取り下げますか？', 'withdraw.done': 'メール確認済み。取り下げました。', 'withdraw.pending': '手動審査に送信しました。', 'withdraw.failed': '申請失敗：{error}',
      'vote.rating': '評価とフィードバック', 'vote.summary': 'いいね {up}', 'vote.downloadRequired': 'ダウンロード後、いいねまたは匿名フィードバックを1回送信できます。', 'vote.ready': 'いいねとフィードバックが利用できます。それぞれ1回だけです。', 'vote.done': 'いいねとフィードバックを送信済みです。', 'vote.failed': 'いいねに失敗しました：{error}',
      'feedback.button': 'フィードバック', 'feedback.sent': '送信済み', 'feedback.title': '投稿者へフィードバック', 'feedback.hint': '内容は匿名で投稿者のメールへ送信されます。同じコンボにはブラウザごとに1回だけ送信できます。', 'feedback.reason': '内容', 'feedback.placeholder': '問題点や提案を具体的に入力してください', 'feedback.submit': '送信', 'feedback.sending': '送信中です。', 'feedback.tooShort': '5文字以上入力してください。', 'feedback.success': '匿名フィードバックを投稿者へ送信しました。', 'feedback.failed': '送信失敗：{error}', 'feedback.downloadRequired': '先にこのコンボをダウンロードしてください。', 'feedback.ready': 'いいね済みです。匿名フィードバックはまだ1回送信できます。', 'feedback.sentHint': 'このコンボにはすでにフィードバックを送信しています。',
      'hero.title': 'おはよう、椰子の街へ。', 'status.loading': 'インデックスを読み込み中',
      'search.titleLabel': 'タイトルで検索', 'search.titlePlaceholder': 'コンボタイトルを検索', 'search.clearTitle': 'タイトルを消去',
      'field.character': 'キャラクター', 'field.sort': '並び順', 'field.tag': 'タグ',
      'sort.version': 'バージョン（新しい順）', 'sort.difficulty': '難易度（高い順）',
      'results.title': 'コミュニティコンボ', 'filters.reset': 'フィルターをリセット', 'filters.clear': 'フィルターを解除',
      'plaza.tabsAria': 'コミュニティ内容', 'plaza.combos': 'コミュニティコンボ', 'plaza.commissions': '依頼広場',
      'commission.create': '依頼を投稿', 'commission.createHint': '必要なキャラクターと手順を説明すると、ほかのユーザーが案を投稿できます。', 'commission.title': '依頼タイトル', 'commission.characters': '必要キャラクター（最大3人）', 'commission.characterHint': '1人以上選択してください。', 'commission.characterCount': '{count} / {max} 選択済み', 'commission.tag': '依頼タグ', 'commission.description': '手順の詳細', 'commission.publish': '依頼を投稿', 'commission.publishing': '投稿中です。', 'commission.characterRequired': '1人以上選択してください。',
      'commission.searchPlaceholder': '依頼タイトルを検索', 'commission.results': '{count} 件の依頼', 'commission.empty': '該当する依頼がありません', 'commission.emptyHint': 'タイトルまたはキャラクターを変えてください。', 'commission.open': '募集中', 'commission.completed': '完了', 'commission.untitled': '無題の依頼',
      'commission.interestCount': '+1 {count}', 'commission.responseCount': '{count} 件の案', 'commission.interested': '+1 済み', 'commission.interestFailed': '+1 に失敗しました：{error}', 'commission.detail': '依頼詳細', 'commission.owner': '依頼者', 'commission.interest': '自分も欲しい +1', 'commission.uploadResponse': '案を投稿', 'commission.adoptNote': '採用された案は自動的にコミュニティ審査へ送られます。', 'commission.responses': '投稿された案', 'commission.noResponses': 'まだ案は投稿されていません。',
      'commission.interestLabel': '希望人数', 'commission.responseLabel': '案の数', 'commission.created': '投稿日', 'commission.uploadHint': '案は依頼に保存され、依頼者が採用するとコミュニティ審査へ送られます。', 'commission.submitResponse': '案を送信', 'commission.responseSuccess': '案を送信しました。依頼者にメールで通知されます。', 'commission.previewResponse': 'プレビュー', 'commission.downloadFailed': '案のダウンロードに失敗：{error}', 'commission.adopt': '採用', 'commission.adoptConfirm': '「{title}」を採用しますか？コミュニティ審査へ自動送信されます。', 'commission.adoptFailed': '採用失敗：{error}', 'commission.accepted': '採用済み', 'commission.withdraw': '依頼を取り下げる', 'commission.withdrawConfirm': '「{title}」を取り下げますか？投稿された案も削除され、元に戻せません。', 'commission.withdrawDone': '依頼を取り下げました。', 'commission.withdrawFailed': '依頼の取り下げに失敗：{error}',
      'commission.loading': '依頼広場を読み込み中', 'commission.ready': '{count} 件 · {date} 更新', 'commission.loadFailed': '依頼広場を読み込めません', 'commission.loadError': '依頼広場の読み込み失敗：{error}',
      'empty.title': '該当するコンボがありません', 'empty.body': 'タイトル、キャラクター、タグを変えてみてください。',
      'error.title': 'コミュニティインデックスを取得できません', 'error.later': 'しばらくしてから再試行してください。', 'error.reload': '再読み込み',
      'meta.rounds': 'ラウンド', 'meta.duration': '長さ', 'meta.actions': '操作', 'meta.loopSwitches': 'ループ切替', 'meta.updated': '更新日', 'meta.uploader': '投稿者', 'meta.firstCharacter': '開始キャラ', 'meta.uploadVersion': 'ゲーム版', 'meta.downloads': 'ダウンロード数',
      'card.details': '詳細', 'card.untitled': '無題のコンボ', 'card.charactersMissing': 'キャラクター未設定',
      'character.all': 'すべてのキャラクター', 'character.select': 'キャラクターを選択', 'character.hint': '最大3人まで選択できます。選択順は検索に影響しません。', 'character.max': '選択できるのは最大3人です。',
      'character.close': 'キャラクター選択を閉じる', 'character.search': 'キャラクターを検索', 'character.none': 'キャラクターが見つかりません', 'character.selected': '{count} / {max} 選択済み', 'character.selectedAria': '選択中：{names}', 'character.usedAria': '使用キャラクター：{names}',
      'common.all': 'すべて', 'common.clear': 'クリア', 'common.done': '完了', 'common.close': '閉じる', 'common.cancel': 'キャンセル', 'common.unknown': '不明', 'dialog.notice': 'お知らせ', 'dialog.confirm': '操作の確認',
      'detail.title': 'コンボ詳細', 'detail.close': 'コンボ詳細を閉じる', 'detail.description': '説明', 'detail.demo': 'デモリンク', 'detail.download': 'コンボをダウンロード', 'detail.importClient': 'クライアントへ取り込む', 'detail.importedClient': 'クライアントへ取り込みました', 'detail.importFailed': '取り込み失敗：{error}',
      'submitter.historical': '過去の投稿', 'submitter.noEmail': 'メール記録なし',
      'axis.title': 'コンボチャート', 'axis.loading': 'コンボデータを読み込み中', 'axis.iconStyle': '操作アイコン', 'axis.letters': '文字', 'axis.graphics': '図形', 'axis.importKeys': 'キー設定を読み込む', 'axis.keysImported': 'キー設定を読み込みました：{file}', 'axis.keysInvalid': '有効な WW Combo Trainer キー設定ファイルではありません。',
      'axis.startup': '開始軸', 'axis.loop': 'ループ軸', 'axis.loopNumber': 'ループ軸{number}', 'axis.full': 'コンボ全体', 'axis.role': 'キャラクター {number}',
      'axis.noActions': 'このラウンドには操作記録がありません', 'axis.allRounds': '全ラウンド', 'axis.summary': '{periods} · {steps} 操作 · {blocks} ブロック', 'axis.invalid': 'コンボJSONに軸データがありません', 'axis.failed': 'コンボチャート生成失敗：{error}', 'axis.unavailable': '軸データを読み込めません',
      'status.ready': '{count}件 · {date} 更新', 'status.indexFailed': 'インデックスの読み込みに失敗', 'status.readFailed': '{source} の読み込みに失敗：{error}', 'status.invalidIndex': 'インデックス形式が正しくありません',
      'unit.seconds': '{count}秒', 'unit.rounds': '{count}ラウンド', 'unit.actions': '{count}操作', 'unit.switches': '{count}回', 'unit.results': '{count}件', 'unit.downloads': '{count}回',
      'tag.冒烟': '最高難度', 'tag.进阶': '上級', 'tag.标准': '標準', 'tag.基础': '基本', 'tag.轮椅': '簡単', 'tag.错轮': 'ローテずれ', 'tag.全局': '全体'
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
      'upload.title': '콤보 업로드', 'upload.hint': '검토 후 공개됩니다.', 'upload.choose': '.wwcombo.json 파일 선택', 'upload.none': '선택한 파일 없음', 'upload.preview': '콤보 미리보기', 'upload.previewEmpty': '파일을 불러오면 콤보 차트를 확인할 수 있습니다', 'upload.previewLoading': '콤보 미리보기 생성 중', 'upload.previewTitle': '업로드 미리보기', 'upload.submit': '검토 요청', 'upload.tooLarge': '파일은 1MB 이하여야 합니다.', 'upload.sending': '전송 중입니다.', 'upload.success': '투고 완료. 검토를 기다려 주세요.', 'upload.autoPublished': '사전 검사를 통과하여 자동으로 공개되었습니다.', 'upload.invalidJson': '올바른 JSON 파일이 아닙니다.',
      'withdraw.button': '철회 신청', 'withdraw.confirm': '“{title}” 철회를 신청할까요?', 'withdraw.done': '이메일 확인 완료. 철회되었습니다.', 'withdraw.pending': '수동 검토 요청이 등록되었습니다.', 'withdraw.failed': '철회 신청 실패: {error}',
      'vote.rating': '평가 및 피드백', 'vote.summary': '좋아요 {up}', 'vote.downloadRequired': '다운로드 후 좋아요를 누르거나 익명 피드백을 한 번 보낼 수 있습니다.', 'vote.ready': '좋아요와 피드백을 사용할 수 있습니다. 각각 한 번만 가능합니다.', 'vote.done': '좋아요와 피드백을 모두 완료했습니다.', 'vote.failed': '좋아요 실패: {error}',
      'feedback.button': '피드백', 'feedback.sent': '전송됨', 'feedback.title': '업로더에게 피드백 보내기', 'feedback.hint': '내용은 익명으로 업로더 이메일에 전송됩니다. 같은 콤보에는 브라우저당 한 번만 보낼 수 있습니다.', 'feedback.reason': '피드백 내용', 'feedback.placeholder': '문제점이나 제안을 구체적으로 적어 주세요', 'feedback.submit': '피드백 보내기', 'feedback.sending': '전송 중입니다.', 'feedback.tooShort': '피드백은 5자 이상 입력하세요.', 'feedback.success': '익명 피드백을 업로더에게 보냈습니다.', 'feedback.failed': '피드백 전송 실패: {error}', 'feedback.downloadRequired': '먼저 이 콤보를 다운로드해 주세요.', 'feedback.ready': '좋아요를 눌렀으며 익명 피드백은 한 번 더 보낼 수 있습니다.', 'feedback.sentHint': '이 콤보에는 이미 피드백을 보냈습니다.',
      'hero.title': '좋은 아침, 코코넛 시티.', 'status.loading': '인덱스 불러오는 중',
      'search.titleLabel': '제목으로 검색', 'search.titlePlaceholder': '콤보 제목 검색', 'search.clearTitle': '제목 지우기',
      'field.character': '캐릭터', 'field.sort': '정렬', 'field.tag': '태그',
      'sort.version': '버전순(최신 우선)', 'sort.difficulty': '난이도순(어려운 순)',
      'results.title': '커뮤니티 콤보', 'filters.reset': '필터 초기화', 'filters.clear': '필터 지우기',
      'plaza.tabsAria': '커뮤니티 콘텐츠', 'plaza.combos': '커뮤니티 콤보', 'plaza.commissions': '의뢰 광장',
      'commission.create': '의뢰 등록', 'commission.createHint': '필요한 캐릭터와 진행 방식을 설명하면 다른 사용자가 해답을 제출할 수 있습니다.', 'commission.title': '의뢰 제목', 'commission.characters': '필요 캐릭터(최대 3명)', 'commission.characterHint': '캐릭터를 1명 이상 선택하세요.', 'commission.characterCount': '{count} / {max} 선택', 'commission.tag': '의뢰 태그', 'commission.description': '상세 진행 설명', 'commission.publish': '의뢰 등록', 'commission.publishing': '의뢰 등록 중...', 'commission.characterRequired': '캐릭터를 1명 이상 선택하세요.',
      'commission.searchPlaceholder': '의뢰 제목 검색', 'commission.results': '의뢰 {count}개', 'commission.empty': '일치하는 의뢰가 없습니다', 'commission.emptyHint': '제목이나 캐릭터를 바꿔 보세요.', 'commission.open': '모집 중', 'commission.completed': '완료', 'commission.untitled': '제목 없는 의뢰',
      'commission.interestCount': '+1 {count}', 'commission.responseCount': '해답 {count}개', 'commission.interested': '+1 완료', 'commission.interestFailed': '+1 실패: {error}', 'commission.detail': '의뢰 상세', 'commission.owner': '의뢰인', 'commission.interest': '나도 원해요 +1', 'commission.uploadResponse': '해답 업로드', 'commission.adoptNote': '채택된 해답은 자동으로 커뮤니티 심사에 제출됩니다.', 'commission.responses': '제출된 해답', 'commission.noResponses': '아직 제출된 해답이 없습니다.',
      'commission.interestLabel': '희망 인원', 'commission.responseLabel': '해답 수', 'commission.created': '등록일', 'commission.uploadHint': '해답은 의뢰에 저장되고 의뢰인이 채택하면 커뮤니티 심사로 전송됩니다.', 'commission.submitResponse': '해답 제출', 'commission.responseSuccess': '해답을 제출했습니다. 의뢰인에게 이메일로 알립니다.', 'commission.previewResponse': '미리보기', 'commission.downloadFailed': '해답 다운로드 실패: {error}', 'commission.adopt': '채택', 'commission.adoptConfirm': '“{title}”을 채택할까요? 커뮤니티 심사로 자동 전송됩니다.', 'commission.adoptFailed': '채택 실패: {error}', 'commission.accepted': '채택됨', 'commission.withdraw': '의뢰 철회', 'commission.withdrawConfirm': '“{title}” 의뢰를 철회할까요? 제출된 해답도 삭제되며 되돌릴 수 없습니다.', 'commission.withdrawDone': '의뢰를 철회했습니다.', 'commission.withdrawFailed': '의뢰 철회 실패: {error}',
      'commission.loading': '의뢰 광장 불러오는 중', 'commission.ready': '의뢰 {count}개 · {date} 업데이트', 'commission.loadFailed': '의뢰 광장을 불러올 수 없습니다', 'commission.loadError': '의뢰 광장 불러오기 실패: {error}',
      'empty.title': '일치하는 콤보가 없습니다', 'empty.body': '다른 제목, 캐릭터 또는 태그를 시도해 보세요.',
      'error.title': '커뮤니티 인덱스를 불러올 수 없습니다', 'error.later': '잠시 후 다시 시도하세요.', 'error.reload': '다시 불러오기',
      'meta.rounds': '라운드', 'meta.duration': '길이', 'meta.actions': '동작', 'meta.loopSwitches': '루프 교대', 'meta.updated': '업데이트', 'meta.uploader': '투고자', 'meta.firstCharacter': '시작 캐릭터', 'meta.uploadVersion': '게임 버전', 'meta.downloads': '다운로드 수',
      'card.details': '상세', 'card.untitled': '이름 없는 콤보', 'card.charactersMissing': '캐릭터 미표기',
      'character.all': '모든 캐릭터', 'character.select': '캐릭터 선택', 'character.hint': '최대 3명까지 선택할 수 있으며 선택 순서는 검색에 영향을 주지 않습니다.', 'character.max': '최대 3명까지 선택할 수 있습니다.',
      'character.close': '캐릭터 선택 닫기', 'character.search': '캐릭터 검색', 'character.none': '캐릭터를 찾을 수 없습니다', 'character.selected': '{count} / {max} 선택', 'character.selectedAria': '선택됨: {names}', 'character.usedAria': '사용 캐릭터: {names}',
      'common.all': '전체', 'common.clear': '지우기', 'common.done': '완료', 'common.close': '닫기', 'common.cancel': '취소', 'common.unknown': '알 수 없음', 'dialog.notice': '알림', 'dialog.confirm': '작업 확인',
      'detail.title': '콤보 상세', 'detail.close': '콤보 상세 닫기', 'detail.description': '설명', 'detail.demo': '시연 링크', 'detail.download': '콤보 다운로드', 'detail.importClient': '클라이언트로 가져오기', 'detail.importedClient': '클라이언트로 가져왔습니다', 'detail.importFailed': '가져오기 실패: {error}',
      'submitter.historical': '이전 투고', 'submitter.noEmail': '이메일 기록 없음',
      'axis.title': '콤보 차트', 'axis.loading': '콤보 데이터 불러오는 중', 'axis.iconStyle': '동작 아이콘 스타일', 'axis.letters': '문자', 'axis.graphics': '도형', 'axis.importKeys': '키 설정 가져오기', 'axis.keysImported': '키 설정을 가져왔습니다: {file}', 'axis.keysInvalid': '올바른 WW Combo Trainer 키 설정 파일이 아닙니다.',
      'axis.startup': '시작 축', 'axis.loop': '루프 축', 'axis.loopNumber': '루프 축 {number}', 'axis.full': '전체 콤보', 'axis.role': '캐릭터 {number}',
      'axis.noActions': '이 라운드에는 기록된 동작이 없습니다', 'axis.allRounds': '전체 라운드', 'axis.summary': '{periods} · {steps} 동작 · {blocks} 블록', 'axis.invalid': '콤보 JSON에 축 데이터가 없습니다', 'axis.failed': '콤보 차트 생성 실패: {error}', 'axis.unavailable': '축 데이터를 불러올 수 없습니다',
      'status.ready': '{count}개 콤보 · {date} 업데이트', 'status.indexFailed': '인덱스 불러오기 실패', 'status.readFailed': '{source} 불러오기 실패: {error}', 'status.invalidIndex': '인덱스 형식이 올바르지 않습니다',
      'unit.seconds': '{count}초', 'unit.rounds': '{count}라운드', 'unit.actions': '{count}동작', 'unit.switches': '{count}회', 'unit.results': '{count}개 결과', 'unit.downloads': '{count}회',
      'tag.冒烟': '최고 난도', 'tag.进阶': '상급', 'tag.标准': '표준', 'tag.基础': '기본', 'tag.轮椅': '쉬움', 'tag.错轮': '로테이션 어긋남', 'tag.全局': '전체'
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

  function setLanguage(next, persist = true) {
    const normalized = normalizedLanguage(next);
    if (!normalized || normalized === language) return;
    language = normalized;
    if (persist) {
      try { localStorage.setItem(STORAGE_KEY, language); } catch {}
    }
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
