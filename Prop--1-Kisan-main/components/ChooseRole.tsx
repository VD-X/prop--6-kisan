import React from 'react';
import { motion } from 'framer-motion';
import { Tractor, ShoppingBag, Truck, ArrowRight, Leaf } from 'lucide-react';
import { Card } from './UI';

interface ChooseRoleProps {
    onSelect: (role: 'farmer' | 'buyer' | 'transporter') => void;
    onBack: () => void;
}

const ChooseRole: React.FC<ChooseRoleProps> = ({ onSelect, onBack }) => {
    const roles = [
        {
            id: 'farmer',
            title: 'Farmer',
            description: 'I grow crops and want fair prices.',
            icon: Tractor,
            color: 'nature',
            badge: 'Most used by farmers',
            theme: 'border-nature-500 bg-nature-50/50',
            iconBg: 'bg-nature-100',
            iconColor: 'text-nature-600',
            btnColor: 'text-nature-600'
        },
        {
            id: 'buyer',
            title: 'Buyer',
            description: 'I want transparent and reliable supply.',
            icon: ShoppingBag,
            color: 'blue',
            theme: 'border-blue-500 bg-blue-50/50',
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
            btnColor: 'text-blue-600'
        },
        {
            id: 'transporter',
            title: 'Transporter',
            description: 'I want verified delivery jobs.',
            icon: Truck,
            color: 'orange',
            theme: 'border-orange-500 bg-orange-50/50',
            iconBg: 'bg-orange-100',
            iconColor: 'text-orange-600',
            btnColor: 'text-orange-600'
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-6 flex flex-col items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl w-full text-center mb-12"
            >
                <div className="flex items-center justify-center gap-2 mb-6 cursor-pointer" onClick={onBack}>
                    <div className="w-10 h-10 bg-nature-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Leaf className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-bold text-xl text-slate-900 tracking-tight">KisanSetu</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How would you like to use KisanSetu?</h2>
                <p className="text-slate-500">Choose one option. This cannot be changed later.</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 w-full max-w-5xl">
                {roles.map((role) => (
                    <motion.div
                        key={role.id}
                        whileHover={{ y: -8 }}
                        className="h-full"
                    >
                        <Card
                            className={`h-full cursor-pointer border-t-4 p-8 flex flex-col transition-all duration-300 hover:shadow-2xl hover:shadow-${role.color}-500/10 ${role.theme}`}
                            onClick={() => onSelect(role.id as any)}
                        >
                            {role.badge && (
                                <div className="absolute top-4 right-4 bg-nature-600 text-white text-[10px] font-bold uppercase py-1 px-2 rounded-full">
                                    {role.badge}
                                </div>
                            )}
                            <div className={`h-14 w-14 ${role.iconBg} rounded-2xl flex items-center justify-center mb-6 shadow-sm`}>
                                <role.icon className={`w-8 h-8 ${role.iconColor}`} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3">{role.title}</h3>
                            <p className="text-slate-600 mb-8 flex-1 leading-relaxed">{role.description}</p>
                            <div className={`flex items-center font-bold ${role.btnColor} group`}>
                                Continue as {role.title}
                                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-2" />
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                onClick={onBack}
                className="mt-12 text-slate-400 hover:text-slate-700 font-medium transition-colors"
            >
                Go back to landing page
            </motion.button>
        </div>
    );
};

export default ChooseRole;
