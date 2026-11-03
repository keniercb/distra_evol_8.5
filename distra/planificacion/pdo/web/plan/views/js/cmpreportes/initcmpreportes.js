objCmpReportes = new Utilidades.Cmp.Cmpreportes(
{	
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
	singlemodoSeleccionGridPlanes:false,
	noUsarMenuGrid:false,
	closableWinPrincipal: false,
	titleWinPrincipal: ''
});
objCmpReportes.CargarCmpReportes(
	idelemento = null,tipoelemento = null,parentelemento = null,PostAccionesRelacionar = null);