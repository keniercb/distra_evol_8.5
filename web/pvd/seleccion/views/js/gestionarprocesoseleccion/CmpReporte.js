/*
 * Componente Reporte.
 *
 * @author Ing.Orestes Rodríguez Lorenzo
 * @package Pvd.Seleccion
 * @uses Pvd.Seleccion.Gestionarprocesoseleccion.PanelReporte
 * @copyright XETID
 * @version 1.0
 */
Ext.ns('Pvd.Seleccion.Gestionarprocesoseleccion'); Ext.QuickTips.init();
Pvd.Seleccion.Gestionarprocesoseleccion.PanelReporte = Ext.extend(Ext.Panel, {
    layout        : 'fit', 
	id            : 'reporte',
	title         : 'Reporte',
	region        : 'center',
	width         : '100%',
	closable      : true,
	//iconCls       : 'reporte',
    initComponent : function() {
        var self = this;
		this.objRecComplejas = new Ext.components.CmpReccomplejas.Interfaz({
			margins: '5 0 5 0',
			title: this.idioma.lbReporteper,
			width: '100%',
			height: 430,
			singleSelect: false,
			region: 'center',
			border: true,
			idconfiguracion: 'seleccion',
			tituloReporte: this.idioma.lbReporteper, 
			tituloConfiguracion: this.idioma.lbConfigBusper,
			tituloGrid: this.idioma.lbListadoper,
			hideBtnRtf: true,
			noUsarGestAvisos: true, //False si voy a usar el componente de Gestionar avisos
			useMap: false,
			hideBtnOperCant: false,
			autoLoadList: true,
			filters : [{idcampo:'1439', condicion: '=', valor: self.idproceso}]
		});
		this.items = [this.objRecComplejas];
        Pvd.Seleccion.Gestionarprocesoseleccion.PanelAnalisis.superclass.initComponent.call(this);
    }
});
