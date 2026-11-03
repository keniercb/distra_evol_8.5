objCmpNotificaciones = new Utilidades.Cmp.CmpNotificaciones(
{	
	MostrarFiltroPorTipoElem:false,
	UsarBtnCerrar:true,
        maxWinPrincipal:true,
        closeableWinPrincipal:false,
        Mostrartitle:'',//Registro de notificaciones,
        noUsarAyuda: false
	
});
objCmpNotificaciones.CargarCmpNotificaciones();
