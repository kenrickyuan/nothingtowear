import { useState } from "react";
import { supabase } from "../../utils";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (email) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signIn({ email, password });
      if (error) throw error;
      alert("Check your email for the login link!");
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
        <p className="text-grey">Sign in to access your sneaker collection</p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            className="w-full border border-lightGrey rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Password</label>
          <input
            className="w-full border border-lightGrey rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>
      <div className="mt-6">
        <button
          onClick={(e) => {
            e.preventDefault();
            handleLogin(email);
          }}
          className="w-full button bg-black text-white py-3 rounded-md hover:bg-grey transition-colors disabled:opacity-50"
          disabled={loading}
        >
          <span>{loading ? "Signing in..." : "Sign In"}</span>
        </button>
      </div>
    </div>
  );
}
