<?php

namespace App\Imports;

use App\Models\Camper;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;

class CampersImport implements ToModel, WithHeadingRow, SkipsEmptyRows
{
    protected $campId;

    /**
     * Mapeo de campos de la BD a posibles encabezados del Excel.
     * Esto permite que si el Excel dice "Nombre" o "Nombres", ambos funcionen.
     */
    protected $fieldMap = [
        'first_name'    => ['nombres', 'nombre', 'first_name'],
        'last_name'     => ['apellidos', 'apellido', 'last_name'],
        'email'         => ['direccion_de_correo_electronico', 'email', 'correo'],
        'identity_card' => ['numero_de_cedula', 'cedula', 'dni', 'id'],
        'phone'         => ['numero_de_contacto', 'telefono', 'phone', 'celular'],
        'church'        => ['nombre_de_iglesia', 'iglesia', 'church'],
        'zone'          => ['pertenezco_al_distrito', 'distrito', 'zona', 'zone'],
        'gender'        => ['sexo', 'genero', 'gender'],
        'age'           => ['edad', 'age'],
        'reference'     => ['referencia_del_pago', 'referencia', 'reference'],
        'payment_method'=> ['metodo_de_pago', 'payment_method'],
        'usd_amount'    => ['monto_del_pago', 'monto', 'pago', 'amount'],
        'color'         => ['eqp', 'equipo', 'color'],
    ];

    public function __construct($campId)
    {
        $this->campId = $campId;
    }

    public function model(array $row)
    {
        // 1. Extraemos los campos principales usando los alias
        $data = $this->extractMainFields($row);

        // 2. Todo lo que NO esté en el mapeo principal va a "Campos Extra"
        $extraComments = $this->collectExtraFields($row);

        // 3. Procesamiento de datos específicos
        $email = $data['email'] ?? 'import_' . Str::random(10) . '@sincorreo.com';
        $birthDate = $this->estimateBirthDate($data['age'] ?? null);
        $serial = 'IMPORT-' . strtoupper(Str::random(6));

        return Camper::updateOrCreate(
            [
                'email'   => $email,
                'camp_id' => $this->campId,
            ],
            [
                'first_name'     => $data['first_name'] ?? 'Sin nombre',
                'last_name'      => $data['last_name'] ?? 'Sin apellido',
                'gender'         => $this->mapGender($data['gender'] ?? ''),
                'identity_card'  => $this->cleanNumber($data['identity_card'] ?? null),
                'phone'          => $this->cleanNumber($data['phone'] ?? null),
                'church'         => $data['church'] ?? 'No especificada',
                'zone'           => $data['zone'] ?? 'No asignada',
                'color'          => $data['color'] ?? 'sin_asignar',
                'baptized'       => false,
                'birth_date'     => $birthDate,
                'serial'         => $serial,
                'payment_method' => $data['payment_method'] ?? 'Importado',
                'usd_amount'     => $this->normalizeUsdAmount($data['usd_amount'] ?? null),
                'reference'      => $data['reference'] ?? null,
                'comments'       => $extraComments,
            ]
        );
    }

    /**
     * Busca en el renglón los campos definidos en el fieldMap.
     */
    private function extractMainFields(array $row): array
    {
        $extracted = [];
        foreach ($this->fieldMap as $dbField => $aliases) {
            foreach ($aliases as $alias) {
                if (isset($row[$alias])) {
                    $extracted[$dbField] = $row[$alias];
                    break; // Encontró el primero y pasa al siguiente campo de la BD
                }
            }
        }
        return $extracted;
    }

    /**
     * Identifica columnas que no son parte del flujo principal y las concatena.
     */
    private function collectExtraFields(array $row): string
    {
        $extra = [];
        // Obtenemos todos los encabezados que SI mapeamos para ignorarlos
        $knownHeaders = collect($this->fieldMap)->flatten()->toArray();

        foreach ($row as $key => $value) {
            if (!in_array($key, $knownHeaders) && !empty($value)) {
                // Convertimos el slug (ej: nombre_del_pastor) a un label legible (Nombre del pastor)
                $label = Str::ucfirst(str_replace('_', ' ', $key));
                $extra[] = "{$label}: {$value}";
            }
        }

        return implode(' | ', $extra);
    }

    private function normalizeUsdAmount($raw)
    {
        if (is_null($raw) || $raw === '') return null;

        // Convertimos a string y limpiamos espacios o símbolos de moneda
        $value = str_replace(['$', 'USD', 'usd', ' '], '', trim((string)$raw));

        // Si no hay números, fuera.
        if (!preg_match('/[\d\.\,]+/', $value, $matches)) return null;
        
        $numberStr = $matches[0];

        // Lógica inteligente de conversión:
        // Si tiene coma y punto (ej: 1.200,50), el punto es miles y la coma es decimal.
        if (str_contains($numberStr, ',') && str_contains($numberStr, '.')) {
            $numberStr = str_replace('.', '', $numberStr); // Quitar miles
            $numberStr = str_replace(',', '.', $numberStr); // Cambiar coma a punto decimal
        } 
        // Si solo tiene coma (ej: 30,00), la tratamos como decimal.
        elseif (str_contains($numberStr, ',')) {
            $numberStr = str_replace(',', '.', $numberStr);
        }

        $float = filter_var($numberStr, FILTER_VALIDATE_FLOAT);

        if ($float === false) return null;

        // He subido el límite a 5000 por si alguien paga varios cupos juntos, 
        // ajústalo según el precio de tus campamentos.
        return ($float > 0 && $float < 5000) ? round($float, 2) : null;
    }

    private function mapGender($value)
    {
        $value = strtolower(trim($value));
        return match (true) {
            str_starts_with($value, 'm') => 'male',
            str_starts_with($value, 'f') => 'female',
            default => 'other',
        };
    }

    private function cleanNumber($value)
    {
        return $value ? preg_replace('/[^0-9]/', '', $value) : null;
    }

    private function estimateBirthDate($age)
    {
        if (is_numeric($age)) {
            return now()->subYears((int) $age)->startOfYear();
        }
        return now()->subYears(18); // Default por si acaso
    }
}