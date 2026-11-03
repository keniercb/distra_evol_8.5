Ext.ns('Maestro.Reporte.view');

Maestro.Reporte.view.ContainerReporte = Ext.extend( Ext.Panel, {
  	layout: 'border',
   	bodyBorder : false,
   	border: false,
  	initComponent: function() {
    	var me = this,
        	viewsRequired = (me.required)?me.required.views : null;
       
        me.items = [viewsRequired.panelfilters, viewsRequired.reportedata];

        Maestro.Reporte.view.ContainerReporte.superclass.initComponent.call(this);
    }
});