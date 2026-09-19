import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LayoutDashboard, Briefcase, User, Bookmark, FileText, LogOut, Sparkles, Route, Mic2, Menu, X, Building2, ShieldCheck } from 'lucide-react'
import { Logo } from '../branding/Logo'
import { useState } from 'react'
import Navbar from '../common/Navbar'

export default function DashboardLayout(){
 const {profile,signOut}=useAuth(); const navigate=useNavigate(); const [open,setOpen]=useState(false); const isAdmin=profile?.role==='admin'; const isCompany=profile?.role==='company'
 const studentLinks=[['/dashboard',LayoutDashboard,'Dashboard'],['/jobs',Briefcase,'Jobs'],['/career',Sparkles,'Career Intelligence'],['/career/journey',Route,'Career Journey'],['/dashboard/applications',FileText,'Applications'],['/career/interview',Mic2,'Interview'],['/dashboard/profile',User,'Profile'],['/dashboard/saved',Bookmark,'Saved jobs']]
 const companyLinks=[['/company/dashboard',LayoutDashboard,'Company dashboard'],['/company/jobs/new',Briefcase,'Publish job']]
 const adminLinks=[['/admin',ShieldCheck,'Admin dashboard'],['/admin/jobs',Briefcase,'Manage jobs'],['/admin/applications',FileText,'Applications'],['/',Building2,'View site']]
 const links=isAdmin?adminLinks:isCompany?companyLinks:studentLinks
 const logout=async()=>{await signOut();navigate('/login')}
 return <div className="min-h-screen"><Navbar/><div className="sidebar-layout"><aside className={`sidebar ${open?'open':''}`}><div className="sidebar-brand"><Logo to={isAdmin ? '/admin' : isCompany ? '/company/dashboard' : '/dashboard'} size={34} /></div><div className="sidebar-label">Workspace</div>{links.map(([to,Icon,label])=><NavLink end={to==='/dashboard'||to==='/admin'||to==='/company/dashboard'} className={({isActive})=>`sidebar-link ${isActive?'active':''}`} key={to} to={to} onClick={()=>setOpen(false)}><Icon size={17}/>{label}</NavLink>)}<div className="mt-8 sidebar-label">Account</div><button onClick={logout} className="sidebar-link w-full text-left"><LogOut size={17}/>Sign out</button></aside><button aria-label="Toggle sidebar" onClick={()=>setOpen(!open)} className="lg:hidden fixed bottom-5 right-5 z-50 ui-btn ui-btn-primary shadow-xl">{open?<X size={19}/>:<Menu size={19}/>}</button><main className="sidebar-content"><Outlet/></main></div></div>
}
