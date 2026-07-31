# 椰果朋克2077服务器版

公开网站：<https://Nova.fb520.site>  
默认监听：`0.0.0.0:9881`

服务器只需 clone 主仓库。程序会自动 clone `wwcombo-deta1` 和 `wwcombo-deta2`，不需要 QQ 邮箱授权码或 GitHub 写入权限。

## 一键安装

### Windows 服务器

服务器主人只需 clone 主仓库，然后双击仓库根目录的：

```text
一键启动.bat
```

备用入口为 `server\windows-deploy.bat` 或原有的 `server\windows-deploy.cmd`。脚本会自动申请管理员权限、检查或安装 Node.js LTS 与 Git、安装 npm 依赖、注册 Windows 开机计划任务、开放 TCP 9881，并启动网站。存在 `winget` 时优先使用；Windows Server 没有 `winget` 时，会改从 Node.js 和 Git for Windows 官方地址下载静默安装包。默认监听 `0.0.0.0:9881`，运行数据保存在 `C:\ProgramData\WWCombo`。重复双击会拉取 GitHub 更新并重新部署。

首次部署会在服务器本地要求输入并确认维护端密码，输入内容不会显示、不会写入仓库，服务器只保存加盐哈希。已有配置再次部署时会保留原密码；自动化环境也可以通过服务器本地的 `WWCOMBO_ADMIN_PASSWORD` 环境变量传入。脚本会验证正确密码可以登录、错误密码返回 401。服务器主人不负责日常审核，维护者在自己的电脑打开 <https://Nova.fb520.site/admin/> 操作。

### Linux 服务器

最省事的方式是在服务器 SSH 终端执行下面一条命令。首次部署会要求服务器主人亲自输入两次管理密码；以后重复执行同一条命令会自动拉取更新、保留 `/var/lib/wwcombo` 内的数据和现有密码，然后重启服务：

```bash
curl -fsSL https://raw.githubusercontent.com/NovaWallace/wwcombo-repository/main/server/deploy.sh | sudo bash
```

脚本默认将仓库放在 `/opt/wwcombo-repository`，监听 `0.0.0.0:9881`，公开地址使用 `https://Nova.fb520.site`，并注册开机自启的 `wwcombo.service`。如果仓库存在未提交改动，脚本会停止更新而不是覆盖这些文件。

已经 clone 主仓库时，也可以继续使用原来的安装方式：

```bash
sudo bash server/one-click-install.sh --public-url https://Nova.fb520.site --trust-proxy
```

服务器已经有 Node.js 18+、npm、Git 和 systemd 时，也可以直接运行安装服务脚本：

```bash
git clone https://github.com/NovaWallace/wwcombo-repository.git
cd wwcombo-repository
sudo bash server/install-service.sh \
  --host 0.0.0.0 \
  --port 9881 \
  --public-url https://Nova.fb520.site \
  --trust-proxy \
  --admin-password '至少10位且自己保存的密码'
```

安装脚本会在 systemd 服务参数和环境变量中同时写入 `0.0.0.0:9881`。旧安装更新代码后，应重新执行上面的安装命令，使现有 `wwcombo.service` 同步新的监听配置。

安装程序会：

1. 创建独立运行目录 `/var/lib/wwcombo`。
2. 保存安装者明确设置的管理密码；交互式安装也会要求输入并确认密码。
3. 自动 clone 两个数据仓库并校验全部连段。
4. 启动 `0.0.0.0:9881`。
5. 注册 `wwcombo.service`，开机自动运行。

后台密码至少使用 10 个字符。首次安装不会再生成一个未知的随机密码；非交互式安装必须提供 `--admin-password`：

```bash
sudo bash server/install-service.sh --public-url https://Nova.fb520.site --trust-proxy --admin-password 'CHANGE_THIS_PASSWORD'
```

查看运行状态：

```bash
sudo systemctl status wwcombo.service
sudo journalctl -u wwcombo.service -f
```

不安装 systemd、只临时运行时：

```bash
bash server/start.sh --public-url https://Nova.fb520.site --trust-proxy
```

## 域名与 HTTPS

将 `Nova.fb520.site` 的 DNS 记录指向服务器，再把域名反向代理到：

```text
http://127.0.0.1:9881
```

使用 Caddy 时可直接采用 `server/Caddyfile.example`，它会自动申请 HTTPS 证书。使用 Nginx 或服务器面板时参考 `server/nginx.example.conf`，并在面板中申请证书。

启用 `--trust-proxy` 后，建议用防火墙限制外部用户直接访问 9881，只通过 HTTPS 反向代理开放网站。

## 后台更新

管理后台地址：<https://Nova.fb520.site/admin/>

维护端右上角“上传并更新”可由维护者直接发布本地 JSON；“UP 白名单”用于添加特殊邮箱。普通用户投稿进入审核页后，点击“查看连段图”会读取私有 JSON 并生成预览。系统会自动检查连续 6 个及以上相同招式，以及无法转换为图标的自定义文字；无异常时标为“低风险”，但不会替维护者自动通过。

点击“从 GitHub 更新并重启”后，服务器会：

1. 更新 `deta1`。
2. 更新 `deta2`。
3. 最后更新主仓库 `repository`。
4. 验证索引中每个连段 JSON 都存在。
5. 生成独立、不可变的网站快照。
6. 自动重启并切换到新快照。

更新失败时，当前服务和旧快照保持可用，不会展示更新到一半的数据。

## 投稿数据与后台

用户可以直接在网站登记用户名和邮箱并提交连段。新投稿进入服务器审核队列，审核通过后才会公开；完整邮箱、所有权记录、撤回申请、UP 白名单、SMTP 配置和下载次数只保存在服务器的 `/var/lib/wwcombo/community`，不会写入公开 GitHub 仓库或公开网站文件。

用户以与投稿一致的邮箱发起撤回时会自动删除；无法核验的撤回申请进入后台人工处理。后台可配置 QQ SMTP（`smtp.qq.com:465`，使用授权码）向维护者发送新投稿提醒，SMTP 不负责自动发布。

旧的本地维护站仍可执行“一键更新并 Push”，按 `deta1`、`deta2`、`repository` 的顺序推送历史仓库内容。服务器主人随后在管理后台点击“从 GitHub 更新并重启”即可拉取更新；服务器不会获取维护者电脑上的 `.env` 或 QQ 邮箱授权码。

## 项目 API 与客户端更新

维护端“项目 API”页可直接管理角色的中、英、日、韩名称，以及招式块底图、裁切区域、拉伸边界和边缘参数。初次安装会载入仓库内的 57 套预设，之后的维护端修改保存在 `/var/lib/wwcombo/project-assets`，不会被 GitHub 更新覆盖。

公开接口：

- 角色翻译与底图：`/api/project-assets/v1/manifest.json`
- 客户端正式版本：`/api/project-assets/v1/app-release.json`
- 当前服务器安装包：`/api/app-release/download`

维护端还可填写三段式客户端版本号、更新说明和外部下载地址，或直接上传不超过 500 MB 的 EXE、MSI、ZIP。安装包采用流式上传与下载，不会整体载入 Node.js 内存；只有用户点击下载时才产生安装包流量。
