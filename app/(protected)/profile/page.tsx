"use client";

import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Button from "@/Components/Button";
import Toast from "@/Components/Toast";
import { CircleUserRound, Download } from "lucide-react";
export default function Profile() {
  const { data: session, status, update } = useSession();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showNameForm, setShowNameForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

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

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setToast({
        message: data.error ?? "Failed to update name.",
        type: "error",
      });
      return;
    }

    const trimmedName = name.trim();
    const nextName = data?.user?.name ?? trimmedName;
    setName(nextName);
    await update?.({ name: nextName });
    setShowNameForm(false);
    setToast({ message: "Name updated successfully.", type: "success" });
  };

  const handlePasswordUpdate = async () => {
    setToast(null);

    if (password.length < 3) {
      setToast({
        message: "Password must be at least 3 characters.",
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
    setShowPasswordForm(false);
    setToast({ message: "Password updated successfully.", type: "success" });
  };

  const handleExportData = async () => {
    setToast(null);
    setIsExporting(true);
    try {
      const res = await fetch("/api/profile");
      if (!res.ok) {
        throw new Error("Failed to export data");
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "trackify-export.json";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setToast({ message: "Data exported successfully.", type: "success" });
    } catch (err: any) {
      setToast({
        message: err.message || "Failed to export data.",
        type: "error",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  if (status === "loading") {
    return <div className="px-16 py-10 text-gray-500">Loading...</div>;
  }

  return (
    <div className="px-16 py-10 text-black mt-10">
      <div className="flex items-center justify-center">
        <h1 className="text-2xl font-semibold text-gray-800">My Profile</h1>
      </div>

      <div className="mt-8 mx-auto flex justify-center text-black">
        <section className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-slate-200 bg-slate-50">
              <CircleUserRound className="text-slate-500" size={80} />
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Name: {(session?.user?.name ?? name) || "Your name"}
            </p>
            <p className="mt-2 text-xs text-gray-400">
              Email: {session?.user?.email ?? "-"}
            </p>
          </div>

          <div className="mt-6 flex justify-center gap-3">
            <Button
              onClick={() => {
                setName(session?.user?.name ?? "");
                setShowNameForm((prev) => !prev);
              }}
              Classname="text-sm font-medium"
            >
              Edit Profile
            </Button>
            <Button
              onClick={() => setShowPasswordForm((prev) => !prev)}
              Classname="text-sm font-medium  text-white"
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
                Classname="text-sm font-medium "
              >
                Update Password
              </Button>
            </div>
          ) : null}

          <div className="mt-6 flex justify-center gap-3">
            <Button
              onClick={handleExportData}
              loading={isExporting}
              Classname="text-sm font-medium bg-indigo-600 flex items-center justify-center gap-2"
            >
              <Download size={16} />
              Export Data
            </Button>
            <Button
              onClick={handleLogout}
              Classname="text-sm font-medium bg-rose-500"
            >
              Logout
            </Button>
          </div>
        </section>
      </div>

      {toast ? <Toast message={toast.message} type={toast.type} /> : null}
    </div>
  );
}
