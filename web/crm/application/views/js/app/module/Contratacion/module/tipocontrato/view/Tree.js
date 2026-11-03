Ext.define('TipoContrato.view.Tree', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.treeElemento',
    loadMask: true,
    autoScroll: true,
    multiSelect: true,
    useArrows: true,
    viewConfig: {
        bubbleEvents: ['refresh'],
        loadMask: true,
        plugins: {
            ptype: 'treeviewdragdrop',
            enableDrag: true,
            enableDrop: true,
            appendOnly: false
        }
    },

    initComponent: function () {
        var me = this;
        me.etiquetas = LangMgr.getLang(this);
        this.store = Ext.create('TipoContrato.store.ElementoContrato', {
            root: {id: 0, denominacion: this.etiquetas.lbElemento}
        });
        this.plugins = [
            Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit: 2,
                listeners: {
                    beforeedit: function (e, editor) {
                        if (e.context.record.data.id == 0)
                            return false;
                    }
                }
            }),
            Ext.create('CRM.plugins.ComponentElementEvent')
        ];

        this.callParent();
    }
});