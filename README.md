# React Router RSC Cloudflare

This is a React Router application with React Server Components running on Cloudflare Workers.

## Environment Variables Setup

### Local Development

1. Copy `.dev.vars.example` to `.dev.vars` and fill in your actual values:

    ```bash
    cp .dev.vars.example .dev.vars
    ```

2. Edit `.dev.vars` with your actual OAuth credentials:

    ```
    VITE_SHORT_CODE=your_actual_short_code
    VITE_CLIENT_ID=your_actual_client_id
    VITE_CLIENT_SECRET=your_actual_client_secret
    VITE_ORG_ID=your_actual_org_id
    VITE_SITE_ID=your_actual_site_id
    ```

3. For local Wrangler development, use the local config files:

    ```bash
    # Start SSR worker with local config
    pnpm cf-dev-local

    # Start RSC worker with local config
    pnpm cf-dev-local-rsc
    ```

### Production Deployment

Set the same environment variables in your Cloudflare dashboard:

- Go to Workers & Pages → Your Worker
- Settings → Variables
- Add each `VITE_*` variable with your production values

### Security Notes

- `.dev.vars` and `cf/wrangler.*.local.jsonc` are gitignored and contain secrets
- The main Wrangler configs (`wrangler.rsc.jsonc`, `wrangler.ssr.jsonc`) are committed but contain no secrets
- Always use environment variables for sensitive data, never hardcode in source

## Development

```bash
# Install dependencies
pnpm install

# Start local development
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```
