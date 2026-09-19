import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Menu, X, User, LogOut } from 'lucide-react'
import { Logo } from '../branding/Logo'
import { useState } from 'react'

export default function Navbar() {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const role = profile?.role
  const home = role === 'admin' ? '/admin' : role === 'company' ? '/company/dashboard' : '/dashboard'
  const student = role === 'student' || !role
  const links = student && user ? [
    ['/dashboard','Dashboard'], ['/jobs','Jobs'], ['/career','Career Intelligence'], ['/career/journey','Career Journey'], ['/dashboard/applications','Applications'], ['/career/interview','Interview'], ['/career/counselors','Career Counselling'], ['/discounts','Student Discounts'], ['/dashboard/profile','Profile']
  ] : [['/jobs','Jobs'],['/career','Career Intelligence']]
  const logout = async () => { await signOut(); setOpen(false); navigate('/login') }
  return <header className="app-topbar">
    <div className="app-container app-nav">
      <Logo to={home} size={40} />
      <nav className="nav-links" aria-label="Primary navigation">{links.map(([to,label])=><Link key={to} className={`nav-link ${location.pathname===to || (to!=='/'&&location.pathname.startsWith(to+'/'))?'bg-gray-100 text-gray-900':''}`} to={to}>{label}</Link>)}</nav>
      <div className="nav-actions">
        {user ? <>
          <Link className="nav-link desktop-only" to={role==='company'?'/company/dashboard':role==='admin'?'/admin':'/dashboard/profile'}><User size={15} className="inline mr-1"/>{profile?.company_name || profile?.full_name?.split(' ')[0] || 'Account'}</Link>
          <button className="ui-btn ui-btn-secondary desktop-only" onClick={logout}><LogOut size={15}/>Sign out</button>
        </> : <><Link className="nav-link desktop-only" to="/login">Sign in</Link><Link className="ui-btn ui-btn-primary desktop-only" to="/register">Get started</Link></>}
        <button className="ui-btn ui-btn-secondary nav-mobile" aria-label="Open navigation" onClick={()=>setOpen(!open)}>{open?<X size={19}/>:<Menu size={19}/>}</button>
      </div>
    </div>
    {open && <div className="lg:hidden border-t bg-white"><div className="app-container py-3 grid gap-1">{user && <Link onClick={()=>setOpen(false)} className="nav-link" to={home}>Dashboard</Link>}{links.map(([to,label])=><Link onClick={()=>setOpen(false)} className="nav-link" key={to} to={to}>{label}</Link>)}{user?<button className="nav-link text-left text-red-600" onClick={logout}>Sign out</button>:<Link className="nav-link" to="/login" onClick={()=>setOpen(false)}>Sign in</Link>}</div></div>}
  </header>
}
