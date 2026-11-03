Ext.define('GestionContratoImportacion.view.GridPedidos', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.gridpedidosimportacion',
    region: 'center',
    layout:'fit',
    selType: 'checkboxmodel',
    mostrarToolbar: true,
    initComponent: function () {
        var me = this;

        me.etiquetas = LangMgr.getLang(me);

        me.frame = false;
        me.margin = false;
        me.border = false;
        // me.enableLocking = true;

        me.viewConfig = {
            stripeRows: false,
            getRowClass: function (record, rowIndex, rowParams, store) {
                var estilo='';
                var datsfecha=record.get('fechaestimada').split('/');
                // console.log('^^:',
                //     new Date(datsfecha[2], datsfecha[1]-1, datsfecha[0]) > new Date(),
                //     record.get('fechaestimada'),
                //     new Date(datsfecha[2], datsfecha[1]-1, datsfecha[0]),
                //     new Date())
                if (new Date(datsfecha[2], datsfecha[1]-1, datsfecha[0]) < new Date())
                    estilo = 'incorrecto';
                if(record.get('estilo'))estilo+=' '+record.get('estilo');
                return estilo;
            }
        };

        me.store = Ext.create('Ext.data.Store', {
            storeId: 'stPedidosImportacion',
            remoteSort: true,
            // autoLoad: true,
            pageSize: 25,
            eliminados:[],
            fields: [
                'idcontratopedido', 'nombre', 'denominacion', 'descripcion',
                'fechacreacion','fechaestimada','fechafin', 'fechaestado',
                'idcontrato', 'estado', 'iconoestado', 'idestado', 'productos',
                'montototal', 'cantprod', 'canttotalprod', 'estilo'
            ]
            // proxy: {
            //     type: 'ajax',
            //     url: UtilsFn.buildUrl({action: 'getPedidos'}, ModuleMgr.get('GestionContratoImportacion')),
            //     actionMethods: {read: 'POST'},
            //     extraParams: {
            //         idcontrato: me.idcontrato
            //     },
            //     reader: {
            //         root: 'datos',
            //         totalProperty: 'cant',
            //         successProperty: 'success'
            //     }
            // }
        });
        function basicRenderer(value, meta){
            if (value)
                meta.tdAttr = 'data-qtip="' + value + '"';
            return value;
        }
        me.columns = [
            {
                text: me.etiquetas.lbDescripcion,
                sortable: false,
                flex:1,
                minWidth: 150,
                dataIndex: 'descripcion',
                renderer: basicRenderer
            },
            {
                text: 'Fecha creación',
                sortable: false,
                width: 90,
                minWidth: 70,
                dataIndex: 'fechacreacion'
            },
            {
                text: 'Fecha estimada',
                sortable: false,
                width: 90,
                minWidth: 70,
                dataIndex: 'fechaestimada'
            },
            {
                text: 'Cant prod.',
                sortable: false,
                width: 65,
                minWidth: 65,
                align: 'right',
                dataIndex: 'canttotalprod',  //cantprod
                renderer: function(value, meta, record){
                    meta.tdAttr = 'data-qtip="<u>Cantidad de productos:</u>   ' + value + '<br>' +
                        '<u>Productos:</u> '+record.get('cantprod')+'"';
                    return value;
                    // return value+' ('+record.get('canttotalprod')+')';
                }
            },
            {
                text: 'Monto total',
                sortable: false,
                width: 90,
                minWidth: 70,
                align: 'right',
                dataIndex: 'montototal',
                renderer: function(value, meta){
                    meta.tdAttr = 'data-qtip="' + Ext.util.Format.number(value, '0.000,00/i') + '"';
                    return Ext.util.Format.number(value, '0.000,00/i');
                }
            },
            {
                text: me.etiquetas.lbEstado,
                sortable: false,
                width: 90,
                minWidth: 80,
                dataIndex: 'estado',
                renderer: function (value, meta, record) {
                    meta.innerCls = "icondistra-" + meta.record.data.iconoestado;
                    meta.tdAttr = 'data-qtip="' + value + ' <br> <u>Fecha</u>: ' + record.data.fechaestado + '"';
                    return value;
                }
            }
        ];
        // me.dockedItems = [
        //     {
        //         xtype: 'pagingtoolbar',
        //         store: me.store,
        //         dock: 'bottom',
        //         pageNumb: true,
        //         displayInfo: true
        //     }
        // ];

        if(me.mostrarToolbar)
            me.createToolbar();
        me.callParent();

    },
    createToolbar: function () {
        this.btnAdicionar = Ext.create('Ext.Button', {
            iconCls: 'adicionar',
            action: 'adicionarpedido',
            selector: 'adicionarPedido',
            text: this.etiquetas.lbBtnAdd,
            tooltip: this.etiquetas.qtipAddPedido
        });

        this.btnModificar = Ext.create('Ext.Button', {
            iconCls: 'modificar',
            action: 'modificarpedido',
            selector: 'modificarPedido',
            disabled: true,
            text: this.etiquetas.lbBtnMod,
            tooltip: this.etiquetas.qtipModPedido
        });

        this.btnEliminar = Ext.create('Ext.Button', {
            iconCls: 'eliminar',
            action: 'eliminarpedido',
            selector: 'eliminarPedido',
            disabled: true,
            text: this.etiquetas.lbBtnDel,
            tooltip: this.etiquetas.qtipDelPedido
        });

        this.btnDetalles = Ext.create('Ext.Button', {
            iconCls: 'detalles',
            itemId: 'detallespedido',
            action: 'detallespedido',
            selector: 'detallesPedido',
            disabled: true,
            text: this.etiquetas.lbBtnDetail,
            tooltip: this.etiquetas.qtipDetail
        });

        this.tbar = [this.btnAdicionar, this.btnModificar,
            this.btnEliminar, this.btnDetalles];
    }
});
