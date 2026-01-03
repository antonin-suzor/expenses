interface ExpenseEntry {
  amount: number;
  name: string;
  tag: string;
  date: Date;
}

export async function createNotionEntry(password: string, expense: ExpenseEntry): Promise<Response> {
  return fetch(`${import.meta.env.VITE_BACKEND_HOST}/api/`, {
    method: 'POST',
    headers: {
      'X-Custom-Password': password,
    },
    body: JSON.stringify({ ...expense, date: expense.date.toJSON().substring(0, 10) }),
  });
}
