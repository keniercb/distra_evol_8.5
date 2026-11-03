Ext.define('GestionCampanna.view.AddProducto', {
    extend: 'Ext.ux.CustomWindow',
    alias: 'widget.addproducto',
    autoScroll: false,
    maximizable: true,
    refhelp:'add_dat_productocampanna',
    initComponent: function () {
        this.createInitialConfig();

        this.callParent();
    },
    createInitialConfig: function () {
        var me = this;

        this.etiquetas = LangMgr.getLang(this);

        this.title = 'Seleccionar producto';
        this.action = 'select';


        me.store = Ext.create('GestionCampanna.store.Producto');
        me.grid = Ext.create('Ext.grid.Panel', {
            store: me.store,
            multiSelect: true,
            selType: 'checkboxmodel',
            columns: [
                {
                    text: 'Nombre',
                    dataIndex: 'denominacion',
                    flex: 1
                },
                {
                    text: 'Tipo',
                    dataIndex: 'tipo',
                    width: 80,
                    align: 'center',
                    renderer: this.rendererClasificacion
                }
            ],
            dockedItems: [
                {
                    xtype: 'pagingtoolbar',
                    store: me.store,
                    pageNumb: true,
                    dock: 'bottom',
                    displayInfo: true
                }
            ]
        });
        me.items = me.grid;

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
            tipo = 'Producto';
        if (value == 1) {
            icono += 'producto';
        } else {
            icono += 'servicio';
            tipo = 'Servicio';
        }
        metadata.innerCls = icono;
        metadata.tdAttr = 'data-qtip="' + tipo + '"';
    }
});