"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Button from "@/Components/Button";
import Toast from "@/Components/Toast";

export default function Profile() {
  const { data: session, status, update } = useSession();
  const [name, setName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [showNameForm, setShowNameForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
      setDisplayName(session.user.name);
    }
  }, [session?.user?.name]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleNameUpdate = async () => {
    setToast(null);

    if (!name.trim()) {
      setToast({ message: "Name cannot be empty.", type: "error" });
      return;
    }

    setIsSaving(true);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    setIsSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setToast({
        message: data.error ?? "Failed to update name.",
        type: "error",
      });
      return;
    }

    const trimmedName = name.trim();
    setDisplayName(trimmedName);
    await update?.({ name: trimmedName });
    setShowNameForm(false);
    setToast({ message: "Name updated successfully.", type: "success" });
  };

  const handlePasswordUpdate = async () => {
    setToast(null);

    if (password.length < 6) {
      setToast({
        message: "Password must be at least 6 characters.",
        type: "error",
      });
      return;
    }

    if (password !== confirmPassword) {
      setToast({ message: "Passwords do not match.", type: "error" });
      return;
    }

    setIsSaving(true);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setIsSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setToast({
        message: data.error ?? "Failed to update password.",
        type: "error",
      });
      return;
    }

    setPassword("");
    setConfirmPassword("");
    setToast({ message: "Password updated successfully.", type: "success" });
  };

  const handleExport = async () => {
    setToast(null);

    const res = await fetch("/api/profile");
    if (!res.ok) {
      setToast({ message: "Failed to export data.", type: "error" });
      return;
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "trackify-export.json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleClearData = async () => {
    setToast(null);

    if (!confirm("This will delete all your transactions. Continue?")) {
      return;
    }

    setIsClearing(true);
    const res = await fetch("/api/profile", { method: "DELETE" });
    setIsClearing(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setToast({
        message: data.error ?? "Failed to clear data.",
        type: "error",
      });
      return;
    }

    setToast({ message: "All transactions deleted.", type: "success" });
  };

  if (status === "loading") {
    return <div className="px-16 py-10 text-gray-500">Loading...</div>;
  }

  return (
    <div className="px-16 py-10 text-black">
      <div className="flex items-center justify-center">
        <h1 className="text-2xl font-semibold text-gray-800">My Profile</h1>
      </div>

      <div className="mt-8 mx-auto flex justify-center text-black">
        <section className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="h-20 w-20 rounded-full bg-slate-200" />
            <p className="mt-4 text-sm text-gray-500">
              Name: {displayName || "Your name"}
            </p>
            <p className="mt-2 text-xs text-gray-400">
              Email: {session?.user?.email ?? "-"}
            </p>
          </div>

          <div className="mt-6 flex justify-center gap-3">
            <Button
              onClick={() => setShowNameForm((prev) => !prev)}
              Classname="text-sm font-medium"
            >
              Edit Profile
            </Button>
            <Button
              onClick={() => setShowPasswordForm((prev) => !prev)}
              Classname="text-sm font-medium bg-slate-100 text-gray-700"
            >
              Change Password
            </Button>
          </div>

          {showNameForm ? (
            <div className="mt-6">
              <label className="text-sm text-gray-600">Name</label>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                placeholder="Your name"
              />
              <Button
                onClick={handleNameUpdate}
                loading={isSaving}
                Classname="mt-3 text-sm font-medium"
              >
                Save Name
              </Button>
            </div>
          ) : null}

          {showPasswordForm ? (
            <div className="mt-6 space-y-3">
              <div>
                <label className="text-sm text-gray-600">New password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  placeholder="At least 6 characters"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">
                  Confirm password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  placeholder="Re-enter password"
                />
              </div>
              <Button
                onClick={handlePasswordUpdate}
                loading={isSaving}
                Classname="text-sm font-medium bg-slate-900"
              >
                Update Password
              </Button>
            </div>
          ) : null}
        </section>
      </div>

      {toast ? <Toast message={toast.message} type={toast.type} /> : null}
    </div>
  );
}
