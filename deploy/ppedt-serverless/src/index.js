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

            // If prompt has more than ascii alphanumeric characters, ask LLM to rewrite it.
            let final_prompt = prompt;
            if (/[^\x00-\x7F]+/.test(prompt)) {
                const response = await env.AI.run(
                '@cf/meta/llama-3-8b-instruct',
                {
                    messages: [
                        { role: 'system', content: 'Translate the query to English and modify mathematics unicode symbols to LaTeX commands if necessary without any explanation.' },
                        { role: 'user', content: prompt }
                    ]
                });
                final_prompt = await response.response;
            }

            // Get the embedding of final_prompt
            const embedding_response = await env.AI.run(
                '@cf/baai/bge-small-en-v1.5',
                {
                    text: final_prompt
                });
            const query_vector = await embedding_response.data[0];

            // Retrieve context from Cloudflare embedding DB
            let matches = await env.VECTORIZE.query(query_vector, {
                topK: 3,
                returnMetadata: 'all'
            });
            matches = matches.matches;
            // make a cutoff of score < 0.75
            matches = matches.filter(m => m.score >= 0.75);
            const context_str = matches.map(m => "File: " + m.metadata.file_name + "\n" + m.metadata.text).join('\n\n');
            final_prompt = "Context information is below.\n" +
                "---------------------\n" +
                context_str + "\n" +
                "---------------------\n" +
                "Answer the query.\n" +
                "Query: " + final_prompt + "\n" +
                "Answer: ";

            // Final Stream output
            const messages = [
                { role: 'system', content: 'You are a LaTeX code helper, especially for the code of package pgfplots. Return only the modified version of the following code without any additional text or explanation. You have to make sure the code could compile successfully and don\'t omit the code of documentclass.' },
                { role: 'user', content: final_prompt + ':\n' + code }
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
