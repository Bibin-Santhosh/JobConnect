import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  Search, MapPin, ArrowUpRight, Bookmark, BriefcaseBusiness, Clock3,
  SlidersHorizontal, Menu, X, Sparkles, Users, Building2, ChevronDown,
  CheckCircle2, TrendingUp, Code2, Palette, Megaphone, BarChart3,
  Heart, Globe2, Bell, Plus, ArrowRight
} from 'lucide-react'
import './styles.css'

const jobs = [
  { id: 1, title: 'Frontend Developer', company: 'Linear Labs', location: 'Bengaluru, India', type: 'Full-time', mode: 'Hybrid', salary: '₹8–12 LPA', category: 'Engineering', posted: '2 days ago', logo: 'L', color: 'violet', featured: true, description: 'Build elegant, accessible interfaces for products used by teams around the world.' },
  { id: 2, title: 'Product Designer', company: 'Northstar Studio', location: 'Remote · India', type: 'Full-time', mode: 'Remote', salary: '₹7–10 LPA', category: 'Design', posted: '1 day ago', logo: 'N', color: 'orange', featured: false, description: 'Shape thoughtful user experiences from early concepts through polished product releases.' },
  { id: 3, title: 'Node.js Developer', company: 'Cloudberry Tech', location: 'Kochi, India', type: 'Full-time', mode: 'On-site', salary: '₹5–8 LPA', category: 'Engineering', posted: '3 days ago', logo: 'C', color: 'green', featured: true, description: 'Create reliable APIs and backend services with Node.js, Express and MongoDB.' },
  { id: 4, title: 'Digital Marketing Associate', company: 'Goodfolk', location: 'Thiruvananthapuram, India', type: 'Full-time', mode: 'Hybrid', salary: '₹3–5 LPA', category: 'Marketing', posted: '4 days ago', logo: 'G', color: 'pink', featured: false, description: 'Grow brand awareness through content, campaigns and performance insights.' },
  { id: 5, title: 'Data Analyst', company: 'Metric House', location: 'Remote · India', type: 'Contract', mode: 'Remote', salary: '₹4–7 LPA', category: 'Data', posted: '5 days ago', logo: 'M', color: 'blue', featured: false, description: 'Turn complex datasets into clear stories that help teams make better decisions.' },
  { id: 6, title: 'UX Research Intern', company: 'PeopleFirst', location: 'Kochi, India', type: 'Internship', mode: 'Hybrid', salary: '₹15–20K / mo', category: 'Design', posted: '1 week ago', logo: 'P', color: 'yellow', featured: false, description: 'Help uncover user needs through interviews, usability studies and synthesis.' }
]

const categories = [
  { name: 'Engineering', count: '1,240 jobs', icon: Code2, tint: 'lavender' },
  { name: 'Design', count: '860 jobs', icon: Palette, tint: 'peach' },
  { name: 'Marketing', count: '520 jobs', icon: Megaphone, tint: 'mint' },
  { name: 'Data', count: '430 jobs', icon: BarChart3, tint: 'sky' }
]

function App() {
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')
  const [category, setCategory] = useState('All')
  const [saved, setSaved] = useState([])
  const [applied, setApplied] = useState([])
  const [activeTab, setActiveTab] = useState('All jobs')
  const [showFilters, setShowFilters] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [modal, setModal] = useState(null)
  const [toast, setToast] = useState('')

  const filtered = useMemo(() => jobs.filter(job => {
    const q = query.toLowerCase()
    const l = location.toLowerCase()
    const matchesQuery = !q || `${job.title} ${job.company} ${job.category} ${job.description}`.toLowerCase().includes(q)
    const matchesLocation = !l || job.location.toLowerCase().includes(l)
    const matchesCategory = category === 'All' || job.category === category
    const matchesTab = activeTab !== 'Saved' || saved.includes(job.id)
    return matchesQuery && matchesLocation && matchesCategory && matchesTab
  }), [query, location, category, activeTab, saved])

  function notify(message) {
    setToast(message)
    window.setTimeout(() => setToast(''), 2600)
  }

  function toggleSaved(id) {
    setSaved(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
    notify(saved.includes(id) ? 'Removed from saved jobs' : 'Job saved to your list')
  }

  function apply(job) {
    if (!applied.includes(job.id)) setApplied(prev => [...prev, job.id])
    setModal(null)
    notify(`Application demo recorded for ${job.company}`)
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="JobConnect home">
          <span className="brand-mark"><BriefcaseBusiness size={19} strokeWidth={2.5}/></span>
          <span>job<span className="brand-accent">connect</span><small className="brand-byline">by Bibin</small></span>
        </a>
        <nav className={`nav-links ${mobileMenu ? 'open' : ''}`}>
          <a className="nav-active" href="#jobs" onClick={() => setMobileMenu(false)}>Find jobs</a>
          <a href="#companies" onClick={() => setMobileMenu(false)}>Companies</a>
          <a href="#career" onClick={() => setMobileMenu(false)}>Career advice</a>
        </nav>
        <div className="nav-actions">
          <button className="icon-btn notification" aria-label="Notifications" onClick={() => notify('You are all caught up!')}><Bell size={18}/><i/></button>
          <button className="login-btn" onClick={() => setModal({ type: 'login' })}>Log in</button>
          <button className="post-btn" onClick={() => setModal({ type: 'post' })}>Post a job <ArrowUpRight size={15}/></button>
        </div>
        <button className="mobile-toggle" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Toggle menu">{mobileMenu ? <X/> : <Menu/>}</button>
      </header>

      <main>
        <section className="hero">
          <div className="hero-glow glow-one"/><div className="hero-glow glow-two"/>
          <div className="hero-content">
            <div className="eyebrow"><Sparkles size={14}/> YOUR NEXT CHAPTER STARTS HERE</div>
            <h1>Find work that<br/><span>moves you forward.</span></h1>
            <p className="hero-copy">Discover opportunities that match your ambition. Great teams are looking for people like you.</p>
            <div className="search-panel">
              <label className="search-field"><Search size={19}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Job title, skill or company"/></label>
              <span className="search-divider"/>
              <label className="search-field location-field"><MapPin size={19}/><input value={location} onChange={e => setLocation(e.target.value)} placeholder="City or remote"/></label>
              <button className="search-button" onClick={() => document.getElementById('jobs').scrollIntoView({behavior:'smooth'})}>Search jobs <ArrowUpRight size={17}/></button>
            </div>
            <div className="popular"><span>Popular:</span><button onClick={() => setQuery('Node.js')}>Node.js</button><button onClick={() => setQuery('Product Designer')}>Product Designer</button><button onClick={() => setQuery('Remote')}>Remote</button></div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="art-orbit orbit-a"/><div className="art-orbit orbit-b"/>
            <div className="floating-card card-top"><span className="mini-logo violet">L</span><div><b>Frontend Developer</b><small>Linear Labs · Bengaluru</small></div><span className="live-dot"/></div>
            <div className="profile-card">
              <div className="profile-avatars"><span>AS</span><span>MK</span><span>RJ</span><span>+8</span></div>
              <b>Find your people.</b><small>Join teams building what’s next.</small>
              <div className="profile-line"><i/><i/><i/></div>
            </div>
            <div className="floating-card card-bottom"><span className="match-icon"><Sparkles size={17}/></span><div><b>Great match!</b><small>Your skills are in demand</small></div><strong>94%</strong></div>
            <div className="art-spark spark-a">✳</div><div className="art-spark spark-b">✦</div>
          </div>
          <div className="hero-stats">
            <div><strong>12k<span>+</span></strong><small>Active jobs</small></div>
            <div><strong>4.8k</strong><small>Companies hiring</small></div>
            <div><strong>32k<span>+</span></strong><small>Career moves made</small></div>
          </div>
        </section>

        <section className="trusted" id="companies">
          <p>TRUSTED BY TEAMS YOU’LL LOVE</p>
          <div className="company-logos"><span className="logo-word logo-stripe">stripe</span><span className="logo-word logo-notion">◧ notion</span><span className="logo-word logo-framer">framer</span><span className="logo-word logo-linear">◈ linear</span><span className="logo-word logo-webflow">webflow</span></div>
        </section>

        <section className="section categories-section">
          <div className="section-heading"><div><span className="section-kicker">EXPLORE POSSIBILITIES</span><h2>Find your field.</h2></div><a href="#jobs" className="text-link">Explore all categories <ArrowUpRight size={16}/></a></div>
          <div className="category-grid">
            {categories.map(({name,count,icon:Icon,tint}) => <button className="category-card" key={name} onClick={() => {setCategory(name); document.getElementById('jobs').scrollIntoView({behavior:'smooth'})}}><span className={`category-icon ${tint}`}><Icon size={22}/></span><span className="category-info"><b>{name}</b><small>{count}</small></span><ArrowUpRight className="category-arrow" size={18}/></button>)}
          </div>
        </section>

        <section className="section jobs-section" id="jobs">
          <div className="section-heading jobs-heading"><div><span className="section-kicker">HANDPICKED FOR YOU</span><h2>Opportunities worth a look.</h2><p>Thoughtful teams. Meaningful work. Your next big thing.</p></div><button className="filter-btn" onClick={() => setShowFilters(!showFilters)}><SlidersHorizontal size={17}/> Filters <ChevronDown size={15}/></button></div>
          {showFilters && <div className="filter-row"><span>Category</span>{['All','Engineering','Design','Marketing','Data'].map(c => <button key={c} className={category===c?'chip selected':'chip'} onClick={() => setCategory(c)}>{c}</button>)}</div>}
          <div className="jobs-toolbar"><div className="tabs"><button className={activeTab==='All jobs'?'tab active':'tab'} onClick={() => setActiveTab('All jobs')}>All jobs <span>{jobs.length}</span></button><button className={activeTab==='Saved'?'tab active':'tab'} onClick={() => setActiveTab('Saved')}>Saved <span>{saved.length}</span></button></div><span className="sort-label">Showing <b>{filtered.length}</b> opportunities <ChevronDown size={14}/></span></div>
          <div className="job-grid">
            {filtered.map(job => <article className="job-card" key={job.id}>
              <div className="job-card-top"><span className={`company-logo ${job.color}`}>{job.logo}</span><button className={`save-btn ${saved.includes(job.id)?'saved':''}`} onClick={() => toggleSaved(job.id)} aria-label="Save job"><Bookmark size={18} fill={saved.includes(job.id)?'currentColor':'none'}/></button></div>
              <div className="job-meta"><span>{job.posted}</span>{job.featured && <span className="featured"><Sparkles size={11}/> Featured</span>}</div>
              <h3>{job.title}</h3><p className="company-name">{job.company}</p>
              <p className="job-description">{job.description}</p>
              <div className="job-tags"><span><MapPin size={13}/>{job.location}</span><span><BriefcaseBusiness size={13}/>{job.mode}</span></div>
              <div className="job-card-bottom"><div><b>{job.salary}</b><small>{job.type}</small></div><button className="apply-btn" onClick={() => setModal({type:'apply',job})}>{applied.includes(job.id)?'Applied':'View job'} <ArrowUpRight size={15}/></button></div>
            </article>)}
            {filtered.length===0 && <div className="empty-state"><Search size={28}/><b>No matching opportunities yet</b><span>Try another keyword or clear your filters.</span><button onClick={() => {setQuery('');setLocation('');setCategory('All');setActiveTab('All jobs')}}>Clear filters</button></div>}
          </div>
          <div className="center-action"><button className="outline-btn" onClick={() => {setQuery('');setLocation('');setCategory('All');setActiveTab('All jobs')}}>Reset search <ArrowRight size={16}/></button></div>
        </section>

        <section className="cta-section" id="career">
          <div className="cta-icon"><TrendingUp size={24}/></div><div><span className="section-kicker">A BETTER WAY TO GROW</span><h2>Your next opportunity is out there.</h2><p>Build a profile, save roles you love and take the next step with confidence.</p></div><button onClick={() => setModal({type:'signup'})}>Create free profile <ArrowUpRight size={17}/></button>
        </section>
      </main>

      <footer><a className="brand footer-brand" href="#"><span className="brand-mark"><BriefcaseBusiness size={17}/></span><span>job<span className="brand-accent">connect</span><small className="brand-byline">by Bibin</small></span></a><span>© 2026 JobConnect. Find your next chapter.</span><div><a href="#jobs">Browse jobs</a><a href="#companies">Companies</a><a href="#career">About</a></div></footer>

      {toast && <div className="toast"><CheckCircle2 size={17}/>{toast}</div>}
      {modal && <div className="modal-backdrop" onClick={() => setModal(null)}><div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={() => setModal(null)}><X size={19}/></button>
        {modal.type==='apply' ? <><span className="section-kicker">JOB DETAILS</span><span className={`company-logo modal-logo ${modal.job.color}`}>{modal.job.logo}</span><h2>{modal.job.title}</h2><p className="company-name">{modal.job.company} · {modal.job.location}</p><p>{modal.job.description}</p><div className="modal-facts"><span>{modal.job.salary}</span><span>{modal.job.mode}</span><span>{modal.job.type}</span></div><button className="modal-primary" onClick={() => apply(modal.job)}>{applied.includes(modal.job.id)?'Application recorded':'Apply (demo)'} <ArrowUpRight size={16}/></button><small className="modal-note">Demo only: this records the action in this browser session. No application is sent.</small></> :
        <><span className="section-kicker">{modal.type==='post'?'FOR EMPLOYERS':modal.type==='login'?'WELCOME BACK':'GET STARTED'}</span><h2>{modal.type==='post'?'Find your next great hire.':modal.type==='login'?'Good to see you again.':'Make your next move.'}</h2><p>This is a frontend demonstration. Authentication and employer posting will be connected to the backend next.</p><label className="modal-input">Email address<input type="email" placeholder="you@example.com"/></label><button className="modal-primary" onClick={() => {setModal(null);notify('Demo interaction — backend connection comes next')}}>Continue <ArrowUpRight size={16}/></button></>}
      </div></div>}
    </div>
  )
}

createRoot(document.getElementById('root')).render(<App />)
