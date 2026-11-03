Ext.define('Demanda.view.GridHistorialDemanda', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.gridhistorialdemanda',
    region: 'center',
    plugins: [
        {
            ptype: 'rowexpander',
            rowBodyTpl: new Ext.XTemplate(
                '<hr><tpl if="idpadre == null"><b>Demanda original</b><tpl else>' +
                '<span><b>Motivo de la contrademanda:</b> {objeto}</span></tpl>'
            )
        }
    ],
    initComponent: function () {
        var me = this;
        me.etiquetas = LangMgr.getLang(me);
        me.selModel = Ext.create('Ext.selection.RowModel');
        me.store = Ext.create('Ext.data.Store', {
            storeId: 'stHistorialDemanda',
            remoteSort: true,
            autoLoad: true,
            pageSize: 25,
            fields: [
                {name: 'idsolicitud'},
                {name: 'nombre'},
                {name: 'linea'},
                // {name: 'tipolinea'},
                // {name: 'responsable'},
                // {name: 'numerosolicitud'},
                {name: 'numero'},
                // {name: 'solicitud'},
                {name: 'idclienteproveedor'},
                {name: 'clienteproveedor'},
                {name: 'idsector'},
                {name: 'sector'},
                {name: 'idarea'},
                // {name: 'verMotivo'},
                {name: 'arearesponsable'},
                // {name: 'descripcion'},
                {name: 'fechacreada'},
                // {name: 'areasimplicadas'},
                {name: 'idestado'},
                {name: 'estadoicon'},
                {name: 'estado'},
                {name: 'idespaciotrabajo'},
                // {name: 'docadicionales'},
                // {name: 'cantofertas'},
                {name: 'cliente'},
                {name: 'idproveedores'},
                // {name: 'codigoproveedor'},
                {name: 'linea'},
                {name: 'idlinea'},
                // {name: 'tipolinea'},
                // {name: 'idtipolinea'},
                // {name: 'fechainicio'},
                // {name: 'fechafin'},
                // {name: 'numero'},
                // {name: 'nombrepersona'},
                // {name: 'idpersona'},
                {name: 'idpadre'},
                // {name: 'solicituddemanda'},
                // {name: 'desactivada'},
                {name: 'objeto'},
            ],
            proxy: {
                type: 'ajax',
                url: UtilsFn.buildUrl({action: 'historial'}, ModuleMgr.get('Demanda')),
                actionMethods: {
                    read: 'POST'
                },
                extraParams: {
                    idsolicitud: me.idsolicitud
                },
                reader: {
                    root: 'data',
                    totalProperty: 'cant',
                    successProperty: 'success'
                }
            }
        });
        //COLUMNAS
        me.columns = [
            {
                text: me.etiquetas.lbNumeroSolicitud,
                sortable: false,
                dataIndex: 'numero',
                locked: true,
                minWidth: 70,
                width: 110,
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                }
            }, {
                text: me.etiquetas.lbNombre,
                sortable: false,
                dataIndex: 'nombre',
                locked: true,
                minWidth: 200,
                width: 270,
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                }
            }, {
                text: me.etiquetas.lbClientProv,
                sortable: true,
                minWidth: 100,
                flex: 0.1,
                dataIndex: 'clienteproveedor',
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                }
            }, {
                hidden: true,
                dataIndex: 'idclienteproveedor',
                hideable: false
            },
            {
                text: me.etiquetas.lbSector,
                sortable: true,
                align: 'center',
                minWidth: 70,
                width: 80,
                dataIndex: 'sector',
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                }
            }, {
                text: me.etiquetas.lbAreaResponsable,
                sortable: true,
                align: 'center',
                minWidth: 70,
                width: 80,
                dataIndex: 'arearesponsable',
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                }
            }, {
                text: me.etiquetas.lbLinea,
                sortable: true,
                align: 'center',
                minWidth: 70,
                width: 80,
                dataIndex: 'linea',
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                }
            }, {
                text: me.etiquetas.lbFechaCreacion,
                sortable: true,
                align: 'center',
                minWidth: 70,
                width: 80,
                dataIndex: 'fechacreada',
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                }
            },
            {
                text: me.etiquetas.lbEstado,
                // sortable: false,
                fixed: true,
                width: 100,
                dataIndex: 'estado',
                renderer: function (value, meta) {

                    meta.innerCls = "icondistra-" + meta.record.data.estadoicon;
                    if (value)
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    return value;
                }
            },
            // {
            //     text: me.etiquetas.lbFieldCliente,
            //     tooltip: me.etiquetas.lbFieldCliente,
            //     // sortable: true,
            //     align: 'center',
            //     minWidth: 55,
            //     width: 55,
            //     dataIndex: 'cliente',
            //     renderer: function (value, meta) {
            //         var icono = "icondistra-perfilusuario",
            //             qtip = me.etiquetas.lbSNCliente;
            //         if (value == '2') {
            //             icono = "icondistra-servicio";
            //             qtip = me.etiquetas.lbSNProveedor;
            //         } else if (value == '3') {
            //             icono = "icondistra-gestionarmodelo";
            //             qtip = me.etiquetas.lbSNDemanda;
            //         } else if (value == '4') {
            //             icono = "icondistra-gestionaroperacionescontables";
            //             qtip = me.etiquetas.lbSNImportacion;
            //         }
            //         meta.innerCls = icono;
            //         meta.tdAttr = 'data-qtip="' + qtip + '"';
            //     },
            // },
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
        me.frame = false;
        me.margin = false;
        me.border = false;
        me.enableLocking = true;

        // me.viewConfig = {
        //     getRowClass: function (record, rowIndex, rowParams, store) {
        //         return record.data.idpadre != record.data.idpadre ? "" : "contractcolor";
        //     }
        // };

        me.createToolbar();
        me.callParent();

    },
    createToolbar: function () {
        this.btnDetails = Ext.create('Ext.Button', {
            iconCls: 'detalles',
            action: 'detaildemanda',
            selector: 'btnAdd',
            disabled: true,
            text: this.etiquetas.lbBtnDetail,
            tooltip: this.etiquetas.qtipDetail
        });

        // this.btnMod = Ext.create('Ext.Button', {
        //     iconCls: 'modificar',
        //     action: 'edit',
        //     selector: 'btnModHitorico',
        //     hidden: this.showModHistorico ? false : true,
        //     disabled: true,
        //     text: this.etiquetas.lbBtnMod,
        //     tooltip: this.etiquetas.qtipModificar
        // });

        this.tbar = [this.btnDetails];
        // , this.btnMod

    }
});
