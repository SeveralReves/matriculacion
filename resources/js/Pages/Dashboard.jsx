// Este archivo representa la página de inicio del dashboard con resumen general y datos por campamento.

import { useEffect, useState } from "react";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

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
    }, [selectedDayId]);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard" />
            <div className="max-w-7xl mx-auto py-10 px-4">
            {auth.user.role === 'superadmin' && (
                <>
                    <h1 className="text-2xl font-bold mb-6">Resumen general</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        <div className="p-4 bg-white rounded shadow">
                            Campamentos: <strong>{totals.camps}</strong>
                        </div>
                        <div className="p-4 bg-white rounded shadow">
                            Usuarios: <strong>{totals.users}</strong>
                        </div>
                        <div className="p-4 bg-white rounded shadow">
                            Acampantes: <strong>{totals.campers}</strong>
                        </div>
                    </div>
                </>

            )}

                <h2 className="text-xl font-bold mb-2">
                    Estadísticas por campamento
                </h2>
                <select
                    className="mb-4 border p-2 rounded"
                    value={selectedCampId || ""}
                    onChange={(e) => {
                        setSelectedCampId(e.target.value);
                        setSelectedDayId(null);
                        setMealStats(null);
                    }}
                >
                    <option value="">-- Selecciona campamento --</option>
                    {camps.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>

                {campStats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="p-4 bg-white rounded shadow">
                            <h3 className="font-semibold">Imagen</h3>
                            {campStats.image_path ? (
                                <img
                                    src={`/storage/${campStats.image_path}`}
                                    alt="Campamento"
                                    className="max-h-52 object-cover mt-2 rounded"
                                />
                            ) : (
                                <p className="text-gray-500 italic">
                                    Sin imagen
                                </p>
                            )}
                        </div>
                        <div className="p-4 bg-white rounded shadow">
                            <p>
                                Acampantes inscritos:{" "}
                                <strong>{campStats.total_campers}</strong>
                            </p>
                            <p>
                                Total en USD recolectado:{" "}
                                <strong>
                                    ${Number(campStats.total_usd).toFixed(2)}
                                </strong>
                            </p>
                        </div>
                    </div>
                )}

                {campStats && days.length > 0 && (
                    <>
                        <h2 className="text-lg font-semibold">
                            Ver comida del día:
                        </h2>
                        <select
                            className="mb-4 border p-2 rounded"
                            value={selectedDayId || ""}
                            onChange={(e) => setSelectedDayId(e.target.value)}
                        >
                            <option value="">-- Selecciona día --</option>
                            {days.map((d) => (
                                <option key={d.id} value={d.id}>
                                    {d.date} - {d.meal_type}
                                </option>
                            ))}
                        </select>

                        {mealStats && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white p-4 rounded shadow">
                                    <h4 className="font-semibold mb-2">
                                        Acampantes
                                    </h4>
                                    <p>
                                        Niños Listos:{" "}
                                        <strong>
                                            {mealStats.campers_ate_children}
                                        </strong>
                                    </p>
                                    <p>
                                        Niños Faltantes:{" "}
                                        <strong>
                                            {mealStats.campers_children_total -
                                                mealStats.campers_ate_children}
                                        </strong>
                                    </p>
                                    <p>
                                        Niños Total:{" "}
                                        <strong>
                                            {mealStats.campers_children_total}
                                        </strong>
                                    </p>
                                    <br />
                                    <p>
                                        Adultos Listos:{" "}
                                        <strong>
                                            {mealStats.campers_ate_adults}
                                        </strong>
                                    </p>
                                    <p>
                                        Adultos Faltantes:{" "}
                                        <strong>
                                            {mealStats.campers_adults_total -
                                                mealStats.campers_ate_adults}
                                        </strong>
                                    </p>
                                    <p>
                                        Adultos Total:{" "}
                                        <strong>
                                            {mealStats.campers_adults_total}
                                        </strong>
                                    </p>
                                    <br />
                                    <p>
                                        Total:{" "}
                                        <strong>{mealStats.campers_ate}</strong>
                                    </p>
                                </div>
                                <div className="bg-white p-4 rounded shadow">
                                    <h4 className="font-semibold mb-2">
                                        Invitados
                                    </h4>
                                    <p>
                                        Total:{" "}
                                        <strong>
                                            {mealStats.guests_total}
                                        </strong>
                                    </p>
                                    <p>
                                        Comieron:{" "}
                                        <strong>{mealStats.guests_ate}</strong>
                                    </p>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </AuthenticatedLayout>
    );
}