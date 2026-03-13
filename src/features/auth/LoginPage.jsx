import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useAuthForm } from './useAuthForm'
import heroImg from '@/assets/hero.png'
import { ROUTES } from '@/router/routes'

export default function LoginPage() {
  const { fields, handleChange, handleSubmit, loading, error } = useAuthForm('login')
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div
      className="relative flex min-h-[calc(100vh-73px)] items-center justify-center bg-cover bg-center px-4 py-12"
      style={{ backgroundImage: `url(${heroImg})` }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-[440px] rounded-xl border border-white/10 bg-surface-elevated/95 p-10 backdrop-blur-sm">
        <h1 className="mb-1 text-2xl font-black text-white">Welcome Back</h1>
        <p className="mb-8 text-sm text-text-secondary">Your cinematic journey continues.</p>

        {error && (
          <p className="mb-5 rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary-soft">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Email */}
          <div className="flex flex-col gap-[6px]">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={fields.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="h-[46px] rounded-md border border-surface-border bg-surface-elevated px-3 text-sm text-white transition-colors placeholder:text-text-muted focus:border-primary focus:outline-none"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-[6px]">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
                Password
              </label>
              <span className="cursor-default text-[11px] font-medium text-primary">
                Forgot?
              </span>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={fields.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="h-[46px] w-full rounded-md border border-surface-border bg-surface-elevated px-3 pr-10 text-sm text-white transition-colors placeholder:text-text-muted focus:border-primary focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Remember me */}
          <label className="flex cursor-pointer items-center gap-2 text-sm text-text-secondary">
            <input
              type="checkbox"
              name="rememberMe"
              checked={fields.rememberMe}
              onChange={handleChange}
              className="h-4 w-4 accent-primary"
            />
            Remember me for 30 days
          </label>

          {/* Sign in */}
          <button
            type="submit"
            disabled={loading}
            className="mt-1 flex h-[52px] w-full items-center justify-center gap-2 rounded-lg bg-primary text-base font-bold text-white transition-colors hover:bg-primary-deep disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign In'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        {/* OR divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-text-muted">or</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        {/* Sign up link */}
        <p className="mb-6 text-center text-sm text-text-secondary">
          Don't have an account?{' '}
          <Link to={ROUTES.SIGNUP} className="font-bold text-primary hover:underline">
            Create Account
          </Link>
        </p>

        {/* Social placeholder buttons */}
        <div className="flex justify-center gap-3">
          {['G', '𝕏', '▶'].map((label, i) => (
            <button
              key={i}
              type="button"
              disabled
              className="flex h-[46px] w-[46px] items-center justify-center rounded-lg border border-surface-border bg-surface-elevated text-sm text-text-secondary opacity-60"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
