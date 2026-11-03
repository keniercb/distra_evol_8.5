Ext.define('PerfilesClientes.view.PanelDataView', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.PanelDataView',
    region: 'center',
    id: 'images-view',
    autoScroll: true,
    cls: 'images-view',

    initComponent: function () {
        var me = this;

        me.etiquetas = LangMgr.getLang(me);
        //this.title = me.etiquetas.titleMainGrid || 'Listado de contratos';
        //me.store = Ext.create('GestionContrato.store.Contratos');
        me.frame = false;
        me.margin = 0;
        me.border = false;
        me.layout = 'border';

        var lbperfil = me.etiquetas.lbPerfil,
            lbperfiles = me.etiquetas.lbPerfiles;
        me.myDataView = Ext.create('PerfilesClientes.view.DataViewPerfil', {
            store: Ext.create('PerfilesClientes.store.DataViewPerfil')
        });

        me.items = me.myDataView;
        me.dockedItems = [
            {
                xtype: 'pagingtoolbar',
                store: me.myDataView.getStore(),
                dock: 'bottom',
                pageNumb: true,
                displayInfo: true
            }
        ];

        me.searchfield = Ext.create('Ext.ux.SearchField', {
            flex: 1,
            maxWidth: 250,
            minWidth: 150,
            searchTooltip: me.etiquetas.qtipSearch.get(lbperfil.toLowerCase())
        });

        me.btnAdd = Ext.create('Ext.Button', {
            iconCls: 'adicionar',
            action: 'add',
            text: me.etiquetas.lbBtnAdd,
            tooltip: me.etiquetas.qtipAdd.get(lbperfil.toLowerCase()),
        });

        me.btnMod = Ext.create('Ext.Button', {
            iconCls: 'modificar',
            action: 'edit',
            disabled: true,
            text: me.etiquetas.lbBtnMod,
            tooltip: me.etiquetas.qtipMod.get(lbperfil.toLowerCase()),
        });

        me.btnDel = Ext.create('Ext.Button', {
            xtype: 'button',
            iconCls: 'eliminar',
            action: 'del',
            disabled: true,
            text: me.etiquetas.lbBtnDel,
            tooltip: me.etiquetas.qtipDel.get(lbperfiles.toLowerCase())
        });

        me.btnHelp = Ext.create('Ext.Button', {
            xtype: 'button',
            iconCls: 'ayuda',
            action: 'help',
            //disabled: true,
            text: me.etiquetas.lbBtnhelp,
            tooltip: me.etiquetas.qtipHistoric
        });

        me.tbar = Ext.create('Ext.toolbar.Toolbar', {
            enableOverflow: true,
            items: [
                me.btnAdd,
                me.btnMod,
                me.btnDel,
                '->',
                me.searchfield,
                '-',
                me.btnHelp
            ]
        });


        me.callParent();
    }
});
