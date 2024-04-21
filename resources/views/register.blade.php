@extends('layouts.default')

@section('content')
    <div class="btn__container">
        <a href="/" class="btn">Inicio</a>
        <a href="/listado" class="btn">Listado</a>
        <a href="/comedor" class="btn btn-secondary">Comedor</a>
    </div>
    <div>
        <register-form></register-form>
    </div>
@endsection
