objCmpFip = new Utilidades.Cmp.Cmpgestionarfip(
    {
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
        noUsarMenuGrid: false,
        noUsarAyuda: false,
        titleWinPrincipal: '',
        closableWinPrincipal: false,
        noUsarPaginado: false,
        reordenarHijos: false
    });
objCmpFip.CargarCmpFip(idelemento = null, tipoelemento = null, parentelemento = null, PostAccionesRelacionar = null, []);