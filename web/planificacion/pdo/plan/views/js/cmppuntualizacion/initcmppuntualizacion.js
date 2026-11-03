objCmpPuntualizacion = new Utilidades.Cmp.CmpPuntualizacion(
{	
	MostrarFiltroPorTipoElem:false,
	UsarBtnCerrar:true,
    maxWinPrincipal:true,
    closeableWinPrincipal:false,
    Mostrartitle:'',
    noUsarAyuda: false,
    singlemodoSeleccionGridPuntualizacion: false,
    cargarDatos:true,
    noUsarModifcar:true,
    noUsarComparar:false,
    noUsarAprobar:false,
    noUsarDenegar:false,
    noUsarGestObser:false

});
objCmpPuntualizacion.CargarCmpPuntualizaciones();
