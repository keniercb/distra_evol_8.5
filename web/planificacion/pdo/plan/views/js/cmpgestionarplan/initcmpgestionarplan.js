objCmpPlan = new Utilidades.Cmp.Cmpgestionarplan(
{	
	idcomponente:'local',
	noUsarModificar:false,
	noUsarEliminar:false,
	noUsarAddObj: false,
	noUsarAddAct: false,
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
	noUsarAyuda:false,
	titleWinPrincipal:'',
	noUsarPaginado: false
});
objCmpPlan.CargarCmpPlan(idelemento = null,tipoelemento = null,parentelemento = null,PostAccionesRelacionar = null);