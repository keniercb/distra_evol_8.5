Ext.define('GestionOportunidad.view.AddCliente', {
    extend: 'Ext.ux.CustomWindow',
    alias: 'widget.go_addcliente',

    autoScroll: false,
    maximizable: true,
    refhelp:'add_dat_clienteoportunidad',
    initComponent: function () {
        this.createInitialConfig();

        this.callParent();
    },
    createInitialConfig: function () {
        var me = this;

        this.etiquetas = LangMgr.getLang(this);

        this.title = 'Seleccionar cliente';
        this.action = 'select';

        me.stcustom = Ext.create('GestionOportunidad.store.Cliente');
        me.custom = Ext.create('Ext.grid.Panel', {
            store: me.stcustom,
            multiSelect: true,
            selType: 'checkboxmodel',
            columns: [
                {text: me.etiquetas.lbNombre, dataIndex: 'nombre', flex: 1},
                {
                    text: me.etiquetas.lbTipo,
                    dataIndex: 'idclasificacion',
                    width: 80,
                    align: 'center',
                    renderer: me.rendererClasificacion
                }
            ],
            height: 200,
            width: 400,
            dockedItems: [
                {
                    xtype: 'pagingtoolbar',
                    store: me.stcustom,
                    pageNumb: true,
                    dock: 'bottom',
                    displayInfo: true
                }
            ]
        });

        me.items = me.custom;

        this.searchfield = Ext.create('Ext.ux.SearchField', {
            flex: 1,
            maxWidth: 250,
            minWidth: 150,
            first:true
        });

        this.tbar = Ext.create('Ext.toolbar.Toolbar', {
            enableOverflow: true,
            items: [
                '->',
                this.searchfield
            ]
        });
    },
    rendererClasificacion: function (value, metadata) {
        var icono = 'icondistra-',
            tipo = 'Entidad';
        if (value == 1) {
            icono += 'buscarcliententidad';
        } else {
            icono += 'buscarclitepersona';
            tipo = 'Persona';
        }
        metadata.innerCls = icono;
        metadata.tdAttr = 'data-qtip="' + tipo + '"';
    }
});