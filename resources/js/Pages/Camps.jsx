import { useEffect, useState } from "react";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { fetchWithAuth } from "@/utils/axiosInstance";
import DataTable from "@/Components/DataTable";

export default function Camps({ auth }) {
    const [camps, setCamps] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState({
        name: "",
        start_date: "",
        end_date: "",
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const columns = [
        { key: "name", label: "Nombre" },
        { key: "start_date", label: "Inicio" },
        { key: "end_date", label: "Fin" },
    ];

    useEffect(() => {
        fetchWithAuth("get", "/api/camps").then((res) => setCamps(res.data));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const method = isEditing ? "post" : "post";
        const url = isEditing ? `/api/camps/${editId}` : "/api/camps";
        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("start_date", form.start_date);
        formData.append("end_date", form.end_date);
        if (imageFile) formData.append("image", imageFile);

        // Si estamos editando, agregamos el override del método
        if (isEditing) formData.append("_method", "PUT");

        axios
            .post(url, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "X-CSRF-TOKEN": document.querySelector(
                        'meta[name="csrf-token"]'
                    ).content,
                },
            })
            .then((res) => {
                if (isEditing) {
                    setCamps((prev) =>
                        prev.map((c) => (c.id === editId ? res.data : c))
                    );
                } else {
                    setCamps((prev) => [...prev, res.data]);
                }
                setForm({ name: "", start_date: "", end_date: "" });
                setImageFile(null);
                setImagePreview(null);
                setIsEditing(false);
                setEditId(null);
                setShowModal(false);
            });
    };

    const handleEdit = (camp) => {
        setForm({
            name: camp.name,
            start_date: camp.start_date,
            end_date: camp.end_date || "",
        });
        setImagePreview(camp.image_path ? `/storage/${camp.image_path}` : null);
        setIsEditing(true);
        setEditId(camp.id);
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (!confirm("¿Seguro que quieres eliminar este campamento?")) return;
        axios
            .delete(`/api/camps/${id}`, {
                headers: {
                    "X-CSRF-TOKEN": document.querySelector(
                        'meta[name="csrf-token"]'
                    ).content,
                },
            })
            .then(() => {
                setCamps((prev) => prev.filter((c) => c.id !== id));
            });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Campamentos
                </h2>
            }
        >
            <Head title="Campamentos" />
            <div className="max-w-6xl mx-auto py-10 px-4">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                    <h1 className="text-2xl font-bold">Campamentos</h1>
                    <button
                        onClick={() => {
                            setForm({ name: "", start_date: "", end_date: "" });
                            setImageFile(null);
                            setImagePreview(null);
                            setIsEditing(false);
                            setEditId(null);
                            setShowModal(true);
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Crear campamento
                    </button>
                </div>
                <DataTable
                    columns={columns}
                    data={camps}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />

                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                            <h2 className="text-lg font-bold mb-4">
                                {isEditing
                                    ? "Editar campamento"
                                    : "Crear nuevo campamento"}
                            </h2>
                            <form
                                onSubmit={handleSubmit}
                                className="space-y-4"
                                encType="multipart/form-data"
                            >
                                <input
                                    type="text"
                                    placeholder="Nombre"
                                    value={form.name}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            name: e.target.value,
                                        })
                                    }
                                    className="w-full border rounded p-2"
                                    required
                                />
                                <input
                                    type="date"
                                    value={form.start_date}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            start_date: e.target.value,
                                        })
                                    }
                                    className="w-full border rounded p-2"
                                    required
                                />
                                <input
                                    type="date"
                                    value={form.end_date}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            end_date: e.target.value,
                                        })
                                    }
                                    className="w-full border rounded p-2"
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        setImageFile(file);
                                        setImagePreview(
                                            URL.createObjectURL(file)
                                        );
                                    }}
                                />
                                {imagePreview && (
                                    <img
                                        src={imagePreview}
                                        alt="Vista previa"
                                        className="rounded w-full max-h-48 object-cover"
                                    />
                                )}
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
