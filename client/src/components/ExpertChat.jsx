import { useState, useRef, useEffect } from 'react';
import { useI18n } from '../i18n.jsx';

export default function ExpertChat() {
  const { lang } = useI18n();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hi, I am Expert. Ask me anything about crops, prices or this app.' }
  ]);
  const listRef = useRef(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, open]);

  async function ask(question) {
    const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
    const res = await fetch(`${base}/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, lang })
    });
    if (!res.ok) throw new Error('Failed to ask');
    const data = await res.json();
    return data?.answer || 'Sorry, I could not find an answer.';
  }

  async function onSend(e) {
    e?.preventDefault?.();
    const q = input.trim();
    if (!q || busy) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', text: q }]);
    setBusy(true);
    try {
      const a = await ask(q);
      setMessages((m) => [...m, { role: 'assistant', text: a }]);
    } catch (err) {
      setMessages((m) => [...m, { role: 'assistant', text: 'Error: unable to answer right now.' }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {!open ? (
        <button onClick={() => setOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg px-4 py-2 flex items-center gap-2">
          <span>Expert</span>
        </button>
      ) : (
        <div className="w-80 sm:w-96 h-96 bg-white rounded-2xl border border-gray-200 shadow-xl flex flex-col overflow-hidden">
          <div className="bg-emerald-600 text-white px-4 py-3 flex items-center justify-between">
            <div className="font-semibold">Expert</div>
            <button onClick={() => setOpen(false)} className="text-white/90 hover:text-white">✕</button>
          </div>
          <div ref={listRef} className="flex-1 overflow-auto px-3 py-2 space-y-2 bg-emerald-50/40">
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                <div className={`inline-block px-3 py-2 rounded-xl text-sm ${m.role === 'user' ? 'bg-emerald-600 text-white' : 'bg-white border border-gray-200 text-gray-800'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {busy && (
              <div className="text-left">
                <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white border text-sm text-gray-700">
                  <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-emerald-600"></span>
                  <span>Thinking…</span>
                </div>
              </div>
            )}
          </div>
          <form onSubmit={onSend} className="p-3 border-t bg-white flex items-center gap-2">
            <input
              className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Ask Expert…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" disabled={busy} className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg px-3 py-2 text-sm">Send</button>
          </form>
        </div>
      )}
    </div>
  );
}


