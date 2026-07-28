# 椰果朋克2077服务器版

公开网站：<https://Nova.fb520.site>  
默认监听：`0.0.0.0:9881`

服务器只需 clone 主仓库。程序会自动 clone `wwcombo-deta1` 和 `wwcombo-deta2`，不需要 QQ 邮箱授权码或 GitHub 写入权限。

## 一键安装

服务器需要 Node.js 18+、Git 和 systemd：

```bash
git clone https://github.com/NovaWallace/wwcombo-repository.git
cd wwcombo-repository
sudo bash server/install-service.sh --public-url https://Nova.fb520.site --trust-proxy
```

安装程序会：

1. 创建独立运行目录 `/var/lib/wwcombo`。
2. 生成并在终端打印随机管理密码。
3. 自动 clone 两个数据仓库并校验全部连段。
4. 启动 `0.0.0.0:9881`。
5. 注册 `wwcombo.service`，开机自动运行。

指定后台密码时，至少使用 10 个字符：

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

点击“从 GitHub 更新并重启”后，服务器会：

1. 更新 `deta1`。
2. 更新 `deta2`。
3. 最后更新主仓库 `repository`。
4. 验证索引中每个连段 JSON 都存在。
5. 生成独立、不可变的网站快照。
6. 自动重启并切换到新快照。

更新失败时，当前服务和旧快照保持可用，不会展示更新到一半的数据。

## 本地维护端

QQ 收件、完整投稿者信息、撤回和投诉只留在维护者电脑。维护站点击“一键更新并 Push”后，按 `deta1`、`deta2`、`repository` 的顺序推送。随后登录服务器后台点击更新即可。

服务器不会获取 `.env`、QQ 邮箱授权码、`submission-owners.json`、`mail-requests.json` 或投稿者完整邮箱。
