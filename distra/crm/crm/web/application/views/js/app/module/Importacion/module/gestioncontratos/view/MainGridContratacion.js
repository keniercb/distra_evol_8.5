Ext.define('GestionContratoImportacion.view.MainGridContratacion', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.co_contratosgridContratacionimportacion',
    region: 'center',
    selType: 'checkboxmodel',
    diasvencimiento: 30,
    diasvencimientoaux: 1,
    rowLines: true,
    requires: [
        'Ext.ux.grid.FiltersFeature'
    ],
    initComponent: function () {
        var me = this;
        Ext.util.Format.decimalSeparator = ',';
        Ext.util.Format.thousandSeparator = '.';
        Ext.util.Format.currencyPrecision = 2;
        Ext.util.Format.currencySign = ' ';
        me.etiquetas = LangMgr.getLang(me);
        me.store = Ext.create('GestionContratoImportacion.store.Contratos',{onlyOneLoad: true});
        me.selModel = {mode: 'MULTI'};
        me.frame = false;
        me.margin = false;
        me.border = false;
        me.emptyText = me.etiquetas.msgNoDataLoaded;
        me.viewConfig = {
            stripeRows: false,
            getRowClass: function (record, rowIndex, rowParams, store) {
                var estilo = '';
                if (record.get('diasrestantesvigencia') != null) {
                    if (parseFloat(record.get('diasrestantesvigencia')) <= 0) {
                        estilo = 'vigencia_excedida';
                    } else if (parseFloat(record.get('diasrestantesvigencia')) <= me.diasvencimiento) {
                        estilo = 'vigencia_a_excederse';
                    }
                    me.diasvencimientoaux = me.diasvencimiento;
                }
                if (record.data.idcontrato == record.data.idpadre)
                    estilo += " contractcolor";
                if (record.data.deuda)
                    estilo += " deuda";
                // estilo+=' summarystyle';
                return estilo;
            }
        };
        me.plugins = [
            Ext.create('CRM.plugins.ResaltarFiltrosPlugin', {
                // extraParams: true,
                //columnFilters: true,
                campos: [{
                    'itemId': 'searchfield',
                    'dataIndex': ['numerocontrato', 'numero', 'nombre'],
                    'color': '#ddd1a0'
                    //'extraParams': 'filtrogeneral[0][field]'
                }]
            })
        ];
        me.features = [{
            ftype: 'filters',
            menuFilterText: me.etiquetas.lbbusqueda,
            local: false,
            filters: [
                {
                    dataIndex: 'numero',
                    type: 'string'
                },
                {
                    dataIndex: 'fechafin',
                    type: 'date',
                    beforeText: me.etiquetas.lbantes,
                    afterText: me.etiquetas.lbdespues,
                    onText: me.etiquetas.lbigual,
                    dateFormat: 'd/m/Y'
                },
                {
                    dataIndex: 'fechainicio',
                    type: 'date',
                    beforeText: me.etiquetas.lbantes,
                    afterText: me.etiquetas.lbdespues,
                    onText: me.etiquetas.lbigual,
                    dateFormat: 'd/m/Y'
                },
                {
                    dataIndex: 'idarea',
                    type: 'list',
                    listeners: {
                        serialize: me.onSerialize
                    }
                },
				{
                    dataIndex: 'nombreareacreado',
                    type: 'string'
                },
            ]
        },
            {
                ftype: 'summary',
                dock: 'top'
            }
        ];
        var lbContrato = me.etiquetas.lbContract.getSingular().get(),
            lbContratos = me.etiquetas.lbContract.getPlural().get();

        me.columns = [

            {
                text: me.etiquetas.lbNumberContrato,
                dataIndex: 'numerocontrato',
                locked: true,
                minWidth: 70,
                width: 110,
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                },
                filter: {
                    type: 'string'
                },
                summaryRenderer: function (value, summaryData, dataIndex) {
                    return (value !== 0 ? '<b>Totales:</b>' : '');
                }
            },
            {
                text: me.etiquetas.lbNumber,
                dataIndex: 'numero',
                locked: true,
                minWidth: 70,
                width: 110,
                // hidden: true,
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                },
                filter: {
                    type: 'string'
                }

            },
            {
                text: me.etiquetas.lbName,
                dataIndex: 'nombre',
                locked: true,
                minWidth: 200,
                width: 270,
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                },
                filter: {
                    type: 'string'
                },
                summaryType: 'count',
                summaryRenderer: function (value) {
                    return Ext.String.format('{0} contrato{1}', value, value !== 1 ? 's' : '') + ' de ' + me.getStore().proxy.reader.jsonData.cant;
                }
            },
            {
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
                },
                filter: {
                    type: 'string'
                }
            },
            {
                text: me.etiquetas.lbArea,
                sortable: true,
                minWidth: 100,
                flex: 0.1,
                dataIndex: 'nombrearea',
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                },
                filter: {
                    type: 'string'
                }
            },
			{
                text: 'Área creadora',
                sortable: true,
                minWidth: 100,
                flex: 0.1,
                hidden: true,
                dataIndex: 'nombreareacreado',
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                },
                // filter: {
                //     type: 'string'
                // }
            },
            {
                text: me.etiquetas.textClienteFinal,
                sortable: true,
                minWidth: 70,
                flex: 0.1,
                dataIndex: 'clientefinal',
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                },
                filter: {
                    type: 'string',
                    // idField: 'idclientefinal',
                    // labelField: 'denominacion',
                    // store: Ext.create('Ext.data.Store', {
                    //     autoLoad: false,
                    //     proxy: {
                    //         extraParams: {
                    //             columnlist: 'ns.denominacion, ns.idclientefinal'
                    //         },
                    //         type: 'ajax',
                    //         url: UtilsFn.buildUrl({action: 'filterliststore'}, ModuleMgr.get('GestionContratoImportacion'))
                    //     },
                    //     fields: [
                    //         {name: 'denominacion', type: 'string'},
                    //         {name: 'idclientefinal', type: 'integer'},
                    //     ]
                    // }),
                    // listeners: {
                    //     serialize: me.onSerialize
                    // }
                }
            },
            {
                hidden: true,
                dataIndex: 'idclienteproveedor',
                hideable: false
            }, {
                hidden: true,
                dataIndex: 'cantreclamaciones',
                hideable: false
            },
            {
                text: me.etiquetas.lbTotalAmount,
                sortable: true,
                align: 'right',
                minWidth: 62,
                width: 80,
                hidden: true,
                hideable: false,
                dataIndex: 'montototal',
                renderer: function (value, meta) {
                    value = value || 0;
                    if (!Ext.isEmpty(value)) {
                        value = Ext.util.Format.currency(value);
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                },
                filter: {
                    type: 'numeric'
                },
                // summaryType: 'sum',
                summaryType: function (records, dataindex, b) {
                    var total = 0;
                    records.forEach(function (x) {
                        if (x.get(dataindex))
                            total += parseFloat(x.get(dataindex));
                    });
                    return total;
                }
            },
            {
                text: me.etiquetas.lbFechaRegistro,
                sortable: true,
                hidden: true,
                align: 'center',
                minWidth: 70,
                width: 85,
                dataIndex: 'fechainicio',
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                }
            },
            {
                text: me.etiquetas.lbFechaFirma,
                sortable: true,
                align: 'center',
                minWidth: 70,
                width: 85,
                dataIndex: 'fechafirma',
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                },
                filter: {
                    type: 'date',
                    beforeText: me.etiquetas.lbantes,
                    afterText: me.etiquetas.lbdespues,
                    onText: me.etiquetas.lbigual,
                    dateFormat: 'd/m/Y'
                }
            },
            {
                text: me.etiquetas.lbFechaFin,
                sortable: true,
                hidden: true,
                align: 'center',
                minWidth: 70,
                width: 85,
                dataIndex: 'fechafin',
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                }
            },
            {
                text: me.etiquetas.lbTypeContract,
                sortable: true,
                align: 'leaft',
                minWidth: 85,
                flex: 0.1,
                dataIndex: 'tipocontrato',
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                },
                filter: {
                    type: 'list',
                    idField: 'idtipocontrato',
                    labelField: 'denominaciontipocontrato',
                    store: Ext.create('Ext.data.Store', {
                        autoLoad: false,
                        proxy: {
                            extraParams: {columnlist: 'denominaciontipocontrato,idtipocontrato'},
                            type: 'ajax',
                            url: UtilsFn.buildUrl({action: 'filterliststore'}, ModuleMgr.get('GestionContratoImportacion'))
                        },
                        fields: [
                            {name: 'denominaciontipocontrato', type: 'string'},
                            {name: 'idtipocontrato'}
                        ]
                    }),
                    listeners: {
                        serialize: me.onSerialize
                    }
                }
            },
            {
                text: me.etiquetas.lbEstado,
                sortable: true,
                minWidth: 80,
                width: 80,
                dataIndex: 'estadoinicial',
                renderer: function (value, meta, record) {
                    meta.innerCls = "icondistra-" + meta.record.data.iconoestadoinicial;
                    meta.tdAttr = 'data-qtip="' + value + ' <br> <u>Fecha</u>: ' + record.data.fechaestado + '"';
                    return value;
                },
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
                            url: UtilsFn.buildUrl({action: 'filterliststore'}, ModuleMgr.get('GestionContratoImportacion'))
                        },
                        fields: [
                            {name: 'nombre', type: 'string'},
                            {name: 'idestado', type: 'integer'},
                        ]
                    }),
                    listeners: {
                        serialize: me.onSerialize
                    }
                }
            },
            {
                text: me.etiquetas.lbVigente,
                tooltip: me.etiquetas.lbVigente,
                sortable: true,
                align: 'center',
                minWidth: 60,
                width: 60,
                dataIndex: 'vigente',
                renderer: function (value, meta, records) {
                    meta.innerCls = value == '1' ? "icondistra-true verde" : "icondistra-false rojo";
                    meta.tdAttr = 'data-qtip="' + (value == '1' ?
                        'Vigente <br>(' +
                        (records.get('cumplimientoobligaciones') == '1' ? me.etiquetas.lbCumplimiento :
                            records.get('diasrestantesvigencia') + ' d&iacute;as restantes') + ')' :
                        'Fuera de vigencia <br>(' +
                        (records.get('fechafirma') ? (records.get('fechafirma') > Date() ? 'Vencido' : 'No vigente') : 'No firmado') + ')') + '"';
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
                        serialize: me.onSerialize
                    }

                },
                summaryType: function (records, dataindex, b) {
                    if (records.length > 0) {
                        var vigentes = 0, novigentes = 0;
                        records.forEach(function (x) {
                            x.get(dataindex) == 1 ? vigentes++ : novigentes++;
                        });
                        return vigentes + ' - ' + novigentes;
                    }
                    return '';
                },
                summaryRenderer: function (value, summaryData, dataIndex) {
                    var resultado = '';
                    if (value != '') {
                        var aux = value.split(' - ');
                        summaryData.tdAttr = 'data-qtip="Vigentes: ' + aux[0] + '<br>No vigentes: ' + aux[1] + '"';
                        resultado = '<span style="color: green">' + aux[0] + '</span> - <span style="color: red">' + aux[1] + '</span>';
                    }
                    return resultado;
                }
            },
            {
                text: me.etiquetas.lbColumnMarco,
                tooltip: me.etiquetas.lbColumnMarco,
                sortable: true,
                align: 'center',
                width: 50,
                minWidth: 50,
                dataIndex: 'contratomarco',
                renderer: function (value, meta) {
                    meta.innerCls = value ? "icondistra-true verde" : "icondistra-false rojo";
                    meta.tdAttr = 'data-qtip="' + (value ? me.etiquetas.qtipContratoMarco : me.etiquetas.lbContrato) + '"';
                },
                filter: {
                    type: 'boolean',
                    yesText: me.etiquetas.lbYes,
                    noText: me.etiquetas.lbNo
                }
            },
            {
                text: me.etiquetas.lbCliente,
                tooltip: me.etiquetas.lbCliente,
                sortable: true,
                align: 'center',
                minWidth: 55,
                width: 55,
                dataIndex: 'cliente',
                renderer: function (value, meta) {
                    var iconos = ["icondistra-servicio", "icondistra-perfilusuario", "icondistra-importar"];
                    var nombres = [me.etiquetas.lbContratoProveedor, me.etiquetas.lbContratoCliente, me.etiquetas.lbContratoImportacion];
                    meta.innerCls = iconos[value] //value ? "icondistra-perfilusuario" : "icondistra-servicio";
                    meta.tdAttr = 'data-qtip="' + nombres[value] + '"';
                    // meta.tdAttr = 'data-qtip="' + (value ? me.etiquetas.lbContratoCliente : me.etiquetas.lbContratoProveedor) + '"';
                },
                filter: {
                    type: 'list',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['id', 'text'],
                        data: [
                            // {"text": me.etiquetas.lbContratoCliente, "id": 1},
                            // {"text": me.etiquetas.lbContratoProveedor, "id": 0},
                            {"text": me.etiquetas.lbContratoImportacion, "id": 2},
                        ]
                    }),
                    listeners: {
                        serialize: me.onSerialize
                    }
                }
            },
            {
                text: 'Doc',
                width: 35,
                align: 'center',
                renderer: function(value, meta){
                    // console.log(meta.record.data.idespaciotrabajo, meta)
                    var idespaciotrabajo=meta.record.data.idespaciotrabajo;
                    if(idespaciotrabajo) {
                        meta.innerCls = idespaciotrabajo ? "icondistra-documentos" : "";
                        meta.tdAttr = 'data-qtip="' + (idespaciotrabajo ? 'Tiene documentos' :
                            '') + '"';
                        // meta.tdAttr = 'data-qtip="' + (idespaciotrabajo ? me.etiquetas.lbContratoCliente :
                        //     me.etiquetas.lbContratoProveedor) + '"';
                    }
                }
            },
            {
                text: 'IdArea',
                dataIndex: 'idarea',
                hideable: false,
                hidden: true
            }
        ];

        me.dockedItems = [
            {
                xtype: 'pagingtoolbar',
                store: me.store,
                dock: 'bottom',
                pageNumb: true,
                displayInfo: true,
                comboEntradas:8,
                leyenda:[
                    {text: 'Contrato original', class:'contractcolor'},
                    {text: 'Contrato suplemento'},
                    {text: 'Próximo a vencer', class: 'vigencia_a_excederse'},
                    {text: 'Contrato vencido', class: 'vigencia_excedida'},
                    {text: 'Contrato con deudas', class: 'deuda'},
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
                    }, '-',
                    {
                        xtype: 'tbspacer',
                        width: 10
                    },
                    {
                        xtype: 'displayfield',
                        fieldLabel: "Contratos:",
                        labelWidth:50,
                        allowBlank:true,
                        itemId: "contratos"
                    },
                    {
                        xtype: 'tbspacer',
                        width: 30
                    },
                    {
                        xtype: 'displayfield',
                        fieldLabel: "Suplementos:",
                        labelWidth:65,
                        allowBlank:true,
                        itemId: "suplementos"
                    }
                ]
            },
            {
                xtype: 'toolbar',
                itemId: 'accionesContextMenu',
                hidden: true,
                items: [
                    {
                        iconCls: 'detalles',
                        action: 'detallesoferta',
                        // disabled: true,
                        hidden: true,
                        selector: 'detallesoferta',
                        gridcontract: true,
                        tooltip: me.etiquetas.qtipVerOferta
                    }
                ]
            }
        ];

        me.searchfield = Ext.create('Ext.ux.SearchField', {
            itemId: 'searchfield',
            flex: 1,
            maxWidth: 250,
            minWidth: 150,
            searchTooltip: me.etiquetas.qtipSearch.get(lbContrato.toLowerCase()),
            keyMap: [
                {
                    key: 'l',
                    alt: true,
                    ctrl: false,
                    event: 'onclick1'
                },
                {
                    key: 'b',
                    alt: true,
                    ctrl: false,
                    event: 'onclick2'
                }
            ]
        });

        var itemsCliente = [
            {
                text: 'General',
                width: 150,
                tipocontrato: 'contratoMarco',
                iconCls: 'noevaluado',
                selector: 'btnAddClienteMarco',
                hidden: true
            }, {
                text: me.etiquetas.lbNuevoContrato,
                width: 150,
                tipocontrato: 'contrato',
                iconCls: 'nuevo',
                selector: 'btnAddClienteContrato',
                hidden: true
            }
        ];

        var itemsProveedor = [
            {
                text: me.etiquetas.lbContratoMarco,
                width: 150,
                tipocontrato: 'contratoMarco',
                iconCls: 'noevaluado',
                selector: 'btnAddProveedorMarco',
                hidden: true
            }, {
                text: me.etiquetas.lbNuevoContrato,
                width: 150,
                tipocontrato: 'contrato',
                iconCls: 'nuevo',
                selector: 'btnAddProveedorContrato',
                hidden: true
            }
        ];

        var itemsImportacion = [
            {
                text: 'General',
                width: 150,
                tipocontrato: 'contratoMarco',
                iconCls: 'noevaluado',
                selector: 'btnAddImportacionMarco',
                hidden: true
            }, {
                text: 'Puntual',
                width: 150,
                tipocontrato: 'contrato',
                iconCls: 'nuevo',
                selector: 'btnAddImportacionContrato',
                hidden: true
            }
        ];

        me.clienteMenu = Ext.create('Ext.menu.Menu', {
            plain: true,
            defaults: {
                context: 'cliente',
                action: 'add'
            },
            items: itemsCliente
        });

        me.proveedorMenu = Ext.create('Ext.menu.Menu', {
            plain: true,
            defaults: {
                context: 'proveedor',
                action: 'add'
            },
            items: itemsProveedor
        });

        me.importacionMenu = Ext.create('Ext.menu.Menu', {
            plain: true,
            defaults: {
                context: 'importacion',
                action: 'add'
            },
            items: itemsImportacion
        });

        me.menu = Ext.create('Ext.menu.Menu', {
            // id: 'mainMenu',
            plain: true,
            style: {
                overflow: 'visible'
            },
            items: [
                // {
                //     text: me.etiquetas.lbContratoCliente,
                //     hideOnClick: false,
                //     menu: me.clienteMenu,
                //     iconCls: 'perfilusuario',
                //     selector: 'btnAddCliente',
                //     hidden: true
                // }, {
                //     text: me.etiquetas.lbContratoProveedor,
                //     hideOnClick: false,
                //     menu: me.proveedorMenu,
                //     iconCls: 'servicio',
                //     selector: 'btnAddProveedor',
                //     hidden: true
                // },
                {
                    text: me.etiquetas.lbContratoImportacion,
                    hideOnClick: false,
                    menu: me.importacionMenu,
                    iconCls: 'importar',
                    selector: 'btnAddImportacion',
                    hidden: true
                }
            ]
        });

        me.btnAdd = Ext.create('Ext.Button', {
            iconCls: 'adicionar',
            text: me.etiquetas.lbAdd,
            selector: 'btnAdd',
            hidden: true,
            tooltip: me.etiquetas.qtipAddContrato,
            menu: me.menu
        });
        // me.btnPrint = Ext.create('Ext.menu.Item', {
        //     iconCls: 'vistaprevia',
        //     action: 'imprimir',
        //     text: me.etiquetas.lbBtnPrevView,
        //     disabled: true,
        //     hidden: true,
        //     selector: 'btnPrint',
        //     tooltip: me.etiquetas.qtipPrevView.get()
        // });
        me.btnMod = Ext.create('Ext.Button', {
            iconCls: 'modificar',
            action: 'edit',
            selector: 'btnMod',
            hidden: true,
            disabled: true,
            text: me.etiquetas.lbBtnMod,
            tooltip: me.etiquetas.qtipModificar,
            keyMap: {
                key: 'm',
                alt: true,
                ctrl: false,
                event: 'click'
            }
        });

        me.btnDel = Ext.create('Ext.Button', {
            iconCls: 'eliminar',
            action: 'desactivar',
            selector: 'btnDel',
            disabled: true,
            hidden: true,
            text: me.etiquetas.lbBtnDel,
            tooltip: me.etiquetas.qtipEliminar,
            keyMap: {
                ctrl: false,
                alt: false,
                key: Ext.EventObject.DELETE,
                event: 'click'
            }
        });

        me.btnDetails = Ext.create('Ext.Button', {
            iconCls: 'detalles',
            action: 'detail',
            selector: 'btnDetails',
            hidden: true,
            text: me.etiquetas.lbBtnDetail,
            tooltip: me.etiquetas.qtipDetail,
            keyMap: {
                key: 'd',
                alt: true,
                ctrl: false,
                event: 'click'
            }
        });

            me.btnCreateSupl = Ext.create('Ext.menu.Item', {
            iconCls: 'duplicar',
            action: 'createsupl',
            disabled: true,
            hidden: true,
            selector: 'btnCreateSupl',
            text: me.etiquetas.lbCreateSuplement,
            tooltip: me.etiquetas.qtipSuplement
        });
        me.btnTrazas = Ext.create('Ext.menu.Item', {
            iconCls: 'traza',
            action: 'vertrazas',
            text: me.etiquetas.lbTrazas,
            selector: 'btnTrazas',
            //hidden: true,
            tooltip: me.etiquetas.qtipTrazas,
            disabled: true,
            keyMap: {
                key: 'u',
                alt: true,
                ctrl: false,
                event: 'click'
            }
        });
        me.btnPrint = Ext.create('Ext.menu.Item', {
            iconCls: 'vistaprevia',
            action: 'imprimir',
            text: me.etiquetas.lbBtnPrevView,
            disabled: true,
            hidden: true,
            selector: 'btnPrint',
            tooltip: me.etiquetas.qtipPrevView.get()
        });

        me.btnHistorial = Ext.create('Ext.menu.Item', {
            iconCls: 'historial',
            action: 'historial',
            disabled: true,
            hidden: true,
            selector: 'btnHistorial',
            text: me.etiquetas.lbHist,
            tooltip: me.etiquetas.qtipHistoric
        });

        me.btnReclamaciones = Ext.create('Ext.menu.Item', {
            iconCls: 'reclamacion',
            action: 'reclamacion',
            disabled: true,
            hidden: true,
            selector: 'reclamacion',
            text: me.etiquetas.lbReclamacion,
            tooltip: me.etiquetas.lbReclamacion
        });

        me.btnConfigNum = Ext.create('Ext.menu.Item', {
            iconCls: 'configuracion',
            action: 'confignum',
            text: me.etiquetas.lbConfigNum,
            selector: 'btnConfigNum',
            hidden: true,
            tooltip: me.etiquetas.qtipConfigNum
        });

        me.btnConfigVigencia = Ext.create('Ext.menu.Item', {
            iconCls: 'asistenciamensual',
            action: 'configvigencia',
            text: me.etiquetas.lbConfigVigencia,
            selector: 'btnConfigVigencia',
            hidden: true,
            tooltip: me.etiquetas.qtipConfigVigencia
        });

        me.btnGestDoc = Ext.create('Ext.menu.Item', {
            iconCls: 'abrir',
            action: 'gestdoc',
            text: 'Abrir gestor documental',
            selector: 'btnGestDoc',
            //  hidden: true,
            tooltip: 'Abrir Gestor documental'
        });

        me.btnOpinion = Ext.create('Ext.menu.Item', {
            iconCls: 'informe',
            action: 'opinions',
            selector: 'btnOpinion',
            disabled: true,
            hidden: true,
            text: this.etiquetas.lbOpinions,
            tooltip: this.etiquetas.qtipOpinions
        });

        me.btnPorDefecto = Ext.create('Ext.menu.Item', {
            iconCls: 'configurarconceptos',
            action: 'porDefecto',
            selector: 'porDefecto',
            // disabled: true,
            hidden: true,
            text: this.etiquetas.lbPorDefectos,
            tooltip: this.etiquetas.qtipPorDefecto
        });

        me.btnCambiarArea = Ext.create('Ext.menu.Item', {
            iconCls: 'iniciocrm',
            action: 'cambiarArea',
            selector: 'cambiarArea',
            disabled: true,
            hidden: true,
            text: this.etiquetas.lbCambiarArea,
            tooltip: this.etiquetas.lbCambiarArea
        });

        me.btnImprimir = Ext.create('Ext.menu.Item', {
            iconCls: 'imprimir',
            action: 'imprimirDetalles',
            selector: 'imprimirDetalles',
            // disabled: true,
            hidden: true,
            text: this.etiquetas.lbImprimirContrato,
            tooltip: this.etiquetas.lbImprimirContrato
        });

        me.btnAdjuntarDocumento = Ext.create('Ext.menu.Item', {
            iconCls: 'subirfichero',
            action: 'adjuntardocumento',
            selector: 'adjuntardocumento',
            disabled: true,
            hidden: true,
            text: this.etiquetas.ldAdjuntarDocumento,
            tooltip: this.etiquetas.ldAdjuntarDocumento
        });

        me.btnGraficar = Ext.create('Ext.menu.Item', {
            iconCls: 'graficar',
            action: 'graficar',
            selector: 'graficar',
            disabled: true,
            text: this.etiquetas.ldGraficar,
            tooltip: this.etiquetas.ldGraficar
        });

        me.btnModificarNumero = Ext.create('Ext.menu.Item', {
            iconCls: 'modificar',
            action: 'modificarnumerocontrato',
            text: me.etiquetas.lbModificarNumero,
            selector: 'btnModificarNumeroContrato',
            hidden: true,
            disabled:true,
            tooltip: me.etiquetas.qtipModificarNumero
        });

        me.btnAjusteMonetario = Ext.create('Ext.menu.Item', {
            iconCls: 'modificar',
            action: 'ajustemonetario',
            text: 'Ajuste monetario',
            selector: 'btnAjusteMonetario',
            // hidden: true,
            // disabled:true,
            tooltip: 'Ajuste monetario'
        });

        me.btnLimpiarEspacioTrabajo = Ext.create('Ext.menu.Item', {
            iconCls: 'modificar',
            action: 'limpiarespacio',
            text: 'Limpiar espacio',
            selector: 'btnLimpiarEspacioTrabajo',
            // hidden: true,
            // disabled:true,
            tooltip: 'Limpiar espacio de trabajo'
        });

        me.btnArreglarEstado = Ext.create('Ext.menu.Item', {
            iconCls: 'modificar',
            action: 'arreglarestado',
            text: 'Arreglar estado',
            selector: 'btnArreglarEstado',
            // hidden: true,
            // disabled:true,
            tooltip: 'Arreglar estado del contrato'
        });

        me.btnEliminarBD = Ext.create('Ext.menu.Item', {
            iconCls: 'eliminar',
            action: 'eliminarBD',
            text: me.etiquetas.lbEliminarEntradas,
            selector: 'btnEliminarBD',
            hidden: true,
            tooltip: me.etiquetas.qtipEliminarEntradas
        });

        me.btnGestionarDocumentos = Ext.create('Ext.menu.Item', {
            iconCls: 'subirfichero',
            action: 'gestionardocumentos',
            selector: 'gestionardocumentos',
            disabled: true,
            hidden: true,
            text: 'Gestionar documentos',
            tooltip: 'Gestionar documentos del contrato'
        });

        me.btnAcciones = Ext.create('Ext.Button', {
            iconCls: 'contraer',
            text: me.etiquetas.lbMasAcciones,
            tooltip: me.etiquetas.lbMasAcciones,
            selector: 'btnAcciones',
            hidden: true,
            menu: [me.btnCreateSupl, me.btnHistorial, me.btnTrazas, me.btnPrint, me.btnGestDoc,
                me.btnOpinion, me.btnImprimir, me.btnAdjuntarDocumento, me.btnAjusteMonetario,
                me.btnArreglarEstado, me.btnGraficar, me.btnGestionarDocumentos]
        });

        me.btnConfiguraciones = Ext.create('Ext.Button', {
            iconCls: 'ambiente',
            text: me.etiquetas.lbConfiguraciones,
            tooltip: me.etiquetas.lbConfiguraciones,
            selector: 'btnConfiguraciones',
            hidden: true,
            menu: [me.btnConfigNum, me.btnModificarNumero, me.btnConfigVigencia, me.btnPorDefecto, me.btnCambiarArea,
                me.btnEliminarBD, me.btnCambiarArea, me.btnLimpiarEspacioTrabajo]
        });

        me.btnHelp = Ext.create('Ext.Button', {
            iconCls: 'ayuda',
            action: 'help',
            text: me.etiquetas.lbBtnhelp,
            refhelp: 'dat_contrato',
            tooltip: me.etiquetas.qtipHelp
        });

        me.btnChangeState = Ext.create('Ext.Button', {
            iconCls: 'modificar',
            selector: 'btnChangeState',
            hidden: true,
            text: this.etiquetas.lbChangeState,
            tooltip: this.etiquetas.lbChangeState,
            menu: new Ext.menu.Menu()
        });

        me.cmbarea = Ext.create('GestionContratoImportacion.view.SearchCmbArea', {
            name: 'filtroarea',
            hideLabel: true,
            maxWidth: 250,
            minWidth: 150,
            width: 200,
            editable: false,
            searchTooltip: me.etiquetas.qtipSearch.get(lbContrato.toLowerCase()),
            clearTooltip: 'Limpiar filtro',
            emptyText: 'Seleccione el \xE1rea...'
        });
		
		me.checkTipoArea=Ext.create('Ext.ux.form.field.ToggleSlide',{
            itemId: 'selectarea',
            // xtype: 'toggleslidefield',
            // labelSeparator: '',
            name: 'activo',
            allowBlank: true,
            // labelStyle: 'margin-bottom:5px;color: hsl(214, 74%, 31%);',
            onText: 'A.R.',
            offText: 'A.C.',
            state: true,
            // labelAlign: 'top',
            // fieldLabel: this.etiquetas.lbGestorDocumental
        });

        me.tbar = Ext.create('Ext.toolbar.Toolbar', {
            enableOverflow: true,
            items: [
                me.btnAdd,
                me.btnMod,
                me.btnDel,
                me.btnDetails,
                me.btnChangeState,
                '-',
                me.btnAcciones,
                me.btnConfiguraciones,
                '->',
                me.searchfield,
                me.cmbarea,
				me.checkTipoArea,
                '-',
                me.btnHelp
            ]
        });


        me.callParent();
        // console.log('container:', me.up('container'))
        if (me.up('container'))
            me.up('container').doLayout();
        // me.doLayout();
    },
    onSerialize: function (data, filter, eOpts) {
        data['value'] = Ext.encode(data['value']);
    }
});
