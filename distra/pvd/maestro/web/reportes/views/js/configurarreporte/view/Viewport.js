Ext.ns('Maestro.ConfigurarReporte.view');

Maestro.ConfigurarReporte.view.Viewport = Ext.extend( Ext.Viewport, {
  layout: 'border',
  initComponent: function() {
    var me = this,
        viewsRequired = (me.required)?me.required.views : null;
       
        me.items = [viewsRequired.listmodule, {
        	title: Maestro.ConfigurarReporte.idiom.lbTitleListReporte,
        	region: 'center',
        	layout: 'border',
        	style: 'margin: 0 0 0 5px', 
        	items: [viewsRequired.treereporte, viewsRequired.panelreportedetails]
        }];

        Maestro.ConfigurarReporte.view.Viewport.superclass.initComponent.call(this);
    }
});