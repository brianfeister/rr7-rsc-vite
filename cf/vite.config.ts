import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import rsc from '@vitejs/plugin-rsc';
import tailwindcss from '@tailwindcss/vite';
import { cloudflare } from '@cloudflare/vite-plugin';

export default defineConfig({
    clearScreen: false,
    build: {
        minify: false
    },
    server: {
        proxy: {
            '/callback': {
                target: 'http://localhost:5173',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/callback/, ''),
                configure: (proxy, _options) => {
                    proxy.on('proxyReq', (proxyReq, req) => {
                        // Intercept the request and respond directly instead of proxying
                        if (req.url === '/callback') {
                            // Don't actually proxy this request
                            proxyReq.abort();
                        }
                    });

                    // Handle the callback endpoint directly
                    proxy.on('proxyReq', (proxyReq, req, res) => {
                        if (req.url === '/callback') {
                            // Set response headers and end the response
                            res.writeHead(200, {
                                'Content-Type': 'application/json',
                                'Cache-Control': 'max-age=31536000'
                            });
                            res.end(JSON.stringify({ message: 'OK' }));
                            return;
                        }
                    });
                }
            },
            '/mobify/proxy/api': {
                target: 'https://8o7m175y.api.commercecloud.salesforce.com',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/mobify\/proxy\/api/, ''),

                configure: (proxy, _options) => {
                    proxy.on('proxyReq', (proxyReq, req) => {
                        // eslint-disable-next-line no-console
                        console.log(
                            '🔄 Proxying request:',
                            req.method,
                            req.url,
                            '→',
                            proxyReq.getHeader('host') + proxyReq.path
                        );
                    });
                    proxy.on('proxyRes', (proxyRes, req) => {
                        if (
                            typeof proxyRes.statusCode === 'number' &&
                            proxyRes.statusCode >= 200 &&
                            proxyRes.statusCode <= 399
                        ) {
                            // eslint-disable-next-line no-console
                            console.log(
                                '✅ Proxy response:',
                                proxyRes.statusCode,
                                req.url
                            );
                        } else {
                            // eslint-disable-next-line no-undef
                            const body: Buffer[] = [];
                            // eslint-disable-next-line no-undef
                            proxyRes.on('data', (chunk: Buffer) => {
                                body.push(chunk);
                            });
                            proxyRes.on('end', () => {
                                // eslint-disable-next-line no-console
                                console.log(
                                    '❌ Proxy error:',
                                    proxyRes.statusCode,
                                    req.url,
                                    // eslint-disable-next-line no-undef
                                    Buffer.concat(body).toString()
                                );
                            });
                        }
                    });
                    proxy.on('error', (err, req) => {
                        // eslint-disable-next-line no-console
                        console.error('❌ Proxy error:', err.message, req.url);
                    });
                }
            }
        }
    },
    plugins: [
        // inspect(),
        // transformCommerceSDK(),
        tailwindcss(),
        react(),
        rsc({
            entries: {
                client: './react-router-vite/entry.browser.tsx'
            },
            serverHandler: false,
            // Try to avoid Node.js dependencies
            experimental_reactServerComponentsExternalPackages: [],
            // Force edge runtime compatibility
            target: 'webworker'
        }),
        cloudflare({
            configPath: './cf/wrangler.ssr.jsonc',
            viteEnvironment: {
                name: 'ssr'
            },
            auxiliaryWorkers: [
                {
                    configPath: './cf/wrangler.rsc.jsonc',
                    viteEnvironment: {
                        name: 'rsc'
                    }
                }
            ]
        })
    ],
    environments: {
        client: {
            optimizeDeps: {
                include: [
                    'react-router',
                    'react-router/internal/react-server-client'
                ]
            }
        },
        ssr: {
            optimizeDeps: {
                exclude: ['react-router']
            }
        },
        rsc: {
            optimizeDeps: {
                exclude: ['react-router']
            }
        }
    }
});
