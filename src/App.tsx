import { useEffect, useState } from 'react';

// First is default
const EXPENSE_TAGS = [
  'Other',
  'Rent/Mortgage',
  'Utilities',
  'Groceries',
  'Dining Out',
  'Healthcare',
  'Transportation',
  'Insurance',
  'Entertainment',
  'Retail',
];

// First is default
const INCOME_TAGS = ['Bonus', 'Salary', 'Freelance', 'Dividends', 'Interests', 'Side Hustle'];

export default function App() {
  const [passwordEntry, setPasswordEntry] = useState('');
  const [password, setPassword] = useState('');

  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [tag, setTag] = useState(EXPENSE_TAGS[0]);
  const [date, setDate] = useState(new Date().toJSON().substring(0, 10));
  const [loading, setLoading] = useState(false);
  const [isIncome, setIsIncome] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const handleSubmitPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordEntry.trim()) {
      setPassword(passwordEntry);
      try {
        localStorage.setItem('EXPENSES_PASSWORD', passwordEntry);
      } catch {}
    }
  };

  const handleLogout = () => {
    setPassword('');
    try {
      localStorage.removeItem('EXPENSES_PASSWORD');
    } catch {}
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const switchExpensesIncome = () => {
    setIsIncome(!isIncome);
    if (isIncome) {
      setTag(INCOME_TAGS[0]);
    } else {
      setTag(EXPENSE_TAGS[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !name) {
      showNotification('error', 'Please fill in all fields');
      return;
    }
    setLoading(true);

    const res = await fetch(`${import.meta.env.VITE_BACKEND_HOST}/api/`, {
      method: 'POST',
      headers: {
        'X-Custom-Password': password,
      },
      body: JSON.stringify({
        amount: parseFloat(amount),
        name,
        tag,
        date,
        income: isIncome,
      }),
    });
    if (res.ok) {
      showNotification('success', `${isIncome ? 'Income' : 'Expense'} added successfully!`);
      setAmount('');
      setName('');
      setTag('Other');
      setDate(new Date().toJSON().substring(0, 10));
    } else {
      showNotification('error', `Failed to add ${isIncome ? 'income' : 'expense'}`);
    }
    setLoading(false);
  };

  useEffect(() => {
    try {
      setPassword(localStorage.getItem('EXPENSES_PASSWORD') ?? '');
    } catch {}
  }, []);

  return password == '' ? (
    <div className="to-primary-focus flex min-h-screen items-center justify-center bg-linear-to-br from-primary p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="card-title text-center text-2xl">Expense Tracker</h1>
          <p className="mt-2 text-center text-sm text-base-content/70">Enter your secret password to get started</p>

          <form onSubmit={handleSubmitPassword} className="mt-6 space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Your password</span>
              </label>
              <input
                type="password"
                placeholder="password..."
                className="input-bordered input w-full"
                value={passwordEntry}
                onChange={(e) => setPasswordEntry(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn w-full btn-primary" disabled={!passwordEntry.trim()}>
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  ) : (
    <div className="min-h-screen bg-base-200 p-4 pb-20">
      <div className="mx-auto max-w-md">
        {/* Header */}
        <div className="mt-4 mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">{isIncome ? 'Income' : 'Expenses'}</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={switchExpensesIncome}
                className="btn btn-outline btn-sm"
                title={isIncome ? 'Switch to expenses' : 'Switch to income'}
              >
                {isIncome ? 'Switch to Expenses' : 'Switch to Income'}
              </button>
              <button onClick={handleLogout} className="btn btn-ghost btn-sm" title="Logout">
                Log Out
              </button>
            </div>
          </div>
        </div>

        {/* Notification */}
        {notification && (
          <div className={`mb-4 alert ${notification.type === 'success' ? 'alert-success' : 'alert-error'}`}>
            <span>{notification.message}</span>
          </div>
        )}

        {/* Form Card */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Input */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Description</span>
                </label>
                <input
                  type="text"
                  placeholder={isIncome ? 'e.g., Salary deposit' : 'e.g., Coffee at Starbucks'}
                  className="input-bordered input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              {/* Amount Input */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Amount</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="input-bordered input text-lg font-semibold"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              {/* Tag Select */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Tag</span>
                </label>
                <select
                  className="select-bordered select"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  disabled={loading}
                >
                  {(isIncome ? INCOME_TAGS : EXPENSE_TAGS).map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Input */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Date</span>
                </label>
                <input
                  type="date"
                  className="input-bordered input"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  disabled={loading}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn mt-6 btn-block text-lg btn-primary"
                disabled={loading || !amount || !name}
              >
                {loading ? (
                  <>
                    <span className="loading loading-sm loading-spinner"></span>
                    Adding...
                  </>
                ) : (
                  `Add ${isIncome ? 'Income' : 'Expense'}`
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
