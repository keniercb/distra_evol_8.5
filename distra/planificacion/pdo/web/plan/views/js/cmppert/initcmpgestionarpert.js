objCmpGestionarPert = new Utilidades.Cmp.Cmpgestionarpert(
        {
            noUsarCerrarWinP: true,
            noUsarSeleccionarWinP: true,
            maxWinPrincipal: true,
            tipoComponente: 'componente',
            idcmp: 'local',
            noAutoload: false,
            nombrePanel: '',
            noUsarAyuda: false,
            generarDiagramaDesde: 'PlanificacionAct'
        });

objCmpGestionarPert.CargarCmpPert(null, []);