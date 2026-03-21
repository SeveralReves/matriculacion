import { useEffect, useState } from "react";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import DataTable from "@/Components/Datatable";
import { showSuccess, showError, showConfirm } from "@/utils/swalHelper";
import { fetchWithAuth } from "@/utils/axiosInstance"; 

export default function Campers({ auth }) {
    const [camps, setCamps] = useState([]);
    const [selectedCampId, setSelectedCampId] = useState(null);
    const [campers, setCampers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [errors, setErrors] = useState({});
    const [form, setForm] = useState({
        camp_id: null,
        identity_card: "",
        first_name: "",
        last_name: "",
        church: "",
        birth_date: "",
        age: "", //
        email: "",
        phone: "",
        zone: "",
        color: "",
        baptized: false,
        gender: "male",
        serial: "",
        payment_method: "",
        usd_amount: "",
        reference: "",
        comments: "",
        room_id: null,
    });
    const [churches, setChurches] = useState([]);
    const [zones, setZones] = useState([]);
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        axios.get("/api/camps").then((res) => setCamps(res.data));
        axios.get('/api/churches').then((res) => setChurches(res.data));
        axios.get('/api/zones').then((res) => setZones(res.data));
        
    }, []);

    useEffect(() => {
        if (selectedCampId) {
            axios.get(`/api/camps/${selectedCampId}/campers`).then((res) => setCampers(res.data));
            axios.get(`/api/camps/${selectedCampId}/rooms`).then((res) => setRooms(res.data));
        }
    }, [selectedCampId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = isEditing ? "put" : "post";
        const url = isEditing ? `/api/campers/${editId}` : "/api/campers";

        try {
            const res = await fetchWithAuth(method, url, { ...form, camp_id: parseInt(selectedCampId) });
            console.log('res',res)

            if (isEditing) {
                setCampers((prev) => prev.map((c) => (c.id === editId ? res.data : c)));
                showSuccess("Acampante actualizado correctamente");
            } else {
                setCampers((prev) => [...prev, res.data]);
                showSuccess("Acampante creado correctamente");
            }

            setShowModal(false);
            setForm({
                camp_id: null,
                identity_card: "",
                first_name: "",
                last_name: "",
                church: "",
                birth_date: "",
                age: "", //
                email: "",
                phone: "",
                zone: "",
                color: "",
                baptized: false,
                gender: "male",
                serial: "",
                payment_method: "",
                usd_amount: "",
                reference: "",
                comments: "",
                room_id: null,
            });
            setIsEditing(false);
            setEditId(null);
            setErrors({});
        } catch (err) {
            console.error(err)
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors || {});
            } else {
                showError("Error al guardar", err.response?.data?.message || "Intenta de nuevo.");
            }
        }
    };


    const handleEdit = (camper) => {
        setForm({
            camp_id: camper.camp_id,
            identity_card: camper.identity_card || "",
            first_name: camper.first_name,
            last_name: camper.last_name,
            church: camper.church,
            birth_date: camper.birth_date,
            age: camper.age || "",
            email: camper.email,
            phone: camper.phone || "",
            zone: camper.zone,
            color: camper.color,
            baptized: camper.baptized,
            gender: camper.gender,
            serial: camper.serial,
            payment_method: camper.payment_method,
            usd_amount: camper.usd_amount,
            reference: camper.reference || "",
            comments: camper.comments || "",
            room_id: camper.room_id || null,
        });
        setIsEditing(true);
        setEditId(camper.id);
        setShowModal(true);
        setErrors({});
    };

    const handleDelete = async (id) => {
        const result = await showConfirm(
            "¿Eliminar acampante?",
            "Esta acción no se puede deshacer.",
            "Sí, eliminar"
        );

        if (!result.isConfirmed) return;

        try {
            await fetchWithAuth("delete", `/api/campers/${id}`);
            setCampers((prev) => prev.filter((c) => c.id !== id));
            showSuccess("Acampante eliminado correctamente");
        } catch (error) {
            showError(
                "Error al eliminar",
                error?.response?.data?.message || "Intenta de nuevo."
            );
        }
    };


    const columns = [
        { key: "first_name", label: "Nombre" },
        { key: "last_name", label: "Apellido" },
        { key: "church", label: "Iglesia" },
        { key: "email", label: "Correo" },
        { key: "zone", label: "Zona/Distrito" },
        { key: "color", label: "Equipo" },
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Acampantes</h2>}
        >
            <Head title="Acampantes" />
            <div className="max-w-6xl mx-auto py-10 px-4">
                <div className="mb-6">
                    <label className="block mb-2 font-semibold">Selecciona un campamento:</label>
                    <select
                        className="w-full border rounded p-2"
                        value={selectedCampId || ""}
                        onChange={(e) => setSelectedCampId(e.target.value)}
                    >
                        <option value="">-- Selecciona --</option>
                        {camps.map((camp) => (
                            <option key={camp.id} value={camp.id}>{camp.name}</option>
                        ))}
                    </select>
                </div>

                {selectedCampId && (
                    <>
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
                            <h2 className="text-xl font-bold">Acampantes</h2>
                            <button
                                onClick={() => {
                                    setShowModal(true);
                                    setIsEditing(false);
                                    setEditId(null);
                                    setErrors({});
                                }}
                                className="bg-blue-600 text-white px-4 py-2 rounded w-full md:w-auto"
                            >
                                Crear acampante
                            </button>
                        </div>
                        <DataTable columns={columns} data={campers} onEdit={handleEdit} onDelete={handleDelete} />
                    </>
                )}

                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded shadow-lg w-full max-w-xl overflow-y-auto max-h-[90vh]">
                            <h2 className="text-lg font-bold mb-4">{isEditing ? "Editar acampante" : "Crear acampante"}</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" placeholder="Nombre" value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} className={`border rounded p-2 ${errors.first_name ? 'border-red-500' : ''}`} title={errors.first_name?.[0] || ""} required />
                                    <input type="text" placeholder="Apellido" value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} className={`border rounded p-2 ${errors.last_name ? 'border-red-500' : ''}`} title={errors.last_name?.[0] || ""} required />
                                    <input type="text" placeholder="Cédula (opcional)" value={form.identity_card} onChange={e => setForm({ ...form, identity_card: e.target.value })} className="border rounded p-2" />
                                    <input type="email" placeholder="Correo" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className={`border rounded p-2 ${errors.email ? 'border-red-500' : ''}`} title={errors.email?.[0] || ""} />
                                    <input
                                        type="text"
                                        placeholder="Teléfono"
                                        value={form.phone}
                                        onChange={e => setForm({ ...form, phone: e.target.value })}
                                        className={`border rounded p-2 ${errors.phone ? 'border-red-500' : ''}`}
                                        title={errors.phone?.[0] || ""}
                                    />

                                    <input
                                        list="churches"
                                        type="text"
                                        placeholder="Iglesia"
                                        value={form.church}
                                        onChange={e => setForm({ ...form, church: e.target.value })}
                                        className={`border rounded p-2 ${errors.church ? 'border-red-500' : ''}`}
                                        title={errors.church?.[0] || ""}
                                    />
                                    <datalist id="churches">
                                        {churches.map((church, idx) => (
                                            <option key={idx} value={church} />
                                        ))}
                                    </datalist>

                                    <input type="date" placeholder="Nacimiento" value={form.birth_date} onChange={e => {
                                        const birth_date = e.target.value;
                                        const today = new Date();
                                        const birth = new Date(birth_date);
                                        const age = birth_date ? today.getFullYear() - birth.getFullYear() - (today < new Date(today.getFullYear(), birth.getMonth(), birth.getDate()) ? 1 : 0) : '';
                                        setForm({ ...form, birth_date, age });
                                    }} className={`border rounded p-2 ${errors.birth_date ? 'border-red-500' : ''}`} title={errors.birth_date?.[0] || ""}  />
                                    
                                    <input
                                        type="number"
                                        min="0"
                                        placeholder="Edad"
                                        value={form.age}
                                        onChange={(e) => setForm({ ...form, age: e.target.value })}
                                        className={`border rounded p-2 ${errors.age ? 'border-red-500' : ''}`}
                                        title={errors.age?.[0] || ""}
                                    />

                                    <input
                                        list="zones"
                                        type="text"
                                        placeholder="Zona o Distrito"
                                        value={form.zone}
                                        onChange={e => setForm({ ...form, zone: e.target.value })}
                                        className={`border rounded p-2 ${errors.zone ? 'border-red-500' : ''}`}
                                        title={errors.zone?.[0] || ""}
                                    />
                                    <datalist id="zones">
                                        {zones.map((zone, idx) => (
                                            <option key={idx} value={zone} />
                                        ))}
                                    </datalist>
                                    <select
                                        value={form.room_id || ""}
                                        onChange={(e) => setForm({ ...form, room_id: e.target.value || null })}
                                        className="w-full border rounded p-2"
                                    >
                                        <option value="">Sin habitación asignada</option>
                                        {rooms.map((room) => (
                                            <option key={room.id} value={room.id}>
                                                {room.name} ({room.gender}) - {room.campers_count}/{room.max_capacity || '∞'}
                                            </option>
                                        ))}
                                    </select>

                                    {/* <select value={form.zone} onChange={e => setForm({ ...form, zone: e.target.value })} className={`border rounded p-2 ${errors.zone ? 'border-red-500' : ''}`} title={errors.zone?.[0] || ""}>
                                        <option value="" disabled selected>Selecciona zona</option>
                                        <option value="I">I</option>
                                        <option value="II">II</option>
                                        <option value="III">III</option>
                                        <option value="IV">IV</option>
                                        <option value="V">V</option>
                                    </select> */}
                                    <input type="text" placeholder="Equipo" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} className={`border rounded p-2 ${errors.color ? 'border-red-500' : ''}`} title={errors.color?.[0] || ""} />
                                    <input type="text" placeholder="Serial" value={form.serial} onChange={e => setForm({ ...form, serial: e.target.value })} className={`border rounded p-2 ${errors.serial ? 'border-red-500' : ''}`} title={errors.serial?.[0] || ""} required />
                                    <select value={form.payment_method} onChange={e => setForm({ ...form, payment_method: e.target.value })} className={`border rounded p-2 ${errors.payment_method ? 'border-red-500' : ''}`} title={errors.payment_method?.[0] || ""} required>
                                        <option value="" disabled>Método de pago</option>
                                        <option value="Pago movil">Pago móvil</option>
                                        <option value="Transferencia">Transferencia</option>
                                        <option value="Efectivo">Efectivo</option>
                                        <option value="Divisas">Divisas</option>
                                        <option value="Custom">Personalizado (dejar comentario)</option>
                                    </select>
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="Monto en USD"
                                        value={form.usd_amount}
                                        onChange={e => setForm({ ...form, usd_amount: e.target.value })}
                                        className={`border rounded p-2 ${errors.usd_amount ? 'border-red-500' : ''}`}
                                        title={errors.usd_amount?.[0] || ""}
                                        />

                                    <input type="text" placeholder="Referencia (opcional)" value={form.reference} onChange={e => setForm({ ...form, reference: e.target.value })} className="border rounded p-2" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" checked={form.baptized} onChange={e => setForm({ ...form, baptized: e.target.checked })} />
                                    <label>Bautizado</label>
                                </div>
                                <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} className="w-full border rounded p-2">
                                    <option value="male">Masculino</option>
                                    <option value="female">Femenino</option>
                                </select>
                                <textarea placeholder="Comentarios" value={form.comments} onChange={e => setForm({ ...form, comments: e.target.value })} className="w-full border rounded p-2" rows={3} />
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
