<?php

namespace App\Exports;

use App\Models\Camper;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class CampersExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize
{
    protected $campId;

    public function __construct($campId)
    {
        $this->campId = $campId;
    }

    /**
     * Obtenemos todos los registros del campamento seleccionado.
     */
    public function collection()
    {
        return Camper::where('camp_id', $this->campId)->get();
    }

    /**
     * Definimos los encabezados descriptivos para el Excel.
     */
    public function headings(): array
    {
        return [
            'ID',
            'Nombre',
            'Apellido',
            'Cédula',
            'Género',
            'Email',
            'Teléfono',
            'Iglesia',
            'Zona/Distrito',
            'Edad',
            'Fecha Nac.',
            'Equipo',
            'Bautizado',
            'Serial',
            'Método Pago',
            'Monto (USD)',
            'Referencia',
            'Habitación',
            'Comentarios',
            'Fecha Registro'
        ];
    }

    /**
     * Mapeamos cada columna con su valor correspondiente del modelo.
     * Aquí puedes formatear los datos (ej. fechas o booleanos).
     */
    public function map($camper): array
    {
        return [
            $camper->id,
            $camper->first_name,
            $camper->last_name,
            $camper->identity_card ?? 'N/A',
            $camper->gender === 'male' ? 'Masculino' : 'Femenino',
            $camper->email,
            $camper->phone ?? 'Sin número',
            $camper->church,
            $camper->zone,
            $camper->age,
            $camper->birth_date,
            $camper->color,
            $camper->baptized ? 'Sí' : 'No',
            $camper->serial,
            $camper->payment_method,
            $camper->usd_amount ? '$' . number_format($camper->usd_amount, 2) : '0.00',
            $camper->reference,
            $camper->room ? $camper->room->name : 'No asignada', // Asumiendo relación 'room'
            $camper->comments,
            $camper->created_at->format('d/m/Y H:i'),
        ];
    }
}