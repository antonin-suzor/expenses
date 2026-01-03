interface Env {}
export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': request.headers.get('Origin') ?? '',
          'Access-Control-Allow-Methods': 'GET, HEAD, POST, PUT, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, X-Custom-Password',
        },
      });
    }

    if (request.headers.get('X-Custom-Password') != import.meta.env.VITE_PASSWORD) {
      return new Response(null, { status: 403 });
    }

    const reqBody: {
      amount: number;
      name: string;
      tag: string;
      date: string;
    } = await request.json();

    const notionResponse = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_NOTION_SECRET_KEY}`,
        'Notion-Version': '2025-09-03',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        parent: {
          type: 'data_source_id',
          data_source_id: import.meta.env.VITE_NOTION_DATASOURCE_ID,
        },
        properties: {
          Source: {
            type: 'title',
            title: [
              {
                type: 'text',
                text: { content: reqBody.name, link: null },
              },
            ],
          },
          Amount: { type: 'number', number: reqBody.amount },
          Tags: { type: 'select', select: { name: reqBody.tag } },
          Date: { type: 'date', date: { start: reqBody.date } },
        },
      }),
    });

    return new Response(notionResponse.body, {
      headers: { 'Content-Type': 'application/json' },
      status: notionResponse.status,
      statusText: notionResponse.statusText,
    });
  },
} satisfies ExportedHandler<Env>;
