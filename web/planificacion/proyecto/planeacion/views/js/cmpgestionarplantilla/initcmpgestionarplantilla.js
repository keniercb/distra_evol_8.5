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
        nombreGrid: 'Registro de proyectos',
        msgMascara: 'Cargando proyectos...',
        dependenciaTotal: false,
        dependenciaPorcentual: false,
        dependenciaPuertaAbierta: false,
        noAutoload: false,
        singleSeleccion: false,
        reordenarHijos: false,
        desasociarVisible: true
    });
objCmpPlantilla.CargarCmpPlantilla();