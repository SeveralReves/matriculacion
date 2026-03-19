import { useEffect, useState, useRef } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { showSuccess, showError, showToast } from "@/utils/swalHelper";
import { fetchWithAuth } from "@/utils/axiosInstance";
import axios from "axios";

export default function ImportExport({ auth }) {
    const [camps, setCamps] = useState([]);
    const [selectedCampId, setSelectedCampId] = useState("");
    const [importing, setImporting] = useState(false);
    const fileInputRef = useRef(null);

    // URL de tu Google Sheets
    const TEMPLATE_URL = "https://docs.google.com/spreadsheets/d/1SKIRaZh7zmCgBRcZaG_CmhnqIlL9qqUVjyk64_qwU3Y/edit?usp=sharing";

    useEffect(() => {
        fetchWithAuth("get", "/api/camps")
            .then((res) => setCamps(res.data))
            .catch(() => showError("Error al cargar campamentos"));
    }, []);

    const handleFileUpload = async () => {
        const file = fileInputRef.current?.files?.[0];
        if (!file || !selectedCampId) {
            return showError("Datos incompletos", "Debes seleccionar un archivo y un campamento.");
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("camp_id", selectedCampId);

        setImporting(true);
        try {
            await fetchWithAuth("post", `/api/camps/${selectedCampId}/campers/import`, formData);
            showSuccess("¡Importación completada!");
            if (fileInputRef.current) fileInputRef.current.value = ""; // Limpiar input
        } catch (err) {
            showError("Error al importar", "Verifica que el archivo sea válido y tenga el formato correcto.");
        } finally {
            setImporting(false);
        }
    };

    const handleExport = async () => {
        if (!selectedCampId) {
            return showError("Campamento no seleccionado", "Selecciona un campamento para exportar.");
        }

        try {
            await axios.get("/sanctum/csrf-cookie");
            const token = decodeURIComponent(
                document.cookie
                    .split("; ")
                    .find(row => row.startsWith("XSRF-TOKEN"))
                    ?.split("=")[1] || ""
            );

            const response = await axios.get(`/api/camps/${selectedCampId}/campers/export`, {
                responseType: "blob",
                headers: {
                    "X-XSRF-TOKEN": token,
                    "X-Requested-With": "XMLHttpRequest",
                    withCredentials: true,
                },
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `campamento-${selectedCampId}-acampantes.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove(); // Limpieza

            showToast("success", "Archivo exportado");
        } catch (err) {
            showError("Error al exportar", "No se pudo generar el archivo.");
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Importar/Exportar Acampantes" />

            <div className="max-w-2xl mx-auto py-10 px-4">
                <h1 className="text-2xl font-bold mb-6">Importar / Exportar Acampantes</h1>

                {/* Sección de Selección de Campamento */}
                <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
                    <label className="block font-semibold mb-2 text-gray-700">1. Seleccionar Campamento:</label>
                    <select
                        className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none"
                        value={selectedCampId}
                        onChange={(e) => setSelectedCampId(e.target.value)}
                    >
                        <option value="">-- Selecciona un destino --</option>
                        {camps.map((camp) => (
                            <option key={camp.id} value={camp.id}>
                                {camp.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Sección de Importación */}
                <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
                    <h2 className="font-semibold mb-4 text-gray-700">2. Importar Datos</h2>
                    
                    {/* CUADRO DE AYUDA / PLANTILLA */}
                    <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded flex items-start">
                        <div className="flex-shrink-0 mt-0.5">
                            <span className="text-blue-500">ℹ️</span>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-blue-800">
                                <strong>¿No tienes el formato?</strong> Para asegurar que los datos se carguen correctamente, utiliza nuestra plantilla de ejemplo.
                            </p>
                            <a
                                href={TEMPLATE_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block mt-2 text-sm font-bold text-blue-600 hover:text-blue-800 underline underline-offset-2"
                            >
                                📊 Ver Plantilla en Google Sheets
                            </a>
                        </div>
                    </div>

                    <label className="block text-sm font-medium text-gray-600 mb-2">Selecciona archivo (.xlsx, .xls, .csv):</label>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input 
                            ref={fileInputRef} 
                            type="file" 
                            accept=".xlsx,.xls,.csv" 
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
                        />
                        <button
                            onClick={handleFileUpload}
                            disabled={importing || !selectedCampId}
                            className={`px-6 py-2 rounded font-bold text-white transition ${
                                importing || !selectedCampId 
                                ? "bg-gray-400 cursor-not-allowed" 
                                : "bg-green-600 hover:bg-green-700 shadow-md"
                            }`}
                        >
                            {importing ? "Procesando..." : "Subir e Importar"}
                        </button>
                    </div>
                </div>

                {/* Sección de Exportación */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h2 className="font-semibold mb-4 text-gray-700">3. Respaldar / Exportar</h2>
                    <p className="text-sm text-gray-500 mb-4">Descarga la lista completa de acampantes registrados en el campamento seleccionado.</p>
                    <button
                        onClick={handleExport}
                        disabled={!selectedCampId}
                        className={`inline-flex items-center px-6 py-2 rounded font-bold text-white transition ${
                            !selectedCampId 
                            ? "bg-gray-400 cursor-not-allowed" 
                            : "bg-blue-600 hover:bg-blue-700 shadow-md"
                        }`}
                    >
                        <span>📥 Exportar a Excel</span>
                    </button>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}