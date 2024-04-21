@extends('layouts.default')

@section('content')
    <div class="btn__container">
        <a href="/" class="btn btn-primary">Inicio</a>
        <a href="/registrar" class="btn btn-primary">Registrar</a>
        <a href="/listado" class="btn">Listado</a>
        <a href="/comedor" class="btn btn-secondary">Comedor</a>
    </div>
    <div class="mt-0">
        {{-- Jueves --}}
        <div class="caja-contador">
            <h2 class="caja-contador-titulo">Jueves - desayuno</h2>
            <div class="caja-contador-grid">
                <div class="caja-contador-columna">
                    <h2 class="caja-contador-columna-titulo">Total</h2>
                    <p class="caja-contador-texto">{{$total}}</p>
                </div>
                <div class="caja-contador-columna">
                    <h2 class="caja-contador-columna-titulo">Listos</h2>
                    <p class="caja-contador-texto">{{$countJuevesAM}}</p>
                </div>
                <div class="caja-contador-columna">
                    <h2 class="caja-contador-columna-titulo">Faltantes</h2>
                    <p class="caja-contador-texto">{{$total - $countJuevesAM}}</p>
                </div>
            </div>
        </div>
        <div class="caja-contador">
            <h2 class="caja-contador-titulo">Jueves - Almuerzo</h2>
            <div class="caja-contador-grid">
                <div class="caja-contador-columna">
                    <h2 class="caja-contador-columna-titulo">Total</h2>
                    <p class="caja-contador-texto">{{$total}}</p>
                </div>
                <div class="caja-contador-columna">
                    <h2 class="caja-contador-columna-titulo">Listos</h2>
                    <p class="caja-contador-texto">{{$countJuevesM}}</p>
                </div>
                <div class="caja-contador-columna">
                    <h2 class="caja-contador-columna-titulo">Faltantes</h2>
                    <p class="caja-contador-texto">{{$total - $countJuevesM}}</p>
                </div>
            </div>
        </div>
        <div class="caja-contador">
            <h2 class="caja-contador-titulo">Jueves - Cena</h2>
            <div class="caja-contador-grid">
                <div class="caja-contador-columna">
                    <h2 class="caja-contador-columna-titulo">Total</h2>
                    <p class="caja-contador-texto">{{$total}}</p>
                </div>
                <div class="caja-contador-columna">
                    <h2 class="caja-contador-columna-titulo">Listos</h2>
                    <p class="caja-contador-texto">{{$countJuevesPM}}</p>
                </div>
                <div class="caja-contador-columna">
                    <h2 class="caja-contador-columna-titulo">Faltantes</h2>
                    <p class="caja-contador-texto">{{$total - $countJuevesPM}}</p>
                </div>
            </div>
        </div>
        
        {{-- Viernes --}}
        <div class="caja-contador">
            <h2 class="caja-contador-titulo">Viernes - desayuno</h2>
            <div class="caja-contador-grid">
                <div class="caja-contador-columna">
                    <h2 class="caja-contador-columna-titulo">Total</h2>
                    <p class="caja-contador-texto">{{$total}}</p>
                </div>
                <div class="caja-contador-columna">
                    <h2 class="caja-contador-columna-titulo">Listos</h2>
                    <p class="caja-contador-texto">{{$countViernesAM}}</p>
                </div>
                <div class="caja-contador-columna">
                    <h2 class="caja-contador-columna-titulo">Faltantes</h2>
                    <p class="caja-contador-texto">{{$total - $countViernesAM}}</p>
                </div>
            </div>
        </div>
        <div class="caja-contador">
            <h2 class="caja-contador-titulo">Viernes - Almuerzo</h2>
            <div class="caja-contador-grid">
                <div class="caja-contador-columna">
                    <h2 class="caja-contador-columna-titulo">Total</h2>
                    <p class="caja-contador-texto">{{$total}}</p>
                </div>
                <div class="caja-contador-columna">
                    <h2 class="caja-contador-columna-titulo">Listos</h2>
                    <p class="caja-contador-texto">{{$countViernesM}}</p>
                </div>
                <div class="caja-contador-columna">
                    <h2 class="caja-contador-columna-titulo">Faltantes</h2>
                    <p class="caja-contador-texto">{{$total - $countViernesM}}</p>
                </div>
            </div>
        </div>
        <div class="caja-contador">
            <h2 class="caja-contador-titulo">Viernes - Cena</h2>
            <div class="caja-contador-grid">
                <div class="caja-contador-columna">
                    <h2 class="caja-contador-columna-titulo">Total</h2>
                    <p class="caja-contador-texto">{{$total}}</p>
                </div>
                <div class="caja-contador-columna">
                    <h2 class="caja-contador-columna-titulo">Listos</h2>
                    <p class="caja-contador-texto">{{$countViernesPM}}</p>
                </div>
                <div class="caja-contador-columna">
                    <h2 class="caja-contador-columna-titulo">Faltantes</h2>
                    <p class="caja-contador-texto">{{$total - $countViernesPM}}</p>
                </div>
            </div>
        </div>
        {{-- Sabado --}}
        <div class="caja-contador">
            <h2 class="caja-contador-titulo">Sabado - desayuno</h2>
            <div class="caja-contador-grid">
                <div class="caja-contador-columna">
                    <h2 class="caja-contador-columna-titulo">Total</h2>
                    <p class="caja-contador-texto">{{$total}}</p>
                </div>
                <div class="caja-contador-columna">
                    <h2 class="caja-contador-columna-titulo">Listos</h2>
                    <p class="caja-contador-texto">{{$countSabadoAM}}</p>
                </div>
                <div class="caja-contador-columna">
                    <h2 class="caja-contador-columna-titulo">Faltantes</h2>
                    <p class="caja-contador-texto">{{$total - $countSabadoAM}}</p>
                </div>
            </div>
        </div>
        <div class="caja-contador">
            <h2 class="caja-contador-titulo">Sabado - Almuerzo</h2>
            <div class="caja-contador-grid">
                <div class="caja-contador-columna">
                    <h2 class="caja-contador-columna-titulo">Total</h2>
                    <p class="caja-contador-texto">{{$total}}</p>
                </div>
                <div class="caja-contador-columna">
                    <h2 class="caja-contador-columna-titulo">Listos</h2>
                    <p class="caja-contador-texto">{{$countSabadoM}}</p>
                </div>
                <div class="caja-contador-columna">
                    <h2 class="caja-contador-columna-titulo">Faltantes</h2>
                    <p class="caja-contador-texto">{{$total - $countSabadoM}}</p>
                </div>
            </div>
        </div>
        <div class="caja-contador">
            <h2 class="caja-contador-titulo">Sabado - Cena</h2>
            <div class="caja-contador-grid">
                <div class="caja-contador-columna">
                    <h2 class="caja-contador-columna-titulo">Total</h2>
                    <p class="caja-contador-texto">{{$total}}</p>
                </div>
                <div class="caja-contador-columna">
                    <h2 class="caja-contador-columna-titulo">Listos</h2>
                    <p class="caja-contador-texto">{{$countSabadoPM}}</p>
                </div>
                <div class="caja-contador-columna">
                    <h2 class="caja-contador-columna-titulo">Faltantes</h2>
                    <p class="caja-contador-texto">{{$total - $countSabadoPM}}</p>
                </div>
            </div>
        </div>

    </div>
@endsection
