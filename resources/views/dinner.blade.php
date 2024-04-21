@extends('layouts.default')

@section('content')
    <div class="btn__container">
        <a href="/" class="btn">Inicio</a>
        <a href="/registrar" class="btn btn-primary">Registro</a>
        <a href="/listado" class="btn">Listado</a>
    </div>
    <comedor-form/>
@endsection
