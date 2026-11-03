objCmpObjetivos = new Utilidades.Cmp.Cmpgestionarobjetivos(
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
            idcmp: 'local',
            noUsarMenuGrid: false,
            nombrePanel: 'Registro de objetivos',
            noUsarAyuda: false,
            closableWinPrincipal: false,
            titleWinPrincipal:'',
            noUsarPaginado: false
        });
objCmpObjetivos.CargarCmpObjetivos(idelemento = null, tipoelemento = null, parentelemento = null, PostAccionesRelacionar = null, arrayidobjetivosReorganizar = []);