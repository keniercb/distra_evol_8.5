objCmpActividades = new Utilidades.Cmp.Cmpgestionaractividades(
        {
            noUsarAdicionar: false,
            noUsarModificar: false,
            noUsarEliminar: false,
            noUsarActivar: false,
            noUsarDesactivar: false,
            noUsarCerrarWinP: true,
            noUsarSeleccionarWinP: true,
            maxWinPrincipal: true,
            noUsarCbAprob: false,
            noUsarGestObser: false,
            noMostrarColumObser: false,
            singlemodoSeleccionGridActividades: false,
            reordenarHijos: false,
            idcmp: 'local',
            tipoComponente: '',
            noUsarMenuGrid: false,
            noAutoload: false,
            nombrePanel: '',
            noUsarAyuda:false,
            noUsarPaginado: false,
            verificarPuntualizacion:true
        });
objCmpActividades.CargarCmpActividades(idelemento = null, tipoelemento = null, parentelemento = null, PostAccionesRelacionar = null, reorganizar = null);