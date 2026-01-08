import React, { useState } from 'react';
import { Package } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const AuthPage = () => {
  const { login, register, showNotification } = useApp();
  
  const [isLogin, setIsLogin] = useState(true);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleLogin = (e) => {
    e.preventDefault();
    const result = login(loginForm.email, loginForm.password);
    if (!result.success) {
      showNotification(result.error, 'error');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const result = register(
      registerForm.name,
      registerForm.email,
      registerForm.password
    );
    if (!result.success) {
      showNotification(result.error, 'error');
    } else {
      showNotification('Account created successfully!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-2xl shadow-amber-500/30 mb-6">
            <Package size={40} className="text-white" />
          </div>
          <h1
            className="text-4xl font-bold text-white tracking-tight"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            StockFlow
          </h1>
          <p className="text-slate-400 mt-2 text-lg">
            Restaurant Inventory Management
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
          {isLogin ? (
            <form onSubmit={handleLogin} className="space-y-6">
              <h2 className="text-2xl font-semibold text-white mb-6">
                Welcome back
              </h2>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, email: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, password: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40"
              >
                Sign In
              </button>

              <p className="text-center text-slate-400 mt-6">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="text-amber-400 hover:text-amber-300 font-medium transition-colors"
                >
                  Create one
                </button>
              </p>

              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-xs text-slate-500 text-center">
                  Demo: owner@restaurant.com / demo123
                </p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-6">
              <h2 className="text-2xl font-semibold text-white mb-6">
                Create your account
              </h2>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={registerForm.name}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, name: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all"
                  placeholder="John Smith"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={registerForm.email}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, email: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={registerForm.password}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      password: e.target.value
                    })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40"
              >
                Create Account
              </button>

              <p className="text-center text-slate-400 mt-6">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="text-amber-400 hover:text-amber-300 font-medium transition-colors"
                >
                  Sign in
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
