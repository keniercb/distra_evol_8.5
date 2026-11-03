/*UCID.portal.cargarAcciones(window.frameElement.id, function() {
 var vistaMenuAlimento = new LOG.inv.alimento.View({
 acciones: acciones_reportes,
 });
 vistaMenuAlimento.init();
 vistaMenuAlimento.view();
 });*/
function cargarInterfaz() {
    Ext.onReady(function() {
        new Ext.LOG.RegNumOperativo.RegistroNumOperativoMain({
            idioma: Ext.LOG.RegNumOperativo.Idioma,
            acciones_reportes: acciones_reportes,
			id:"idRegistroNumericoMain"
        });
    });
}

UCID.portal.cargarAcciones(window.frameElement.id, function () {
    perfil = window.parent.parent.UCID.portal.perfil;
    cargarInterfaz();
});

function getCMPRegistroActivos(){
	return Ext.getCmp("idRegistroNumericoMain");
}