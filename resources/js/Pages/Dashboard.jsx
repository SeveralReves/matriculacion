import { useEffect, useState } from "react";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
// Sugerencia: Instala lucide-react para los iconos
import { 
    Users, Tent, DollarSign, Calendar, Utensils, 
    CreditCard, Wallet, Landmark, ChevronRight 
} from "lucide-react";

export default function Dashboard({ auth }) {
    const [totals, setTotals] = useState({ camps: 0, users: 0, campers: 0 });
    const [camps, setCamps] = useState([]);
    const [selectedCampId, setSelectedCampId] = useState(null);
    const [campStats, setCampStats] = useState(null);
    const [days, setDays] = useState([]);
    const [selectedDayId, setSelectedDayId] = useState(null);
    const [mealStats, setMealStats] = useState(null);

    useEffect(() => {
        axios.get("/api/dashboard/totals").then(res => setTotals(res.data));
        axios.get("/api/camps").then(res => setCamps(res.data));
    }, []);

    useEffect(() => {
        if (selectedCampId) {
            axios.get(`/api/dashboard/camp/${selectedCampId}`).then(res => setCampStats(res.data));
            axios.get(`/api/camps/${selectedCampId}/days`).then(res => setDays(res.data));
        }
    }, [selectedCampId]);

    useEffect(() => {
        if (selectedDayId) {
            axios.get(`/api/dashboard/camp/${selectedCampId}/day/${selectedDayId}`).then(res => setMealStats(res.data));
        }
    }, [selectedDayId, selectedCampId]);

    // Función auxiliar para iconos de pago
    const getPaymentIcon = (method) => {
        const m = method.toLowerCase();
        if (m.includes('zelle') || m.includes('wallet')) return <Wallet className="w-4 h-4" />;
        if (m.includes('banco') || m.includes('transferencia')) return <Landmark className="w-4 h-4" />;
        return <CreditCard className="w-4 h-4" />;
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard de Campamentos" />
            
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
                
                {/* 1. Resumen Global (Superadmin) */}
                {auth.user.role === 'superadmin' && (
                    <section>
                        <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                            <Tent className="mr-3 text-indigo-600" /> Resumen Ejecutivo
                        </h1>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatCard title="Campamentos" value={totals.camps} icon={Tent} color="bg-blue-600" />
                            <StatCard title="Usuarios" value={totals.users} icon={Users} color="bg-purple-600" />
                            <StatCard title="Acampantes" value={totals.campers} icon={Users} color="bg-emerald-600" />
                        </div>
                    </section>
                )}

                {/* 2. Selector y Estadísticas por Campamento */}
                <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Estadísticas por Campamento</h2>
                            <p className="text-sm text-gray-500 text-pretty">Selecciona un campamento para ver el detalle de ingresos y asistencia.</p>
                        </div>
                        <select
                            className="rounded-lg border-gray-300 text-gray-700 focus:ring-indigo-500 focus:border-indigo-500 min-w-[250px]"
                            value={selectedCampId || ""}
                            onChange={(e) => {
                                setSelectedCampId(e.target.value);
                                setSelectedDayId(null);
                                setMealStats(null);
                            }}
                        >
                            <option value="">Seleccionar campamento...</option>
                            {camps.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>

                    {campStats && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* Imagen del campamento */}
                            <div className="lg:col-span-4">
                                {campStats.image_path ? (
                                    <img src={`/storage/${campStats.image_path}`} alt="Camp" className="w-full h-64 object-cover rounded-xl shadow-inner" />
                                ) : (
                                    <div className="w-full h-64 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 italic border-2 border-dashed">Sin imagen</div>
                                )}
                            </div>

                            {/* Datos de Matrícula y RECAUDACIÓN (La parte nueva) */}
                            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Matrícula */}
                                <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                                    <h3 className="text-sm font-semibold text-gray-400 uppercase mb-4">Estado de Matrícula</h3>
                                    <div className="space-y-4">
                                        <ProgressInfo label="Inscritos" current={campStats.total_registered} total={campStats.total_campers} color="bg-indigo-600" />
                                        <p className="text-sm text-gray-600">Total Cupos: <strong>{campStats.total_campers}</strong></p>
                                    </div>
                                </div>

                                {/* Recaudación por Método */}
                                <div className="p-5 bg-indigo-50 rounded-xl border border-indigo-100">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">Total Recaudado</h3>
                                        <DollarSign className="text-indigo-600 w-5 h-5" />
                                    </div>
                                    <div className="text-3xl font-black text-indigo-900 mb-6">
                                        ${Number(campStats.total_usd).toLocaleString(undefined, {minimumFractionDigits: 2})}
                                    </div>
                                    
                                    {/* SEPARACIÓN POR MÉTODO DE PAGO */}
                                    <div className="space-y-2 border-t border-indigo-200 pt-4">
                                        <p className="text-[10px] font-bold text-indigo-400 uppercase mb-2">Desglose de Ingresos</p>
                                        {campStats.payment_methods ? campStats.payment_methods.map((pm, idx) => (
                                            <div key={idx} className="flex justify-between items-center text-sm text-indigo-800">
                                                <div className="flex items-center gap-2">
                                                    {getPaymentIcon(pm.method)}
                                                    <span>{pm.method}</span>
                                                </div>
                                                <span className="font-bold">${Number(pm.total).toFixed(2)}</span>
                                            </div>
                                        )) : (
                                            <p className="text-xs text-indigo-400 italic text-pretty">No hay desglose por método disponible aún en la API.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                {/* 3. Control de Comidas (Sección inferior) */}
                {campStats && days.length > 0 && (
                    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-4 mb-6 text-pretty">
                            <Utensils className="text-orange-500" />
                            <h2 className="text-lg font-bold">Registro de Asistencia a Comidas</h2>
                            <select
                                className="ml-auto rounded-lg border-gray-300 text-sm"
                                value={selectedDayId || ""}
                                onChange={(e) => setSelectedDayId(e.target.value)}
                            >
                                <option value="">Selecciona el día y turno...</option>
                                {days.map((d) => (
                                    <option key={d.id} value={d.id}>{d.date} - {d.meal_type}</option>
                                ))}
                            </select>
                        </div>

                        {mealStats && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Acampantes */}
                                <div className="space-y-6">
                                    <h4 className="font-bold text-gray-700 border-b pb-2">Acampantes</h4>
                                    <ProgressInfo label="Niños" current={mealStats.campers_ate_children} total={mealStats.campers_children_total} color="bg-blue-500" />
                                    <ProgressInfo label="Adultos" current={mealStats.campers_ate_adults} total={mealStats.campers_adults_total} color="bg-emerald-500" />
                                </div>
                                {/* Invitados */}
                                <div className="bg-gray-50 p-6 rounded-xl flex flex-col justify-center items-center">
                                    <h4 className="font-bold text-gray-700 mb-4 uppercase text-xs tracking-widest">Invitados Especiales</h4>
                                    <div className="text-5xl font-black text-orange-600">
                                        {mealStats.guests_ate} <span className="text-xl text-gray-400">/ {mealStats.guests_total}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-2">Han consumido alimentos</p>
                                </div>
                            </div>
                        )}
                    </section>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

// Sub-componentes para mejorar la legibilidad
function StatCard({ title, value, icon: Icon, color }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 transition-transform hover:scale-[1.02]">
            <div className={`p-3 rounded-xl ${color} text-white shadow-md`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{title}</p>
                <p className="text-2xl font-black text-gray-800">{value}</p>
            </div>
        </div>
    );
}

function ProgressInfo({ label, current, total, color }) {
    const percent = total > 0 ? (current / total) * 100 : 0;
    return (
        <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
                <span className="text-gray-600">{label}</span>
                <span>{current} / {total}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden text-pretty">
                <div 
                    className={`${color} h-full transition-all duration-500 ease-out`} 
                    style={{ width: `${Math.min(percent, 100)}%` }}
                ></div>
            </div>
        </div>
    );
}