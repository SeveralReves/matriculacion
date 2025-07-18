import { useEffect, useState, useRef } from "react";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function ImportExport({ auth }) {
    const [camps, setCamps] = useState([]);
    const [selectedCampId, setSelectedCampId] = useState("");
    const [importing, setImporting] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        axios.get("/api/camps").then((res) => setCamps(res.data));
    }, []);

    const handleFileUpload = async () => {
        const file = fileInputRef.current?.files?.[0];
        if (!file || !selectedCampId) return alert("Selecciona un archivo y un campamento");

        const formData = new FormData();
        formData.append("file", file);
        formData.append("camp_id", selectedCampId);

        setImporting(true);
        try {
            await axios.post(`/api/camps/${selectedCampId}/campers/import`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("Importación completada correctamente");
        } catch (err) {
            alert("Error al importar. Verifica el archivo.");
        } finally {
            setImporting(false);
        }
    };

    const handleExport = async () => {
        if (!selectedCampId) return alert("Selecciona un campamento");
        try {
            const response = await axios.get(`/api/camps/${selectedCampId}/campers/export`, {
                responseType: "blob",
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `campamento-${selectedCampId}-acampantes.xlsx`);
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            alert("Error al exportar acampantes");
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Importar/Exportar Acampantes" />

            <div className="max-w-xl mx-auto py-10 px-4">
                <h1 className="text-2xl font-bold mb-6">Importar / Exportar Acampantes</h1>

                <div className="mb-6">
                    <label className="block font-semibold mb-1">Seleccionar Campamento:</label>
                    <select
                        className="border rounded px-3 py-2 w-full"
                        value={selectedCampId}
                        onChange={(e) => setSelectedCampId(e.target.value)}
                    >
                        <option value="">-- Selecciona --</option>
                        {camps.map((camp) => (
                            <option key={camp.id} value={camp.id}>
                                {camp.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-6">
                    <label className="block font-semibold mb-2">Archivo Excel para importar:</label>
                    <input ref={fileInputRef} type="file" accept=".xlsx,.xls" className="mb-2" />
                    <button
                        onClick={handleFileUpload}
                        disabled={importing}
                        className="bg-green-600 text-white px-4 py-2 rounded"
                    >
                        {importing ? "Importando..." : "Importar"}
                    </button>
                </div>

                <div>
                    <button
                        onClick={handleExport}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Exportar acampantes a Excel
                    </button>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
