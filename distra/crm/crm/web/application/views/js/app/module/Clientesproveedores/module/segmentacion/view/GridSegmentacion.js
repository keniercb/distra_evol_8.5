Ext.define('Segmentacion.view.GridSegmentacion', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.GridSegmentacion',
    region: 'center',
    selType: 'checkboxmodel',
    //emptyText: 'No images to display',
    initComponent: function () {
        var me = this;
        me.etiquetas = LangMgr.getLang(me);

        this.selModel = {mode: 'MULTI'};
        this.frame = false;
        this.margin = false;
        this.border = false;

        var lbsegmentacion = me.etiquetas.lbSegmentacionS,
            lbsegmentaciones = me.etiquetas.lbSegmentacionP;

        me.store = Ext.create('Segmentacion.store.DataSegmentacion');
        me.multiSelect = true;
        me.columns = [
            { dataIndex: 'idsegmentacion', hidden: true, hideable: false},
            { dataIndex: 'select', hidden: true, hideable: false},
            { dataIndex: 'where', hidden: true, hideable: false},
            { text: lbsegmentaciones, dataIndex: 'segmentacion', flex: 0.3},
            { text: me.etiquetas.lbDescripcion, dataIndex: 'descripcion', flex: 0.7},
        ];
        me.dockedItems = [
            {
                xtype: 'pagingtoolbar',
                store: me.store,
                dock: 'bottom',
                pageNumb: true,
                displayInfo: true
            }
        ];

        me.searchfield = Ext.create('Ext.ux.SearchField', {
            flex: 1,
            maxWidth: 250,
            minWidth: 150,
            searchTooltip: me.etiquetas.qtipSearch.get(lbsegmentacion.toLowerCase())
        });

        me.btnAdd = Ext.create('Ext.Button', {
            iconCls: 'adicionar',
            action: 'add',
            text: me.etiquetas.lbBtnAdd,
            tooltip: me.etiquetas.qtipAdd.get(lbsegmentacion.toLowerCase()),
        });

        me.btnMod = Ext.create('Ext.Button', {
            iconCls: 'modificar',
            action: 'edit',
            disabled: true,
            text: me.etiquetas.lbBtnMod,
            tooltip: me.etiquetas.qtipMod.get(lbsegmentacion.toLowerCase()),
        });

        me.btnDel = Ext.create('Ext.Button', {
            xtype: 'button',
            iconCls: 'eliminar',
            action: 'del',
            disabled: true,
            text: me.etiquetas.lbBtnDel,
            tooltip: me.etiquetas.qtipDel.get(lbsegmentaciones.toLowerCase())
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