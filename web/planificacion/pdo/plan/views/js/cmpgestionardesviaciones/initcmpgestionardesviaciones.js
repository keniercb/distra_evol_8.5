objCmpDesviaciones = new Utilidades.Cmp.Cmpgestionardesviaciones(
        {
            noUsarModificar: false,
            noUsarEliminar: false,
            noUsarAdicionar: false,
            noUsarDesactivar: false,
            noUsarLimpiar: false,
            noUsarAyuda: false,
            noUsarPublicacion: false,
            noUsarCerrarWinP: true,
            noUsarPaginado: false,
            singlemodoSeleccionGridDesviaciones: false,
            idcmp: 'local',
            noUsarMenuGrid: false,
            cargarDatos: true,
            noUsarSeleccionarWinP: true,
            maxWinPrincipal: true,
            usarMensaje: true,
            titleWinPrincipal: '',
            closableWinPrincipal: false,
            noUsarPaginado: false,
            noTitle: true
        });
objCmpDesviaciones.CargarCmpDesviaciones(idelemento = null, PostAccionesRelacionar = null);