//Esto es para porner un panel con una p�gina inicia
Ext.define('GestionCampanna.view.ProductGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.productgrid',
    border: false,
    stateful: true,
    collapsible: false,
    multiSelect: true,
    autoScroll: true,
    autoLoad: false,
    selType: 'checkboxmodel',
    viewConfig: {
        stripeRows: true,
        enableTextSelection: true
    },

    initComponent: function () {
        var me = this;

        this.etiquetas = LangMgr.getLang(this);
        //this.title = me.etiquetas.titleMainGrid || 'Listado de contratos';
        me.store = Ext.create('GestionCampanna.store.CampannaProducto');
        this.selModel = {mode: 'MULTI'};
        this.frame = false;
        this.margin = false;

        var producto = this.etiquetas.clListadoProducto;

        this.plugins = [
            new Ext.grid.plugin.CellEditing({
                clicksToEdit: 2
            })
        ];

        //COLUMNAS
        this.columns = [
            {
                text: this.etiquetas.clNombreProducto,
                sortable: false,
                dataIndex: 'denominacion',
                flex: 1
            },
            {
                text: this.etiquetas.clPrecioProducto,
                sortable: false,
                dataIndex: 'precio',
                flex: 1,
                editor: {
                    xtype: 'numberfield',
                    allowBlank: false,
                    minValue: 0,
                    decimalPrecision: 9,
                    maxLength: 19,
                    decimalSeparator: '.'
                }
            },
            {
                text: 'Tipo',
                dataIndex: 'tipo',
                width: 80,
                align: 'center',
                renderer: this.rendererClasificacion
            }
        ];

        this.searchfield = Ext.create('Ext.ux.SearchField', {
            flex: 1,
            maxWidth: 250,
            minWidth: 150,
            concept: 'producto' //Para diferenciar las grid de la ventana campanna,
        });

        this.btnAdd = Ext.create('Ext.Button', {
            action: 'add',
            iconCls: 'adicionar',
            text: this.etiquetas.lbAdicionarPro,
            tooltip: this.etiquetas.lbAdicionarProducto,
            concept: 'producto' //Para diferenciar las grid de la ventana campanna,
        });


        this.btnDel = Ext.create('Ext.Button', {
            iconCls: 'eliminar',
            action: 'del',
            disabled: true,
            text: this.etiquetas.lbEliminar,
            tooltip: this.etiquetas.lbELiminarProducto,
            concept: 'producto' //Para diferenciar las grid de la ventana campanna
        });

        this.tbar = [
            this.btnAdd,
            this.btnDel,
            '->',
            this.searchfield
        ];

        this.callParent();
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

