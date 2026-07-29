# 椰果朋克2077服务器版

公开网站：<https://Nova.fb520.site>  
默认监听：`0.0.0.0:9881`

服务器只需 clone 主仓库。程序会自动 clone `wwcombo-deta1` 和 `wwcombo-deta2`，不需要 QQ 邮箱授权码或 GitHub 写入权限。

## 一键安装

最省事的方式是一键安装依赖并启动。脚本会安装 Node.js 20、npm、Git 和项目依赖，然后要求你亲自输入两次管理密码：

```bash
git clone https://github.com/NovaWallace/wwcombo-repository.git
cd wwcombo-repository
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
