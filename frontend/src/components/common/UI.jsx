import { ArrowUpRight, Sparkles } from 'lucide-react'

export const Page = ({ children, className = '' }) => <div className={`app-page ${className}`}>{children}</div>
export const Container = ({ children, className = '' }) => <div className={`app-container ${className}`}>{children}</div>
export const Card = ({ children, className = '', glow = false }) => <section className={`ui-card ${glow ? 'ui-card-glow' : ''} ${className}`}>{children}</section>
export const Eyebrow = ({ children, icon: Icon = Sparkles }) => <div className="eyebrow"><Icon size={14} />{children}</div>
export const Button = ({ children, variant = 'primary', className = '', ...props }) => <button className={`ui-btn ui-btn-${variant} ${className}`} {...props}>{children}</button>
export const Badge = ({ children, tone = 'neutral' }) => <span className={`ui-badge ui-badge-${tone}`}>{children}</span>
export const ProgressBar = ({ value = 0, tone = 'primary', label }) => <div>{label && <div className="progress-label"><span>{label}</span><b>{Math.round(value)}%</b></div>}<div className="progress-track"><div className={`progress-fill ${tone}`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} /></div></div>
export const ScoreRing = ({ value = 0, size = 124, label = 'readiness' }) => <div className="score-ring" style={{ '--score': `${Math.max(0, Math.min(100, value)) * 3.6}deg`, width: size, height: size }}><div className="score-ring-inner"><strong>{Math.round(value)}</strong><span>{label}</span></div></div>
export const SectionHeading = ({ eyebrow, title, description, action }) => <div className="section-heading"><div>{eyebrow && <div className="eyebrow mb-2">{eyebrow}</div>}<h2>{title}</h2>{description && <p>{description}</p>}</div>{action}</div>
export const ArrowLink = ({ children, ...props }) => <a className="arrow-link" {...props}>{children}<ArrowUpRight size={16}/></a>
export const Skeleton = ({ className = '' }) => <div className={`skeleton ${className}`} />
