// componente generico para cuando halla que mostrar los contratos (NO TOCAR!!!)
Ext.define('GestionContrato.view.gridContratos', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.gridContratos',
    itemId: 'gridContratos',
    selType: 'rowmodel', //INICIALMENTE VA A SER ESTE EL SELMODEL, SI QUIERES OTRO CAMBIALO ASI GENIO, NO INVENTES
    columnasVisibles: [
        'numerocontrato', 'numero', 'clienteproveedor',
         'montototal',  'fechafirma',
         'estadoinicial',
      /*  'nombrearea', 'areacreadora', 'sector',
        'tipocontrato','fechainicio', 'fechafin',
        'vigente', 'contratomarco', 'cliente'*/
    ],  //LAS COLUMNAS QUE VAN A SER VISIBLES INICIALMENTE, (COMENTADAS TODAS LAS POSIBILIDADES)
    defaultsToolbar: true,  //  TRUE PARA MOSTRAR ELEMENTOS POR DEFECTO EN EL TOPBAR
    extraButtons: null,  // pasar aqui botones adicionales a poner en el inicio del toolbar
    topBar: true, //SI SE VA A MOSTRAR EL TOPBAR, BOTONES
    bottomBar: true, //SI SE VA A MOSTRAR EL BOTTOMBAR
    filtrosColumnas: true,  //SI VA A TENER LOS FILTROS DE LAS COLUMNAS, NO ME MIREN ASI, PUEDE QUE NO HAGAN FALTA
    summaryColumnas: true, //SI SE VA A MOSTRAR EL SUMARIO DE LOS TOTALES
    lokedColumns: true, //SI VA A TENER BLOQUEADAS LAS COLUMNAS PRINCIPALES(NUM, NUMCONTRATO, NOMBRE)
    filtrosFijos:{}, //AQUI SE PONDRIAN LOS FILTROS CON SE VA  A CARGAR EL GRID INICIALMENTE Y QUE NO PODRÍAN MODIFICARSE
    filtrosIniciales:{}, //AQUI SE PONDRIAN LOS FILTROS CON SE VA  A CARGAR EL GRID INICIALMENTE Y QUE DESPUÉS EL USUARIO PUEDE MODIFICAR
    requires: [
        'Ext.ux.grid.FiltersFeature'
    ],
    storeId: 'stGridContratos',
    initComponent: function () {
        var me = this;
        me.etiquetas = LangMgr.getLang(me);
        Ext.util.Format.decimalSeparator = ',';
        Ext.util.Format.thousandSeparator = '.';
        Ext.util.Format.currencyPrecision = 2;
        Ext.util.Format.currencySign = ' ';
        me.listeners={
            render: function(){
//                     console.log('render', me.filters, me.getComponent(0).filters)
                if (me.filters) 
                    me.filters.createFilters(); 
                if (me.getComponent(0) && me.getComponent(0).filters)
                    me.getComponent(0).filters.createFilters();
                if (me.getComponent(1) && me.getComponent(1).filters)
                    me.getComponent(1).filters.createFilters();
            }
        };
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
            Ext.create('SolicitudPago.view.MarcarFiltroPlugin', {  //CRM.plugins.ResaltarFiltroPlugin
//             {
                // xtype: 'marcarfiltroplugin',
                // extraParams: true,
                campos: [{
                    'itemId': 'searchfield',
                    'dataIndex': ['numerocontrato', 'numero', 'nombre'],
//                     'extraParams': 'filtrogeneral[0][field]'
                }]
            })
        ];

        var features=[];
        if(me.filtrosColumnas){
            features.push(
                {
                    ftype: 'filters',
                    menuFilterText: me.etiquetas.lbbusqueda,
                    local: false,
                    filters: [
                        {
                            dataIndex: 'numerocontrato',
                            type: 'string'
                        },
                        {
                            dataIndex: 'numero',
                            type: 'string'
                        },
                        {
                            dataIndex: 'clienteproveedor',
                            type: 'string'
                        },
                        {
                            dataIndex: 'nombrearea',
                            type: 'string'
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
                        {
                            dataIndex: 'sector',
                            type: 'list',
                            idField: 'idsector',
                            labelField: 'denominacion',
                            store: Ext.create('Ext.data.Store', {
                                autoLoad: false,
                                proxy: {
                                    extraParams: {
                                        columnlist: 'ns.denominacion, ns.idsector'
                                    },
                                    type: 'ajax',
                                    url: UtilsFn.buildUrl({action: 'filterliststore'}, ModuleMgr.get('GestionContrato'))
                                },
                                fields: [
                                    {name: 'denominacion', type: 'string'},
                                    {name: 'idsector', type: 'integer'},
                                ]
                            }),
                            listeners: {
                                serialize: me.onSerialize
                            }
                        },
                        {
                            dataIndex: 'montototal',
                            type: 'numeric'
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
                            dataIndex: 'fechafirma',
                            type: 'date',
                            beforeText: me.etiquetas.lbantes,
                            afterText: me.etiquetas.lbdespues,
                            onText: me.etiquetas.lbigual,
                            dateFormat: 'd/m/Y'
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
                            dataIndex: 'tipocontrato',
                            type: 'list',
                            idField: 'idtipocontrato',
                            labelField: 'denominaciontipocontrato',
                            store: Ext.create('Ext.data.Store', {
                                autoLoad: false,
                                proxy: {
                                    extraParams: {columnlist: 'denominaciontipocontrato,idtipocontrato'},
                                    type: 'ajax',
                                    url: UtilsFn.buildUrl({action: 'filterliststore'}, ModuleMgr.get('GestionContrato'))
                                },
                                fields: [
                                    {name: 'denominaciontipocontrato', type: 'string'},
                                    {name: 'idtipocontrato'}
                                ]
                            }),
                            listeners: {
                                serialize: me.onSerialize
                            }
                        },
                        {
                            dataIndex: 'estadoinicial',
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
                                serialize: me.onSerialize
                            }
                        },
                        {
                            dataIndex: 'vigente',
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
                        {
                            dataIndex: 'contratomarco',
                            type: 'boolean',
                            yesText: me.etiquetas.lbYes,
                            noText: me.etiquetas.lbNo
                        },
                        {
                            dataIndex: 'cliente',
                            type: 'list',
                            store: Ext.create('Ext.data.Store', {
                                fields: ['id', 'text'],
                                data: [
                                    {"text": me.etiquetas.lbContratoCliente, "id": 1},
                                    {"text": me.etiquetas.lbContratoProveedor, "id": 0},
                                    {"text": me.etiquetas.lbContratoImportacion, "id": 2},
                                ]
                            }),
                            listeners: {
                                serialize: me.onSerialize
                            }
                        }
                        // {
                        //     dataIndex: 'idarea',
                        //     type: 'list',
                        //     listeners: {
                        //         serialize: me.onSerialize
                        //     }
                        // }
                    ]
                }
            );
        }
        if(me.summaryColumnas) {
            features.push(
                {
                    ftype: 'summary',
                    dock: 'top'
                }
            );
        }

        me.features = features;
        me.store = Ext.create('GestionContrato.store.Contratos',{
            storeId: me.storeId,
            onlyOneLoad: true,
            listeners: {
                load: function(yo, records, success){
                    if(success){
                        if(!me.extrafields){
                            var fields = yo.model.getFields(),
                                jsondata = yo.proxy.reader.jsonData,
                                extrafields = me.extrafields = jsondata.monedasentidad,
                                columns = me.columns,
                                newfields = [],
                                newcolumns = [],
                                pos = -1;
                            Ext.each(columns, function (column, index) {
                                if (extrafields && extrafields.length != 0) {
                                    if (column.dataIndex == 'montototal') {
                                        pos = index;
                                    }
                                    newcolumns.push(column.initialConfig);
                                } else {
                                    newcolumns.push(column.initialConfig);
                                }
                            });
                            if (pos != -1) {
                                newcolumns = me.insertarColumnasMonedas(newcolumns, extrafields, pos);
                                me.reconfigure(null, newcolumns);
                            }
                        }
                    }
                }
            }
        });
        me.store.proxy.extraParams=me.formarFiltrosFijos(me.filtrosFijos);
        //me.store.load();
        me.columns = [

            {
                text: me.etiquetas.lbNumberContrato,
                dataIndex: 'numerocontrato',
                hidden: me.columnasVisibles.indexOf('numerocontrato')==-1,
                hideable: me.columnasOcultas.indexOf('numerocontrato')==-1,
                locked: me.lokedColumns,
                minWidth: 70,
                width: 110,
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                },
                summaryRenderer: function(value, summaryData, dataIndex) {
                    return (value !== 0?'<b>Totales:</b>':'');
                }
            },
            {
                text: me.etiquetas.lbNumber,
                dataIndex: 'numero',
                hidden: me.columnasVisibles.indexOf('numero')==-1,
                hideable: me.columnasOcultas.indexOf('numero')==-1,
                locked: me.lokedColumns,
                minWidth: 70,
                width: 110,
                // hidden: true,
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                },
            },
            {
                text: me.etiquetas.lbName,
                dataIndex: 'nombre',
                locked: me.lokedColumns,
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
                summaryRenderer: function(value) {
                    return Ext.String.format('{0} contrato{1}', value, value !== 1 ? 's' : '')+ ' de '+me.getStore().proxy.reader.jsonData.cant;
                }
            },
            {
                text: me.etiquetas.lbClientProv,
                sortable: true,
                minWidth: 100,
                flex: 0.1,
                dataIndex: 'clienteproveedor',
                hidden: me.columnasVisibles.indexOf('clienteproveedor')==-1,
                hideable: me.columnasOcultas.indexOf('clienteproveedor')==-1,
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
                text: me.etiquetas.lbArea,
                sortable: true,
                minWidth: 100,
                flex: 0.1,
                dataIndex: 'nombrearea',
                hidden: me.columnasVisibles.indexOf('nombrearea')==-1,
                hideable: me.columnasOcultas.indexOf('nombrearea')==-1,    
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
                text: 'Área creadora',
                sortable: true,
                minWidth: 100,
                flex: 0.1,
                dataIndex: 'nombreareacreado',
                hidden: me.columnasVisibles.indexOf('nombreareacreado')==-1,
                hideable: me.columnasOcultas.indexOf('nombreareacreado')==-1,
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
                text: me.etiquetas.lbSector,
                sortable: true,
                minWidth: 70,
                flex: 0.1,
                dataIndex: 'sector',
                hidden: me.columnasVisibles.indexOf('sector')==-1,
                hideable: me.columnasOcultas.indexOf('sector')==-1,
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                },
                // filter: {
                //     type: 'list',
                //     idField: 'idsector',
                //     labelField: 'denominacion',
                //     store: Ext.create('Ext.data.Store', {
                //         autoLoad: false,
                //         proxy: {
                //             extraParams: {
                //                 columnlist: 'ns.denominacion, ns.idsector'
                //             },
                //             type: 'ajax',
                //             url: UtilsFn.buildUrl({action: 'filterliststore'}, ModuleMgr.get('GestionContrato'))
                //         },
                //         fields: [
                //             {name: 'denominacion', type: 'string'},
                //             {name: 'idsector', type: 'integer'},
                //         ]
                //     }),
                //     listeners: {
                //         serialize: me.onSerialize
                //     }
                // }
            },
            {
                hidden: true,
                dataIndex: 'idclienteproveedor',
                hideable: false
            },
            {
                text: me.etiquetas.lbTotalAmount,
                sortable: true,
                align: 'right',
                minWidth: 62,
                width: 80,
                dataIndex: 'montototal',
                hidden: me.columnasVisibles.indexOf('montototal')==-1,
                hideable: me.columnasOcultas.indexOf('montototal')==-1,
                renderer: function (value, meta) {
                    value = value || 0;
                    if (!Ext.isEmpty(value)) {
                        value = Ext.util.Format.currency(value);
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                },
                // filter: {
                //     type: 'numeric'
                // },
                // summaryType: 'sum',
                summaryType: function(records, dataindex, b){
                    var total=0;
                    records.forEach(function(x){
                        if(x.get(dataindex))
                            total+=parseFloat(x.get(dataindex));
                    });
                    return total;
                }
            },
            {
                text: me.etiquetas.lbFechaRegistro,
                sortable: true,
                align: 'center',
                minWidth: 70,
                width: 85,
                dataIndex: 'fechainicio',
                hidden: me.columnasVisibles.indexOf('fechainicio')==-1,
                hideable: me.columnasOcultas.indexOf('fechainicio')==-1,
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
                hidden: me.columnasVisibles.indexOf('fechafirma')==-1,
                hideable: me.columnasOcultas.indexOf('fechafirma')==-1,
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                },
                // filter: {
                //     type: 'date',
                //     beforeText: me.etiquetas.lbantes,
                //     afterText: me.etiquetas.lbdespues,
                //     onText: me.etiquetas.lbigual,
                //     dateFormat: 'd/m/Y'
                // }
            },
            {
                text: me.etiquetas.lbFechaFin,
                sortable: true,
                align: 'center',
                minWidth: 70,
                width: 85,
                dataIndex: 'fechafin',
                hidden: me.columnasVisibles.indexOf('fechafin')==-1,
                hideable: me.columnasOcultas.indexOf('fechafin')==-1,
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
                hidden: me.columnasVisibles.indexOf('tipocontrato')==-1,
                hideable: me.columnasOcultas.indexOf('tipocontrato')==-1,
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                },
                // filter: {
                //     type: 'list',
                //     idField: 'idtipocontrato',
                //     labelField: 'denominaciontipocontrato',
                //     store: Ext.create('Ext.data.Store', {
                //         autoLoad: false,
                //         proxy: {
                //             extraParams: {columnlist: 'denominaciontipocontrato,idtipocontrato'},
                //             type: 'ajax',
                //             url: UtilsFn.buildUrl({action: 'filterliststore'}, ModuleMgr.get('GestionContrato'))
                //         },
                //         fields: [
                //             {name: 'denominaciontipocontrato', type: 'string'},
                //             {name: 'idtipocontrato'}
                //         ]
                //     }),
                //     listeners: {
                //         serialize: me.onSerialize
                //     }
                // }
            },
            {
                text: me.etiquetas.lbEstado,
                sortable: true,
                minWidth: 80,
                width: 80,
                dataIndex: 'estadoinicial',
                hidden: me.columnasVisibles.indexOf('estadoinicial')==-1,
                hideable: me.columnasOcultas.indexOf('estadoinicial')==-1,
                renderer: function (value, meta, record) {
                    meta.innerCls = "icondistra-" + meta.record.data.iconoestadoinicial;
                    meta.tdAttr = 'data-qtip="' + value + ' <br> <u>Fecha</u>: ' + record.data.fechaestado + '"';
                    return value;
                },
                // filter: {
                //     type: 'list',
                //     idField: 'idestado',
                //     labelField: 'nombre',
                //     store: Ext.create('Ext.data.Store', {
                //         autoLoad: false,
                //         proxy: {
                //             extraParams: {
                //                 columnlist: 'ne.nombre, ne.idestado'
                //             },
                //             type: 'ajax',
                //             url: UtilsFn.buildUrl({action: 'filterliststore'}, ModuleMgr.get('GestionContrato'))
                //         },
                //         fields: [
                //             {name: 'nombre', type: 'string'},
                //             {name: 'idestado', type: 'integer'},
                //         ]
                //     }),
                //     listeners: {
                //         serialize: me.onSerialize
                //     }
                // }
            },
            {
                text: me.etiquetas.lbVigente,
                tooltip: me.etiquetas.lbVigente,
                sortable: true,
                align: 'center',
                minWidth: 60,
                width: 60,
                dataIndex: 'vigente',
                hidden: me.columnasVisibles.indexOf('vigente')==-1,
                hideable: me.columnasOcultas.indexOf('vigente')==-1,
                renderer: function (value, meta, records) {
                    meta.innerCls = value=='1' ? "icondistra-true verde" : "icondistra-false rojo";
                    meta.tdAttr = 'data-qtip="' + (value=='1' ?
                        'Vigente <br>('+
                        (records.get('cumplimientoobligaciones')=='1'?me.etiquetas.lbCumplimiento:
                            records.get('diasrestantesvigencia')+' d&iacute;as restantes')+')' :
                        'Fuera de vigencia <br>('+
                        (records.get('fechafirma')?'Vencido':'No firmado')+')') + '"';
                },
                // filter: {
                //     type: 'list',
                //     store: Ext.create('Ext.data.Store', {
                //         fields: ['id', 'text'],
                //         data: [
                //             {"text": "Vigente", "id": 1},
                //             {"text": "Fuera de vigencia", "id": 2}]
                //     }),
                //     listeners: {
                //         serialize: me.onSerialize
                //     }
                //
                // },
                summaryType: function(records, dataindex, b){
                    if(records.length>0){
                        var vigentes=0, novigentes=0;
                        records.forEach(function(x){
                            x.get(dataindex)==1?vigentes++:novigentes++;
                        });
                        return  vigentes+' - '+ novigentes;
                    }
                    return '';
                },
                summaryRenderer: function(value, summaryData, dataIndex) {
                    var resultado='';
                    if(value!=''){
                        var aux=value.split(' - ');
                        summaryData.tdAttr = 'data-qtip="Vigentes: '+aux[0]+'<br>No vigentes: '+aux[1]+'"';
                        resultado='<span style="color: green">'+aux[0]+'</span> - <span style="color: red">'+aux[1]+'</span>';
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
                hidden: me.columnasVisibles.indexOf('contratomarco')==-1,
                hideable: me.columnasOcultas.indexOf('contratomarco')==-1,
                renderer: function (value, meta) {
                    meta.innerCls = value ? "icondistra-true verde" : "icondistra-false rojo";
                    meta.tdAttr = 'data-qtip="' + (value ? me.etiquetas.qtipContratoMarco : me.etiquetas.lbContrato) + '"';
                },
                // filter: {
                //     type: 'boolean',
                //     yesText: me.etiquetas.lbYes,
                //     noText: me.etiquetas.lbNo
                // }
            },
            {
                text: me.etiquetas.lbCliente,
                tooltip: me.etiquetas.lbCliente,
                sortable: true,
                align: 'center',
                minWidth: 55,
                width: 55,
                dataIndex: 'cliente',
                hidden: me.columnasVisibles.indexOf('cliente')==-1,
                hideable: me.columnasOcultas.indexOf('cliente')==-1,
                renderer: function (value, meta) {
                    var iconos=["icondistra-servicio", "icondistra-perfilusuario", "icondistra-importar"];
                    var nombres=[me.etiquetas.lbContratoProveedor, me.etiquetas.lbContratoCliente, me.etiquetas.lbContratoImportacion];
                    meta.innerCls = iconos[value] //value ? "icondistra-perfilusuario" : "icondistra-servicio";
                    meta.tdAttr = 'data-qtip="' + nombres[value] + '"';
                    // meta.tdAttr = 'data-qtip="' + (value ? me.etiquetas.lbContratoCliente : me.etiquetas.lbContratoProveedor) + '"';
                },
                // filter: {
                //     type: 'list',
                //     store: Ext.create('Ext.data.Store', {
                //         fields: ['id', 'text'],
                //         data: [
                //             {"text": me.etiquetas.lbContratoCliente, "id": 1},
                //             {"text": me.etiquetas.lbContratoProveedor, "id": 0},
                //             {"text": me.etiquetas.lbContratoImportacion, "id": 2},
                //         ]
                //     }),
                //     listeners: {
                //         serialize: me.onSerialize
                //     }
                // }
            },
            {
                text: 'IdArea',
                dataIndex: 'idarea',
                hideable: false,
                hidden: true
            }
        ];

        var itemsToolbar=[];
        if(me.topBar){
            if(me.extraButtons){
                itemsToolbar=itemsToolbar.concat(me.extraButtons);
                itemsToolbar.push('|');
            }
            if(me.defaultsToolbar)
                itemsToolbar=itemsToolbar.concat(me.defaultsItemsToolbar());
        }
        me.dockedItems = [
            {
                xtype: 'toolbar',
                dock: 'top',
                itemId: 'topBar',
                hidden: !me.topBar,
                items: itemsToolbar,
                // items:[
                //     {
                //         iconCls: 'detalles',
                //         itemId: 'detail',
                //         action: 'detail',
                //         selector: 'btnDetails',
                //         disabled: true,
                //         // hidden: true,
                //         text: me.etiquetas.lbBtnDetail,
                //         tooltip: me.etiquetas.qtipDetail,
                //         keyMap: {
                //             key: 'd',
                //             alt: true,
                //             ctrl: false,
                //             event: 'click'
                //         },
                //         listeners:{
                //             click: function(){
                //                 var record = me.getSelectionModel().getSelection()[0];
                //                 Ext.create('GestionContrato.view.DetailsWindow', {
                //                     suplemento: record.data.idcontrato != record.data.idpadre,
                //                 }).show(record);
                //             }
                //         }
                //     },
                //     '->',
                //     Ext.create('Ext.ux.SearchField', {
                //         itemId: 'searchfield',
                //         flex: 1,
                //         maxWidth: 250,
                //         minWidth: 150,
                //         searchTooltip: me.etiquetas.qtipSearch.get(me.etiquetas.lbContract.getSingular().get().toLowerCase()),
                //         emptyText: 'Introduzca el número ó nombre',
                //         listeners:{
                //             search: function(field){
                //                 // var filters=me.filters;
                //                 // if(!filters)
                //                 //     filters=me.getComponent(0).filters;
                //                 // filters.getFilter('numerocontrato').setActive(true);
                //                 // filters.getFilter('numerocontrato').setValue(field.getValue());
                //                 // me.getStore().proxy.extraParams = {
                //                 //     'filtrogeneral[100][field]': 'general',
                //                 //     'filtrogeneral[100][data][type]': 'string',
                //                 //     'filtrogeneral[100][data][value]': field.getValue(),
                //                 // };
                //                 me.getStore().proxy.extraParams['filter[100][field]']='general';
                //                 me.getStore().proxy.extraParams['filter[100][data][type]']='other';
                //                 me.getStore().proxy.extraParams['filter[100][data][value]']=field.getValue();
                //                 me.getStore().load();
                //             },
                //             clear: function(){
                //                 // var filters=me.filters;
                //                 // if(!filters)
                //                 //     filters=me.getComponent(0).filters;
                //                 // var numero = filters.getFilter('numero'),
                //                 //     numerocontrato = filters.getFilter('numerocontrato'),
                //                 //     nombre = filters.getFilter('nombre');
                //                 // numero.setValue();
                //                 // numerocontrato.setValue();
                //                 // nombre.setValue();
                //                 // numero.setActive(false);
                //                 // numerocontrato.setActive(false);
                //                 // nombre.setActive(false);
                //                 me.getStore().proxy.extraParams['filter[100][field]']=undefined;
                //                 me.getStore().proxy.extraParams['filter[100][data][type]']=null;
                //                 me.getStore().proxy.extraParams['filter[100][data][value]']=undefined;
                //                 me.getStore().load();
                //             }
                //         },
                //         keyMap: [
                //             {
                //                 key: 'l',
                //                 alt: true,
                //                 ctrl: false,
                //                 event: 'onclick1'
                //             },
                //             {
                //                 key: 'b',
                //                 alt: true,
                //                 ctrl: false,
                //                 event: 'onclick2'
                //             }
                //         ]
                //     })
                // ]
            },
            {
                xtype: 'pagingtoolbar',
                store: me.store,
                dock: 'bottom',
                itemId:'bottomBar',
                pageNumb: true,
                displayInfo: true,
                comboEntradas:8,
                hidden: !me.bottomBar,
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
        ];

        me.callParent();
        me.on('render', function(){
            if(me.filtrosIniciales){
                var filters=me.filters;
                if(!filters)
                    filters=me.getComponent(0).filters;
                Ext.Object.each(me.filtrosIniciales, function(key, value){
                    if(filters.getFilter(key)){
                        filters.getFilter(key).init();
                        filters.getFilter(key).setActive(true);
                        filters.getFilter(key).setValue(value['value']);
                    }
                })
            }
            if(me.functionBeforeLoad && Ext.isFunction(me.functionBeforeLoad))
                me.store.on('beforeload', me.functionBeforeLoad);
            me.store.load();
        })
        me.selModel.on('selectionchange',  function(yo, records){
            console.log('selectionchange', me.down('#detail'))
            if(me.down('#detail'))
                me.down('#detail').setDisabled(records.length!=1);
        });
    },
    formarFiltrosFijos: function(filtros){
        var me=this, cont=50, resultado={}, nombres=[];
        Ext.Object.each(filtros, function(key, value){
            if(value){
                resultado['filter['+cont+'][field]']=key;
                if(Ext.isObject(value)){
                    resultado['filter['+cont+'][data][value]']=value['value'];
                    resultado['filter['+cont+'][data][type]']=value['type'];
                    if(value['comparison'])
                        resultado['filter['+cont+'][data][comparison]']=value['comparison'];
                }else{
                    resultado['filter['+cont+'][data][value]']=value;
                    resultado['filter['+cont+'][data][type]']='string';
                }
                cont++;
                nombres.push(key);
            }
        })
        me.columnasOcultas=nombres;
        return resultado;
    },
    insertarColumnasMonedas: function (newcolumns, extrafields, pos) {
        Ext.each(extrafields, function (field) {
            newcolumns.splice(pos, 0, {
                dataIndex: 'montomoneda_' + field.codigoiso.toLowerCase()+'_'+field.idmoneda,
                // dataIndex: 'montomoneda_' + field.codigoiso.toLowerCase(),
                text: field.codigoiso.toUpperCase(),
                width: 80,
                align: 'right',
                filter: {
                    type: 'numeric'
                },
                renderer: function (value, meta) {
                    if (Ext.isEmpty(value)) {
                        value = 0;
                    }
                    value = Ext.util.Format.currency(value);
                    meta.tdAttr = 'data-qtip="' + value + '"';

                    return value;
                },
                summaryType: function(records, dataindex, b){
                    var total=0;
                    records.forEach(function(x){
                        if(x.get(dataindex))
                            total+=parseFloat(x.get(dataindex));
                    });
                    return total;
                }
            });
            pos++;
        });
        return newcolumns;
    },
    onSerialize: function (data, filter, eOpts) {
        data['value'] = Ext.encode(data['value']);
    },
    defaultsItemsToolbar: function(){
        var me=this;
        return [
            {
                iconCls: 'detalles',
                itemId: 'detail',
                action: 'detail',
                selector: 'btnDetails',
                disabled: true,
                // hidden: true,
                text: me.etiquetas.lbBtnDetail,
                tooltip: me.etiquetas.qtipDetail,
                keyMap: {
                    key: 'd',
                    alt: true,
                    ctrl: false,
                    event: 'click'
                },
                listeners:{
                    click: function(){
                        var record = me.getSelectionModel().getSelection()[0];
                        Ext.create('GestionContrato.view.DetailsWindow', {
                            suplemento: record.data.idcontrato != record.data.idpadre,
                        }).show(record);
                    }
                }
            },
            '->',
            Ext.create('Ext.ux.SearchField', {
                itemId: 'searchfield',
                flex: 1,
                maxWidth: 250,
                minWidth: 150,
                searchTooltip: me.etiquetas.qtipSearch.get(me.etiquetas.lbContract.getSingular().get().toLowerCase()),
                emptyText: 'Introduzca el número ó nombre',
                listeners:{
                    search: function(field){
                        // var filters=me.filters;
                        // if(!filters)
                        //     filters=me.getComponent(0).filters;
                        // filters.getFilter('numerocontrato').setActive(true);
                        // filters.getFilter('numerocontrato').setValue(field.getValue());
                        // me.getStore().proxy.extraParams = {
                        //     'filtrogeneral[100][field]': 'general',
                        //     'filtrogeneral[100][data][type]': 'string',
                        //     'filtrogeneral[100][data][value]': field.getValue(),
                        // };
                        with(me.getStore()){
                            proxy.extraParams['filter[100][field]']='general';
                            proxy.extraParams['filter[100][data][type]']='other';
                            proxy.extraParams['filter[100][data][value]']=field.getValue();
                            load();
                        }

                    },
                    clear: function(){
                        // var filters=me.filters;
                        // if(!filters)
                        //     filters=me.getComponent(0).filters;
                        // var numero = filters.getFilter('numero'),
                        //     numerocontrato = filters.getFilter('numerocontrato'),
                        //     nombre = filters.getFilter('nombre');
                        // numero.setValue();
                        // numerocontrato.setValue();
                        // nombre.setValue();
                        // numero.setActive(false);
                        // numerocontrato.setActive(false);
                        // nombre.setActive(false);
                        // me.getStore().proxy.extraParams['filter[100][field]']=undefined;
                        // me.getStore().proxy.extraParams['filter[100][data][type]']=null;
                        // me.getStore().proxy.extraParams['filter[100][data][value]']=undefined;
                        with(me.getStore()) {
                            delete proxy.extraParams['filter[100][field]'];
                            delete proxy.extraParams['filter[100][data][type]'];
                            delete proxy.extraParams['filter[100][data][value]'];
                            load();
                        }
                    }
                },
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
            })
        ];
    }

});