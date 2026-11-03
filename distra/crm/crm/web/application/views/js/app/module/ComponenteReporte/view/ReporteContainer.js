Ext.define('ComponenteReporte.view.ReporteContainer', {
    extend: 'Ext.container.Container',
    alias: 'widget.reportecontainer',
    layout: 'border',
    initComponent: function () {
		var me = this;
		
		me.etiquetas =  LangMgr.getLang(this);

        me.items = [
            {   xtype: 'form',
                region: 'north',
                name: 'fpfiltros',
                fieldDefaults: {
                    labelAlign: 'top'
                },
                autoHeight : true,
                layout:'column',
                bodyStyle : {
                    padding: '5px 10px 5px 10px',
                    borderBottom: '0px',
                    background: '#DFE8F6'
                },
                hidden: true,
                items : [{
                    border:false,
                    width: 200,
                    layout: 'form',
                    style:'float: right;padding-top: 15px;',
                    buttons: [{
                        text: me.etiquetas.lbBtnBuscar,
                        iconCls: 'icondistra-buscar',
                        tooltip: me.etiquetas.ttipBtnBuscar,
                        action: 'buscar'
                    }, {
                        text: me.etiquetas.lbBtnLimpiar,
                        iconCls: 'icondistra-limpiar',
                        tooltip: me.etiquetas.ttipBtnLimpiar,
                        action: 'limpiar'
                    }]
                }]
            }, Ext.create('ComponenteReporte.view.ReporteData', {})
        ];

        this.callParent();
    }
});