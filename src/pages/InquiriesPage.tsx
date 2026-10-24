import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthContext";
import { AccountGate } from "@/components/shared/AccountGate";
import {
  watchInquiries,
  watchMessages,
  sendMessage,
  type Inquiry,
  type Message,
} from "@/features/marketplace/service";
import { Button } from "@/components/ui/Button";
export default function InquiriesPage() {
  return (
    <AccountGate>
      <Inbox />
    </AccountGate>
  );
}
function Inbox() {
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const [rows, setRows] = useState<Inquiry[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(
    () =>
      watchInquiries(
        user!.uid,
        (r) => {
          setRows(r);
          setLoading(false);
        },
        (e) => {
          setError(e.message);
          setLoading(false);
        },
      ),
    [user],
  );
  const selected = rows.find((r) => r.id === params.get("thread"));
  return (
    <div className="workspace-page">
      <p className="eyebrow">Keep the conversation moving</p>
      <h1 className="mb-3 mt-2 text-3xl font-extrabold">Enquiries & messages</h1>
      <p className="mb-8 text-muted">
        Discuss offers, ask questions and arrange a viewing directly.
      </p>
      {error && (
        <p role="alert" className="text-danger">
          {error}
        </p>
      )}
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="panel">
          {loading ? (
            <p>Loading enquiries…</p>
          ) : rows.length === 0 ? (
            <p className="text-sm text-muted">
              No enquiries yet. Find a car you like and select Buy now, or wait for a buyer to
              contact you.
            </p>
          ) : (
            rows.map((row) => (
              <button
                key={row.id}
                onClick={() => setParams({ thread: row.id })}
                className={`mb-2 w-full rounded-xl p-4 text-left ${selected?.id === row.id ? "bg-brand-tint text-brand" : "bg-surface-2"}`}
              >
                <strong className="block text-sm">{row.carTitle}</strong>
                <span className="mt-1 block text-xs">
                  {row.sellerId === user?.uid ? "Buyer enquiry" : "Your purchase enquiry"}
                </span>
              </button>
            ))
          )}
        </aside>
        {selected ? (
          <Conversation key={selected.id} inquiry={selected} />
        ) : (
          <div className="panel grid min-h-80 place-items-center text-sm text-muted">
            Select a conversation to get started.
          </div>
        )}
      </div>
    </div>
  );
}
function Conversation({ inquiry }: { inquiry: Inquiry }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => watchMessages(inquiry.id, setMessages, (e) => setError(e.message)), [inquiry.id]);
  return (
    <section className="panel flex min-h-[480px] flex-col">
      <div className="border-b border-line pb-4">
        <h2 className="font-bold">{inquiry.carTitle}</h2>
        <a className="text-xs text-brand" href={`/cars/${inquiry.carId}`}>
          View listing →
        </a>
      </div>
      <div
        aria-live="polite"
        className="my-5 flex max-h-[480px] flex-1 flex-col gap-3 overflow-y-auto"
      >
        {!messages.length && (
          <p className="text-sm text-muted">
            Enquiry sent. Introduce yourself and share your offer or questions.
          </p>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm ${m.senderId === user?.uid ? "self-end bg-brand text-white" : "self-start bg-surface-2"}`}
          >
            <p>{m.text}</p>
            <p className="mt-2 text-[10px] opacity-70">
              {m.senderId === user?.uid ? "You" : "Other participant"} ·{" "}
              {m.createdAt
                ?.toDate()
                .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) || "Sending…"}
            </p>
          </div>
        ))}
      </div>
      {error && (
        <p role="alert" className="mb-3 text-sm text-danger">
          {error}
        </p>
      )}
      <form
        className="flex items-end gap-3"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setError("");
          try {
            await sendMessage(inquiry.id, text);
            setText("");
          } catch (e) {
            setError(e instanceof Error ? e.message : "Message failed.");
          } finally {
            setBusy(false);
          }
        }}
      >
        <label className="flex-1">
          <span className="sr-only">Message</span>
          <textarea
            className="field resize-none"
            required
            maxLength={2000}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Ask a question or make an offer…"
          />
        </label>
        <Button type="submit" disabled={busy || !text.trim()}>
          {busy ? "Sending…" : "Send"}
        </Button>
      </form>
    </section>
  );
}
