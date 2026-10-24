import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthContext";
import { AccountGate } from "@/components/shared/AccountGate";
import { getProfile, saveProfile } from "@/features/marketplace/service";
import { Button } from "@/components/ui/Button";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";
export default function AccountPage() {
  return (
    <AccountGate>
      <Account />
    </AccountGate>
  );
}
function Account() {
  const { user } = useAuth();
  const location = useLocation();
  const settings = location.pathname === "/settings";
  const [profile, setProfile] = useState({
    name: user?.displayName || "",
    city: "",
    intent: "both",
    sellerOnboarded: false,
  });
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    void getProfile(user!.uid)
      .then((p) => {
        if (p) setProfile(p);
        setLoaded(true);
      })
      .catch((e) => setError(e.message));
  }, [user]);
  return (
    <div className="workspace-page max-w-3xl">
      <p className="eyebrow">Your BuyCars</p>
      <h1 className="mt-2 text-3xl font-extrabold">{settings ? "Settings" : "Your account"}</h1>
      <p className="my-4 text-muted">{user?.email}</p>
      {error && (
        <p role="alert" className="text-danger">
          {error}
        </p>
      )}
      <form
        className="panel grid gap-5"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          try {
            await saveProfile(profile);
            toast.success("Account updated");
          } catch (e) {
            setError(e instanceof Error ? e.message : "Could not save.");
          } finally {
            setBusy(false);
          }
        }}
      >
        <label>
          Full name
          <input
            className="field"
            required
            maxLength={80}
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />
        </label>
        <label>
          City
          <input
            className="field"
            required
            maxLength={80}
            value={profile.city}
            onChange={(e) => setProfile({ ...profile, city: e.target.value })}
          />
        </label>
        <label>
          I'm here to
          <select
            className="field"
            value={profile.intent}
            onChange={(e) => setProfile({ ...profile, intent: e.target.value })}
          >
            <option value="buy">Buy a car</option>
            <option value="sell">Sell a car</option>
            <option value="both">Buy and sell</option>
          </select>
        </label>
        <Button type="submit" disabled={busy || !loaded}>
          {busy ? "Saving…" : "Save changes"}
        </Button>
      </form>
      <div className="mt-6 flex flex-wrap gap-4">
        <a className="text-brand" href="/cars">
          Buy a car →
        </a>
        <a className="text-brand" href="/sell">
          Sell a car →
        </a>
        <a className="text-brand" href="/inquiries">
          My enquiries →
        </a>
      </div>
      {settings && (
        <div className="panel mt-8">
          <h2 className="font-bold">Account security</h2>
          <p className="my-3 text-sm text-muted">
            Google accounts manage their password through Google.
          </p>
          <Button
            variant="secondary"
            onClick={async () => {
              try {
                if (auth && user?.email) {
                  await sendPasswordResetEmail(auth, user.email);
                  toast.success("Password reset email requested");
                }
              } catch {
                toast.error("Could not request reset.");
              }
            }}
          >
            Request password reset
          </Button>
        </div>
      )}
    </div>
  );
}
