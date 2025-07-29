import { useEffect, useState } from "react";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import DataTable from "@/Components/DataTable";
import { FaTrash, FaEdit } from "react-icons/fa";
import { showSuccess, showError, showConfirm } from "@/utils/swalHelper";

export default function Users({ auth }) {
    const [users, setUsers] = useState([]);
    const [camps, setCamps] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "admin",
        camp_ids: [],
    });

    useEffect(() => {
        axios.get("/api/camps").then((res) => setCamps(res.data));
        axios.get("/api/users").then((res) => setUsers(res.data));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const method = isEditing ? "put" : "post";
        const url = isEditing ? `/api/users/${editId}` : "/api/users";

        try {
            const res = await axios[method](url, form);

            if (isEditing) {
                setUsers((prev) => prev.map((u) => (u.id === editId ? res.data : u)));
                showSuccess("Usuario actualizado");
            } else {
                setUsers((prev) => [...prev, res.data]);
                showSuccess("Usuario creado");
            }

            setShowModal(false);
            setForm({ name: "", email: "", password: "", role: "admin", camp_ids: [] });
            setIsEditing(false);
            setEditId(null);
        } catch (error) {
            showError(
                "Error al guardar usuario",
                error?.response?.data?.message || "Intenta de nuevo."
            );
            console.error(error);
        }
    };


    const handleEdit = (user) => {
        setForm({
            name: user.name,
            email: user.email,
            password: "",
            role: user.role,
            camp_ids: user.camps?.map(c => c.id) || [],
        });
        setIsEditing(true);
        setEditId(user.id);
        setShowModal(true);
    };

   const handleDelete = async (id) => {
        const result = await showConfirm(
            "¿Eliminar usuario?",
            "Esta acción no se puede deshacer",
            "Sí, eliminar"
        );

        if (!result.isConfirmed) return;

        try {
            await axios.delete(`/api/users/${id}`);
            setUsers((prev) => prev.filter((u) => u.id !== id));
            showSuccess("Usuario eliminado");
        } catch (error) {
            showError(
                "Error al eliminar",
                error?.response?.data?.message || "Intenta de nuevo."
            );
            console.error(error);
        }
    };


    const columns = [
        { key: "name", label: "Nombre" },
        { key: "email", label: "Correo" },
        { key: "role", label: "Rol" },
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Usuarios</h2>}
        >
            <Head title="Usuarios" />
            <div className="max-w-6xl mx-auto py-10 px-4">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                    <h1 className="text-2xl font-bold">Usuarios</h1>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Crear usuario
                    </button>
                </div>

                <DataTable columns={columns} data={users} onEdit={handleEdit} onDelete={handleDelete} />

                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                            <h2 className="text-lg font-bold mb-4">
                                {isEditing ? "Editar usuario" : "Crear usuario"}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Nombre"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="w-full border rounded p-2"
                                    required
                                />
                                <input
                                    type="email"
                                    placeholder="Correo"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    className="w-full border rounded p-2"
                                    required
                                />
                                <input
                                    type="password"
                                    placeholder="Contraseña"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    className="w-full border rounded p-2"
                                    required={!isEditing}
                                />
                                <select
                                    value={form.role}
                                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                                    className="w-full border rounded p-2"
                                >
                                    <option value="admin">Admin</option>
                                    <option value="superadmin">Superadmin</option>
                                </select>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Campamentos asignados</label>
                                    <div className="space-y-1 max-h-40 overflow-y-auto border rounded p-2">
                                        {camps.map((camp) => (
                                            <label key={camp.id} className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    value={camp.id}
                                                    checked={form.camp_ids.includes(camp.id)}
                                                    onChange={(e) => {
                                                        const id = parseInt(e.target.value);
                                                        setForm((prev) => ({
                                                            ...prev,
                                                            camp_ids: prev.camp_ids.includes(id)
                                                                ? prev.camp_ids.filter((c) => c !== id)
                                                                : [...prev.camp_ids, id],
                                                        }));
                                                    }}
                                                />
                                                <span>{camp.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex justify-end gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 bg-gray-300 rounded"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded"
                                    >
                                        {isEditing ? "Actualizar" : "Crear"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}