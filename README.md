This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

## Testing on a real device (phone)

### Same network (no tunnel)

With your phone on the same Wi‑Fi as your machine:

1. **Start the dev server:**

   ```bash
   npm run dev
   ```

   Next.js listens on all interfaces by default, so your phone can reach it.

2. **Find your machine’s local IP** (the one on your Wi‑Fi):
   - **Windows:** `ipconfig` → use the IPv4 address (e.g. `192.168.1.x` or `169.254.x.x`).
   - **macOS / Linux:** `ifconfig` or `ip addr` → use the inet address on your Wi‑Fi interface.

3. **On your phone’s browser** open: `http://<YOUR_IP>:3000` (e.g. `http://192.168.1.5:3000`).

`next.config` includes `allowedDevOrigins` for private IP ranges (`192.168.*.*`, `169.254.*.*`, `10.*.*.*`) so the dev server won’t warn or block those requests.

### Public URL (tunnel)

To use a public URL (e.g. ngrok) instead:

1. Start the dev server as above and leave it running.
2. In another terminal, run a tunnel to port `3000`, e.g.:
   - **ngrok:** `ngrok http 3000`
   - **Cloudflare:** `cloudflared tunnel --url http://localhost:3000`
   - **localtunnel:** `npx localtunnel --port 3000`
3. Open the URL the tool prints in your phone’s browser.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
