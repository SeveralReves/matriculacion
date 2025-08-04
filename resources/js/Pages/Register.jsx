import { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { showSuccess, showError, showToast } from '@/utils/swalHelper';
import { fetchWithAuth } from "@/utils/axiosInstance";

export default function Register({ auth }) {
    const [camps, setCamps] = useState([]);
    const [selectedCampId, setSelectedCampId] = useState(null);
    const [days, setDays] = useState([]);
    const [selectedDayId, setSelectedDayId] = useState(null);
    const [records, setRecords] = useState([]);
    const [query, setQuery] = useState("");

    useEffect(() => {
        fetchWithAuth("get", "/api/camps")
            .then((res) => setCamps(res.data))
            .catch(() => showError("Error al cargar campamentos"));
    }, []);


    useEffect(() => {
        if (selectedCampId) {
            const params = new URLSearchParams({
                camp_id: selectedCampId,
            }).toString();

            fetchWithAuth("get", `/api/registered-records?${params}`)
                .then((res) => setRecords(res.data))
                .catch(() => showError("Error al cargar registros"));

        }
    }, [selectedCampId]);

    const toggleMeal = async (camperId) => {
        try {
            await fetchWithAuth("post", "/api/registered-records/toggle", {
                camp_id: selectedCampId,
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
                <h2 className="text-2xl font-bold mb-6">Matriculación</h2>

                <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <select value={selectedCampId || ""} onChange={e => setSelectedCampId(e.target.value)} className="border rounded p-2">
                        <option value="">-- Selecciona campamento --</option>
                        {camps.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
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
                                <th className="p-2">¿Llegó?</th>
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
                                            {r.ate ? '✔ Matriculado' : 'Marcar'}
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
