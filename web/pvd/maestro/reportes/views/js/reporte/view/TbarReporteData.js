Ext.ns('Maestro.Reporte.view');

Maestro.Reporte.view.TbarReporteData = Ext.extend( Ext.Toolbar, {
    hidden: true,
  	initComponent: function() {
        var me = this,
            idiom = Maestro.Reporte.idiom;

        me.menuFormats = new Ext.menu.Menu({
            items: [
                {
                    text: idiom.lbFormatDOCX,
                    format: 'DOCX',
                },{
                    text: idiom.lbFormatODT,
                    format: 'ODT',
                },{
                    text: idiom.lbFormatXLS,
                    format: 'XLS',
                },{
                    text: idiom.lbFormatCSV,
                    format: 'CSV',
                },{
                    text: idiom.lbFormatXLSX,
                    format: 'XLSX',
                },{
                    text: idiom.lbFormatRTF,
                    format: 'RTF',
                },{
                    text: idiom.lbFormatPPTX,
                    format: 'PPTX',
                }
            ]
        });

      	me.btnExportar = new Ext.Button({
            text: idiom.lbBtnExport,
            tooltip: idiom.lbBtnTtpDExportReport,
            iconCls : 'exportar',
            menu: me.menuFormats
        });

        me.items = ['->', me.btnExportar];

        Maestro.Reporte.view.TbarReporteData.superclass.initComponent.call(this);
    }
});