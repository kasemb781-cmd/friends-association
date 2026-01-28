
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, TrendingUp, Wallet, CreditCard, FileText, Bell, 
  Settings, Info, LogOut, Menu, X, Globe, Plus, ArrowUpRight, ArrowDownRight, 
  Eye, CheckCircle, Clock, ChevronRight, Search, Download, Calendar, Printer,
  FileBadge, Briefcase, UserCheck, ShieldCheck, Edit3, Loader2
} from 'lucide-react';
import { translations } from './translations';
import { INITIAL_MEMBERS, ADMIN_EMAIL } from './constants';
import { User, Language, Contribution, Expense, Investment, Notice, Profit } from './types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from './supabase';

// --- Global Constants ---
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const YEARS = ['2025', '2026', '2027', '2028', '2029', '2030'];

// --- Helper Components ---
const Button: React.FC<{ onClick?: () => void; children: React.ReactNode; variant?: 'primary' | 'secondary' | 'danger' | 'ghost'; className?: string; type?: 'button' | 'submit'; disabled?: boolean }> = ({ onClick, children, variant = 'primary', className = '', type = 'button', disabled = false }) => {
  const variants = {
    primary: "bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-emerald-300",
    secondary: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 disabled:opacity-50",
    danger: "bg-red-500 text-white hover:bg-red-600 disabled:bg-red-300",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100 disabled:opacity-50"
  };
  return <button type={type} disabled={disabled} onClick={onClick} className={`px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${variants[variant]} ${className}`}>{children}</button>;
};

const Card: React.FC<{ children: React.ReactNode; className?: string; title?: string }> = ({ children, className = '', title }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
    {title && <div className="px-6 py-4 border-b border-gray-50 font-semibold text-gray-800 bg-gray-50/50">{title}</div>}
    <div className="p-6">{children}</div>
  </div>
);

const Input: React.FC<{ label: string; name?: string; type?: string; value: string; onChange: (val: string) => void; placeholder?: string; required?: boolean }> = ({ label, name, type = 'text', value, onChange, placeholder, required }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
    <input name={name} type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
  </div>
);

const Select: React.FC<{ label: string; options: { label: string; value: string }[]; value: string; onChange: (val: string) => void }> = ({ label, options, value, onChange }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white">
      <option value="">Select...</option>
      {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
  </div>
);

// --- Main App ---
export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState('login');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Persistence State
  const [members, setMembers] = useState<User[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [profits, setProfits] = useState<Profit[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);

  // Fetch initial data from Supabase
  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: membersData } = await supabase.from('members').select('*');
      const { data: contributionsData } = await supabase.from('contributions').select('*').order('date', { ascending: false });
      const { data: investmentsData } = await supabase.from('investments').select('*');
      const { data: profitsData } = await supabase.from('profits').select('*');
      const { data: expensesData } = await supabase.from('expenses').select('*').order('date', { ascending: false });
      const { data: noticesData } = await supabase.from('notices').select('*').order('date', { ascending: false });

      if (membersData) setMembers(membersData);
      if (contributionsData) setContributions(contributionsData);
      if (investmentsData) setInvestments(investmentsData);
      if (profitsData) setProfits(profitsData);
      if (expensesData) setExpenses(expensesData);
      if (noticesData) setNotices(noticesData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const t = translations[lang];

  // Derived Values
  const totalContributions = contributions.reduce((s, c) => s + (Number(c.amount) || 0), 0);
  const totalProfits = profits.reduce((s, p) => s + (Number(p.amount) || 0), 0);
  const totalExpenses = expenses.reduce((s, e) => s + (Number(e.amount) || 0), 0);
  const ourWealth = totalContributions + totalProfits - totalExpenses;

  const handleLogin = async (credentials: { email: string; pass: string }) => {
    setLoading(true);
    const email = credentials.email.toLowerCase().trim();
    const { data: user, error } = await supabase
      .from('members')
      .select('*')
      .eq('email', email)
      .eq('password', credentials.pass)
      .single();

    if (user) {
      if (user.status === 'APPROVED') {
        setCurrentUser(user);
        setView('dashboard');
      } else {
        alert(lang === 'bn' ? "আপনার একাউন্টটি অনুমোদনের অপেক্ষায় আছে।" : "Account Pending Approval. Please contact admin.");
      }
    } else {
      alert(t.errorAuth);
    }
    setLoading(false);
  };

  const handleSignup = async (data: Partial<User>) => {
    setLoading(true);
    const signupEmail = data.email?.toLowerCase().trim() || '';
    
    // Check for existing user
    const { data: existing } = await supabase.from('members').select('id').eq('email', signupEmail).single();
    if (existing) {
      alert(lang === 'bn' ? "এই ইমেইলটি ইতিমধ্যে ব্যবহৃত হয়েছে।" : "Email already registered.");
      setLoading(false);
      return;
    }

    const newUser = { 
      ...data, 
      email: signupEmail,
      role: 'MEMBER', 
      status: 'PENDING', 
      shares: 0, 
      createdAt: new Date().toISOString() 
    };

    const { error } = await supabase.from('members').insert([newUser]);
    if (!error) {
      alert(t.successSignup);
      setView('login');
      fetchData(); // Refresh list
    } else {
      alert("Error creating account.");
    }
    setLoading(false);
  };

  const handleUpdateMember = async (id: string, data: any) => {
    const { error } = await supabase.from('members').update(data).eq('id', id);
    if (!error) {
      fetchData();
    } else {
      alert("Error updating member data.");
    }
  };

  const handleAddContribution = async (c: any) => {
    const { error } = await supabase.from('contributions').insert([c]);
    if (!error) {
      fetchData();
    }
  };

  const handleAddInvestment = async (i: any) => {
    const { error } = await supabase.from('investments').insert([i]);
    if (!error) {
      fetchData();
    }
  };

  const handleAddProfit = async (p: any) => {
    const { error } = await supabase.from('profits').insert([p]);
    if (!error) {
      fetchData();
    }
  };

  const handleAddExpense = async (e: any) => {
    const { error } = await supabase.from('expenses').insert([e]);
    if (!error) {
      fetchData();
    }
  };

  const handleAddNotice = async (n: any) => {
    const { error } = await supabase.from('notices').insert([n]);
    if (!error) {
      fetchData();
    }
  };

  const renderContent = () => {
    if (!currentUser) {
      if (view === 'signup') return <SignupView onSignup={handleSignup} onBack={() => setView('login')} t={t} loading={loading} />;
      return <LoginView onLogin={handleLogin} onGoToSignup={() => setView('signup')} t={t} setLang={setLang} lang={lang} loading={loading} />;
    }

    switch (view) {
      case 'dashboard': return <DashboardView t={t} user={currentUser} members={members} contributions={contributions} expenses={expenses} investments={investments} lang={lang} />;
      case 'members': return <MembersView t={t} members={members} user={currentUser} onUpdate={handleUpdateMember} />;
      case 'contribution': return <ContributionView t={t} user={currentUser} members={members} contributions={contributions} onAdd={handleAddContribution} />;
      case 'investment': return <InvestmentView t={t} user={currentUser} members={members} investments={investments} profits={profits} onAddInvest={handleAddInvestment} onAddProfit={handleAddProfit} />;
      case 'expense': return <ExpensesView t={t} user={currentUser} members={members} expenses={expenses} onAdd={handleAddExpense} />;
      case 'notices': return <NoticesView t={t} user={currentUser} notices={notices} lang={lang} onAdd={handleAddNotice} />;
      case 'about': return <AboutUsView t={t} wealth={ourWealth} />;
      case 'settings': return <SettingsView t={t} user={currentUser} setLang={setLang} lang={lang} onUpdate={handleUpdateMember} />;
      default: return <DashboardView t={t} user={currentUser} members={members} contributions={contributions} expenses={expenses} investments={investments} lang={lang} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {currentUser && (
        <>
          <aside className={`no-print ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static inset-y-0 left-0 w-64 bg-slate-900 text-slate-300 z-50 transition-transform flex flex-col`}>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">F</div>
                <h1 className="font-bold text-white text-lg">{t.appName}</h1>
              </div>
              <nav className="space-y-1">
                <NavItem icon={<LayoutDashboard size={18}/>} label={t.dashboard} active={view === 'dashboard'} onClick={() => setView('dashboard')} />
                <NavItem icon={<Users size={18}/>} label={t.members} active={view === 'members'} onClick={() => setView('members')} />
                <NavItem icon={<TrendingUp size={18}/>} label={t.contribution} active={view === 'contribution'} onClick={() => setView('contribution')} />
                <NavItem icon={<Briefcase size={18}/>} label={t.investment} active={view === 'investment'} onClick={() => setView('investment')} />
                <NavItem icon={<CreditCard size={18}/>} label={t.expense} active={view === 'expense'} onClick={() => setView('expense')} />
                <NavItem icon={<Bell size={18}/>} label={t.notice} active={view === 'notices'} onClick={() => setView('notices')} />
                <NavItem icon={<Info size={18}/>} label={t.aboutUs} active={view === 'about'} onClick={() => setView('about')} />
                <NavItem icon={<Settings size={18}/>} label={t.settings} active={view === 'settings'} onClick={() => setView('settings')} />
              </nav>
            </div>
            <div className="mt-auto p-6 bg-slate-800/50 flex items-center gap-3">
              <img src={currentUser.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.id}`} className="w-10 h-10 rounded-full border border-emerald-500" />
              <div className="truncate">
                <p className="text-sm font-bold text-white">{currentUser.fullName}</p>
                <p className="text-xs opacity-50 uppercase">{currentUser.role}</p>
              </div>
              <button onClick={() => { setCurrentUser(null); setView('login'); }} className="ml-auto text-slate-500 hover:text-white"><LogOut size={18}/></button>
            </div>
          </aside>
          <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 text-white sticky top-0 z-40 no-print">
            <h1 className="font-bold">{t.appName}</h1>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}><Menu /></button>
          </div>
        </>
      )}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {loading && !currentUser ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="animate-spin text-emerald-600" size={48} />
          </div>
        ) : renderContent()}
      </main>
    </div>
  );
}

const NavItem = ({ icon, label, onClick, active }: any) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all ${active ? 'bg-emerald-600 text-white font-bold' : 'hover:bg-slate-800'}`}>
    {icon} <span>{label}</span>
  </button>
);

// --- Login & Signup ---
const LoginView = ({ onLogin, onGoToSignup, t, setLang, lang, loading }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({ email, pass: password });
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-4"><ShieldCheck size={40}/></div>
        <h1 className="text-3xl font-bold">{t.appName}</h1>
        <p className="text-gray-500">{t.established}</p>
      </div>
      <Card>
        <div className="flex justify-end mb-4">
          <button onClick={() => setLang(lang === 'en' ? 'bn' : 'en')} className="text-emerald-600 text-xs font-bold uppercase flex items-center gap-1"><Globe size={14}/> {lang === 'en' ? 'বাংলা' : 'English'}</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label={t.email} name="email" type="email" required value={email} onChange={setEmail} />
          <Input label={t.password} name="password" type="password" required value={password} onChange={setPassword} />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <Loader2 className="animate-spin" size={18}/> : 'Sign In'}
          </Button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">New here? <button onClick={onGoToSignup} className="text-emerald-600 font-bold">Create Account</button></p>
      </Card>
    </div>
  );
};

const SignupView = ({ onSignup, onBack, t, loading }: any) => {
  const [f, setF] = useState<any>({ fullName: '', email: '', password: '', mobile: '', idNumber: '', idType: 'NID', nomineeId: '', nomineeIdType: 'NID', occupation: 'Businessman', address: { village: '', thana: '', district: '' } });
  return (
    <div className="max-w-3xl mx-auto py-8">
      <Button variant="ghost" onClick={onBack} className="mb-4"><X size={18}/> Back</Button>
      <Card title={t.signup}>
        <form onSubmit={(e) => { e.preventDefault(); onSignup(f); }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label={t.fullName} value={f.fullName} onChange={v => setF({...f, fullName: v})} required />
            <Input label={t.email} type="email" value={f.email} onChange={v => setF({...f, email: v})} required />
            <Input label={t.password} type="password" value={f.password} onChange={v => setF({...f, password: v})} required />
            <Input label={t.mobileNumber} value={f.mobile} onChange={v => setF({...f, mobile: v})} required />
            <Input label={t.idNumber} value={f.idNumber} onChange={v => setF({...f, idNumber: v})} required />
            <Select label={t.idType} value={f.idType} onChange={v => setF({...f, idType: v})} options={[{label:'NID', value:'NID'}, {label:'Passport', value:'Passport'}, {label:'Birth Certificate', value:'Birth Certificate'}]} />
            <Input label="Nominee ID" value={f.nomineeId} onChange={v => setF({...f, nomineeId: v})} required />
            <Select label="Nominee ID Type" value={f.nomineeIdType} onChange={v => setF({...f, nomineeIdType: v})} options={[{label:'NID', value:'NID'}, {label:'Passport', value:'Passport'}]} />
            <Select label={t.occupation} value={f.occupation} onChange={v => setF({...f, occupation: v})} options={[{label:'Businessman', value:'Businessman'}, {label:'Student', value:'Student'}, {label:'Expatriates', value:'Expatriates'}, {label:'Job Holder', value:'Job Holder'}]} />
          </div>
          <div className="pt-4 border-t">
            <h3 className="font-bold mb-4">Address Information</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Input label={t.village} value={f.address.village} onChange={v => setF({...f, address:{...f.address, village: v}})} />
              <Input label={t.thana} value={f.address.thana} onChange={v => setF({...f, address:{...f.address, thana: v}})} />
              <Input label={t.district} value={f.address.district} onChange={v => setF({...f, address:{...f.address, district: v}})} />
            </div>
          </div>
          <Button type="submit" disabled={loading} className="w-full h-12">
            {loading ? <Loader2 className="animate-spin" size={18}/> : 'Submit Registration'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

// --- Module: Dashboard ---
const DashboardView = ({ t, user, members, contributions, expenses, investments, lang }: any) => {
  const isPrivileged = ['ADMIN', 'EXECUTIVE', 'AUDITOR', 'PRESIDENT'].includes(user.role);
  const ownTotal = contributions.filter((c: any) => c.memberId === user.id).reduce((s: any, c: any) => s + (Number(c.amount) || 0), 0);
  const assocTotal = contributions.reduce((s: number, c: any) => s + (Number(c.amount) || 0), 0);
  const assocTotalExp = expenses.reduce((s:any, e:any) => s + (Number(e.amount) || 0), 0);

  const data = [
    { name: 'Contribution', value: assocTotal },
    { name: 'Expense', value: assocTotalExp },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t.dashboard}</h1>
        <div className="text-sm px-3 py-1 bg-white border rounded-full text-emerald-600 font-bold">{MONTHS[new Date().getMonth()]} {new Date().getFullYear()}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title={t.ownContribution} value={`৳${ownTotal.toLocaleString()}`} icon={<Wallet className="text-blue-500"/>} />
        <StatCard title={t.assocContribution} value={`৳${assocTotal.toLocaleString()}`} icon={<Users className="text-indigo-500"/>} />
        {isPrivileged && (
          <>
            <StatCard title={t.totalExpense} value={`৳${assocTotalExp.toLocaleString()}`} icon={<ArrowDownRight className="text-red-500"/>} />
            <StatCard title={t.totalInvestment} value={`৳${investments.reduce((s:any,i:any)=>s+(Number(i.amount)||0),0).toLocaleString()}`} icon={<TrendingUp className="text-emerald-500"/>} />
          </>
        )}
        {!isPrivileged && <StatCard title={t.shareQuantity} value={user.shares} icon={<FileBadge className="text-amber-500"/>} />}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Contribution vs Expense">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title={t.recentActivity}>
          <div className="space-y-4">
            {contributions.slice(0, 5).map((c: any) => (
              <div key={c.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">{c.memberName ? c.memberName[0] : 'C'}</div>
                  <div>
                    <p className="text-xs font-bold">{c.memberName}</p>
                    <p className="text-[10px] text-gray-400">{c.date}</p>
                  </div>
                </div>
                <div className="text-xs font-bold text-emerald-600">+৳{c.amount}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, highlight }: any) => (
  <Card className={highlight ? 'bg-emerald-50 border-emerald-200' : ''}>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-xs font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-xl font-bold">{value}</h3>
      </div>
      <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
    </div>
  </Card>
);

// --- Module: Members ---
const MembersView = ({ t, members, user, onUpdate }: any) => {
  const [filter, setFilter] = useState('');
  const [editingMember, setEditingMember] = useState<User | null>(null);
  const isAdmin = user.role === 'ADMIN' || user.role === 'PRESIDENT';
  const filtered = members.filter((m: any) => m.fullName.toLowerCase().includes(filter.toLowerCase()));

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMember) {
      onUpdate(editingMember.id, editingMember);
      setEditingMember(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t.members}</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input type="text" placeholder={t.search} value={filter} onChange={e => setFilter(e.target.value)} className="pl-10 pr-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((m: any) => (
          <Card key={m.id}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <img src={m.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.id}`} className="w-16 h-16 rounded-xl border-2 border-emerald-50" />
                <div>
                  <h3 className="font-bold text-lg">{m.fullName}</h3>
                  <div className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] rounded-full inline-block font-bold uppercase">{m.role}</div>
                </div>
              </div>
              {isAdmin && (
                <button onClick={() => setEditingMember(m)} className="p-2 text-gray-400 hover:text-emerald-600 transition-colors">
                  <Edit3 size={18} />
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 py-3 border-t">
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">{t.shareQuantity}</p>
                <p className="font-bold text-lg">{m.shares}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-400 font-bold uppercase">{t.status}</p>
                <div className={`text-xs font-bold ${m.status === 'APPROVED' ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {m.status === 'APPROVED' ? t.approved : t.pending}
                  {isAdmin && m.status === 'PENDING' && <button onClick={() => onUpdate(m.id, { status: 'APPROVED' })} className="ml-2 bg-emerald-600 text-white px-2 py-0.5 rounded text-[10px]">Approve</button>}
                </div>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-400">
              <p>{m.mobile}</p>
              <p>{m.email}</p>
            </div>
          </Card>
        ))}
      </div>

      {editingMember && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <Card title="Edit Member Data" className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label={t.fullName} value={editingMember.fullName} onChange={v => setEditingMember({...editingMember, fullName: v})} required />
                <Input label={t.mobileNumber} value={editingMember.mobile} onChange={v => setEditingMember({...editingMember, mobile: v})} required />
                <Input label={t.idNumber} value={editingMember.idNumber} onChange={v => setEditingMember({...editingMember, idNumber: v})} required />
                <Select label={t.idType} value={editingMember.idType} onChange={(v: any) => setEditingMember({...editingMember, idType: v})} options={[{label:'NID', value:'NID'}, {label:'Passport', value:'Passport'}, {label:'Birth Certificate', value:'Birth Certificate'}]} />
                <Select label={t.occupation} value={editingMember.occupation} onChange={(v: any) => setEditingMember({...editingMember, occupation: v})} options={[{label:'Businessman', value:'Businessman'}, {label:'Student', value:'Student'}, {label:'Expatriates', value:'Expatriates'}, {label:'Job Holder', value:'Job Holder'}]} />
                <Input label={t.shareQuantity} type="number" value={editingMember.shares.toString()} onChange={v => setEditingMember({...editingMember, shares: parseInt(v) || 0})} />
                <Select label="Assign Role" value={editingMember.role} onChange={(v: any) => setEditingMember({...editingMember, role: v})} options={[
                  {label: 'Member', value: 'MEMBER'},
                  {label: 'Executive', value: 'EXECUTIVE'},
                  {label: 'Auditor', value: 'AUDITOR'},
                  {label: 'President', value: 'PRESIDENT'},
                  {label: 'Admin', value: 'ADMIN'}
                ]} />
                <Select label={t.status} value={editingMember.status} onChange={(v: any) => setEditingMember({...editingMember, status: v})} options={[{label:'Approved', value:'APPROVED'}, {label:'Pending', value:'PENDING'}]} />
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="font-bold mb-3 text-sm uppercase text-gray-400 tracking-wider">Address Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input label="Village" value={editingMember.address?.village || ''} onChange={v => setEditingMember({...editingMember, address: {...editingMember.address, village: v}})} />
                  <Input label="Thana" value={editingMember.address?.thana || ''} onChange={v => setEditingMember({...editingMember, address: {...editingMember.address, thana: v}})} />
                  <Input label="District" value={editingMember.address?.district || ''} onChange={v => setEditingMember({...editingMember, address: {...editingMember.address, district: v}})} />
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <Button type="submit" className="flex-1">Save Changes</Button>
                <Button variant="secondary" onClick={() => setEditingMember(null)} className="flex-1">Cancel</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

// --- Module: Contributions & Invoices ---
const ContributionView = ({ t, user, members, contributions, onAdd }: any) => {
  const [showAdd, setShowAdd] = useState(false);
  const [activeInvoice, setActiveInvoice] = useState<any>(null);
  const [form, setForm] = useState<any>({ memberId: '', amount: 0, month: MONTHS[new Date().getMonth()], year: new Date().getFullYear().toString(), purpose: [] });

  const handleAdd = () => {
    const invNo = `FA_INV_${(contributions.length + 1).toString().padStart(5, '0')}`;
    const member = members.find((m: any) => m.id === form.memberId);
    const newC = { 
      ...form, 
      invoiceNo: invNo, 
      date: new Date().toLocaleDateString(),
      generatedBy: user.fullName,
      memberName: member?.fullName
    };
    onAdd(newC);
    setActiveInvoice(newC);
    setShowAdd(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center no-print">
        <h1 className="text-2xl font-bold">{t.contribution}</h1>
        {['ADMIN', 'EXECUTIVE', 'PRESIDENT'].includes(user.role) && <Button onClick={() => setShowAdd(true)}><Plus size={18}/> New Entry</Button>}
      </div>

      <div className="grid grid-cols-1 gap-4 no-print">
        {contributions.map((c: any) => (
          <Card key={c.id} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><FileBadge size={20}/></div>
              <div>
                <p className="font-bold">{c.memberName}</p>
                <p className="text-xs text-gray-400">{c.invoiceNo} • {c.month} {c.year}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-xs font-bold text-emerald-600">৳{c.amount.toLocaleString()}</p>
                <p className="text-[10px] text-gray-400">{c.purpose?.join(', ')}</p>
              </div>
              <Button variant="ghost" onClick={() => setActiveInvoice(c)} className="text-emerald-600"><Printer size={18}/></Button>
            </div>
          </Card>
        ))}
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm no-print">
          <Card title="Add Contribution" className="w-full max-w-lg">
            <div className="grid grid-cols-2 gap-4">
              <Select label="Member" value={form.memberId} onChange={v => setForm({...form, memberId: v})} options={members.map((m: any) => ({ label: m.fullName, value: m.id }))} />
              <Input label={t.amount} type="number" value={form.amount.toString()} onChange={v => setForm({...form, amount: parseFloat(v)})} />
              <Select label={t.month} value={form.month} onChange={v => setForm({...form, month: v})} options={MONTHS.map(m => ({ label: m, value: m }))} />
              <Select label={t.year} value={form.year} onChange={v => setForm({...form, year: v})} options={YEARS.map(y => ({ label: y, value: y }))} />
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">{t.purpose}</p>
              <div className="flex flex-wrap gap-3">
                {['Monthly', 'Yearly', 'Penalty', 'Service Fee'].map(p => (
                  <label key={p} className="flex items-center gap-2 text-sm bg-gray-50 px-3 py-1.5 rounded-lg border cursor-pointer hover:border-emerald-500 transition-all">
                    <input type="checkbox" checked={form.purpose?.includes(p)} onChange={e => {
                      const prev = form.purpose || [];
                      setForm({...form, purpose: e.target.checked ? [...prev, p] : prev.filter((i:any) => i !== p)});
                    }} className="text-emerald-600 rounded"/>
                    {p}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <Button onClick={handleAdd} className="flex-1">Generate Invoice</Button>
              <Button variant="secondary" onClick={() => setShowAdd(false)} className="flex-1">Cancel</Button>
            </div>
          </Card>
        </div>
      )}

      {activeInvoice && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-8 relative shadow-2xl overflow-hidden">
            <button onClick={() => setActiveInvoice(null)} className="absolute top-4 right-4 text-gray-400 hover:text-black no-print"><X/></button>
            <div className="text-center border-b pb-6 mb-6">
              <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-3 text-white font-bold">FA</div>
              <h2 className="text-xl font-bold">{t.appName}</h2>
              <p className="text-xs text-gray-400 uppercase tracking-widest">{t.contribution} INVOICE</p>
            </div>
            <div className="space-y-3 mb-8 text-sm">
              <div className="flex justify-between"><span className="text-gray-400">{t.invoiceNo}</span><span className="font-bold">{activeInvoice.invoiceNo}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Date</span><span>{activeInvoice.date}</span></div>
              <div className="flex justify-between border-t pt-3"><span className="text-gray-400">Member Name</span><span className="font-bold">{activeInvoice.memberName}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Month/Year</span><span>{activeInvoice.month} {activeInvoice.year}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Shares</span><span className="font-bold">{members.find((m:any)=>m.id === activeInvoice.memberId)?.shares}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Purpose</span><span className="text-xs">{activeInvoice.purpose?.join(', ')}</span></div>
            </div>
            <div className="bg-emerald-50 p-4 rounded-xl text-center mb-8">
              <p className="text-xs text-emerald-600 font-bold uppercase mb-1">Amount Paid</p>
              <h3 className="text-3xl font-black text-emerald-700">৳{activeInvoice.amount?.toLocaleString()}</h3>
            </div>
            <div className="text-center">
              <div className="h-10 w-48 bg-gray-100 mx-auto rounded flex items-center justify-center mb-2 border border-dashed">
                |||| | ||| || ||| | ||
              </div>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">ID: {activeInvoice.memberId}</p>
            </div>
            <div className="mt-8 pt-6 border-t text-center no-print">
              <p className="text-[10px] text-gray-300 italic">{t.invoiceGeneratedBy}: {activeInvoice.generatedBy}</p>
              <Button variant="primary" onClick={() => window.print()} className="mt-4 w-full"><Printer size={16}/> Print PDF</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Module: Investment & Profit ---
const InvestmentView = ({ t, user, members, investments, profits, onAddInvest, onAddProfit }: any) => {
  const [showAdd, setShowAdd] = useState(false);
  const [showProfit, setShowProfit] = useState<string | null>(null);
  const [f, setF] = useState<any>({ type: 'Land', amount: 0, nature: 'Temporary', responsibleMemberId: '' });

  const isAdmin = ['ADMIN', 'EXECUTIVE', 'PRESIDENT'].includes(user.role);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t.investment}</h1>
        {isAdmin && <Button onClick={() => setShowAdd(true)}><Plus size={18}/> New Investment</Button>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {investments.map((i: any) => (
          <Card key={i.id} title={`${i.investNo}: ${i.type}`}>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm"><span className="text-gray-400">Amount</span><span className="font-bold">৳{i.amount?.toLocaleString()}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-400">Responsible</span><span className="font-medium">{i.responsibleMemberName}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-400">Nature</span><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${i.nature === 'Permanent' ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700'}`}>{i.nature}</span></div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-emerald-600 text-sm font-bold">
                Profit: ৳{profits.filter((p:any)=>p.investId === i.id).reduce((s:any, p:any)=>s+(Number(p.amount)||0), 0).toLocaleString()}
              </div>
              {isAdmin && <Button variant="secondary" onClick={() => setShowProfit(i.id)} className="text-xs">Add Profit</Button>}
            </div>
          </Card>
        ))}
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <Card title="New Investment" className="w-full max-w-lg">
            <div className="grid grid-cols-2 gap-4">
              <Select label="Type" value={f.type} onChange={v => setF({...f, type: v})} options={['Land', 'Business Invest', 'Gold', 'Purchase', 'Others'].map(o => ({label:o, value:o}))} />
              <Input label={t.amount} type="number" value={f.amount.toString()} onChange={v => setF({...f, amount: parseFloat(v)})} />
              <Select label="Nature" value={f.nature} onChange={v => setF({...f, nature: v})} options={['Temporary', 'Permanent', 'Flexible'].map(o => ({label:o, value:o}))} />
              <Select label="Responsible Member" value={f.responsibleMemberId} onChange={v => setF({...f, responsibleMemberId: v})} options={members.map((m: any) => ({ label: m.fullName, value: m.id }))} />
            </div>
            <div className="flex gap-4 mt-6">
              <Button onClick={() => { 
                const newI = {...f, investNo: `INV_${Date.now().toString().slice(-4)}`, date: new Date().toLocaleDateString(), responsibleMemberName: members.find((m:any)=>m.id === f.responsibleMemberId)?.fullName};
                onAddInvest(newI); setShowAdd(false); 
              }} className="flex-1">Create Record</Button>
              <Button variant="secondary" onClick={() => setShowAdd(false)} className="flex-1">Cancel</Button>
            </div>
          </Card>
        </div>
      )}

      {showProfit && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <Card title="Record Profit" className="w-full max-w-sm">
            <Input label="Profit Amount" type="number" value={f.profitAmount?.toString() || '0'} onChange={v => setF({...f, profitAmount: parseFloat(v)})} />
            <div className="flex gap-4 mt-6">
              <Button onClick={() => { 
                const inv = investments.find((i:any)=>i.id === showProfit);
                onAddProfit({investId: showProfit, investNo: inv?.investNo, amount: f.profitAmount || 0, date: new Date().toLocaleDateString(), responsibleMemberName: inv?.responsibleMemberName});
                setShowProfit(null); setF({...f, profitAmount: 0});
              }} className="flex-1">Add Profit</Button>
              <Button variant="secondary" onClick={() => setShowProfit(null)} className="flex-1">Cancel</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

// --- Module: Expenses ---
const ExpensesView = ({ t, user, members, expenses, onAdd }: any) => {
  const [showAdd, setShowAdd] = useState(false);
  const [f, setF] = useState<any>({ name: 'Stationary', amount: 0, responsibleMemberIds: [], description: '' });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t.expense}</h1>
        {['ADMIN', 'EXECUTIVE', 'PRESIDENT'].includes(user.role) && <Button variant="danger" onClick={() => setShowAdd(true)}><Plus size={18}/> New Expense</Button>}
      </div>
      <div className="grid grid-cols-1 gap-4">
        {expenses.map((e: any) => (
          <Card key={e.id} className="flex items-center justify-between border-l-4 border-l-red-500">
            <div>
              <p className="font-bold">{e.name}</p>
              <p className="text-[10px] text-gray-400">{e.date} • Resp: {e.responsibleMemberNames?.join(', ')}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-red-600">৳{e.amount?.toLocaleString()}</p>
              <p className="text-[10px] text-gray-400">{e.description}</p>
            </div>
          </Card>
        ))}
      </div>
      {showAdd && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <Card title="Record Expense" className="w-full max-w-lg">
            <div className="grid grid-cols-2 gap-4">
              <Select label="Category" value={f.name} onChange={v => setF({...f, name: v})} options={['Stationary', 'Food', 'Documentary', 'Traveling', 'Broker', 'Others'].map(o => ({label:o, value:o}))} />
              <Input label={t.amount} type="number" value={f.amount.toString()} onChange={v => setF({...f, amount: parseFloat(v)})} />
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Responsible Members</p>
              <div className="max-h-32 overflow-y-auto border rounded-lg p-2 space-y-1">
                {members.map((m: any) => (
                  <label key={m.id} className="flex items-center gap-2 text-xs">
                    <input type="checkbox" checked={f.responsibleMemberIds?.includes(m.id)} onChange={e => {
                      const prev = f.responsibleMemberIds || [];
                      setF({...f, responsibleMemberIds: e.target.checked ? [...prev, m.id] : prev.filter((i:any)=>i!==m.id)});
                    }} /> {m.fullName}
                  </label>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <Input label="Description" value={f.description} onChange={v => setF({...f, description: v})} />
            </div>
            <div className="flex gap-4 mt-6">
              <Button onClick={() => {
                const names = f.responsibleMemberIds.map((id:string) => members.find((m:any)=>m.id === id)?.fullName);
                onAdd({...f, date: new Date().toLocaleDateString(), responsibleMemberNames: names});
                setShowAdd(false);
              }} className="flex-1" variant="danger">Record Expense</Button>
              <Button variant="secondary" onClick={() => setShowAdd(false)} className="flex-1">Cancel</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

// --- Module: Notices ---
const NoticesView = ({ t, user, notices, lang, onAdd }: any) => {
  const [showAdd, setShowAdd] = useState(false);
  const [f, setF] = useState<any>({ title: { en: '', bn: '' }, content: { en: '', bn: '' } });
  const isPrivileged = user.role === 'PRESIDENT' || user.role === 'EXECUTIVE';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t.notice}</h1>
        {isPrivileged && <Button onClick={() => setShowAdd(true)}><Plus size={18}/> Publish Notice</Button>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notices.map((n: any) => (
          <Card key={n.id}>
            <h3 className="font-bold text-lg mb-2">{n.title[lang]}</h3>
            <p className="text-sm text-gray-500 line-clamp-4 mb-4">{n.content[lang]}</p>
            <div className="flex justify-between text-[10px] text-gray-400 uppercase font-bold pt-4 border-t">
              <span>{n.author}</span>
              <span>{n.date}</span>
            </div>
          </Card>
        ))}
      </div>
      {showAdd && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <Card title="Publish Notice" className="w-full max-w-lg">
            <div className="space-y-4">
              <Input label="Title (EN)" value={f.title.en} onChange={v => setF({...f, title: {...f.title, en: v}})} />
              <Input label="Title (BN)" value={f.title.bn} onChange={v => setF({...f, title: {...f.title, bn: v}})} />
              <textarea placeholder="Content (EN)" className="w-full border p-2 rounded-lg text-sm h-24" value={f.content.en} onChange={e => setF({...f, content: {...f.content, en: e.target.value}})} />
              <textarea placeholder="Content (BN)" className="w-full border p-2 rounded-lg text-sm h-24" value={f.content.bn} onChange={e => setF({...f, content: {...f.content, bn: e.target.value}})} />
            </div>
            <div className="flex gap-4 mt-6">
              <Button onClick={() => { onAdd({...f, date: new Date().toLocaleDateString(), author: user.fullName}); setShowAdd(false); }} className="flex-1">Publish</Button>
              <Button variant="secondary" onClick={() => setShowAdd(false)} className="flex-1">Cancel</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

// --- Module: About Us & Our Wealth ---
const AboutUsView = ({ t, wealth }: any) => (
  <div className="max-w-4xl mx-auto space-y-12 py-8">
    <div className="text-center">
      <div className="w-24 h-24 bg-emerald-600 rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl"><ShieldCheck size={48}/></div>
      <h1 className="text-4xl font-black mb-2">{t.appName}</h1>
      <p className="text-emerald-600 font-bold tracking-widest uppercase text-sm">{t.established}</p>
    </div>

    <div className="bg-slate-900 text-white rounded-3xl p-10 relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 right-0 p-8 opacity-10"><Wallet size={200}/></div>
      <div className="relative z-10">
        <p className="text-emerald-400 font-bold uppercase tracking-widest text-sm mb-2">{t.ourWealth}</p>
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">{wealth.toLocaleString()} <span className="text-2xl font-normal opacity-50">BDT</span></h2>
        <p className="text-slate-400 text-sm max-w-md">{t.wealthInfo}</p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card title={t.mission} className="border-l-4 border-l-emerald-500"><p className="text-gray-600 italic leading-relaxed">"{translations.en.missionContent}"</p></Card>
      <Card title={t.vision} className="border-l-4 border-l-blue-500"><p className="text-gray-600 italic leading-relaxed">"{translations.en.visionContent}"</p></Card>
    </div>

    <div>
      <h3 className="text-2xl font-bold mb-6 text-center">{t.entrepreneurs}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {['Mahbubur Rahman', 'Mazharul Islam', 'Sha Alam Hasan'].map(name => (
          <div key={name} className="bg-white p-6 rounded-2xl border text-center hover:shadow-lg transition-all">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center text-gray-400 font-bold">{name[0]}</div>
            <p className="font-bold">{name}</p>
            <p className="text-xs text-emerald-600 font-medium">Founder & Entrepreneur</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// --- Module: Settings ---
const SettingsView = ({ t, user, setLang, lang, onUpdate }: any) => {
  const [edit, setEdit] = useState({...user});
  const [pass, setPass] = useState({ old: '', new: '', confirm: '' });

  const handlePass = () => {
    if (pass.old !== user.password) { alert("Wrong current password"); return; }
    if (pass.new !== pass.confirm) { alert("New passwords don't match"); return; }
    onUpdate(user.id, { password: pass.new });
    alert("Password updated");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">{t.settings}</h1>
      <Card title="My Profile">
        <div className="grid grid-cols-2 gap-4">
          <Input label={t.fullName} value={edit.fullName} onChange={v => setEdit({...edit, fullName: v})} />
          <Input label={t.mobileNumber} value={edit.mobile} onChange={v => setEdit({...edit, mobile: v})} />
        </div>
        <Button onClick={() => onUpdate(user.id, edit)} className="mt-4 w-full">Save Profile Changes</Button>
      </Card>
      <Card title={t.language}>
        <div className="flex gap-4">
          <Button variant={lang === 'en' ? 'primary' : 'secondary'} onClick={() => setLang('en')} className="flex-1">English</Button>
          <Button variant={lang === 'bn' ? 'primary' : 'secondary'} onClick={() => setLang('bn')} className="flex-1">বাংলা</Button>
        </div>
      </Card>
      <Card title={t.changePassword}>
        <div className="space-y-4">
          <Input label="Old Password" type="password" value={pass.old} onChange={v => setPass({...pass, old: v})} />
          <Input label="New Password" type="password" value={pass.new} onChange={v => setPass({...pass, new: v})} />
          <Input label="Confirm Password" type="password" value={pass.confirm} onChange={v => setPass({...pass, confirm: v})} />
          <Button onClick={handlePass} variant="danger" className="w-full">Update Password</Button>
        </div>
      </Card>
    </div>
  );
};
