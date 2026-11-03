objCmpGestionarReportes = new Utilidades.Cmp.objCmpGestionarReportes(
    {
        integracion: false,
        noUsarCerrarWinP: true,
        noUsarSeleccionarWinP: true,
        maxWinPrincipal: true,
        idcmp: 'local',
        tipoComponente: '',
        nombrePanel: '',
        noUsarAyuda: false,
        noUsarPaginado: false
    });
objCmpGestionarReportes.cargarCmpGestionarReportes();