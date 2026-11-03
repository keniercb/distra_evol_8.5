Ext.define('Facturacion.view.ContratoGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.fac_contratogrid',
    selType: 'checkboxmodel',
    stripeRows: true,
    multiSelect: true,
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
        me.store = Ext.create('Facturacion.store.Contratos',{onlyOneLoad: true});
     /*
        var hoy=new Date(),
            inicioMes=new Date(hoy.getFullYear(), hoy.getMonth(), 1),
            finMes=new Date(hoy.getFullYear(), hoy.getMonth()+1, 0);
        with(me.store.proxy){
            extraParams['filter[50][field]']='rangofechahito';
            extraParams['filter[50][data][type]']='date';
            extraParams['filter[50][data][comparison]']='gt';
            extraParams['filter[50][data][value]']=inicioMes;
            extraParams['filter[51][field]']='rangofechahito';
            extraParams['filter[51][data][type]']='date';
            extraParams['filter[51][data][comparison]']='lt';
            extraParams['filter[51][data][value]']=finMes;
        }
        me.store.load();*/
        me.selModel = {mode: 'MULTI'};
        me.frame = false;
        me.margin = false;
        me.border = false;
        me.split = true;
        me.emptyText = me.etiquetas.msgNoDataLoaded;
        me.title = me.etiquetas.lbTitleContrato;
        me.features = [
            {
                ftype: 'filters',
                menuFilterText: me.etiquetas.lbbusqueda,
                local: false
            },
            {
                ftype: 'summary',
                dock: 'top'
            }
        ];

        //COLUMNAS
        me.columns = [
            {
                text: me.etiquetas.lbNumber,
                dataIndex: 'numero',
                minWidth: 70,
                width: 110,
                hidden: true,
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                },
                filter: {
                    type: 'string'
                },

            },
            {
                text: me.etiquetas.lbNumberContrato,
                dataIndex: 'numerocontrato',
                minWidth: 70,
                flex: 1,
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
                text: me.etiquetas.lbName,
                dataIndex: 'nombre',
                // hidden: true,
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
                summaryRenderer: function (value, summaryData, dataIndex) {
                    return Ext.String.format('{0} contrato{1}', value, value !== 1 ? 's' : '') + ' de ' + me.getStore().proxy.reader.jsonData.cant;
                }
            },
            {
                text: me.etiquetas.lbClientProv,
                sortable: true,
                minWidth: 100,
                flex: 1,
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
                text: me.etiquetas.lbTotalAmount,
                sortable: true,
                // hidden: true,
                align: 'right',
                minWidth: 62,
                width: 80,
                dataIndex: 'montototal',
                renderer: function (value, meta) {
                    if (!Ext.isEmpty(value)) {
                        value = Ext.util.Format.currency(value);
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                },
                filter: {
                    type: 'numeric'
                },
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
                width: 80,
                dataIndex: 'fechainicio',
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                },
                filter: {
                    dataIndex: 'fechainicio',
                    type: 'date',
                    beforeText: me.etiquetas.lbantes,
                    afterText: me.etiquetas.lbdespues,
                    onText: me.etiquetas.lbigual
                }
            },
            {
                text: me.etiquetas.lbFechaFirma,
                sortable: true,
                hidden: true,
                align: 'center',
                minWidth: 70,
                width: 80,
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
                    onText: me.etiquetas.lbigual
                }
            },
            {
                text: me.etiquetas.lbFechaFin,
                sortable: true,
                hidden: true,
                align: 'center',
                minWidth: 70,
                dataIndex: 'fechafin',
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                },
                filter: {
                    dataIndex: 'fechafin',
                    type: 'date',
                    beforeText: me.etiquetas.lbantes,
                    afterText: me.etiquetas.lbdespues,
                    onText: me.etiquetas.lbigual
                }
            },
            {
                text: me.etiquetas.lbTypeContract,
                sortable: true,
                hidden: true,
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
                    idField: 'denominaciontipocontrato',
                    labelField: 'denominaciontipocontrato',
                    store: Ext.create('Ext.data.Store', {
                        autoLoad: false,
                        proxy: {
                            extraParams: {columnlist: 'denominaciontipocontrato'},
                            type: 'ajax',
                            url: UtilsFn.buildUrl({action: 'filterliststore'}, ModuleMgr.get('GestionContrato'))
                        },
                        fields: [
                            {name: 'denominaciontipocontrato', type: 'string'}
                        ]
                    })
                }
            },
            {
                text: me.etiquetas.lbEstado,
                sortable: true,
                // hidden: true,
                minWidth: 80,
                width: 80,
                dataIndex: 'estadoinicial',
                renderer: function (value, meta) {
                    meta.innerCls = "icondistra-" + meta.record.data.iconoestadoinicial;
                    meta.tdAttr = 'data-qtip="' + value + '"';
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
                            url: UtilsFn.buildUrl({action: 'filterliststore'}, ModuleMgr.get('GestionContrato'))
                        },
                        fields: [
                            {name: 'nombre', type: 'string'},
                            {name: 'idestado', type: 'integer'},
                        ]
                    }),
                    listeners: {
                        serialize: function (data, filter, eOpts) {
                            data['value'] = [data['value']];
                        }
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
                //hidden: me.columnasVisibles.indexOf('vigente') == -1,
				hidden:false,
				filter: {
                    type: 'list',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['id', 'text'],
                        data: [
                            {"text": "Vigente", "id": 1},
                            {"text": "Fuera de vigencia", "id": 2}]
                    }),
                    listeners: {
                        serialize: function(data, filter, eOpts){data['value'] = Ext.encode(data['value']);}
                    }
                },
               renderer: function (value, meta, records) {
                    meta.innerCls = value == '1' ? "icondistra-true verde" : "icondistra-false rojo";
                    meta.tdAttr = 'data-qtip="' + (value == '1' ?
                        'Vigente <br>(' +
                        (records.get('cumplimientoobligaciones') == '1' ? me.etiquetas.lbCumplimiento :
                            records.get('diasrestantesvigencia') + ' d&iacute;as restantes') + ')' :
                        'Fuera de vigencia <br>(' +
                        (records.get('fechafirma') ? 'Vencido' : 'No firmado') + ')') + '"';
                },
            }
        ];

        me.dockedItems = [
            {
                xtype: 'pagingtoolbar',
                store: me.store,
                dock: 'bottom',
                pageNumb: true,
                displayInfo: true,
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
            }
        ];

        me.btnDetails = Ext.create('Ext.Button', {
            iconCls: 'detalles',
            action: 'contractdetail',
            selector: 'btnDetailsContract',
            hidden: true,
            disabled: true,
            text: me.etiquetas.lbBtnDetail,
            tooltip: me.etiquetas.qtipDetail,
            keyMap: {
                key: 'd',
                alt: true,
                ctrl: false,
                event: 'click'
            }
        });

        this.btnInicioProyecto = Ext.create('Ext.Button', {
            iconCls: 'imprimir',
            action: 'generarinicioproyecto',
            selector: 'generarInicioProyecto',
            hidden: true,
            // disabled: true,
            text: this.etiquetas.lbInicioProyecto,
            tooltip: this.etiquetas.lbGenerarInicioProyecto,
        });

        this.btnModificarServicio = Ext.create('Ext.Button', {
            iconCls: 'modificar',
            action: 'modificarServicio',
            selector: 'modificarServicio',
            hidden: true,
            disabled: true,
            text: this.etiquetas.lbModificarServicios,
            tooltip: this.etiquetas.lbModificarServicios,
        });

        this.btnInicioSoporteProyecto = Ext.create('Ext.Button', {
            iconCls: 'imprimir',
            action: 'generariniciosoporteproyecto',
            selector: 'generarInicioSoporteProyecto',
            hidden: true,
            // disabled: true,
            text: this.etiquetas.lbSoporteProyecto,
            tooltip: this.etiquetas.lbGenerarSoporteProyecto,
        });

        this.btnOrdenProduccion = Ext.create('Ext.Button', {
            iconCls: 'imprimir',
            action: 'generarordenproduccion',
            selector: 'generarOrdenProduccion',
            // hidden: true,
            // disabled: true,
            text: 'Generar orden de producción',
            tooltip: 'Generar orden de producción'
        });

        this.btnGenerar = Ext.create('Ext.Button', {
            iconCls: 'imprimir',
            selector: 'btnGenerarContrato',
            hidden: true,
            disabled: true,
            text: this.etiquetas.lbGenerar,
            tooltip: this.etiquetas.lbGenerar,
            menu: Ext.create('Ext.menu.Menu', {
                plain: true,
                items: [this.btnInicioProyecto, this.btnInicioSoporteProyecto, this.btnOrdenProduccion]
            })
        });

        this.cbListofacturar = Ext.create('Ext.form.field.Checkbox', {
            boxLabel: 'Hitos listos para facturar',
            hideLabel: true
        });

        this.meses=Ext.create('Ext.ux.SelectAdvancedField',{
            valueField: 'id',
			fieldLabel: 'Contratos con Hitos',
            emptyText: 'Seleccione el mes',
            width: 300,
            store: Ext.create('Ext.data.Store',{
                fields:['text', {name:'id', type: 'string'}],
                data:[
                    {text: 'Enero', id: '01'},
                    {text: 'Febrero', id: '02'},
                    {text: 'Marzo', id: '03'},
                    {text: 'Abril', id: '04'},
                    {text: 'Mayo', id: '05'},
                    {text: 'Junio', id: '06'},
                    {text: 'Julio', id: '07'},
                    {text: 'Agosto', id: '08'},
                    {text: 'Septiembre', id: '09'},
                    {text: 'Octubre', id: '10'},
                    {text: 'Noviembre', id: '11'},
                    {text: 'Diciembre', id: '12'},
                ]
            }),
            listeners:{
                search: function(field){
                    with(me.getStore()){
                        proxy.extraParams['filter[120][field]']='hitomes';
                        proxy.extraParams['filter[120][data][type]']='other';
                        proxy.extraParams['filter[120][data][value]']=field.getValue();
                        load();
                    }

                },
                clear: function(){
                    with(me.getStore()) {
                        proxy.extraParams['filter[120][field]'] = undefined;
                        proxy.extraParams['filter[120][data][type]'] = null;
                        proxy.extraParams['filter[120][data][value]'] = undefined;
                        load();
                    }
                }
            }
        })

        this.rangofechas=Ext.create('Ext.ux.RangoFechasFilter',{
            //buttonLimpiar: false,
            //buttonLimpiarCampos: false,
            //initialValue: 'mesActual',
            parametroFiltro: 'rangofechahito',
            grid: me
        });
        me.tbar = Ext.create('Ext.toolbar.Toolbar', {
            minHeight: 26,
            enableOverflow: true,
            items: [me.btnDetails, this.btnGenerar, this.btnModificarServicio, this.rangofechas, '->',this.cbListofacturar]
        });

        me.callParent();
    }


});
