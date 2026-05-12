# 接入 Google AdSense 广告

本文说明如何在前端站点接入 Google AdSense，用于站点验证、Auto ads 自动广告，以及可选的桌面侧栏手动广告位。

## 前提条件

接入前请先确认：

- 你已经有可访问的前端站点域名，例如 `https://mail.example.com`
- 该域名没有被 Cloudflare Access、WAF Challenge、登录页、维护页或 404 阻挡
- AdSense 中填写的网站域名必须和实际发布的 Pages 域名或自定义域名一致
- 前端已经可以正常打开，`/open_api/settings` 返回 JSON

Google AdSense 验证站点时会抓取公开页面。如果抓取工具看不到 `<head>` 中的 AdSense 代码，就会提示“无法验证您的网站”。

## 获取 AdSense 代码

在 Google AdSense 后台：

1. 打开 **网站**，添加你要投放广告的站点域名。
2. 按提示复制 AdSense 代码。
3. 记录代码中的发布商 ID，也就是 `client=ca-pub-...` 这一段。

示例：

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456"
  crossorigin="anonymous"></script>
```

对应的发布商 ID 是：

```txt
ca-pub-1234567890123456
```

## 配置前端

推荐使用环境变量配置，这样升级代码时不需要手动维护 HTML。

如果你使用普通 Cloudflare Pages 前后端分离部署，修改 `frontend/.env.prod`：

```txt
VITE_API_BASE=https://你的-worker-api域名
VITE_GOOGLE_AD_CLIENT=ca-pub-1234567890123456
VITE_GOOGLE_AD_SLOT=
```

如果你使用 Page Functions 同域转发部署，修改 `frontend/.env.pages`：

```txt
VITE_API_BASE=
VITE_GOOGLE_AD_CLIENT=ca-pub-1234567890123456
VITE_GOOGLE_AD_SLOT=
```

`VITE_GOOGLE_AD_CLIENT` 是 Google 提供的 `ca-pub-...` 发布商 ID。配置后，构建产物会在 `index.html` 的 `<head>` 中注入 AdSense 验证标签和 Auto ads 脚本。

`VITE_GOOGLE_AD_SLOT` 是广告单元 ID。该变量可选；只有同时配置 `VITE_GOOGLE_AD_CLIENT` 和 `VITE_GOOGLE_AD_SLOT` 时，前端才会在桌面端左右侧栏渲染手动广告位。

## 手动粘贴代码

如果 AdSense 后台要求你直接复制脚本，也可以把代码粘贴到 `frontend/index.html` 的 `<head>` 和 `</head>` 之间：

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456"
  crossorigin="anonymous"></script>
```

注意不要同时粘贴多份相同脚本。发布后打开网页源代码，搜索 `ca-pub-`，确认只出现你自己的发布商 ID。

## 打包和发布

普通 Pages 部署：

```bash
cd frontend
pnpm build
pnpm run deploy --project-name=<你的Pages项目名>
```

Page Functions 同域转发部署：

```bash
cd frontend
pnpm build:pages
npx wrangler pages deploy ./dist --branch production --project-name <你的Pages项目名>
```

如果你使用 GitHub Actions 部署，在仓库 Secrets 中修改 `FRONTEND_ENV`，加入：

```txt
VITE_GOOGLE_AD_CLIENT=ca-pub-1234567890123456
VITE_GOOGLE_AD_SLOT=
```

然后重新运行前端部署 workflow。

## 验证是否生效

发布完成后，在浏览器打开你提交给 AdSense 的域名，查看网页源代码，确认 `<head>` 中包含：

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456"
  crossorigin="anonymous"></script>
```

也可以在命令行检查：

```bash
curl -L https://你的前端域名 | grep 'ca-pub-'
```

如果能看到发布商 ID，再回到 AdSense 后台点击验证。广告审核和实际展示可能需要等待一段时间。

## 配置 ads.txt

如果 AdSense 提示需要配置 `ads.txt`，在前端公开目录创建 `frontend/public/ads.txt`：

```txt
google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0
```

这里的 `pub-1234567890123456` 来自 `ca-pub-1234567890123456`，去掉前缀中的 `ca-`。

重新打包发布后访问：

```txt
https://你的前端域名/ads.txt
```

确认可以直接看到文件内容。

## 常见问题

### AdSense 提示无法验证网站

请检查：

- 代码是否已经发布到线上，而不是只改了本地文件
- AdSense 填写的域名是否和实际访问域名一致
- 查看网页源代码时是否能搜索到 `ca-pub-...`
- 站点是否被 Cloudflare Access、WAF Challenge、登录页或维护页拦截
- 是否访问的是 HTTPS 页面，且返回状态码为 200
- Pages 是否部署到了 production 分支

### 本地能看到代码，线上看不到

通常是没有重新构建或部署错项目。重新执行打包发布命令，并确认 Cloudflare Pages 的项目名正确。

### 配置了 `VITE_GOOGLE_AD_CLIENT` 但没有广告

站点验证通过和广告展示不是同一件事。请确认：

- AdSense 站点审核已通过
- AdSense 后台已开启 Auto ads
- 页面内容足够让 Google 判断广告投放场景
- 浏览器没有广告拦截插件
- 没有违反 AdSense 政策

### 想要固定位置广告

在 AdSense 后台创建广告单元，拿到 slot ID 后配置：

```txt
VITE_GOOGLE_AD_CLIENT=ca-pub-1234567890123456
VITE_GOOGLE_AD_SLOT=1234567890
```

重新构建发布后，桌面端会在页面左右侧栏显示手动广告位。

## 参考

- [Connect your site to AdSense](https://support.google.com/adsense/answer/7584263?hl=en)
- [Set up Auto ads on your site](https://support.google.com/adsense/answer/9261307?hl=en)
- [Ads.txt guide](https://support.google.com/adsense/answer/12171612?hl=en-EN)
