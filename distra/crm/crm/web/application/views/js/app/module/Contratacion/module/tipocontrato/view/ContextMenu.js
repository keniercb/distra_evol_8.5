Ext.define('TipoContrato.view.ContextMenu', {
    extend: 'Ext.menu.Menu',
    alias: 'widget.treeContextMenu',

    initComponent: function () {
        var me = this;
        me.etiquetas = LangMgr.getLang(this);
        
        this.items = [
            {
                text: me.etiquetas['configurar'],
                tooltip: me.context == 'treeTC' ? me.etiquetas['tpConfigTC'] : me.etiquetas['tpConfigETC'],
                iconCls: 'icondistra-configuracion',
                action: 'configurar',
                context: this.context
            },{
                text: me.etiquetas['lbAdicionar'],
                tooltip: me.context == 'treeTC' ? me.etiquetas['tpAdicionarTC'] : me.etiquetas['tpAdicionarETC'],
                iconCls: 'icondistra-adicionar',
                action: 'add',
                context: this.context
            },/*
            {
                text: me.etiquetas['lbModificar'],
                tooltip: me.context == 'treeTC' ? me.etiquetas['tpModificarTC'] : me.etiquetas['tpModificarETC'],
                iconCls: 'icondistra-modificar',
                action: 'mod',
                context: this.context
            },*/
            {
                text: me.etiquetas['lbEliminar'],
                tooltip: me.context == 'treeTC' ? me.etiquetas['tpEliminarTC'] : me.etiquetas['tpEliminarETC'],
                iconCls: 'icondistra-eliminar',
                action: 'del',
                context: this.context
            },
            {
                text: me.etiquetas['lbHeredar'],
                tooltip: me.context == 'treeTC' ? me.etiquetas['tpHeredarTC'] : me.etiquetas['tpHeredarETC'],
                iconCls: 'icondistra-heredar',
                action: 'heredarTC',
                context: this.context
            }
        ];

        this.callParent();
    }

});