/**
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
    async fetch(request, env, ctx) {
        // CORS headers to allow requests from any origin
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization'
        };

        // Handle preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, { status: 204, headers: corsHeaders });
        }

        if (request.method === "POST") {
            const { code, prompt } = JSON.parse(await request.text());

            // messages - chat style input
            let messages = [
                { role: 'system', content: 'You are a LaTeX code helper, especially for the code of package pgfplots. Return only the modified version of the following code without any additional text or explanation. You have to make sure the code could compile successfully and don\'t omit the code of documentclass.' },
                { role: 'user', content: prompt + ':\n' + code }
            ];
            const response = await env.AI.run(
                '@cf/meta/llama-3-8b-instruct',
                {
                    messages,
                    stream: true
                });

            const encoder = new TextEncoder();
            const stream = new ReadableStream({
                async start(controller) {
                    for await (const chunk of response) {
                        const text = typeof chunk === 'string' ? chunk : new TextDecoder().decode(chunk);
                        const match = text.match(/data:\s*({.*})/);
                        if (match) {
                            try {
                                const obj = JSON.parse(match[1]);
                                if (obj.response) {
                                    controller.enqueue(encoder.encode(obj.response));
                                }
                            } catch (e) {}
                        }
                    }
                    controller.close();
                }
            });
            return new Response(stream, {
                status: 200,
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/octet-stream'
                }
            });

        } else {
            return new Response("PGFPlotsEdt Serverless Server: POST a request (code, prompt) to LLM.", { status: 200, headers: corsHeaders });
        }
    },
};
