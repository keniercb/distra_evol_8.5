//Esto es para porner un panel con una página inicia
Ext.define('GestionCampanna.view.ContextMenu', {
    extend: 'Ext.menu.Menu',
    alias: 'widget.ContextMenu',

    initComponent: function () {
        var me = this;
        me.etiquetas = LangMgr.getLang(this);

        this.items = [
            {
                text: me.etiquetas.lbModificar,
                tooltip: 'asd',
                iconCls: 'icondistra-adicionar',
                action: 'edit',
                campanna: true
            },{
                text: me.etiquetas.lbEliminar,
                tooltip: 'asd',
                iconCls: 'icondistra-eliminar',
                action: 'del',
                campanna: true
            }
        ];

        this.callParent();
    }

});