Ext.define('OfertaNegocio.view.OfertaNegocio', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.gpofertanegocio',
    closable: true,
    requires:[
        'Ext.ux.grid.FiltersFeature'
    ],
    extraparamsstore:{},
    module:'OfertaNegocio',
    viewConfig:{
        stripeRows: false,
        getRowClass: function (record, rowIndex, rowParams, store) {
            if (record.get('idcontrato')) return 'escontrato';
            return '';
        }
    },
    initComponent: function () {
        var me = this;
        me.viewConfig={
            stripeRows: false,
            getRowClass: function (record, rowIndex, rowParams, store) {
                if (record.get('idcontrato')) return 'escontrato';
                return '';
            }
        };
        me.plugins=[
            Ext.create('SolicitudPago.view.MarcarFiltroPlugin',{
                extraParams:true,
                campos:[{
                    'itemId':'searchfield',
                    'dataIndex':['numero', 'nombre'],
                    'extraParams':'filtrogeneral[0][field]'
                }]
            })
        ];
        me.etiquetas = LangMgr.getLang(this);
        Ext.util.Format.decimalSeparator = ',';
        Ext.util.Format.thousandSeparator = '.';
        Ext.util.Format.currencyPrecision = 2;
        Ext.util.Format.currencySign = ' ';
        me.title = me.etiquetas.moduleName;
        // me.selModel={xtype:'checkboxmodel', mode:'MULTI'};
        me.selType='checkboxmodel'
        me.features=[
            {
                ftype: 'filters',
                menuFilterText: me.etiquetas.lbbusqueda,
                local: false
            }
        ];
        me.store = Ext.create('OfertaNegocio.store.OfertaNegocio',{
            storeId:'ofertas', onlyOneLoad: true

        });
        function mostrarTooltipColumna(value, meta) {if (value)
            meta.tdAttr = 'data-qtip="' + value + '"';
            return value;
            if (value)
                meta.tdAttr = 'data-qtip="' + value + '"';
            return value;
        }
        function formatoDinero(value, meta) {
            if (value)
                meta.tdAttr = 'data-qtip="' + Ext.util.Format.currency(value) + '"';
            return Ext.util.Format.currency(value);
        }
        function onSerialize(data, filter, eOpts) {
            data['value'] = Ext.encode(data['value']);
        }
        me.columns = [
            {
                text: me.etiquetas.lbNumeroOferta,
                fixed: true,
                width: 50,
                dataIndex: 'numero',
                filter:{type: 'string'},
                renderer: mostrarTooltipColumna
            },{
                text: me.etiquetas.lbNombre,
                flex: 1,
                minWidth:150,
                dataIndex: 'nombre',
                filter:{type: 'string', dataIndex:'nombre'},
                renderer: mostrarTooltipColumna
            },{
                text: me.etiquetas.lbClientProv,
                flex: 1,
                minWidth:100,
                dataIndex: 'clienteproveedor',
                filter:{type: 'string'},
                renderer: mostrarTooltipColumna
            },{
                text: me.etiquetas.lbMontoTotal,
                sortable: false,
                align: 'right',
                width: 90,
                minWidth:60,
                dataIndex: 'montototal',
                filter:{type: 'numeric'},
                renderer: formatoDinero
            },
            {
                text: me.etiquetas.lbSector,
                fixed: true,
                width: 100,
                minWidth:60,
                dataIndex: 'sector',
                renderer: mostrarTooltipColumna,
                filter: {
                    type: 'list',
                    idField: 'idsector',
                    labelField: 'denominacion',
                    store: Ext.create('Ext.data.Store', {
                        autoLoad: false,
                        proxy: {
                            extraParams: {
                                modelName: 'NomSector',
                            },
                            type: 'ajax',
                            url: UtilsFn.buildUrl({action: 'getModel'}, ModuleMgr.get('Nomencladores')),
                            reader: {
                                root: 'data',
                                totalProperty: 'count',
                                successProperty: 'success'
                            },
                        },
                        fields: [
                            {name: 'denominacion', type: 'string'},
                            {name: 'idsector', type: 'integer'},
                        ]
                    }),
                    listeners: {
                        serialize: onSerialize
                    }
                }
            },
            {
                text: me.etiquetas.lbFechaInicio,
                fixed: true,
                width: 100,
                minWidth:60,
                dataIndex: 'fechainicio',
                filter: {
                    type: 'date',
                    dateFormat: 'd/m/Y',
                    beforeText: me.etiquetas.lbantes,
                    afterText: me.etiquetas.lbdespues,
                    onText: me.etiquetas.lbigual
                },
                renderer: mostrarTooltipColumna
            },
            {
                text: me.etiquetas.lbFechaFirma,
                fixed: true,
                width: 100,
                minWidth:60,
                dataIndex: 'fechafirma',
                filter: {
                    dataIndex: 'fechafirma',
                    type: 'date',
                    dateFormat: 'd/m/Y',
                    beforeText: me.etiquetas.lbantes,
                    afterText: me.etiquetas.lbdespues,
                    onText: me.etiquetas.lbigual
                },
                renderer: mostrarTooltipColumna
            },
            {
                text: me.etiquetas.lbCliente,
                tooltip: me.etiquetas.lbCliente,
                align: 'center',
                minWidth: 55,
                width: 55,
                dataIndex: 'cliente',
                renderer: function (value, meta) {
                    meta.innerCls = value=='1' ? "icondistra-perfilusuario" :
                        "icondistra-servicio";
                    meta.tdAttr = 'data-qtip="' + (value=='1' ? me.etiquetas.lbCliente :
                        me.etiquetas.lbProveedor) + '"';
                },
                filter: {
                    type: 'list',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['id', 'text'],
                        data: [
                            {"text": me.etiquetas.lbCliente, "id": 1},
                            {"text": me.etiquetas.lbProveedor, "id": 2}]
                    }),
                    listeners: {
                        serialize: onSerialize
                    }
                }
            },
            {
                text: me.etiquetas.lbEstado,
                fixed: true,
                width: 100,
                minWidth:60,
                dataIndex: 'estado',
                filter: {
                    type: 'list',
                    idField: 'idestado',
                    labelField: 'nombre',
                    store: Ext.create('Ext.data.Store', {
                        autoLoad: false,
                        proxy: {
                            extraParams: {
                                columnlist: 'ne.nombre, ne.idestado'
                            },
                            type: 'ajax',
                            url: UtilsFn.buildUrl({action: 'getEstadosOferta'}, ModuleMgr.get('OfertaNegocio'))
                        },
                        fields: [
                            {name: 'nombre', type: 'string'},
                            {name: 'idestado', type: 'integer'},
                        ]
                    }),
                    listeners: {
                        serialize: function (data, filter, eOpts) {
                            data['value'] = Ext.encode(data['value']);
                        }
                    }
                },
                renderer: function (value, meta) {
                    meta.innerCls = "icondistra-" +  meta.record.data.estadoicon;
                    meta.tdAttr = 'data-qtip="' + value + '"';
                    return value;
                }
            },
            {
                text: me.etiquetas.lbVigente,
                tooltip: me.etiquetas.lbVigente,
                // sortable: true,
                align: 'center',
                minWidth: 60,
                width: 60,
                dataIndex: 'vigente',
                renderer: function (value, meta, records) {
                    meta.innerCls = value == '1' ? "icondistra-true verde" : "icondistra-false rojo";
                    meta.tdAttr = 'data-qtip="' + (value == '1' ?
                        'Vigente' :
                        'Fuera de vigencia <br>('+
                        (records.get('fechafirma')?'Vencido':'No firmado')+')')+ '"';
                },
                filter: {
                    type: 'list',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['id', 'text'],
                        data: [
                            {"text": "Vigente", "id": 1},
                            {"text": "Fuera de vigencia", "id": 2}]
                    }),
                    listeners: {
                        serialize: function (data, filter, eOpts) {
                            data['value'] = Ext.encode(data['value']);
                        }
                    }
                }
            }
        ];

        me.dockedItems = [
            {
                xtype: 'pagingtoolbar',
                store: me.store,
                dock: 'bottom',
                pageNumb: true,
                displayInfo: true,
                leyenda:[
                    {text: 'Oferta'},
                    {text: 'Con contrato', class: 'reoferta'}
                ],
                items: [
                    {
                        action: 'clearfilters',
                        iconCls: 'limpiar',
                        tooltip: me.etiquetas.qtipCleanFilters,
                        allwaysEnabled: true,
                        keyMap: {
                            key: 'l',
                            alt: true,
                            ctrl: true,
                            event: 'click'
                        }
                    }
                ]
            },
            {
                xtype:'toolbar',
                itemId:'accionesContextMenu',
                hidden:true,
                items:[
                    {
                        text: me.etiquetas.lbCrearContrato,
                        tooltip: me.etiquetas.qtipCrearContrato,
                        selector:'crearcontrato',
                        // itemId: 'crearcontratohidden',
                        hidden:true,
                        iconCls: 'icondistra-contratar', //contratocrm
                        action: 'crearcontrato',
                        // action: 'add',
                    },
                    // {
                    //     disabled: true,
                    //     hidden: true,
                    //     itemId: 'crearcontratohidden',
                    //     action: 'add',
                    //     // suplemento: false,
                    //     // addsuplemento: false,
                    //     tipocontrato: 'contratoCliente', //contratoCliente
                    //     context: 'importacion',
                    //     text: 'Crear contrato',
                    // }
                    {
                        action: 'vercontrato',
                        tooltip: me.etiquetas.qtipVerContrato,
                        selector:'vercontrato',
                        hidden:true,
                        iconCls: 'icondistra-detalles'
                    },
                    {
                        action:'versolicitud',
                        tooltip: me.etiquetas.qtipVerSolicitud,
                        selector: 'versolicitud',
                        hidden:true,
                        iconCls: 'icondistra-detalles',
                    }
                ]
            }
        ];

        me.tbar = me.getToolbarAcciones();

        this.callParent();
    },
    getToolbarAcciones: function(){
        var me = this;

        return [
            {
                xtype:'button',
                text: me.etiquetas.lbBtnAdd,
                iconCls: 'icondistra-adicionar',
                tooltip: me.etiquetas.ttipBtnAdicionarOferta,
                selector:'adicionarOfertaNegocio',
                hidden:true,
                menu:
                    Ext.create('Ext.menu.Menu',{
                        plain:true,
                        items:
                            [
                                {
                                    text: me.etiquetas.lbOfertaCliente,
                                    itemId:'addofertacliente',
                                    iconCls: 'icondistra-perfilusuario',
                                    tooltip: me.etiquetas.lbAdicionarOfertaNegocioCliente,
                                    action: 'addoferta',
                                    selector:'adicionarOfertaNegocioCliente',
                                    hidden:true,
                                },
                                {
                                    text: me.etiquetas.lbOfertaProveedor,
                                    itemId:'addofertaproveedor',
                                    iconCls: 'icondistra-servicio',
                                    tooltip: me.etiquetas.lbAdicionarOfertaNegocioProveedor,
                                    action: 'addoferta',
                                    selector:'adicionarOfertaNegocioProveedor',
                                    hidden:true,
                                },
                            ]
                    })
            },{
                xtype:'button',
                text: me.etiquetas.lbBtnMod,
                itemId:'modoferta',
                iconCls: 'icondistra-modificar',
                tooltip: me.etiquetas.ttipBtnModificarOferta,
                action: 'modoferta',
                disabled: true,
                selector:'modificarOfertaNegocio',
                hidden:true,
                keyMap: {
                    key: 'm',
                    alt: true,
                    event: 'click'
                }

            },{
                xtype:'button',
                text: me.etiquetas.lbBtnDel,
                iconCls: 'icondistra-eliminar',
                tooltip: me.etiquetas.ttipBtnEliminarOferta,
                itemId:'deloferta',
                action: 'elimoferta',
                disabled: true,
                selector:'eliminarOfertaNegocio',
                hidden:true,
                keyMap: {
                    ctrl:false,
                    alt:false,
                    key: Ext.EventObject.DELETE,
                    event: 'click'
                }
            },'-',{
                xtype:'button',
                text: me.etiquetas.lbBtnDetalles,
                iconCls: 'icondistra-detalles',
                tooltip: me.etiquetas.ttipBtnDetallesOferta,
                action: 'detalleoferta',
                itemId:'detoferta',
                disabled: true,
                selector:'detallesOfertaNegocio',
                hidden:true,
                keyMap: {
                    key: 'd',
                    alt: true,
                    event: 'click'
                }
            },{
                xtype:'button',
                text: me.etiquetas.lbBtnVerDictamenes,
                iconCls: 'informe',
                tooltip: me.etiquetas.ttipBtnVerDictamenes,
                action: 'verdictamen',
                selector:'verdictamen',
                itemId:'dictamenes',
                // hidden:true,
                disabled: true,
                keyMap: {
                    key: 'm',
                    alt: true,
                    event: 'click'
                }
            },{
                xtype:'button',
                text: me.etiquetas.lbBtnEstadoTrazas,
                iconCls: 'icondistra-traza',
                tooltip: me.etiquetas.ttipBtnEstadoTrazas,
                action: 'estadotrazas',
                itemId:'trazaoferta',
                disabled: true,
                selector:'estadoTrazasOfertaNegocio',
                hidden:true,
            }, '-',

            {
                xtype:'button',
                text: me.etiquetas.lbBtnCambiarEstado,
                iconCls: 'icondistra-modificar',
                tooltip: me.etiquetas.ttipBtnCambiarEstado,
                action: 'cambiarestado',
                itemId:'estado',
                hidden: true,
                disabled: true,
                menu: new Ext.menu.Menu(),
                selector:'cambiarEstadoOfertaNegocio'
            },
            {
                xtype:'button',
                text: me.etiquetas.lbImprimir,
                iconCls: 'icondistra-imprimir',
                tooltip: me.etiquetas.lbImprimirOfertaComercial,
                action: 'printofertacomercial',
                itemId:'imprimir',
                hidden: true,
                disabled: true,
                selector:'printOfertaComercial',
            },
            {
                disabled: true,
                hidden: true,
                itemId: 'crearcontratohidden',
                action: 'add',
                suplemento: false,
                addsuplemento: false,
                tipocontrato: 'contrato', //contratoCliente
                // context: 'importacion',
                text: 'Crear contrato',
                noCargarPorDefecto: true
            },
            '->',
            Ext.create('Ext.ux.SearchField', {
                itemId:'searchfield',
                width:200,
                atributo:'general',
                emptyText:me.etiquetas.lbbuscarCriterio,
                searchTooltip: me.etiquetas.tipBuscarCriterio
            }),
            {
                iconCls: 'ayuda',
                action: 'help',
                text: me.etiquetas.lbBtnhelp,
                // refhelp: 'dat_contrato',
                tooltip: me.etiquetas.qtipHelp
            }
        ];
    }
});