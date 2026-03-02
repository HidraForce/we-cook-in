"use client";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function OnboardingPage() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    full_name: "",
    username: "",
    birth: "",
    address: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit() {
    setError("");
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return router.push("/login");

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      ...form,
    });

    if (error) return setError(error.message);
    router.push("/dashboard");
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Complete your profile</h1>
        <p className="text-gray-500 text-sm mb-6">Just a few more details to get started</p>

        <div className="flex flex-col gap-4">
          <input
            name="full_name"
            className="border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-amber-400"
            placeholder="Full Name"
            onChange={handleChange}
          />
          <input
            name="username"
            className="border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-amber-400"
            placeholder="Username"
            onChange={handleChange}
          />
          <input
            name="birth"
            type="date"
            className="border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-amber-400"
            onChange={handleChange}
          />
          <input
            name="address"
            className="border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-amber-400"
            placeholder="Address"
            onChange={handleChange}
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-amber-500 hover:bg-amber-600 text-white p-3 rounded-xl font-medium transition-colors disabled:opacity-50"
          >
            {loading ? "Saving..." : "Complete Setup"}
          </button>
        </div>
      </div>
    </div>
  );
}