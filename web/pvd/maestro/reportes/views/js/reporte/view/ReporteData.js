Ext.ns('Maestro.Reporte.view');

Maestro.Reporte.view.ReporteData = Ext.extend( Ext.Panel, {
    region: 'center',
   	bodyBorder : false,
   	border: false,
    iframeId: 0,
    layout: 'fit',
  	initComponent: function() {
    	var me = this,
        	viewsRequired = (me.required)?me.required.views : null;

        me.iframeId = Ext.id(null, 'report-');
       
        me.tbar = viewsRequired.tbarreporte;

        me.html= '<iframe id="'+me.iframeId+'" frameborder="0" width="100%" height="100%"></iframe>';

        Maestro.Reporte.view.ReporteData.superclass.initComponent.call(this);
    },
    showLoadMask: function(){
        var me = this;
        if(!me.loadmask)
            me.loadmask = new Ext.LoadMask(me.el, {msg:Maestro.Reporte.idiom.lbMsgLoadReporteData});
        me.loadmask.show();
    },
    hideLoadMask: function(){
        var me = this;
        if(me.loadmask)
            me.loadmask.hide();
    }
});