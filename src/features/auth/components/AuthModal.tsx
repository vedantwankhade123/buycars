import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { X, CarFront, Mail, ArrowLeft, ArrowRight, Eye, EyeOff } from "lucide-react";
import { auth } from "@/lib/firebase";
import { useAuth } from "../AuthContext";
import { authErrorMessage } from "../services/authService";

function GoogleMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" className="size-5">
      <path
        fill="#4285F4"
        d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11c-.5 2.5-1.9 4.7-4.1 6.1v5h6.6c3.9-3.6 6.1-8.8 6.1-14.8Z"
      />
      <path
        fill="#34A853"
        d="M24 44c5.5 0 10.1-1.8 13.5-4.7l-6.6-5c-1.8 1.2-4.1 1.9-6.9 1.9-5.3 0-9.8-3.6-11.4-8.4H5.8v5.2C9.1 39.6 16 44 24 44Z"
      />
      <path fill="#FBBC05" d="M12.6 27.8a12 12 0 0 1 0-7.6V15H5.8a20 20 0 0 0 0 18l6.8-5.2Z" />
      <path
        fill="#EA4335"
        d="M24 11.8c3 0 5.6 1 7.7 3l5.8-5.7A19.3 19.3 0 0 0 24 4C16 4 9.1 8.4 5.8 15l6.8 5.2c1.6-4.8 6.1-8.4 11.4-8.4Z"
      />
    </svg>
  );
}
export function AuthModal({
  onClose,
  onGoogle,
}: {
  onClose: () => void;
  onGoogle: () => Promise<void>;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const { user } = useAuth();
  const [signup, setSignup] = useState(false);
  const [step, setStep] = useState<"choose" | "email" | "reset">("choose");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    dialog.current?.showModal();
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = old;
      previous?.focus();
    };
  }, []);
  useEffect(() => {
    if (user) onClose();
  }, [user, onClose]);
  function changeStep(next: typeof step) {
    setStep(next);
    setError("");
    setNotice("");
  }
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    const data = new FormData(e.currentTarget);
    try {
      if (!auth) throw new Error("Sign-in is currently unavailable.");
      const email = String(data.get("email")).trim();
      if (step === "reset") {
        await sendPasswordResetEmail(auth, email);
        setNotice("Check your email for a reset link.");
      } else if (signup) {
        await createUserWithEmailAndPassword(auth, email, String(data.get("password")));
      } else {
        await signInWithEmailAndPassword(auth, email, String(data.get("password")));
      }
    } catch (e) {
      setError(authErrorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  async function google() {
    setBusy(true);
    setError("");
    try {
      await onGoogle();
    } finally {
      setBusy(false);
    }
  }
  return createPortal(
    <dialog
      ref={dialog}
      className="auth-dialog"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === dialog.current) onClose();
      }}
      aria-labelledby="auth-title"
      aria-describedby="auth-description"
    >
      <div className="auth-content">
        <button aria-label="Close sign-in" onClick={onClose} className="auth-close">
          <X size={19} />
        </button>
        <div className="auth-brand">
          <CarFront aria-hidden="true" size={23} />
        </div>
        <h2
          id="auth-title"
          className="text-center text-[28px] font-semibold leading-tight tracking-tight"
        >
          {step === "reset"
            ? "Forgot your password?"
            : signup
              ? "Join BuyCars"
              : "Welcome to BuyCars"}
        </h2>
        <p id="auth-description" className="auth-subtitle">
          {step === "reset"
            ? "We'll help you get back on the road."
            : "One account. Your next chapter."}
        </p>
        {step !== "reset" && (
          <div className="auth-tabs" role="group" aria-label="Account access">
            {[false, true].map((mode) => (
              <button
                key={String(mode)}
                aria-pressed={signup === mode}
                disabled={busy}
                onClick={() => {
                  setSignup(mode);
                  setError("");
                  setNotice("");
                }}
                className={signup === mode ? "is-selected" : ""}
              >
                {mode ? "Sign up" : "Sign in"}
              </button>
            ))}
          </div>
        )}
        {step === "choose" ? (
          <div className="auth-options">
            <button className="auth-action auth-email" onClick={() => changeStep("email")}>
              <Mail aria-hidden="true" size={18} />
              Continue with email
              <ArrowRight aria-hidden="true" size={17} />
            </button>
            <button
              className="auth-action auth-google"
              disabled={busy}
              onClick={() => void google()}
            >
              <GoogleMark />
              {busy ? "Connecting…" : "Continue with Google"}
            </button>
          </div>
        ) : (
          <>
            <form ref={form} onSubmit={(e) => void submit(e)} className="auth-email-form">
              <label htmlFor="auth-email">Email address</label>
              <input
                id="auth-email"
                name="email"
                type="email"
                autoFocus
                required
                autoComplete="email"
                placeholder="you@example.com"
              />
              {step !== "reset" && (
                <>
                  <div className="flex items-center justify-between">
                    <label htmlFor="auth-password">Password</label>
                    {!signup && (
                      <button
                        type="button"
                        className="auth-text-link"
                        onClick={() => changeStep("reset")}
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      id="auth-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={signup ? 8 : 1}
                      autoComplete={signup ? "new-password" : "current-password"}
                      placeholder={signup ? "At least 8 characters" : "Your password"}
                      className="w-full pr-12"
                    />
                    <button
                      className="absolute inset-y-0 right-3 text-muted"
                      type="button"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </>
              )}
              <button className="auth-action auth-email" type="submit" disabled={busy}>
                {busy
                  ? "Please wait…"
                  : step === "reset"
                    ? "Send reset link"
                    : signup
                      ? "Create account"
                      : "Sign in"}
                <ArrowRight aria-hidden="true" size={17} />
              </button>
            </form>
            <button className="auth-back" disabled={busy} onClick={() => changeStep("choose")}>
              <ArrowLeft aria-hidden="true" size={14} />
              Other ways to continue
            </button>
            {step === "email" && (
              <button
                className="auth-action auth-google auth-google-compact"
                disabled={busy}
                onClick={() => void google()}
              >
                <GoogleMark />
                Continue with Google
              </button>
            )}
          </>
        )}
        {error && (
          <p role="alert" className="auth-feedback text-danger">
            {error}
          </p>
        )}
        {notice && (
          <p role="status" className="auth-feedback text-success">
            {notice}
          </p>
        )}
        <p className="auth-legal">
          By continuing, you agree to our <a href="/terms">terms</a> and{" "}
          <a href="/privacy">privacy policy</a>.
        </p>
      </div>
    </dialog>,
    document.body,
  );
}
