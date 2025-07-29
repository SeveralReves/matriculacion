import { useEffect, useState } from "react";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { showSuccess, showError, showToast } from '@/utils/swalHelper';

export default function Meals({ auth }) {
    const [camps, setCamps] = useState([]);
    const [selectedCampId, setSelectedCampId] = useState(null);
    const [days, setDays] = useState([]);
    const [selectedDayId, setSelectedDayId] = useState(null);
    const [records, setRecords] = useState([]);
    const [query, setQuery] = useState("");

    useEffect(() => {
        axios.get("/api/camps").then((res) => setCamps(res.data));
    }, []);

    useEffect(() => {
        if (selectedCampId) {
            axios.get(`/api/camps/${selectedCampId}/days`).then((res) => setDays(res.data));
        }
    }, [selectedCampId]);

    useEffect(() => {
        if (selectedCampId && selectedDayId) {
            axios.get(`/api/meal-records`, {
                params: { camp_id: selectedCampId, day_id: selectedDayId },
            }).then((res) => setRecords(res.data));
        }
    }, [selectedCampId, selectedDayId]);

    const toggleMeal = async (camperId) => {
        try {
            await axios.post("/api/meal-records/toggle", {
                camp_id: selectedCampId,
                day_id: selectedDayId,
                camper_id: camperId,
            });

            setRecords((prev) =>
                prev.map((r) =>
                    r.camper_id === camperId ? { ...r, ate: !r.ate } : r
                )
            );

            showToast("success", "Registro actualizado");
        } catch (error) {
            showError(
                "Error al actualizar comida",
                error?.response?.data?.message || "Intenta nuevamente."
            );
        }
    };


    const filtered = records.filter((r) => {
        const text = `${r.camper.first_name} ${r.camper.last_name} ${r.camper.email} ${r.camper.serial}`.toLowerCase();
        return text.includes(query.toLowerCase());
    });

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Registro de Comidas" />
            <div className="max-w-6xl mx-auto py-10 px-4">
                <h2 className="text-2xl font-bold mb-6">Registro de Comidas</h2>

                <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <select value={selectedCampId || ""} onChange={e => setSelectedCampId(e.target.value)} className="border rounded p-2">
                        <option value="">-- Selecciona campamento --</option>
                        {camps.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>

                    <select value={selectedDayId || ""} onChange={e => setSelectedDayId(e.target.value)} className="border rounded p-2">
                        <option value="">-- Selecciona día --</option>
                        {days.map(d => <option key={d.id} value={d.id}>{d.meal_type} - {d.date}</option>)}
                    </select>

                    <input
                        type="text"
                        placeholder="Buscar por nombre, correo o serial"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="border rounded p-2"
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-2">Nombre</th>
                                <th className="p-2">Correo</th>
                                <th className="p-2">Serial</th>
                                <th className="p-2">¿Comió?</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((r) => (
                                <tr key={r.camper_id} className="border-t">
                                    <td className="p-2">{r.camper.first_name} {r.camper.last_name}</td>
                                    <td className="p-2">{r.camper.email}</td>
                                    <td className="p-2">{r.camper.serial}</td>
                                    <td className="p-2">
                                        <button
                                            onClick={() => toggleMeal(r.camper_id)}
                                            className={`px-4 py-1 rounded text-white ${r.ate ? 'bg-green-600' : 'bg-gray-400'}`}
                                        >
                                            {r.ate ? '✔ Comió' : 'Marcar'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="text-center text-gray-500 py-4">
                                        No hay registros que coincidan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
