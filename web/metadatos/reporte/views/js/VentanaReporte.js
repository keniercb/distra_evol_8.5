Ext.QuickTips.init();
var perfil = window.parent.UCID.portal.perfil;
this.UCID.portal.cargarEtiquetas('reportes', cargarInterfaz);
var etiquetas = perfil.etiquetas;
function cargarInterfaz(perfil, etiquetas)
{
		reporteGrafico(perfil, etiquetas);
}