// Este archivo define el módulo de gestión de invitados para el sistema de comidas.
// Se debe agregar soporte backend (modelo, migración, controlador) para Guest y su MealRecord asociado.
import { useEffect, useState } from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { showSuccess, showError } from '@/utils/swalHelper';
import { fetchWithAuth } from "@/utils/axiosInstance"; // ✅ agregado

export default function GuestsMeals({ auth }) {
    const [camps, setCamps] = useState([]);
    const [selectedCampId, setSelectedCampId] = useState(null);
    const [days, setDays] = useState([]);
    const [selectedDayId, setSelectedDayId] = useState(null);
    const [guests, setGuests] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        church: "",
        gender: "male",
        payment_method: "",
        usd_amount: "",
        reference: "",
    });

   useEffect(() => {
        fetchWithAuth("get", "/api/camps").then((res) => setCamps(res.data));
    }, []);

    useEffect(() => {
        if (selectedCampId) {
            fetchWithAuth("get", `/api/camps/${selectedCampId}/days`).then((res) => setDays(res.data));
        }
    }, [selectedCampId]);

    useEffect(() => {
        if (selectedCampId && selectedDayId) {
            fetchWithAuth("get", "/api/guests", {
                camp_id: selectedCampId,
                day_id: selectedDayId
            }).then((res) => setGuests(res.data));
        }
    }, [selectedCampId, selectedDayId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetchWithAuth("post", "/api/guests", {
                ...form,
                camp_id: selectedCampId,
                day_id: selectedDayId,
            });

            setGuests((prev) => [...prev, res.data]);
            setForm({
                first_name: "",
                last_name: "",
                church: "",
                gender: "male",
                payment_method: "",
                usd_amount: "",
                reference: "",
            });
            setShowModal(false);
            showSuccess("Invitado registrado correctamente");
        } catch (err) {
            showError(
                "Error al registrar invitado",
                err?.response?.data?.message || "Intenta nuevamente."
            );
        }
    };

    const toggleGuestMeal = async (guestId) => {
        try {
            await fetchWithAuth("post", "/api/guest-meal-records/toggle", {
                guest_id: guestId,
                day_id: selectedDayId,
            });

            setGuests((prev) =>
                prev.map((g) =>
                    g.id === guestId ? { ...g, has_eaten: !g.has_eaten } : g
                )
            );
        } catch (err) {
            showError("Error al actualizar registro de comida");
        }
    };
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Invitados - Comidas" />
            <div className="max-w-6xl mx-auto py-10 px-4">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                        <select
                            className="border rounded p-2"
                            value={selectedCampId || ""}
                            onChange={e => setSelectedCampId(e.target.value)}
                        >
                            <option value="">Selecciona campamento</option>
                            {camps.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <select
                            className="border rounded p-2"
                            value={selectedDayId || ""}
                            onChange={e => setSelectedDayId(e.target.value)}
                        >
                            <option value="">Selecciona día</option>
                            {days.map(d => <option key={d.id} value={d.id}>{d.date} - {d.meal_type}</option>)}
                        </select>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Agregar invitado
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-2">Nombre</th>
                                <th className="p-2">Iglesia</th>
                                <th className="p-2">Método</th>
                                <th className="p-2">USD</th>
                                <th className="p-2">¿Comió?</th>
                            </tr>
                        </thead>
                        <tbody>
                            {guests.map(g => (
                                <tr key={g.id} className="border-t">
                                    <td className="p-2">{g.first_name} {g.last_name}</td>
                                    <td className="p-2">{g.church}</td>
                                    <td className="p-2">{g.payment_method}</td>
                                    <td className="p-2">{g.usd_amount}</td>
                                    <td className="p-2">
                                        <button
                                            onClick={() => toggleGuestMeal(g.id)}
                                            className={`px-4 py-1 rounded text-white ${g.has_eaten ? 'bg-green-600' : 'bg-gray-400'}`}
                                        >
                                            {g.has_eaten ? '✔ Comió' : 'Marcar'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded shadow-lg w-full max-w-xl">
                            <h2 className="text-lg font-bold mb-4">Agregar invitado</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" placeholder="Nombre" value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} className="border rounded p-2" required />
                                    <input type="text" placeholder="Apellido" value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} className="border rounded p-2" required />
                                    <input type="text" placeholder="Iglesia" value={form.church} onChange={e => setForm({ ...form, church: e.target.value })} className="border rounded p-2" />
                                    <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} className="border rounded p-2">
                                        <option value="male">Masculino</option>
                                        <option value="female">Femenino</option>
                                        <option value="other">Otro</option>
                                    </select>
                                    <select value={form.payment_method} onChange={e => setForm({ ...form, payment_method: e.target.value })} className="border rounded p-2">
                                        <option value="">Método de pago</option>
                                        <option value="Pago movil">Pago móvil</option>
                                        <option value="Transferencia">Transferencia</option>
                                        <option value="Efectivo">Efectivo</option>
                                        <option value="Divisas">Divisas</option>
                                    </select>
                                    <input type="number" step="0.01" placeholder="Monto USD" value={form.usd_amount} onChange={e => setForm({ ...form, usd_amount: e.target.value })} className="border rounded p-2" />
                                </div>
                                <input type="text" placeholder="Referencia (opcional)" value={form.reference} onChange={e => setForm({ ...form, reference: e.target.value })} className="border rounded p-2 w-full" />
                                <div className="flex justify-end gap-4">
                                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 rounded">Cancelar</button>
                                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Guardar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}