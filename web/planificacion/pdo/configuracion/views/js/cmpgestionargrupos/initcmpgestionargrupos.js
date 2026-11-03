objCmpGrupos = new Utilidades.Cmp.Cmpgestionargrupos(
{	
	idcomponente:'local',
	noUsarAdicionar:false,
	noUsarModificar:false,
	noUsarEliminar:false,
	noUsarActivar:false,
	noUsarDesactivar:false,
	noUsarCerrarWinP:true,
	noUsarSeleccionarWinP:true,
	tipoComponente:'panel',
	seleccionsimple:false,
	maxWinPrincipal:true
});
objCmpGrupos.CargarCmpGrupo();