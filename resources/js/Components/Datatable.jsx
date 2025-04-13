import { FaTrash, FaEdit } from 'react-icons/fa';

export default function DataTable({ columns = [], data = [], onEdit, onDelete }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full border text-left min-w-max">
                <thead>
                    <tr className="bg-gray-100">
                        {columns.map((col) => (
                            <th key={col.key} className="px-4 py-2 whitespace-nowrap">
                                {col.label}
                            </th>
                        ))}
                        {(onEdit || onDelete) && (
                            <th className="px-4 py-2 whitespace-nowrap">Acciones</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="text-center px-4 py-6 text-gray-500">
                                No hay datos registrados.
                            </td>
                        </tr>
                    ) : (
                        data.map((item) => (
                            <tr key={item.id} className="border-t">
                                {columns.map((col) => (
                                    <td key={col.key} className="px-4 py-2 whitespace-nowrap">
                                        {item[col.key] || '---'}
                                    </td>
                                ))}
                                {(onEdit || onDelete) && (
                                    <td className="px-4 py-2 space-x-3">
                                        {onEdit && (
                                            <button
                                                onClick={() => onEdit(item)}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <FaEdit />
                                            </button>
                                        )}
                                        {onDelete && (
                                            <button
                                                onClick={() => onDelete(item.id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <FaTrash />
                                            </button>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
