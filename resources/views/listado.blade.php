@extends('layouts.default')

@section('content')
    <div class="btn__container">
        <a href="/" class="btn">Inicio</a>
        <a href="/registrar" class="btn btn-primary">Registro</a>
        <a href="/comedor" class="btn btn-secondary">Comedor</a>
    </div>
    <table class="table">
        <thead>
            <td>
                Brazalete
            </td>
            <td>
                Nombre
            </td>
            <td>
                Equipo
            </td>
            <td>
                Conferencia
            </td>
            <td>
                Zona
            </td>
            <td>
                Bautizado
            </td>
            <td>
                Pago
            </td>
            <td>
                Método de paago 
            </td>
        </thead>
        <tbody>
            @foreach ($attendees as $item)
            <tr>
                <td>
                    {{ $item->serial }}
                </td>
                <td>
                    {{ $item->name }} {{ $item->lastname }}
                </td>
                <td>
                    {{ $item->color }}
                </td>
                <td>
                    {{ $item->conference }}
                </td>
                <td>
                    {{ $item->payment }}
                </td>
                <td>
                    {{ $item->reference }}
                </td>
            </tr>
                
            @endforeach
        </tbody>
    </table>
    <table-data :data="{{json_encode($attendees)}}"></table-data>
@endsection
