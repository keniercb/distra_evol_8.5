Ext.define('ProgramaMedico.view.WindowServicio', {
    extend: 'Ext.ux.CustomWindow',
    alias: 'widget.windowservicioprogramamedico',
    autoScroll: false,
    maximizable: true,
    layout: 'border',
    height: window.innerHeight*0.95,
    width: window.innerWidth*0.75,
    resizable: true,
    btnApply:true,
    action:'add',
    closeAction: 'hide',
    initComponent: function () {
        this.createInitialConfig();

        this.callParent();
        this.minWidth = 600;
        // this.maxWidth = 1500;
        this.minHeight = 400;
        // this.maxHeight = 1000;
    },
    createInitialConfig: function () {
        var me = this;
        // bodyHeight = Ext.getBody().dom.offsetHeight;

        // this.height = this.height >= bodyHeight ? bodyHeight - 20 : this.height;

        this.etiquetas = LangMgr.getLang(this);

        this.title = 'Servicios';

        me.store = Ext.create('Ext.data.Store', {
            fields: ['denominacion', 'idindicador', 'codigo', 'codigoproveedor',
                'precio', 'precioalt', 'precioplanif', 'precioventa'],
            remoteSort: true,
            pageSize: 30,
            proxy: {
                type: 'ajax',
                url: UtilsFn.buildUrl({action: 'getProducto'}, ModuleMgr.get('GestionContratoImportacion')),
                actionMethods: {
                    read: 'POST'
                },
                extraParams: {
                    idtipoprecio: -1,
                    tipo: 2
                },
                reader: {
                    root: 'data',
                    totalProperty: 'total',
                    successProperty: 'success'
                }
            }
        });
        me.store.load();

        this.cmbTipoPrecio = new Ext.create('Ext.form.ComboBox', {
            store: Ext.create('GestionContratoImportacion.store.TipoPrecio'),
            fieldLabel: 'Tipo de precio',
            labelWidth: 80,
            name: 'tipoprecio',
            queryMode: 'local',
            width: 320,
            valueField: 'idtipoprecio',
            displayField: 'denominacion',
            typeAhead: true,
            editable: false
        });

        this.searchfield = Ext.create('Ext.ux.SearchField', {
            itemId: 'searchfield',
            flex: 1,
            maxWidth: 250,
            minWidth: 150,
            first: true,
            emptyText: 'Busque por denominación...'
        });

        me.grid = Ext.create('Ext.grid.Panel', {
            store: me.store,
            multiSelect: true,
            selType: 'checkboxmodel',
            region:'center',
            plugins:[
                Ext.create('CRM.plugins.ResaltarFiltrosPlugin',{
                    campos: [{
                        'itemId': 'searchfield',
                        'dataIndex': ['denominacion'],
                        // 'color': '#e6d083'
                    }]
                })
            ],
            columns: [
                {
                    text: 'Código',
                    dataIndex: 'codigo',
                    renderer: me.renderTooltip
                },
                {
                    text: 'Denominación',
                    dataIndex: 'denominacion',
                    flex: 1,
                    renderer: me.renderTooltip
                },
                {
                    text: 'Precio',
                    dataIndex: 'precio',
                    width:100,
                    align: 'right',
                    renderer: me.renderMoney
                },
                {
                    text: 'Precio Alt',
                    dataIndex: 'precioalt',
                    width:100,
                    align: 'right',
                    renderer: me.renderMoney
                }
                // , {
                //     text: 'CUC',
                //     dataIndex: 'preciodivisa',
                //     width:100,
                //     renderer: function (value) {
                //         return Ext.util.Format.currency(value);
                //     }
                // }
            ],
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'top',
                    enableOverflow: true,
                    items: [
                        this.cmbTipoPrecio,
                        '->',
                        this.searchfield
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
        var items = [me.grid];

        me.items=items;

    },
    rendererClasificacion: function (value, metadata, record) {
        var icono = 'icondistra-',
            tipo = this.etiquetas.lbProd;
        if (value == 1) {
            icono += 'producto';
        } else {
            icono += 'servicio';
            tipo = this.etiquetas.lbServ;
        }
        metadata.innerCls = icono;
        metadata.tdAttr = 'data-qtip="' + tipo + '"';
    },
    renderTooltip: function (value, meta, record) {
        if (!Ext.isEmpty(value))
            meta.tdAttr = 'data-qtip="' + value  + '"';
        return value;
    },
    renderMoney: function (value, meta, record) {
        if (Ext.isEmpty(value))
            value = 0;
        value = Ext.util.Format.number(value, '0.000,00/i');
        meta.tdAttr = 'data-qtip="' + value  + '"';
        return value;
    },
});