Ext.ns('Maestro.Reporte.view');

Maestro.Reporte.view.Container = Ext.extend( Ext.Panel, {
  	layout: 'border',
   	bodyBorder : false,
   	border: false,
   	width: '100%',
  	initComponent: function() {
    	var me = this,
        	viewsRequired = (me.required)?me.required.views : null;
       
        me.items = [viewsRequired.menureporte, viewsRequired.tabpanelreporte];

        Maestro.Reporte.view.Container.superclass.initComponent.call(this);
    }
});