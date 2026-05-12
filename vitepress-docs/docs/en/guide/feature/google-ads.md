# Add Google AdSense Ads

This guide explains how to connect the frontend site to Google AdSense for site verification, Auto ads, and the optional desktop sidebar manual ad units.

## Prerequisites

Before you start, make sure:

- You have a public frontend domain, for example `https://mail.example.com`
- The domain is not blocked by Cloudflare Access, a WAF challenge, a login page, a maintenance page, or a 404 response
- The site URL in AdSense matches the actual Pages domain or custom domain you deploy
- The frontend opens normally, and `/open_api/settings` returns JSON

Google AdSense verifies your site by crawling the public page. If the crawler cannot see the AdSense code in the page `<head>`, AdSense may report that the site cannot be verified.

## Get the AdSense Code

In Google AdSense:

1. Open **Sites** and add the domain where you want to show ads.
2. Copy the AdSense code from the setup prompt.
3. Record the publisher ID from `client=ca-pub-...`.

Example:

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456"
  crossorigin="anonymous"></script>
```

The publisher ID is:

```txt
ca-pub-1234567890123456
```

## Configure the Frontend

The recommended approach is to use environment variables, so future code updates do not require manually editing HTML.

For a normal Cloudflare Pages deployment with the frontend calling the Worker API directly, update `frontend/.env.prod`:

```txt
VITE_API_BASE=https://your-worker-api-domain
VITE_GOOGLE_AD_CLIENT=ca-pub-1234567890123456
VITE_GOOGLE_AD_SLOT=
```

For a Page Functions deployment that proxies API requests on the same domain, update `frontend/.env.pages`:

```txt
VITE_API_BASE=
VITE_GOOGLE_AD_CLIENT=ca-pub-1234567890123456
VITE_GOOGLE_AD_SLOT=
```

`VITE_GOOGLE_AD_CLIENT` is the `ca-pub-...` publisher ID from Google. Once configured, the build output injects the AdSense verification tag and Auto ads script into the `<head>` of `index.html`.

`VITE_GOOGLE_AD_SLOT` is the ad unit ID. This variable is optional; the frontend renders the desktop left and right manual sidebar ad units only when both `VITE_GOOGLE_AD_CLIENT` and `VITE_GOOGLE_AD_SLOT` are configured.

## Manually Paste the Code

If AdSense asks you to copy and paste the script directly, add it between `<head>` and `</head>` in `frontend/index.html`:

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456"
  crossorigin="anonymous"></script>
```

Do not paste the same script more than once. After deployment, view the page source and search for `ca-pub-` to confirm that only your publisher ID appears.

## Build and Deploy

Normal Pages deployment:

```bash
cd frontend
pnpm build
pnpm run deploy --project-name=<your-pages-project-name>
```

Page Functions same-origin deployment:

```bash
cd frontend
pnpm build:pages
npx wrangler pages deploy ./dist --branch production --project-name <your-pages-project-name>
```

If you deploy with GitHub Actions, update the repository secret `FRONTEND_ENV` and add:

```txt
VITE_GOOGLE_AD_CLIENT=ca-pub-1234567890123456
VITE_GOOGLE_AD_SLOT=
```

Then rerun the frontend deployment workflow.

## Verify the Deployment

After deployment, open the same domain you submitted to AdSense, view the page source, and confirm the `<head>` contains:

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456"
  crossorigin="anonymous"></script>
```

You can also check from the command line:

```bash
curl -L https://your-frontend-domain | grep 'ca-pub-'
```

If the publisher ID is visible, go back to AdSense and click verify. Site review and real ad serving may take some time after verification.

## Configure ads.txt

If AdSense asks you to configure `ads.txt`, create `frontend/public/ads.txt`:

```txt
google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0
```

The `pub-1234567890123456` value comes from `ca-pub-1234567890123456`, with the `ca-` prefix removed.

Rebuild and redeploy, then open:

```txt
https://your-frontend-domain/ads.txt
```

Confirm that the file content is publicly visible.

## Troubleshooting

### AdSense says the site cannot be verified

Check:

- The code has been deployed to production, not only changed locally
- The domain in AdSense matches the deployed site domain
- The page source contains `ca-pub-...`
- The site is not blocked by Cloudflare Access, WAF challenges, login pages, or maintenance pages
- The page is served over HTTPS and returns HTTP 200
- Cloudflare Pages deployed to the production branch

### The code appears locally but not online

This usually means the site was not rebuilt, or the wrong Pages project was deployed. Rebuild, redeploy, and confirm the Cloudflare Pages project name.

### `VITE_GOOGLE_AD_CLIENT` is configured but ads are not showing

Site verification and ad serving are separate steps. Confirm:

- The AdSense site review has passed
- Auto ads are enabled in AdSense
- The page has enough content for Google to evaluate ad placement
- Your browser does not have an ad blocker enabled
- The site complies with AdSense policies

### You want fixed-position ads

Create an ad unit in AdSense, copy the slot ID, and configure:

```txt
VITE_GOOGLE_AD_CLIENT=ca-pub-1234567890123456
VITE_GOOGLE_AD_SLOT=1234567890
```

After rebuilding and redeploying, the desktop frontend renders manual ad units in the left and right sidebars.

## References

- [Connect your site to AdSense](https://support.google.com/adsense/answer/7584263?hl=en)
- [Set up Auto ads on your site](https://support.google.com/adsense/answer/9261307?hl=en)
- [Ads.txt guide](https://support.google.com/adsense/answer/12171612?hl=en-EN)
