import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Loader2, Mail } from 'lucide-react'
import { sendPasswordResetEmail } from 'firebase/auth'
import { toast } from 'sonner'
import { auth } from '@/lib/firebase'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import heroImg from '@/assets/hero.png'
import { ROUTES } from '@/router/routes'

function friendlyResetError(code) {
  switch (code) {
    case 'auth/invalid-email':
      return 'Please enter a valid email address.'
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.'
    default:
      return 'Something went wrong. Please try again.'
  }
}

export default function ForgotPasswordPage() {
  const [searchParams] = useSearchParams()
  const initialEmail = searchParams.get('email') || ''
  const [email, setEmail] = useState(initialEmail)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    const trimmedEmail = email.trim()

    if (!trimmedEmail) {
      toast.error('Please enter your email address.')
      return
    }

    setLoading(true)
    try {
      await sendPasswordResetEmail(auth, trimmedEmail)
      toast.success('Password reset email sent. Check your inbox.')
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        toast.success('If this email exists, a reset link has been sent.')
      } else {
        toast.error(friendlyResetError(err.code))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="relative flex min-h-[calc(100vh-73px)] items-center justify-center bg-cover bg-center py-12"
      style={{ backgroundImage: `url(${heroImg})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />

      <Container className="relative z-10 flex items-center justify-center">
        <div className="w-full max-w-[440px] rounded-primary border border-white/10 bg-surface-elevated/95 p-10 backdrop-blur-sm">
          <Link
            to={ROUTES.LOGIN}
            className="mb-5 inline-flex items-center gap-1 text-xs font-medium text-text-secondary transition-colors hover:text-white"
          >
            <ArrowLeft size={14} />
            Back to Sign In
          </Link>

          <h1 className="mb-1 text-2xl font-black text-white">Reset Password</h1>
          <p className="mb-8 text-sm text-text-secondary">
            Enter your email and we&apos;ll send you a reset link.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              rightSlot={<Mail size={16} className="text-text-muted" />}
            />

            <Button
              type="submit"
              disabled={loading}
              className="h-[52px] w-full gap-2 rounded-primary bg-primary text-base font-bold text-white hover:bg-primary-deep disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Sending link…
                </>
              ) : (
                'Send Reset Link'
              )}
            </Button>
          </form>
        </div>
      </Container>
    </div>
  )
}