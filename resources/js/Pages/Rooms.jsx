import { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import DataTable from "@/Components/DataTable";
import { showSuccess, showError, showConfirm } from '@/utils/swalHelper';
import { fetchWithAuth } from "@/utils/axiosInstance";

export default function Rooms({ auth }) {
    const [camps, setCamps] = useState([]);
    const [selectedCampId, setSelectedCampId] = useState("");
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
    const [manageCampersRoomId, setManageCampersRoomId] = useState(null);
    const [campers, setCampers] = useState([]);
    const [roomCampers, setRoomCampers] = useState([]);
    const [showManageModal, setShowManageModal] = useState(false);
    const [loadingCampers, setLoadingCampers] = useState(false);

    // Mapeo de géneros para visualización y lógica
    const genderLabels = {
        male: 'Masculino',
        female: 'Femenino',
        other: 'Masculino', // Opcional: manejar según tu lógica
        masculino: 'Masculino',
        femenino: 'Femenino',
        ambos: 'Ambos'
    };

    const columns = [
        { key: "name", label: "Nombre" },
        { key: "display_capacity", label: "Capacidad (Ocupados/Max)" },
        { key: "display_gender", label: "Género" },
        { key: "description", label: "Descripción" }
    ];

    // Transformamos los datos para la tabla pero MANTENEMOS los originales para el Edit
    const transformedRooms = rooms.map(room => ({
        ...room, // <--- IMPORTANTE: Mantiene max_capacity, gender original, etc.
        display_capacity: `${room?.campers_count || 0} / ${room.max_capacity || '∞'}`,
        display_gender: genderLabels[room.gender] || room.gender,
    }));

    useEffect(() => {
        fetchWithAuth("get", "/api/camps").then(res => {
            setCamps(res.data);
            if (res.data.length > 0) setSelectedCampId(res.data[0].id.toString());
        });
    }, []);

    useEffect(() => {
        if (selectedCampId) {
            fetchWithAuth("get", `/api/camps/${selectedCampId}/rooms`).then(res => setRooms(res.data));
        }
    }, [selectedCampId]);

    const resetForm = () => {
        setForm({ name: "", max_capacity: "", gender: "ambos", description: "" });
        setIsEditing(false);
        setEditId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = isEditing ? "put" : "post";
        const url = isEditing ? `/api/rooms/${editId}` : `/api/camps/${selectedCampId}/rooms`;

        try {
            const res = await fetchWithAuth(method, url, form);
            if (isEditing) {
                setRooms(prev => prev.map(r => r.id === editId ? res.data : r));
                showSuccess("Habitación actualizada");
            } else {
                setRooms(prev => [...prev, res.data]);
                showSuccess("Habitación creada");
            }
            setShowModal(false);
            resetForm();
        } catch (error) {
            showError("Error al guardar", error?.response?.data?.message || "Intenta de nuevo.");
        }
    };

    const handleEdit = (room) => {
        // 'room' aquí viene de transformedRooms, que ahora tiene las props originales
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

    const handleManageCampers = async (roomId) => {
        setManageCampersRoomId(roomId);
        setShowManageModal(true);
        setLoadingCampers(true);
        
        const room = rooms.find(r => r.id === roomId);

        try {
            const [assignedRes, allCampersRes] = await Promise.all([
                fetchWithAuth("get", `/api/rooms/${roomId}/campers`),
                fetchWithAuth("get", `/api/camps/${selectedCampId}/campers`)
            ]);

            const assignedIds = assignedRes.data.map(c => c.id);
            setRoomCampers(assignedIds);

            const filtered = allCampersRes.data.filter(camper => {
                const notAssignedElsewhere = !camper.room_id || assignedIds.includes(camper.id);
                // Normalizamos géneros para comparar (male -> masculino)
                const camperGenderNormal = camper.gender === 'male' ? 'masculino' : 'femenino';
                const genderMatch = room.gender === "ambos" || camperGenderNormal === room.gender;
                
                return notAssignedElsewhere && genderMatch;
            });

            setCampers(filtered);
        } catch (error) {
            showError("Error al cargar acampantes");
        } finally {
            setLoadingCampers(false);
        }
    };

    const handleSaveRoomCampers = async () => {
        try {
            await fetchWithAuth("post", `/api/rooms/${manageCampersRoomId}/assign-campers`, {
                camper_ids: roomCampers
            });
            showSuccess("Asignación exitosa");
            setShowManageModal(false);
            // Refrescar para ver nuevos conteos
            const res = await fetchWithAuth("get", `/api/camps/${selectedCampId}/rooms`);
            setRooms(res.data);
        } catch (error) {
            showError("Error al guardar");
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Gestión de Habitaciones" />

            <div className="max-w-5xl mx-auto py-8 px-4">
                <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
                    <label className="block font-bold text-gray-700 mb-2">Campamento Activo:</label>
                    <select
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500"
                        value={selectedCampId}
                        onChange={e => setSelectedCampId(e.target.value)}
                    >
                        {camps.map(camp => (
                            <option key={camp.id} value={camp.id}>{camp.name}</option>
                        ))}
                    </select>
                </div>

                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-extrabold text-gray-800">Habitaciones</h1>
                    <button
                        onClick={() => { resetForm(); setShowModal(true); }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition shadow"
                    >
                        + Nueva Habitación
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow border overflow-hidden">
                    <DataTable
                        columns={columns}
                        data={transformedRooms}
                        onEdit={handleEdit}
                        onAssign={handleManageCampers}
                        onDelete={async (id) => {
                            const result = await showConfirm("¿Eliminar?", "No podrás deshacer esto.");
                            if (result.isConfirmed) {
                                try {
                                    await fetchWithAuth("delete", `/api/rooms/${id}`);
                                    setRooms(prev => prev.filter(r => r.id !== id));
                                    showSuccess("Eliminado");
                                } catch (e) { showError("Error al eliminar"); }
                            }
                        }}
                    />
                </div>

                {/* Modal de Habitación */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
                            <h2 className="text-xl font-bold mb-5 text-gray-800 border-b pb-2">
                                {isEditing ? "Editar Habitación" : "Nueva Habitación"}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="text-sm font-semibold text-gray-600">Nombre</label>
                                    <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="w-full border rounded-lg p-2 mt-1" placeholder="Ej: Cabaña A-1" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-semibold text-gray-600">Capacidad Max.</label>
                                        <input type="number" value={form.max_capacity} onChange={e => setForm({ ...form, max_capacity: e.target.value })} className="w-full border rounded-lg p-2 mt-1" placeholder="Ej: 10" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-gray-600">Género Admisión</label>
                                        <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} className="w-full border rounded-lg p-2 mt-1">
                                            <option value="ambos">Ambos</option>
                                            <option value="masculino">Masculino</option>
                                            <option value="femenino">Femenino</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-600">Descripción (Opcional)</label>
                                    <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full border rounded-lg p-2 mt-1" rows="3" />
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
                                    <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition">
                                        {isEditing ? "Guardar Cambios" : "Crear Ahora"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Modal de Asignación */}
                {showManageModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-2xl">
                            <h2 className="text-xl font-bold mb-4 flex justify-between">
                                <span>👥 Asignar Acampantes</span>
                                {loadingCampers && <span className="text-sm font-normal text-blue-500">Cargando...</span>}
                            </h2>
                            <div className="max-h-[60vh] overflow-y-auto border rounded-lg p-4 bg-gray-50">
                                {campers.length === 0 && !loadingCampers ? (
                                    <p className="text-center text-gray-500 py-4">No hay acampantes disponibles para este género o campamento.</p>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {campers.map(camper => (
                                            <label key={camper.id} className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition ${roomCampers.includes(camper.id) ? 'bg-blue-50 border-blue-300' : 'bg-white hover:bg-gray-100'}`}>
                                                <input
                                                    type="checkbox"
                                                    className="rounded text-blue-600 focus:ring-blue-500 h-5 w-5"
                                                    checked={roomCampers.includes(camper.id)}
                                                    onChange={e => {
                                                        if (e.target.checked) setRoomCampers(prev => [...prev, camper.id]);
                                                        else setRoomCampers(prev => prev.filter(id => id !== camper.id));
                                                    }}
                                                />
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-800">{camper.first_name} {camper.last_name}</span>
                                                    <span className="text-xs text-gray-500 uppercase">{genderLabels[camper.gender]}</span>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-end mt-6 gap-4">
                                <button onClick={() => setShowManageModal(false)} className="bg-gray-200 hover:bg-gray-300 px-6 py-2 rounded-lg font-semibold text-gray-700">Cerrar</button>
                                <button onClick={handleSaveRoomCampers} className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-lg font-bold shadow-lg transition">Guardar Cambios</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}