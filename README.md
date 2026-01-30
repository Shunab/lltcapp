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

To open the app on your phone while running locally, expose your dev server with a **public tunnel** (no dependency or config change in this repo).

1. **Start the dev server** (in this repo):

   ```bash
   npm run dev
   ```

   Leave it running.

2. **In a separate terminal**, start a tunnel to port `3000`. Use any tool you prefer; examples:
   - **ngrok** (install from [ngrok.com](https://ngrok.com)):
     ```bash
     ngrok http 3000
     ```
   - **Cloudflare Tunnel** (`cloudflared`):
     ```bash
     cloudflared tunnel --url http://localhost:3000
     ```
   - **localtunnel** (if you have it installed):
     ```bash
     npx localtunnel --port 3000
     ```

3. **Open the public URL** shown by the tunnel (e.g. `https://abc123.ngrok.io`) on your phone’s browser. The app will load from your local machine.

No packages are added to this project; run and install tunnel tools on your own machine as needed.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
