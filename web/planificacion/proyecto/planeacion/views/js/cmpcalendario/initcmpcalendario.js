objCmpCalendario = new Utilidades.Cmp.Cmpcalendario({

	noUsarModificar:false,
	noUsarEliminar:false,
	noUsarActivar:false,
	noUsarDesactivar:false,
	noUsarCerrarWinP:true,
	noUsarSeleccionarWinP:true,
	maxWinPrincipal:true,
	noUsarCbAprob:false,
	noUsarGestObser:false,
	noMostrarColumObser:false,
	noUsarMenuGrid:false,
	idcomponente:"local"
});	
objCmpCalendario.CargarCmpCalendario(idelemento = null,tipoelemento = null,parentelemento = null,PostAccionesRelacionar = null);
/*objCmpCalendario = new Utilidades.Cmp.Cmpcalendario();	
objCmpCalendario.CargarCmpCalendario();*/