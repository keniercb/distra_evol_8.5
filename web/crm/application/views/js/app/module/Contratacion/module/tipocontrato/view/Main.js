Ext.define('TipoContrato.view.Main', {
    extend: 'Ext.panel.Panel',
    closable: true,
    region: 'center',
    bodyStyle: 'background:#DFE9F6;',
    layout: 'border',
    border: false,
    alias: 'widget.tc_main',

    initComponent: function() {
        var me = this;
        me.etiquetas = LangMgr.getLang(this);
        me.title = me.etiquetas.lbTipoContrato;

        this.items = [
            Ext.create('Ext.panel.Panel', {
                title: me.etiquetas.lbTipoContrato,
                region: 'center',
                 // width: 400,
                // minWidth:300,
                // maxWidth:500,
                split: true,
                collapsible: true,
                border: false,
                autoScroll: true,
                layout: 'fit',
                items: [
                    Ext.create('TipoContrato.view.TipoContrato')
                ]
            }),
            // Ext.create('TipoContrato.view.Configuracion', {
            //     region: 'center',
            //     border: false
            // })
        ];

        this.callParent();
    }
});
