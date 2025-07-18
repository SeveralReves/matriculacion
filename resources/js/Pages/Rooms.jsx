import { useEffect, useState } from "react";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function Rooms({ auth }) {
    const [camps, setCamps] = useState([]);
    const [selectedCampId, setSelectedCampId] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState({
        name: "",
        max_capacity: "",
        gender: "ambos",
        description: ""
    });

    useEffect(() => {
        axios.get("/api/camps").then(res => {
            setCamps(res.data);
            if (res.data.length > 0) setSelectedCampId(res.data[0].id);
        });
    }, []);

    useEffect(() => {
        if (selectedCampId) {
            axios.get(`/api/camps/${selectedCampId}/rooms`).then(res => setRooms(res.data));
        }
    }, [selectedCampId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedCampId) return;

        const method = isEditing ? "put" : "post";
        const url = isEditing ? `/api/rooms/${editId}` : `/api/camps/${selectedCampId}/rooms`;
        const payload = { ...form };

        axios[method](url, payload).then(res => {
            if (isEditing) {
                setRooms(prev => prev.map(r => r.id === editId ? res.data : r));
            } else {
                setRooms(prev => [...prev, res.data]);
            }
            setForm({ name: "", max_capacity: "", gender: "ambos", description: "" });
            setIsEditing(false);
            setEditId(null);
            setShowModal(false);
        });
    };

    const handleEdit = (room) => {
        setForm({
            name: room.name,
            max_capacity: room.max_capacity || "",
            gender: room.gender,
            description: room.description || ""
        });
        setIsEditing(true);
        setEditId(room.id);
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (!confirm("¿Seguro que deseas eliminar esta habitación?")) return;
        axios.delete(`/api/rooms/${id}`).then(() => {
            setRooms(prev => prev.filter(r => r.id !== id));
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Habitaciones" />

            <div className="max-w-4xl mx-auto py-8 px-4">
                <div className="mb-6">
                    <label className="block font-semibold mb-1">Seleccionar Campamento:</label>
                    <select
                        className="border rounded px-3 py-2 w-full"
                        value={selectedCampId || ""}
                        onChange={e => setSelectedCampId(e.target.value)}
                    >
                        {camps.map(camp => (
                            <option key={camp.id} value={camp.id}>
                                {camp.name}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedCampId && (
                    <>
                        <div className="flex justify-between items-center mb-4">
                            <h1 className="text-2xl font-bold">Habitaciones</h1>
                            <button
                                onClick={() => {
                                    setForm({ name: "", max_capacity: "", gender: "ambos", description: "" });
                                    setIsEditing(false);
                                    setEditId(null);
                                    setShowModal(true);
                                }}
                                className="bg-blue-600 text-white px-4 py-2 rounded"
                            >
                                Nueva habitación
                            </button>
                        </div>

                        <table className="w-full border">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-2">Nombre</th>
                                    <th className="p-2">Capacidad</th>
                                    <th className="p-2">Género</th>
                                    <th className="p-2">Descripción</th>
                                    <th className="p-2">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rooms.map(room => (
                                    <tr key={room.id} className="border-t">
                                        <td className="p-2">{room.name}</td>
                                        <td className="p-2">{room.campers_count}/{room.max_capacity || '---'}</td>
                                        <td className="p-2 capitalize">{room.gender}</td>
                                        <td className="p-2">{room.description}</td>
                                        <td className="p-2 space-x-2">
                                            <button className="text-blue-600" onClick={() => handleEdit(room)}>Editar</button>
                                            <button className="text-red-600" onClick={() => handleDelete(room.id)}>Eliminar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}

                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                            <h2 className="text-lg font-bold mb-4">
                                {isEditing ? "Editar habitación" : "Nueva habitación"}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input type="text" placeholder="Nombre" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="w-full border rounded p-2" />
                                <input type="number" placeholder="Capacidad máxima" value={form.max_capacity} onChange={e => setForm({ ...form, max_capacity: e.target.value })} className="w-full border rounded p-2" />
                                <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} className="w-full border rounded p-2">
                                    <option value="ambos">Ambos</option>
                                    <option value="masculino">Masculino</option>
                                    <option value="femenino">Femenino</option>
                                </select>
                                <textarea placeholder="Descripción" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full border rounded p-2" />

                                <div className="flex justify-end gap-4">
                                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 rounded">Cancelar</button>
                                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">{isEditing ? "Actualizar" : "Guardar"}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
