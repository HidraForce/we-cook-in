"use client";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
    const supabase = createClient();
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    async function handleSubmit() {
        setError("");
        setLoading(true);

        if (isLogin) {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) return setError(error.message);
            router.push("/dashboard");
        } else {
            if (password !== confirmPassword) { setError("Passwords don't match"); setLoading(false); return; }

            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                }
            });
            if (error) { setError(error.message); setLoading(false); return; }

            // Don't redirect yet — tell them to check email
            setLoading(false);
            setError("");
            alert("Check your email and click the confirmation link to continue!");
        }

        setLoading(false);
    }

    return (
        <div className="min-h-screen bg-amber-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">

                {/* Toggle */}
                <div className="flex rounded-xl overflow-hidden mb-6 border border-amber-200">
                    <button
                        onClick={() => { setIsLogin(true); setError(""); }}
                        className={`flex-1 py-2 text-sm font-medium transition-colors ${isLogin ? "bg-amber-500 text-white" : "text-gray-500 hover:bg-amber-50"
                            }`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => { setIsLogin(false); setError(""); }}
                        className={`flex-1 py-2 text-sm font-medium transition-colors ${!isLogin ? "bg-amber-500 text-white" : "text-gray-500 hover:bg-amber-50"
                            }`}
                    >
                        Sign Up
                    </button>
                </div>

                <h1 className="text-2xl font-bold text-gray-800 mb-6">
                    {isLogin ? "Welcome back!" : "Create account"}
                </h1>

                <div className="flex flex-col gap-4">
                    <input
                        className="border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-amber-400"
                        placeholder="Email"
                        type="email"
                        onChange={e => setEmail(e.target.value)}
                    />
                    <input
                        className="border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-amber-400"
                        placeholder="Password"
                        type="password"
                        onChange={e => setPassword(e.target.value)}
                    />
                    {!isLogin && (
                        <>
                            <input
                                className="border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-amber-400"
                                placeholder="Confirm Password"
                                type="password"
                                onChange={e => setConfirmPassword(e.target.value)}
                            />
                        </>

                    )}

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-amber-500 hover:bg-amber-600 text-white p-3 rounded-xl font-medium transition-colors disabled:opacity-50"
                    >
                        {loading ? "Loading..." : isLogin ? "Login" : "Sign Up"}
                    </button>

                    {isLogin && (
                        <button className="text-sm text-amber-500 hover:underline text-center">
                            Forgot password?
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}