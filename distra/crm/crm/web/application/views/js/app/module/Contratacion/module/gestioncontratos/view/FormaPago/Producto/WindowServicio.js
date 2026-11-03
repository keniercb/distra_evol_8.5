Ext.define('GestionContrato.view.FormaPago.Producto.WindowServicio', {
    extend: 'Ext.ux.CustomWindow',
    alias: 'widget.windowservicio',
    autoScroll: false,
    maximizable: true,
    refhelp: '',
    layout: 'fit',
    height: 670,
    width: 600,
    initComponent: function () {
        this.createInitialConfig();

        this.callParent();
    },
    createInitialConfig: function () {
        var me = this,
            bodyHeight = Ext.getBody().dom.offsetHeight;

        this.height = this.height >= bodyHeight ? bodyHeight - 20 : this.height;

        this.etiquetas = LangMgr.getLang(this);

        // this.title = this.etiquetas.titleSelecProd;
        this.action = 'select';

        me.searchfield = Ext.create('Ext.ux.SearchField', {
            itemId: 'searchfieldserv',
            flex: 1,
            maxWidth: 250,
            minWidth: 150,
            first: true
        });

        me.store = Ext.create('GestionContrato.store.Servicio',{

        });

        me.grid = Ext.create('Ext.grid.Panel', {
            store: me.store,
            multiSelect: true,
            selType: 'checkboxmodel',
            plugins:[
                Ext.create('CRM.plugins.ResaltarFiltrosPlugin',{
                    campos: [{
                        'itemId': 'searchfieldserv',
                        'dataIndex': ['denominacion'],
                        // 'color': '#e6d083'
                    }]
                })
            ],
            columns: [
                {
                    text: this.etiquetas.lbName,
                    dataIndex: 'denominacion',
                    flex: 1
                }, {
                    text: 'CUP',
                    dataIndex: 'precio',
                    renderer: this.calcularTotal
                }, {
                    text: 'CUC',
                    dataIndex: 'preciodivisa',
                    renderer: this.calcularTotal
                }
            ],
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'top',
                    enableOverflow: true,
                    items: [
                        '->',
                        me.searchfield
                    ]
                },
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

        // this.tbar = Ext.create('Ext.toolbar.Toolbar', {
        //     enableOverflow: true,
        //     items: [
        //         '->',
        //         this.searchfield
        //     ]
        // });
    },
    calcularTotal: function (value, metadata, record, rowIndex, colIndex) {
        var columns = this.columns.length,
            normas = record.data.arraynorma,
            montototal = 0.00,
            field = 'precio';

        if (colIndex == columns) {
            field = 'preciodivisa';
        }

        Ext.each(normas, function (norma) {
            montototal += parseFloat(norma[field]);
        });
        record.set(field, montototal);
        record.modified = {};
        montototal = Ext.util.Format.currency(montototal);
        metadata.tdAttr = 'data-qtip="' + montototal + '"';
        return montototal;
    }
});