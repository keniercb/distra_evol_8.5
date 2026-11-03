objCmpPlantilla = new Utilidades.Cmp.Cmpgestionarplantilla(
    {
        noUsarAdicionar: false,
        noUsarModificar: false,
        noUsarEliminar: false,
        maxWinPrincipal: true,
        noUsarCerrarWinP: true,
        noUsarSeleccionarWinP: true,
        noUsarGestObser: false,
        noMostrarColumObser: false,
        nombrePanel: '',
        dependenciaTotal: false,
        dependenciaPorcentual: false,
        dependenciaPuertaAbierta: false,
        noAutoload: true,
        singleSeleccion: false,
        reordenarHijos: false,
        useCmbEvento:true
    });
objCmpPlantilla.CargarCmpPlantilla();