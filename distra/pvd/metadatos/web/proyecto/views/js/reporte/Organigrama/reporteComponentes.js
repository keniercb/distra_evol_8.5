/***
 *@PACKAGE : reportes (reporteComponentes.js)
 *@Author: Ing. Daymel Machado Cabrera.
 ***/
Ext.namespace('Reporte');
Reporte.ventana = Ext.extend(Ext.Window, {

		initComponent: function ()
		{
				Ext.apply(this, {
						modal      : true,
						title      : '',
						layout     : 'fit',
						resizable  : false,
						width      : 200,
						height     : 200,
						closeAction: 'destroy',
						closable   : true

				})
				this.on('show', function ()
				{
						this.maximize();
				})
				Reporte.ventana.superclass.initComponent.apply(this);
		}
})
Reporte.panel = Ext.extend(Ext.Panel, {

		initComponent: function ()
		{
				Ext.apply(this, {
						modal: false

				})
		}
})
