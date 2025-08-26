import { generateHTML } from '../react-router-vite/entry.ssr';

console.log('[debug:cf-ssr-entry] - Starting SSR entry point');

export default {
    fetch(request: Request, env: any) {
        console.log(
            '[debug:cf-ssr-entry] - fetch called with request:',
            request.url
        );
        console.log('[debug:cf-ssr-entry] - env keys:', Object.keys(env));

        try {
            console.log('[debug:cf-ssr-entry] - About to call generateHTML');
            const result = generateHTML(request, (request) =>
                env.RSC.fetch(request)
            );
            console.log(
                '[debug:cf-ssr-entry] - generateHTML completed successfully'
            );
            return result;
        } catch (error) {
            console.error(
                '[debug:cf-ssr-entry] - Error in generateHTML:',
                error
            );
            throw error;
        }
    }
};
