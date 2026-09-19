import { Link } from 'react-router-dom'

export function LogoMark({ size = 40, className = '', title = 'StudentHub' }) {
  return (
    <span className={`studenthub-mark ${className}`} style={{ width: size, height: size }} aria-label={title} role="img">
      <svg viewBox="0 0 48 48" width="100%" height="100%" aria-hidden="true">
        <defs>
          <linearGradient id="studenthubMarkGradient" x1="7" y1="41" x2="39" y2="5" gradientUnits="userSpaceOnUse">
            <stop stopColor="#22D3EE" />
            <stop offset="0.5" stopColor="#4F7CFF" />
            <stop offset="1" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
        <path d="M33.7 5.6 14.2 16.7a6.8 6.8 0 0 0-2.5 9.3l4.1 7.1 9.8-5.6-2.1-3.7 8.1-4.6 4.8 8.3-9.9 5.7-4.6 2.7a6.8 6.8 0 0 1-9.3-2.5L7.8 26a6.8 6.8 0 0 1 2.5-9.3L30.1 5.6a2.5 2.5 0 0 1 3.6 0Z" fill="url(#studenthubMarkGradient)" />
        <path d="m14.5 42.1 19.3-11.1a6.8 6.8 0 0 0 2.5-9.3l-4.1-7.1-9.8 5.6 2.1 3.7-8.1 4.6-4.8-8.3 9.9-5.7 4.6-2.7a6.8 6.8 0 0 1 9.3 2.5l4.8 8.3a6.8 6.8 0 0 1-2.5 9.3L18.1 42.1a2.5 2.5 0 0 1-3.6 0Z" fill="url(#studenthubMarkGradient)" opacity=".92" />
        <path d="m37.3 3.5 1.1 3.1 3.1 1.1-3.1 1.1-1.1 3.1-1.1-3.1-3.1-1.1 3.1-1.1 1.1-3.1Z" fill="#22D3EE" />
      </svg>
    </span>
  )
}

export function Logo({ to = '/', size = 40, dark = false, compact = false, className = '' }) {
  return (
    <Link to={to} className={`studenthub-logo ${dark ? 'studenthub-logo-dark' : ''} ${compact ? 'studenthub-logo-compact' : ''} ${className}`} aria-label="StudentHub home">
      <LogoMark size={size} />
      {!compact && <span className="studenthub-wordmark"><strong>Student</strong><em>Hub</em><small>AI CAREER OPERATING SYSTEM</small></span>}
    </Link>
  )
}

export function BrandIcon({ size = 24, className = '' }) {
  return <LogoMark size={size} className={className} />
}
