<?php

namespace App\Imports;

use App\Models\Camper;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class CampersImport implements ToModel, WithHeadingRow
{
    protected $campId;

    public function __construct($campId)
    {
        $this->campId = $campId;
    }

    public function model(array $row)
    {
        $comments = [];

       $camposExtra = [
            'primera_vez_que_asistes_a_campamento' => 'Primera vez en campamento',
            'indique_si_el_acampante_presenta_algun_tipo_de_alergia_o_condicion_medica_de_cuidado' => 'Alergias o condiciones médicas',
            'nombre_y_apellido_del_pastor' => 'Pastor',
            'telefono_del_pastor' => 'Teléfono del Pastor',
            'aporte_alimenticio_que_dara_la_iglesia_cada_pastor_o_lider_de_jovenes_debe_colocarse_en_contacto_con_la_mesa_de_campamento_para_indicar_cual_sera_el_aporte_no_se_pueden_inscribir_sin_antes_indicarlo' => 'Aporte alimenticio',
            'carta_pastoral_sino_la_tiene_debe_llevarla_obligatoriamente_a_campamento' => 'Carta pastoral',
            'fecha_del_pago' => 'Fecha de pago',
        ];

        foreach ($camposExtra as $key => $label) {
            if (!empty($row[$key])) {
                $comments[] = $label . ': ' . $row[$key];
            }
        }

        // Estimación de birth_date
        $birthDate = null;
        if (!empty($row['edad']) && is_numeric($row['edad'])) {
            $birthDate = now()->subYears((int) $row['edad'])->startOfYear();
        }
        return new Camper([
            'camp_id'         => $this->campId,
            'first_name'      => $row['nombres'] ?? 'Sin nombre',
            'last_name'       => $row['apellidos'] ?? 'Sin apellido',
            'gender'          => $this->mapGender($row['sexo'] ?? ''),
            'identity_card'   => $this->cleanString($row['numero_de_cedula'] ?? null),
            'phone'           => $this->cleanString($row['numero_de_contacto'] ?? null),
            'church'          => $row['nombre_de_iglesia'] ?? 'No especificada',
            'email'           => $row['direccion_de_correo_electronico'] ?: 'sin@email.com',
            'zone'            => $row['pertenezco_al_distrito'] ?? 'No asignada',
            'color'           => 'sin_asignar',
            'baptized'        => false,
            'birth_date'      => $birthDate ?? now()->subYears(18),
            'serial'          => 'IMPORT-' . strtoupper(Str::random(6)),
            'payment_method'  => 'Desconocido',
            'usd_amount'      => null,
            'reference'       => $row['referencia_del_pago'] ?? null,
            'comments'        => implode(' | ', $comments),
        ]);
    }


    private function mapGender($value)
    {
        $value = strtolower(trim($value));
        return match ($value) {
            'masculino', 'hombre', 'm' => 'male',
            'femenino', 'mujer', 'f' => 'female',
            default => 'other',
        };
    }

    private function cleanString($value)
    {
        return $value ? preg_replace('/[^0-9]/', '', $value) : null;
    }
}
