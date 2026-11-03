Ext.define('ComponenteReporte.view.ReporteData', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.reportedata',
    layout: 'fit',
    region: 'center',
    iframeId: 0,
    initComponent: function () {
		var me = this;

		// me.bodyStyle= 'background:green;';
        me.bodyStyle="background: url('../../../application/views/images/Recuperacion.png') no-repeat left bottom; background-size: 100% 100%";
		
		me.etiquetas =  LangMgr.getLang(this);

        me.dockedItems= [{
            xtype: 'toolbar',
            dock: 'top',
            hidden: true,
            items: ['->', {
                text: me.etiquetas.lbBtnExportar,
                tooltip: me.etiquetas.lbBtnTtpExportarReport,
                iconCls : 'icondistra-exportar',
                action: 'exportar',
                menu: [
                    {text: me.etiquetas.lbFormatDOCX, format: 'DOCX'},
                    {text: me.etiquetas.lbFormatODT, format: 'ODT'},
                    {text: me.etiquetas.lbFormatXLS, format: 'XLS'},
                    {text: me.etiquetas.lbFormatCSV, format: 'CSV'},
                    {text: me.etiquetas.lbFormatXLSX, format: 'XLSX'},
                    {text: me.etiquetas.lbFormatRTF, format: 'RTF'},
                    {text: me.etiquetas.lbFormatPPTX, format: 'PPTX'}
                ]
            }]
        }];

        me.iframeId = Ext.id(null, 'report-');

        me.html= '<iframe id="'+me.iframeId+'" frameborder="0" width="100%" height="100%"></iframe>';

        this.callParent();
    },
    showLoadMask: function(){
        var me = this;
        if(!me.loadmask)
            me.loadmask = new Ext.LoadMask(me, {msg:me.etiquetas.lbMaskCargandoReportes});
        me.loadmask.show();
    },
    hideLoadMask: function(){
        var me = this;
        if(me.loadmask)
            me.loadmask.hide();
    }
});