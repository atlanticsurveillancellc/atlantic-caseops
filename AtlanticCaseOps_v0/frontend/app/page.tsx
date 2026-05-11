'use client'

import { useEffect, useState } from 'react'
import { Bell, Camera, ClipboardList, DollarSign, FolderOpen, Gauge, Home, MapPinned, Plus, Search, ShieldCheck, Users } from 'lucide-react'

type Case = { id:number; case_number:string; claimant_name:string; client_name:string; status:string; investigator?:string; address?:string; injury?:string; primary_vehicle?:string }
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const nav = ['Dashboard','Cases','Daily Updates','Evidence','Billing','Mileage','Users','Client Portal']

function Stat({label,value,icon}: {label:string; value:string; icon:any}) { const Icon=icon; return <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 shadow-xl"><div className="mb-4 flex items-center justify-between"><div className="rounded-xl bg-blue-600/20 p-2 text-blue-300"><Icon size={20}/></div><span className="text-xs text-emerald-400">+12%</span></div><p className="text-xs uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 text-2xl font-semibold text-white">{value}</p></div> }

export default function HomePage(){
  const [active,setActive]=useState('Dashboard')
  const [cases,setCases]=useState<Case[]>([])
  const [narrative,setNarrative]=useState(`Weather Conditions: Rain at times, 60s.\n\n10:55 AM: Investigator Kay arrived at the claimant's residence located at 101 Allenhurst Rd, Buffalo, NY 14226. The residence was observed as previously described. Upon arrival, a gray Toyota SUV with NY tag KHE9462 was observed parked in the driveway. With no claimant activity, the investigator established a position with a direct view of the residence.\n\n12:15 PM: Efforts continued. Area video was obtained.`)

  useEffect(()=>{ fetch(`${API}/cases`).then(r=>r.json()).then(setCases).catch(()=>setCases([])) },[])

  async function createDemoCase(){
    const res = await fetch(`${API}/cases`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ case_number:`AC-${Date.now().toString().slice(-6)}`, claimant_name:'New Claimant', client_name:'Claims Management', status:'Active', investigator:'Investigator Kay', address:'Buffalo, NY', injury:'Pending', primary_vehicle:'Unknown' }) })
    if(res.ok){ setCases(await fetch(`${API}/cases`).then(r=>r.json())) }
  }

  return <main className="min-h-screen bg-slate-950 text-slate-100">
    <div className="flex">
      <aside className="hidden min-h-screen w-64 border-r border-slate-800 bg-slate-950 p-4 lg:block">
        <div className="mb-8 flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600"><ShieldCheck/></div><div><p className="text-lg font-bold leading-5">Atlantic</p><p className="text-lg font-bold leading-5">CaseOps</p></div></div>
        <nav className="space-y-1">{nav.map(item=><button key={item} onClick={()=>setActive(item)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${active===item?'bg-blue-600 text-white':'text-slate-300 hover:bg-slate-900'}`}><Home size={16}/>{item}</button>)}</nav>
      </aside>
      <section className="flex-1">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-6 py-3 backdrop-blur"><div className="relative hidden sm:block"><Search className="absolute left-3 top-2.5 text-slate-500" size={18}/><input className="h-10 w-96 rounded-xl border border-slate-800 bg-slate-900 pl-10 text-sm outline-none" placeholder="Search cases, claimants, notes..."/></div><Bell className="text-slate-300"/></header>
        <div className="p-6">
          {active==='Dashboard' && <div className="space-y-6"><div><h1 className="text-2xl font-bold">Welcome back, Ben.</h1><p className="text-sm text-slate-400">Atlantic CaseOps working prototype.</p></div><div className="grid gap-4 md:grid-cols-4"><Stat label="Active Cases" value={String(cases.length)} icon={FolderOpen}/><Stat label="Surveillance Today" value="8" icon={ClipboardList}/><Stat label="Hours This Week" value="73.45" icon={Gauge}/><Stat label="Revenue This Month" value="$24,850" icon={DollarSign}/></div><CaseTable cases={cases} createDemoCase={createDemoCase}/></div>}
          {active==='Cases' && <CaseTable cases={cases} createDemoCase={createDemoCase}/>} 
          {active==='Daily Updates' && <DailyUpdate narrative={narrative} setNarrative={setNarrative}/>} 
          {active==='Evidence' && <Evidence/>}
          {active==='Billing' && <Billing/>}
          {active==='Mileage' && <MapBox/>}
          {active==='Users' && <UsersView/>}
          {active==='Client Portal' && <ClientPortal cases={cases}/>} 
        </div>
      </section>
    </div>
  </main>
}

function CaseTable({cases, createDemoCase}:{cases:Case[]; createDemoCase:()=>void}){ return <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5"><div className="mb-4 flex items-center justify-between"><h2 className="font-semibold">Active Cases</h2><button onClick={createDemoCase} className="rounded-xl bg-blue-600 px-4 py-2 text-sm"><Plus size={15} className="inline"/> New Case</button></div><div className="overflow-hidden rounded-xl border border-slate-800"><table className="w-full text-left text-sm"><thead className="bg-slate-900 text-xs uppercase text-slate-400"><tr><th className="p-3">Case #</th><th>Claimant</th><th>Client</th><th>Status</th><th>Investigator</th></tr></thead><tbody className="divide-y divide-slate-800">{cases.map(c=><tr key={c.id}><td className="p-3 text-blue-300">{c.case_number}</td><td>{c.claimant_name}</td><td>{c.client_name}</td><td><span className="rounded-lg bg-emerald-500/15 px-2 py-1 text-xs text-emerald-300">{c.status}</span></td><td>{c.investigator}</td></tr>)}</tbody></table></div></div> }
function DailyUpdate({narrative,setNarrative}:{narrative:string; setNarrative:(s:string)=>void}){ async function save(){ await fetch(`${API}/daily-updates`, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({case_id:1,date:'2026-05-14',weather:'Rain at times, 60s',start_time:'10:55 AM',end_time:'6:55 PM',narrative,status:'Draft',submitted_by:'Investigator Kay'})}); alert('Draft saved to API') } return <div className="grid gap-5 xl:grid-cols-[1fr_320px]"><div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5"><h1 className="mb-4 text-2xl font-bold">Daily Update Builder</h1><textarea value={narrative} onChange={e=>setNarrative(e.target.value)} className="min-h-[500px] w-full rounded-xl border border-slate-800 bg-slate-900 p-4 text-sm outline-none"/><button onClick={save} className="mt-4 rounded-xl bg-blue-600 px-5 py-2 text-sm">Save Draft</button></div><div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5"><h2 className="mb-3 font-semibold">Quick Inserts</h2>{['Arrived','Efforts continued. Area video was obtained.','Spot check','Mobile surveillance','Discontinued','Equipment line'].map(x=><button key={x} onClick={()=>setNarrative(narrative+'\n\n'+x)} className="mb-2 block w-full rounded-xl bg-slate-800 px-3 py-2 text-left text-sm">{x}</button>)}</div></div> }
function Evidence(){ return <div className="space-y-5"><h1 className="text-2xl font-bold">Evidence</h1><div className="grid gap-4 md:grid-cols-4">{['IMG_2415.JPG','VIDEO_001.MP4','IMG_2417.JPG','VIDEO_002.MP4'].map(n=><div key={n} className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5"><Camera className="mb-4 text-blue-300"/><p>{n}</p><p className="text-xs text-slate-400">S3 upload path ready</p></div>)}</div></div> }
function Billing(){ return <div className="grid gap-4 md:grid-cols-3"><Stat label="Claims" value="$6,420" icon={DollarSign}/><Stat label="TruView" value="$9,870" icon={DollarSign}/><Stat label="iCorp" value="$4,235" icon={DollarSign}/></div> }
function MapBox(){ return <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5"><h1 className="mb-4 text-2xl font-bold">Map & Mileage History</h1><div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-slate-800 bg-[radial-gradient(circle,#1e3a5f,#020617)]"><MapPinned size={64} className="text-blue-300"/></div></div> }
function UsersView(){ return <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5"><h1 className="mb-4 text-2xl font-bold">Users & Roles</h1>{['Owner/Admin','Manager','Private Investigator','Client'].map(r=><div key={r} className="mb-3 flex items-center gap-3 rounded-xl bg-slate-900 p-4"><Users className="text-blue-300"/>{r}</div>)}</div> }
function ClientPortal({cases}:{cases:Case[]}){ return <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5"><h1 className="mb-4 text-2xl font-bold">Client Portal</h1>{cases.map(c=><div key={c.id} className="mb-3 rounded-xl bg-slate-900 p-4"><p>{c.case_number} — {c.claimant_name}</p><p className="text-sm text-slate-400">Approved updates only</p></div>)}</div> }
