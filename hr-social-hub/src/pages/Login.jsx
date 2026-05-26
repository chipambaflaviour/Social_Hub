import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useStore } from "../store/useStore";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [contact, setContact] = useState("");
  const [country, setCountry] = useState("");
  const [department, setDepartment] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        // Fetch profile
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();

        if (!profile || profileError) {
          await supabase.auth.signOut();
          throw new Error("This account has been deleted.");
        }

        useStore.setState({
          user: {
            ...profile,
            email: data.user.email,
            isAdmin: profile.is_admin || false,
          },
        });
        navigate("/");
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;

        // Insert into profiles
        if (data.user) {
          await supabase.from("profiles").insert([
            {
              id: data.user.id,
              name: fullName,
              email: email,
              contact: contact,
              department: department,
              country: country,
              is_admin: false,
            },
          ]);
          useStore.setState({
            user: {
              name: fullName,
              email: email,
              contact: contact,
              department: department,
              country: country,
              avatar: "https://via.placeholder.com/150",
              isAdmin: false,
            },
          });
          navigate("/");
        }
      }
    } catch (err) {
      setErrorMsg(err.message || "An error occurred during authentication.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative bg-black">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80"
        style={{ backgroundImage: "url('/dark_login_bg.png')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/80 backdrop-blur-sm"></div>
      </div>

      {/* Form Container */}
      <div className="relative z-10 w-full max-w-md p-8 md:p-10 mx-4 bg-surface-container-lowest/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 text-white">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-black font-sans tracking-tight mb-2 text-center">
            <span className="text-red-600">Axis</span>
            <span className="text-white">Solutions</span>
            <span className="block text-xl md:text-2xl mt-1 text-white/80 font-light tracking-widest uppercase text-sm md:text-base">
              Northern Region Social Hub
            </span>
          </h1>
          <p className="text-white/70 font-body-md">
            {isLogin
              ? "Welcome back. Sign in to continue."
              : "Create an account to join the network."}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 bg-error/20 border border-error/50 text-error-container px-4 py-3 rounded-lg text-sm text-center">
            {errorMsg}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {!isLogin && (
            <div className="md:col-span-2">
              <label className="block font-label-sm uppercase tracking-wider mb-1 text-white/70">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed transition-colors"
                placeholder="Alex Sterling"
                required
              />
            </div>
          )}

          <div className={!isLogin ? "md:col-span-1" : "md:col-span-2"}>
            <label className="block font-label-sm uppercase tracking-wider mb-1 text-white/70">
              Work Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed transition-colors"
              placeholder="alex@company.com"
              required
            />
          </div>

          {!isLogin && (
            <div className="md:col-span-1">
              <label className="block font-label-sm uppercase tracking-wider mb-1 text-white/70">
                Contact Number
              </label>
              <input
                type="tel"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed transition-colors"
                placeholder="+260 97..."
                required
              />
            </div>
          )}

          {!isLogin && (
            <>
              <div className="md:col-span-1">
                <label className="block font-label-sm uppercase tracking-wider mb-1 text-white/70">
                  Country
                </label>
                <select
                  className="w-full bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed transition-colors"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  <option
                    value=""
                    disabled
                    className="bg-gray-900 text-white/70"
                  >
                    Select Country
                  </option>
                  <option value="Zambia" className="bg-gray-900">
                    Zambia
                  </option>
                  <option value="Angola" className="bg-gray-900">
                    Angola
                  </option>
                  <option value="South Sudan" className="bg-gray-900">
                    South Sudan
                  </option>
                  <option value="Mozambique" className="bg-gray-900">
                    Mozambique
                  </option>
                  <option value="DRC" className="bg-gray-900">
                    DRC
                  </option>
                </select>
              </div>
              <div className="md:col-span-1">
                <label className="block font-label-sm uppercase tracking-wider mb-1 text-white/70">
                  Department
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed transition-colors"
                  placeholder="e.g. Engineering"
                  required
                />
              </div>
            </>
          )}

          <div className="md:col-span-2">
            <label className="block font-label-sm uppercase tracking-wider mb-1 text-white/70">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="md:col-span-2 mt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary-container disabled:opacity-50 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-lg hover:shadow-primary/50"
            >
              {isLoading
                ? "Processing..."
                : isLogin
                  ? "Sign In"
                  : "Create Account"}
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-white/70 font-body-md">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary-fixed hover:text-white font-bold transition-colors ml-1"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
