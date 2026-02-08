import React, { useState } from 'react';
import { uploadMedia } from './storage';
import * as svc from './dataService';
import { createRoot } from 'react-dom/client';
import {
   Tractor,
   ShoppingBag,
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
   HelpCircle
} from 'lucide-react';
import { Button, Input, Card } from './components/UI';
import VoiceInput from './components/VoiceInput';
import TradeAnimation from './components/TradeAnimation';
import HarvestBackground from './components/HarvestBackground';
import ChooseRole from './components/ChooseRole';
import { analyzeCropImage } from './services/aiService';
import {
   User,
   UserRole,
   CropListing,
   AiAnalysisResult,
   FarmerProfile,
   BuyerProfile,
   TransporterProfile,
   Offer,
   Order,
   OrderStatus,
   Dispute,
   SystemConfig,
   Transaction
} from './types';

// --- MOCK DATA ---
const INITIAL_USERS: User[] = [
   {
      id: 'f1',
      phone: '9999999999',
      email: 'farmer@kisan.com',
      role: 'farmer',
      status: 'active',
      createdAt: '2023-01-15',
      profile: {
         fullName: 'Rajesh Kumar',
         village: 'Sehore',
         district: 'Sehore',
         state: 'Madhya Pradesh',
         language: 'Hindi',
         rating: 4.8,
         totalSales: 24,
         memberSince: '2023-01-15',
         totalLandArea: '5',
         landUnit: 'Acres',
         landType: 'Owned',
         irrigationSource: 'Borewell',
         currentCrops: ['Wheat', 'Soybean'],
         farmingPractices: ['Organic']
      } as FarmerProfile
   },
   {
      id: 'b1',
      phone: '8888888888',
      email: 'buyer@kisan.com',
      role: 'buyer',
      status: 'active',
      createdAt: '2023-02-20',
      profile: {
         fullName: 'Amit Verma',
         businessName: 'Verma Traders',
         city: 'Indore',
         state: 'Madhya Pradesh',
         language: 'Hindi',
         rating: 4.5,
         completedDeals: 15,
         memberSince: '2023-02-20',
         buyerType: 'Wholesaler',
         procurementRegions: ['Indore', 'Ujjain'],
         preferredCrops: ['Wheat', 'Soybean', 'Maize'],
         purchaseCapacity: 'Medium (1–5 tons)',
         purchaseFrequency: 'Weekly'
      } as BuyerProfile
   },
   {
      id: 't1',
      phone: '7777777777',
      email: 'transport@kisan.com',
      role: 'transporter',
      status: 'active',
      createdAt: '2023-03-10',
      profile: {
         fullName: 'Sartaj Singh',
         vehicleType: 'Pickup Truck',
         maxCapacity: '1500',
         approvalStatus: 'approved',
         city: 'Bhopal',
         state: 'Madhya Pradesh',
         language: 'Hindi',
         vehicleNumber: 'MP04GA1234',
         operatingRegions: ['Bhopal', 'Sehore', 'Indore'],
         routeType: 'Inter-district',
         canHandlePerishables: true,
         canHandleBulk: false,
         isCoveredVehicle: true,
         availability: 'Full-time',
         rating: 4.9,
         totalDeliveries: 42,
         onTimeDeliveryRate: 98,
         memberSince: '2023-03-10'
      } as TransporterProfile
   },
];

const INITIAL_LISTINGS: CropListing[] = [
   { id: '1', farmerId: 'f1', farmerName: 'Rajesh Kumar', cropName: 'Wheat (Sharbati)', grade: 'A', quantity: 500, availableQuantity: 500, pricePerKg: 28, description: 'High quality Sharbati wheat, freshly harvested.', imageUrls: ['https://picsum.photos/400/300?random=1'], location: 'Sehore, MP', status: 'active', harvestDate: '2023-10-15', createdAt: new Date().toISOString() },
   { id: '2', farmerId: 'f2', farmerName: 'Sunita Devi', cropName: 'Tomato (Hybrid)', grade: 'B', quantity: 200, availableQuantity: 200, pricePerKg: 15, description: 'Red ripe tomatoes, suitable for processing.', imageUrls: ['https://picsum.photos/400/300?random=2'], location: 'Nashik, MH', status: 'active', harvestDate: '2023-10-20', createdAt: new Date().toISOString() },
];

const INITIAL_ORDERS: Order[] = [
   { id: 'o1', listingId: '1', cropName: 'Wheat (Sharbati)', quantity: 100, totalAmount: 2800, status: 'in_transit', date: '2023-10-25', farmerName: 'Rajesh Kumar', farmerLocation: 'Sehore', buyerName: 'Verma Traders', buyerLocation: 'Indore', distanceKm: 45, transporterId: 't1' },
   { id: 'o2', listingId: '2', cropName: 'Tomato (Hybrid)', quantity: 500, totalAmount: 7500, status: 'confirmed', date: '2023-10-26', farmerName: 'Sunita Devi', farmerLocation: 'Nashik', buyerName: 'Fresh Mart', buyerLocation: 'Mumbai', distanceKm: 160 }
];

const MOCK_HISTORY: Transaction[] = [
   { id: 'h1', date: '2023-09-15', type: 'sale', itemName: 'Wheat (Sharbati)', counterpartyName: 'Verma Traders', amount: 28000, quantity: 1000, status: 'completed', rating: 5 },
   { id: 'h2', date: '2023-08-10', type: 'sale', itemName: 'Soybean', counterpartyName: 'Agro Corp', amount: 45000, quantity: 900, status: 'completed', rating: 4 },
   { id: 'h3', date: '2023-07-22', type: 'sale', itemName: 'Tomato', counterpartyName: 'Fresh Mart', amount: 12000, quantity: 400, status: 'completed', rating: 5 },
   { id: 'h4', date: '2023-09-01', type: 'purchase', itemName: 'Wheat (Sharbati)', counterpartyName: 'Rajesh Kumar', amount: 28000, quantity: 1000, status: 'completed', rating: 5 },
   { id: 'h5', date: '2023-09-20', type: 'delivery', itemName: 'Sehore to Indore', counterpartyName: 'Verma Traders', amount: 1200, status: 'completed', rating: 5 }
];

const MOCK_NOTIFICATIONS = [
   { id: 'n1', type: 'offer' as const, title: 'New Offer Received', message: 'Verma Traders offered ₹32/kg for your Wheat listing (500 kg).', timestamp: '2 hours ago', isRead: false },
   { id: 'n2', type: 'order' as const, title: 'Order Confirmed', message: 'Your order #ORD-2023-456 has been confirmed and is ready for pickup.', timestamp: '5 hours ago', isRead: false },
   { id: 'n3', type: 'price' as const, title: 'Price Alert: Wheat', message: 'Wheat prices have increased by 8% in your district. Current rate: ₹34/kg.', timestamp: '1 day ago', isRead: true },
   { id: 'n4', type: 'system' as const, title: 'Profile Incomplete', message: 'Complete your profile to get 20% more visibility to buyers.', timestamp: '2 days ago', isRead: true },
   { id: 'n5', type: 'offer' as const, title: 'Counter Offer', message: 'Agro Corp countered your price for Soybean at ₹48/kg.', timestamp: '3 days ago', isRead: true },
   { id: 'n6', type: 'order' as const, title: 'Payment Received', message: 'You received ₹28,000 for Order #ORD-2023-321. Check your bank.', timestamp: '5 days ago', isRead: true },
];

const FAQ_DATA = [
   { q: 'How do I list my crops for sale?', a: 'Go to "My Crops" section and click "Add New Crop". Upload photos, enter quantity and price, and publish your listing.' },
   { q: 'How are payments processed?', a: 'Payments are processed through secure bank transfers. Once a buyer confirms receipt, payment is released to your linked bank account within 24-48 hours.' },
   { q: 'What if a buyer disputes the quality?', a: 'You can use the Dispute Resolution center. Our team will review the evidence from both parties and provide a fair resolution.' },
   { q: 'How do I negotiate prices?', a: 'When you receive an offer, you can counter-offer with your preferred price. Negotiations continue until both parties agree.' },
   { q: 'Is my data secure?', a: 'Yes, we use bank-grade encryption to protect your personal and financial information. We never share your data with third parties.' },
];

const INITIAL_DISPUTES: Dispute[] = [
   {
      id: 'd1',
      orderId: 'o1',
      raisedBy: 'Amit Verma',
      role: 'buyer',
      issue: 'Quality mismatch: Received Grade C instead of A',
      details: 'The wheat delivered contains higher moisture content than agreed (14% vs 10%). Also found foreign matter in 2 bags.',
      amount: 2800,
      status: 'open',
      createdAt: new Date().toISOString()
   }
];

// --- 1. LANDING PAGE ---
const LandingPage = ({ onGetStarted, onAdminLogin }: { onGetStarted: (role?: UserRole) => void, onAdminLogin: () => void }) => {
   return (
      <div className="relative min-h-screen flex flex-col">
         <HarvestBackground />
         <header className="px-6 py-4 flex justify-between items-center glass sticky top-0 z-50">
            <div className="flex items-center gap-2">
               <div className="w-10 h-10 bg-nature-600 rounded-xl flex items-center justify-center shadow-lg shadow-nature-600/20">
                  <Leaf className="w-6 h-6 text-white" />
               </div>
               <span className="font-bold text-xl text-nature-900 tracking-tight">KisanSetu</span>
            </div>
            <div className="flex gap-4">
               <button onClick={() => onGetStarted()} className="text-sm font-medium text-slate-600 hover:text-nature-700">Login</button>
               <Button onClick={() => onGetStarted()} className="py-2 px-4 text-sm h-10">Get Started</Button>
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
                  <TradeAnimation />
               </div>

               <Button onClick={() => onGetStarted()} className="text-lg px-8 py-4 shadow-xl shadow-nature-600/20">Join the Network</Button>
            </div>

            <div className="grid md:grid-cols-3 gap-8 w-full max-w-5xl">
               <Card className="group hover:-translate-y-2 transition-transform duration-300 border-t-4 border-nature-500" onClick={() => onGetStarted('farmer')}>
                  <div className="h-12 w-12 bg-nature-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                     <Tractor className="w-6 h-6 text-nature-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Farmer</h3>
                  <p className="text-slate-600 mb-4 text-sm">"I grow crops. I want fair prices without middlemen."</p>
                  <div className="flex items-center text-nature-600 font-medium text-sm group-hover:gap-2 transition-all">Login / Register <ArrowRight className="w-4 h-4 ml-1" /></div>
               </Card>

               <Card className="group hover:-translate-y-2 transition-transform duration-300 border-t-4 border-blue-500" onClick={() => onGetStarted('buyer')}>
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                     <ShoppingBag className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Buyer</h3>
                  <p className="text-slate-600 mb-4 text-sm">"I want reliable supply with transparent pricing."</p>
                  <div className="flex items-center text-blue-600 font-medium text-sm group-hover:gap-2 transition-all">Login / Register <ArrowRight className="w-4 h-4 ml-1" /></div>
               </Card>

               <Card className="group hover:-translate-y-2 transition-transform duration-300 border-t-4 border-orange-500" onClick={() => onGetStarted('transporter')}>
                  <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                     <Truck className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Transporter</h3>
                  <p className="text-slate-600 mb-4 text-sm">"I want verified delivery jobs without chaos."</p>
                  <div className="flex items-center text-orange-600 font-medium text-sm group-hover:gap-2 transition-all">Login / Register <ArrowRight className="w-4 h-4 ml-1" /></div>
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

const AuthWizard = ({ initialRole, onComplete, onBack, existingUsers }: { initialRole: UserRole | null, onComplete: (user: any) => void, onBack: () => void, existingUsers: User[] }) => {
   const [step, setStep] = useState<'identity' | 'verify' | 'password' | 'role-confirm' | 'profile'>('identity');
   const [isLoginMode, setIsLoginMode] = useState(false);
   const [formData, setFormData] = useState({
      role: initialRole,
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
      profile: {} as any
   });
   const [otp, setOtp] = useState('');
   const [emailVerified, setEmailVerified] = useState(false);

   const checkIdentity = async () => {
      // For login mode check
      const users = await svc.getUsers();
      const existingUser = users.find((u: any) => u.phone === formData.phone);
      
      if (existingUser) {
         setIsLoginMode(true);
         setStep('password');
      } else {
         setIsLoginMode(false);
         setStep('verify');
      }
   };

   const handleVerify = () => {
      if (otp === '1234' && emailVerified) {
         setStep('password');
      } else {
         alert("Please enter OTP '1234' and verify email.");
      }
   };

   const handlePasswordSubmit = async () => {
      if (isLoginMode) {
         const loggedInUser = await svc.loginUser(formData.phone);
         
         if (loggedInUser) {
            if (loggedInUser.status === 'suspended') {
               alert("Account suspended. Please contact admin.");
               return;
            }
            // Verify password (mock check since we don't store passwords securely in this demo)
            // In a real app, this would be handled by Supabase Auth or a backend check
            onComplete(loggedInUser);
         }
         else alert("User not found or password incorrect");
      } else {
         setStep('role-confirm');
      }
   };

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
               {step === 'identity' && (
                  <div className="space-y-6 max-w-sm mx-auto w-full">
                     <div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">
                           {isLoginMode ? 'Welcome Back!' : `Get Started`}
                        </h2>
                        <p className="text-slate-500">Enter your details to access your account.</p>
                     </div>
                     <div className="space-y-5">
                        <Input label="Mobile Number" placeholder="98765 43210" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })} icon={<Phone className="w-4 h-4" />} />
                        {!isLoginMode && <Input label="Email Address" type="email" placeholder="you@example.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} icon={<Mail className="w-4 h-4" />} />}
                        <Button className="w-full h-12 text-lg shadow-lg shadow-nature-600/20" onClick={checkIdentity} disabled={!formData.phone || (!isLoginMode && !formData.email)}>
                           Continue <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                     </div>
                  </div>
               )}

               {step === 'verify' && (
                  <div className="space-y-8 max-w-sm mx-auto w-full">
                     <div className="text-center">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600"><ShieldCheck className="w-8 h-8" /></div>
                        <h2 className="text-2xl font-bold text-slate-900">Verify Identity</h2>
                        <p className="text-slate-500 text-sm mt-1">We sent a code to <span className="font-bold text-slate-800">{formData.phone}</span></p>
                     </div>

                     <div className="space-y-6">
                        <div>
                           <label className="text-xs font-bold text-slate-400 uppercase block mb-3 text-center">Enter 4-Digit OTP</label>
                           <div className="flex gap-3 justify-center">
                              {[0, 1, 2, 3].map(i => (
                                 <input
                                    key={i}
                                    id={`otp-${i}`}
                                    maxLength={1}
                                    className="w-14 h-16 text-center text-3xl font-bold bg-slate-50 border border-slate-200 rounded-xl focus:border-nature-500 focus:ring-4 focus:ring-nature-500/10 outline-none transition-all"
                                    value={otp[i] || ''}
                                    onChange={e => {
                                       const v = e.target.value;
                                       if (/^\d*$/.test(v)) {
                                          const n = otp.split('');
                                          n[i] = v;
                                          setOtp(n.join(''));
                                          if (v && i < 3) document.getElementById(`otp-${i + 1}`)?.focus();
                                       }
                                    }}
                                    onKeyDown={e => {
                                       if (e.key === 'Backspace' && !otp[i] && i > 0) {
                                          const n = otp.split('');
                                          n[i - 1] = '';
                                          setOtp(n.join(''));
                                          document.getElementById(`otp-${i - 1}`)?.focus();
                                       }
                                    }}
                                 />
                              ))}
                           </div>
                        </div>

                        <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 flex items-center justify-between">
                           <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${emailVerified ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-400'}`}><Mail className="w-4 h-4" /></div>
                              <div className="text-sm">
                                 <div className="font-medium text-slate-900">Email Verification</div>
                                 <div className="text-xs text-slate-500">{emailVerified ? 'Verified' : 'Pending check'}</div>
                              </div>
                           </div>
                           {!emailVerified && <Button size="sm" variant="outline" onClick={() => setEmailVerified(true)}>Verify</Button>}
                           {emailVerified && <CheckCircle className="w-5 h-5 text-green-600" />}
                        </div>

                        <Button className="w-full h-12" onClick={handleVerify} disabled={otp.length !== 4 || !emailVerified}>Verify & Continue</Button>
                     </div>
                  </div>
               )}

               {step === 'password' && (
                  <div className="space-y-6 max-w-sm mx-auto w-full">
                     <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">{isLoginMode ? 'Enter Password' : 'Set Password'}</h2>
                        <p className="text-slate-500 text-sm">{isLoginMode ? 'Welcome back! Please login.' : 'Secure your account.'}</p>
                     </div>
                     <div className="space-y-5">
                        <Input label="Password" type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} icon={<Lock className="w-4 h-4" />} />
                        {!isLoginMode && (
                           <>
                              <Input label="Confirm Password" type="password" value={formData.confirmPassword} onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })} icon={<ShieldCheck className="w-4 h-4" />} />
                              <div className="flex gap-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                                 {[1, 2, 3, 4].map(i => (<div key={i} className={`flex-1 transition-all duration-500 ${formData.password.length >= (i * 2) ? 'bg-nature-500' : 'bg-transparent'}`} />))}
                              </div>
                           </>
                        )}
                        <Button className="w-full h-12" onClick={handlePasswordSubmit} disabled={isLoginMode ? formData.password.length < 4 : (formData.password.length < 8 || formData.password !== formData.confirmPassword)}>
                           {isLoginMode ? 'Login' : 'Create Account'}
                        </Button>
                     </div>
                  </div>
               )}

               {step === 'role-confirm' && (
                  <div className="space-y-8 max-w-sm mx-auto w-full text-center">
                     <div className="w-20 h-20 bg-nature-50 rounded-full flex items-center justify-center mx-auto text-nature-600 mb-2"><UserIcon className="w-10 h-10" /></div>
                     <div>
                        <h2 className="text-2xl font-bold text-slate-900">Confirm Role</h2>
                        <p className="text-slate-500 mt-2">You are registering as a <span className="font-bold text-nature-700 uppercase bg-nature-100 px-2 py-0.5 rounded">{formData.role}</span></p>
                     </div>
                     <div className="p-4 bg-yellow-50 text-yellow-800 text-sm rounded-xl border border-yellow-100">
                        ⚠️ This cannot be changed later.
                     </div>
                     <div className="space-y-3">
                        <Button className="w-full h-12" onClick={() => setStep('profile')}>Confirm & Continue</Button>
                        <Button variant="ghost" className="w-full" onClick={() => onBack()}>Change Role</Button>
                     </div>
                  </div>
               )}

               {step === 'profile' && (
                  <div className="w-full animate-in fade-in">
                     <div className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900">Complete Profile</h2>
                        <p className="text-slate-500">Tell us more about yourself to get the best experience.</p>
                     </div>
                     {formData.role === 'farmer' && <FarmerRegistration onSubmit={(p) => onComplete({ ...formData, profile: p })} />}
                     {formData.role === 'buyer' && <BuyerRegistration onSubmit={(p) => onComplete({ ...formData, profile: p })} />}
                     {formData.role === 'transporter' && <TransporterRegistration onSubmit={(p) => onComplete({ ...formData, profile: p })} />}
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
   const [data, setData] = useState<BuyerProfile>({ fullName: '', businessName: '', city: '', state: '', language: 'English', buyerType: 'Individual', procurementRegions: [], preferredCrops: [], purchaseCapacity: 'Small (<1 ton)' });

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
                  onChange={e => {
                     const file = e.target.files?.[0];
                     if (!file || file.size > 5 * 1024 * 1024) return;
                     const reader = new FileReader();
                     reader.onloadend = () => setData(prev => ({ ...prev, numberPlatePhoto: reader.result as string }));
                     reader.readAsDataURL(file);
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
                  onChange={e => {
                     const file = e.target.files?.[0];
                     if (!file || file.size > 5 * 1024 * 1024) return;
                     const reader = new FileReader();
                     reader.onloadend = () => setData(prev => ({ ...prev, vehiclePhoto: reader.result as string }));
                     reader.readAsDataURL(file);
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

const FarmerDashboard = ({ user, listings, offers, orders, messages, inventoryItems, pricingRules, payouts, onAddInventoryItem, onAddPricingRule, onAddPayout, onSendMessage, onAddListing, onUpdateListing, onDeleteListing, onUpdateProfile, onUpdateListingStatus, onAcceptOffer, onRejectOffer, onRaiseDispute, onLogout }: any) => {
   const [view, setView] = useState('home');
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
   const myListings = listings.filter((l: any) => l.farmerId === user.id);
   const myOffers = offers.filter((o: any) => myListings.some((l: any) => l.id === o.listingId));
   const myOrders = orders.filter((o: any) => o.farmerName === user.profile.fullName);
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
         estimatedPrice: listing.pricePerKg
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
         description: listing.description || ''
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
      setIsEditingProfile(false);
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
               const result = await analyzeCropImage(updatedImages[0]);
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
         price: '',
         variety: '',
         harvestDate: new Date().toISOString().split('T')[0],
         storageType: 'Ambient',
         moistureContent: '',
         minOrderQuantity: '',
         availableDate: new Date().toISOString().split('T')[0],
         packagingDetails: '',
         description: ''
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
               <SidebarItem id="pricing" label="Pricing" icon={IndianRupee} />
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
                     <SidebarItem id="pricing" label="Pricing" icon={IndianRupee} />
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

               {view === 'pricing' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                     <div><h2 className="text-2xl font-black text-slate-900">Dynamic Pricing</h2><p className="text-slate-500">Create rules to auto-adjust price.</p></div>
                     <Card className="p-6 space-y-4">
                        <div className="grid md:grid-cols-3 gap-4">
                           <select className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-medium outline-nature-500" id="pr-listing">
                              {listings.filter((l: any) => l.farmerId === user.id).map((l: any) => (<option key={l.id} value={l.id}>{l.cropName}</option>))}
                           </select>
                           <select className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-medium outline-nature-500" id="pr-type">
                              <option value="age">By Age</option><option value="demand">By Demand</option><option value="market">By Market</option>
                           </select>
                           <Input id="pr-adj" type="number" placeholder="Adjustment (%)" />
                        </div>
                        <Button className="w-full md:w-auto" onClick={() => {
                           const listingId = (document.getElementById('pr-listing') as HTMLSelectElement)?.value;
                           const type = (document.getElementById('pr-type') as HTMLSelectElement)?.value as any;
                           const adj = Number((document.getElementById('pr-adj') as HTMLInputElement)?.value || 0);
                           if (!listingId || adj === 0) return;
                           onAddPricingRule?.({ listingId, type, adjustmentPercent: adj, active: true });
                        }}>Add Rule</Button>
                     </Card>
                     <Card className="p-6">
                        <div className="grid md:grid-cols-2 gap-4">
                           {(pricingRules || []).filter(r => listings.find((l: any) => l.id === r.listingId)?.farmerId === user.id).map(r => (
                              <div key={r.id} className="p-4 bg-slate-50 rounded-xl">
                                 <div className="text-xs text-slate-400 uppercase font-bold">Rule {r.type}</div>
                                 <div className="font-bold text-slate-900">{listings.find((l: any) => l.id === r.listingId)?.cropName}</div>
                                 <div className="text-sm text-slate-600">{r.adjustmentPercent}% • {r.active ? 'Active' : 'Inactive'}</div>
                              </div>
                           ))}
                           {(pricingRules || []).filter(r => listings.find((l: any) => l.id === r.listingId)?.farmerId === user.id).length === 0 && <div className="text-sm text-slate-400">No pricing rules yet.</div>}
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
                        <Button className="rounded-full shadow-lg shadow-nature-600/20" onClick={() => (document.getElementById('add-crop-btn') as any)?.click()}>
                           <Plus className="w-5 h-5 mr-2" /> Add New Crop
                        </Button>
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
                                    </div>
                                    <div className="flex-1 p-6 md:p-8">
                                       <div className="flex flex-wrap justify-between items-start gap-6 mb-6">
                                          <div>
                                             <div className="flex items-center gap-3 mb-2">
                                                <h4 className="font-bold text-xl text-slate-900 leading-tight">{listing?.cropName}</h4>
                                                <div className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-wider">
                                                   QTY: {o.quantity}kg
                                                </div>
                                             </div>
                                             <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
                                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Bhopal, MP</span>
                                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Received {new Date(o.createdAt).toLocaleDateString()}</span>
                                             </div>
                                          </div>
                                          <div className="text-right">
                                             <div className="flex items-center gap-2 justify-end mb-1">
                                                <div className={`text-3xl font-black tracking-tighter ${isHigher ? 'text-green-600' : 'text-blue-600'} font-display`}>₹{o.pricePerKg}/kg</div>
                                                {isHigher && <div className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded uppercase">+₹{o.pricePerKg - (listing?.pricePerKg || 0)}</div>}
                                             </div>
                                             <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total: ₹{o.totalAmount.toLocaleString()}</div>
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
                                             <Clock className="w-3 h-3" /> EXPLRES IN 08:45:22
                                          </div>
                                       </div>

                                       <div className="flex gap-4">
                                          <button className="flex-1 h-12 text-sm font-black text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all" onClick={() => onRejectOffer(o.id)}>
                                             Reject Offer
                                          </button>
                                          <Button className="flex-[2] h-12 bg-blue-600 hover:bg-blue-700 font-black rounded-2xl shadow-xl shadow-blue-600/20 text-sm tracking-wide" onClick={() => onAcceptOffer(o.id)}>
                                             Accept & Start Deal
                                          </Button>
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
                        {myOrders.length > 0 ? myOrders.map((o: any) => (
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
                                    <Button variant="outline" size="sm" className="h-9 text-xs font-bold"><FileText className="w-4 h-4 mr-2" /> Invoice</Button>
                                    <Button size="sm" className="h-9 text-xs font-bold bg-purple-600 hover:bg-purple-700"><MapPin className="w-4 h-4 mr-2" /> Track Pickup</Button>
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
                              <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                                 <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm"><UserIcon className="w-5 h-5 text-slate-400" /></div>
                                    <div>
                                       <div className="text-[10px] text-slate-400 font-black uppercase">Assigned Transporter</div>
                                       <div className="text-sm font-bold text-slate-700">Ramesh Singh (MP-04-1234)</div>
                                    </div>
                                 </div>
                                 <button className="flex items-center gap-2 px-4 py-2 bg-nature-100 text-nature-700 rounded-xl text-xs font-black hover:bg-nature-200 transition-colors">
                                    <Phone className="w-4 h-4" /> Call Transporter
                                 </button>
                              </div>
                           </Card>
                        )) : (
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
         </div>
      </div>
   );
};

// Buyer and Transporter Dashboards remain the same
const BuyerDashboard = ({ user, listings, offers, orders, messages, rfqs, onAddRfq, onSendMessage, onPlaceOffer, onLogout, onUpdateProfile, onRaiseDispute }: any) => {
   const [view, setView] = useState('home');
   const [searchTerm, setSearchTerm] = useState('');
   const [selectedListing, setSelectedListing] = useState<any>(null);
   const [showOfferModal, setShowOfferModal] = useState(false);
   const [offerData, setOfferData] = useState({ quantity: 0, price: 0 });

   // Buyer Profile State
   const [profileData, setProfileData] = useState<BuyerProfile>(user.profile || { fullName: user.phone, city: '', state: '', language: 'English' });
   const [profileTab, setProfileTab] = useState<'overview' | 'edit'>('overview');

   // Marketplace State
   const [marketFilter, setMarketFilter] = useState<'all' | 'Vegetables' | 'Grains' | 'Fruits'>('all');
   const [marketSort, setMarketSort] = useState<'newest' | 'price_low' | 'price_high'>('newest');

   // Notifications State
   const [notifications, setNotifications] = useState([
      { id: 'b1', type: 'offer', title: 'Offer Accepted', message: 'Your offer for 500kg Wheat has been accepted by Ramesh Kumar.', timestamp: '2 hours ago', isRead: false },
      { id: 'b2', type: 'order', title: 'Order Dispatched', message: 'Order #ORD-123 is now in transit. Track shipment.', timestamp: '5 hours ago', isRead: false },
      { id: 'b3', type: 'system', title: 'Market Alert', message: 'Soybean prices dropped by 5% in Indore region.', timestamp: '1 day ago', isRead: true },
   ]);
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
   const myOrders = orders.filter((o: any) => o.buyerName === user.profile.fullName);
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

   const handlePlaceOfferSubmit = () => {
      onPlaceOffer({
         listingId: selectedListing.id,
         cropName: selectedListing.cropName,
         buyerName: user.profile.fullName,
         buyerLocation: user.profile.city,
         pricePerKg: offerData.price,
         quantity: offerData.quantity,
         totalAmount: offerData.price * offerData.quantity
      });
      setShowOfferModal(false);
      setSelectedListing(null);
      setView('offers');
   };

   return (
      <div className="flex h-screen bg-slate-50 overflow-hidden">
         {/* Sidebar */}
         <aside className="w-64 bg-white border-r border-slate-200 flex flex-col p-4">
            <div className="flex items-center gap-2 mb-8 px-2">
               <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white"><ShoppingBag className="w-5 h-5" /></div>
               <span className="font-bold text-xl text-slate-900 leading-tight">KisanSetu <br /><span className="text-blue-600 text-xs">Buyer Portal</span></span>
            </div>
            <nav className="space-y-1 flex-1 overflow-y-auto">
               {[
                  { id: 'home', label: 'Marketplace', icon: Store },
                  { id: 'offers', label: 'My Offers', icon: ShoppingBag, badge: myOffers.length },
                  { id: 'orders', label: 'My Orders', icon: Package, badge: myOrders.length },
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
                     className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${view === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-600 hover:bg-slate-100'}`}
                  >
                     <item.icon className="w-5 h-5" />
                     <span className="flex-1 text-left">{item.label}</span>
                     {item.badge > 0 && <span className={`text-[10px] px-2 py-0.5 rounded-full ${view === item.id ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600'}`}>{item.badge}</span>}
                  </button>
               ))}
            </nav>
            <button onClick={onLogout} className="mt-auto flex items-center gap-2 px-4 py-3 text-slate-400 hover:text-red-600 font-medium transition-colors"><LogOut className="w-5 h-5" /> Logout</button>
         </aside>

         {/* Main Content */}
         <main className="flex-1 overflow-y-auto p-8 relative h-screen">
            {view === 'home' && (
               <div className="space-y-8 animate-in fade-in">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                     <div>
                        <h2 className="text-3xl font-bold text-slate-900">Crop Marketplace</h2>
                        <p className="text-slate-500">Find and source premium crops directly from farmers</p>
                     </div>
                     <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                        <div className="relative w-full md:w-64">
                           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                           <input
                              type="text"
                              placeholder="Search crops..."
                              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                              value={searchTerm}
                              onChange={e => setSearchTerm(e.target.value)}
                           />
                        </div>
                        <select
                           className="px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 font-bold text-slate-600 cursor-pointer"
                           value={marketSort}
                           onChange={(e: any) => setMarketSort(e.target.value)}
                        >
                           <option value="newest">Newest First</option>
                           <option value="price_low">Price: Low to High</option>
                           <option value="price_high">Price: High to Low</option>
                        </select>
                     </div>
                  </div>

                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                     {(['all', 'Vegetables', 'Grains', 'Fruits'] as const).map(filter => (
                        <button
                           key={filter}
                           onClick={() => setMarketFilter(filter)}
                           className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-all ${marketFilter === filter
                              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
                        >
                           {filter === 'all' ? 'All Crops' : filter}
                        </button>
                     ))}
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {filteredListings.map(l => (
                        <Card key={l.id} className="p-0 overflow-hidden group hover:shadow-2xl transition-all duration-500 border-slate-200 hover:border-blue-300">
                           <div className="h-48 overflow-hidden relative">
                              <img src={l.imageUrls?.[0] || l.imageUrl} alt={l.cropName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                              <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-black uppercase text-blue-700 shadow-sm border border-blue-100">Grade {l.grade}</div>
                           </div>
                           <div className="p-6">
                              <div className="flex justify-between items-start mb-4">
                                 <div>
                                    <h4 className="font-bold text-lg text-slate-900">{l.cropName}</h4>
                                    <div className="flex items-center gap-1 text-xs text-slate-400 mt-1 font-medium"><MapPin className="w-3 h-3" /> {l.location}</div>
                                 </div>
                                 <div className="text-right">
                                    <div className="text-xl font-black text-blue-600">₹{l.pricePerKg}/kg</div>
                                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Asking Price</div>
                                 </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-100 mb-6 bg-slate-50/50 -mx-6 px-6">
                                 <div>
                                    <div className="text-[10px] text-slate-400 font-black uppercase mb-1">Stock</div>
                                    <div className="font-bold text-slate-700">{l.availableQuantity || l.quantity} kg</div>
                                 </div>
                                 <div>
                                    <div className="text-[10px] text-slate-400 font-black uppercase mb-1">Farmer</div>
                                    <div className="font-bold text-slate-700 truncate">{l.farmerName}</div>
                                 </div>
                              </div>
                              <div className="flex gap-2">
                                 <Button variant="outline" className="flex-1 h-11 text-xs font-bold border-slate-200" onClick={() => setSelectedListing(l)}>Details</Button>
                                 <Button className="flex-[2] h-11 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 text-xs font-bold" onClick={() => { setSelectedListing(l); setOfferData({ quantity: l.availableQuantity || l.quantity, price: l.pricePerKg }); setShowOfferModal(true); }}>Place Offer</Button>
                              </div>
                           </div>
                        </Card>
                     ))}
                  </div>
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
                     {myOffers.map(o => (
                        <Card key={o.id} className="p-6 border-slate-200 hover:border-blue-400 transition-colors">
                           <div className="flex justify-between items-center">
                              <div className="flex gap-4 items-center">
                                 <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600"><ShoppingBag className="w-6 h-6" /></div>
                                 <div>
                                    <h4 className="font-bold text-slate-900">{o.cropName}</h4>
                                    <p className="text-sm text-slate-500">₹{o.pricePerKg}/kg • {o.quantity}kg</p>
                                 </div>
                              </div>
                              <div className="text-right">
                                 <div className="text-lg font-black text-slate-900 mb-1">₹{o.totalAmount.toLocaleString()}</div>
                                 <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${o.status === 'accepted' ? 'bg-green-100 text-green-700' :
                                    o.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                    }`}>
                                    {o.status}
                                 </span>
                              </div>
                           </div>
                        </Card>
                     ))}
                     {myOffers.length === 0 && <div className="text-center py-20 text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200">No offers placed yet. Browse the marketplace to start.</div>}
                  </div>
               </div>
            )}

            {view === 'orders' && (
               <div className="space-y-6 animate-in slide-in-from-right-4">
                  <h2 className="text-2xl font-bold text-slate-900">Purchase Orders</h2>
                  <div className="grid gap-6">
                     {myOrders.map(o => (
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
                           <div className="pt-4 border-t border-slate-50">
                              <div className="flex justify-between items-center mb-4">
                                 <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                    <Calendar className="w-4 h-4" /> Ordered on {new Date(o.date).toLocaleDateString()}
                                 </div>
                                 <div className="flex gap-2">
                                    <Button variant="ghost" className="h-8 text-xs font-bold"><FileText className="w-3 h-3 mr-1" /> Invoice</Button>
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
                     ))}
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
      </div>
   );
};

/* Re-adding Transporter Dashboard */
const TransporterDashboard = ({ user, orders, messages, routePlans, onAddRoutePlan, onSendMessage, onLogout, onAcceptJob, onUpdateOrderStatus, onUpdateProfile, onRaiseDispute }: any) => {
   const [view, setView] = useState('home');

   // Vehicle & Profile State
   const [vehicleData, setVehicleData] = useState({ type: 'Mini Truck', number: 'MH-12-DT-8899', capacity: '2000', available: true });
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
   const [notifications, setNotifications] = useState([
      { id: 't1', type: 'job', title: 'New Load Available', message: '500kg Wheat from Nashik to Mumbai requires transport.', timestamp: '10 mins ago', isRead: false },
      { id: 't2', type: 'system', title: 'Payment Received', message: 'Payment of ₹4,500 for Order #ORD-101 has been credited.', timestamp: '1 day ago', isRead: true },
   ]);
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


   const availableJobs = orders.filter((o: any) => o.status === 'confirmed' && !o.transporterId);
   const myDeliveries = orders.filter((o: any) => o.transporterId === user.id);
   const completedDeliveries = myDeliveries.filter((o: any) => o.status === 'delivered');
   const activeDeliveries = myDeliveries.filter((o: any) => o.status !== 'delivered');

   const totalEarnings = completedDeliveries.reduce((sum: number, o: any) => sum + (o.distanceKm || 0) * 15, 0); // Mock rate ₹15/km

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
                     {availableJobs.map(o => (
                        <Card key={o.id} className="p-0 overflow-hidden border-orange-100 group hover:shadow-2xl transition-all duration-500">
                           <div className="flex flex-col md:flex-row">
                              <div className="p-6 md:p-8 flex-1">
                                 <div className="flex justify-between items-start mb-6">
                                    <div className="flex gap-4">
                                       <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-orange-600 transition-colors"><MapPin className="w-7 h-7" /></div>
                                       <div>
                                          <div className="text-xs text-orange-600 font-black uppercase tracking-widest mb-1">New Load Available</div>
                                          <h4 className="font-bold text-xl text-slate-800">{o.cropName} • {o.quantity} kg</h4>
                                       </div>
                                    </div>
                                    <div className="text-right">
                                       <div className="text-2xl font-black text-slate-900">₹{(o.distanceKm || 45) * 15}</div>
                                       <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Est. Payout</div>
                                    </div>
                                 </div>

                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-y border-slate-100 mb-6 font-medium">
                                    <div className="flex gap-3 items-center">
                                       <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs">A</div>
                                       <div>
                                          <div className="text-[10px] text-slate-400 uppercase font-black">Pickup</div>
                                          <div className="text-sm font-bold truncate">{o.farmerLocation}</div>
                                       </div>
                                    </div>
                                    <div className="flex justify-center items-center py-2 md:py-0">
                                       <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-full border border-slate-100 text-[10px] font-black text-slate-500 uppercase">
                                          <Timer className="w-3 h-3" /> {o.distanceKm || 45} KM
                                       </div>
                                    </div>
                                    <div className="flex gap-3 items-center">
                                       <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs">B</div>
                                       <div className="text-right md:text-left flex-1">
                                          <div className="text-[10px] text-slate-400 uppercase font-black">Delivery</div>
                                          <div className="text-sm font-bold truncate">{o.buyerLocation}</div>
                                       </div>
                                    </div>
                                 </div>

                                 <div className="flex gap-4">
                                    <Button variant="outline" className="flex-1 h-12 font-bold border-slate-200">View Map Route</Button>
                                    <Button className="flex-[2] h-12 bg-orange-600 hover:bg-orange-700 shadow-xl shadow-orange-600/20 font-black" onClick={() => onAcceptJob(o.id, user.id)}>
                                       Accept Job
                                    </Button>
                                 </div>
                              </div>
                           </div>
                        </Card>
                     ))}
                     {availableJobs.length === 0 && <div className="py-24 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-white/50">No loads currently available in your region. Check back soon.</div>}
                  </div>
               </div>
            )}

            {view === 'deliveries' && (
               <div className="space-y-6 animate-in slide-in-from-right-4">
                  <h2 className="text-2xl font-bold text-slate-900">My Active Shipments</h2>
                  <div className="grid gap-6">
                     {activeDeliveries.map(o => (
                        <Card key={o.id} className="p-6 border-orange-100 bg-white">
                           <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
                              <div className="flex gap-4">
                                 <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 shadow-sm"><Route className="w-8 h-8" /></div>
                                 <div>
                                    <h3 className="text-lg font-bold text-slate-900">Order #{o.id} • {o.cropName}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                       <span className="px-3 py-1 bg-orange-100 text-orange-800 text-[10px] font-black rounded-full uppercase tracking-widest">{o.status.replace('_', ' ')}</span>
                                       <span className="text-xs text-slate-400 font-medium">{o.quantity}kg • To {o.buyerLocation}</span>
                                    </div>
                                 </div>
                              </div>
                              <div className="text-right w-full md:w-auto">
                                 <div className="text-xs text-slate-400 font-bold uppercase mb-1">Status Update</div>
                                 <select
                                    className="w-full md:w-48 h-10 bg-slate-100 border-none rounded-xl px-3 text-xs font-bold outline-orange-500"
                                    value={o.status}
                                    onChange={(e) => onUpdateOrderStatus(o.id, e.target.value as OrderStatus)}
                                 >
                                    <option value="confirmed">Waiting Pickup</option>
                                    <option value="in_transit">In Transit</option>
                                    <option value="delivered">Delivered</option>
                                 </select>
                              </div>
                           </div>

                           {/* Step Progress Mock */}
                           <div className="relative pt-2 pb-6 px-1">
                              <div className="absolute top-6 left-0 right-0 h-1 bg-slate-100 -z-10" />
                              <div className="absolute top-6 left-0 h-1 bg-orange-500 -z-10 transition-all duration-700" style={{ width: o.status === 'in_transit' ? '50%' : '5%' }} />
                              <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                                 <div className={o.status !== 'confirmed' ? 'text-orange-600' : ''}>Confirmed</div>
                                 <div className={o.status === 'in_transit' || o.status === 'delivered' ? 'text-orange-600' : ''}>In Transit</div>
                                 <div className={o.status === 'delivered' ? 'text-orange-600' : ''}>Delivered</div>
                              </div>
                           </div>

                           <div className="flex gap-3 mt-4">
                              <Button variant="outline" className="flex-1 h-10 text-xs font-bold border-dashed border-slate-300 hover:border-orange-500 hover:text-orange-600 transition-colors"><FileText className="w-4 h-4 mr-2" /> Upload POD</Button>
                              <Button className="flex-1 h-10 text-xs font-bold bg-orange-600 hover:bg-orange-700"><Phone className="w-4 h-4 mr-2" /> Contact Farmer</Button>
                              <Button variant="outline" className="flex-1 h-10 text-xs font-bold" onClick={() => {
                                 const issue = prompt('Describe the issue with this delivery');
                                 if (!issue) return;
                                 onRaiseDispute?.({ orderId: o.id, raisedBy: user.profile.fullName, role: 'transporter', issue });
                              }}>Report Issue</Button>
                              <Button variant="outline" className="flex-1 h-10 text-xs font-bold" onClick={() => {
                                 const stops = [{ name: 'Pickup', eta: new Date().toLocaleTimeString() }, { name: 'Drop', eta: new Date(Date.now() + 3600000).toLocaleTimeString() }];
                                 onAddRoutePlan?.({ transporterId: user.id, orderId: o.id, stops });
                              }}>Create Route</Button>
                           </div>
                        </Card>
                     ))}
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
                                 <th className="px-6 py-4">Date</th>
                                 <th className="px-6 py-4">Distance</th>
                                 <th className="px-6 py-4 text-right">Amount</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-100">
                              {completedDeliveries.map(o => (
                                 <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-slate-700">#{o.id}</td>
                                    <td className="px-6 py-4 text-slate-500">{new Date(o.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-slate-500">{o.distanceKm || 45} KM</td>
                                    <td className="px-6 py-4 text-right font-black text-slate-900">₹{(o.distanceKm || 45) * 15}</td>
                                 </tr>
                              ))}
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
                     <div><h2 className="text-2xl font-black text-slate-900">Vehicle Management</h2><p className="text-slate-500">Manage your fleet and availability.</p></div>
                     <Button className="bg-orange-600 hover:bg-orange-700 font-bold"><Plus className="w-5 h-5 mr-1" /> Add Vehicle</Button>
                  </div>
                  <Card className="p-6 border-orange-100 bg-white">
                     <div className="flex flex-col md:flex-row gap-6 items-start">
                        <div className="w-full md:w-64 h-40 bg-slate-100 rounded-xl flex items-center justify-center text-slate-300">
                           {profileData.vehiclePhoto ? <img src={profileData.vehiclePhoto} alt="Vehicle" className="w-full h-full object-cover rounded-xl" /> : <Truck className="w-16 h-16" />}
                        </div>
                        <div className="flex-1 space-y-4 w-full">
                           <div className="flex justify-between items-start">
                              <div><h3 className="text-xl font-bold text-slate-900">{profileData.vehicleName || profileData.vehicleType}</h3><p className="text-sm text-slate-500 font-bold uppercase tracking-wider">{profileData.vehicleNumber || vehicleData.number}</p></div>
                              <div className="flex items-center gap-2"><span className={`w-3 h-3 rounded-full ${vehicleData.available ? 'bg-green-500' : 'bg-slate-300'}`}></span><span className="text-sm font-bold text-slate-700">{vehicleData.available ? 'Available' : 'Off Duty'}</span></div>
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                              <div className="p-3 bg-slate-50 rounded-lg"><div className="text-[10px] text-slate-400 font-bold uppercase">Max Capacity</div><div className="font-bold text-slate-900">{profileData.maxCapacity || vehicleData.capacity} kg</div></div>
                              <div className="p-3 bg-slate-50 rounded-lg"><div className="text-[10px] text-slate-400 font-bold uppercase">Permit Type</div><div className="font-bold text-slate-900">All India</div></div>
                           </div>
                           {profileData.numberPlatePhoto && <div className="pt-2"><img src={profileData.numberPlatePhoto} alt="Number Plate" className="h-16 object-cover rounded-lg border border-slate-200" /></div>}
                           <div className="flex gap-3 pt-2">
                              <Button variant="outline" className="flex-1 font-bold">Edit Details</Button>
                              <Button variant="outline" className={`flex-1 font-bold ${vehicleData.available ? 'text-red-600 border-red-100 hover:bg-red-50' : 'text-green-600 border-green-100 hover:bg-green-50'}`} onClick={() => setVehicleData(prev => ({ ...prev, available: !prev.available }))}>{vehicleData.available ? 'Go Offline' : 'Go Online'}</Button>
                           </div>
                        </div>
                     </div>
                  </Card>
               </div>
            )}

            {/* ===== PROFILE VIEW ===== */}
            {view === 'profile' && (
               <div className="space-y-6 animate-in slide-in-from-right-4">
                  <div className="flex flex-col md:flex-row gap-6">
                     <Card className="w-full md:w-80 p-6 h-fit text-center">
                        <div className="w-24 h-24 bg-orange-100 rounded-full mx-auto flex items-center justify-center text-orange-600 mb-4 text-3xl font-black">{user.profile.fullName.charAt(0)}</div>
                        <h2 className="text-xl font-bold text-slate-900">{user.profile.fullName}</h2>
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
                                       <div className="grid md:grid-cols-2 gap-4"><Input label="Full Name" value={profileData.fullName} onChange={e => setProfileData({ ...profileData, fullName: e.target.value })} /><Input label="Language" value={profileData.language} onChange={e => setProfileData({ ...profileData, language: e.target.value })} /></div>
                                       <div className="grid md:grid-cols-2 gap-4"><Input label="City" value={profileData.city} onChange={e => setProfileData({ ...profileData, city: e.target.value })} /><Input label="State" value={profileData.state} onChange={e => setProfileData({ ...profileData, state: e.target.value })} /></div>
                                    </div>
                                 )}

                                 {editSection === 'business' && (
                                    <div className="space-y-4 animate-in fade-in">
                                       <Input label="Business/Firm Name" value={profileData.businessName} onChange={e => setProfileData({ ...profileData, businessName: e.target.value })} />
                                       <div className="grid md:grid-cols-2 gap-4"><Input label="GSTIN" value={profileData.gstin} onChange={e => setProfileData({ ...profileData, gstin: e.target.value })} /><Input label="PAN Number" value={profileData.pan} onChange={e => setProfileData({ ...profileData, pan: e.target.value })} /></div>
                                       <Input label="Operating Regions (Comma separated)" placeholder="e.g. Mumbai, Pune, Nashik" />
                                    </div>
                                 )}

                                 {editSection === 'bank' && (
                                    <div className="space-y-4 animate-in fade-in">
                                       <div className="p-3 bg-blue-50 text-blue-700 rounded-lg text-sm mb-4 flex gap-2"><Lock className="w-4 h-4 mt-0.5" /> Bank details are securely stored and used only for payouts.</div>
                                       <Input label="Account Holder Name" value={profileData.bankDetails?.holderName} onChange={e => setProfileData({ ...profileData, bankDetails: { ...profileData.bankDetails!, holderName: e.target.value } })} />
                                       <div className="grid md:grid-cols-2 gap-4">
                                          <Input label="Account Number" value={profileData.bankDetails?.accountNumber} onChange={e => setProfileData({ ...profileData, bankDetails: { ...profileData.bankDetails!, accountNumber: e.target.value } })} />
                                          <Input label="IFSC Code" value={profileData.bankDetails?.ifsc} onChange={e => setProfileData({ ...profileData, bankDetails: { ...profileData.bankDetails!, ifsc: e.target.value } })} />
                                       </div>
                                       <Input label="Bank Name" value={profileData.bankDetails?.bankName} onChange={e => setProfileData({ ...profileData, bankDetails: { ...profileData.bankDetails!, bankName: e.target.value } })} />
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
                                                onChange={e => {
                                                   const file = e.target.files?.[0];
                                                   if (!file || file.size > 5 * 1024 * 1024) return;
                                                   const reader = new FileReader();
                                                   reader.onloadend = () => setProfileData(prev => ({ ...prev, numberPlatePhoto: reader.result as string }));
                                                   reader.readAsDataURL(file);
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
                                                onChange={e => {
                                                   const file = e.target.files?.[0];
                                                   if (!file || file.size > 5 * 1024 * 1024) return;
                                                   const reader = new FileReader();
                                                   reader.onloadend = () => setProfileData(prev => ({ ...prev, vehiclePhoto: reader.result as string }));
                                                   reader.readAsDataURL(file);
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
                              const toUser = (listings.length && toName) ? null : null;
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

   // STATE
   const [allUsers, setAllUsers] = useState<User[]>(INITIAL_USERS);
   const [listings, setListings] = useState<CropListing[]>(INITIAL_LISTINGS);
   const [offers, setOffers] = useState<Offer[]>([]);
   const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
   const [disputes, setDisputes] = useState<Dispute[]>(INITIAL_DISPUTES);
   const [messages, setMessages] = useState<Message[]>([]);
   const [systemConfig, setSystemConfig] = useState<SystemConfig>({ offerExpiryHours: 24, maxListingsPerFarmer: 20, maxActiveJobsPerTransporter: 3, platformFeePercent: 2 });
   const [currentUser, setCurrentUser] = useState<User | null>(null);
   const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
   const [pricingRules, setPricingRules] = useState<PricingRule[]>([]);
   const [payouts, setPayouts] = useState<Payout[]>([]);
   const [rfqs, setRfqs] = useState<RFQ[]>([]);
   const [routePlans, setRoutePlans] = useState<RoutePlan[]>([]);

   // Load data from Supabase on mount
   React.useEffect(() => {
      const loadData = async () => {
         const [u, l, off, ord, d, m, inv, pr, pay, r, rp] = await Promise.all([
            svc.getUsers(),
            svc.getListings(),
            svc.getOffers(),
            svc.getOrders(),
            svc.getDisputes(),
            svc.getMessages(),
            svc.getInventoryItems(),
            svc.getPricingRules(),
            svc.getPayouts(),
            svc.getRfqs(),
            svc.getRoutePlans()
         ]);
         
         if (u && u.length > 0) setAllUsers(u);
         if (l && l.length > 0) setListings(l);
         if (off && off.length > 0) setOffers(off);
         if (ord && ord.length > 0) setOrders(ord);
         if (d && d.length > 0) setDisputes(d);
         if (m && m.length > 0) setMessages(m);
         if (inv && inv.length > 0) setInventoryItems(inv);
         if (pr && pr.length > 0) setPricingRules(pr);
         if (pay && pay.length > 0) setPayouts(pay);
         if (r && r.length > 0) setRfqs(r);
         if (rp && rp.length > 0) setRoutePlans(rp);
      };
      loadData();
   }, []);

   const handleGetStarted = (role?: UserRole) => {
      if (role) {
         setScreen('auth');
         setSelectedRole(role);
      } else {
         setScreen('choose-role');
      }
   };
   const handleRoleSelect = (role: UserRole) => { setSelectedRole(role); setScreen('auth'); };
   const handleAuthComplete = async (userData: any) => {
      let user = userData;
      if (!userData.id) {
         user = { ...userData, id: `u_${Date.now()}`, status: 'active', createdAt: new Date().toISOString() };
         await svc.addUser(user);
         setAllUsers([...allUsers, user]);
      }
      setCurrentUser(user); setScreen('dashboard');
   };
   const handleAdminLogin = () => { setCurrentUser({ id: 'admin', phone: '0000', role: 'admin', status: 'active', createdAt: new Date().toISOString() }); setScreen('dashboard'); };
   const handleLogout = () => { setCurrentUser(null); setScreen('landing'); };
   const handleAddListing = async (l: any) => { await svc.addListing(l); setListings([l, ...listings]); };
   const handleUpdateListing = (updatedListing: any) => { svc.updateListing(updatedListing); setListings(listings.map(l => l.id === updatedListing.id ? updatedListing : l)); };
   const handleUpdateListingStatus = (id: string, status: ListingStatus) => { svc.updateListingStatus(id, status); setListings(listings.map(l => l.id === id ? { ...l, status } : l)); };

   const handleDeleteListing = (id: string) => { svc.deleteListing(id); setListings(listings.filter(l => l.id !== id)); };

   const handlePlaceOffer = async (offer: any) => { const newOffer = { ...offer, id: `off_${Date.now()}`, status: 'pending', createdAt: new Date().toISOString() }; await svc.placeOffer(newOffer); setOffers([newOffer, ...offers]); };

   const handleAcceptOffer = async (offerId: string) => {
      const offer = offers.find(o => o.id === offerId);
      if (!offer) return;
      const listing = listings.find(l => l.id === offer.listingId);
      if (!listing) return;

      const newOrder: Order = {
         id: `ord_${Date.now()}`,
         listingId: listing.id,
         cropName: listing.cropName,
         quantity: offer.quantityRequested,
         totalAmount: offer.offeredPrice * offer.quantityRequested,
         status: 'confirmed',
         date: new Date().toISOString(),
         farmerName: listing.farmerName,
         farmerLocation: listing.location,
         buyerName: offer.buyerName,
         buyerLocation: offer.buyerLocation
      };

      await svc.createOrder(newOrder);
      await svc.setOfferStatus(offerId, 'accepted');
      setOrders([newOrder, ...orders]);
      setOffers(offers.map(o => o.id === offerId ? { ...o, status: 'accepted' } : o));
      setListings(listings.map(l => l.id === listing.id ? { ...l, availableQuantity: l.availableQuantity - offer.quantityRequested } : l));
   };

   const handleRejectOffer = async (offerId: string) => { await svc.setOfferStatus(offerId, 'rejected'); setOffers(offers.map(o => o.id === offerId ? { ...o, status: 'rejected' } : o)); };

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

   const handleAcceptJob = (orderId: string, transporterId: string) => {
      setOrders(orders.map(o => o.id === orderId ? { ...o, transporterId } : o));
   };

   const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => { await svc.setOrderStatus(orderId, newStatus); setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o)); };

   const handleResolveDispute = async (disputeId: string, outcome: string) => { await svc.resolveDispute(disputeId, 'resolved'); setDisputes(disputes.map(d => d.id === disputeId ? { ...d, status: 'resolved' } : d)); };

   const handleAddInventoryItem = async (item: Omit<InventoryItem, 'id' | 'createdAt'>) => {
      const newItem: InventoryItem = { ...item, id: `inv_${Date.now()}`, createdAt: new Date().toISOString() };
      await svc.addInventoryItem(newItem);
      setInventoryItems([newItem, ...inventoryItems]);
   };
   const handleAddPricingRule = async (rule: Omit<PricingRule, 'id' | 'createdAt'>) => {
      const newRule: PricingRule = { ...rule, id: `pr_${Date.now()}`, createdAt: new Date().toISOString() };
      await svc.addPricingRule(newRule);
      setPricingRules([newRule, ...pricingRules]);
   };
   const handleAddPayout = async (p: Omit<Payout, 'id' | 'createdAt'>) => {
      const newP: Payout = { ...p, id: `pay_${Date.now()}`, createdAt: new Date().toISOString() };
      await svc.addPayout(newP);
      setPayouts([newP, ...payouts]);
   };
   const handleAddRfq = async (r: Omit<RFQ, 'id' | 'createdAt' | 'status'>) => {
      const newR: RFQ = { ...r, id: `rfq_${Date.now()}`, status: 'open', createdAt: new Date().toISOString() };
      await svc.addRfq(newR);
      setRfqs([newR, ...rfqs]);
   };
   const handleAddRoutePlan = async (rp: Omit<RoutePlan, 'id' | 'createdAt'>) => {
      const newRP: RoutePlan = { ...rp, id: `route_${Date.now()}`, createdAt: new Date().toISOString() };
      await svc.addRoutePlan(newRP);
      setRoutePlans([newRP, ...routePlans]);
   };

   const handleRaiseDispute = (payload: { orderId: string; raisedBy: string; role: UserRole; issue: string; details?: string; amount?: number }) => {
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
      svc.raiseDispute(newDispute);
      setDisputes([newDispute, ...disputes]);
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
      await svc.addMessage(newMsg);
      setMessages([newMsg, ...messages]);
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
         {screen === 'landing' && <LandingPage onGetStarted={handleGetStarted} onAdminLogin={() => setScreen('admin-login')} />}
         {screen === 'choose-role' && <ChooseRole onSelect={handleRoleSelect} onBack={() => setScreen('landing')} />}
         {screen === 'auth' && <div className="min-h-screen bg-gradient-to-br from-nature-50 to-blue-50 flex items-center justify-center p-4"><AuthWizard initialRole={selectedRole} onComplete={handleAuthComplete} onBack={() => setScreen('landing')} existingUsers={allUsers} /></div>}
         {screen === 'admin-login' && <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4"><AdminLogin onLogin={handleAdminLogin} onBack={() => setScreen('landing')} /></div>}

         {screen === 'dashboard' && currentUser?.role === 'admin' && <AdminDashboard allUsers={allUsers} listings={listings} orders={orders} disputes={disputes} systemConfig={systemConfig} onUpdateConfig={setSystemConfig} onLogout={handleLogout} onUpdateUserStatus={handleUserStatusChange} onResolveDispute={handleResolveDispute} />}
         {screen === 'dashboard' && currentUser?.role === 'farmer' && <FarmerDashboard user={currentUser} listings={listings} offers={offers} orders={orders} messages={messages} inventoryItems={inventoryItems} pricingRules={pricingRules} payouts={payouts} onAddInventoryItem={handleAddInventoryItem} onAddPricingRule={handleAddPricingRule} onAddPayout={handleAddPayout} onSendMessage={handleSendMessage} onAddListing={handleAddListing} onUpdateListing={handleUpdateListing} onUpdateListingStatus={handleUpdateListingStatus} onDeleteListing={handleDeleteListing} onAcceptOffer={handleAcceptOffer} onRejectOffer={handleRejectOffer} onUpdateProfile={handleUpdateProfile} onRaiseDispute={handleRaiseDispute} onLogout={handleLogout} />}
         {screen === 'dashboard' && currentUser?.role === 'buyer' && <BuyerDashboard user={currentUser} listings={listings} offers={offers} orders={orders} messages={messages} rfqs={rfqs} onAddRfq={handleAddRfq} onSendMessage={handleSendMessage} onPlaceOffer={handlePlaceOffer} onUpdateProfile={handleUpdateProfile} onRaiseDispute={handleRaiseDispute} onLogout={handleLogout} />}
         {screen === 'dashboard' && currentUser?.role === 'transporter' && <TransporterDashboard user={currentUser} orders={orders} messages={messages} routePlans={routePlans} onAddRoutePlan={handleAddRoutePlan} onSendMessage={handleSendMessage} onRaiseDispute={handleRaiseDispute} onLogout={handleLogout} onAcceptJob={handleAcceptJob} onUpdateOrderStatus={handleUpdateOrderStatus} onUpdateProfile={handleUpdateProfile} />}
      </div>
   );
};

export default App;
