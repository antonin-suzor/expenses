interface Env {}
export default {
  async fetch(request: Request): Promise<Response> {
    if (request.headers.get('X-Custom-Password') != import.meta.env.VITE_PASSWORD) {
      return new Response(null, { status: 403 });
    }

    const reqBody: {
      amount: number;
      name: string;
      tag: string;
      date: string;
      income: boolean;
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
          data_source_id: reqBody.income
            ? import.meta.env.VITE_NOTION_DATASOURCE_ID_INCOME
            : import.meta.env.VITE_NOTION_DATASOURCE_ID_EXPENSES,
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
          Month: {
            type: 'relation',
            relation: [{ id: getDateMonthId(reqBody.date) }],
          },
        },
      }),
    });

    return new Response(notionResponse.body, {
      headers: { 'Content-Type': 'application/json' },
      status: notionResponse.status,
    });
  },
} satisfies ExportedHandler<Env>;

const monthIds: Record<number, string> = {
  1: import.meta.env.VITE_NOTION_MONTH_ID_JANUARY,
  2: import.meta.env.VITE_NOTION_MONTH_ID_FEBRUARY,
  3: import.meta.env.VITE_NOTION_MONTH_ID_MARCH,
  4: import.meta.env.VITE_NOTION_MONTH_ID_APRIL,
  5: import.meta.env.VITE_NOTION_MONTH_ID_MAY,
  6: import.meta.env.VITE_NOTION_MONTH_ID_JUNE,
  7: import.meta.env.VITE_NOTION_MONTH_ID_JULY,
  8: import.meta.env.VITE_NOTION_MONTH_ID_AUGUST,
  9: import.meta.env.VITE_NOTION_MONTH_ID_SEPTEMBER,
  10: import.meta.env.VITE_NOTION_MONTH_ID_OCTOBER,
  11: import.meta.env.VITE_NOTION_MONTH_ID_NOVEMBER,
  12: import.meta.env.VITE_NOTION_MONTH_ID_DECEMBER,
};

function getDateMonthId(dateString: string): string {
  const month = new Date(dateString).getMonth() + 1;
  return monthIds[month];
}
