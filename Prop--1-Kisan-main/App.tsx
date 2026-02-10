import React, { useState } from 'react';
import { uploadMedia } from './storage';
import * as svc from './dataService';
import { createRoot } from 'react-dom/client';
import {
   Tractor,
   ShoppingBag,
   ShoppingCart,
   Truck,
   Phone,
   CheckCircle,
   LogOut,
   Plus,
   Leaf,
   MapPin,
   IndianRupee,
   Camera,
   Menu,
   X,
   Search,
   Filter,
   BarChart3,
   CloudSun,
   Clock,
   ShieldCheck,
   ChevronRight,
   TrendingUp,
   AlertCircle,
   PauseCircle,
   Pause,
   Trash2,
   PlayCircle,
   Package,
   User as UserIcon,
   Home,
   ArrowRight,
   ArrowLeft,
   Calendar,
   Info,
   Navigation,
   Map,
   CheckSquare,
   LayoutDashboard,
   Users,
   FileText,
   AlertTriangle,
   Settings,
   MoreVertical,
   Ban,
   Check,
   Lock,
   Mail,
   Eye,
   EyeOff,
   Shield,
   Bell,
   TrendingDown,
   DollarSign,
   Database,
   Server,
   Cpu,
   Activity,
   Store,
   Star,
   MapPinned,
   Box,
   Sprout,
   Droplets,
   Award,
   Edit2,
   Save,
   Briefcase,
   Layers,
   Scale,
   Route,
   Timer,
   FileClock,
   Download,
   PieChart,
   CalendarClock,
   Zap,
   MessageSquare,
   MessageCircle,
   Send,
   Globe,
   ChevronDown,
   HelpCircle,
   CreditCard,
   Upload
} from 'lucide-react';
import { Button, Input, Card, OTPInput } from './components/UI';
import VoiceInput from './components/VoiceInput';
// import TradeAnimation from './components/TradeAnimation';
// import HarvestBackground from './components/HarvestBackground';
import ChooseRole from './components/ChooseRole';
import { ChatDrawer } from './components/ChatDrawer';
import { InvoiceModal } from './components/InvoiceModal';
// import { analyzeCropImage } from './services/aiService';
import { getSupabase } from './supabaseClient';
import {
   User,
   UserRole,
   CropListing,
   AiAnalysisResult,
   FarmerProfile,
   BuyerProfile,
   TransporterProfile,
   Vehicle,
   Offer,
   Order,
   OrderStatus,
   ListingStatus,
   TransportRequest,
   TransportBid,
   Dispute,
   SystemConfig,
   Transaction,
   Message,
   InventoryItem,
   Payout,
   RFQ,
   RoutePlan
} from './types';

// --- MOCK DATA ---
const INITIAL_USERS: User[] = [];

const INITIAL_LISTINGS: CropListing[] = [];

const INITIAL_ORDERS: Order[] = [];

const MOCK_HISTORY: Transaction[] = [];

const MOCK_NOTIFICATIONS = [];

const FAQ_DATA = [
   { q: 'How do I list my crops for sale?', a: 'Go to "My Crops" section and click "Add New Crop". Upload photos, enter quantity and price, and publish your listing.' },
   { q: 'How are payments processed?', a: 'Payments are processed through secure bank transfers. Once a buyer confirms receipt, payment is released to your linked bank account within 24-48 hours.' },
   { q: 'What if a buyer disputes the quality?', a: 'You can use the Dispute Resolution center. Our team will review the evidence from both parties and provide a fair resolution.' },
   { q: 'How do I negotiate prices?', a: 'When you receive an offer, you can counter-offer with your preferred price. Negotiations continue until both parties agree.' },
   { q: 'Is my data secure?', a: 'Yes, we use bank-grade encryption to protect your personal and financial information. We never share your data with third parties.' },
];

const INITIAL_DISPUTES: Dispute[] = [];

// --- 1. LANDING PAGE ---
const LandingPage = ({ onGetStarted, onAdminLogin }: { onGetStarted: (role?: UserRole, mode?: 'login' | 'register') => void, onAdminLogin: () => void }) => {
   return (
      <div className="relative min-h-screen flex flex-col">
         {/* <HarvestBackground /> */}
         <header className="px-6 py-4 flex justify-between items-center glass sticky top-0 z-50">
            <div className="flex items-center gap-2">
               <div className="w-10 h-10 bg-nature-600 rounded-xl flex items-center justify-center shadow-lg shadow-nature-600/20">
                  <Leaf className="w-6 h-6 text-white" />
               </div>
               <span className="font-bold text-xl text-nature-900 tracking-tight">KisanSetu</span>
            </div>
            <div className="flex gap-4">
               <button onClick={() => onGetStarted(undefined, 'login')} className="text-sm font-medium text-slate-600 hover:text-nature-700">Login</button>
               <Button onClick={() => onGetStarted(undefined, 'register')} className="py-2 px-4 text-sm h-10">Get Started</Button>
            </div>
         </header>

         <main className="flex-1 container mx-auto px-6 py-12 flex flex-col items-center">
            <div className="text-center max-w-3xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
               <div className="inline-block px-4 py-1.5 rounded-full bg-nature-100 text-nature-700 text-sm font-semibold mb-6 border border-nature-200">
                  🌾 Revolutionizing Agri-Commerce
               </div>
               <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                  Connecting Farmers, Buyers, and Transporters — <span className="text-nature-600">Fairly.</span>
               </h1>
               <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
                  Sell directly from your farm. Buy with complete transparency. Deliver with verified jobs. No middlemen, just growth.
               </p>

               <div className="mb-12">
                  {/* <TradeAnimation /> */}
               </div>

               <Button onClick={() => onGetStarted(undefined, 'register')} className="text-lg px-8 py-4 shadow-xl shadow-nature-600/20">Join the Network</Button>
            </div>

            <div className="grid md:grid-cols-3 gap-8 w-full max-w-5xl">
               <Card className="group hover:-translate-y-2 transition-transform duration-300 border-t-4 border-nature-500" onClick={() => onGetStarted('farmer', 'register')}>
                  <div className="h-12 w-12 bg-nature-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                     <Tractor className="w-6 h-6 text-nature-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Farmer</h3>
                  <p className="text-slate-600 mb-4 text-sm">"I grow crops. I want fair prices without middlemen."</p>
                  <div className="flex items-center text-nature-600 font-medium text-sm group-hover:gap-2 transition-all">Join as Farmer <ArrowRight className="w-4 h-4 ml-1" /></div>
               </Card>

               <Card className="group hover:-translate-y-2 transition-transform duration-300 border-t-4 border-blue-500" onClick={() => onGetStarted('buyer', 'register')}>
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                     <ShoppingBag className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Buyer</h3>
                  <p className="text-slate-600 mb-4 text-sm">"I want reliable supply with transparent pricing."</p>
                  <div className="flex items-center text-blue-600 font-medium text-sm group-hover:gap-2 transition-all">Join as Buyer <ArrowRight className="w-4 h-4 ml-1" /></div>
               </Card>

               <Card className="group hover:-translate-y-2 transition-transform duration-300 border-t-4 border-orange-500" onClick={() => onGetStarted('transporter', 'register')}>
                  <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                     <Truck className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Transporter</h3>
                  <p className="text-slate-600 mb-4 text-sm">"I want verified delivery jobs without chaos."</p>
                  <div className="flex items-center text-orange-600 font-medium text-sm group-hover:gap-2 transition-all">Join as Transporter <ArrowRight className="w-4 h-4 ml-1" /></div>
               </Card>
            </div>
         </main>

         <footer className="py-8 text-center text-slate-500 text-sm border-t border-slate-200 bg-white/50 backdrop-blur-sm">
            <p>&copy; 2024 KisanSetu. All rights reserved.</p>
            <button onClick={onAdminLogin} className="mt-4 text-xs font-medium hover:text-nature-700 flex items-center justify-center gap-1 mx-auto"><ShieldCheck className="w-3 h-3" /> Admin Login</button>
         </footer>
      </div>
   );
};

// --- 2. AUTH FLOW COMPONENTS ---

const AdminLogin = ({ onLogin, onBack }: { onLogin: () => void, onBack: () => void }) => {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (email === 'admin@kisansetu.com' && password === 'admin') {
         onLogin();
      } else {
         alert("Invalid Admin Credentials");
      }
   };

   return (
      <div className="w-full max-w-md mx-auto animate-in fade-in zoom-in duration-300">
         <button onClick={onBack} className="mb-4 text-slate-500 hover:text-slate-800 flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> Back</button>
         <div className="glass-card p-8 rounded-3xl border-t-4 border-nature-900 shadow-2xl">
            <div className="flex justify-center mb-6">
               <div className="h-16 w-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <ShieldCheck className="w-8 h-8" />
               </div>
            </div>
            <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">Admin Portal</h2>
            <p className="text-center text-slate-500 mb-8 text-sm">Restricted access for platform administrators.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
               <Input label="Admin Email" type="email" value={email} onChange={e => setEmail(e.target.value)} icon={<Mail className="w-4 h-4" />} />
               <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} icon={<Lock className="w-4 h-4" />} />
               <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/20 h-12" type="submit">Secure Login</Button>
            </form>
         </div>
      </div>
   );
};

const AuthWizard = ({ initialRole, initialMode = 'login', onComplete, onBack }: { initialRole: UserRole | null, initialMode?: 'login' | 'register', onComplete: (user: any) => void, onBack: () => void }) => {
   const [step, setStep] = useState<'role-select' | 'auth' | 'profile'>(initialRole ? 'auth' : 'role-select');
   const [isLoginMode, setAuthMode] = useState<'login' | 'register'>(initialMode);
   const [isLoading, setIsLoading] = useState(false);
   const [formData, setFormData] = useState({
      role: initialRole,
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      userId: '',
      profile: {} as any
   });

   const getAuthErrorMessage = (err: any) => {
      const code = err?.code as string | undefined;
      const msg = (err?.message || '').toString();
      const msgLower = msg.toLowerCase();
      if (code === 'user_already_exists' || msgLower.includes('already registered') || msgLower.includes('already been registered') || msgLower.includes('already exists')) {
         return "An account already exists for this number. Please login instead.";
      }
      if (code === 'invalid_credentials' || msgLower.includes('invalid login')) {
         return "Invalid number or password.";
      }
      if (code === 'password_not_set') {
         return "Password login is not enabled for this user.";
      }
      return msg || "Authentication failed";
   };

   const withTimeout = async <T,>(label: string, promise: Promise<T>, ms = 20000) => {
      let timer: any;
      try {
         return await Promise.race([
            promise,
            new Promise<T>((_, reject) => {
               timer = setTimeout(() => reject(new Error(`request_timeout:${label}`)), ms);
            })
         ]);
      } finally {
         if (timer) clearTimeout(timer);
      }
   };

   const handleRoleSelect = (role: UserRole) => {
      setFormData(prev => ({ ...prev, role }));
      setStep('auth');
   };

   const handleSubmit = async () => {
      if (!formData.phone || !formData.password) {
         alert("Please enter mobile number and password");
         return;
      }
      
      setIsLoading(true);

      try {
         if (isLoginMode === 'register') {
            if (formData.password !== formData.confirmPassword) {
               alert("Passwords do not match");
               return;
            }
            if (formData.password.length < 6) {
               alert("Password must be at least 6 characters");
               return;
            }

            const res: any = await withTimeout('register', svc.registerWithPhonePassword(formData.phone, formData.password, { role: formData.role || undefined, email: null }), 25000);
            if (res?.error) {
               const friendly = getAuthErrorMessage(res.error);
               alert(friendly);
               if (friendly.toLowerCase().includes('already exists')) setAuthMode('login');
               return;
            }

            const userId = res?.data?.id;
            if (!userId) return;

            setFormData(prev => ({ ...prev, userId }));
            setStep('profile');
         } else {
            const res: any = await withTimeout('login', svc.loginWithPhonePassword(formData.phone, formData.password), 25000);
            if (res?.error) { alert(getAuthErrorMessage(res.error)); return; }

            const userId = res?.data?.id;
            if (!userId) return;

            const hasProfile = !!res?.data?.profile && !!res?.data?.role
            if (hasProfile) {
               onComplete(res.data);
               return;
            }

            alert("Login successful. Please complete your profile to continue.");
            setFormData(prev => ({ ...prev, userId, role: (res?.data?.role as any) || prev.role, email: (res?.data?.email as any) || '' }));
            setStep('profile');
         }
      } catch (e: any) {
         const message = (e?.message || '').toString();
         if (message.startsWith('request_timeout:')) {
            const label = message.split(':')[1] || 'request'
            const c = getSupabase()
            const session = c ? (await c.auth.getSession()).data.session : null
            const sessionUserId = session?.user?.id
            if (label === 'sign_in' && sessionUserId) {
               const profile = await withTimeout('fetch_profile', svc.getUserById(sessionUserId), 25000)
               if (profile) {
                  onComplete(profile)
                  return
               }
               alert("Login succeeded, but your profile is not set up yet. Please complete your profile to continue.");
               setFormData(prev => ({ ...prev, userId: sessionUserId }));
               setStep('profile');
               return
            }

            const net = await svc.checkSupabaseConnectivity(8000)
            const authPart = net?.auth?.ok ? `auth=${net.auth.status}` : `auth_error=${net?.auth?.error || 'unknown'}`
            const restPart = net?.rest?.ok ? `rest=${net.rest.status}` : `rest_error=${net?.rest?.error || 'unknown'}`
            alert(`Request timed out during ${label}. Connectivity: ${authPart}, ${restPart}. If rest/auth are failing, disable AdBlock/VPN, try Incognito, and allow requests to *.supabase.co.`);
            return
         }
         alert(getAuthErrorMessage(e));
      } finally {
         setIsLoading(false);
      }
   };

   if (step === 'role-select') {
      return <ChooseRole onSelect={handleRoleSelect} onBack={onBack} />;
   }

   return (
      <div className="w-full max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8">
         <button onClick={onBack} className="mb-6 text-slate-500 hover:text-nature-700 flex items-center gap-2 font-medium transition-colors"><ArrowLeft className="w-4 h-4" /> Back to Home</button>

         <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden flex flex-col md:flex-row min-h-[500px]">
            {/* Left Side - Visual */}
            <div className="hidden md:flex w-1/3 bg-nature-600 p-8 flex-col justify-between text-white relative overflow-hidden">
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1625246333195-58197bd47d72?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
               <div className="relative z-10">
                  <Leaf className="w-10 h-10 mb-6 text-nature-200" />
                  <h3 className="text-2xl font-bold mb-2">Join KisanSetu</h3>
                  <p className="text-nature-100 text-sm">Empowering farmers, connecting markets.</p>
               </div>
               <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-3 text-sm"><div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"><Check className="w-4 h-4" /></div> <span>Fair Prices</span></div>
                  <div className="flex items-center gap-3 text-sm"><div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"><Check className="w-4 h-4" /></div> <span>Verified Buyers</span></div>
                  <div className="flex items-center gap-3 text-sm"><div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"><Check className="w-4 h-4" /></div> <span>Secure Payments</span></div>
               </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 p-8 md:p-12 bg-white flex flex-col justify-center">
               
               {step === 'auth' && (
                  <div className="w-full max-w-sm mx-auto animate-in fade-in slide-in-from-bottom-8">
                     <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-nature-600/10 mx-auto mb-4">
                           <Phone className="w-8 h-8 text-nature-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">{isLoginMode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
                        <p className="text-slate-500 text-sm">{isLoginMode === 'login' ? 'Login with your mobile number and password.' : 'Register with your mobile number and password.'}</p>
                     </div>
                     <div className="space-y-4">
                        <Input label="Mobile Number" placeholder="9876543210" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} icon={<Phone className="w-4 h-4" />} type="tel" />
                        <Input label="Password" type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} icon={<Lock className="w-4 h-4" />} />
                        
                        {isLoginMode === 'register' && (
                           <Input label="Confirm Password" type="password" value={formData.confirmPassword} onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })} icon={<ShieldCheck className="w-4 h-4" />} />
                        )}
 
                        <Button className="w-full h-12" onClick={handleSubmit} disabled={isLoading}>
                           {isLoading ? 'Processing...' : (isLoginMode === 'login' ? 'Login' : 'Continue')}
                        </Button>
                        <div className="text-center">
                           <button onClick={() => setAuthMode(isLoginMode === 'login' ? 'register' : 'login')} className="text-sm font-medium text-nature-600 hover:text-nature-700 underline">
                              {isLoginMode === 'login' ? "New here? Create Account" : "Already have an account? Login"}
                           </button>
                        </div>
                     </div>
                  </div>
               )}

               {step === 'profile' && (
                  <div className="w-full animate-in fade-in">
                     <div className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900">Complete Profile</h2>
                        <p className="text-slate-500">Tell us more about yourself to get the best experience.</p>
                     </div>
                     {formData.role === 'farmer' && <FarmerRegistration onSubmit={async (p) => {
                        const userPayload = { id: formData.userId, email: formData.email, phone: formData.phone || null, role: formData.role, status: 'active', createdAt: new Date().toISOString(), profile: p };
                        const saved = await svc.addUser(userPayload);
                        if (!saved) { alert('Failed to save profile. Check Supabase RLS/policies.'); return; }
                        onComplete(saved);
                     }} />}
                     {formData.role === 'buyer' && <BuyerRegistration onSubmit={async (p) => {
                        const userPayload = { id: formData.userId, email: formData.email, phone: formData.phone || null, role: formData.role, status: 'active', createdAt: new Date().toISOString(), profile: p };
                        const saved = await svc.addUser(userPayload);
                        if (!saved) { alert('Failed to save profile. Check Supabase RLS/policies.'); return; }
                        onComplete(saved);
                     }} />}
                     {formData.role === 'transporter' && <TransporterRegistration onSubmit={async (p) => {
                        const userPayload = { id: formData.userId, email: formData.email, phone: formData.phone || null, role: formData.role, status: 'active', createdAt: new Date().toISOString(), profile: p };
                        const saved = await svc.addUser(userPayload);
                        if (!saved) { alert('Failed to save profile. Check Supabase RLS/policies.'); return; }
                        onComplete(saved);
                     }} />}
                  </div>
               )}
            </div>
         </div>
      </div>
   );
};

// --- 3. REGISTRATION FORMS (Reused) ---
const FarmerRegistration = ({ onSubmit }: { onSubmit: (profile: FarmerProfile) => void }) => {
   const [step, setStep] = useState(1);
   const [data, setData] = useState<FarmerProfile>({ fullName: '', village: '', district: '', state: 'Madhya Pradesh', language: 'Hindi', totalLandArea: '', landUnit: 'Acres', landType: 'Owned', irrigationSource: 'Borewell', currentCrops: [], farmingPractices: [] });

   return (
      <div className="space-y-6">
         {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
               <div><h3 className="font-bold text-slate-900 mb-1">Basic Details</h3><p className="text-xs text-slate-500">We need these to connect you locally.</p></div>
               <Input label="Full Name" placeholder="Rajesh Kumar" value={data.fullName} onChange={e => setData({ ...data, fullName: e.target.value })} />
               <Input label="Village" placeholder="Sehore" value={data.village} onChange={e => setData({ ...data, village: e.target.value })} />
               <Input label="District" placeholder="Sehore" value={data.district} onChange={e => setData({ ...data, district: e.target.value })} />
               <Button className="w-full h-12" onClick={() => onSubmit({ ...data, memberSince: new Date().toISOString(), rating: 5, totalSales: 0 })} disabled={!data.fullName || !data.village}>Finish Setup</Button>
            </div>
         )}
      </div>
   );
};

const BuyerRegistration = ({ onSubmit }: { onSubmit: (profile: BuyerProfile) => void }) => {
   const [step, setStep] = useState(1);
   const [data, setData] = useState<BuyerProfile>({ fullName: '', businessName: '', city: '', state: '', language: 'English', buyerType: 'Individual Trader', procurementRegions: [], preferredCrops: [], purchaseCapacity: 'Small (≤ 1 ton)' });

   return (
      <div className="space-y-6">
         {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
               <div><h3 className="font-bold text-slate-900 mb-1">Company Details</h3><p className="text-xs text-slate-500">Tell us about your procurement entity.</p></div>
               <Input label="Full Name" value={data.fullName} onChange={e => setData({ ...data, fullName: e.target.value })} />
               <Input label="Business Name (Optional)" value={data.businessName} onChange={e => setData({ ...data, businessName: e.target.value })} />
               <Input label="City" value={data.city} onChange={e => setData({ ...data, city: e.target.value })} />
               <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700" onClick={() => onSubmit({ ...data, memberSince: new Date().toISOString(), rating: 5, completedDeals: 0 })} disabled={!data.fullName || !data.city}>Finish Setup</Button>
            </div>
         )}
      </div>
   );
};

const TransporterRegistration = ({ onSubmit }: { onSubmit: (profile: TransporterProfile) => void }) => {
   const [data, setData] = useState<TransporterProfile>({ fullName: '', vehicleType: 'Pickup Truck', maxCapacity: '', approvalStatus: 'pending', city: '', state: '', language: 'Hindi', vehicleNumber: '', vehicleName: '', numberPlatePhoto: '', vehiclePhoto: '', operatingRegions: [] });
   const uploadOrFallback = async (file: File, field: 'numberPlatePhoto' | 'vehiclePhoto') => {
      const url = await uploadMedia(file, `transporter/${data.vehicleNumber || data.fullName || 'new'}`);
      if (url) {
         setData(prev => ({ ...prev, [field]: url }));
         return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setData(prev => ({ ...prev, [field]: reader.result as string }));
      reader.readAsDataURL(file);
   };
   return (
      <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
         <div><h3 className="font-bold text-slate-900 mb-1">Vehicle Details</h3><p className="text-xs text-slate-500">Enter vehicle information for verification.</p></div>
         <Input label="Full Name" value={data.fullName} onChange={e => setData({ ...data, fullName: e.target.value })} />
         <div className="flex gap-2">
            <div className="flex-1">
               <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Vehicle Type</label>
               <select className="w-full h-12 bg-white border border-slate-300 rounded-xl px-3 outline-none" value={data.vehicleType} onChange={e => setData({ ...data, vehicleType: e.target.value })}>
                  <option>Pickup Truck</option><option>Mini Truck</option><option>Tractor Trolley</option><option>Large Truck</option>
               </select>
            </div>
            <Input label="Capacity (Kg)" className="w-1/3" type="number" value={data.maxCapacity} onChange={e => setData({ ...data, maxCapacity: e.target.value })} />
         </div>
         <Input label="Vehicle Name" placeholder="e.g. Tata Ace, Bolero Pickup" value={data.vehicleName} onChange={e => setData({ ...data, vehicleName: e.target.value })} />
         <Input label="Vehicle Number" placeholder="MP04 GA 1234" value={data.vehicleNumber} onChange={e => setData({ ...data, vehicleNumber: e.target.value })} />
         <div className="grid md:grid-cols-2 gap-4">
            <div>
               <label className="block text-sm font-medium text-slate-600 mb-1.5 ml-1">Number Plate Photo</label>
               <input
                  type="file"
                  accept="image/*"
                  className="w-full bg-white/60 backdrop-blur-sm border border-slate-200 rounded-xl px-4 py-3"
                  onChange={async e => {
                     const file = e.target.files?.[0];
                     if (!file || file.size > 5 * 1024 * 1024) return;
                     await uploadOrFallback(file, 'numberPlatePhoto');
                  }}
               />
               {data.numberPlatePhoto && <img src={data.numberPlatePhoto} alt="Number Plate" className="mt-2 h-24 w-full object-cover rounded-lg border border-slate-200" />}
            </div>
            <div>
               <label className="block text-sm font-medium text-slate-600 mb-1.5 ml-1">Vehicle Photo</label>
               <input
                  type="file"
                  accept="image/*"
                  className="w-full bg-white/60 backdrop-blur-sm border border-slate-200 rounded-xl px-4 py-3"
                  onChange={async e => {
                     const file = e.target.files?.[0];
                     if (!file || file.size > 5 * 1024 * 1024) return;
                     await uploadOrFallback(file, 'vehiclePhoto');
                  }}
               />
               {data.vehiclePhoto && <img src={data.vehiclePhoto} alt="Vehicle" className="mt-2 h-24 w-full object-cover rounded-lg border border-slate-200" />}
            </div>
         </div>

         <div className="p-4 bg-orange-50 rounded-xl border border-orange-200 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
            <div className="text-xs text-orange-800">
               <p className="font-bold mb-1">Verification Pending</p>
               <p>Your profile will go through a quick admin check before you can accept jobs.</p>
            </div>
         </div>
         <Button className="w-full h-12 bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-600/20" onClick={() => onSubmit({ ...data, memberSince: new Date().toISOString(), rating: 5, totalDeliveries: 0 })} disabled={!data.fullName || !data.vehicleNumber}>
            Submit for Approval
         </Button>
      </div>
   );
};

// --- 4. DASHBOARDS ---

const FarmerDashboard = ({ user, listings, offers, orders, messages, inventoryItems, payouts, transportRequests, allUsers, onAddInventoryItem, onAddPayout, onSendMessage, onAddListing, onUpdateListing, onDeleteListing, onUpdateProfile, onUpdateListingStatus, onAcceptOffer, onRejectOffer, onCounterOffer, onRaiseDispute, onLogout, onAcceptTransportRequest, onOpenChat, onViewInvoice, onUpdateOrderPayment }: any) => {
   const [view, setView] = useState('home');
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
   const myListings = listings.filter((l: any) => l.farmerId === user.id);
   const myOffers = offers.filter((o: any) => myListings.some((l: any) => l.id === o.listingId));
   const myOrders = (orders || []).filter((o: any) => o?.farmerName === user?.profile?.fullName);
   const myHistory = MOCK_HISTORY.filter(h => h.type === 'sale'); // Mock history for farmer

   const [images, setImages] = useState<string[]>([]);
   const [video, setVideo] = useState<{ url: string; durationSec: number; sizeBytes: number; type: string; thumbnail?: string } | null>(null);
   const [aiData, setAiData] = useState<AiAnalysisResult | null>(null);
   const [isAddingCrop, setIsAddingCrop] = useState(false);
   const [cropStep, setCropStep] = useState(1);
   const [isAnalyzing, setIsAnalyzing] = useState(false);
   const [editingListingId, setEditingListingId] = useState<string | null>(null);
   const [formData, setFormData] = useState({
      quantity: '',
      quantityUnit: 'kg' as 'kg' | 'quintal' | 'ton' | 'gram',
      price: '',
      priceUnit: 'per_kg' as 'per_kg' | 'per_quintal' | 'per_ton' | 'per_gram',
      variety: '',
      harvestDate: new Date().toISOString().split('T')[0],
      storageType: 'Ambient' as any,
      moistureContent: '',
      minOrderQuantity: '',
      minOrderQuantityUnit: 'kg' as 'kg' | 'quintal' | 'ton' | 'gram',
      availableDate: new Date().toISOString().split('T')[0],
      packagingDetails: '',
      description: '',
      certification: [] as string[]
   });
   const [certText, setCertText] = useState('');

   // Profile Edit State
   const [profileData, setProfileData] = useState<FarmerProfile>(user.profile);
   const [profileTab, setProfileTab] = useState<'overview' | 'edit'>('overview');

   // Notifications State
   const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
   const [notificationFilter, setNotificationFilter] = useState<'all' | 'unread' | 'offer' | 'order'>('all');

   // Help & Support State
   const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
   const [supportForm, setSupportForm] = useState({ name: user.profile.fullName, email: '', issue: '' });
   const [counterModal, setCounterModal] = useState<{open: boolean, offer: any | null}>({ open: false, offer: null });
   const [counterPrice, setCounterPrice] = useState('');

   // Settings State
   const [settingsData, setSettingsData] = useState({
      notifyOffers: true,
      notifyOrders: true,
      notifyPrices: true,
      notifySystem: false,
      language: user.profile.language || 'English',
      profileVisible: true,
   });

   // Function to handle editing an existing listing
   const handleEditDetail = (listing: any) => {
      setEditingListingId(listing.id);
      setImages(listing.imageUrls || [listing.imageUrl]);
      setAiData({
         cropName: listing.cropName,
         grade: listing.grade,
         qualityDescription: listing.description,
         estimatedPrice: listing.pricePerKg,
         confidence: 0.9
      });
      setFormData({
         quantity: (listing.quantityUnit ? fromKg(Number(listing.quantity || 0), listing.quantityUnit) : Number(listing.quantity || 0)).toString(),
         quantityUnit: listing.quantityUnit || 'kg',
         price: (listing.priceUnit ? priceFromPerKg(Number(listing.pricePerKg || 0), listing.priceUnit) : Number(listing.pricePerKg || 0)).toString(),
         priceUnit: listing.priceUnit || 'per_kg',
         variety: listing.variety || '',
         harvestDate: listing.harvestDate || new Date().toISOString().split('T')[0],
         storageType: listing.storageType || 'Ambient',
         moistureContent: listing.moistureContent?.toString() || '',
         minOrderQuantity: (listing.minOrderQuantityUnit ? fromKg(Number(listing.minOrderQuantity || 0), listing.minOrderQuantityUnit) : Number(listing.minOrderQuantity || 0)).toString(),
         minOrderQuantityUnit: listing.minOrderQuantityUnit || 'kg',
         availableDate: listing.availableDate || new Date().toISOString().split('T')[0],
         packagingDetails: listing.packagingDetails || '',
         description: listing.description || '',
         certification: listing.certification || []
      });
      setIsAddingCrop(true);
      setCropStep(1);
   };

   // Helpers
   const currentDate = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

   const calculateCompleteness = (p: FarmerProfile) => {
      let filled = 0;
      let total = 10; // Key fields to track
      if (p.fullName) filled++;
      if (p.village) filled++;
      if (p.district) filled++;
      if (p.state) filled++;
      if (p.totalLandArea) filled++;
      if (p.landType) filled++;
      if (p.irrigationSource) filled++;
      if (p.currentCrops && p.currentCrops.length > 0) filled++;
      if (p.farmingPractices && p.farmingPractices.length > 0) filled++;
      if (p.pincode) filled++;
      return Math.round((filled / total) * 100);
   };

   const unitFactor = (u: 'kg' | 'quintal' | 'ton' | 'gram') => (u === 'kg' ? 1 : u === 'quintal' ? 100 : u === 'ton' ? 1000 : 0.001);
   const toKg = (value: number, unit: 'kg' | 'quintal' | 'ton' | 'gram') => value * unitFactor(unit);
   const fromKg = (valueKg: number, unit: 'kg' | 'quintal' | 'ton' | 'gram') => valueKg / unitFactor(unit);
   const priceToPerKg = (value: number, unit: 'per_kg' | 'per_quintal' | 'per_ton' | 'per_gram') => {
      if (unit === 'per_kg') return value;
      if (unit === 'per_quintal') return value / 100;
      if (unit === 'per_ton') return value / 1000;
      return value / 0.001;
   };
   const priceFromPerKg = (valuePerKg: number, unit: 'per_kg' | 'per_quintal' | 'per_ton' | 'per_gram') => {
      if (unit === 'per_kg') return valuePerKg;
      if (unit === 'per_quintal') return valuePerKg * 100;
      if (unit === 'per_ton') return valuePerKg * 1000;
      return valuePerKg * 0.001;
   };

   const handleProfileSave = () => {
      onUpdateProfile(user.id, profileData);
      setProfileTab('overview');
   };

   const [viewerOpen, setViewerOpen] = useState(false);
   const [viewerAssets, setViewerAssets] = useState<Array<{ type: 'image' | 'video'; src: string; poster?: string }>>([]);
   const [viewerIndex, setViewerIndex] = useState(0);

   const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) {
         setIsAddingCrop(true);
         setCropStep(1);

         const newImages: string[] = [];
         const remainingSlots = 5 - images.length;
         const filesToProcess = files.slice(0, remainingSlots);

         for (const file of filesToProcess) {
            const reader = new FileReader();
            const base64 = await new Promise<string>((resolve) => {
               reader.onloadend = () => resolve(reader.result as string);
               reader.readAsDataURL(file);
            });
            newImages.push(base64);
         }

         const updatedImages = [...images, ...newImages];
         setImages(updatedImages);

         if (!aiData && updatedImages.length > 0) {
            setIsAnalyzing(true);
            try {
               // const result = await analyzeCropImage(updatedImages[0]);
               const result = {
                  cropName: "Wheat",
                  grade: "A",
                  estimatedPrice: 30,
                  qualityDescription: "Simulated AI Analysis",
                  confidence: 0.95
               } as any;
               setAiData(result);
               setFormData(prev => ({
                  ...prev,
                  price: result.estimatedPrice.toString(),
                  description: result.qualityDescription
               }));
            } catch (err) {
               console.error("AI Analysis failed", err);
            } finally {
               setIsAnalyzing(false);
            }
         }
      }
   };

   const AssetCarousel: React.FC<{ assets: Array<{ type: 'image' | 'video'; src: string; poster?: string }>; heightClass?: string; onOpen?: (index: number) => void }> = ({ assets, heightClass = 'h-44', onOpen }) => {
      const containerRef = React.useRef<HTMLDivElement>(null);
      const scrollBy = (dir: 'left' | 'right') => {
         const el = containerRef.current;
         if (!el) return;
         const amount = el.clientWidth;
         el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
      };
      return (
         <div className={`relative ${heightClass}`}>
            <div ref={containerRef} className="w-full h-full overflow-x-auto flex snap-x snap-mandatory scroll-smooth">
               {assets.map((a, idx) => (
                  <div key={idx} className="min-w-full snap-start relative">
                     {a.type === 'video' ? (
                        <video
                           src={a.src}
                           className="w-full h-full object-cover"
                           controls
                           playsInline
                           preload="metadata"
                           poster={a.poster}
                           onClick={() => onOpen && onOpen(idx)}
                        />
                     ) : (
                        <img
                           src={a.src}
                           className="w-full h-full object-cover"
                           onClick={() => onOpen && onOpen(idx)}
                           alt=""
                        />
                     )}
                  </div>
               ))}
            </div>
            {assets.length > 1 && (
               <>
                  <button aria-label="Prev" onClick={() => scrollBy('left')} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full p-2 text-slate-700 hover:bg-white shadow">
                     <ArrowLeft className="w-4 h-4" />
                  </button>
                  <button aria-label="Next" onClick={() => scrollBy('right')} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full p-2 text-slate-700 hover:bg-white shadow">
                     <ArrowRight className="w-4 h-4" />
                  </button>
               </>
            )}
         </div>
      );
   };

   const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const sizeBytes = file.size;
      const type = file.type;
      const objectUrl = URL.createObjectURL(file);
      const vid = document.createElement('video');
      vid.preload = 'metadata';
      vid.src = objectUrl;
      vid.onloadedmetadata = () => {
         const durationSec = Math.floor(vid.duration);
         if (durationSec > 60) {
            URL.revokeObjectURL(objectUrl);
            alert('Video must be 60 seconds or less');
            (e.target as any).value = '';
            return;
         }
         const canvas = document.createElement('canvas');
         canvas.width = 320;
         canvas.height = 180;
         const ctx = canvas.getContext('2d');
         const capture = () => {
            if (ctx) {
               ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
               const thumbnail = canvas.toDataURL('image/jpeg');
               setVideo({ url: objectUrl, durationSec, sizeBytes, type, thumbnail });
            } else {
               setVideo({ url: objectUrl, durationSec, sizeBytes, type });
            }
         };
         vid.currentTime = Math.min(1, durationSec);
         vid.onseeked = capture;
         vid.onloadeddata = capture;
      };
   };

   const publishListing = async () => {
      if (!aiData || (images.length === 0 && !video)) return;

      const uploadedImages = await Promise.all(images.map((img, idx) => uploadMedia(img, `listings/${user.id}`)));
      const imageUrls = uploadedImages.map(u => u || '').filter(Boolean);
      const videoUrlFinal = video?.url ? await uploadMedia(video.url, `listings/${user.id}`) : null;
      const listingData = {
         id: editingListingId || Date.now().toString(),
         farmerId: user.id,
         farmerName: user.profile?.fullName,
         cropName: aiData.cropName,
         variety: formData.variety,
         grade: aiData.grade,
         quantity: toKg(Number(formData.quantity || 0), formData.quantityUnit),
         quantityUnit: formData.quantityUnit,
         availableQuantity: toKg(Number(formData.quantity || 0), formData.quantityUnit),
         pricePerKg: priceToPerKg(Number(formData.price || 0), formData.priceUnit),
         priceUnit: formData.priceUnit,
         description: formData.description || aiData.qualityDescription,
         imageUrls: imageUrls.length ? imageUrls : images,
         videoUrl: videoUrlFinal || video?.url || undefined,
         videoDurationSec: video?.durationSec,
         videoSizeBytes: video?.sizeBytes,
         videoType: (video?.type as any) || undefined,
         videoThumbnail: video?.thumbnail,
         location: user.profile?.village || user.profile?.city,
         status: 'active',
         harvestDate: formData.harvestDate,
         availableDate: formData.availableDate,
         storageType: formData.storageType,
         minOrderQuantity: toKg(Number(formData.minOrderQuantity || 0), formData.minOrderQuantityUnit),
         minOrderQuantityUnit: formData.minOrderQuantityUnit,
         moistureContent: Number(formData.moistureContent),
         packagingDetails: formData.packagingDetails,
         certification: formData.certification,
         createdAt: new Date().toISOString()
      };

      if (editingListingId) {
         onUpdateListing(listingData);
      } else {
         onAddListing(listingData);
      }

      setIsAddingCrop(false);
      setEditingListingId(null);
      setImages([]);
      setVideo(null);
      setAiData(null);
      setCropStep(1);
      setFormData({
         quantity: '',
         quantityUnit: 'kg',
         price: '',
         priceUnit: 'per_kg',
         variety: '',
         harvestDate: new Date().toISOString().split('T')[0],
         storageType: 'Ambient',
         moistureContent: '',
         minOrderQuantity: '',
         minOrderQuantityUnit: 'kg',
         availableDate: new Date().toISOString().split('T')[0],
         packagingDetails: '',
         description: '',
         certification: []
      });
   };

   const SidebarItem = ({ id, label, icon: Icon, badge }: any) => (
      <button
         onClick={() => { setView(id); setIsSidebarOpen(false); }}
         className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${view === id ? 'bg-nature-600 text-white shadow-lg shadow-nature-600/30' : 'text-slate-600 hover:bg-slate-100'}`}
      >
         <Icon className="w-5 h-5" />
         <span className="flex-1 text-left">{label}</span>
         {badge > 0 && <span className={`text-xs px-2 py-0.5 rounded-full ${view === id ? 'bg-white/20 text-white' : 'bg-red-100 text-red-600'}`}>{badge}</span>}
      </button>
   );

   return (
      <div className="min-h-screen bg-slate-50 flex">
         {/* SIDEBAR - DESKTOP */}
         <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200 flex-col fixed h-full z-20">
            <div className="p-6 border-b border-slate-100 flex items-center gap-2">
               <div className="w-8 h-8 bg-nature-600 rounded-lg flex items-center justify-center shadow-md">
                  <Leaf className="w-5 h-5 text-white" />
               </div>
               <span className="font-bold text-xl text-nature-900 tracking-tight">KisanSetu</span>
            </div>
            <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
               <SidebarItem id="home" label="Dashboard" icon={LayoutDashboard} />
               <SidebarItem id="my-crops" label="My Crops" icon={Package} badge={myListings.length} />
               <SidebarItem id="offers" label="Offers" icon={ShoppingBag} badge={myOffers.length} />
               <SidebarItem id="orders" label="Orders" icon={Truck} badge={myOrders.length} />
               <SidebarItem id="inventory" label="Inventory" icon={Package} />
               <SidebarItem id="payments" label="Payments" icon={IndianRupee} />
               <SidebarItem id="history" label="History & Insights" icon={FileClock} />
               <SidebarItem id="messages" label="Messages" icon={MessageCircle} />
               <SidebarItem id="addresses" label="Addresses" icon={MapPin} />
               <SidebarItem id="more" label="Pro Features" icon={Settings} />
               <SidebarItem id="profile" label="Kisan Profile" icon={UserIcon} />
               <SidebarItem id="notifications" label="Notifications" icon={Bell} badge={2} />
               <SidebarItem id="help" label="Help & Support" icon={Info} />
               <SidebarItem id="settings" label="Settings" icon={Settings} />
            </nav>
            <div className="p-4 border-t border-slate-100">
               <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors">
                  <LogOut className="w-5 h-5" /> Logout
               </button>
            </div>
         </aside>

         {/* MOBILE DRAWER */}
         {isSidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden bg-black/50 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}>
               <div className="w-3/4 max-w-xs bg-white h-full shadow-2xl p-4 flex flex-col" onClick={e => e.stopPropagation()}>
                  <div className="flex justify-between items-center mb-6">
                     <span className="font-bold text-xl text-nature-900">Menu</span>
                     <button onClick={() => setIsSidebarOpen(false)} className="p-2 bg-slate-100 rounded-full"><X className="w-5 h-5" /></button>
                  </div>
                  <nav className="space-y-2 flex-1 overflow-y-auto pr-2">
                     <SidebarItem id="home" label="Dashboard" icon={LayoutDashboard} />
                     <SidebarItem id="my-crops" label="My Crops" icon={Package} badge={myListings.length} />
                     <SidebarItem id="offers" label="Offers" icon={ShoppingBag} badge={myOffers.length} />
                     <SidebarItem id="orders" label="Orders" icon={Truck} badge={myOrders.length} />
                     <SidebarItem id="inventory" label="Inventory" icon={Package} />
                     <SidebarItem id="payments" label="Payments" icon={IndianRupee} />
                     <SidebarItem id="history" label="History & Insights" icon={FileClock} />
                     <SidebarItem id="profile" label="Kisan Profile" icon={UserIcon} />
                     <SidebarItem id="notifications" label="Notifications" icon={Bell} badge={2} />
                     <SidebarItem id="help" label="Help & Support" icon={Info} />
                     <SidebarItem id="settings" label="Settings" icon={Settings} />
                  </nav>
                  <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-600 bg-red-50">
                     <LogOut className="w-5 h-5" /> Logout
                  </button>
               </div>
            </div>
         )}

         {/* MAIN CONTENT */}
         <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
            {/* TOP BAR - STICKY */}
            <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex justify-between items-center">
               <div className="flex items-center gap-3">
                  <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-slate-100 rounded-full lg:hidden">
                     <Menu className="w-6 h-6 text-slate-700" />
                  </button>
                  <h1 className="text-lg font-bold text-slate-800 lg:hidden">KisanSetu</h1>
               </div>
               <div className="flex items-center gap-4">
                  <button className="relative p-2 hover:bg-slate-100 rounded-full">
                     <Bell className="w-6 h-6 text-slate-600" />
                     {myOffers.length > 0 && <span className="absolute top-1.5 right-2 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white animate-pulse"></span>}
                  </button>
                  <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                     <div className="text-right hidden md:block">
                        <div className="text-sm font-bold text-slate-900">{user.profile.fullName}</div>
                        <div className="text-xs text-slate-500">{user.profile.village}, {user.profile.district}</div>
                     </div>
                     <div className="w-10 h-10 bg-nature-100 rounded-full flex items-center justify-center border-2 border-nature-200 text-nature-700 font-bold text-lg">
                        {user.profile.fullName[0]}
                     </div>
                  </div>
               </div>
            </header>

            <main className="p-4 md:p-6 lg:p-8 max-w-6xl mx-auto w-full">

               {view === 'inventory' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                     <div><h2 className="text-2xl font-black text-slate-900">Inventory Management</h2><p className="text-slate-500">Track batches, grades, and storage.</p></div>
                     <Card className="p-6 space-y-4">
                        <div className="grid md:grid-cols-3 gap-4">
                           <select className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-medium outline-nature-500" id="inv-listing">
                              {listings.filter((l: any) => l.farmerId === user.id).map((l: any) => (<option key={l.id} value={l.id}>{l.cropName}</option>))}
                           </select>
                           <Input id="inv-batch" placeholder="Batch ID" />
                           <select className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-medium outline-nature-500" id="inv-grade">
                              <option value="A">Grade A</option><option value="B">Grade B</option><option value="C">Grade C</option>
                           </select>
                           <Input id="inv-qty" type="number" placeholder="Quantity (kg)" />
                           <Input id="inv-store" placeholder="Storage Location" />
                           <Input id="inv-exp" type="date" placeholder="Expiry" />
                        </div>
                        <Button className="w-full md:w-auto" onClick={() => {
                           const listingId = (document.getElementById('inv-listing') as HTMLSelectElement)?.value;
                           const batchId = (document.getElementById('inv-batch') as HTMLInputElement)?.value;
                           const grade = (document.getElementById('inv-grade') as HTMLSelectElement)?.value as any;
                           const qty = Number((document.getElementById('inv-qty') as HTMLInputElement)?.value || 0);
                           const store = (document.getElementById('inv-store') as HTMLInputElement)?.value;
                           const exp = (document.getElementById('inv-exp') as HTMLInputElement)?.value;
                           if (!listingId || !batchId || qty <= 0) return;
                           onAddInventoryItem?.({ listingId, batchId, grade, quantityKg: qty, storageLocation: store, expiryDate: exp });
                        }}>Add Batch</Button>
                     </Card>
                     <Card className="p-6">
                        <div className="grid md:grid-cols-2 gap-4">
                           {(inventoryItems || []).filter(i => listings.find((l: any) => l.id === i.listingId)?.farmerId === user.id).map(i => (
                              <div key={i.id} className="p-4 bg-slate-50 rounded-xl">
                                 <div className="text-xs text-slate-400 uppercase font-bold">Batch {i.batchId}</div>
                                 <div className="font-bold text-slate-900">{listings.find((l: any) => l.id === i.listingId)?.cropName} • {i.grade}</div>
                                 <div className="text-sm text-slate-600">{i.quantityKg} kg • {i.storageLocation || 'Storage'} • {i.expiryDate || 'No expiry'}</div>
                              </div>
                           ))}
                           {(inventoryItems || []).filter(i => listings.find((l: any) => l.id === i.listingId)?.farmerId === user.id).length === 0 && <div className="text-sm text-slate-400">No inventory yet.</div>}
                        </div>
                     </Card>
                  </div>
               )}

               {view === 'payments' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                     <div><h2 className="text-2xl font-black text-slate-900">Payments & Settlements</h2><p className="text-slate-500">Track payouts and settlement status.</p></div>
                     <Card className="p-6 space-y-4">
                        <div className="grid md:grid-cols-3 gap-4">
                           <select className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-medium outline-nature-500" id="pay-order">
                              {orders.filter((o: any) => o.farmerName === user.profile.fullName).map((o: any) => (<option key={o.id} value={o.id}>Order {o.id} • ₹{o.totalAmount}</option>))}
                           </select>
                           <Input id="pay-amt" type="number" placeholder="Amount" />
                           <select className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-medium outline-nature-500" id="pay-status">
                              <option value="pending">Pending</option><option value="processing">Processing</option><option value="paid">Paid</option><option value="failed">Failed</option>
                           </select>
                        </div>
                        <Button className="w-full md:w-auto" onClick={() => {
                           const orderId = (document.getElementById('pay-order') as HTMLSelectElement)?.value;
                           const amt = Number((document.getElementById('pay-amt') as HTMLInputElement)?.value || 0);
                           const status = (document.getElementById('pay-status') as HTMLSelectElement)?.value as any;
                           if (!orderId || amt <= 0) return;
                           onAddPayout?.({ userId: user.id, orderId, amount: amt, status });
                        }}>Add Payout</Button>
                     </Card>
                     <Card className="p-6">
                        <div className="grid md:grid-cols-2 gap-4">
                           {(payouts || []).filter(p => p.userId === user.id).map(p => (
                              <div key={p.id} className="p-4 bg-slate-50 rounded-xl">
                                 <div className="text-xs text-slate-400 uppercase font-bold">Payout</div>
                                 <div className="font-bold text-slate-900">Order {p.orderId || '-'} • ₹{p.amount}</div>
                                 <div className="text-sm text-slate-600">{p.status}</div>
                              </div>
                           ))}
                           {(payouts || []).filter(p => p.userId === user.id).length === 0 && <div className="text-sm text-slate-400">No payouts yet.</div>}
                        </div>
                     </Card>
                  </div>
               )}
               {/* ===== NOTIFICATIONS VIEW ===== */}
               {view === 'notifications' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                     <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div><h2 className="text-2xl font-black text-slate-900">Notifications</h2><p className="text-slate-500">Stay updated on offers, orders, and market alerts.</p></div>
                        <div className="flex gap-2 flex-wrap">
                           {(['all', 'unread', 'offer', 'order'] as const).map(filter => (<button key={filter} onClick={() => setNotificationFilter(filter)} className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${notificationFilter === filter ? 'bg-nature-600 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}>{filter === 'all' ? 'All' : filter === 'unread' ? 'Unread' : filter === 'offer' ? 'Offers' : 'Orders'}</button>))}
                        </div>
                     </div>
                     {notifications.filter(n => notificationFilter === 'all' || (notificationFilter === 'unread' && !n.isRead) || n.type === notificationFilter).length > 0 ? (
                        <Card className="overflow-hidden">
                           <div className="divide-y divide-slate-100">
                              {notifications.filter(n => notificationFilter === 'all' || (notificationFilter === 'unread' && !n.isRead) || n.type === notificationFilter).map(n => (
                                 <div key={n.id} className={`p-4 flex items-start gap-4 hover:bg-slate-50 transition-colors cursor-pointer ${!n.isRead ? 'bg-nature-50/50' : ''}`} onClick={() => setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, isRead: true } : x))}>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${n.type === 'offer' ? 'bg-blue-100 text-blue-600' : n.type === 'order' ? 'bg-green-100 text-green-600' : n.type === 'price' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600'}`}>
                                       {n.type === 'offer' ? <ShoppingBag className="w-5 h-5" /> : n.type === 'order' ? <Truck className="w-5 h-5" /> : n.type === 'price' ? <TrendingUp className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                       <div className="flex items-center gap-2"><h4 className="font-bold text-slate-900 truncate">{n.title}</h4>{!n.isRead && <span className="w-2 h-2 bg-nature-500 rounded-full flex-shrink-0"></span>}</div>
                                       <p className="text-sm text-slate-600 line-clamp-2">{n.message}</p><span className="text-xs text-slate-400 mt-1 block">{n.timestamp}</span>
                                    </div>
                                    <button className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600" onClick={e => { e.stopPropagation(); setNotifications(prev => prev.filter(x => x.id !== n.id)); }}><X className="w-4 h-4" /></button>
                                 </div>
                              ))}
                           </div>
                           {notifications.some(n => !n.isRead) && (<div className="p-4 border-t border-slate-100 bg-slate-50"><button onClick={() => setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))} className="text-sm font-bold text-nature-600 hover:text-nature-700">Mark all as read</button></div>)}
                        </Card>
                     ) : (<Card className="p-12 text-center"><div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4"><Bell className="w-8 h-8 text-slate-400" /></div><h3 className="text-lg font-bold text-slate-700 mb-2">No notifications</h3><p className="text-slate-500 text-sm">You're all caught up!</p></Card>)}
                  </div>
               )}
               {/* ===== HELP & SUPPORT VIEW ===== */}
               {view === 'help' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                     <div><h2 className="text-2xl font-black text-slate-900">Help & Support</h2><p className="text-slate-500">Find answers or reach out to our team.</p></div>
                     <div className="grid md:grid-cols-3 gap-4">
                        <Card className="p-5 hover:shadow-lg transition-shadow cursor-pointer group"><div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"><Phone className="w-6 h-6 text-green-600" /></div><h4 className="font-bold text-slate-900">Helpline</h4><p className="text-sm text-slate-500 mb-2">24/7 Support</p><span className="text-nature-600 font-bold">1800-KISAN-01</span></Card>
                        <Card className="p-5 hover:shadow-lg transition-shadow cursor-pointer group"><div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"><MessageCircle className="w-6 h-6 text-green-600" /></div><h4 className="font-bold text-slate-900">WhatsApp</h4><p className="text-sm text-slate-500 mb-2">Quick responses</p><span className="text-nature-600 font-bold">+91 98765 43210</span></Card>
                        <Card className="p-5 hover:shadow-lg transition-shadow cursor-pointer group"><div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"><Mail className="w-6 h-6 text-blue-600" /></div><h4 className="font-bold text-slate-900">Email</h4><p className="text-sm text-slate-500 mb-2">Detailed queries</p><span className="text-nature-600 font-bold">support@kisansetu.in</span></Card>
                     </div>
                     <Card className="overflow-hidden"><div className="p-4 border-b border-slate-100 bg-slate-50"><h3 className="font-bold text-slate-800">Frequently Asked Questions</h3></div><div className="divide-y divide-slate-100">{FAQ_DATA.map((faq, i) => (<div key={i} className="cursor-pointer" onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}><div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"><span className="font-medium text-slate-800">{faq.q}</span><ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${expandedFaq === i ? 'rotate-180' : ''}`} /></div>{expandedFaq === i && <div className="px-4 pb-4 text-sm text-slate-600 bg-slate-50">{faq.a}</div>}</div>))}</div></Card>
                     <Card className="p-6"><h3 className="font-bold text-slate-800 mb-4">Submit a Support Request</h3><div className="space-y-4"><div className="grid md:grid-cols-2 gap-4"><Input label="Your Name" value={supportForm.name} onChange={e => setSupportForm({ ...supportForm, name: e.target.value })} /><Input label="Email" type="email" value={supportForm.email} onChange={e => setSupportForm({ ...supportForm, email: e.target.value })} placeholder="your@email.com" /></div><div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">Describe Your Issue</label><textarea className="w-full h-32 bg-white border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-nature-500 resize-none" placeholder="Tell us how we can help..." value={supportForm.issue} onChange={e => setSupportForm({ ...supportForm, issue: e.target.value })}></textarea></div><Button className="w-full md:w-auto" disabled={!supportForm.email || !supportForm.issue}><Send className="w-4 h-4 mr-2" /> Submit Request</Button></div></Card>
                  </div>
               )}
               {/* ===== PRO FEATURES HUB ===== */}
               {view === 'more' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                     <div><h2 className="text-2xl font-black text-slate-900">Pro Features</h2><p className="text-slate-500">Explore upcoming advanced tools for farmers.</p></div>
                     <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                           { title: 'Inventory Management', desc: 'Batch lots, grading, storage tracking' },
                           { title: 'Dynamic Pricing', desc: 'Auto-adjust price by age/demand' },
                           { title: 'Order Fulfillment', desc: 'Pick-pack-ship, POD, labels' },
                           { title: 'Payments & Settlements', desc: 'Payout ledger and statuses' },
                           { title: 'Contracts & Compliance', desc: 'Digital MoUs, renewals' },
                           { title: 'Seasonal Planning', desc: 'Crop calendar and yield estimates' },
                           { title: 'Bulk Updates', desc: 'Multi-listing edits and scheduling' },
                           { title: 'Marketing Boosts', desc: 'Featured credits and sharing' },
                           { title: 'Logistics Coordination', desc: 'Preferred transporters and slots' }
                        ].map((f, i) => (
                           <Card key={i} className="p-5">
                              <h4 className="font-bold text-slate-900">{f.title}</h4>
                              <p className="text-sm text-slate-600">{f.desc}</p>
                              <div className="mt-3"><Button variant="outline" className="text-xs">Coming Soon</Button></div>
                           </Card>
                        ))}
                     </div>
                  </div>
               )}
               {/* ===== SETTINGS VIEW ===== */}
               {view === 'settings' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                     <div><h2 className="text-2xl font-black text-slate-900">Settings</h2><p className="text-slate-500">Manage your preferences and account settings.</p></div>
                     <Card className="overflow-hidden"><div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-3"><Bell className="w-5 h-5 text-slate-600" /><h3 className="font-bold text-slate-800">Notification Preferences</h3></div><div className="p-4 space-y-4">{[{ key: 'notifyOffers', label: 'Offers', desc: 'Get notified on new offers' }, { key: 'notifyOrders', label: 'Orders', desc: 'Order status updates' }, { key: 'notifyPrices', label: 'Prices', desc: 'Market price changes' }, { key: 'notifySystem', label: 'System', desc: 'Tips and announcements' }].map(item => (<div key={item.key} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50"><div><span className="font-medium text-slate-800">{item.label}</span><p className="text-sm text-slate-500">{item.desc}</p></div><button onClick={() => setSettingsData(prev => ({ ...prev, [item.key]: !(prev as any)[item.key] }))} className={`w-12 h-7 rounded-full transition-colors relative ${(settingsData as any)[item.key] ? 'bg-nature-500' : 'bg-slate-300'}`}><span className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${(settingsData as any)[item.key] ? 'translate-x-6' : 'translate-x-1'}`}></span></button></div>))}</div></Card>
                     <Card className="overflow-hidden"><div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-3"><Globe className="w-5 h-5 text-slate-600" /><h3 className="font-bold text-slate-800">Language</h3></div><div className="p-4"><div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50"><div><span className="font-medium text-slate-800">App Language</span><p className="text-sm text-slate-500">Choose your preferred language</p></div><select className="bg-white border border-slate-300 rounded-xl px-4 py-2 font-medium" value={settingsData.language} onChange={e => setSettingsData({ ...settingsData, language: e.target.value })}><option>English</option><option>Hindi</option><option>Marathi</option><option>Gujarati</option><option>Tamil</option></select></div></div></Card>
                     <Card className="overflow-hidden"><div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-3"><Shield className="w-5 h-5 text-slate-600" /><h3 className="font-bold text-slate-800">Privacy & Security</h3></div><div className="p-4 space-y-4"><div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50"><div><span className="font-medium text-slate-800">Profile Visibility</span><p className="text-sm text-slate-500">Allow buyers to see your details</p></div><button onClick={() => setSettingsData(prev => ({ ...prev, profileVisible: !prev.profileVisible }))} className={`w-12 h-7 rounded-full transition-colors relative ${settingsData.profileVisible ? 'bg-nature-500' : 'bg-slate-300'}`}><span className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${settingsData.profileVisible ? 'translate-x-6' : 'translate-x-1'}`}></span></button></div><div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 cursor-pointer"><div><span className="font-medium text-slate-800">Change Password</span><p className="text-sm text-slate-500">Update your password</p></div><ChevronRight className="w-5 h-5 text-slate-400" /></div><div className="pt-4 border-t border-slate-100"><button className="text-sm font-medium text-red-600 hover:text-red-700">Delete My Account</button></div></div></Card>
                  </div>
               )}

               {/* Reusing existing Farmer Dashboard components */}
               {/* DASHBOARD HOME */}
               {view === 'home' && (
                  <div className="space-y-8 animate-in fade-in">
                     {/* 2. Welcome & Context */}
                     <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                           <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Namaste, {user.profile.fullName.split(' ')[0]} 👋</h2>
                           <p className="text-slate-500 mt-1 flex items-center gap-2">
                              <Calendar className="w-4 h-4" /> {currentDate} • <MapPin className="w-4 h-4" /> {user.profile.district}
                           </p>
                        </div>
                     </div>

                     {/* 3. Market Snapshot */}
                     <div className="grid md:grid-cols-2 gap-6">
                        <Card className="p-6 overflow-hidden relative border-nature-200">
                           <div className="absolute top-0 right-0 p-4 opacity-10"><TrendingUp className="w-24 h-24 text-nature-600" /></div>
                           <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 font-display">
                              <TrendingUp className="w-5 h-5 text-nature-600" /> Market Price Snapshot
                           </h3>
                           <div className="space-y-4">
                              {[
                                 { crop: 'Wheat (Sharbati)', msp: 2275, mandi: 2850, trend: 'up' },
                                 { crop: 'Soybean (Yellow)', msp: 4600, mandi: 4900, trend: 'stable' },
                                 { crop: 'Tomato (Hybrid)', msp: 0, mandi: 1200, trend: 'down' }
                              ].map((m, i) => (
                                 <div key={i} className="flex justify-between items-center p-3 bg-white border border-slate-100 rounded-xl">
                                    <div className="font-bold text-slate-700">{m.crop}</div>
                                    <div className="text-right">
                                       <div className="text-sm font-bold text-nature-700">₹{m.mandi}/q</div>
                                       {m.msp > 0 && <div className="text-[10px] text-slate-400">MSP: ₹{m.msp}</div>}
                                    </div>
                                 </div>
                              ))}
                           </div>
                           <div className="mt-4 text-[10px] text-slate-400">Last updated: 10 mins ago • Sources: Mandi Board, NAFED</div>
                        </Card>

                        {/* 4. Action Required */}
                        <Card className="p-6 border-red-100 bg-red-50/10">
                           <h3 className="text-lg font-bold text-red-800 mb-4 flex items-center gap-2">
                              <AlertCircle className="w-5 h-5 text-red-600" /> Action Required
                           </h3>
                           <div className="space-y-3">
                              {myOffers.filter((o: any) => o.status === 'pending').length > 0 ? (
                                 myOffers.filter((o: any) => o.status === 'pending').map((o: any, i: number) => (
                                    <div key={i} className="flex justify-between items-center p-3 bg-white border border-red-100 rounded-xl shadow-sm">
                                       <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center"><ShoppingBag className="w-4 h-4 text-red-600" /></div>
                                          <div className="text-sm"><span className="font-bold">New Offer</span> for {listings.find((l: any) => l.id === o.listingId)?.cropName}</div>
                                       </div>
                                       <Button size="sm" variant="outline" className="h-8 text-xs border-red-200 text-red-600 hover:bg-red-50" onClick={() => setView('offers')}>Review</Button>
                                    </div>
                                 ))
                              ) : (
                                 <div className="py-8 text-center text-slate-400">
                                    <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500 opacity-30" />
                                    <p className="text-sm font-medium">No urgent actions pending!</p>
                                 </div>
                              )}
                           </div>
                        </Card>
                     </div>
                     {/* 5. Quick Stats */}
                     <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-3">Quick Stats</h3>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                           <Card className="p-4 flex flex-col gap-1 hover:border-nature-300 cursor-pointer" onClick={() => setView('my-crops')}>
                              <Package className="w-6 h-6 text-nature-600 mb-2" />
                              <div className="text-2xl font-bold">{myListings.length}</div>
                              <div className="text-xs text-slate-500">Active Crops</div>
                           </Card>
                           <Card className="p-4 flex flex-col gap-1 hover:border-blue-300 cursor-pointer" onClick={() => setView('offers')}>
                              <ShoppingBag className="w-6 h-6 text-blue-600 mb-2" />
                              <div className="text-2xl font-bold">{myOffers.length}</div>
                              <div className="text-xs text-slate-500">Active Offers</div>
                           </Card>
                           <Card className="p-4 flex flex-col gap-1 hover:border-purple-300 cursor-pointer" onClick={() => setView('orders')}>
                              <Truck className="w-6 h-6 text-purple-600 mb-2" />
                              <div className="text-2xl font-bold">{myOrders.length}</div>
                              <div className="text-xs text-slate-500">In Transit</div>
                           </Card>
                           <Card className="p-4 flex flex-col gap-1 border-emerald-100 bg-emerald-50/50">
                              <DollarSign className="w-6 h-6 text-emerald-600 mb-2" />
                              <div className="text-2xl font-bold">₹{(myOrders.reduce((acc: number, o: any) => acc + o.totalAmount, 0) / 1000).toFixed(1)}k</div>
                              <div className="text-xs text-slate-500">Earnings</div>
                           </Card>
                        </div>
                     </div>
                  </div>
               )}

               {/* 6. MY CROPS */}
               {view === 'my-crops' && (
                  <div className="space-y-6 animate-in slide-in-from-right-4">
                     <div className="flex justify-between items-center mb-2">
                        <div>
                           <h2 className="text-2xl font-bold text-slate-900">My Crop Supply</h2>
                           <p className="text-slate-500 text-sm">Manage your active listings and stock</p>
                        </div>
                        <div className="flex gap-3">
                           <Button variant="outline" className="hidden md:flex items-center gap-2" onClick={() => setView('home')}>
                              <TrendingUp className="w-4 h-4" /> Market Prices
                           </Button>
                           <Button id="add-crop-btn" className="shadow-lg shadow-nature-600/20" onClick={() => (document.getElementById('file-upload') as any)?.click()}>
                              <Plus className="w-5 h-5 mr-2" /> Add New Crop
                           </Button>
                        </div>
                        <input type="file" id="file-upload" className="hidden" accept="image/*" multiple onChange={handleImageUpload} />
                     </div>

                     <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myListings.length > 0 ? myListings.map((l: any) => (
                           <Card key={l.id} className="overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300 border-slate-200 hover:border-nature-300">
                              <div className="relative h-44">
                                 <AssetCarousel
                                    assets={[
                                       ...(l.videoUrl ? [{ type: 'video' as const, src: l.videoUrl, poster: l.videoThumbnail || l.imageUrls?.[0] || l.imageUrl }] : []),
                                       ...(l.imageUrls || []).map((u: string) => ({ type: 'image' as const, src: u }))
                                    ]}
                                    onOpen={(idx) => {
                                       setViewerAssets([
                                          ...(l.videoUrl ? [{ type: 'video' as const, src: l.videoUrl, poster: l.videoThumbnail || l.imageUrls?.[0] || l.imageUrl }] : []),
                                          ...(l.imageUrls || []).map((u: string) => ({ type: 'image' as const, src: u }))
                                       ]);
                                       setViewerIndex(idx);
                                       setViewerOpen(true);
                                    }}
                                 />
                                 <div className="absolute top-3 right-3 flex gap-2">
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase shadow-lg ${l.status === 'active' ? 'bg-green-500 text-white' : 'bg-slate-500 text-white'}`}>
                                       {l.status}
                                    </span>
                                 </div>
                              </div>
                              <div className="p-5 flex-1 flex flex-col">
                                 <div className="flex justify-between items-start mb-3">
                                    <div>
                                       <h4 className="font-bold text-lg text-slate-900 leading-tight">{l.cropName}</h4>
                                       <p className="text-xs text-slate-400 font-medium">Listed {new Date(l.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-right">
                                       <div className="text-xl font-bold text-nature-700 font-display">₹{l.pricePerKg}/kg</div>
                                       <div className="text-[10px] text-slate-400 font-bold">vs ₹{l.pricePerKg - 2} Market</div>
                                    </div>
                                 </div>
                                 <div className="grid grid-cols-2 gap-4 my-4 py-4 border-y border-slate-100 bg-slate-50/50 -mx-5 px-5">
                                    <div>
                                       <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Available</div>
                                       <div className="font-bold text-sm text-slate-700">
                                          {fromKg(l.availableQuantity || l.quantity, l.quantityUnit || 'kg').toLocaleString()} {l.quantityUnit || 'kg'}
                                       </div>
                                    </div>
                                    <div>
                                       <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Grade</div>
                                       <div className="font-bold text-sm text-nature-600 flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> {l.grade}</div>
                                    </div>
                                 </div>
                                 <div className="mt-auto flex gap-2">
                                    <Button
                                       variant="outline"
                                       size="sm"
                                       className="flex-1 h-10 text-xs font-bold border-slate-200"
                                       onClick={() => handleEditDetail(l)}
                                    >
                                       Edit Details
                                    </Button>
                                    <button
                                       onClick={() => onUpdateListingStatus(l.id, l.status === 'active' ? 'paused' : 'active')}
                                       className={`h-10 w-10 flex items-center justify-center rounded-xl transition-colors ${l.status === 'active' ? 'bg-slate-100 hover:bg-slate-200 text-slate-600' : 'bg-green-100 hover:bg-green-200 text-green-600'}`}
                                       title={l.status === 'active' ? 'Pause Listing' : 'Resume Listing'}
                                    >
                                       {l.status === 'active' ? <Pause className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                                    </button>
                                    <button
                                       onClick={() => {
                                          if (confirm('Are you sure you want to delete this listing?')) {
                                             onDeleteListing(l.id);
                                          }
                                       }}
                                       className="h-10 w-10 flex items-center justify-center rounded-xl bg-red-50 hover:bg-red-100 text-red-500 transition-colors"
                                       title="Delete Listing"
                                    >
                                       <Trash2 className="w-4 h-4" />
                                    </button>
                                 </div>
                              </div>
                           </Card>
                        )) : (
                           <div className="col-span-full py-24 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-white/50 backdrop-blur-sm">
                              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                                 <Package className="w-10 h-10" />
                              </div>
                              <h3 className="text-xl font-bold text-slate-700 mb-2">No crops listed yet</h3>
                              <p className="text-slate-400 text-sm max-w-sm mx-auto">Start by adding your harvest details and photos. We'll help you find the best buyers.</p>
                           </div>
                        )}
                     </div>
                  </div>
               )}

               {/* 7. OFFERS (Negotiation Center) */}
               {view === 'offers' && (
                  <div className="space-y-6 animate-in slide-in-from-right-4">
                     <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                           <h2 className="text-2xl font-bold text-slate-900">Negotiation Center</h2>
                           <p className="text-sm text-slate-500 font-medium">Review and compare buyer offers for your stock</p>
                        </div>
                        <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                           <button className="px-4 py-2 bg-white text-slate-900 font-bold text-xs rounded-lg shadow-sm">All Offers</button>
                           <button className="px-4 py-2 text-slate-500 font-bold text-xs rounded-lg hover:bg-slate-200">Pending</button>
                        </div>
                     </div>

                     <div className="space-y-4">
                        {myOffers.length > 0 ? myOffers.map((o: any) => {
                           const listing = listings.find((l: any) => l.id === o.listingId);
                           const isHigher = o.pricePerKg > (listing?.pricePerKg || 0);
                           
                           // Negotiation State
                           const isCounterByFarmer = o.lastActionBy === 'farmer';
                           const currentPrice = isCounterByFarmer ? o.counterPrice : (o.offeredPrice || o.pricePerKg);
                           const currentQty = isCounterByFarmer ? o.counterQuantity : (o.quantityRequested || o.quantity);
                           const buyer = allUsers.find((u: any) => u.profile?.fullName === o.buyerName);

                           return (
                              <Card key={o.id} className="p-0 overflow-hidden border-blue-100 hover:border-blue-400 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 group">
                                 <div className="flex flex-col md:flex-row">
                                    <div className="w-full md:w-40 bg-blue-50/50 flex flex-col items-center justify-center p-6 border-r border-blue-100 group-hover:bg-blue-50 transition-colors">
                                       <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-3 border border-blue-100 relative overflow-hidden group-hover:scale-110 transition-transform">
                                          <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-5 transition-opacity" />
                                          <span className="text-2xl font-black text-blue-600 leading-none">{o.buyerName[0]}</span>
                                       </div>
                                       <div className="text-[10px] font-black text-blue-800 uppercase tracking-widest text-center">{o.buyerName}</div>
                                       <div className="flex items-center gap-1 mt-2">
                                          {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-2 h-2 text-yellow-500 fill-yellow-500" />)}
                                       </div>
                                       <button 
                                          onClick={() => onOpenChat(buyer?.id || '', o.buyerName, o.listingId, undefined, o.id)}
                                          className="mt-3 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-[10px] font-bold flex items-center gap-1 transition-colors"
                                       >
                                          <MessageCircle className="w-3 h-3" /> Chat
                                       </button>
                                    </div>
                                    <div className="flex-1 p-6 md:p-8">
                                       <div className="flex flex-wrap justify-between items-start gap-6 mb-6">
                                          <div>
                                             <div className="flex items-center gap-3 mb-2">
                                                <h4 className="font-bold text-xl text-slate-900 leading-tight">{listing?.cropName}</h4>
                                                <div className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-wider">
                                                   QTY: {currentQty}kg
                                                </div>
                                             </div>
                                             <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
                                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Bhopal, MP</span>
                                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Received {new Date(o.createdAt).toLocaleDateString()}</span>
                                             </div>
                                          </div>
                                          <div className="text-right">
                                             <div className="flex items-center gap-2 justify-end mb-1">
                                                <div className={`text-3xl font-black tracking-tighter ${isHigher ? 'text-green-600' : 'text-blue-600'} font-display`}>₹{currentPrice}/kg</div>
                                                {isHigher && !isCounterByFarmer && <div className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded uppercase">+₹{currentPrice - (listing?.pricePerKg || 0)}</div>}
                                             </div>
                                             <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total: ₹{(currentPrice * currentQty).toLocaleString()}</div>
                                             {isCounterByFarmer && <div className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded mt-1">Your Counter Offer</div>}
                                          </div>
                                       </div>

                                       <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                                          <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                                             <div className="flex -space-x-2">
                                                <div className="w-6 h-6 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-[8px] text-blue-600">🚛</div>
                                                <div className="w-6 h-6 rounded-full bg-green-100 border-2 border-white flex items-center justify-center text-[8px] text-green-600">✅</div>
                                             </div>
                                             Doorstep Pickup Included
                                          </div>
                                          <div className="flex items-center gap-2 text-xs font-black px-4 py-2 bg-red-50 text-red-600 rounded-xl animate-pulse">
                                             <Clock className="w-3 h-3" /> NEGOTIATION OPEN
                                          </div>
                                       </div>

                                    <div className="flex gap-4">
                                       {o.status === 'pending' ? (
                                          isCounterByFarmer ? (
                                              <div className="w-full py-3 bg-amber-50 border border-amber-100 text-amber-700 text-center font-bold rounded-2xl text-sm">
                                                  Waiting for buyer response...
                                              </div>
                                          ) : (
                                              <>
                                                 <button className="flex-1 h-12 text-sm font-black text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all" onClick={() => onRejectOffer(o.id)}>
                                                    Reject
                                                 </button>
                                                 <Button variant="outline" className="flex-1 h-12 border-slate-200 text-slate-600 font-black rounded-2xl hover:bg-slate-50" onClick={() => {
                                                     setCounterModal({ open: true, offer: o });
                                                     setCounterPrice(o.offeredPrice?.toString() || o.pricePerKg.toString());
                                                 }}>
                                                    Counter Offer
                                                 </Button>
                                                 <Button className="flex-[2] h-12 bg-blue-600 hover:bg-blue-700 font-black rounded-2xl shadow-xl shadow-blue-600/20 text-sm tracking-wide" onClick={() => onAcceptOffer(o.id)}>
                                                    Accept & Start Deal
                                                 </Button>
                                              </>
                                          )
                                       ) : (
                                          <div className={`w-full py-3 rounded-2xl text-center font-bold text-sm ${o.status === 'accepted' ? 'bg-green-100 text-green-700' : o.status === 'cancelled' ? 'bg-slate-100 text-slate-500' : 'bg-red-100 text-red-700'}`}>
                                             {o.status === 'accepted' ? 'Offer Accepted' : o.status === 'cancelled' ? 'Negotiation Cancelled' : 'Offer Rejected'}
                                          </div>
                                       )}
                                    </div>
                                    </div>
                                 </div>
                              </Card>
                           );
                        }) : (
                           <div className="py-24 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-white/50 backdrop-blur-sm">
                              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-300">
                                 <ShoppingBag className="w-10 h-10" />
                              </div>
                              <h3 className="text-xl font-bold text-slate-700 mb-2">No offers received yet</h3>
                              <p className="text-slate-400 text-sm max-w-sm mx-auto">Listing your crops at competitive prices helps you get faster offers from verified buyers.</p>
                           </div>
                        )}
                     </div>
                  </div>
               )}

               {/* 8. ORDERS (Deal Fulfillment) */}
               {view === 'orders' && (
                  <div className="space-y-6 animate-in slide-in-from-right-4">
                     <div>
                        <h2 className="text-2xl font-bold text-slate-900">Active Orders</h2>
                        <p className="text-sm text-slate-500 font-medium">Track your deals from pickup to payment</p>
                     </div>

                     <div className="space-y-6">
                        {myOrders.length > 0 ? myOrders.map((o: any) => {
                           const req = (transportRequests || []).find((r: any) => r.orderId === o.id);
                           const transporter = req?.transporterId ? (allUsers || []).find((u: any) => u.id === req.transporterId) : null;
                           return (
                           <Card key={o.id} className="p-6 border-purple-100 bg-white">
                              <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                                 <div>
                                    <div className="flex items-center gap-3 mb-1">
                                       <h3 className="text-lg font-bold text-slate-900">#{o.id} • {o.cropName}</h3>
                                       <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${o.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                          o.status === 'in_transit' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                          }`}>
                                          {o.status.replace('_', ' ')}
                                       </span>
                                    </div>
                                    <p className="text-sm text-slate-500 font-medium">Buyer: <span className="font-bold text-slate-700">{o.buyerName}</span> • Total Amount: <span className="font-bold text-nature-700">₹{o.totalAmount.toLocaleString()}</span></p>
                                 </div>
                                 <div className="flex gap-2">
                                    <Button variant="outline" size="sm" className="h-9 text-xs font-bold" onClick={() => onViewInvoice(o)}><FileText className="w-4 h-4 mr-2" /> Invoice</Button>
                                    <Button size="sm" className="h-9 text-xs font-bold bg-purple-600 hover:bg-purple-700"><MapPin className="w-4 h-4 mr-2" /> Track Pickup</Button>
                                    
                                    {/* Payment Verification for Farmer */}
                                    {o.paymentStatus === 'review' && (
                                       <Button 
                                          size="sm" 
                                          className="h-9 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white"
                                          onClick={async () => {
                                             if (confirm(`Buyer has submitted payment proof: ${o.paymentProof}. Confirm receipt?`)) {
                                                await onUpdateOrderPayment?.(o.id, 'paid');
                                             }
                                          }}
                                       >
                                          <CreditCard className="w-4 h-4 mr-2" /> Verify Payment
                                       </Button>
                                    )}
                                 </div>
                              </div>

                              {/* Fulfillment Timeline */}
                              <div className="relative pt-2 pb-8 px-2">
                                 <div className="absolute top-8 left-0 right-0 h-1 bg-slate-100 -z-10" />
                                 <div className={`absolute top-8 left-0 h-1 bg-nature-500 -z-10 transition-all duration-1000`} style={{ width: o.status === 'delivered' ? '100%' : o.status === 'in_transit' ? '66%' : '33%' }} />

                                 <div className="flex justify-between items-start">
                                    {[
                                       { label: 'Confirmed', desc: 'Order placed', status: 'confirmed' },
                                       { label: 'In Transit', desc: 'Heading to Mandi', status: 'in_transit' },
                                       { label: 'Delivered', desc: 'Delivered & Paid', status: 'delivered' }
                                    ].map((s, i) => {
                                       const isDone = o.status === s.status || (s.status === 'confirmed' && (o.status === 'in_transit' || o.status === 'delivered')) || (s.status === 'in_transit' && o.status === 'delivered');
                                       const isCurrent = o.status === s.status;
                                       return (
                                          <div key={i} className="flex flex-col items-center flex-1">
                                             <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 ${isDone ? 'bg-nature-500 border-nature-100 text-white' : 'bg-white border-slate-100 text-slate-300'} transition-colors shadow-sm`}>
                                                {isDone ? <Check className="w-6 h-6" /> : <div className="w-3 h-3 bg-slate-100 rounded-full" />}
                                             </div>
                                             <div className="mt-3 text-center">
                                                <div className={`text-xs font-black uppercase tracking-wider ${isDone ? 'text-nature-700' : 'text-slate-400'}`}>{s.label}</div>
                                                <div className="text-[10px] text-slate-400 font-medium">{s.desc}</div>
                                             </div>
                                          </div>
                                       );
                                    })}
                                 </div>
                              </div>

                              {/* Logistics Helper */}
                              <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                 <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm"><Truck className="w-5 h-5 text-slate-400" /></div>
                                    <div>
                                       <div className="text-[10px] text-slate-400 font-black uppercase">Transport</div>
                                       {!req && <div className="text-sm font-bold text-slate-700">Not requested yet</div>}
                                       {req && (
                                          <div className="text-sm font-bold text-slate-700">
                                             {String(req.mode).replace('_', ' ')} • {String(req.status).replace('_', ' ')} • ₹{req.finalFare ?? req.estimatedFare}
                                          </div>
                                       )}
                                       {req?.pickupOtp && req.status !== 'picked_up' && req.status !== 'delivered' && req.status !== 'open' && (
                                          <div className="text-xs text-slate-500 mt-1">Pickup OTP: <span className="font-black text-slate-800">{req.pickupOtp}</span></div>
                                       )}
                                       {transporter && <div className="text-xs text-slate-500 mt-1">Assigned: <span className="font-bold text-slate-700">{transporter.profile?.fullName || transporter.phone}</span></div>}
                                    </div>
                                 </div>
                                 {req?.status === 'awaiting_farmer' && (
                                    <div className="flex gap-2">
                                       <Button className="h-10 bg-nature-600 hover:bg-nature-700 text-xs font-black flex-1" onClick={() => {
                                          // Broadcast Logic: Set status to 'open' so it appears on Transporter Load Board
                                          onAcceptTransportRequest?.(req.id, ''); // Empty string = broadcast
                                          alert("Broadcasted to all transporters! Waiting for bids...");
                                       }}>Broadcast Request</Button>
                                    </div>
                                 )}
                              </div>
                           </Card>
                        )}) : (
                           <div className="py-24 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-white/50 backdrop-blur-sm">
                              <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6 text-purple-300">
                                 <Truck className="w-10 h-10" />
                              </div>
                              <h3 className="text-xl font-bold text-slate-700 mb-2">No active orders</h3>
                              <p className="text-slate-400 text-sm max-w-sm mx-auto">Once an offer is accepted, it will appear here for logistics tracking.</p>
                           </div>
                        )}
                     </div>
                  </div>
               )}

               {/* 9. HISTORY & INSIGHTS */}
               {view === 'history' && (
                  <div className="space-y-8 animate-in slide-in-from-right-4">
                     <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                           <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Sales History</h2>
                           <p className="text-sm text-slate-500 font-medium">Your seasonal performance summary and earnings</p>
                        </div>
                        <div className="flex gap-3">
                           <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"><Filter className="w-4 h-4" /> Filter Season</button>
                           <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-colors"><Download className="w-4 h-4" /> Export Ledger</button>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="p-6 border-nature-100 bg-nature-50/10 relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform"><DollarSign className="w-20 h-20 text-nature-600" /></div>
                           <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Seasonal Earnings</div>
                           <div className="text-3xl font-black text-slate-900 tracking-tighter">₹{myHistory.reduce((a, b) => a + b.amount, 0).toLocaleString()}</div>
                           <div className="text-[10px] text-green-600 font-black mt-2 flex items-center gap-1 uppercase tracking-tighter"><TrendingUp className="w-3 h-3" /> +12% Compared to 2023</div>
                        </Card>
                        <Card className="p-6 border-blue-100 bg-blue-50/10 relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform"><Package className="w-20 h-20 text-blue-600" /></div>
                           <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Stock Sold</div>
                           <div className="text-3xl font-black text-slate-900 tracking-tighter">{myHistory.reduce((a, b) => a + (b.quantity || 0), 0)} <span className="text-lg font-bold text-slate-400 uppercase">kg</span></div>
                           <div className="text-[10px] text-blue-600 font-black mt-2 flex items-center gap-1 uppercase tracking-tighter"><Package className="w-3 h-3" /> High Demand Season</div>
                        </Card>
                        <Card className="p-6 border-orange-100 bg-orange-50/10 relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform"><Briefcase className="w-20 h-20 text-orange-600" /></div>
                           <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg. Sale Price</div>
                           <div className="text-3xl font-black text-slate-900 tracking-tighter">₹32<span className="text-lg font-bold text-slate-400">/kg</span></div>
                           <div className="text-[10px] text-orange-600 font-black mt-2 flex items-center gap-1 uppercase tracking-tighter"><ShieldCheck className="w-3 h-3" /> 15% Above MSP</div>
                        </Card>
                        <Card className="p-6 border-purple-100 bg-purple-50/10 relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform"><UserIcon className="w-20 h-20 text-purple-600" /></div>
                           <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Buyer Trust</div>
                           <div className="text-3xl font-black text-slate-900 tracking-tighter">4.9<span className="text-lg font-bold text-slate-400">/5</span></div>
                           <div className="text-[10px] text-purple-600 font-black mt-2 flex items-center gap-1 uppercase tracking-tighter"><Star className="w-3 h-3 fill-purple-600" /> Top Rated Farmer</div>
                        </Card>
                     </div>

                     <Card className="overflow-hidden border-slate-200">
                        <div className="p-6 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                           <h3 className="font-bold text-slate-800">Recent Transactions</h3>
                           <button className="text-xs font-black text-nature-600 hover:underline uppercase tracking-widest">View Full Statement</button>
                        </div>
                        <div className="overflow-x-auto">
                           <table className="w-full text-left">
                              <thead>
                                 <tr className="bg-white border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <th className="px-6 py-4">Transaction Details</th>
                                    <th className="px-6 py-4">Quantity</th>
                                    <th className="px-6 py-4">Price/kg</th>
                                    <th className="px-6 py-4">Total Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                 </tr>
                              </thead>
                              <tbody>
                                 {myHistory.map((h, i) => (
                                    <tr key={h.id} className="hover:bg-slate-50 transition-colors border-b border-slate-50">
                                       <td className="px-6 py-5">
                                          <div className="font-bold text-slate-800">{h.itemName}</div>
                                          <div className="text-[10px] text-slate-400 font-bold">{h.date} • {h.type}</div>
                                       </td>
                                       <td className="px-6 py-5 font-bold text-slate-700">{h.quantity} kg</td>
                                       <td className="px-6 py-5 font-bold text-slate-700">₹{h.quantity ? Math.round(h.amount / h.quantity) : '–'}/kg</td>
                                       <td className="px-6 py-5 font-black text-nature-700">₹{h.amount.toLocaleString()}</td>
                                       <td className="px-6 py-5">
                                          <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-[9px] font-black uppercase tracking-wider border border-green-100">Settled</span>
                                       </td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                        </div>
                     </Card>
                  </div>
               )}

               {/* 10. KISAN PROFILE */}
               {view === 'profile' && (
                  <div className="space-y-8 animate-in fade-in">
                     {/* Header */}
                     <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                           <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Kisan Profile</h2>
                           <p className="text-sm text-slate-500 font-medium">Your digital farm identity on KisanSetu</p>
                        </div>
                        <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                           <button
                              onClick={() => setProfileTab('overview')}
                              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${profileTab === 'overview' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:bg-slate-200'}`}
                           >
                              Overview
                           </button>
                           <button
                              onClick={() => { setProfileTab('edit'); setProfileData(user.profile); }}
                              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${profileTab === 'edit' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:bg-slate-200'}`}
                           >
                              Edit Profile
                           </button>
                        </div>
                     </div>

                     {/* OVERVIEW MODE */}
                     {profileTab === 'overview' && (
                        <div className="grid md:grid-cols-3 gap-6 animate-in slide-in-from-right-4">
                           {/* Profile Header Card */}
                           <Card className="md:col-span-3 p-0 overflow-hidden border-nature-100">
                              <div className="bg-gradient-to-r from-nature-600 to-nature-700 p-8 text-white relative overflow-hidden">
                                 <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                                 <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                                    <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center text-4xl font-black border-4 border-white/30 shadow-xl">
                                       {user.profile.fullName[0]}
                                    </div>
                                    <div className="text-center md:text-left flex-1">
                                       <h3 className="text-2xl font-bold">{user.profile.fullName}</h3>
                                       <p className="text-nature-100 flex items-center justify-center md:justify-start gap-2 mt-1">
                                          <MapPin className="w-4 h-4" /> {user.profile.village}, {user.profile.district}, {user.profile.state}
                                       </p>
                                       <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
                                          <div className="flex items-center gap-1 text-yellow-300">
                                             {[1, 2, 3, 4, 5].map(i => (
                                                <Star key={i} className={`w-4 h-4 ${i <= (user.profile.rating || 5) ? 'fill-yellow-300' : 'fill-white/20'}`} />
                                             ))}
                                             <span className="ml-1 text-white text-sm font-bold">{user.profile.rating || 5.0}</span>
                                          </div>
                                          <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-bold">
                                             Member since {new Date(user.profile.memberSince || user.createdAt).getFullYear()}
                                          </span>
                                       </div>
                                    </div>
                                    <Button variant="outline" className="border-white/30 text-white hover:bg-white/10" onClick={() => setProfileTab('edit')}>
                                       <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
                                    </Button>
                                 </div>
                              </div>
                           </Card>

                           {/* Farm Details Card */}
                           <Card className="border-slate-200 hover:shadow-lg transition-shadow">
                              <div className="flex items-center gap-3 mb-4">
                                 <div className="w-10 h-10 bg-nature-100 rounded-xl flex items-center justify-center text-nature-600">
                                    <Sprout className="w-5 h-5" />
                                 </div>
                                 <h4 className="font-bold text-slate-800">Farm Details</h4>
                              </div>
                              <div className="space-y-3 text-sm">
                                 <div className="flex justify-between py-2 border-b border-slate-100">
                                    <span className="text-slate-500">Total Land</span>
                                    <span className="font-bold text-slate-700">{user.profile.totalLandArea || '–'} {user.profile.landUnit || 'Acres'}</span>
                                 </div>
                                 <div className="flex justify-between py-2 border-b border-slate-100">
                                    <span className="text-slate-500">Land Type</span>
                                    <span className="font-bold text-slate-700">{user.profile.landType || 'Not specified'}</span>
                                 </div>
                                 <div className="flex justify-between py-2 border-b border-slate-100">
                                    <span className="text-slate-500">Irrigation</span>
                                    <span className="font-bold text-slate-700">{user.profile.irrigationSource || 'Not specified'}</span>
                                 </div>
                                 <div className="flex justify-between py-2">
                                    <span className="text-slate-500">Soil Type</span>
                                    <span className="font-bold text-slate-700">{user.profile.soilType || 'Not specified'}</span>
                                 </div>
                              </div>
                           </Card>

                           {/* Crops & Practices Card */}
                           <Card className="border-slate-200 hover:shadow-lg transition-shadow">
                              <div className="flex items-center gap-3 mb-4">
                                 <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                                    <Layers className="w-5 h-5" />
                                 </div>
                                 <h4 className="font-bold text-slate-800">Crops & Practices</h4>
                              </div>
                              <div className="space-y-4">
                                 <div>
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Current Crops</div>
                                    <div className="flex flex-wrap gap-2">
                                       {(user.profile.currentCrops && user.profile.currentCrops.length > 0) ? user.profile.currentCrops.map((c: string, i: number) => (
                                          <span key={i} className="px-3 py-1 bg-nature-50 text-nature-700 rounded-full text-xs font-bold border border-nature-100">{c}</span>
                                       )) : <span className="text-slate-400 text-xs">No crops added</span>}
                                    </div>
                                 </div>
                                 <div>
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Farming Practices</div>
                                    <div className="flex flex-wrap gap-2">
                                       {(user.profile.farmingPractices && user.profile.farmingPractices.length > 0) ? user.profile.farmingPractices.map((p: string, i: number) => (
                                          <span key={i} className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-100 flex items-center gap-1"><Award className="w-3 h-3" />{p}</span>
                                       )) : <span className="text-slate-400 text-xs">No practices specified</span>}
                                    </div>
                                 </div>
                              </div>
                           </Card>

                           {/* Trust & Stats Card */}
                           <Card className="border-slate-200 hover:shadow-lg transition-shadow">
                              <div className="flex items-center gap-3 mb-4">
                                 <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                                    <ShieldCheck className="w-5 h-5" />
                                 </div>
                                 <h4 className="font-bold text-slate-800">Trust & Stats</h4>
                              </div>
                              <div className="space-y-3 text-sm">
                                 <div className="flex justify-between py-2 border-b border-slate-100">
                                    <span className="text-slate-500">Total Sales</span>
                                    <span className="font-bold text-nature-700">₹{(user.profile.totalSales || 0).toLocaleString()}</span>
                                 </div>
                                 <div className="flex justify-between py-2 border-b border-slate-100">
                                    <span className="text-slate-500">Active Listings</span>
                                    <span className="font-bold text-slate-700">{myListings.filter((l: any) => l.status === 'active').length}</span>
                                 </div>
                                 <div className="flex justify-between py-2 border-b border-slate-100">
                                    <span className="text-slate-500">Completed Orders</span>
                                    <span className="font-bold text-slate-700">{myOrders.filter((o: any) => o.status === 'delivered').length}</span>
                                 </div>
                                 <div className="flex justify-between py-2">
                                    <span className="text-slate-500">Profile Completion</span>
                                    <span className="font-bold text-blue-600">{calculateCompleteness(user.profile)}%</span>
                                 </div>
                              </div>
                           </Card>
                        </div>
                     )}

                     {/* EDIT MODE */}
                     {profileTab === 'edit' && (
                        <div className="animate-in slide-in-from-right-4">
                           <Card className="border-slate-200 p-0 overflow-hidden">
                              <div className="p-6 border-b border-slate-100 bg-slate-50">
                                 <h3 className="font-bold text-slate-900">Edit Your Profile</h3>
                                 <p className="text-xs text-slate-500">Update your farm identity and details</p>
                              </div>
                              <div className="p-6 space-y-8">
                                 {/* Personal Info */}
                                 <div>
                                    <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                                       <UserIcon className="w-4 h-4 text-slate-400" /> Personal Information
                                    </h4>
                                    <div className="grid md:grid-cols-2 gap-4">
                                       <Input label="Full Name" value={profileData.fullName} onChange={e => setProfileData({ ...profileData, fullName: e.target.value })} />
                                       <div className="space-y-1">
                                          <label className="text-xs font-bold text-slate-500 uppercase">Language</label>
                                          <select className="w-full h-12 bg-white border border-slate-300 rounded-xl px-3 outline-none" value={profileData.language} onChange={e => setProfileData({ ...profileData, language: e.target.value })}>
                                             <option>English</option><option>Hindi</option><option>Marathi</option><option>Gujarati</option><option>Tamil</option>
                                          </select>
                                       </div>
                                    </div>
                                 </div>

                                 {/* Location */}
                                 <div>
                                    <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                                       <MapPin className="w-4 h-4 text-slate-400" /> Location
                                    </h4>
                                    <div className="grid md:grid-cols-4 gap-4">
                                       <Input label="Village" value={profileData.village} onChange={e => setProfileData({ ...profileData, village: e.target.value })} />
                                       <Input label="District" value={profileData.district} onChange={e => setProfileData({ ...profileData, district: e.target.value })} />
                                       <Input label="State" value={profileData.state} onChange={e => setProfileData({ ...profileData, state: e.target.value })} />
                                       <Input label="Pincode" value={profileData.pincode || ''} onChange={e => setProfileData({ ...profileData, pincode: e.target.value })} />
                                    </div>
                                 </div>

                                 {/* Farm Details */}
                                 <div>
                                    <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                                       <Sprout className="w-4 h-4 text-slate-400" /> Farm Details
                                    </h4>
                                    <div className="grid md:grid-cols-3 gap-4">
                                       <div className="flex gap-2">
                                          <div className="flex-1">
                                             <Input label="Total Land Area" value={profileData.totalLandArea || ''} onChange={e => setProfileData({ ...profileData, totalLandArea: e.target.value })} />
                                          </div>
                                          <div className="w-28 space-y-1">
                                             <label className="text-xs font-bold text-slate-500 uppercase">Unit</label>
                                             <select className="w-full h-12 bg-white border border-slate-300 rounded-xl px-3 outline-none" value={profileData.landUnit || 'Acres'} onChange={e => setProfileData({ ...profileData, landUnit: e.target.value as any })}>
                                                <option>Acres</option><option>Hectares</option>
                                             </select>
                                          </div>
                                       </div>
                                       <div className="space-y-1">
                                          <label className="text-xs font-bold text-slate-500 uppercase">Land Type</label>
                                          <select className="w-full h-12 bg-white border border-slate-300 rounded-xl px-3 outline-none" value={profileData.landType || ''} onChange={e => setProfileData({ ...profileData, landType: e.target.value as any })}>
                                             <option value="">Select</option><option>Owned</option><option>Leased</option><option>Mixed</option>
                                          </select>
                                       </div>
                                       <div className="space-y-1">
                                          <label className="text-xs font-bold text-slate-500 uppercase">Irrigation Source</label>
                                          <select className="w-full h-12 bg-white border border-slate-300 rounded-xl px-3 outline-none" value={profileData.irrigationSource || ''} onChange={e => setProfileData({ ...profileData, irrigationSource: e.target.value as any })}>
                                             <option value="">Select</option><option>Rain-fed</option><option>Borewell</option><option>Canal</option><option>Drip</option>
                                          </select>
                                       </div>
                                       <Input label="Soil Type" value={profileData.soilType || ''} onChange={e => setProfileData({ ...profileData, soilType: e.target.value })} />
                                    </div>
                                 </div>

                                 {/* Crops */}
                                 <div>
                                    <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                                       <Layers className="w-4 h-4 text-slate-400" /> Crops
                                    </h4>
                                    <div className="grid md:grid-cols-2 gap-4">
                                       <Input label="Current Crops (comma-separated)" placeholder="Wheat, Rice, Soybean" value={profileData.currentCrops?.join(', ') || ''} onChange={e => setProfileData({ ...profileData, currentCrops: e.target.value.split(',').map(s => s.trim()).filter(s => s) })} />
                                    </div>
                                 </div>

                                 {/* Farming Practices */}
                                 <div>
                                    <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                                       <Award className="w-4 h-4 text-slate-400" /> Farming Practices
                                    </h4>
                                    <div className="flex flex-wrap gap-4">
                                       {['Organic', 'Natural', 'Conventional', 'Zero Budget'].map(practice => (
                                          <label key={practice} className="flex items-center gap-2 cursor-pointer">
                                             <input
                                                type="checkbox"
                                                className="w-5 h-5 accent-nature-600 rounded"
                                                checked={profileData.farmingPractices?.includes(practice) || false}
                                                onChange={e => {
                                                   const current = profileData.farmingPractices || [];
                                                   setProfileData({
                                                      ...profileData,
                                                      farmingPractices: e.target.checked ? [...current, practice] : current.filter(p => p !== practice)
                                                   });
                                                }}
                                             />
                                             <span className="text-sm font-medium text-slate-700">{practice}</span>
                                          </label>
                                       ))}
                                    </div>
                                 </div>
                              </div>

                              {/* Actions */}
                              <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                                 <Button variant="ghost" onClick={() => setProfileTab('overview')}>Cancel</Button>
                                 <Button className="bg-nature-600 hover:bg-nature-700" onClick={() => { onUpdateProfile(user.id, profileData); setProfileTab('overview'); }}>
                                    <Save className="w-4 h-4 mr-2" /> Save Changes
                                 </Button>
                              </div>
                           </Card>
                        </div>
                     )}
                  </div>
               )}
               {/* ... existing views ... */}
            </main>
         {viewerOpen && (
            <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
               <Card className="w-full max-w-5xl overflow-hidden relative bg-white">
                  <button onClick={() => setViewerOpen(false)} className="absolute top-3 right-3 bg-white/80 rounded-full p-2 text-slate-700 border border-slate-200"><X className="w-5 h-5" /></button>
                  <div className="p-4">
                     <div className="relative h-[60vh] bg-black rounded-xl overflow-hidden">
                        <AssetCarousel
                           assets={viewerAssets}
                           heightClass="h-[60vh]"
                           onOpen={(i) => setViewerIndex(i)}
                        />
                        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                           {viewerAssets.map((_, i) => (
                              <span key={i} className={`w-2 h-2 rounded-full ${i === viewerIndex ? 'bg-white' : 'bg-white/50'}`} />
                           ))}
                        </div>
                     </div>
                     <div className="mt-4 flex gap-2 overflow-x-auto">
                        {viewerAssets.map((a, i) => (
                           <button key={i} onClick={() => setViewerIndex(i)} className={`w-20 h-14 rounded-lg overflow-hidden border ${i === viewerIndex ? 'border-nature-600' : 'border-slate-200'}`}>
                              {a.type === 'image' ? <img src={a.src} className="w-full h-full object-cover" /> : <video src={a.src} poster={a.poster} className="w-full h-full object-cover" />}
                           </button>
                        ))}
                     </div>
                  </div>
               </Card>
            </div>
         )}

            {isAddingCrop && (
               <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                  <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative border-nature-200 bg-white">
                     <div className="absolute top-0 left-0 w-full h-1.5 bg-nature-600" />

                     {/* Header */}
                     <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
                        <div>
                           <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-black uppercase tracking-widest text-nature-600 bg-nature-50 px-2 py-0.5 rounded">Crop Wizard</span>
                              <h3 className="text-xl font-bold text-slate-900">{cropStep === 1 ? 'Step 1: Visuals & Analysis' : 'Step 2: Logistics & Details'}</h3>
                           </div>
                           <div className="flex items-center gap-2">
                              <div className="h-1.5 w-32 bg-slate-100 rounded-full overflow-hidden">
                                 <div className={`h-full bg-nature-600 transition-all duration-500`} style={{ width: cropStep === 1 ? '50%' : '100%' }} />
                              </div>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Progress: {cropStep === 1 ? '50%' : '100%'}</span>
                           </div>
                        </div>
                        <button onClick={() => setIsAddingCrop(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-900 transition-colors"><X className="w-6 h-6" /></button>
                     </div>

                     {/* Body */}
                     <div className="flex-1 overflow-y-auto p-6 md:p-8">
                        {cropStep === 1 ? (
                           <div className="grid md:grid-cols-2 gap-12 animate-in slide-in-from-bottom-4">
                              {/* Left: Images */}
                              <div className="space-y-6">
                                 <div className="flex justify-between items-end">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Crop Gallery ({images.length}/5)</label>
                                    {images.length < 5 && (
                                       <button onClick={() => (document.getElementById('add-more-images') as any)?.click()} className="text-xs font-bold text-nature-600 flex items-center gap-1 hover:underline">
                                          <Plus className="w-3 h-3" /> Add More
                                       </button>
                                    )}
                                    <input type="file" id="add-more-images" className="hidden" accept="image/*" multiple onChange={handleImageUpload} />
                                 </div>
                                 <div className="flex justify-between items-end">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Crop Video {video ? `(≤ 60s)` : ''}</label>
                                    {!video && (
                                       <button onClick={() => (document.getElementById('add-video') as any)?.click()} className="text-xs font-bold text-nature-600 flex items-center gap-1 hover:underline">
                                          <Plus className="w-3 h-3" /> Add Video (≤ 60s)
                                       </button>
                                    )}
                                    <input type="file" id="add-video" className="hidden" accept="video/mp4,video/webm" onChange={handleVideoUpload} />
                                 </div>

                                 <div className="grid grid-cols-2 gap-4">
                                    {images.map((img, idx) => (
                                       <div key={idx} className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${idx === 0 ? 'col-span-2 aspect-[2/1] border-nature-500 shadow-lg' : 'border-slate-100'}`}>
                                          <img src={img} className="w-full h-full object-cover" />
                                          {idx === 0 && <span className="absolute top-2 left-2 px-2 py-0.5 bg-nature-600 text-white text-[8px] font-black uppercase rounded shadow-md">Main Photo</span>}
                                          <button
                                             onClick={() => setImages(prev => prev.filter((_, i) => i !== idx))}
                                             className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full text-slate-400 hover:text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                          >
                                             <X className="w-3 h-3" />
                                          </button>
                                       </div>
                                    ))}
                                    {/* Placeholder if empty */}
                                    {images.length === 0 && (
                                       <div className="col-span-2 aspect-[2/1] border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-300">
                                          <Camera className="w-10 h-10 mb-2" />
                                          <span className="text-sm font-bold">Upload visuals to begin</span>
                                       </div>
                                    )}
                                 </div>
                                 {video && (
                                    <div className="space-y-2">
                                       <div className="text-xs text-slate-500 font-bold uppercase">Video Preview</div>
                                       <video
                                          src={video.url}
                                          poster={video.thumbnail}
                                          controls
                                          playsInline
                                          preload="metadata"
                                          className="w-full h-40 bg-black rounded-xl"
                                       />
                                       <div className="text-[10px] text-slate-400 font-bold">Duration: {video.durationSec}s • Size: {(video.sizeBytes / (1024 * 1024)).toFixed(1)}MB • Type: {video.type}</div>
                                       <div className="flex gap-2">
                                          <Button variant="outline" onClick={() => { URL.revokeObjectURL(video.url); setVideo(null); }}>Remove Video</Button>
                                       </div>
                                    </div>
                                 )}
                              </div>

                              {/* Right: AI Review */}
                              <div className="space-y-8">
                                 <div className="p-6 bg-nature-50/50 rounded-3xl border border-nature-100 relative overflow-hidden">
                                    <div className="absolute top-2 right-2 opacity-5"><Zap className="w-16 h-16 text-nature-600 fill-nature-600" /></div>
                                    <h4 className="flex items-center gap-2 text-sm font-black text-nature-800 uppercase tracking-widest mb-6">
                                       <Activity className="w-4 h-4" /> AI Crop Verification
                                    </h4>

                                    {isAnalyzing ? (
                                       <div className="py-12 flex flex-col items-center justify-center">
                                          <div className="w-10 h-10 border-4 border-nature-600/20 border-t-nature-600 rounded-full animate-spin mb-4" />
                                          <span className="text-xs font-bold text-slate-500">Scanning visuals for quality markers...</span>
                                       </div>
                                    ) : aiData ? (
                                       <div className="space-y-6 animate-in fade-in duration-500">
                                          <div className="grid grid-cols-2 gap-4">
                                             <div className="space-y-1">
                                                <label className="text-[10px] uppercase font-black text-slate-400">Identified Crop</label>
                                                <input
                                                   className="w-full bg-white border-none rounded-xl px-3 py-2 text-sm font-bold shadow-sm outline-nature-500"
                                                   value={aiData.cropName}
                                                   onChange={e => setAiData({ ...aiData, cropName: e.target.value })}
                                                />
                                             </div>
                                             <div className="space-y-1">
                                                <label className="text-[10px] uppercase font-black text-slate-400">Detected Grade</label>
                                                <select
                                                   className="w-full bg-white border-none rounded-xl px-3 py-2 text-sm font-bold shadow-sm outline-nature-500 appearance-none"
                                                   value={aiData.grade}
                                                   onChange={e => setAiData({ ...aiData, grade: e.target.value as any })}
                                                >
                                                   <option value="A">Grade A (Premium)</option>
                                                   <option value="B">Grade B (Standard)</option>
                                                   <option value="C">Grade C (Processing)</option>
                                                </select>
                                             </div>
                                          </div>
                                          <div className="p-4 bg-white rounded-2xl border border-nature-100">
                                             <label className="text-[10px] uppercase font-black text-slate-400 block mb-2">Quality Summary</label>
                                             <p className="text-sm text-slate-600 italic leading-relaxed">"{aiData.qualityDescription}"</p>
                                          </div>
                                          <div className="flex items-center gap-2 text-[10px] font-bold text-green-600 bg-green-50 w-fit px-3 py-1 rounded-full border border-green-100">
                                             <ShieldCheck className="w-3 h-3" /> VERIFIED BY GEMINI PRO VISION
                                          </div>
                                       </div>
                                    ) : (
                                       <div className="py-12 text-center text-slate-400">
                                          <p className="text-xs font-medium">AI analysis will appear once images are loaded.</p>
                                       </div>
                                    )}
                                 </div>

                                 <div className="p-6 bg-slate-900 rounded-3xl text-white relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 transform translate-x-4 -translate-y-4 opacity-10"><Info className="w-20 h-20" /></div>
                                    <h5 className="font-bold text-lg mb-2 flex items-center gap-2">Listing Tip</h5>
                                    <p className="text-slate-400 text-xs leading-relaxed">High-quality, well-lit photos can increase your chance of getting premium offers by up to 40%. Ensure you capture different angles of the produce.</p>
                                 </div>
                              </div>
                           </div>
                        ) : (
                           <div className="animate-in slide-in-from-right-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Variety / Type</label>
                                    <Input
                                       placeholder="e.g. Sharbati, Hybrid-7"
                                       value={formData.variety}
                                       onChange={e => setFormData({ ...formData, variety: e.target.value })}
                                    />
                                    <p className="text-[9px] text-slate-400 mt-1">Specific variety helps buyers find the right produce.</p>
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Available Quantity</label>
                                    <div className="grid grid-cols-3 gap-2">
                                       <Input
                                          type="number"
                                          placeholder="500"
                                          value={formData.quantity}
                                          onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                                       />
                                       <select
                                          className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-medium outline-nature-500"
                                          value={formData.quantityUnit}
                                          onChange={e => setFormData({ ...formData, quantityUnit: e.target.value as any })}
                                       >
                                          <option value="kg">KG</option>
                                          <option value="quintal">Quintal</option>
                                          <option value="ton">Ton</option>
                                          <option value="gram">Gram</option>
                                       </select>
                                       <div className="flex items-center text-[10px] text-slate-400 font-bold">
                                          ≈ {formData.quantity ? toKg(Number(formData.quantity), formData.quantityUnit).toLocaleString() : '0'} kg
                                       </div>
                                    </div>
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Expected Price</label>
                                    <div className="grid grid-cols-3 gap-2">
                                       <Input
                                          type="number"
                                          placeholder="30"
                                          value={formData.price}
                                          onChange={e => setFormData({ ...formData, price: e.target.value })}
                                       />
                                       <select
                                          className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-medium outline-nature-500"
                                          value={formData.priceUnit}
                                          onChange={e => setFormData({ ...formData, priceUnit: e.target.value as any })}
                                       >
                                          <option value="per_kg">₹/KG</option>
                                          <option value="per_quintal">₹/Quintal</option>
                                          <option value="per_ton">₹/Ton</option>
                                          <option value="per_gram">₹/Gram</option>
                                       </select>
                                       <div className="flex items-center text-[10px] text-slate-400 font-bold">
                                          ≈ ₹{formData.price ? priceToPerKg(Number(formData.price), formData.priceUnit).toLocaleString() : '0'}/kg
                                       </div>
                                    </div>
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Harvest Date</label>
                                    <Input
                                       type="date"
                                       value={formData.harvestDate}
                                       onChange={e => setFormData({ ...formData, harvestDate: e.target.value })}
                                    />
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Available For Sale From</label>
                                    <Input
                                       type="date"
                                       value={formData.availableDate}
                                       onChange={e => setFormData({ ...formData, availableDate: e.target.value })}
                                    />
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Storage Environment</label>
                                    <select
                                       className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-medium outline-nature-500"
                                       value={formData.storageType}
                                       onChange={e => setFormData({ ...formData, storageType: e.target.value as any })}
                                    >
                                       <option value="Ambient">Ambient / Room Temp</option>
                                       <option value="Cold Storage">Cold Storage</option>
                                       <option value="Hermetic Bag">Hermetic Bag</option>
                                       <option value="Open Sacks">Open Sacks</option>
                                    </select>
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Moisture Content (%)</label>
                                    <Input
                                       type="number"
                                       placeholder="12.5"
                                       value={formData.moistureContent}
                                       onChange={e => setFormData({ ...formData, moistureContent: e.target.value })}
                                    />
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Min. Order Qty</label>
                                    <div className="grid grid-cols-3 gap-2">
                                       <Input
                                          type="number"
                                          placeholder="50"
                                          value={formData.minOrderQuantity}
                                          onChange={e => setFormData({ ...formData, minOrderQuantity: e.target.value })}
                                       />
                                       <select
                                          className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-medium outline-nature-500"
                                          value={formData.minOrderQuantityUnit}
                                          onChange={e => setFormData({ ...formData, minOrderQuantityUnit: e.target.value as any })}
                                       >
                                          <option value="kg">KG</option>
                                          <option value="quintal">Quintal</option>
                                          <option value="ton">Ton</option>
                                          <option value="gram">Gram</option>
                                       </select>
                                       <div className="flex items-center text-[10px] text-slate-400 font-bold">
                                          ≈ {formData.minOrderQuantity ? toKg(Number(formData.minOrderQuantity), formData.minOrderQuantityUnit).toLocaleString() : '0'} kg
                                       </div>
                                    </div>
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Packaging Details</label>
                                    <Input
                                       placeholder="e.g. 50kg Jute Bags"
                                       value={formData.packagingDetails}
                                       onChange={e => setFormData({ ...formData, packagingDetails: e.target.value })}
                                    />
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Certifications</label>
                                    <div className="flex gap-2">
                                       <Input
                                          placeholder="e.g. Organic, FSSAI"
                                          value={certText}
                                          onChange={e => setCertText(e.target.value)}
                                       />
                                       <Button
                                          className="h-11"
                                          onClick={() => {
                                             const tags = certText.split(',').map(t => t.trim()).filter(Boolean);
                                             if (tags.length) {
                                                setFormData(prev => ({ ...prev, certification: Array.from(new Set([...(prev.certification || []), ...tags])) }));
                                                setCertText('');
                                             }
                                          }}
                                       >
                                          Add
                                       </Button>
                                    </div>
                                    <div className="flex gap-2 flex-wrap">
                                       {(formData.certification || []).map((c, i) => (
                                          <span key={i} className="px-2 py-1 bg-slate-100 rounded text-xs font-bold text-slate-600 flex items-center gap-2">
                                             {c}
                                             <button
                                                onClick={() => setFormData(prev => ({ ...prev, certification: (prev.certification || []).filter(x => x !== c) }))}
                                                className="text-slate-400 hover:text-red-500"
                                                aria-label={`Remove ${c}`}
                                             >
                                                <X className="w-3 h-3" />
                                             </button>
                                          </span>
                                       ))}
                                    </div>
                                 </div>
                                 <div className="lg:col-span-3 space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Public Marketplace Description</label>
                                    <textarea
                                       className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-medium outline-nature-500 min-h-[100px]"
                                       placeholder="Describe the aroma, texture, and quality of your produce. Why should a buyer choose yours?"
                                       value={formData.description}
                                       onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    />
                                 </div>
                              </div>
                           </div>
                        )}
                     </div>

                     {/* Footer */}
                     <div className="p-6 border-t border-slate-100 flex justify-between items-center bg-white">
                        <Button
                           variant="ghost"
                           onClick={() => cropStep === 1 ? setIsAddingCrop(false) : setCropStep(1)}
                           className="font-bold flex items-center gap-2"
                        >
                           <ArrowLeft className="w-4 h-4" /> {cropStep === 1 ? 'Cancel' : 'Previous Step'}
                        </Button>
                        <Button
                           className="rounded-full px-12 h-12 shadow-xl shadow-nature-600/20 font-black tracking-wide"
                           onClick={() => cropStep === 1 ? setCropStep(2) : publishListing()}
                           disabled={(images.length === 0 && !video) || isAnalyzing}
                        >
                           {cropStep === 1 ? (
                              <>Next Step <ArrowRight className="w-4 h-4 ml-2" /></>
                           ) : (
                              <>Publish Crop Listing <CheckCircle className="w-4 h-4 ml-2" /></>
                           )}
                        </Button>
                     </div>
                  </Card>
               </div>
            )}
            
            {counterModal.open && counterModal.offer && (
               <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                  <Card className="w-full max-w-md shadow-2xl relative bg-white p-6">
                     <h3 className="text-xl font-bold mb-4">Counter Offer</h3>
                     <div className="space-y-4">
                        <div>
                           <label className="text-xs font-bold text-slate-500 uppercase">Price per kg (₹)</label>
                           <Input
                              type="number"
                              value={counterPrice}
                              onChange={e => setCounterPrice(e.target.value)}
                              className="font-bold text-lg"
                           />
                           <p className="text-xs text-slate-400 mt-1">Buyer offered: ₹{counterModal.offer.offeredPrice || counterModal.offer.pricePerKg}</p>
                        </div>
                        <div className="flex gap-3">
                           <Button variant="outline" className="flex-1" onClick={() => setCounterModal({ open: false, offer: null })}>Cancel</Button>
                           <Button className="flex-1 bg-blue-600 hover:bg-blue-700 font-bold" onClick={() => {
                               console.log('Sending Farmer Counter:', counterModal.offer.id, counterPrice);
                               onCounterOffer(counterModal.offer.id, Number(counterPrice), counterModal.offer.quantityRequested || counterModal.offer.quantity, 'farmer');
                               setCounterModal({ open: false, offer: null });
                           }}>Send Counter</Button>
                        </div>
                     </div>
                  </Card>
               </div>
            )}
         </div>
      </div>
   );
};

// Buyer and Transporter Dashboards remain the same
const BuyerDashboard = ({ user, listings, offers, orders, messages, rfqs, transportRequests, transportBids, allUsers, onAddRfq, onSendMessage, onPlaceOffer, onAcceptOffer, onCounterOffer, onCancelOffer, onLogout, onUpdateProfile, onRaiseDispute, onCreateTransportRequest, onAcceptTransportBid, onCounterTransportBid, onUpdateTransportRequest, onOpenChat, onViewInvoice, onUpdateOrderPayment, onDirectBuy }: any) => {
   const [view, setView] = useState('home');
   const [searchTerm, setSearchTerm] = useState('');
   const [selectedListing, setSelectedListing] = useState<any>(null);
   const [showOfferModal, setShowOfferModal] = useState(false);
   const [offerData, setOfferData] = useState({ quantity: 0, price: 0 });
   const [showBuyModal, setShowBuyModal] = useState(false);
   const [buyQuantity, setBuyQuantity] = useState(1);
   
   // Negotiation State
   const [counterModal, setCounterModal] = useState<{open: boolean, offer: any | null}>({ open: false, offer: null });
   const [counterPrice, setCounterPrice] = useState('');

   const [showTransportModal, setShowTransportModal] = useState(false);
   const [transportOrderId, setTransportOrderId] = useState<string | null>(null);
   const [transportStep, setTransportStep] = useState<'mode' | 'vehicle'>('mode');
   const [transportPriceModal, setTransportPriceModal] = useState<{ open: boolean; type: 'vehicle_offer' | 'edit_offer' | 'counter_bid'; orderId?: string; requestId?: string; bidId?: string; vehicleType?: TransportRequest['vehicleType']; baseFare?: number }>({ open: false, type: 'vehicle_offer' });
   const [transportPriceValue, setTransportPriceValue] = useState('');
   const [cartItems, setCartItems] = useState<{ listingId: string; quantity: number }[]>([]);
   const [activeImageIndex, setActiveImageIndex] = useState(0);

   const getVehicleCapacityKg = (t: TransportRequest['vehicleType']) =>
      t === 'Bike' ? 50 : t === 'Auto' ? 500 : t === 'Mini Truck' ? 2000 : t === 'Pickup' ? 5000 : 50000;

   const estimateTransportFare = (distanceKm: number, vehicleType: TransportRequest['vehicleType']) => {
      const km = Math.max(1, distanceKm || 1);
      const table: Record<TransportRequest['vehicleType'], { ratePerKm: number; min: number }> = {
         Bike: { ratePerKm: 8, min: 80 },
         Auto: { ratePerKm: 12, min: 150 },
         'Mini Truck': { ratePerKm: 18, min: 400 },
         Pickup: { ratePerKm: 25, min: 800 },
         Truck: { ratePerKm: 35, min: 1200 }
      };
      const calc = Math.round(km * table[vehicleType].ratePerKm);
      return Math.max(calc, table[vehicleType].min);
   };

   React.useEffect(() => {
      setActiveImageIndex(0);
   }, [selectedListing?.id]);

   const addToCart = (listing: any, qty?: number) => {
      const minQty = Number(listing.minOrderQuantity || 1);
      const addQty = Math.max(1, Number(qty || minQty));
      setCartItems(prev => {
         const existing = prev.find(i => i.listingId === listing.id);
         if (!existing) return [...prev, { listingId: listing.id, quantity: Math.min(addQty, Number(listing.availableQuantity || listing.quantity || addQty)) }];
         return prev.map(i => i.listingId !== listing.id ? i : ({
            ...i,
            quantity: Math.min(i.quantity + addQty, Number(listing.availableQuantity || listing.quantity || i.quantity + addQty))
         }));
      });
   };

   const removeFromCart = (listingId: string) => setCartItems(prev => prev.filter(i => i.listingId !== listingId));

   // Buyer Profile State
   const [profileData, setProfileData] = useState<BuyerProfile>(user.profile || { fullName: user.phone, city: '', state: '', language: 'English' });
   const [profileTab, setProfileTab] = useState<'overview' | 'edit'>('overview');

   // Marketplace State
   const [marketFilter, setMarketFilter] = useState<'all' | 'Vegetables' | 'Grains' | 'Fruits'>('all');
   const [marketSort, setMarketSort] = useState<'newest' | 'price_low' | 'price_high'>('newest');

   // Notifications State
   const [notifications, setNotifications] = useState<any[]>([]);
   const [notificationFilter, setNotificationFilter] = useState<'all' | 'unread' | 'offer' | 'order'>('all');

   // Help & Support State
   const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
   const [supportForm, setSupportForm] = useState({ name: user.profile?.fullName || '', email: '', issue: '' });

   // Settings State
   const [settingsData, setSettingsData] = useState({
      notifyOrders: true,
      notifyOffers: true,
      notifyNewListings: true,
      language: user.profile?.language || 'English',
      twoFactor: false
   });

   const myOffers = offers.filter((o: any) => o.buyerName === user.profile.fullName);
   const myOrders = (orders || []).filter((o: any) => o?.buyerName === user?.profile?.fullName);
   const cartCount = cartItems.length;
   const filteredListings = listings.filter((l: any) =>
      l.status === 'active' &&
      (marketFilter === 'all' || l.cropName.includes(marketFilter) || (marketFilter === 'Vegetables' && ['Potato', 'Tomato', 'Onion', 'Carrot'].includes(l.cropName)) || (marketFilter === 'Grains' && ['Wheat', 'Rice', 'Maize', 'Soybean'].includes(l.cropName)) || (marketFilter === 'Fruits' && ['Mango', 'Banana', 'Apple'].includes(l.cropName))) &&
      (l.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
         l.location.toLowerCase().includes(searchTerm.toLowerCase()))
   ).sort((a: any, b: any) => {
      if (marketSort === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (marketSort === 'price_low') return a.pricePerKg - b.pricePerKg;
      return b.pricePerKg - a.pricePerKg;
   });

   const getCategory = (cropName: string) => {
      const veg = ['Potato', 'Tomato', 'Onion', 'Carrot', 'Cabbage', 'Cauliflower', 'Brinjal', 'Okra'];
      const grains = ['Wheat', 'Rice', 'Maize', 'Soybean', 'Bajra', 'Jowar'];
      const fruits = ['Mango', 'Banana', 'Apple', 'Grapes', 'Orange'];
      if (veg.includes(cropName)) return 'Vegetables';
      if (grains.includes(cropName)) return 'Grains';
      if (fruits.includes(cropName)) return 'Fruits';
      return 'All';
   };

   const farmerUser = selectedListing ? (allUsers || []).find((u: any) => u.id === selectedListing.farmerId) : null;
   const farmerListingsAll = selectedListing ? listings.filter((l: any) => l.status === 'active' && l.farmerId === selectedListing.farmerId).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) : [];
   const currentFarmerIndex = selectedListing ? farmerListingsAll.findIndex((l: any) => l.id === selectedListing.id) : -1;
   const prevFromFarmer = currentFarmerIndex > 0 ? farmerListingsAll[currentFarmerIndex - 1] : null;
   const nextFromFarmer = currentFarmerIndex >= 0 && currentFarmerIndex < farmerListingsAll.length - 1 ? farmerListingsAll[currentFarmerIndex + 1] : null;
   const moreFromFarmer = selectedListing ? farmerListingsAll.filter((l: any) => l.id !== selectedListing.id).slice(0, 8) : [];
   const similarSameCrop = selectedListing ? listings.filter((l: any) => l.status === 'active' && l.cropName === selectedListing.cropName && l.id !== selectedListing.id).slice(0, 8) : [];
   const recommendedOtherFarmers = selectedListing ? listings.filter((l: any) => l.status === 'active' && l.farmerId !== selectedListing.farmerId && getCategory(l.cropName) === getCategory(selectedListing.cropName)).slice(0, 12) : [];
   const recommendedNearYou = selectedListing ? listings.filter((l: any) => l.status === 'active' && l.farmerId !== selectedListing.farmerId && (l.location || '').toLowerCase().includes((user.profile?.city || '').toLowerCase())).slice(0, 8) : [];

   const handlePlaceOfferSubmit = () => {
      onPlaceOffer({
         listingId: selectedListing.id,
         cropName: selectedListing.cropName,
         buyerName: user.profile.fullName,
         buyerLocation: user.profile.city,
         pricePerKg: offerData.price,
         offeredPrice: offerData.price,
         quantity: offerData.quantity,
         quantityRequested: offerData.quantity,
         totalAmount: offerData.price * offerData.quantity
      });
      setShowOfferModal(false);
      setSelectedListing(null);
      // Wait for state update then switch view
      setTimeout(() => setView('offers'), 100);
   };

   const handleBuyNowSubmit = async () => {
      if (!selectedListing) return
      const maxQty = Number(selectedListing.availableQuantity || selectedListing.quantity || 0)
      const qty = Math.max(1, Math.min(Number(buyQuantity || 1), maxQty || Number(buyQuantity || 1)))
      try {
         await onDirectBuy?.(selectedListing.id, qty)
         setShowBuyModal(false)
         setSelectedListing(null)
         setView('orders')
      } catch (e) {
         console.error(e)
         alert('Failed to place order.')
      }
   }

   const handleBuyFromCart = async (listing: any, quantity: number) => {
      const maxQty = Number(listing.availableQuantity || listing.quantity || 0)
      const qty = Math.max(1, Math.min(Number(quantity || 1), maxQty || Number(quantity || 1)))
      const order = await onDirectBuy?.(listing.id, qty)
      if (!order) return
      setCartItems(prev => prev.filter(i => i.listingId !== listing.id))
      setView('orders')
   }

   const handleCheckoutCart = async () => {
      if (cartItems.length === 0) return
      for (const ci of cartItems) {
         const l = listings.find((x: any) => x.id === ci.listingId)
         if (!l) continue
         const maxQty = Number(l.availableQuantity || l.quantity || 0)
         const qty = Math.max(1, Math.min(Number(ci.quantity || 1), maxQty || Number(ci.quantity || 1)))
         await onDirectBuy?.(l.id, qty)
      }
      setCartItems([])
      setView('orders')
   }

   return (
      <div className="flex h-screen bg-slate-50 overflow-hidden">
         {/* Sidebar */}
         <aside className="w-72 bg-gradient-to-b from-blue-700 via-blue-700 to-indigo-800 border-r border-blue-900/30 flex flex-col p-4 text-white">
            <div className="flex items-center gap-3 mb-8 px-2">
               <div className="w-10 h-10 bg-white/15 border border-white/15 rounded-xl flex items-center justify-center text-white shadow-sm">
                  <ShoppingBag className="w-5 h-5" />
               </div>
               <span className="font-black text-xl leading-tight">KisanSetu <br /><span className="text-blue-200 text-xs font-black tracking-widest uppercase">Buyer Portal</span></span>
            </div>
            <nav className="space-y-1 flex-1 overflow-y-auto pr-1">
               {[
                  { id: 'home', label: 'Marketplace', icon: Store },
                  { id: 'offers', label: 'My Offers', icon: ShoppingBag, badge: myOffers.length },
                  { id: 'orders', label: 'My Orders', icon: Package, badge: myOrders.length },
                  { id: 'payments', label: 'Pending Payments', icon: CreditCard, badge: myOrders.filter(o => o.paymentStatus === 'pending').length },
                  { id: 'cart', label: 'Cart', icon: ShoppingCart, badge: cartCount },
                     { id: 'rfq', label: 'RFQ', icon: FileText },
                     { id: 'shortlists', label: 'Shortlists', icon: Package },
                     { id: 'analytics', label: 'Analytics', icon: FileClock },
                  { id: 'messages', label: 'Messages', icon: MessageCircle },
                  { id: 'addresses', label: 'Addresses', icon: MapPin },
                  { id: 'more', label: 'Pro Features', icon: Settings },
                  { id: 'profile', label: 'My Profile', icon: UserIcon },
                  { id: 'notifications', label: 'Notifications', icon: Bell, badge: notifications.filter((n: any) => !n.isRead).length },
                  { id: 'help', label: 'Help & Support', icon: HelpCircle },
                  { id: 'settings', label: 'Settings', icon: Settings }
               ].map(item => (
                  <button
                     key={item.id}
                     onClick={() => setView(item.id)}
                     className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${view === item.id ? 'bg-white/15 text-white ring-1 ring-white/15' : 'text-white/80 hover:text-white hover:bg-white/10'}`}
                  >
                     <item.icon className={`w-5 h-5 ${view === item.id ? 'text-white' : 'text-white/80'}`} />
                     <span className="flex-1 text-left">{item.label}</span>
                     {item.badge > 0 && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${view === item.id ? 'bg-white/25 text-white' : 'bg-white/15 text-white'}`}>
                           {item.badge}
                        </span>
                     )}
                  </button>
               ))}
            </nav>
            <button onClick={onLogout} className="mt-auto flex items-center gap-2 px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/10 font-bold transition-colors"><LogOut className="w-5 h-5" /> Logout</button>
         </aside>

         {/* Main Content */}
         <main className="flex-1 overflow-y-auto p-6 lg:p-8 relative h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/60">
            {view === 'home' && (
               <div className="space-y-8 animate-in fade-in">
                  <Card className="p-0 overflow-hidden border-slate-200">
                     <div className="p-7 bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 text-white relative">
                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,white,transparent_60%)]" />
                        <div className="relative">
                           <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                              <div>
                                 <div className="text-[10px] font-black uppercase tracking-[0.25em] text-white/80">Marketplace</div>
                                 <h2 className="text-3xl md:text-4xl font-black mt-1 leading-tight">Buy Direct From Farmers</h2>
                                 <p className="text-white/85 font-medium mt-2 max-w-2xl leading-relaxed">Compare price, quality, and location. Add items to cart and negotiate directly with farmers.</p>
                              </div>
                              <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
                                 <div className="p-4 rounded-2xl bg-white/10 border border-white/15">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-white/70">Live</div>
                                    <div className="text-2xl font-black">{filteredListings.length}</div>
                                 </div>
                                 <div className="p-4 rounded-2xl bg-white/10 border border-white/15">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-white/70">Cart</div>
                                    <div className="text-2xl font-black">{cartCount}</div>
                                 </div>
                                 <div className="p-4 rounded-2xl bg-white/10 border border-white/15">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-white/70">Offers</div>
                                    <div className="text-2xl font-black">{myOffers.length}</div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="p-5 bg-white border-t border-slate-100">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                           <div className="relative w-full lg:w-[420px]">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                              <input
                                 type="text"
                                 placeholder="Search crop, location, farmer..."
                                 className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                 value={searchTerm}
                                 onChange={e => setSearchTerm(e.target.value)}
                              />
                           </div>
                           <div className="flex flex-wrap gap-2 items-center">
                              {(['all', 'Vegetables', 'Grains', 'Fruits'] as const).map(filter => (
                                 <button
                                    key={filter}
                                    onClick={() => setMarketFilter(filter)}
                                    className={`px-4 h-11 rounded-2xl whitespace-nowrap text-sm font-black transition-all ${marketFilter === filter
                                       ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                       : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'}`}
                                 >
                                    {filter === 'all' ? 'All' : filter}
                                 </button>
                              ))}
                              <select
                                 className="px-4 h-11 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 font-black text-slate-700 cursor-pointer"
                                 value={marketSort}
                                 onChange={(e: any) => setMarketSort(e.target.value)}
                              >
                                 <option value="newest">Newest</option>
                                 <option value="price_low">Lowest Price</option>
                                 <option value="price_high">Highest Price</option>
                              </select>
                           </div>
                        </div>
                     </div>
                  </Card>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                     {filteredListings.map(l => {
                        const imageUrl = l.imageUrls?.[0] || l.imageUrl
                        const stock = Number(l.availableQuantity ?? l.quantity ?? 0)
                        const quantityUnit = (l.quantityUnit || 'kg').toString()
                        const minQty = Math.max(1, Number(l.minOrderQuantity ?? 1))
                        const minQtyUnit = (l.minOrderQuantityUnit || quantityUnit).toString()
                        const priceUnit = (l.priceUnit || 'kg').toString()
                        const farmerName = (l.farmerName || 'Unknown').toString()
                        const location = (l.location || '—').toString()
                        const cropTitle = `${l.cropName || 'Crop'}${l.variety ? ` • ${l.variety}` : ''}`
                        const price = Number(l.pricePerKg ?? 0)
                        return (
                           <Card key={l.id} className="p-0 overflow-hidden bg-white border border-slate-200/80 shadow-sm hover:shadow-2xl hover:border-blue-300 transition-all duration-300 rounded-2xl">
                              <button
                                 className="relative w-full text-left"
                                 onClick={() => { setSelectedListing(l); setView('product-details'); }}
                                 type="button"
                              >
                                 <div className="h-48 overflow-hidden bg-slate-100 relative">
                                    {imageUrl ? (
                                       <img src={imageUrl} alt={l.cropName} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                       <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200" />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/10 to-transparent" />

                                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-3">
                                       <div className="flex items-center gap-2">
                                          {!!l.grade && (
                                             <div className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-black uppercase text-blue-700 shadow-sm border border-blue-100">
                                                Grade {l.grade}
                                             </div>
                                          )}
                                          {!!(l.certification && l.certification.length) && (
                                             <div className="px-3 py-1 bg-green-50/90 backdrop-blur-sm rounded-full text-[10px] font-black uppercase text-green-700 shadow-sm border border-green-100">
                                                Certified
                                             </div>
                                          )}
                                       </div>
                                       <button
                                          className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200 text-slate-700 flex items-center justify-center shadow-sm hover:bg-white transition-colors"
                                          onClick={(e) => { e.stopPropagation(); addToCart(l); }}
                                          type="button"
                                       >
                                          <ShoppingCart className="w-5 h-5" />
                                       </button>
                                    </div>

                                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
                                       <div className="min-w-0">
                                          <div className="text-white font-black leading-tight truncate">{cropTitle}</div>
                                          <div className="text-white/85 text-xs font-bold flex items-center gap-1 truncate mt-1">
                                             <MapPin className="w-3 h-3" />
                                             {location}
                                          </div>
                                       </div>
                                       <div className="shrink-0 text-right">
                                          <div className="px-3 py-2 rounded-2xl bg-white/90 backdrop-blur-sm border border-white/50 shadow-sm">
                                             <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Price</div>
                                             <div className="text-slate-900 font-black text-lg leading-none">₹{price.toLocaleString()}</div>
                                             <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">/{priceUnit}</div>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              </button>

                              <div className="p-5">
                                 <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0">
                                       <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Farmer</div>
                                       <div className="font-black text-slate-900 truncate">{farmerName}</div>
                                    </div>
                                    <div className="text-right">
                                       <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Stock</div>
                                       <div className="font-black text-slate-900">{stock.toLocaleString()} {quantityUnit}</div>
                                    </div>
                                 </div>

                                 <div className="mt-4 flex flex-wrap gap-2">
                                    <div className="px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-[10px] font-black text-slate-600 uppercase tracking-wider">
                                       MOQ {minQty.toLocaleString()}{minQtyUnit}
                                    </div>
                                    {!!(l.packagingDetails || '').trim() && (
                                       <div className="px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-[10px] font-black text-slate-600 uppercase tracking-wider">
                                          Packed
                                       </div>
                                    )}
                                    {!!l.harvestDate && (
                                       <div className="px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-[10px] font-black text-slate-600 uppercase tracking-wider">
                                          Harvest {l.harvestDate}
                                       </div>
                                    )}
                                 </div>

                                 <div className="mt-5 grid grid-cols-3 gap-2">
                                    <Button variant="outline" className="h-11 text-xs font-black border-slate-200" onClick={() => { setSelectedListing(l); setView('product-details'); }}>
                                       View
                                    </Button>
                                    <Button variant="outline" className="h-11 text-xs font-black border-slate-200" onClick={() => { setSelectedListing(l); setBuyQuantity(Number(l.minOrderQuantity || 1)); setShowBuyModal(true); }}>
                                       Buy Now
                                    </Button>
                                    <Button className="h-11 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 text-xs font-black" onClick={() => { setSelectedListing(l); setOfferData({ quantity: l.minOrderQuantity || l.availableQuantity || l.quantity, price: l.pricePerKg }); setShowOfferModal(true); }}>
                                       Negotiate
                                    </Button>
                                 </div>
                              </div>
                           </Card>
                        )
                     })}
                  </div>
               </div>
            )}

            {view === 'payments' && (
               <div className="space-y-8 animate-in fade-in">
                  <h2 className="text-3xl font-bold text-slate-900">Pending Payments</h2>
                  <div className="grid gap-4">
                     {myOrders.filter((o: any) => o.paymentStatus === 'pending').length === 0 ? (
                        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                           <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                              <CheckCircle className="w-8 h-8" />
                           </div>
                           <h3 className="text-lg font-bold text-slate-900">All caught up!</h3>
                           <p className="text-slate-500">You have no pending payments.</p>
                        </div>
                     ) : (
                        myOrders.filter((o: any) => o.paymentStatus === 'pending').map((o: any) => (
                           <Card key={o.id} className="p-6 border-slate-200">
                              <div className="flex justify-between items-center">
                                 <div>
                                    <div className="flex items-center gap-3 mb-1">
                                       <h3 className="text-lg font-bold text-slate-900">Order #{o.id}</h3>
                                       <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-black uppercase tracking-wider">Payment Pending</span>
                                    </div>
                                    <p className="text-sm text-slate-500">{o.cropName} • {o.quantity}kg • <span className="font-bold text-slate-900">₹{o.totalAmount.toLocaleString()}</span></p>
                                 </div>
                                 <Button 
                                    className="bg-green-600 hover:bg-green-700 font-bold"
                                    onClick={async () => {
                                       // Simulate Payment Proof Upload
                                       const proof = `TXN-${Date.now()}`;
                                       if (confirm("Simulate payment transfer for ₹" + o.totalAmount + "?\n(This is a mock transaction)")) {
                                          await onUpdateOrderPayment?.(o.id, 'review', proof);
                                          alert("Payment proof submitted! Waiting for Farmer approval.");
                                       }
                                    }}
                                 >
                                    Pay Now
                                 </Button>
                              </div>
                           </Card>
                        ))
                     )}
                  </div>
               </div>
            )}

            {view === 'product-details' && selectedListing && (
               <div className="space-y-6 animate-in slide-in-from-right-4 pb-10">
                  <div className="flex items-center gap-2 mb-4">
                     <Button variant="ghost" onClick={() => setView('home')} className="gap-2 text-slate-500 hover:text-slate-900 font-bold"><ArrowLeft className="w-4 h-4" /> Back to Marketplace</Button>
                  </div>
                  <Card className="w-full shadow-sm relative overflow-hidden bg-white p-0 border border-slate-200">
                     <div className="p-5 md:p-6 border-b border-slate-100 flex items-start justify-between gap-4">
                        <div className="min-w-0">
                           <div className="text-xs text-slate-400 font-bold">
                              Marketplace <span className="mx-1">›</span> {getCategory(selectedListing.cropName)} <span className="mx-1">›</span> <span className="text-slate-700 font-black">{selectedListing.cropName}</span>
                           </div>
                           <div className="flex items-center gap-3 mt-2">
                              <h3 className="text-2xl md:text-3xl font-black text-slate-900 truncate">{selectedListing.cropName}{selectedListing.variety ? ` • ${selectedListing.variety}` : ''}</h3>
                              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-700 border border-blue-100">Grade {selectedListing.grade}</span>
                              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-50 text-amber-700 border border-amber-100 flex items-center gap-1"><Star className="w-3 h-3" /> 4.6</span>
                           </div>
                           <div className="text-sm text-slate-500 font-medium mt-1 flex items-center gap-2"><MapPin className="w-4 h-4" /> {selectedListing.location}</div>
                        </div>
                        <div className="flex items-center gap-2">
                           <Button variant="outline" className="h-10 text-xs font-black border-slate-200" disabled={!prevFromFarmer} onClick={() => prevFromFarmer && setSelectedListing(prevFromFarmer)}><ArrowLeft className="w-4 h-4 mr-2" /> Prev</Button>
                           <Button variant="outline" className="h-10 text-xs font-black border-slate-200" disabled={!nextFromFarmer} onClick={() => nextFromFarmer && setSelectedListing(nextFromFarmer)}>Next <ArrowRight className="w-4 h-4 ml-2" /></Button>
                        </div>
                     </div>

                     <div className="grid lg:grid-cols-5 gap-0">
                        <div className="lg:col-span-2 bg-slate-50 border-r border-slate-100">
                           {(() => {
                              const images = (selectedListing.imageUrls && selectedListing.imageUrls.length > 0) ? selectedListing.imageUrls : (selectedListing.imageUrl ? [selectedListing.imageUrl] : []);
                              const active = images[Math.min(activeImageIndex, Math.max(0, images.length - 1))] || images[0];
                              return (
                                 <div className="p-5 md:p-6">
                                    <div className="aspect-square rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-sm">
                                       <img src={active} alt={selectedListing.cropName} className="w-full h-full object-cover" />
                                    </div>
                                    {images.length > 1 && (
                                       <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                                          {images.slice(0, 6).map((src: string, i: number) => (
                                             <button key={src + i} className={`w-20 h-20 rounded-2xl overflow-hidden border ${i === activeImageIndex ? 'border-blue-600 ring-2 ring-blue-600/20' : 'border-slate-200 hover:border-blue-300'}`} onClick={() => setActiveImageIndex(i)}>
                                                <img src={src} alt={`${selectedListing.cropName} ${i + 1}`} className="w-full h-full object-cover" />
                                             </button>
                                          ))}
                                       </div>
                                    )}
                                 </div>
                              );
                           })()}
                        </div>

                        <div className="lg:col-span-3 p-5 md:p-6">
                           <div className="grid md:grid-cols-3 gap-6">
                              <div className="md:col-span-2 space-y-6">
                                 <Card className="p-5 border-slate-200 bg-white">
                                    <div className="flex items-end justify-between gap-4">
                                       <div>
                                          <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Price</div>
                                          <div className="text-3xl font-black text-blue-600">₹{selectedListing.pricePerKg}/kg</div>
                                          <div className="text-xs text-slate-500 font-bold mt-1">MOQ: {selectedListing.minOrderQuantity || 1} kg</div>
                                       </div>
                                       <div className="text-right">
                                          <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Available</div>
                                          <div className="text-2xl font-black text-slate-900">{selectedListing.availableQuantity || selectedListing.quantity} kg</div>
                                       </div>
                                    </div>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                       {!!selectedListing.packagingDetails && <div className="px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-[10px] font-black text-slate-600 uppercase tracking-wider">Packed</div>}
                                       {!!selectedListing.moistureContent && <div className="px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-[10px] font-black text-slate-600 uppercase tracking-wider">Moisture {selectedListing.moistureContent}%</div>}
                                       {!!selectedListing.harvestDate && <div className="px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-[10px] font-black text-slate-600 uppercase tracking-wider">Harvest {new Date(selectedListing.harvestDate).toLocaleDateString()}</div>}
                                       {!!(selectedListing.certification && selectedListing.certification.length) && <div className="px-3 py-1 rounded-full bg-green-50 border border-green-100 text-[10px] font-black text-green-700 uppercase tracking-wider">Certified</div>}
                                    </div>
                                 </Card>

                                 <div className="space-y-2">
                                    <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">About this product</div>
                                    <div className="text-sm text-slate-700 font-medium leading-relaxed">{selectedListing.description || 'No description provided.'}</div>
                                 </div>

                                 <Card className="p-5 border-slate-200 bg-white">
                                    <div className="flex items-start justify-between gap-4">
                                       <div className="min-w-0">
                                          <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Seller</div>
                                          <div className="text-lg font-black text-slate-900 truncate">{selectedListing.farmerName}</div>
                                          <div className="text-xs text-slate-500 font-medium">
                                             {farmerUser?.profile?.city ? `${(farmerUser.profile as any).city}, ` : ''}{farmerUser?.profile?.state ? (farmerUser.profile as any).state : ''}
                                          </div>
                                       </div>
                                       <Button variant="outline" className="h-10 text-xs font-black border-slate-200" onClick={() => {
                                          const toUserId = selectedListing.farmerId;
                                          onSendMessage?.({ toUserId, text: `Hi ${selectedListing.farmerName}, I'm interested in ${selectedListing.cropName}.`, listingId: selectedListing.id });
                                          setView('messages');
                                       }}>Message</Button>
                                    </div>
                                 </Card>
                              </div>

                              <div className="md:col-span-1">
                                 <div className="sticky top-6">
                                    <Card className="p-5 border-slate-200 bg-white">
                                       <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Quick Actions</div>
                                       <div className="mt-4 space-y-3">
                                          <Button className="w-full h-12 bg-slate-900 hover:bg-slate-800 font-black" onClick={() => { setBuyQuantity(Number(selectedListing.minOrderQuantity || 1)); setShowBuyModal(true); }}>Buy Now</Button>
                                          <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700 font-black" onClick={() => { addToCart(selectedListing); setView('cart'); }}><ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart</Button>
                                          <Button variant="outline" className="w-full h-12 font-black border-slate-200" onClick={() => { setOfferData({ quantity: selectedListing.minOrderQuantity || 1, price: selectedListing.pricePerKg }); setShowOfferModal(true); }}>Negotiate Price</Button>
                                          <Button variant="ghost" className="w-full h-11 font-black text-slate-600" onClick={() => { setView('home'); }}>Continue Shopping</Button>
                                       </div>
                                    </Card>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="p-5 md:p-6 border-t border-slate-100 bg-white space-y-8">
                        <div>
                           <div className="flex items-center justify-between mb-4">
                              <div className="text-sm font-black text-slate-900">More from {selectedListing.farmerName}</div>
                              <div className="text-xs font-bold text-slate-400">Listings: {Math.max(0, farmerListingsAll.length - 1)}</div>
                           </div>
                           {moreFromFarmer.length === 0 ? (
                              <div className="text-xs text-slate-500 font-medium">No other active listings from this farmer.</div>
                           ) : (
                              <div className="flex gap-4 overflow-x-auto pb-2">
                                 {moreFromFarmer.map((l: any) => (
                                    <button key={l.id} className="text-left group min-w-[220px]" onClick={() => setSelectedListing(l)}>
                                       <Card className="p-0 overflow-hidden border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all">
                                          <div className="h-32 overflow-hidden">
                                             <img src={l.imageUrls?.[0] || l.imageUrl} alt={l.cropName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                          </div>
                                          <div className="p-4">
                                             <div className="font-black text-slate-900 truncate">{l.cropName}</div>
                                             <div className="text-xs text-slate-500 font-medium truncate">{l.location}</div>
                                             <div className="text-xs text-blue-600 font-black mt-1">₹{l.pricePerKg}/kg</div>
                                          </div>
                                       </Card>
                                    </button>
                                 ))}
                              </div>
                           )}
                        </div>

                        <div>
                           <div className="flex items-center justify-between mb-4">
                              <div className="text-sm font-black text-slate-900">Similar products ({selectedListing.cropName})</div>
                              <div className="text-xs font-bold text-slate-400">From other farmers</div>
                           </div>
                           {similarSameCrop.length === 0 ? (
                              <div className="text-xs text-slate-500 font-medium">No similar products found right now.</div>
                           ) : (
                              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                 {similarSameCrop.slice(0, 8).map((l: any) => (
                                    <button key={l.id} className="text-left group" onClick={() => setSelectedListing(l)}>
                                       <Card className="p-0 overflow-hidden border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all">
                                          <div className="h-28 overflow-hidden">
                                             <img src={l.imageUrls?.[0] || l.imageUrl} alt={l.cropName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                          </div>
                                          <div className="p-4">
                                             <div className="font-black text-slate-900 truncate">{l.cropName}</div>
                                             <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest truncate">{l.farmerName}</div>
                                             <div className="text-xs text-slate-500 font-medium truncate">{l.location}</div>
                                             <div className="text-xs text-blue-600 font-black mt-1">₹{l.pricePerKg}/kg</div>
                                          </div>
                                       </Card>
                                    </button>
                                 ))}
                              </div>
                           )}
                        </div>

                        <div>
                           <div className="flex items-center justify-between mb-4">
                              <div className="text-sm font-black text-slate-900">Recommended from other farmers</div>
                              <div className="text-xs font-bold text-slate-400">{getCategory(selectedListing.cropName)} picks</div>
                           </div>
                           <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                              {(recommendedNearYou.length > 0 ? recommendedNearYou : recommendedOtherFarmers).slice(0, 8).map((l: any) => (
                                 <button key={l.id} className="text-left group" onClick={() => setSelectedListing(l)}>
                                    <Card className="p-0 overflow-hidden border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all">
                                       <div className="h-28 overflow-hidden">
                                          <img src={l.imageUrls?.[0] || l.imageUrl} alt={l.cropName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                       </div>
                                       <div className="p-4">
                                          <div className="font-black text-slate-900 truncate">{l.cropName}</div>
                                          <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest truncate">{l.farmerName}</div>
                                          <div className="text-xs text-slate-500 font-medium truncate">{l.location}</div>
                                          <div className="text-xs text-blue-600 font-black mt-1">₹{l.pricePerKg}/kg</div>
                                       </div>
                                    </Card>
                                 </button>
                              ))}
                           </div>
                        </div>
                     </div>
                  </Card>
               </div>
            )}
            
            <div className="pb-24">
            {view === 'rfq' && (
               <div className="space-y-6 animate-in slide-in-from-right-4">
                  <h2 className="text-2xl font-bold text-slate-900">Request for Quotation</h2>
                  <Card className="p-6 space-y-4">
                     <div className="grid md:grid-cols-3 gap-4">
                        <Input id="rfq-crop" placeholder="Crop Name" />
                        <Input id="rfq-qty" type="number" placeholder="Quantity (kg)" />
                        <Input id="rfq-price" type="number" placeholder="Target Price (₹/kg)" />
                     </div>
                     <Button className="w-full md:w-auto" onClick={() => {
                        const crop = (document.getElementById('rfq-crop') as HTMLInputElement)?.value;
                        const qty = Number((document.getElementById('rfq-qty') as HTMLInputElement)?.value || 0);
                        const price = Number((document.getElementById('rfq-price') as HTMLInputElement)?.value || 0);
                        if (!crop || qty <= 0 || price <= 0) return;
                        onAddRfq?.({ buyerId: user.id, cropName: crop, quantityKg: qty, targetPricePerKg: price });
                     }}>Create RFQ</Button>
                  </Card>
                  <Card className="p-6">
                     <div className="grid md:grid-cols-2 gap-4">
                        {(rfqs || []).filter(r => r.buyerId === user.id).map(r => (
                           <div key={r.id} className="p-4 bg-slate-50 rounded-xl">
                              <div className="text-xs text-slate-400 uppercase font-bold">RFQ</div>
                              <div className="font-bold text-slate-900">{r.cropName} • {r.quantityKg} kg</div>
                              <div className="text-sm text-slate-600">Target ₹{r.targetPricePerKg}/kg • {r.status}</div>
                           </div>
                        ))}
                        {(rfqs || []).filter(r => r.buyerId === user.id).length === 0 && <div className="text-sm text-slate-400">No RFQs yet.</div>}
                     </div>
                  </Card>
               </div>
            )}
            {view === 'shortlists' && (
               <div className="space-y-6 animate-in slide-in-from-right-4">
                  <h2 className="text-2xl font-bold text-slate-900">Shortlists</h2>
                  <Card className="p-6">
                     <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredListings.slice(0, 6).map(l => (
                           <Card key={l.id} className="p-4 bg-slate-50">
                              <div className="font-bold text-slate-900">{l.cropName}</div>
                              <div className="text-sm text-slate-600">{l.location}</div>
                              <div className="mt-2"><Button variant="outline" className="text-xs">Save</Button></div>
                           </Card>
                        ))}
                     </div>
                  </Card>
               </div>
            )}
            {view === 'analytics' && (
               <div className="space-y-6 animate-in slide-in-from-right-4">
                  <h2 className="text-2xl font-bold text-slate-900">Analytics</h2>
                  <div className="grid md:grid-cols-3 gap-4">
                     <Card className="p-4"><div className="text-xs text-slate-400 uppercase font-bold">Total Spend</div><div className="text-xl font-black">₹{myOrders.reduce((s, o) => s + o.totalAmount, 0).toLocaleString()}</div></Card>
                     <Card className="p-4"><div className="text-xs text-slate-400 uppercase font-bold">Orders</div><div className="text-xl font-black">{myOrders.length}</div></Card>
                     <Card className="p-4"><div className="text-xs text-slate-400 uppercase font-bold">Offers</div><div className="text-xl font-black">{myOffers.length}</div></Card>
                  </div>
               </div>
            )}

            {view === 'offers' && (
               <div className="space-y-6 animate-in slide-in-from-right-4">
                  <h2 className="text-2xl font-bold text-slate-900">My Active Offers</h2>
                  <div className="grid gap-4">
                     {myOffers.map(o => {
                        // Negotiation State
                        const isCounterByFarmer = o.lastActionBy === 'farmer';
                        const currentPrice = isCounterByFarmer ? o.counterPrice : (o.offeredPrice || o.pricePerKg);
                        const currentQty = isCounterByFarmer ? o.counterQuantity : (o.quantityRequested || o.quantity);
                        const listing = listings.find((l: any) => l.id === o.listingId);

                        return (
                        <Card key={o.id} className="p-6 border-slate-200 hover:border-blue-400 transition-colors">
                           <div className="flex justify-between items-center">
                              <div className="flex gap-4 items-center">
                                 <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600"><ShoppingBag className="w-6 h-6" /></div>
                                 <div>
                                    <h4 className="font-bold text-slate-900">{o.cropName}</h4>
                                    <p className="text-sm text-slate-500">₹{currentPrice}/kg • {currentQty}kg</p>
                                    {isCounterByFarmer && <div className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded mt-1 w-fit">Farmer Countered</div>}
                                 </div>
                              </div>
                              <div className="text-right">
                                 <div className="text-lg font-black text-slate-900 mb-1">₹{(currentPrice * currentQty).toLocaleString()}</div>
                                 <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${o.status === 'accepted' ? 'bg-green-100 text-green-700' :
                                    o.status === 'rejected' ? 'bg-red-100 text-red-700' : o.status === 'cancelled' ? 'bg-slate-100 text-slate-500' : 'bg-blue-100 text-blue-700'
                                    }`}>
                                    {o.status === 'cancelled' ? 'Cancelled' : o.status}
                                 </span>
                              </div>
                           </div>
                           
                           {o.status === 'pending' && (
                               <div className="mt-4 pt-4 border-t border-slate-100 flex gap-3 justify-end">
                                   <Button variant="outline" className="text-xs font-bold text-blue-600 hover:bg-blue-50 border-blue-200" onClick={() => onOpenChat(listing?.farmerId || '', listing?.farmerName || '', o.listingId, undefined, o.id)}>
                                       <MessageCircle className="w-4 h-4 mr-2" /> Chat
                                   </Button>
                                   <Button variant="outline" className="text-xs font-bold text-red-500 hover:bg-red-50 hover:text-red-600 border-slate-200" onClick={() => onCancelOffer(o.id)}>Cancel Negotiation</Button>
                                   {isCounterByFarmer && (
                                       <>
                                           <Button variant="outline" className="text-xs font-bold border-slate-200" onClick={() => {
                                               setCounterModal({ open: true, offer: o });
                                               setCounterPrice(o.counterPrice?.toString() || o.pricePerKg.toString());
                                           }}>Counter Back</Button>
                                           <Button className="text-xs font-bold bg-green-600 hover:bg-green-700" onClick={() => onAcceptOffer(o.id)}>Accept Counter</Button>
                                       </>
                                   )}
                               </div>
                           )}
                        </Card>
                     )})}
                     {myOffers.length === 0 && <div className="text-center py-20 text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200">No offers placed yet. Browse the marketplace to start.</div>}
                  </div>
               </div>
            )}

            {view === 'cart' && (
               <div className="space-y-6 animate-in slide-in-from-right-4">
                  <div className="flex items-end justify-between gap-4">
                     <div>
                        <h2 className="text-2xl font-bold text-slate-900">Cart</h2>
                        <p className="text-sm text-slate-500 font-medium">Review items before negotiating or ordering</p>
                     </div>
                     <div className="text-xs font-black text-slate-400 uppercase tracking-widest">Items: {cartCount}</div>
                  </div>

                  {cartItems.length === 0 ? (
                     <div className="text-center py-20 text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200">Your cart is empty. Add crops from the marketplace.</div>
                  ) : (
                     <div className="space-y-4">
                        <div className="grid gap-4">
                           {cartItems.map(ci => {
                              const l = listings.find((x: any) => x.id === ci.listingId);
                              if (!l) return null;
                              const maxQty = Number(l.availableQuantity || l.quantity || 0);
                              const unitTotal = Number(l.pricePerKg || 0) * Number(ci.quantity || 0);
                              return (
                                 <Card key={ci.listingId} className="p-6 border-slate-200 bg-white">
                                    <div className="flex flex-col md:flex-row justify-between gap-4">
                                       <div className="flex gap-4 items-center">
                                          <div className="w-14 h-14 bg-blue-50 rounded-2xl overflow-hidden border border-blue-100">
                                             <img src={l.imageUrls?.[0] || l.imageUrl} alt={l.cropName} className="w-full h-full object-cover" />
                                          </div>
                                          <div className="min-w-0">
                                             <div className="font-black text-slate-900 truncate">{l.cropName}</div>
                                             <div className="text-xs text-slate-500 font-medium truncate">{l.farmerName} • {l.location}</div>
                                             <div className="text-xs text-slate-400 font-bold">₹{l.pricePerKg}/kg</div>
                                          </div>
                                       </div>
                                       <div className="flex flex-col md:items-end gap-3">
                                          <div className="flex items-center gap-2">
                                             <span className="text-xs font-bold text-slate-400">Qty (kg)</span>
                                             <input className="w-24 h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-sm font-bold outline-blue-500" type="number" min={1} max={maxQty} value={ci.quantity} onChange={(e) => {
                                                const next = Math.max(1, Math.min(maxQty || 999999, Number(e.target.value || 1)));
                                                setCartItems(prev => prev.map(i => i.listingId !== ci.listingId ? i : { ...i, quantity: next }));
                                             }} />
                                          </div>
                                          <div className="text-lg font-black text-slate-900">₹{unitTotal.toLocaleString()}</div>
                                          <div className="flex gap-2 flex-wrap justify-end">
                                             <Button variant="outline" className="h-10 text-xs font-black border-slate-200" onClick={() => { setSelectedListing(l); setView('product-details'); }}>View</Button>
                                             <Button className="h-10 text-xs font-black bg-blue-600 hover:bg-blue-700" onClick={() => { setSelectedListing(l); setOfferData({ quantity: ci.quantity, price: l.pricePerKg }); setShowOfferModal(true); }}>Place Offer</Button>
                                             <Button className="h-10 text-xs font-black bg-slate-900 hover:bg-slate-800" onClick={() => handleBuyFromCart(l, ci.quantity)}>Buy Now</Button>
                                             <Button variant="outline" className="h-10 text-xs font-black border-slate-200" onClick={() => removeFromCart(ci.listingId)}><Trash2 className="w-4 h-4" /></Button>
                                          </div>
                                       </div>
                                    </div>
                                 </Card>
                              );
                           })}
                        </div>
                        <Card className="p-6 bg-white border-slate-200">
                           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                              <div>
                                 <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Cart Total</div>
                                 <div className="text-2xl font-black text-slate-900">
                                    ₹{cartItems.reduce((sum, ci) => {
                                       const l = listings.find((x: any) => x.id === ci.listingId);
                                       return sum + (Number(l?.pricePerKg || 0) * Number(ci.quantity || 0));
                                    }, 0).toLocaleString()}
                                 </div>
                              </div>
                              <div className="flex gap-3 flex-wrap">
                                 <Button variant="outline" className="h-12 font-black border-slate-200" onClick={() => setView('home')}>Add More Items</Button>
                                 <Button className="h-12 bg-slate-900 hover:bg-slate-800 font-black" onClick={handleCheckoutCart}>Buy All</Button>
                              </div>
                           </div>
                        </Card>
                     </div>
                  )}
               </div>
            )}

            {view === 'orders' && (
               <div className="space-y-6 animate-in slide-in-from-right-4">
                  <h2 className="text-2xl font-bold text-slate-900">Purchase Orders</h2>
                  <div className="grid gap-6">
                     {myOrders.map(o => {
                        const req = (transportRequests || []).find((r: any) => r.orderId === o.id);
                        const bids = req ? (transportBids || []).filter((b: any) => b.requestId === req.id) : [];
                        return (
                        <Card key={o.id} className="p-6 border-blue-100 bg-white">
                           <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                              <div className="flex gap-4">
                                 <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100"><Truck className="w-7 h-7" /></div>
                                 <div>
                                    <div className="flex items-center gap-3 mb-1">
                                       <h3 className="text-lg font-bold text-slate-900">#{o.id} • {o.cropName}</h3>
                                       <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-black uppercase tracking-widest">{o.status}</span>
                                    </div>
                                    <p className="text-sm text-slate-500 font-medium font-sans">Farmer: {o.farmerName} • Location: {o.farmerLocation}</p>
                                 </div>
                              </div>
                              <div className="text-right">
                                 <div className="text-xl font-black text-slate-900">₹{o.totalAmount.toLocaleString()}</div>
                                 <div className="text-xs text-slate-400 font-bold">{o.quantity} kg @ ₹{o.totalAmount / o.quantity}/kg</div>
                              </div>
                           </div>
                           <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-4">
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                 <div>
                                    <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Transport</div>
                                    {!req && <div className="text-sm font-bold text-slate-800">Not arranged yet</div>}
                                    {req && (
                                       <div className="space-y-1">
                                          <div className="text-sm font-bold text-slate-800">{req.mode.replace('_', ' ')} • {req.status.replace('_', ' ')}</div>
                                          {req.mode === 'marketplace' && (
                                             <div className="text-xs text-slate-500 font-bold">
                                                Vehicle: <span className="text-slate-800">{req.vehicleType}</span> • Base ₹{Number(req.estimatedFare || 0).toLocaleString()}
                                                {req.finalFare != null ? <> • Final ₹{Number(req.finalFare || 0).toLocaleString()}</> : null}
                                             </div>
                                          )}
                                          {req.mode === 'marketplace' && (
                                             <div className="text-xs text-slate-500">
                                                Payment: <span className="font-black text-slate-800">{(req.transportPaymentStatus || 'unpaid').toString()}</span>
                                             </div>
                                          )}
                                          {req?.deliveryOtp && req.status !== 'delivered' && req.status !== 'open' && (
                                             <div className="text-xs text-slate-500">Delivery OTP: <span className="font-black text-slate-800">{req.deliveryOtp}</span></div>
                                          )}
                                       </div>
                                    )}
                                 </div>
                                 {!req && (
                                    <Button className="h-10 bg-blue-600 hover:bg-blue-700 text-xs font-black" onClick={() => { setTransportStep('mode'); setTransportOrderId(o.id); setShowTransportModal(true); }}>Arrange Transport</Button>
                                 )}
                              </div>
                              {req && req.mode === 'marketplace' && req.status === 'open' && (
                                 <div className="mt-4 space-y-2">
                                    <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Transporter Offers</div>
                                    <div className="flex items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                                       <div className="text-xs font-black text-slate-700">Your Offer: ₹{Number(req.estimatedFare || 0).toLocaleString()}</div>
                                       <Button variant="outline" className="h-9 text-xs font-black border-slate-200" onClick={() => {
                                          setTransportPriceValue(String(req.estimatedFare || 0))
                                          setTransportPriceModal({ open: true, type: 'edit_offer', requestId: req.id })
                                       }}>Edit</Button>
                                    </div>
                                    {bids.length === 0 && <div className="text-xs text-slate-500">Waiting for transporter bids...</div>}
                                    {bids.length > 0 && (
                                       <div className="grid md:grid-cols-2 gap-2">
                                          {bids.map((b: any) => (
                                             <div key={b.id} className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                                                <div className="min-w-0">
                                                   <div className="text-sm font-black text-slate-900">
                                                      ₹{Number((b.counterAmount != null ? b.counterAmount : b.amount) || 0).toLocaleString()}
                                                   </div>
                                                   <div className="text-[10px] text-slate-400 font-bold truncate">
                                                      {b.status}{b.lastActionBy ? ` • last: ${b.lastActionBy}` : ''}
                                                   </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                   <Button
                                                      variant="outline"
                                                      className="h-9 text-xs font-black border-slate-200"
                                                      onClick={() => {
                                                         setTransportPriceValue(String(b.amount || req.estimatedFare || 0))
                                                         setTransportPriceModal({ open: true, type: 'counter_bid', bidId: b.id })
                                                      }}
                                                   >
                                                      Counter
                                                   </Button>
                                                   <Button
                                                      className="h-9 text-xs font-black bg-blue-600 hover:bg-blue-700"
                                                      disabled={b.status !== 'pending' || b.lastActionBy === 'buyer'}
                                                      onClick={() => onAcceptTransportBid?.(b.id)}
                                                   >
                                                      Accept
                                                   </Button>
                                                </div>
                                             </div>
                                          ))}
                                       </div>
                                    )}
                                 </div>
                              )}
                           </div>
                           <div className="pt-4 border-t border-slate-50">
                              <div className="flex justify-between items-center mb-4">
                                 <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                    <Calendar className="w-4 h-4" /> Ordered on {new Date(o.date).toLocaleDateString()}
                                 </div>
                                 <div className="flex gap-2">
                                    <Button variant="ghost" className="h-8 text-xs font-bold" onClick={() => onViewInvoice(o)}><FileText className="w-3 h-3 mr-1" /> Invoice</Button>
                                    <Button variant="outline" className="h-8 text-xs font-bold text-blue-600 border-blue-100 hover:bg-blue-50">Track Shipment</Button>
                                 </div>
                              </div>
                              <div className="relative px-2 pb-2">
                                 <div className="absolute top-1.5 left-0 right-0 h-0.5 bg-slate-100 -z-10" />
                                 <div className="absolute top-1.5 left-0 h-0.5 bg-blue-600 -z-10 transition-all duration-1000" style={{ width: o.status === 'delivered' ? '100%' : ['in_transit', 'picked_up'].includes(o.status) ? '50%' : '5%' }} />
                                 <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    <div className={`flex flex-col items-center gap-2 ${o.status !== 'cancelled' ? 'text-blue-600' : ''}`}><div className={`w-3 h-3 rounded-full ${o.status !== 'cancelled' ? 'bg-blue-600' : 'bg-slate-200'}`} />Confirmed</div>
                                    <div className={`flex flex-col items-center gap-2 ${['in_transit', 'delivered', 'picked_up'].includes(o.status) ? 'text-blue-600' : ''}`}><div className={`w-3 h-3 rounded-full ${['in_transit', 'delivered', 'picked_up'].includes(o.status) ? 'bg-blue-600' : 'bg-slate-200'}`} />In Transit</div>
                                    <div className={`flex flex-col items-center gap-2 ${o.status === 'delivered' ? 'text-blue-600' : ''}`}><div className={`w-3 h-3 rounded-full ${o.status === 'delivered' ? 'bg-blue-600' : 'bg-slate-200'}`} />Delivered</div>
                                 </div>
                              </div>
                           </div>
                        </Card>
                     )})}
                     {myOrders.length === 0 && <div className="text-center py-20 text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200">No active orders. Finalize a deal to see them here.</div>}
                  </div>
               </div>
            )}

            {view === 'messages' && (
               <div className="space-y-6 animate-in slide-in-from-right-4">
                  <h2 className="text-2xl font-bold text-slate-900">Messages</h2>
                  <Card className="p-6">
                     <div className="grid md:grid-cols-3 gap-6">
                        <div className="md:col-span-1 space-y-2">
                           <div className="text-xs font-black uppercase text-slate-400">Recent</div>
                           <div className="space-y-2">
                              {(messages || []).filter(m => m.fromUserId === user.id || m.toUserId === user.id).slice(0, 10).map(m => (
                                 <div key={m.id} className="p-3 bg-slate-50 rounded-xl">
                                    <div className="text-xs text-slate-400">{new Date(m.timestamp).toLocaleString()}</div>
                                    <div className="text-sm font-medium text-slate-800">{m.text}</div>
                                 </div>
                              ))}
                              {(messages || []).filter(m => m.fromUserId === user.id || m.toUserId === user.id).length === 0 && <div className="text-xs text-slate-400">No messages yet.</div>}
                           </div>
                        </div>
                        <div className="md:col-span-2 space-y-3">
                           <div className="text-xs font-black uppercase text-slate-400">New Message</div>
                           <select className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-medium outline-blue-500" id="b-msg-recipient">
                              {myOrders.map(o => <option key={o.id} value={o.farmerName}>{o.farmerName}</option>)}
                           </select>
                           <Input id="b-msg-text" placeholder="Type your message" />
                           <Button className="w-full md:w-auto" onClick={() => {
                              const select = document.getElementById('b-msg-recipient') as HTMLSelectElement;
                              const textEl = document.getElementById('b-msg-text') as HTMLInputElement;
                              const toName = select?.value;
                              const text = textEl?.value || '';
                              if (!text) return;
                              const toUserId = (toName && allUsers.find(u => u.profile?.fullName === toName)?.id) || (allUsers.find(u => u.role === 'farmer')?.id || '');
                              onSendMessage?.({ toUserId, text });
                              if (textEl) textEl.value = '';
                           }}>Send</Button>
                        </div>
                     </div>
                  </Card>
               </div>
            )}

            {view === 'addresses' && (
               <div className="space-y-6 animate-in slide-in-from-right-4">
                  <h2 className="text-2xl font-bold text-slate-900">Addresses</h2>
                  <Card className="p-6 space-y-4">
                     <div className="grid md:grid-cols-2 gap-4">
                        <Input label="Label" placeholder="Warehouse / Billing" onChange={e => setProfileData({ ...profileData, addresses: [{ ...(profileData.addresses?.[0] || { line1: '' }), label: e.target.value }] })} />
                        <Input label="Contact Name" onChange={e => setProfileData({ ...profileData, addresses: [{ ...(profileData.addresses?.[0] || { line1: '' }), contactName: e.target.value }] })} />
                     </div>
                     <Input label="Phone" onChange={e => setProfileData({ ...profileData, addresses: [{ ...(profileData.addresses?.[0] || { line1: '' }), phone: e.target.value }] })} />
                     <Input label="Address Line" onChange={e => setProfileData({ ...profileData, addresses: [{ ...(profileData.addresses?.[0] || { line1: '' }), line1: e.target.value }] })} />
                     <div className="grid md:grid-cols-3 gap-4">
                        <Input label="City/District" onChange={e => setProfileData({ ...profileData, addresses: [{ ...(profileData.addresses?.[0] || { line1: '' }), district: e.target.value }] })} />
                        <Input label="State" onChange={e => setProfileData({ ...profileData, addresses: [{ ...(profileData.addresses?.[0] || { line1: '' }), state: e.target.value }] })} />
                        <Input label="PIN Code" onChange={e => setProfileData({ ...profileData, addresses: [{ ...(profileData.addresses?.[0] || { line1: '' }), pincode: e.target.value }] })} />
                     </div>
                     <div className="flex gap-2">
                        <Button className="bg-blue-600" onClick={() => onUpdateProfile(user.id, profileData)}>Save Address</Button>
                        <Button variant="ghost" onClick={() => setProfileData({ ...profileData, addresses: [] })}>Clear</Button>
                     </div>
                  </Card>
               </div>
            )}
            {view === 'more' && (
               <div className="space-y-6 animate-in slide-in-from-right-4">
                  <h2 className="text-2xl font-bold text-slate-900">Pro Features</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                     {[
                        { title: 'RFQ / Quotation', desc: 'Request quotes and compare' },
                        { title: 'Shortlists', desc: 'Save listings and watch for changes' },
                        { title: 'Quality Assurance', desc: 'Inspection and lab reports' },
                        { title: 'Procurement Planning', desc: 'Budgets and cadence' },
                        { title: 'Contracts', desc: 'Agreements and SLAs' },
                        { title: 'Payments', desc: 'Escrow, milestones and invoices' },
                        { title: 'Vendor Performance', desc: 'Supplier scorecards' },
                        { title: 'Team Workflows', desc: 'Roles and approvals' },
                        { title: 'Analytics', desc: 'Spend and forecasts' }
                     ].map((f, i) => (
                        <Card key={i} className="p-5">
                           <h4 className="font-bold text-slate-900">{f.title}</h4>
                           <p className="text-sm text-slate-600">{f.desc}</p>
                           <div className="mt-3"><Button variant="outline" className="text-xs">Coming Soon</Button></div>
                        </Card>
                     ))}
                  </div>
               </div>
            )}

            {view === 'profile' && (
               <div className="space-y-6 animate-in slide-in-from-right-4">
                  <div className="flex flex-col md:flex-row gap-6">
                     {/* Sidebar for Profile */}
                     <Card className="w-full md:w-80 p-6 h-fit text-center">
                        <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto flex items-center justify-center text-blue-600 mb-4 text-3xl font-black">
                           {user.profile.fullName.charAt(0)}
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">{user.profile.fullName}</h2>
                        <p className="text-sm text-slate-500 mb-6">{user.profile.city}, {user.profile.state}</p>

                        <div className="grid grid-cols-2 gap-4 mb-6 text-left">
                           <div className="p-3 bg-slate-50 rounded-xl">
                              <div className="text-xs text-slate-400 font-bold uppercase">Member Since</div>
                              <div className="font-bold text-slate-700">2023</div>
                           </div>
                           <div className="p-3 bg-slate-50 rounded-xl">
                              <div className="text-xs text-slate-400 font-bold uppercase">Deals Done</div>
                              <div className="font-bold text-slate-700">{myOrders.length + myOffers.length}</div>
                           </div>
                        </div>

                        <div className="flex flex-col gap-2">
                           <Button
                              variant={profileTab === 'overview' ? 'default' : 'ghost'}
                              className={profileTab === 'overview' ? 'bg-blue-600' : ''}
                              onClick={() => setProfileTab('overview')}
                           >
                              Overview
                           </Button>
                           <Button
                              variant={profileTab === 'edit' ? 'default' : 'ghost'}
                              className={profileTab === 'edit' ? 'bg-blue-600' : ''}
                              onClick={() => setProfileTab('edit')}
                           >
                              Edit Profile
                           </Button>
                        </div>
                     </Card>

                     {/* Main Profile Content */}
                     <div className="flex-1">
                        {profileTab === 'overview' ? (
                           <div className="space-y-6">
                              <Card className="p-6">
                                 <h3 className="text-lg font-bold text-slate-900 mb-4">Business Details</h3>
                                 <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                       <label className="text-xs font-bold text-slate-400 uppercase">Business Name</label>
                                       <p className="font-medium text-slate-700">{profileData.businessName || 'Not set'}</p>
                                    </div>
                                    <div>
                                       <label className="text-xs font-bold text-slate-400 uppercase">GST Number</label>
                                       <p className="font-medium text-slate-700">{profileData.gstNumber || 'Not set'}</p>
                                    </div>
                                    <div>
                                       <label className="text-xs font-bold text-slate-400 uppercase">Buyer Type</label>
                                       <p className="font-medium text-slate-700">{profileData.buyerType || 'Individual Trader'}</p>
                                    </div>
                                    <div>
                                       <label className="text-xs font-bold text-slate-400 uppercase">Language</label>
                                       <p className="font-medium text-slate-700">{profileData.language}</p>
                                    </div>
                                 </div>
                              </Card>
                              <Card className="p-6">
                                 <h3 className="text-lg font-bold text-slate-900 mb-4">Procurement Preferences</h3>
                                 <div className="space-y-4">
                                    <div>
                                       <label className="text-xs font-bold text-slate-400 uppercase">Preferred Crops</label>
                                       <div className="flex gap-2 mt-2 flex-wrap">
                                          {['Wheat', 'Rice', 'Soybean', 'Maize'].map(c => (
                                             <span key={c} className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold">{c}</span>
                                          ))}
                                       </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                       <div>
                                          <label className="text-xs font-bold text-slate-400 uppercase">Quality Preference</label>
                                          <p className="font-medium text-slate-700">Premium Grade A</p>
                                       </div>
                                       <div>
                                          <label className="text-xs font-bold text-slate-400 uppercase">Purchase Frequency</label>
                                          <p className="font-medium text-slate-700">Weekly</p>
                                       </div>
                                    </div>
                                 </div>
                              </Card>
                           </div>
                        ) : (
                           <Card className="p-6">
                              <h3 className="text-lg font-bold text-slate-900 mb-6">Edit Profile</h3>
                              <div className="space-y-4">
                                 <div className="grid md:grid-cols-2 gap-4">
                                    <Input label="Full Name" value={profileData.fullName} onChange={e => setProfileData({ ...profileData, fullName: e.target.value })} />
                                    <Input label="Business Name" value={profileData.businessName || ''} onChange={e => setProfileData({ ...profileData, businessName: e.target.value })} placeholder="Enter business name" />
                                 </div>
                                 <div className="grid md:grid-cols-2 gap-4">
                                    <Input label="City" value={profileData.city} onChange={e => setProfileData({ ...profileData, city: e.target.value })} />
                                    <Input label="State" value={profileData.state} onChange={e => setProfileData({ ...profileData, state: e.target.value })} />
                                 </div>
                                 <div className="grid md:grid-cols-2 gap-4">
                                    <Input label="GST Number" value={profileData.gstNumber || ''} onChange={e => setProfileData({ ...profileData, gstNumber: e.target.value })} placeholder="Optional" />
                                    <div className="space-y-1">
                                       <label className="text-sm font-bold text-slate-700">Buyer Type</label>
                                       <select
                                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                          value={profileData.buyerType}
                                          onChange={e => setProfileData({ ...profileData, buyerType: e.target.value as any })}
                                       >
                                          <option>Wholesaler</option>
                                          <option>Retailer</option>
                                          <option>Individual Trader</option>
                                          <option>Processor</option>
                                       </select>
                                    </div>
                                 </div>
                                 <div className="pt-4 flex gap-3">
                                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={() => { onUpdateProfile(profileData); setProfileTab('overview'); }}>Save Changes</Button>
                                    <Button variant="ghost" onClick={() => setProfileTab('overview')}>Cancel</Button>
                                 </div>
                              </div>
                           </Card>
                        )}
                     </div>
                  </div>
               </div>
            )}

            {/* ===== NOTIFICATIONS VIEW ===== */}
            {view === 'notifications' && (
               <div className="space-y-6 animate-in slide-in-from-right-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                     <div><h2 className="text-2xl font-black text-slate-900">Notifications</h2><p className="text-slate-500">Updates on your offers and orders.</p></div>
                     <div className="flex gap-2 flex-wrap">
                        {(['all', 'unread', 'offer', 'order'] as const).map(filter => (<button key={filter} onClick={() => setNotificationFilter(filter)} className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${notificationFilter === filter ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}>{filter === 'all' ? 'All' : filter === 'unread' ? 'Unread' : filter === 'offer' ? 'Offers' : 'Orders'}</button>))}
                     </div>
                  </div>
                  <Card className="overflow-hidden">
                     <div className="divide-y divide-slate-100">
                        {notifications.map(n => (
                           <div key={n.id} className={`p-4 flex items-start gap-4 hover:bg-slate-50 transition-colors cursor-pointer ${!n.isRead ? 'bg-blue-50/50' : ''}`} onClick={() => setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, isRead: true } : x))}>
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${n.type === 'offer' ? 'bg-blue-100 text-blue-600' : n.type === 'order' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-600'}`}>
                                 {n.type === 'offer' ? <ShoppingBag className="w-5 h-5" /> : n.type === 'order' ? <Truck className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                 <div className="flex items-center gap-2"><h4 className="font-bold text-slate-900 truncate">{n.title}</h4>{!n.isRead && <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>}</div>
                                 <p className="text-sm text-slate-600 line-clamp-2">{n.message}</p><span className="text-xs text-slate-400 mt-1 block">{n.timestamp}</span>
                              </div>
                           </div>
                        ))}
                     </div>
                  </Card>
               </div>
            )}

            {/* ===== HELP VIEW ===== */}
            {view === 'help' && (
               <div className="space-y-6 animate-in slide-in-from-right-4">
                  <div><h2 className="text-2xl font-black text-slate-900">Help & Support</h2><p className="text-slate-500">We are here to assist you.</p></div>
                  <div className="grid md:grid-cols-3 gap-4">
                     <Card className="p-5 hover:shadow-lg transition-shadow cursor-pointer text-center"><Phone className="w-8 h-8 text-blue-600 mx-auto mb-3" /><h4 className="font-bold text-slate-900">Support Line</h4><span className="text-blue-600 font-bold">1800-KISAN-BUYER</span></Card>
                     <Card className="p-5 hover:shadow-lg transition-shadow cursor-pointer text-center"><Mail className="w-8 h-8 text-blue-600 mx-auto mb-3" /><h4 className="font-bold text-slate-900">Email Support</h4><span className="text-blue-600 font-bold">buyers@kisansetu.in</span></Card>
                     <Card className="p-5 hover:shadow-lg transition-shadow cursor-pointer text-center"><MessageCircle className="w-8 h-8 text-blue-600 mx-auto mb-3" /><h4 className="font-bold text-slate-900">Live Chat</h4><span className="text-blue-600 font-bold">Start Chat</span></Card>
                  </div>
                  <Card className="p-6"><h3 className="font-bold text-slate-800 mb-4">Frequently Asked Questions</h3><div className="space-y-2">{[{ q: 'How do I pay for orders?', a: 'Payments are held in escrow until delivery is confirmed.' }, { q: 'Can I cancel an offer?', a: 'Yes, you can cancel any pending offer from the "My Offers" tab.' }].map((faq, i) => (<div key={i} className="p-4 bg-slate-50 rounded-xl"><h5 className="font-bold text-slate-900 text-sm mb-1">{faq.q}</h5><p className="text-sm text-slate-600">{faq.a}</p></div>))}</div></Card>
               </div>
            )}

            {/* ===== SETTINGS VIEW ===== */}
            {view === 'settings' && (
               <div className="space-y-6 animate-in slide-in-from-right-4">
                  <div><h2 className="text-2xl font-black text-slate-900">Settings</h2><p className="text-slate-500">Manage account preferences.</p></div>
                  <Card className="p-0 overflow-hidden">
                     <div className="p-4 border-b border-slate-100 bg-slate-50 font-bold text-slate-800">Notifications</div>
                     <div className="p-4 space-y-4">
                        {['notifyOrders', 'notifyOffers', 'notifyNewListings'].map(key => (
                           <div key={key} className="flex items-center justify-between p-2">
                              <span className="font-medium text-slate-700 capitalize">{key.replace('notify', '').replace(/([A-Z])/g, ' $1').trim()}</span>
                              <button onClick={() => setSettingsData(prev => ({ ...prev, [key]: !prev[key] }))} className={`w-12 h-7 rounded-full transition-colors relative ${settingsData[key] ? 'bg-blue-600' : 'bg-slate-300'}`}><span className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${settingsData[key] ? 'translate-x-6' : 'translate-x-1'}`}></span></button>
                           </div>
                        ))}
                     </div>
                  </Card>
               </div>
            )}
            </div>
         </main>



         {/* Counter Offer Modal */}
         {counterModal.open && counterModal.offer && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
               <Card className="w-full max-w-md shadow-2xl relative bg-white p-6">
                  <h3 className="text-xl font-bold mb-4">Counter Offer</h3>
                  <div className="space-y-4">
                     <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Price per kg (₹)</label>
                        <Input
                           type="number"
                           value={counterPrice}
                           onChange={e => setCounterPrice(e.target.value)}
                           className="font-bold text-lg"
                        />
                        <p className="text-xs text-slate-400 mt-1">Farmer asked: ₹{counterModal.offer.counterPrice}</p>
                     </div>
                     <div className="flex gap-3">
                        <Button variant="outline" className="flex-1" onClick={() => setCounterModal({ open: false, offer: null })}>Cancel</Button>
                        <Button className="flex-1 bg-blue-600 hover:bg-blue-700 font-bold" onClick={() => {
                            onCounterOffer(counterModal.offer.id, Number(counterPrice), counterModal.offer.quantityRequested || counterModal.offer.quantity, 'buyer');
                            setCounterModal({ open: false, offer: null });
                        }}>Send Counter</Button>
                     </div>
                  </div>
               </Card>
            </div>
         )}

         {transportPriceModal.open && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
               <Card className="w-full max-w-md p-8 shadow-2xl relative overflow-hidden bg-white">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-900" />
                  <button onClick={() => { setTransportPriceModal(prev => ({ ...prev, open: false })); }} className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-900 transition-all"><X className="w-5 h-5" /></button>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{transportPriceModal.type === 'counter_bid' ? 'Counter Transport Price' : 'Set Transport Offer'}</h3>
                  <p className="text-sm text-slate-500 mb-8 border-b border-slate-100 pb-4">Enter amount in ₹</p>
                  <div className="space-y-6">
                     <Input
                        label="Amount (₹)"
                        type="number"
                        value={transportPriceValue}
                        onChange={e => setTransportPriceValue(e.target.value)}
                     />
                     <div className="flex gap-3">
                        <Button variant="ghost" className="flex-1" onClick={() => setTransportPriceModal(prev => ({ ...prev, open: false }))}>Cancel</Button>
                        <Button className="flex-[2] bg-slate-900 hover:bg-slate-800 shadow-xl shadow-slate-900/15 font-bold" onClick={async () => {
                           const n = Number(transportPriceValue)
                           if (!Number.isFinite(n) || n <= 0) return
                           if (transportPriceModal.type === 'vehicle_offer') {
                              const orderId = transportPriceModal.orderId
                              const vehicleType = transportPriceModal.vehicleType
                              if (!orderId || !vehicleType) return
                              await onCreateTransportRequest?.(orderId, 'marketplace', { vehicleType, estimatedFare: n })
                              setTransportPriceModal(prev => ({ ...prev, open: false }))
                              setShowTransportModal(false)
                              setTransportStep('mode')
                              return
                           }
                           if (transportPriceModal.type === 'edit_offer') {
                              const requestId = transportPriceModal.requestId
                              if (!requestId) return
                              await onUpdateTransportRequest?.(requestId, { estimatedFare: n })
                              setTransportPriceModal(prev => ({ ...prev, open: false }))
                              return
                           }
                           if (transportPriceModal.type === 'counter_bid') {
                              const bidId = transportPriceModal.bidId
                              if (!bidId) return
                              onCounterTransportBid?.(bidId, n, 'buyer')
                              setTransportPriceModal(prev => ({ ...prev, open: false }))
                              return
                           }
                        }}>Confirm</Button>
                     </div>
                  </div>
               </Card>
            </div>
         )}

         {showBuyModal && selectedListing && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
               <Card className="w-full max-w-md p-8 shadow-2xl relative overflow-hidden bg-white">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-900" />
                  <button onClick={() => setShowBuyModal(false)} className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-900 transition-all"><X className="w-5 h-5" /></button>

                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Buy Now</h3>
                  <p className="text-sm text-slate-500 mb-8 border-b border-slate-100 pb-4">Confirm quantity for <span className="text-slate-900 font-bold">{selectedListing.cropName}</span></p>

                  <div className="space-y-6">
                     <Input
                        label="Quantity (kg)"
                        type="number"
                        value={buyQuantity}
                        onChange={e => setBuyQuantity(Math.max(1, Number(e.target.value)))}
                        max={selectedListing.availableQuantity || selectedListing.quantity}
                     />
                     <div className="p-5 bg-slate-900/5 rounded-2xl border border-slate-200 flex justify-between items-center">
                        <div className="text-sm font-bold text-slate-700">Total</div>
                        <div className="text-2xl font-black text-slate-900 font-display">₹{(Number(selectedListing.pricePerKg || 0) * Number(buyQuantity || 0)).toLocaleString()}</div>
                     </div>
                     <div className="flex gap-3">
                        <Button variant="ghost" className="flex-1" onClick={() => setShowBuyModal(false)}>Cancel</Button>
                        <Button className="flex-[2] bg-slate-900 hover:bg-slate-800 shadow-xl shadow-slate-900/15 font-bold" onClick={handleBuyNowSubmit}>Place Order</Button>
                     </div>
                  </div>
               </Card>
            </div>
         )}

         {/* Place Offer Modal */}
         {showOfferModal && selectedListing && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
               <Card className="w-full max-w-md p-8 shadow-2xl relative overflow-hidden bg-white">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600" />
                  <button onClick={() => setShowOfferModal(false)} className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-900 transition-all"><X className="w-5 h-5" /></button>

                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Place Your Offer</h3>
                  <p className="text-sm text-slate-500 mb-8 border-b border-slate-100 pb-4">Negotiate quantity and price for <span className="text-slate-900 font-bold">{selectedListing.cropName}</span></p>

                  <div className="space-y-6">
                     <div className="grid grid-cols-2 gap-4">
                        <Input
                           label="Quantity (kg)"
                           type="number"
                           value={offerData.quantity}
                           onChange={e => setOfferData({ ...offerData, quantity: Number(e.target.value) })}
                           max={selectedListing.availableQuantity || selectedListing.quantity}
                        />
                        <Input
                           label="Price (₹/kg)"
                           type="number"
                           value={offerData.price}
                           onChange={e => setOfferData({ ...offerData, price: Number(e.target.value) })}
                        />
                     </div>
                     <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100 flex justify-between items-center">
                        <div className="text-sm font-bold text-blue-800">Total Offer Value</div>
                        <div className="text-2xl font-black text-blue-900 font-display">₹{(offerData.price * offerData.quantity).toLocaleString()}</div>
                     </div>
                     <div className="flex gap-3">
                        <Button variant="ghost" className="flex-1" onClick={() => setShowOfferModal(false)}>Cancel</Button>
                        <Button className="flex-[2] bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-600/20 font-bold" onClick={handlePlaceOfferSubmit}>Send Negotiable Offer</Button>
                     </div>
                  </div>
               </Card>
            </div>
         )}

         {showTransportModal && transportOrderId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
               <Card className="w-full max-w-lg p-8 shadow-2xl relative overflow-hidden bg-white">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600" />
                  <button onClick={() => { setTransportStep('mode'); setShowTransportModal(false); }} className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-900 transition-all"><X className="w-5 h-5" /></button>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{transportStep === 'vehicle' ? 'Choose Vehicle' : 'Arrange Transport'}</h3>
                  <p className="text-sm text-slate-500 mb-8 border-b border-slate-100 pb-4">
                     {transportStep === 'vehicle'
                        ? <>Select vehicle type for <span className="text-slate-900 font-bold">Order #{transportOrderId}</span></>
                        : <>Choose how you want transport for <span className="text-slate-900 font-bold">Order #{transportOrderId}</span></>}
                  </p>

                  {transportStep === 'mode' && (
                     <div className="grid md:grid-cols-3 gap-3">
                        <Button className="h-12 bg-slate-900 hover:bg-slate-800 font-bold" onClick={() => { onCreateTransportRequest?.(transportOrderId, 'farmer_arranged'); setShowTransportModal(false); setTransportStep('mode'); }}>Farmer Arranged</Button>
                        <Button className="h-12 bg-blue-600 hover:bg-blue-700 font-bold" onClick={() => { setTransportStep('vehicle'); }}>Marketplace</Button>
                        <Button variant="outline" className="h-12 font-bold border-slate-200" onClick={() => { onCreateTransportRequest?.(transportOrderId, 'buyer_own'); setShowTransportModal(false); setTransportStep('mode'); }}>I Will Arrange</Button>
                     </div>
                  )}

                  {transportStep === 'vehicle' && (() => {
                     const order = (orders || []).find((o: any) => o.id === transportOrderId)
                     const distanceKm = Number(order?.distanceKm || 45)
                     const weightKg = Number(order?.quantity || 0)
                     const vehicleTypes: TransportRequest['vehicleType'][] = ['Bike', 'Auto', 'Mini Truck', 'Pickup', 'Truck']
                     const eligibleCount = vehicleTypes.filter(vt => getVehicleCapacityKg(vt) >= weightKg).length
                     return (
                        <div className="space-y-4">
                           <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700">
                              Required load: {Number(weightKg || 0).toLocaleString()} kg
                           </div>
                           {eligibleCount === 0 && (
                              <div className="p-4 bg-red-50 rounded-2xl border border-red-100 text-xs font-black text-red-700">
                                 No vehicle can carry this load. Reduce quantity or use multiple trips.
                              </div>
                           )}
                           <div className="grid sm:grid-cols-2 gap-3">
                              {vehicleTypes.map(vt => {
                                 const cap = getVehicleCapacityKg(vt)
                                 const eligible = cap >= weightKg
                                 const base = estimateTransportFare(distanceKm, vt)
                                 return (
                                    <button
                                       key={vt}
                                       type="button"
                                       className={`p-5 rounded-2xl border text-left transition-all ${eligible ? 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-lg' : 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed'}`}
                                       disabled={!eligible}
                                       onClick={() => {
                                          if (!eligible) return
                                          setTransportPriceValue(String(base))
                                          setTransportPriceModal({ open: true, type: 'vehicle_offer', orderId: transportOrderId, vehicleType: vt, baseFare: base })
                                       }}
                                    >
                                       <div className="flex items-start justify-between gap-3">
                                          <div>
                                             <div className="text-xs font-black uppercase tracking-widest text-slate-400">Vehicle</div>
                                             <div className="text-lg font-black text-slate-900">{vt}</div>
                                             <div className="text-xs text-slate-500 font-bold mt-1">Max {cap.toLocaleString()} kg</div>
                                          </div>
                                          <div className="text-right">
                                             <div className="text-xs font-black uppercase tracking-widest text-slate-400">Base Fare</div>
                                             <div className="text-xl font-black text-blue-600">₹{base.toLocaleString()}</div>
                                             <div className="text-[10px] text-slate-500 font-bold">{distanceKm} KM est.</div>
                                          </div>
                                       </div>
                                       {!eligible && <div className="mt-3 text-[10px] font-black uppercase tracking-widest text-red-600">Not enough capacity</div>}
                                    </button>
                                 )
                              })}
                           </div>
                           <div className="flex gap-3">
                              <Button variant="outline" className="flex-1 h-12 font-black border-slate-200" onClick={() => setTransportStep('mode')}>Back</Button>
                           </div>
                        </div>
                     )
                  })()}
               </Card>
            </div>
         )}
      </div>
   );
};

const TransporterDashboard = ({ user, orders, messages, routePlans, transportRequests, transportBids, allUsers, onAddRoutePlan, onSendMessage, onLogout, onUpdateOrderStatus, onUpdateProfile, onRaiseDispute, onAddTransportBid, onUpdateTransportRequestStatus, onCounterTransportBid, onTransporterAcceptBuyerCounter, onOpenChat }: any) => {
   const [view, setView] = useState('home');

   // Vehicle & Profile State
   const [vehicleData, setVehicleData] = useState({ type: user.profile?.vehicleType || 'Mini Truck', number: user.profile?.vehicleNumber || '', capacity: user.profile?.maxCapacity || '', available: true });
   const [profileData, setProfileData] = useState<TransporterProfile>(user.profile || {
      fullName: user.phone,
      vehicleType: 'Mini Truck',
      maxCapacity: '2000',
      approvalStatus: 'pending',
      businessName: '',
      gstin: '',
      pan: '',
      bankDetails: { accountNumber: '', ifsc: '', holderName: '', bankName: '' },
      documents: {
         license: { number: '', status: 'pending' },
         rc: { number: '', status: 'pending' },
         insurance: { number: '', status: 'pending' }
      }
   });
   const [profileTab, setProfileTab] = useState<'overview' | 'edit'>('overview');
   const [editSection, setEditSection] = useState<'personal' | 'business' | 'bank' | 'vehicle' | 'docs'>('personal');

   // Load Board State
   const [loadFilter, setLoadFilter] = useState<'all' | 'local' | 'inter-city'>('all');

   // Notifications State
   const [notifications, setNotifications] = useState<any[]>([]);
   const [notificationFilter, setNotificationFilter] = useState<'all' | 'unread' | 'job'>('all');

   // Help & Support State
   const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
   const [supportForm, setSupportForm] = useState({ name: user.profile?.fullName || '', email: '', issue: '' });

   // Settings State
   const [settingsData, setSettingsData] = useState({
      notifyJobs: true,
      notifyPayments: true,
      language: user.profile?.language || 'English',
      locationSharing: true
   });

   const [issueModalOpen, setIssueModalOpen] = useState(false);
   const [issueOrderId, setIssueOrderId] = useState<string | null>(null);
   const [issueText, setIssueText] = useState('');

   const [transportNumberModal, setTransportNumberModal] = useState<{ open: boolean; type: 'bid' | 'counter'; requestId?: string; bidId?: string; title: string }>({ open: false, type: 'bid', title: '' });
   const [transportNumberValue, setTransportNumberValue] = useState('');
   const [otpModal, setOtpModal] = useState<{ open: boolean; requestId: string; nextStatus: 'picked_up' | 'delivered' }>({ open: false, requestId: '', nextStatus: 'picked_up' });
   const [otpValue, setOtpValue] = useState('');

   // Add Vehicle State
   const [showAddVehicle, setShowAddVehicle] = useState(false);
   const [isEditingVehicle, setIsEditingVehicle] = useState(false);
   const [tempVehicle, setTempVehicle] = useState<Partial<Vehicle>>({ status: 'active' });

   const handleImageUpload = (file: File, callback: (base64: string) => void) => {
       if (!file) return;
       const reader = new FileReader();
       reader.onload = (e) => {
           const img = new Image();
           img.onload = () => {
               const canvas = document.createElement('canvas');
               const ctx = canvas.getContext('2d');
               const maxSize = 800;
               let width = img.width;
               let height = img.height;
               if (width > height) {
                   if (width > maxSize) {
                       height *= maxSize / width;
                       width = maxSize;
                   }
               } else {
                   if (height > maxSize) {
                       width *= maxSize / height;
                       height = maxSize;
                   }
               }
               canvas.width = width;
               canvas.height = height;
               ctx?.drawImage(img, 0, 0, width, height);
               const compressed = canvas.toDataURL('image/jpeg', 0.7);
               callback(compressed);
           };
           img.src = e.target?.result as string;
       };
       reader.readAsDataURL(file);
   };

   const normalizeVehicleType = (t: string): TransportRequest['vehicleType'] | null => {
      const s = (t || '').toLowerCase();
      if (s.includes('bike')) return 'Bike';
      if (s.includes('auto')) return 'Auto';
      if (s.includes('mini')) return 'Mini Truck';
      if (s.includes('pickup')) return 'Pickup';
      if (s.includes('truck') || s.includes('large')) return 'Truck';
      return null;
   };

   const vehicleRank = (t: TransportRequest['vehicleType']) =>
      t === 'Bike' ? 1 : t === 'Auto' ? 2 : t === 'Mini Truck' ? 3 : t === 'Pickup' ? 4 : 5;

   const getActiveVehicles = () => {
      const fromArray = (profileData.vehicles || []).filter(v => (v.status || 'active') === 'active');
      if (fromArray.length > 0) return fromArray;
      const fallbackType = normalizeVehicleType(profileData.vehicleType);
      const fallbackCap = Number(profileData.maxCapacity || 0);
      if (!fallbackType || !Number.isFinite(fallbackCap) || fallbackCap <= 0) return [];
      return [{ id: 'fallback', type: fallbackType, number: profileData.vehicleNumber || '', capacity: String(fallbackCap), status: 'active' as const }];
   };

   const matchesVehicle = (r: TransportRequest) => {
      const vehicles = getActiveVehicles();
      if (vehicles.length === 0) return false;
      const weight = Number(r.weightKg || 0);
      return vehicles.some(v => {
         const vt = normalizeVehicleType(v.type);
         if (!vt) return false;
         const cap = Number(v.capacity || 0);
         if (!Number.isFinite(cap) || cap <= 0) return false;
         return vt === r.vehicleType && cap >= weight;
      });
   };

   const availableJobs = (transportRequests || []).filter((r: any) =>
      r.mode === 'marketplace' &&
      r.status === 'open' &&
      !r.transporterId &&
      matchesVehicle(r)
   );
   const myDeliveries = (transportRequests || []).filter((r: any) => r.transporterId === user.id);
   const completedDeliveries = myDeliveries.filter((r: any) => r.status === 'delivered');
   const activeDeliveries = myDeliveries.filter((r: any) => r.status !== 'delivered' && r.status !== 'cancelled');

   const totalEarnings = completedDeliveries.reduce((sum: number, r: any) => sum + (r.finalFare ?? r.estimatedFare ?? 0), 0);

   const formatDateTime = (v: any) => {
      const s = v ? String(v) : ''
      const t = Date.parse(s)
      if (!Number.isFinite(t)) return '—'
      return new Date(t).toLocaleString()
   }

   const computeTimeMinutes = (pickupAt: any, deliveredAt: any) => {
      const start = Date.parse(pickupAt ? String(pickupAt) : '')
      const end = Date.parse(deliveredAt ? String(deliveredAt) : '')
      if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) return null
      return Math.round((end - start) / 60000)
   }

   const formatMinutes = (mins: any) => {
      const n = Number(mins)
      if (!Number.isFinite(n) || n < 0) return '—'
      const h = Math.floor(n / 60)
      const m = Math.floor(n % 60)
      return h > 0 ? `${h}h ${m}m` : `${m}m`
   }

   return (
      <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900">
         {/* Sidebar */}
         <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col p-4">
            <div className="flex items-center gap-3 mb-8 px-2">
               <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-600/30">
                  <Truck className="w-6 h-6" />
               </div>
               <span className="font-bold text-xl text-white tracking-tight leading-tight">KisanSetu <br /><span className="text-orange-500 text-xs uppercase tracking-widest">Logistics</span></span>
            </div>
            <nav className="space-y-1 flex-1">
               {[
                  { id: 'home', label: 'Load Board', icon: Box, badge: availableJobs.length },
                  { id: 'deliveries', label: 'My Deliveries', icon: Route, badge: activeDeliveries.length },
                  { id: 'earnings', label: 'Earnings', icon: IndianRupee },
                  { id: 'vehicle', label: 'Vehicle', icon: Truck },
                     { id: 'more', label: 'Pro Features', icon: Settings },
                     { id: 'messages', label: 'Messages', icon: MessageCircle },
                  { id: 'profile', label: 'My Profile', icon: UserIcon },
                  { id: 'notifications', label: 'Notifications', icon: Bell, badge: notifications.filter(n => !n.isRead).length },
                  { id: 'help', label: 'Help & Support', icon: HelpCircle },
                  { id: 'settings', label: 'Settings', icon: Settings }
               ].map(item => (
                  <button
                     key={item.id}
                     onClick={() => setView(item.id)}
                     className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${view === item.id ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' : 'hover:bg-slate-800 hover:text-white'}`}
                  >
                     <item.icon className="w-5 h-5" />
                     <span className="flex-1 text-left">{item.label}</span>
                     {item.badge && item.badge > 0 && <span className={`text-[10px] px-2 py-0.5 rounded-full ${view === item.id ? 'bg-white/20 text-white' : 'bg-orange-600/20 text-orange-500'}`}>{item.badge}</span>}
                  </button>
               ))}
            </nav>
            <button onClick={onLogout} className="mt-auto flex items-center gap-2 px-4 py-3 text-slate-500 hover:text-white transition-colors border-t border-slate-800"><LogOut className="w-5 h-5" /> Logout</button>
         </aside>

         {/* Main Content */}
         <main className="flex-1 overflow-y-auto p-4 md:p-8 relative h-screen">
            {view === 'home' && (
               <div className="space-y-8 animate-in fade-in">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                     <div>
                        <h2 className="text-3xl font-bold text-slate-900">Load Board</h2>
                        <p className="text-slate-500">Pick up verified loads and start earning</p>
                     </div>
                     <div className="flex bg-white p-1 rounded-xl border border-slate-200">
                        {['all', 'local', 'inter-city'].map(f => (
                           <button
                              key={f}
                              onClick={() => setLoadFilter(f as any)}
                              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${loadFilter === f ? 'bg-orange-100 text-orange-700' : 'text-slate-500 hover:text-slate-900'}`}
                           >
                              {f === 'all' ? 'All Loads' : f === 'local' ? 'Local' : 'Inter-City'}
                           </button>
                        ))}
                     </div>
                  </div>

                  <div className="grid gap-6">
                     {availableJobs.map((r: any) => {
                        const order = orders.find((o: any) => o.id === r.orderId);
                        const distanceKm = Number(order?.distanceKm || 45);
                        const cropName = order?.cropName || 'Crop';
                        const quantity = Number(order?.quantity || r.weightKg || 0);
                        const alreadyBid = (transportBids || []).some((b: any) => b.requestId === r.id && b.transporterId === user.id && b.status !== 'rejected' && b.status !== 'withdrawn');
                        return (
                        <Card key={r.id} className="p-0 overflow-hidden border-orange-100 group hover:shadow-2xl transition-all duration-500">
                           <div className="flex flex-col md:flex-row">
                              <div className="p-6 md:p-8 flex-1">
                                 <div className="flex justify-between items-start mb-6">
                                    <div className="flex gap-4">
                                       <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-orange-600 transition-colors"><MapPin className="w-7 h-7" /></div>
                                       <div>
                                          <div className="text-xs text-orange-600 font-black uppercase tracking-widest mb-1">New Load Available</div>
                                          <h4 className="font-bold text-xl text-slate-800">{cropName} • {quantity} kg</h4>
                                          <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Vehicle: {r.vehicleType}</div>
                                       </div>
                                    </div>
                                    <div className="text-right">
                                       <div className="text-2xl font-black text-slate-900">₹{r.estimatedFare}</div>
                                       <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Est. Payout</div>
                                    </div>
                                 </div>

                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-y border-slate-100 mb-6 font-medium">
                                    <div className="flex gap-3 items-center">
                                       <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs">A</div>
                                       <div>
                                          <div className="text-[10px] text-slate-400 uppercase font-black">Pickup</div>
                                          <div className="text-sm font-bold truncate">{r.pickupLocation}</div>
                                       </div>
                                    </div>
                                    <div className="flex justify-center items-center py-2 md:py-0">
                                       <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-full border border-slate-100 text-[10px] font-black text-slate-500 uppercase">
                                          <Timer className="w-3 h-3" /> {distanceKm} KM
                                       </div>
                                    </div>
                                    <div className="flex gap-3 items-center">
                                       <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs">B</div>
                                       <div className="text-right md:text-left flex-1">
                                          <div className="text-[10px] text-slate-400 uppercase font-black">Delivery</div>
                                          <div className="text-sm font-bold truncate">{r.dropLocation}</div>
                                       </div>
                                    </div>
                                 </div>

                                 <div className="flex gap-4">
                                    <Button variant="outline" disabled={alreadyBid} className="flex-1 h-12 font-bold border-slate-200" onClick={() => {
                                       setTransportNumberValue(String(r.estimatedFare || 0))
                                       setTransportNumberModal({ open: true, type: 'bid', requestId: r.id, title: 'Place Bid' })
                                    }}>Bid Fare</Button>
                                    <Button disabled={alreadyBid} className="flex-[2] h-12 bg-orange-600 hover:bg-orange-700 shadow-xl shadow-orange-600/20 font-black" onClick={() => onAddTransportBid?.(r.id, user.id, r.estimatedFare, 'Accept base fare')}>
                                       Accept Base
                                    </Button>
                                 </div>
                                 {alreadyBid && (() => {
                                    const myBid = (transportBids || []).find((b: any) => b.requestId === r.id && b.transporterId === user.id && b.status === 'pending')
                                    if (!myBid) return null
                                    const countered = myBid.lastActionBy === 'buyer' && myBid.counterAmount != null
                                    return (
                                       <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                                          <div className="min-w-0">
                                             <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Your Bid</div>
                                             <div className="text-sm font-black text-slate-900">
                                                ₹{Number((myBid.counterAmount != null ? myBid.counterAmount : myBid.amount) || 0).toLocaleString()}
                                             </div>
                                             {countered && <div className="text-[10px] font-black text-amber-700">Buyer countered</div>}
                                          </div>
                                          {countered ? (
                                             <div className="flex items-center gap-2">
                                                <Button variant="outline" className="h-10 text-xs font-black border-slate-200" onClick={() => {
                                                   setTransportNumberValue(String(myBid.amount || r.estimatedFare || 0))
                                                   setTransportNumberModal({ open: true, type: 'counter', bidId: myBid.id, title: 'Counter Offer' })
                                                }}>Counter Back</Button>
                                                <Button className="h-10 text-xs font-black bg-orange-600 hover:bg-orange-700" onClick={() => onTransporterAcceptBuyerCounter?.(myBid.id)}>Accept Counter</Button>
                                             </div>
                                          ) : (
                                             <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Waiting buyer</div>
                                          )}
                                       </div>
                                    )
                                 })()}
                              </div>
                           </div>
                        </Card>
                     )})}
                     {availableJobs.length === 0 && <div className="py-24 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-white/50">No loads currently available in your region. Check back soon.</div>}
                  </div>
               </div>
            )}

            {view === 'deliveries' && (
               <div className="space-y-6 animate-in slide-in-from-right-4">
                  <h2 className="text-2xl font-bold text-slate-900">My Active Shipments</h2>
                  <div className="grid gap-6">
                     {activeDeliveries.map((r: any) => {
                        const order = orders.find((o: any) => o.id === r.orderId);
                        return (
                        <Card key={r.id} className="p-6 border-orange-100 bg-white">
                           <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
                              <div className="flex gap-4">
                                 <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 shadow-sm"><Route className="w-8 h-8" /></div>
                                 <div>
                                    <h3 className="text-lg font-bold text-slate-900">Order #{order?.id || r.orderId} • {order?.cropName || 'Crop'}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                       <span className="px-3 py-1 bg-orange-100 text-orange-800 text-[10px] font-black rounded-full uppercase tracking-widest">{String(r.status).replace('_', ' ')}</span>
                                       <span className="text-xs text-slate-400 font-medium">{order?.quantity || r.weightKg}kg • {r.pickupLocation} → {r.dropLocation}</span>
                                    </div>
                                 </div>
                              </div>
                              <div className="text-right w-full md:w-auto">
                                 <div className="text-xs text-slate-400 font-bold uppercase mb-1">Status Update</div>
                                 <select
                                    className="w-full md:w-56 h-10 bg-slate-100 border-none rounded-xl px-3 text-xs font-bold outline-orange-500"
                                    value={r.status}
                                    onChange={(e) => {
                                       const next = e.target.value as any;
                                       if (next === 'picked_up') {
                                          setOtpValue('')
                                          setOtpModal({ open: true, requestId: r.id, nextStatus: 'picked_up' })
                                          return
                                       }
                                       if (next === 'delivered') {
                                          setOtpValue('')
                                          setOtpModal({ open: true, requestId: r.id, nextStatus: 'delivered' })
                                          return
                                       }
                                       onUpdateTransportRequestStatus?.(r.id, next);
                                    }}
                                 >
                                    <option value="assigned">Assigned</option>
                                    <option value="picked_up">Picked Up</option>
                                    <option value="in_transit">In Transit</option>
                                    <option value="delivered">Delivered</option>
                                 </select>
                              </div>
                           </div>

                           <div className="flex gap-3 mt-4 flex-wrap">
                              <Button variant="outline" className="h-10 text-xs font-bold border-dashed border-slate-300 hover:border-orange-500 hover:text-orange-600 transition-colors" onClick={() => {
                                 alert('POD upload will be added soon.')
                              }}>POD</Button>
                              <Button className="h-10 text-xs font-bold bg-orange-600 hover:bg-orange-700" onClick={() => {
                                 const toUserId = order?.buyerId || r.buyerId || ''
                                 const toUserName =
                                    order?.buyerName ||
                                    allUsers?.find((u: any) => u.id === toUserId)?.profile?.fullName ||
                                    allUsers?.find((u: any) => u.id === toUserId)?.phone ||
                                    'Buyer'
                                 if (!toUserId) {
                                    alert('Buyer not found for this order.')
                                    return
                                 }
                                 onOpenChat?.(toUserId, toUserName, undefined, order?.id || r.orderId)
                              }}>Message</Button>
                              <Button variant="outline" className="h-10 text-xs font-bold" onClick={() => {
                                 setIssueOrderId(order?.id || r.orderId);
                                 setIssueText('');
                                 setIssueModalOpen(true);
                              }}>Report Issue</Button>
                           </div>
                        </Card>
                     )})}
                     {activeDeliveries.length === 0 && <div className="py-24 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-white/50">No active shipments. Accept a job from the board to start.</div>}
                  </div>
               </div>
            )}

            {view === 'earnings' && (
               <div className="space-y-8 animate-in slide-in-from-right-4">
                  <div className="flex justify-between items-end">
                     <div>
                        <h2 className="text-3xl font-bold text-slate-900">Financials</h2>
                        <p className="text-slate-500">Track your transport earnings</p>
                     </div>
                     <Button className="bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/20 font-bold"><IndianRupee className="w-4 h-4 mr-2" /> Withdraw Funds</Button>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                     {[
                        { label: 'Total Earnings', value: `₹${totalEarnings.toLocaleString()}`, color: 'bg-green-600', icon: DollarSign },
                        { label: 'Deliveries Done', value: completedDeliveries.length, color: 'bg-orange-600', icon: CheckCircle },
                        { label: 'Rating', value: user.profile.rating || 5.0, color: 'bg-blue-600', icon: Star }
                     ].map((stat, i) => (
                        <Card key={i} className="p-6 relative overflow-hidden group">
                           <div className={`absolute top-0 right-0 w-24 h-24 ${stat.color} opacity-[0.03] rounded-bl-full -mr-8 -mt-8 group-hover:scale-110 transition-transform`} />
                           <div className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">{stat.label}</div>
                           <div className="text-3xl font-black text-slate-900 flex items-baseline gap-1">
                              {stat.value}
                              {stat.label === 'Rating' && <span className="text-xs text-slate-400"> / 5.0</span>}
                           </div>
                           <div className="mt-4 flex items-center text-[10px] font-bold text-green-600"><TrendingUp className="w-3 h-3 mr-1" /> +12.5% vs last month</div>
                        </Card>
                     ))}
                  </div>

                  <Card className="p-0 overflow-hidden border-slate-200">
                     <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h3 className="font-bold text-slate-900">Earning History</h3>
                        <Button variant="ghost" className="text-xs h-8 font-bold text-slate-500 hover:text-orange-600">Download CSV</Button>
                     </div>
                     <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                           <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-black tracking-widest">
                              <tr>
                                 <th className="px-6 py-4">Order ID</th>
                                 <th className="px-6 py-4">Pickup</th>
                                 <th className="px-6 py-4">Delivered</th>
                                 <th className="px-6 py-4">Time Taken</th>
                                 <th className="px-6 py-4">Distance</th>
                                 <th className="px-6 py-4 text-right">Amount</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-100">
                              {completedDeliveries.map((r: any) => {
                                 const order = orders.find((o: any) => o.id === r.orderId)
                                 const distance = Number(order?.distanceKm || 45)
                                 const amount = Number(r.finalFare ?? r.estimatedFare ?? 0)
                                 const timeMins = r.totalTimeMinutes ?? computeTimeMinutes(r.pickupConfirmedAt, r.deliveryConfirmedAt)
                                 return (
                                    <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                                       <td className="px-6 py-4 font-bold text-slate-700">#{r.orderId}</td>
                                       <td className="px-6 py-4 text-slate-500">{formatDateTime(r.pickupConfirmedAt)}</td>
                                       <td className="px-6 py-4 text-slate-500">{formatDateTime(r.deliveryConfirmedAt)}</td>
                                       <td className="px-6 py-4 text-slate-500">{formatMinutes(timeMins)}</td>
                                       <td className="px-6 py-4 text-slate-500">{distance} KM</td>
                                       <td className="px-6 py-4 text-right font-black text-slate-900">₹{amount.toLocaleString()}</td>
                                    </tr>
                                 )
                              })}
                           </tbody>
                        </table>
                        {completedDeliveries.length === 0 && <div className="py-12 text-center text-slate-400 text-xs">No payment records found yet.</div>}
                     </div>
                  </Card>
               </div>
            )}

            {/* ===== VEHICLE VIEW ===== */}
            {view === 'vehicle' && (
               <div className="space-y-6 animate-in slide-in-from-right-4">
                  <div className="flex justify-between items-center">
                     <div><h2 className="text-2xl font-black text-slate-900">Vehicle Management</h2><p className="text-slate-500">Manage your fleet (Max 2).</p></div>
                     {(!profileData.vehicles || profileData.vehicles.length < 2) && (
                        <Button className="bg-orange-600 hover:bg-orange-700 font-bold" onClick={() => { setTempVehicle({ status: 'active', type: 'Mini Truck' }); setIsEditingVehicle(false); setShowAddVehicle(true); }}><Plus className="w-5 h-5 mr-1" /> Add Vehicle</Button>
                     )}
                  </div>

                  {showAddVehicle && (
                      <Card className="p-6 border-orange-200 bg-orange-50/50 mb-6">
                          <h3 className="font-bold text-lg mb-4">{isEditingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</h3>
                          <div className="grid md:grid-cols-2 gap-4 mb-4">
                              <div>
                                  <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Vehicle Type</label>
                                  <select className="w-full h-10 bg-white border border-slate-300 rounded-lg px-3 outline-none" value={tempVehicle.type} onChange={e => setTempVehicle({ ...tempVehicle, type: e.target.value })}>
                                      <option value="Bike">Bike (up to 150kg)</option>
                                      <option value="Auto">Auto (up to 400kg)</option>
                                      <option value="Mini Truck">Mini Truck (up to 2000kg)</option>
                                      <option value="Pickup">Pickup (up to 5000kg)</option>
                                      <option value="Truck">Truck (5000kg+)</option>
                                  </select>
                              </div>
                              <Input label="Vehicle Number" placeholder="MP04 GA 1234" value={tempVehicle.number || ''} onChange={e => setTempVehicle({ ...tempVehicle, number: e.target.value })} />
                              <Input label="Capacity (Kg)" type="number" value={tempVehicle.capacity || ''} onChange={e => setTempVehicle({ ...tempVehicle, capacity: e.target.value })} />
                          </div>
                          
                          <div className="grid md:grid-cols-3 gap-4 mb-4">
                              <div>
                                  <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Vehicle Photo</label>
                                  <input type="file" accept="image/*" className="text-xs" onChange={e => {
                                      const file = e.target.files?.[0];
                                      if (file) handleImageUpload(file, (base64) => setTempVehicle(prev => ({ ...prev, vehiclePhoto: base64 })));
                                  }} />
                                  {tempVehicle.vehiclePhoto && <img src={tempVehicle.vehiclePhoto} className="mt-2 h-16 w-full object-cover rounded" />}
                              </div>
                              <div>
                                  <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Number Plate</label>
                                  <input type="file" accept="image/*" className="text-xs" onChange={e => {
                                      const file = e.target.files?.[0];
                                      if (file) handleImageUpload(file, (base64) => setTempVehicle(prev => ({ ...prev, numberPlatePhoto: base64 })));
                                  }} />
                                  {tempVehicle.numberPlatePhoto && <img src={tempVehicle.numberPlatePhoto} className="mt-2 h-16 w-full object-cover rounded" />}
                              </div>
                              <div>
                                  <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Driver Photo</label>
                                  <input type="file" accept="image/*" className="text-xs" onChange={e => {
                                      const file = e.target.files?.[0];
                                      if (file) handleImageUpload(file, (base64) => setTempVehicle(prev => ({ ...prev, driverPhoto: base64 })));
                                  }} />
                                  {tempVehicle.driverPhoto && <img src={tempVehicle.driverPhoto} className="mt-2 h-16 w-full object-cover rounded" />}
                              </div>
                          </div>

                          <div className="flex gap-3 justify-end">
                              <Button variant="ghost" onClick={() => setShowAddVehicle(false)}>Cancel</Button>
                              <Button className="bg-orange-600 font-bold" onClick={async () => {
                                  if (!tempVehicle.type || !tempVehicle.number || !tempVehicle.capacity) return alert('Please fill all fields');

                                  const ensureUploaded = async (value?: string) => {
                                     if (!value) return undefined;
                                     if (!value.startsWith('data:')) return value;
                                     const url = await uploadMedia(value, `vehicles/${user.id}`);
                                     return url || value;
                                  };

                                  const vehiclePhoto = await ensureUploaded(tempVehicle.vehiclePhoto as any);
                                  const numberPlatePhoto = await ensureUploaded(tempVehicle.numberPlatePhoto as any);
                                  const driverPhoto = await ensureUploaded(tempVehicle.driverPhoto as any);
                                  
                                  let updatedVehicles = [...(profileData.vehicles || [])];
                                  if (isEditingVehicle) {
                                      updatedVehicles = updatedVehicles.map(v => v.id === tempVehicle.id ? { ...v, ...tempVehicle, vehiclePhoto, numberPlatePhoto, driverPhoto } as Vehicle : v);
                                  } else {
                                      if (updatedVehicles.length >= 2) return alert("Max 2 vehicles allowed.");
                                      const newV: Vehicle = {
                                          id: Math.random().toString(36).substr(2, 9),
                                          type: tempVehicle.type!,
                                          number: tempVehicle.number!,
                                          capacity: tempVehicle.capacity!,
                                          status: 'active',
                                          vehiclePhoto,
                                          numberPlatePhoto,
                                          driverPhoto
                                      };
                                      updatedVehicles.push(newV);
                                  }
                                  setProfileData(prev => ({ ...prev, vehicles: updatedVehicles }));
                                  onUpdateProfile?.({ ...user.profile, vehicles: updatedVehicles });
                                  setShowAddVehicle(false);
                                  setIsEditingVehicle(false);
                              }}>{isEditingVehicle ? 'Update Vehicle' : 'Save Vehicle'}</Button>
                          </div>
                      </Card>
                  )}

                  <div className="grid gap-6">
                     {(profileData.vehicles || []).map((v: Vehicle) => (
                         <Card key={v.id} className="p-6 border-slate-200 bg-white">
                             <div className="flex flex-col md:flex-row gap-6 items-start">
                                <div className="w-24 h-24 bg-slate-100 rounded-xl flex items-center justify-center text-slate-300 flex-shrink-0 overflow-hidden relative">
                                   {v.vehiclePhoto ? <img src={v.vehiclePhoto} className="w-full h-full object-cover" /> : <Truck className="w-10 h-10" />}
                                </div>
                                <div className="flex-1 w-full">
                                   <div className="flex justify-between items-start mb-2">
                                      <div>
                                          <h3 className="text-xl font-bold text-slate-900">{v.type}</h3>
                                          <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">{v.number}</p>
                                      </div>
                                      <div className="flex items-center gap-2">
                                          <span className={`w-3 h-3 rounded-full ${v.status === 'active' ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                                          <span className="text-sm font-bold text-slate-700">{v.status === 'active' ? 'Active' : 'Inactive'}</span>
                                      </div>
                                   </div>
                                   <div className="flex gap-4 text-sm text-slate-600 mb-4">
                                       <span className="bg-slate-50 px-2 py-1 rounded border border-slate-100 font-bold">Capacity: {v.capacity} kg</span>
                                       <span className="bg-slate-50 px-2 py-1 rounded border border-slate-100 font-bold">All India Permit</span>
                                   </div>
                                   <div className="flex gap-3">
                                      <Button variant="outline" size="sm" className="font-bold" onClick={() => {
                                          setTempVehicle(v);
                                          setIsEditingVehicle(true);
                                          setShowAddVehicle(true);
                                      }}>Edit Details</Button>
                                      <Button variant="outline" size="sm" className={`font-bold ${v.status === 'active' ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`} onClick={() => {
                                          const updated = (profileData.vehicles || []).map((pv: Vehicle) =>
                                             pv.id === v.id ? ({ ...pv, status: (pv.status === 'active' ? 'inactive' : 'active') as Vehicle['status'] } as Vehicle) : pv
                                          );
                                          setProfileData(prev => ({ ...prev, vehicles: updated }));
                                          onUpdateProfile?.({ ...user.profile, vehicles: updated });
                                      }}>{v.status === 'active' ? 'Deactivate' : 'Activate'}</Button>
                                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50 font-bold" onClick={() => {
                                          if(!confirm('Delete this vehicle?')) return;
                                          const updated = (profileData.vehicles || []).filter((pv: Vehicle) => pv.id !== v.id);
                                          setProfileData(prev => ({ ...prev, vehicles: updated }));
                                          onUpdateProfile?.({ ...user.profile, vehicles: updated });
                                      }}>Delete</Button>
                                   </div>
                                </div>
                             </div>
                         </Card>
                     ))}
                     {(!profileData.vehicles || profileData.vehicles.length === 0) && !showAddVehicle && (
                         <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                             <Truck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                             <h3 className="text-slate-900 font-bold">No Vehicles Added</h3>
                             <p className="text-slate-500 text-sm">Add your trucks to start receiving orders.</p>
                         </div>
                     )}
                  </div>
               </div>
            )}

            {/* ===== PROFILE VIEW ===== */}
            {view === 'profile' && (
               <div className="space-y-6 animate-in slide-in-from-right-4">
                  <div className="flex flex-col md:flex-row gap-6">
                     <Card className="w-full md:w-80 p-6 h-fit text-center">
                        <div className="w-24 h-24 bg-orange-100 rounded-full mx-auto flex items-center justify-center text-orange-600 mb-4 text-3xl font-black">{(user.profile.fullName || 'U').charAt(0)}</div>
                        <h2 className="text-xl font-bold text-slate-900">{user.profile.fullName || 'User'}</h2>
                        <p className="text-sm text-slate-500 mb-6">{user.profile.city || 'Mumbai'}, {user.profile.state || 'Maharashtra'}</p>
                        <div className="grid grid-cols-2 gap-4 mb-6 text-left">
                           <div className="p-3 bg-slate-50 rounded-xl"><div className="text-xs text-slate-400 font-bold uppercase">Rating</div><div className="font-bold text-slate-700 flex items-center gap-1">4.8 <Star className="w-3 h-3 text-orange-400 fill-current" /></div></div>
                           <div className="p-3 bg-slate-50 rounded-xl"><div className="text-xs text-slate-400 font-bold uppercase">Trips</div><div className="font-bold text-slate-700">{completedDeliveries.length}</div></div>
                        </div>
                        <div className="flex flex-col gap-2">
                           <Button variant={profileTab === 'overview' ? 'default' : 'ghost'} className={profileTab === 'overview' ? 'bg-orange-600' : ''} onClick={() => setProfileTab('overview')}>Overview</Button>
                           <Button variant={profileTab === 'edit' ? 'default' : 'ghost'} className={profileTab === 'edit' ? 'bg-orange-600' : ''} onClick={() => setProfileTab('edit')}>Edit Profile</Button>
                        </div>
                     </Card>
                     <div className="flex-1">
                        {profileTab === 'overview' ? (
                           <div className="space-y-6">
                              <Card className="p-6">
                                 <h3 className="text-lg font-bold text-slate-900 mb-4">Primary Vehicle</h3>
                                 {profileData.vehicles && profileData.vehicles.length > 0 ? (
                                     <div className="flex items-center gap-4">
                                         <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center">
                                             {profileData.vehicles[0].vehiclePhoto ? <img src={profileData.vehicles[0].vehiclePhoto} className="w-full h-full object-cover" /> : <Truck className="w-8 h-8 text-slate-400" />}
                                         </div>
                                         <div>
                                             <div className="font-bold text-slate-900">{profileData.vehicles[0].type}</div>
                                             <div className="text-sm text-slate-500 uppercase font-bold tracking-wider">{profileData.vehicles[0].number}</div>
                                         </div>
                                         <Button variant="outline" size="sm" className="ml-auto" onClick={() => setView('vehicle')}>Manage Fleet</Button>
                                     </div>
                                 ) : (
                                     <div className="text-center py-4">
                                         <p className="text-sm text-slate-500 mb-3">No vehicle added yet.</p>
                                         <Button size="sm" onClick={() => { setView('vehicle'); setShowAddVehicle(true); setIsEditingVehicle(false); setTempVehicle({ status: 'active', type: 'Mini Truck' }); }}>Add Primary Vehicle</Button>
                                     </div>
                                 )}
                              </Card>
                              <Card className="p-6">
                                 <h3 className="text-lg font-bold text-slate-900 mb-4">Business Profile</h3>
                                 <div className="grid md:grid-cols-2 gap-6">
                                    <div><label className="text-xs font-bold text-slate-400 uppercase">Firm Name</label><p className="font-medium text-slate-900">{profileData.businessName || 'Not Added'}</p></div>
                                    <div><label className="text-xs font-bold text-slate-400 uppercase">GSTIN</label><p className="font-medium text-slate-900">{profileData.gstin || 'Not Added'}</p></div>
                                    <div><label className="text-xs font-bold text-slate-400 uppercase">Operating Regions</label><div className="flex gap-2 mt-1 flex-wrap">{['Mumbai', 'Pune', 'Nashik'].map(r => <span key={r} className="px-2 py-1 bg-slate-100 rounded text-xs font-bold text-slate-600">{r}</span>)}</div></div>
                                    <div><label className="text-xs font-bold text-slate-400 uppercase">Route Type</label><p className="font-medium text-slate-700">Inter-district</p></div>
                                 </div>
                              </Card>
                              <Card className="p-6">
                                 <h3 className="text-lg font-bold text-slate-900 mb-4">Verification Status</h3>
                                 <div className="flex gap-4">
                                    <div className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg font-bold text-sm"><CheckCircle className="w-4 h-4" /> Phone Verified</div>
                                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg font-bold text-sm ${profileData.gstin ? 'bg-green-50 text-green-700' : 'bg-slate-50 text-slate-500'}`}>{profileData.gstin ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />} GSTIN {profileData.gstin ? 'Verified' : 'Pending'}</div>
                                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg font-bold text-sm ${profileData.bankDetails?.accountNumber ? 'bg-green-50 text-green-700' : 'bg-slate-50 text-slate-500'}`}>{profileData.bankDetails?.accountNumber ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />} Bank Added</div>
                                 </div>
                              </Card>
                           </div>
                        ) : (
                           <Card className="p-0 overflow-hidden">
                              <div className="flex border-b border-slate-100 bg-slate-50">
                                 {['personal', 'business', 'bank', 'vehicle', 'docs'].map((s: any) => (
                                    <button
                                       key={s}
                                       onClick={() => setEditSection(s)}
                                       className={`flex-1 py-3 text-sm font-bold capitalize transition-colors ${editSection === s ? 'bg-white text-orange-600 border-t-2 border-orange-600' : 'text-slate-500 hover:text-slate-800'}`}
                                    >
                                       {s === 'docs' ? 'Documents' : s === 'vehicle' ? 'Vehicle' : s}
                                    </button>
                                 ))}
                              </div>
                              <div className="p-6">
                                 {editSection === 'personal' && (
                                    <div className="space-y-4 animate-in fade-in">
                                       <div className="grid md:grid-cols-2 gap-4"><Input label="Full Name" value={profileData.fullName || ''} onChange={e => setProfileData({ ...profileData, fullName: e.target.value })} /><Input label="Language" value={profileData.language || ''} onChange={e => setProfileData({ ...profileData, language: e.target.value })} /></div>
                                       <div className="grid md:grid-cols-2 gap-4"><Input label="City" value={profileData.city || ''} onChange={e => setProfileData({ ...profileData, city: e.target.value })} /><Input label="State" value={profileData.state || ''} onChange={e => setProfileData({ ...profileData, state: e.target.value })} /></div>
                                    </div>
                                 )}

                                 {editSection === 'business' && (
                                    <div className="space-y-4 animate-in fade-in">
                                       <Input label="Business/Firm Name" value={profileData.businessName || ''} onChange={e => setProfileData({ ...profileData, businessName: e.target.value })} />
                                       <div className="grid md:grid-cols-2 gap-4"><Input label="GSTIN" value={profileData.gstin || ''} onChange={e => setProfileData({ ...profileData, gstin: e.target.value })} /><Input label="PAN Number" value={profileData.pan || ''} onChange={e => setProfileData({ ...profileData, pan: e.target.value })} /></div>
                                       <Input label="Operating Regions (Comma separated)" placeholder="e.g. Mumbai, Pune, Nashik" />
                                    </div>
                                 )}

                                 {editSection === 'bank' && (
                                    <div className="space-y-4 animate-in fade-in">
                                       <div className="p-3 bg-blue-50 text-blue-700 rounded-lg text-sm mb-4 flex gap-2"><Lock className="w-4 h-4 mt-0.5" /> Bank details are securely stored and used only for payouts.</div>
                                       <Input label="Account Holder Name" value={profileData.bankDetails?.holderName || ''} onChange={e => setProfileData({ ...profileData, bankDetails: { ...(profileData.bankDetails || {}), holderName: e.target.value } as any })} />
                                       <div className="grid md:grid-cols-2 gap-4">
                                          <Input label="Account Number" value={profileData.bankDetails?.accountNumber || ''} onChange={e => setProfileData({ ...profileData, bankDetails: { ...(profileData.bankDetails || {}), accountNumber: e.target.value } as any })} />
                                          <Input label="IFSC Code" value={profileData.bankDetails?.ifsc || ''} onChange={e => setProfileData({ ...profileData, bankDetails: { ...(profileData.bankDetails || {}), ifsc: e.target.value } as any })} />
                                       </div>
                                       <Input label="Bank Name" value={profileData.bankDetails?.bankName || ''} onChange={e => setProfileData({ ...profileData, bankDetails: { ...(profileData.bankDetails || {}), bankName: e.target.value } as any })} />
                                    </div>
                                 )}

                                 {editSection === 'vehicle' && (
                                    <div className="space-y-4 animate-in fade-in">
                                       <div className="grid md:grid-cols-2 gap-4">
                                          <div>
                                             <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Vehicle Type</label>
                                             <select className="w-full h-12 bg-white border border-slate-300 rounded-xl px-3 outline-none" value={profileData.vehicleType} onChange={e => setProfileData({ ...profileData, vehicleType: e.target.value })}>
                                                <option>Pickup Truck</option><option>Mini Truck</option><option>Tractor Trolley</option><option>Large Truck</option>
                                             </select>
                                          </div>
                                          <Input label="Vehicle Name" value={profileData.vehicleName || ''} onChange={e => setProfileData({ ...profileData, vehicleName: e.target.value })} />
                                       </div>
                                       <div className="grid md:grid-cols-3 gap-4">
                                          <Input label="Capacity (Kg)" type="number" value={profileData.maxCapacity} onChange={e => setProfileData({ ...profileData, maxCapacity: e.target.value })} />
                                          <Input label="Vehicle Number" placeholder="MP04 GA 1234" value={profileData.vehicleNumber || ''} onChange={e => setProfileData({ ...profileData, vehicleNumber: e.target.value })} />
                                          <div className="flex items-end">
                                             <span className="text-[10px] text-slate-400 font-bold uppercase">Max 5MB images</span>
                                          </div>
                                       </div>
                                       <div className="grid md:grid-cols-2 gap-4">
                                          <div>
                                             <label className="block text-sm font-medium text-slate-600 mb-1.5 ml-1">Number Plate Photo</label>
                                             <input
                                                type="file"
                                                accept="image/*"
                                                className="w-full bg-white/60 backdrop-blur-sm border border-slate-200 rounded-xl px-4 py-3"
                                                onChange={async e => {
                                                   const file = e.target.files?.[0];
                                                   if (!file || file.size > 5 * 1024 * 1024) return;
                                                   const url = await uploadMedia(file, `vehicles/${user.id}`);
                                                   if (url) setProfileData(prev => ({ ...prev, numberPlatePhoto: url }));
                                                }}
                                             />
                                             {profileData.numberPlatePhoto && <img src={profileData.numberPlatePhoto} alt="Number Plate" className="mt-2 h-24 w-full object-cover rounded-lg border border-slate-200" />}
                                          </div>
                                          <div>
                                             <label className="block text-sm font-medium text-slate-600 mb-1.5 ml-1">Vehicle Photo</label>
                                             <input
                                                type="file"
                                                accept="image/*"
                                                className="w-full bg-white/60 backdrop-blur-sm border border-slate-200 rounded-xl px-4 py-3"
                                                onChange={async e => {
                                                   const file = e.target.files?.[0];
                                                   if (!file || file.size > 5 * 1024 * 1024) return;
                                                   const url = await uploadMedia(file, `vehicles/${user.id}`);
                                                   if (url) setProfileData(prev => ({ ...prev, vehiclePhoto: url }));
                                                }}
                                             />
                                             {profileData.vehiclePhoto && <img src={profileData.vehiclePhoto} alt="Vehicle" className="mt-2 h-24 w-full object-cover rounded-lg border border-slate-200" />}
                                          </div>
                                       </div>
                                    </div>
                                 )}

                                 {editSection === 'docs' && (
                                    <div className="space-y-4 animate-in fade-in">
                                       {['Driving License', 'RC Book', 'Insurance Policy'].map((doc, i) => (
                                          <div key={i} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                                             <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400"><FileText className="w-5 h-5" /></div>
                                                <div><h4 className="font-bold text-slate-900">{doc}</h4><p className="text-xs text-slate-500">JPG, PNG or PDF • Max 5MB</p></div>
                                             </div>
                                             <Button variant="outline" className="text-sm font-bold">Upload</Button>
                                          </div>
                                       ))}
                                    </div>
                                 )}

                                 <div className="pt-6 mt-6 border-t border-slate-100 flex gap-3">
                                    <Button className="flex-1 bg-orange-600 hover:bg-orange-700 font-bold" onClick={() => { onUpdateProfile(user.id, profileData); setProfileTab('overview'); }}>Save All Changes</Button>
                                    <Button variant="ghost" onClick={() => setProfileTab('overview')}>Cancel</Button>
                                 </div>
                              </div>
                           </Card>
                        )}
                     </div>
                  </div>
               </div>
            )}

            {/* ===== NOTIFICATIONS VIEW ===== */}
            {view === 'notifications' && (
               <div className="space-y-6 animate-in slide-in-from-right-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                     <div><h2 className="text-2xl font-black text-slate-900">Notifications</h2><p className="text-slate-500">Job alerts and updates.</p></div>
                     <div className="flex gap-2 flex-wrap">{(['all', 'unread', 'job'] as const).map(filter => (<button key={filter} onClick={() => setNotificationFilter(filter)} className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${notificationFilter === filter ? 'bg-orange-600 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}>{filter === 'all' ? 'All' : filter === 'unread' ? 'Unread' : 'Jobs'}</button>))}</div>
                  </div>
                  <Card className="overflow-hidden">
                     <div className="divide-y divide-slate-100">
                        {notifications.map(n => (
                           <div key={n.id} className={`p-4 flex items-start gap-4 hover:bg-slate-50 transition-colors cursor-pointer ${!n.isRead ? 'bg-orange-50/50' : ''}`} onClick={() => setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, isRead: true } : x))}>
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${n.type === 'job' ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-600'}`}>{n.type === 'job' ? <Truck className="w-5 h-5" /> : <Bell className="w-5 h-5" />}</div>
                              <div className="flex-1 min-w-0"><div className="flex items-center gap-2"><h4 className="font-bold text-slate-900 truncate">{n.title}</h4>{!n.isRead && <span className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></span>}</div><p className="text-sm text-slate-600 line-clamp-2">{n.message}</p><span className="text-xs text-slate-400 mt-1 block">{n.timestamp}</span></div>
                           </div>
                        ))}
                     </div>
                  </Card>
               </div>
            )}

            {view === 'messages' && (
               <div className="space-y-6 animate-in slide-in-from-right-4">
                  <h2 className="text-2xl font-bold text-slate-900">Messages</h2>
                  <Card className="p-6">
                     <div className="grid md:grid-cols-3 gap-6">
                        <div className="md:col-span-1 space-y-3">
                           <div className="text-xs font-black uppercase text-slate-400">Conversations</div>
                           <div className="space-y-2">
                              {(messages || []).filter(m => m.fromUserId === user.id || m.toUserId === user.id).slice(0, 10).map(m => (
                                 <div key={m.id} className="p-3 bg-slate-50 rounded-xl">
                                    <div className="text-xs text-slate-400">{new Date(m.timestamp).toLocaleString()}</div>
                                    <div className="text-sm font-medium text-slate-800">{m.text}</div>
                                 </div>
                              ))}
                              {(messages || []).filter(m => m.fromUserId === user.id || m.toUserId === user.id).length === 0 && <div className="text-xs text-slate-400">No messages yet.</div>}
                           </div>
                        </div>
                        <div className="md:col-span-2 space-y-3">
                           <div className="text-xs font-black uppercase text-slate-400">New Message</div>
                           <select
                              className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-medium outline-nature-500"
                              id="msg-recipient"
                           >
                              {orders.map(o => <option key={o.id} value={o.buyerName}>{o.buyerName}</option>)}
                           </select>
                           <Input id="msg-text" placeholder="Type your message" />
                           <Button className="w-full md:w-auto" onClick={() => {
                              const select = document.getElementById('msg-recipient') as HTMLSelectElement;
                              const textEl = document.getElementById('msg-text') as HTMLInputElement;
                              const toName = select?.value;
                              const text = textEl?.value || '';
                              if (!text) return;
                              const counterpart = toName ? toName : 'Recipient';
                              const receiver = counterpart;
                              const toUserId = (receiver && allUsers.find(u => u.profile?.fullName === receiver)?.id) || (allUsers.find(u => u.role === 'buyer')?.id || '');
                              onSendMessage?.({ toUserId, text });
                              if (textEl) textEl.value = '';
                           }}>Send</Button>
                        </div>
                     </div>
                  </Card>
               </div>
            )}

            {view === 'addresses' && (
               <div className="space-y-6 animate-in slide-in-from-right-4">
                  <h2 className="text-2xl font-bold text-slate-900">Addresses</h2>
                  <Card className="p-6 space-y-4">
                     <div className="grid md:grid-cols-2 gap-4">
                        <Input label="Label" placeholder="Farm / Warehouse" onChange={e => setProfileData({ ...profileData, addresses: [{ ...(profileData.addresses?.[0] || { line1: '' }), label: e.target.value }] })} />
                        <Input label="Contact Name" onChange={e => setProfileData({ ...profileData, addresses: [{ ...(profileData.addresses?.[0] || { line1: '' }), contactName: e.target.value }] })} />
                     </div>
                     <Input label="Phone" onChange={e => setProfileData({ ...profileData, addresses: [{ ...(profileData.addresses?.[0] || { line1: '' }), phone: e.target.value }] })} />
                     <Input label="Address Line" onChange={e => setProfileData({ ...profileData, addresses: [{ ...(profileData.addresses?.[0] || { line1: '' }), line1: e.target.value }] })} />
                     <div className="grid md:grid-cols-3 gap-4">
                        <Input label="City/District" onChange={e => setProfileData({ ...profileData, addresses: [{ ...(profileData.addresses?.[0] || { line1: '' }), district: e.target.value }] })} />
                        <Input label="State" onChange={e => setProfileData({ ...profileData, addresses: [{ ...(profileData.addresses?.[0] || { line1: '' }), state: e.target.value }] })} />
                        <Input label="PIN Code" onChange={e => setProfileData({ ...profileData, addresses: [{ ...(profileData.addresses?.[0] || { line1: '' }), pincode: e.target.value }] })} />
                     </div>
                     <div className="flex gap-2">
                        <Button className="bg-nature-600" onClick={() => onUpdateProfile(user.id, profileData)}>Save Address</Button>
                        <Button variant="ghost" onClick={() => setProfileData({ ...profileData, addresses: [] })}>Clear</Button>
                     </div>
                  </Card>
               </div>
            )}

            {/* ===== HELP VIEW ===== */}
            {view === 'help' && (
               <div className="space-y-6 animate-in slide-in-from-right-4">
                  <div><h2 className="text-2xl font-black text-slate-900">Help & Support</h2><p className="text-slate-500">Logistics assistance.</p></div>
                  <div className="grid md:grid-cols-3 gap-4">
                     <Card className="p-5 hover:shadow-lg transition-shadow cursor-pointer text-center"><Phone className="w-8 h-8 text-orange-600 mx-auto mb-3" /><h4 className="font-bold text-slate-900">Driver Helpline</h4><span className="text-orange-600 font-bold">1800-KISAN-DRIVER</span></Card>
                     <Card className="p-5 hover:shadow-lg transition-shadow cursor-pointer text-center"><Mail className="w-8 h-8 text-orange-600 mx-auto mb-3" /><h4 className="font-bold text-slate-900">Email Support</h4><span className="text-orange-600 font-bold">logistics@kisansetu.in</span></Card>
                     <Card className="p-5 hover:shadow-lg transition-shadow cursor-pointer text-center"><MessageCircle className="w-8 h-8 text-orange-600 mx-auto mb-3" /><h4 className="font-bold text-slate-900">Live Chat</h4><span className="text-orange-600 font-bold">Start Chat</span></Card>
                  </div>
                  <Card className="p-6"><h3 className="font-bold text-slate-800 mb-4">Frequently Asked Questions</h3><div className="space-y-2">{[{ q: 'How are shipping fees calculated?', a: 'Fees are based on distance (km) and load weight.' }, { q: 'What if my vehicle breaks down?', a: 'Contact the helpline immediately to arrange backup transport.' }].map((faq, i) => (<div key={i} className="p-4 bg-slate-50 rounded-xl"><h5 className="font-bold text-slate-900 text-sm mb-1">{faq.q}</h5><p className="text-sm text-slate-600">{faq.a}</p></div>))}</div></Card>
               </div>
            )}

            {view === 'messages' && (
               <div className="space-y-6 animate-in slide-in-from-right-4">
                  <div><h2 className="text-2xl font-black text-slate-900">Messages</h2><p className="text-slate-500">Chat with farmers and buyers.</p></div>
                  <Card className="p-6">
                     <div className="grid md:grid-cols-3 gap-6">
                        <div className="md:col-span-1 space-y-2">
                           <div className="text-xs font-black uppercase text-slate-400">Recent</div>
                           <div className="space-y-2">
                              {(messages || []).filter(m => m.fromUserId === user.id || m.toUserId === user.id).slice(0, 10).map(m => (
                                 <div key={m.id} className="p-3 bg-slate-50 rounded-xl">
                                    <div className="text-xs text-slate-400">{new Date(m.timestamp).toLocaleString()}</div>
                                    <div className="text-sm font-medium text-slate-800">{m.text}</div>
                                 </div>
                              ))}
                              {(messages || []).filter(m => m.fromUserId === user.id || m.toUserId === user.id).length === 0 && <div className="text-xs text-slate-400">No messages yet.</div>}
                           </div>
                        </div>
                        <div className="md:col-span-2 space-y-3">
                           <div className="text-xs font-black uppercase text-slate-400">New Message</div>
                           <select className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-medium outline-nature-500" id="t-msg-recipient">
                              {activeDeliveries.map(o => <option key={o.id} value={o.farmerName}>{o.farmerName}</option>)}
                           </select>
                           <Input id="t-msg-text" placeholder="Type your message" />
                           <Button className="w-full md:w-auto" onClick={() => {
                              const select = document.getElementById('t-msg-recipient') as HTMLSelectElement;
                              const textEl = document.getElementById('t-msg-text') as HTMLInputElement;
                              const toName = select?.value;
                              const text = textEl?.value || '';
                              if (!text) return;
                              const toUserId = (toName && allUsers.find(u => u.profile?.fullName === toName)?.id) || (allUsers.find(u => u.role === 'farmer')?.id || '');
                              onSendMessage?.({ toUserId, text });
                              if (textEl) textEl.value = '';
                           }}>Send</Button>
                        </div>
                     </div>
                  </Card>
               </div>
            )}

            {/* ===== SETTINGS VIEW ===== */}
            {view === 'settings' && (
               <div className="space-y-6 animate-in slide-in-from-right-4">
                  <div><h2 className="text-2xl font-black text-slate-900">Settings</h2><p className="text-slate-500">App preferences.</p></div>
                  <Card className="p-0 overflow-hidden">
                     <div className="p-4 border-b border-slate-100 bg-slate-50 font-bold text-slate-800">Preferences</div>
                     <div className="p-4 space-y-4">
                        {['notifyJobs', 'notifyPayments', 'locationSharing'].map(key => (
                           <div key={key} className="flex items-center justify-between p-2">
                              <span className="font-medium text-slate-700 capitalize">{key.replace('notify', '').replace(/([A-Z])/g, ' $1').trim()}</span>
                              <button onClick={() => setSettingsData(prev => ({ ...prev, [key]: !prev[key] }))} className={`w-12 h-7 rounded-full transition-colors relative ${settingsData[key] ? 'bg-orange-600' : 'bg-slate-300'}`}><span className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${settingsData[key] ? 'translate-x-6' : 'translate-x-1'}`}></span></button>
                           </div>
                        ))}
                     </div>
                  </Card>
               </div>
            )}
            {view === 'more' && (
               <div className="space-y-6 animate-in slide-in-from-right-4">
                  <div><h2 className="text-2xl font-black text-slate-900">Pro Features</h2><p className="text-slate-500">Explore advanced transport tools.</p></div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                     {[
                        { title: 'Route Optimization', desc: 'Multi-stop planning and ETAs' },
                        { title: 'Fleet Management', desc: 'Maintenance and permits' },
                        { title: 'Compliance', desc: 'Docs and audits' },
                        { title: 'Earnings Analytics', desc: 'Utilization and trends' },
                        { title: 'Preferred Partners', desc: 'Favorites and SLAs' },
                        { title: 'POD Workflows', desc: 'Digital signatures and proofs' }
                     ].map((f, i) => (
                        <Card key={i} className="p-5">
                           <h4 className="font-bold text-slate-900">{f.title}</h4>
                           <p className="text-sm text-slate-600">{f.desc}</p>
                           <div className="mt-3"><Button variant="outline" className="text-xs">Coming Soon</Button></div>
                        </Card>
                     ))}
                  </div>
               </div>
            )}
         </main>
         {transportNumberModal.open && (
            <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
               <Card className="w-full max-w-md relative bg-white p-0 overflow-hidden">
                  <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                     <div className="font-bold text-slate-900">{transportNumberModal.title}</div>
                     <button onClick={() => setTransportNumberModal(prev => ({ ...prev, open: false }))} className="bg-white/80 rounded-full p-2 text-slate-700 border border-slate-200">
                        <X className="w-5 h-5" />
                     </button>
                  </div>
                  <div className="p-5 space-y-4">
                     <Input
                        label="Amount (₹)"
                        type="number"
                        value={transportNumberValue}
                        onChange={(e) => setTransportNumberValue(e.target.value)}
                     />
                  </div>
                  <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                     <Button variant="ghost" onClick={() => setTransportNumberModal(prev => ({ ...prev, open: false }))} className="h-10 text-sm font-bold">Cancel</Button>
                     <Button
                        className="h-10 text-sm font-bold bg-orange-600 hover:bg-orange-700"
                        onClick={() => {
                           const n = Number(transportNumberValue)
                           if (!Number.isFinite(n) || n <= 0) return
                           if (transportNumberModal.type === 'bid') {
                              if (!transportNumberModal.requestId) return
                              onAddTransportBid?.(transportNumberModal.requestId, user.id, n)
                              setTransportNumberModal(prev => ({ ...prev, open: false }))
                              return
                           }
                           if (transportNumberModal.type === 'counter') {
                              if (!transportNumberModal.bidId) return
                              onCounterTransportBid?.(transportNumberModal.bidId, n, 'transporter')
                              setTransportNumberModal(prev => ({ ...prev, open: false }))
                              return
                           }
                        }}
                     >
                        Confirm
                     </Button>
                  </div>
               </Card>
            </div>
         )}
         {otpModal.open && (
            <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
               <Card className="w-full max-w-md relative bg-white p-0 overflow-hidden">
                  <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                     <div className="font-bold text-slate-900">{otpModal.nextStatus === 'picked_up' ? 'Pickup Verification' : 'Delivery Verification'}</div>
                     <button onClick={() => setOtpModal(prev => ({ ...prev, open: false }))} className="bg-white/80 rounded-full p-2 text-slate-700 border border-slate-200">
                        <X className="w-5 h-5" />
                     </button>
                  </div>
                  <div className="p-5 space-y-4">
                     <div className="text-sm text-slate-600 font-bold text-center">Enter OTP</div>
                     <OTPInput onComplete={(otp) => setOtpValue(otp)} />
                  </div>
                  <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                     <Button variant="ghost" onClick={() => setOtpModal(prev => ({ ...prev, open: false }))} className="h-10 text-sm font-bold">Cancel</Button>
                     <Button
                        className="h-10 text-sm font-bold bg-orange-600 hover:bg-orange-700"
                        disabled={(otpValue || '').length < 6}
                        onClick={() => {
                           if (!otpModal.requestId) return
                           onUpdateTransportRequestStatus?.(otpModal.requestId, otpModal.nextStatus, otpValue)
                           setOtpModal(prev => ({ ...prev, open: false }))
                        }}
                     >
                        Verify
                     </Button>
                  </div>
               </Card>
            </div>
         )}
         {issueModalOpen && (
            <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
               <Card className="w-full max-w-lg relative bg-white p-0 overflow-hidden">
                  <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                     <div className="font-bold text-slate-900">Report Issue</div>
                     <button onClick={() => setIssueModalOpen(false)} className="bg-white/80 rounded-full p-2 text-slate-700 border border-slate-200">
                        <X className="w-5 h-5" />
                     </button>
                  </div>
                  <div className="p-5 space-y-3">
                     <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Order</div>
                     <div className="text-sm font-bold text-slate-900">{issueOrderId}</div>
                     <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-2">Describe the issue</div>
                     <textarea
                        value={issueText}
                        onChange={(e) => setIssueText(e.target.value)}
                        rows={4}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all placeholder:text-slate-400"
                        placeholder="e.g., buyer unreachable, vehicle breakdown, address mismatch..."
                     />
                  </div>
                  <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                     <Button variant="ghost" onClick={() => setIssueModalOpen(false)} className="h-10 text-sm font-bold">Cancel</Button>
                     <Button
                        className="h-10 text-sm font-bold bg-orange-600 hover:bg-orange-700"
                        disabled={!issueOrderId || issueText.trim().length === 0}
                        onClick={() => {
                           if (!issueOrderId) return;
                           const issue = issueText.trim();
                           if (!issue) return;
                           onRaiseDispute?.({ orderId: issueOrderId, raisedBy: user.profile.fullName, role: 'transporter', issue });
                           setIssueModalOpen(false);
                        }}
                     >
                        Submit
                     </Button>
                  </div>
               </Card>
            </div>
         )}
      </div>
   );
};

const AdminDashboard = ({ allUsers, listings, orders, disputes, systemConfig, onUpdateConfig, onLogout, onUpdateUserStatus, onResolveDispute }: any) => {
   const [tab, setTab] = useState('disputes'); // Set default to disputes for this task
   const [selectedDispute, setSelectedDispute] = useState<any>(null);
   const pendingTransporters = allUsers.filter((u: any) => u.role === 'transporter' && u.profile.approvalStatus === 'pending');

   return (
      <div className="flex h-screen bg-slate-100 overflow-hidden">
         <div className="w-64 bg-slate-900 text-slate-300 flex flex-col p-4">
            <div className="text-white font-bold text-xl mb-8 flex items-center gap-2 px-2"><ShieldCheck className="w-6 h-6 text-nature-500" /> Admin</div>
            <nav className="space-y-1">
               {['Overview', 'Approvals', 'Users', 'Disputes', 'Settings'].map(t => (
                  <button key={t} onClick={() => setTab(t.toLowerCase())} className={`w-full text-left px-4 py-3 rounded-xl transition-all ${tab === t.toLowerCase() ? 'bg-nature-600 text-white' : 'hover:bg-slate-800'}`}>{t}</button>
               ))}
            </nav>
            <button onClick={onLogout} className="mt-auto flex items-center gap-2 px-4 py-3 text-slate-400 hover:text-white"><LogOut className="w-5 h-5" /> Logout</button>
         </div>
         <div className="flex-1 overflow-y-auto p-8 relative">
            <h1 className="text-2xl font-bold text-slate-800 mb-6 capitalize">{tab}</h1>

            {tab === 'disputes' && (
               <div className="space-y-6 animate-in slide-in-from-right-4">
                  <div className="flex justify-between items-center mb-4">
                     <h3 className="font-bold text-lg text-slate-800">Dispute Resolution Center</h3>
                     <div className="flex gap-2">
                        <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-sm text-slate-600">All Status</button>
                        <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-sm text-slate-600">Newest First</button>
                     </div>
                  </div>

                  <div className="grid gap-4">
                     {disputes.map((d: any) => (
                        <Card key={d.id} className={`border-l-4 ${d.status === 'open' ? 'border-red-500' : 'border-green-500'} relative overflow-hidden group`}>
                           <div className="flex justify-between items-start">
                              <div className="flex-1">
                                 <div className="flex items-center gap-2 mb-2">
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${d.status === 'open' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{d.status}</span>
                                    <span className="text-xs text-slate-400">#{d.id} • Order {d.orderId}</span>
                                 </div>
                                 <h4 className="font-bold text-slate-900 text-lg">{d.issue}</h4>
                                 <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                                    <span className="flex items-center gap-1"><UserIcon className="w-3 h-3" /> {d.raisedBy} ({d.role})</span>
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(d.createdAt).toLocaleDateString()}</span>
                                    {d.amount && <span className="flex items-center gap-1 font-medium text-slate-800"><DollarSign className="w-3 h-3" /> Disputed: ₹{d.amount.toLocaleString()}</span>}
                                 </div>
                              </div>

                              <div className="flex flex-col items-end gap-3">
                                 {d.status === 'open' ? (
                                    <>
                                       <Button className="h-9 text-xs w-32" onClick={() => setSelectedDispute(d)}>View Details</Button>
                                       <div className="flex gap-2">
                                          <button className="text-xs text-green-600 font-medium hover:underline" onClick={() => onResolveDispute(d.id, 'resolved_farmer')}>Release Funds</button>
                                          <span className="text-slate-300">|</span>
                                          <button className="text-xs text-red-600 font-medium hover:underline" onClick={() => onResolveDispute(d.id, 'refund_buyer')}>Refund Buyer</button>
                                       </div>
                                    </>
                                 ) : (
                                    <Button variant="ghost" className="h-9 text-xs" onClick={() => setSelectedDispute(d)}>View History</Button>
                                 )}
                              </div>
                           </div>
                        </Card>
                     ))}
                  </div>
                  {disputes.length === 0 && <div className="text-center py-20 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">No active disputes found.</div>}
               </div>
            )}

            {/* Modal for Dispute Details */}
            {selectedDispute && (
               <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
                  <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                     <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <div>
                           <h3 className="text-xl font-bold text-slate-900">Dispute Details #{selectedDispute.id}</h3>
                           <p className="text-sm text-slate-500">Order ID: {selectedDispute.orderId}</p>
                        </div>
                        <button onClick={() => setSelectedDispute(null)} className="p-2 hover:bg-slate-200 rounded-full"><X className="w-5 h-5" /></button>
                     </div>

                     <div className="p-6 overflow-y-auto space-y-6">
                        <div className="flex gap-4 p-4 bg-red-50 text-red-800 rounded-xl border border-red-100 items-start">
                           <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
                           <div>
                              <div className="font-bold text-sm uppercase mb-1">Issue Reported</div>
                              <p className="font-medium">{selectedDispute.issue}</p>
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                           <div>
                              <label className="text-xs font-bold text-slate-400 uppercase">Raised By</label>
                              <div className="font-medium text-slate-900">{selectedDispute.raisedBy}</div>
                              <div className="text-sm text-slate-500 capitalize">{selectedDispute.role}</div>
                           </div>
                           <div>
                              <label className="text-xs font-bold text-slate-400 uppercase">Dispute Amount</label>
                              <div className="font-medium text-slate-900">₹{selectedDispute.amount?.toLocaleString() || 'N/A'}</div>
                              <div className="text-sm text-slate-500">Held in Escrow</div>
                           </div>
                        </div>

                        <div>
                           <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Detailed Description</label>
                           <div className="p-4 bg-slate-50 rounded-xl text-slate-700 text-sm leading-relaxed border border-slate-200">
                              {selectedDispute.details || "No additional details provided."}
                           </div>
                        </div>

                        <div>
                           <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Attached Evidence</label>
                           <div className="flex gap-3">
                              {[1, 2].map((i) => (
                                 <div key={i} className="w-24 h-24 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center cursor-pointer hover:bg-slate-200">
                                    <FileText className="w-6 h-6 text-slate-400" />
                                 </div>
                              ))}
                           </div>
                        </div>
                     </div>

                     <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                        <Button variant="ghost" onClick={() => setSelectedDispute(null)}>Close</Button>
                        {selectedDispute.status === 'open' && (
                           <>
                              <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50" onClick={() => { onResolveDispute(selectedDispute.id, 'refund_buyer'); setSelectedDispute(null); }}>Refund Buyer</Button>
                              <Button className="bg-green-600 hover:bg-green-700" onClick={() => { onResolveDispute(selectedDispute.id, 'resolved_farmer'); setSelectedDispute(null); }}>Release to Farmer</Button>
                           </>
                        )}
                     </div>
                  </div>
               </div>
            )}

            {/* Placeholder for other tabs */}
            {tab !== 'disputes' && (
               <div className="text-center py-20 text-slate-400">
                  <p>Content for {tab} tab placeholder.</p>
               </div>
            )}
         </div>
      </div>
   );
};

// Main App Component with full dashboard switch logic
const App = () => {
   const [screen, setScreen] = useState<'landing' | 'choose-role' | 'auth' | 'admin-login' | 'dashboard'>('landing');
   const [selectedRole, setSelectedRole] = useState<UserRole>(null);
   const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
   const [connectionError, setConnectionError] = useState<string | null>(null);
   const supabaseAvailable = !!getSupabase();

   // STATE
   const [allUsers, setAllUsers] = useState<User[]>([]);
   const [listings, setListings] = useState<CropListing[]>([]);
   const [offers, setOffers] = useState<Offer[]>([]);
   const [orders, setOrders] = useState<Order[]>([]);
   const [disputes, setDisputes] = useState<Dispute[]>([]);
   const [messages, setMessages] = useState<Message[]>([]);
   const [systemConfig, setSystemConfig] = useState<SystemConfig>({ offerExpiryHours: 24, maxListingsPerFarmer: 20, maxActiveJobsPerTransporter: 3, platformFeePercent: 2 });
   const [currentUser, setCurrentUser] = useState<User | null>(null);
   const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
   const [payouts, setPayouts] = useState<Payout[]>([]);
   const [rfqs, setRfqs] = useState<RFQ[]>([]);
   const [routePlans, setRoutePlans] = useState<RoutePlan[]>([]);
   const [transportRequests, setTransportRequests] = useState<TransportRequest[]>([]);
   const [transportBids, setTransportBids] = useState<TransportBid[]>([]);
   const [chatDrawer, setChatDrawer] = useState<{ open: boolean, targetUserId: string, targetUserName: string, listingId?: string, orderId?: string, offerId?: string }>({ open: false, targetUserId: '', targetUserName: '' });
   const [invoiceModal, setInvoiceModal] = useState<{ open: boolean, order: Order | null }>({ open: false, order: null });

   const handleOpenChat = (targetUserId: string, targetUserName: string, listingId?: string, orderId?: string, offerId?: string) => {
      setChatDrawer({ open: true, targetUserId, targetUserName, listingId, orderId, offerId });
   };

   const handleViewInvoice = (order: Order) => {
      setInvoiceModal({ open: true, order });
   };

   // Load data from Supabase on mount
   React.useEffect(() => {
      // Listen for auth state changes (e.g. Magic Link login)
      const c = getSupabase();
      if (c) {
         c.auth.onAuthStateChange(async (event, session) => {
            console.log("Auth State Changed:", event, session?.user?.id);
            if (event === 'SIGNED_IN' && session?.user) {
               const user = await svc.getCurrentUser();
               if (user) {
                  setCurrentUser(user);
                  setScreen('dashboard');
               }
            }
         });
      }

      // Health Check
      const checkConnection = async () => {
         if (!supabaseAvailable) return;
         const net = await svc.checkSupabaseConnectivity(6000)
         const authOk = !!net?.auth?.ok
         const restOk = !!net?.rest?.ok
         if (authOk && restOk) {
            setConnectionError(null)
            return
         }
         const authPart = authOk ? `auth=${net.auth.status}` : `auth_error=${net?.auth?.error || 'unknown'}`
         const restPart = restOk ? `rest=${net.rest.status}` : `rest_error=${net?.rest?.error || 'unknown'}`
         setConnectionError(`Supabase connection issue: ${authPart}, ${restPart}. Disable AdBlock/VPN and allow *.supabase.co.`)
      };
      checkConnection();

      if (!supabaseAvailable) {
         setConnectionError("Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
         return;
      }
      const loadData = async () => {
         // Restore Session
         const sessionUser = await svc.getCurrentUser();
         if (sessionUser) {
            setCurrentUser(sessionUser);
            // If we have a user, go to dashboard
            setScreen('dashboard');
         }

         const [u, l, off, ord, d, m, inv, pay, r, rp, tr, tb] = await Promise.all([
            svc.getUsers(),
            svc.getListings(),
            svc.getOffers(),
            svc.getOrders(),
            svc.getDisputes(),
            svc.getMessages(),
            svc.getInventoryItems(),
            svc.getPayouts(),
            svc.getRfqs(),
            svc.getRoutePlans(),
            svc.getTransportRequests(),
            svc.getTransportBids()
         ]);
         
         if (u) setAllUsers(u);
         if (l) setListings(l);
         if (off) setOffers(off);
         if (ord) setOrders(ord);
         if (d) setDisputes(d);
         if (m) setMessages(m);
         if (inv) setInventoryItems(inv);
         if (pay) setPayouts(pay);
         if (r) setRfqs(r);
         if (rp) setRoutePlans(rp);
         if (tr) setTransportRequests(tr);
         if (tb) setTransportBids(tb);
      };
      loadData();
   }, [supabaseAvailable]);

   const handleGetStarted = (role: UserRole | null = null, mode: 'login' | 'register' = 'register') => {
      setSelectedRole(role);
      setAuthMode(mode);
      setScreen('auth');
   };

   const handleRoleSelect = (role: UserRole) => {
      setSelectedRole(role);
      setAuthMode('register');
      setScreen('auth');
   };
   const handleAuthComplete = async (userData: any) => {
      setCurrentUser(userData); 
      setScreen('dashboard');
      try {
         const [u, l, off, ord, d, m, inv, pay, r, rp, tr, tb] = await Promise.all([
            svc.getUsers(),
            svc.getListings(),
            svc.getOffers(),
            svc.getOrders(),
            svc.getDisputes(),
            svc.getMessages(),
            svc.getInventoryItems(),
            svc.getPayouts(),
            svc.getRfqs(),
            svc.getRoutePlans(),
            svc.getTransportRequests(),
            svc.getTransportBids()
         ]);
         if (u) setAllUsers(u);
         if (l) setListings(l);
         if (off) setOffers(off);
         if (ord) setOrders(ord);
         if (d) setDisputes(d);
         if (m) setMessages(m);
         if (inv) setInventoryItems(inv);
         if (pay) setPayouts(pay);
         if (r) setRfqs(r);
         if (rp) setRoutePlans(rp);
         if (tr) setTransportRequests(tr);
         if (tb) setTransportBids(tb);
      } catch (e) {
         console.error(e);
      }
   };
   const handleAdminLogin = () => { setCurrentUser({ id: 'admin', phone: '0000', role: 'admin', status: 'active', createdAt: new Date().toISOString() }); setScreen('dashboard'); };
  const handleLogout = async () => { await svc.signOut(); setCurrentUser(null); setScreen('landing'); };
   const handleAddListing = async (l: any) => {
      try {
         const saved = await svc.addListing(l);
         if (!saved) return;
        setListings(prev => [saved, ...prev]);
      } catch (e) {
         console.error(e);
         alert('Failed to publish listing. Please try again.');
      }
   };
   const handleUpdateListing = async (updatedListing: any) => {
      try {
         const saved = await svc.updateListing(updatedListing);
         if (!saved) return;
        setListings(prev => prev.map(l => l.id === saved.id ? saved : l));
      } catch (e) {
         console.error(e);
         alert('Failed to update listing. Please try again.');
      }
   };
   const handleUpdateListingStatus = async (id: string, status: ListingStatus) => {
      try {
         await svc.updateListingStatus(id, status);
        setListings(prev => prev.map(l => l.id === id ? { ...l, status } : l));
      } catch (e) {
         console.error(e);
         alert('Failed to update listing status. Please try again.');
      }
   };

  const handleDeleteListing = (id: string) => { svc.deleteListing(id); setListings(listings.filter(l => l.id !== id)); };

   const handlePlaceOffer = async (offer: any) => {
      const offerId = `off_${Date.now()}`;
      // Initialize negotiation history with the first offer
      const initialHistory = [{
          role: 'buyer',
          price: offer.offeredPrice || offer.pricePerKg,
          quantity: offer.quantityRequested || offer.quantity,
          action: 'offer',
          timestamp: new Date().toISOString()
      }];

      const payload = { 
          ...offer, 
          id: offerId, 
          status: 'pending', 
          createdAt: new Date().toISOString(),
          lastActionBy: 'buyer',
          buyerId: currentUser?.id, // Added for RLS
          history: initialHistory 
      };
      
      setOffers(prev => [payload, ...prev]);

      try {
         const savedOffer = await svc.placeOffer(payload);
         if (!savedOffer) throw new Error('Offer not saved');
         setOffers(prev => prev.map(o => o.id === offerId ? savedOffer : o));
      } catch (err) {
         console.error("Failed to place offer", err);
         setOffers(prev => prev.filter(o => o.id !== offerId));
         alert('Failed to place offer. This usually means the listing is not published to the server.');
      }
   };

   const handleDirectBuy = async (listingId: string, quantity: number) => {
      if (!currentUser) {
         alert('Please login to continue.')
         return null
      }
      const freshListings = await svc.getListings()
      const listing = (freshListings || []).find((l: any) => l.id === listingId) || (listings || []).find((l: any) => l.id === listingId)
      if (!listing) {
         alert('Listing not found.')
         return null
      }

      const available = Number(listing.availableQuantity ?? listing.quantity ?? 0)
      const qty = Math.max(1, Math.min(Number(quantity || 1), available || Number(quantity || 1)))
      if (available > 0 && qty > available) {
         alert('Not enough stock available for this listing.')
         return null
      }

      const buyerName = currentUser.profile?.fullName || currentUser.phone || 'Buyer'
      const buyerLocation = currentUser.profile?.city || ''

      const newOrder: Order = {
         id: `ord_${Date.now()}`,
         listingId: listing.id,
         cropName: listing.cropName,
         quantity: qty,
         totalAmount: Number(listing.pricePerKg || 0) * qty,
         status: 'confirmed',
         paymentStatus: 'pending',
         date: new Date().toISOString(),
         farmerName: listing.farmerName,
         farmerId: listing.farmerId,
         farmerLocation: listing.location,
         buyerName,
         buyerId: currentUser.id,
         buyerLocation
      };

      try {
         const order = await svc.createOrder(newOrder)
         const nextAvailable = Math.max(0, available - qty)
         const updatedListing = { ...listing, availableQuantity: nextAvailable }
         await svc.updateListing(updatedListing)
         setOrders(prev => [order, ...prev])
         setListings(prev => prev.map(l => l.id === listing.id ? updatedListing : l))
         return order
      } catch (e) {
         console.error(e)
         alert('Failed to place order. Check console for details.')
         return null
      }
   }

   const handleAcceptOffer = async (offerId: string) => {
      console.log("Accepting offer:", offerId);
      const currentOffers = await svc.getOffers();
      const currentListings = await svc.getListings();
      
      const offer = currentOffers.find((o: any) => o.id === offerId);
      if (!offer) {
          console.error("Offer not found in fresh fetch", offerId);
          alert('This offer is not saved on the server, so it cannot be accepted. Please re-place the offer.');
          return;
      }
      const listing = currentListings.find((l: any) => l.id === offer.listingId);
      if (!listing) {
          console.error("Listing not found in fresh fetch", offer);
          alert('This listing is not published on the server, so the offer cannot be accepted.');
          return;
      }

      // Determine final terms based on who is accepting
      let finalPrice = offer.offeredPrice || offer.pricePerKg;
      let finalQuantity = offer.quantityRequested || offer.quantity;
      
      if (offer.lastActionBy === 'farmer') {
          // Buyer accepted Farmer's counter
          finalPrice = offer.counterPrice;
          finalQuantity = offer.counterQuantity;
      } else {
          // Farmer accepted Buyer's offer
          finalPrice = offer.offeredPrice || offer.pricePerKg;
          finalQuantity = offer.quantityRequested || offer.quantity;
      }

      const newOrder: Order = {
         id: `ord_${Date.now()}`,
         listingId: listing.id,
         cropName: listing.cropName,
         quantity: finalQuantity,
         totalAmount: finalPrice * finalQuantity,
         status: 'confirmed', // Order is confirmed, but payment is pending
         paymentStatus: 'pending', // <--- New Payment Status
         date: new Date().toISOString(),
         farmerName: listing.farmerName,
         farmerId: listing.farmerId, // Added for RLS
         farmerLocation: listing.location,
         buyerName: offer.buyerName,
         buyerId: offer.buyerId, // Added for RLS
         buyerLocation: offer.buyerLocation
      };

      try {
         const order = await svc.createOrder(newOrder);
         if (!order) {
            console.error("Order creation returned null (likely failed)");
            return; 
         }
         
         await svc.setOfferStatus(offerId, 'accepted');
         
         // Update listing quantity
         const updatedListing = { ...listing, availableQuantity: listing.availableQuantity - finalQuantity };
         await svc.updateListing(updatedListing);

         // Refresh local state with fresh data
         setOrders(prev => [order, ...prev]);
         setOffers(prev => prev.map(o => o.id === offerId ? { ...o, status: 'accepted' } : o));
         setListings(prev => prev.map(l => l.id === listing.id ? updatedListing : l));
         console.log("Offer accepted successfully");
      } catch (error) {
         console.error("Error accepting offer:", error);
         alert('Failed to accept offer. Check console for the exact Supabase error.');
      }
   };

   const handleRejectOffer = async (offerId: string) => { 
       console.log("Rejecting offer:", offerId);
       try {
          const updated = await svc.setOfferStatus(offerId, 'rejected'); 
          if (!updated) throw new Error('Offer status not updated');
          setOffers(prev => prev.map(o => o.id === offerId ? { ...o, status: 'rejected' } : o)); 
          console.log("Offer rejected successfully");
       } catch (error) {
          console.error("Error rejecting offer:", error);
          alert('Failed to reject offer. Check console for the exact Supabase error.');
       }
   };

   const handleCounterOffer = async (offerId: string, price: number, quantity: number, role: 'buyer' | 'farmer') => {
      console.log("Countering offer:", offerId, price, quantity, role);
      try {
         const offer = offers.find(o => o.id === offerId);
         if (!offer) return;

         const historyEntry = {
            role,
            price,
            quantity,
            action: 'counter',
            timestamp: new Date().toISOString()
         };

         const updates: any = {
             lastActionBy: role,
             history: [...(offer.history || []), historyEntry],
             status: 'pending' 
         };

         if (role === 'farmer') {
             updates.counterPrice = price;
             updates.counterQuantity = quantity;
         } else {
             updates.offeredPrice = price;
             updates.quantityRequested = quantity;
         }

         // Optimistic Update
         const optimisticUpdated = { ...offer, ...updates };
         setOffers(prev => prev.map(o => o.id === offerId ? optimisticUpdated : o));

         // Try backend update
         const updated = await svc.updateOffer(offerId, updates);
         // If backend succeeds, update with server response (just in case)
         if (updated) {
            setOffers(prev => prev.map(o => o.id === offerId ? updated : o));
         }
         console.log("Offer countered successfully");
      } catch (error) {
         console.error("Error countering offer (backend failed, kept local state):", error);
         // We keep the optimistic update so the user sees it working even if backend fails (Demo Mode)
         // alert('Counter offer saved locally. (Backend sync failed)');
      }
   };

   const handleCancelOffer = async (offerId: string) => {
       try {
           const updated = await svc.setOfferStatus(offerId, 'cancelled');
           setOffers(prev => prev.map(o => o.id === offerId ? { ...o, status: 'cancelled' } : o));
       } catch (error) {
           console.error("Error cancelling offer:", error);
           alert('Failed to cancel offer.');
       }
   };

   const handleUserStatusChange = (userId: string, newStatus: 'active' | 'suspended', approvalStatus?: string) => {
      setAllUsers(allUsers.map(u => {
         if (u.id === userId) {
            const updated = { ...u, status: newStatus };
            if (approvalStatus && u.profile && 'approvalStatus' in u.profile) {
               (updated.profile as any).approvalStatus = approvalStatus;
            }
            return updated;
         }
         return u;
      }));
   };

  const recommendVehicleType = (weightKg: number) => {
     if (weightKg <= 150) return 'Bike' as const;
     if (weightKg <= 400) return 'Auto' as const;
     if (weightKg <= 2000) return 'Mini Truck' as const;
     if (weightKg <= 5000) return 'Pickup' as const;
     return 'Truck' as const;
  };

  const estimateTransportFare = (distanceKm: number, vehicleType: TransportRequest['vehicleType']) => {
     const km = Math.max(1, distanceKm || 1);
     const table: Record<TransportRequest['vehicleType'], { ratePerKm: number; min: number }> = {
        Bike: { ratePerKm: 8, min: 80 },
        Auto: { ratePerKm: 12, min: 150 },
        'Mini Truck': { ratePerKm: 18, min: 400 },
        Pickup: { ratePerKm: 25, min: 800 },
        Truck: { ratePerKm: 35, min: 1200 }
     };
     const calc = Math.round(km * table[vehicleType].ratePerKm);
     return Math.max(calc, table[vehicleType].min);
  };

  const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

  const handleCreateTransportRequest = async (orderId: string, mode: TransportRequest['mode'], options?: { vehicleType?: TransportRequest['vehicleType']; estimatedFare?: number; pickupDate?: string; pickupTime?: string }) => {
     const order = orders.find(o => o.id === orderId);
     if (!order) return;
     const buyerId = currentUser?.id || '';
     const farmerId = order.farmerId || (allUsers.find(u => u.profile?.fullName === order.farmerName)?.id) || '';
     const weightKg = Number(order.quantity || 0);
     const vehicleType = options?.vehicleType || recommendVehicleType(weightKg);
     const estimatedFare = Number(options?.estimatedFare ?? estimateTransportFare(Number(order.distanceKm || 45), vehicleType));
     const status: TransportRequest['status'] =
        mode === 'farmer_arranged' ? 'awaiting_farmer' : mode === 'buyer_own' ? 'assigned' : 'open';

     const newReq: TransportRequest = {
        id: `tr_${Date.now()}`,
        orderId: order.id,
        buyerId,
        farmerId,
        pickupLocation: order.farmerLocation,
        dropLocation: order.buyerLocation,
        weightKg,
        vehicleType,
        mode,
        status,
        estimatedFare,
        pickupDate: options?.pickupDate,
        pickupTime: options?.pickupTime,
        transportPaymentStatus: mode === 'marketplace' ? 'unpaid' : undefined,
        createdAt: new Date().toISOString()
     };

     try {
        const saved = await svc.addTransportRequest(newReq);
        if (!saved) return;
        setTransportRequests(prev => [saved, ...prev]);
     } catch (e) {
        console.error(e);
        alert('Failed to create transport request.');
     }
  };

  const handleAddTransportBid = async (requestId: string, transporterId: string, amount: number, message?: string) => {
     const now = new Date().toISOString()
     const bid: TransportBid = {
        id: `tb_${Date.now()}`,
        requestId,
        transporterId,
        amount,
        message,
        status: 'pending',
        lastActionBy: 'transporter',
        history: [{
           role: 'transporter',
           amount,
           action: 'bid',
           timestamp: now
        }],
        createdAt: now
     };

     setTransportBids(prev => [bid, ...prev]);
     try {
        const saved = await svc.addTransportBid({ ...bid, updatedAt: now });
        if (!saved) return;
        setTransportBids(prev => prev.map(b => b.id === bid.id ? saved : b));
     } catch (e) {
        console.error(e);
     }
  };

  const handleCounterTransportBid = async (bidId: string, amount: number, role: 'buyer' | 'transporter') => {
     const bid = transportBids.find(b => b.id === bidId);
     if (!bid) return;
     const timestamp = new Date().toISOString()

     const updates: any = {
        updatedAt: timestamp,
        history: [...(bid.history || []), { role, amount, action: 'counter', timestamp }]
     }

     if (role === 'buyer') {
        updates.counterAmount = amount
        updates.lastActionBy = 'buyer'
     } else {
        updates.amount = amount
        updates.counterAmount = null
        updates.lastActionBy = 'transporter'
     }

     const optimistic = { ...bid, ...updates }
     setTransportBids(prev => prev.map(b => b.id === bidId ? optimistic : b))
     try {
        const saved = await svc.updateTransportBid(bidId, updates)
        if (saved) setTransportBids(prev => prev.map(b => b.id === bidId ? saved : b))
     } catch (e) {
        console.error(e)
     }
  }

  const handleTransporterAcceptBuyerCounter = async (bidId: string) => {
     const bid = transportBids.find(b => b.id === bidId)
     if (!bid || bid.counterAmount == null) return
     const timestamp = new Date().toISOString()
     const nextAmount = Number(bid.counterAmount)
     const updates: any = {
        amount: nextAmount,
        counterAmount: null,
        lastActionBy: 'transporter',
        updatedAt: timestamp,
        history: [...(bid.history || []), { role: 'transporter', amount: nextAmount, action: 'accept', timestamp }]
     }
     const optimistic = { ...bid, ...updates }
     setTransportBids(prev => prev.map(b => b.id === bidId ? optimistic : b))
     try {
        const saved = await svc.updateTransportBid(bidId, updates)
        if (saved) setTransportBids(prev => prev.map(b => b.id === bidId ? saved : b))
     } catch (e) {
        console.error(e)
     }
  }

  const handleAcceptTransportBid = async (bidId: string) => {
     const bid = transportBids.find(b => b.id === bidId);
     if (!bid) return;
     const req = transportRequests.find(r => r.id === bid.requestId);
     if (!req) return;

     if (req.mode === 'marketplace' && bid.lastActionBy === 'buyer') {
        alert('Waiting for transporter response on your counter.')
        return
     }

     const agreedFare = Number((bid.counterAmount != null && bid.lastActionBy === 'buyer') ? bid.counterAmount : bid.amount)

     const requestBids = transportBids.filter(b => b.requestId === req.id);
     setTransportBids(prev => prev.map(b => b.requestId !== req.id ? b : { ...b, status: b.id === bid.id ? 'accepted' : 'rejected' }));
     try {
        await Promise.all(requestBids.map(b => svc.setTransportBidStatus(b.id, b.id === bid.id ? 'accepted' : 'rejected')));
     } catch (e) {
        console.error(e)
     }

     const patch: any = {
        transporterId: bid.transporterId,
        acceptedBidId: bid.id,
        finalFare: agreedFare,
        status: 'assigned',
        pickupOtp: generateOtp(),
        deliveryOtp: generateOtp(),
        transportPaymentStatus: 'held',
        transportPaymentProof: `TRN-${Date.now()}`
     };
     setTransportRequests(prev => prev.map(r => r.id !== req.id ? r : ({ ...r, ...patch } as TransportRequest)));
     try {
        const saved = await svc.updateTransportRequest(req.id, patch);
        if (saved) setTransportRequests(prev => prev.map(r => r.id === saved.id ? saved : r));
     } catch (e) {
        console.error(e)
     }

     setOrders(prev => prev.map(o => o.id === req.orderId ? { ...o, transporterId: bid.transporterId } : o));
     try {
        await svc.setOrderTransporter(req.orderId, bid.transporterId);
     } catch (e) {
        console.error(e)
     }
  };

  const handleAcceptTransportRequest = async (requestId: string, transporterId: string, finalFare?: number) => {
     // If no transporterId is provided, it means we are just opening it for bids (broadcasting)
     if (!transporterId) {
         const req = transportRequests.find(r => r.id === requestId);
         if (!req) return;
         const patch: any = { status: 'open', mode: 'marketplace', transportPaymentStatus: 'unpaid' };
         const saved = await svc.updateTransportRequest(req.id, patch);
         const updatedReq = saved ? saved : ({ ...req, ...patch } as TransportRequest);
         setTransportRequests(prev => prev.map(r => r.id === updatedReq.id ? updatedReq : r));
         return;
     }

     // Legacy logic for direct assignment (kept for backward compatibility or admin overrides)
     const req = transportRequests.find(r => r.id === requestId);
     if (!req) return;
     const patch = { transporterId, finalFare: finalFare ?? req.estimatedFare, status: 'assigned' };
     const saved = await svc.updateTransportRequest(req.id, patch);
     const updatedReq = saved ? saved : ({ ...req, ...patch } as TransportRequest);
     setTransportRequests(prev => prev.map(r => r.id === updatedReq.id ? updatedReq : r));

     await svc.setOrderTransporter(req.orderId, transporterId);
     setOrders(prev => prev.map(o => o.id === req.orderId ? { ...o, transporterId } : o));
  };

  const handleUpdateTransportRequest = async (requestId: string, patch: Partial<TransportRequest>) => {
     const req = transportRequests.find(r => r.id === requestId)
     if (!req) return
     setTransportRequests(prev => prev.map(r => r.id === requestId ? ({ ...r, ...patch } as TransportRequest) : r))
     try {
        const saved = await svc.updateTransportRequest(requestId, patch)
        if (saved) setTransportRequests(prev => prev.map(r => r.id === requestId ? saved : r))
     } catch (e) {
        console.error(e)
     }
  }

  const handleUpdateTransportRequestStatus = async (requestId: string, status: TransportRequest['status'], otp?: string) => {
     const req = transportRequests.find(r => r.id === requestId);
     if (!req) return;
     const patch: any = { status }
     if (status === 'picked_up') {
        const entered = (otp || '').trim()
        if (!entered || entered !== (req.pickupOtp || '').trim()) {
           alert('Invalid pickup OTP.')
           return
        }
        patch.pickupConfirmedAt = new Date().toISOString()
     }
     if (status === 'delivered') {
        const entered = (otp || '').trim()
        if (!entered || entered !== (req.deliveryOtp || '').trim()) {
           alert('Invalid delivery OTP.')
           return
        }
        if (!req.pickupConfirmedAt) {
           alert('Pickup must be verified before delivery.')
           return
        }
        const deliveredAt = new Date().toISOString()
        patch.deliveryConfirmedAt = deliveredAt
        patch.transportPaymentStatus = 'released'
        const pickupAt = req.pickupConfirmedAt
        const start = pickupAt ? Date.parse(pickupAt) : NaN
        const end = Date.parse(deliveredAt)
        if (Number.isFinite(start) && Number.isFinite(end) && end >= start) {
           patch.totalTimeMinutes = Math.round((end - start) / 60000)
        }
     }
     const saved = await svc.updateTransportRequest(requestId, patch);
     const updatedReq = saved ? saved : ({ ...req, ...patch } as TransportRequest);
     setTransportRequests(prev => prev.map(r => r.id === updatedReq.id ? updatedReq : r));

     const orderStatus: OrderStatus | null =
        status === 'picked_up' ? 'picked_up' : status === 'in_transit' ? 'in_transit' : status === 'delivered' ? 'delivered' : null;
     if (orderStatus) {
        await svc.setOrderStatus(req.orderId, orderStatus);
        setOrders(prev => prev.map(o => o.id === req.orderId ? { ...o, status: orderStatus } : o));
     }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
     await svc.setOrderStatus(orderId, newStatus);
     setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };
  const handleUpdateOrderPayment = async (orderId: string, paymentStatus: Order['paymentStatus'], paymentProof?: string) => {
     await svc.updateOrderPayment(orderId, paymentStatus as any, paymentProof);
     setOrders(prev => prev.map(o => o.id === orderId ? { ...o, paymentStatus, paymentProof: paymentProof ?? o.paymentProof } : o));
  };

   const handleResolveDispute = async (disputeId: string, outcome: string) => { await svc.resolveDispute(disputeId, 'resolved'); setDisputes(disputes.map(d => d.id === disputeId ? { ...d, status: 'resolved' } : d)); };

  const handleAddInventoryItem = async (item: Omit<InventoryItem, 'id' | 'createdAt'>) => {
     const newItem: InventoryItem = { ...item, id: `inv_${Date.now()}`, createdAt: new Date().toISOString() };
     try {
        const saved = await svc.addInventoryItem(newItem);
        if (!saved) return;
        setInventoryItems(prev => [saved, ...prev]);
     } catch (e) {
        console.error(e);
        alert('Failed to add inventory item.');
     }
  };
  const handleAddPayout = async (p: Omit<Payout, 'id' | 'createdAt'>) => {
     const newP: Payout = { ...p, id: `pay_${Date.now()}`, createdAt: new Date().toISOString() };
     try {
        const saved = await svc.addPayout(newP);
        if (!saved) return;
        setPayouts(prev => [saved, ...prev]);
     } catch (e) {
        console.error(e);
        alert('Failed to add payout.');
     }
  };
  const handleAddRfq = async (r: Omit<RFQ, 'id' | 'createdAt' | 'status'>) => {
     const newR: RFQ = { ...r, id: `rfq_${Date.now()}`, status: 'open', createdAt: new Date().toISOString() };
     try {
        const saved = await svc.addRfq(newR);
        if (!saved) return;
        setRfqs(prev => [saved, ...prev]);
     } catch (e) {
        console.error(e);
        alert('Failed to add RFQ.');
     }
  };
  const handleAddRoutePlan = async (rp: Omit<RoutePlan, 'id' | 'createdAt'>) => {
     const newRP: RoutePlan = { ...rp, id: `route_${Date.now()}`, createdAt: new Date().toISOString() };
     try {
        const saved = await svc.addRoutePlan(newRP);
        if (!saved) return;
        setRoutePlans(prev => [saved, ...prev]);
     } catch (e) {
        console.error(e);
        alert('Failed to add route plan.');
     }
  };

  const handleRaiseDispute = async (payload: { orderId: string; raisedBy: string; role: UserRole; issue: string; details?: string; amount?: number }) => {
      const newDispute: Dispute = {
         id: `disp_${Date.now()}`,
         orderId: payload.orderId,
         raisedBy: payload.raisedBy,
         role: payload.role,
         issue: payload.issue,
         details: payload.details,
         amount: payload.amount,
         status: 'open',
         createdAt: new Date().toISOString()
      };
     try {
        const saved = await svc.raiseDispute(newDispute);
        if (!saved) return;
        setDisputes(prev => [saved, ...prev]);
     } catch (e) {
        console.error(e);
        alert('Failed to raise dispute.');
     }
   };

   const handleSendMessage = async (msg: { toUserId: string; text: string; listingId?: string; orderId?: string }) => {
      if (!currentUser) return;
      const newMsg: Message = {
         id: `msg_${Date.now()}`,
         fromUserId: currentUser.id,
         toUserId: msg.toUserId,
         listingId: msg.listingId,
         orderId: msg.orderId,
         text: msg.text,
         timestamp: new Date().toISOString(),
         read: false
      };
     try {
        const saved = await svc.addMessage(newMsg);
        if (!saved) return;
        setMessages(prev => [saved, ...prev]);
     } catch (e) {
        console.error(e);
        alert('Failed to send message.');
     }
   };

   const handleUpdateProfile = async (userId: string, newProfile: any) => {
      await svc.updateUserProfile(userId, newProfile);
      const updatedUsers = allUsers.map(u => u.id === userId ? { ...u, profile: newProfile } : u);
      setAllUsers(updatedUsers);
      if (currentUser?.id === userId) {
         setCurrentUser({ ...currentUser, profile: newProfile });
      }
   };

   return (
      <div className="min-h-screen font-sans text-slate-900 bg-slate-50">
         {connectionError && (
            <div className="bg-red-600 text-white px-4 py-2 text-center text-sm font-bold flex items-center justify-center gap-2 sticky top-0 z-[100]">
               <AlertCircle className="w-4 h-4" />
               {connectionError}
            </div>
         )}
         {screen === 'landing' && <LandingPage onGetStarted={handleGetStarted} onAdminLogin={() => setScreen('admin-login')} />}
         {screen === 'choose-role' && <ChooseRole onSelect={handleRoleSelect} onBack={() => setScreen('landing')} />}
        {screen === 'auth' && <div className="min-h-screen bg-gradient-to-br from-nature-50 to-blue-50 flex items-center justify-center p-4"><AuthWizard initialRole={selectedRole} initialMode={authMode} onComplete={handleAuthComplete} onBack={() => setScreen('landing')} /></div>}
         {screen === 'admin-login' && <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4"><AdminLogin onLogin={handleAdminLogin} onBack={() => setScreen('landing')} /></div>}

         {screen === 'dashboard' && currentUser?.role === 'admin' && <AdminDashboard allUsers={allUsers} listings={listings} orders={orders} disputes={disputes} systemConfig={systemConfig} onUpdateConfig={setSystemConfig} onLogout={handleLogout} onUpdateUserStatus={handleUserStatusChange} onResolveDispute={handleResolveDispute} />}
        {screen === 'dashboard' && currentUser?.role === 'farmer' && <FarmerDashboard user={currentUser} listings={listings} offers={offers} orders={orders} messages={messages} inventoryItems={inventoryItems} payouts={payouts} transportRequests={transportRequests} allUsers={allUsers} onAddInventoryItem={handleAddInventoryItem} onAddPayout={handleAddPayout} onSendMessage={handleSendMessage} onAddListing={handleAddListing} onUpdateListing={handleUpdateListing} onUpdateListingStatus={handleUpdateListingStatus} onDeleteListing={handleDeleteListing} onAcceptOffer={handleAcceptOffer} onRejectOffer={handleRejectOffer} onCounterOffer={handleCounterOffer} onUpdateProfile={handleUpdateProfile} onRaiseDispute={handleRaiseDispute} onLogout={handleLogout} onAcceptTransportRequest={handleAcceptTransportRequest} onOpenChat={handleOpenChat} onViewInvoice={handleViewInvoice} onUpdateOrderPayment={handleUpdateOrderPayment} />}
        {screen === 'dashboard' && currentUser?.role === 'buyer' && <BuyerDashboard user={currentUser} listings={listings} offers={offers} orders={orders} messages={messages} rfqs={rfqs} transportRequests={transportRequests} transportBids={transportBids} allUsers={allUsers} onAddRfq={handleAddRfq} onSendMessage={handleSendMessage} onPlaceOffer={handlePlaceOffer} onAcceptOffer={handleAcceptOffer} onCounterOffer={handleCounterOffer} onCancelOffer={handleCancelOffer} onUpdateProfile={handleUpdateProfile} onRaiseDispute={handleRaiseDispute} onLogout={handleLogout} onCreateTransportRequest={handleCreateTransportRequest} onAcceptTransportBid={handleAcceptTransportBid} onCounterTransportBid={handleCounterTransportBid} onUpdateTransportRequest={handleUpdateTransportRequest} onOpenChat={handleOpenChat} onViewInvoice={handleViewInvoice} onUpdateOrderPayment={handleUpdateOrderPayment} onDirectBuy={handleDirectBuy} />}
        {screen === 'dashboard' && currentUser?.role === 'transporter' && <TransporterDashboard user={currentUser} orders={orders} messages={messages} routePlans={routePlans} transportRequests={transportRequests} transportBids={transportBids} allUsers={allUsers} onAddRoutePlan={handleAddRoutePlan} onSendMessage={handleSendMessage} onRaiseDispute={handleRaiseDispute} onLogout={handleLogout} onUpdateOrderStatus={handleUpdateOrderStatus} onUpdateProfile={handleUpdateProfile} onAddTransportBid={handleAddTransportBid} onUpdateTransportRequestStatus={handleUpdateTransportRequestStatus} onCounterTransportBid={handleCounterTransportBid} onTransporterAcceptBuyerCounter={handleTransporterAcceptBuyerCounter} onOpenChat={handleOpenChat} />}
         
         <ChatDrawer 
            open={chatDrawer.open} 
            onClose={() => setChatDrawer(prev => ({ ...prev, open: false }))}
            messages={messages}
            offers={offers}
            currentUserId={currentUser?.id || ''}
            targetUserId={chatDrawer.targetUserId}
            targetUserName={chatDrawer.targetUserName}
            listingId={chatDrawer.listingId}
            orderId={chatDrawer.orderId}
            offerId={chatDrawer.offerId}
            onSendMessage={(text, listingId, orderId) => handleSendMessage({
               toUserId: chatDrawer.targetUserId,
               text,
               listingId,
               orderId
            })}
         />

         <InvoiceModal 
            order={invoiceModal.order}
            onClose={() => setInvoiceModal({ open: false, order: null })}
         />
      </div>
   );
};

export default App;
