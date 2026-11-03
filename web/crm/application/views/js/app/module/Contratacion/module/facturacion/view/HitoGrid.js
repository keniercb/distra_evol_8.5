Ext.define('Facturacion.view.HitoGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.fac_hitogrid',
    selType: 'checkboxmodel',
    autoScroll: true,
    initComponent: function () {
        var me = this;
        me.etiquetas = LangMgr.getLang(me);
        me.selModel = {mode: 'MULTI'};
        me.frame = false;
        me.border = false;
        me.title = me.etiquetas.lbTitleHito;
        me.features = [
           
            /*{
                ftype: 'grouping',
                groupByText: 'Agrupar por esta columna',
                // collapsible:false,
                groupHeaderTpl: ['{columnName}: {name:this.format}', {
                    format: function (name) {
                        if (typeof name == 'object') {
                            return Ext.Date.format(name, 'd/m/Y');
                        }
                        return name;
                    }
                }]
            },*/
            {
                ftype: 'filters',
                menuFilterText: me.etiquetas.lbbusqueda,
                local: false,
                filters: [
                    {
                        dataIndex: 'numero',
                        type: 'numeric'
                    }
                ]
            }
        ];
        me.store = Ext.create('Ext.data.Store', {
            storeId: 'fac_stHito',
            onlyOneLoad: true,
            remoteFilter: true,
            remoteSort: true,
            remoteGroup: true,
            fields: [],
            groupField: 'fechafin',
            proxy: {
                type: 'ajax',
                url: UtilsFn.buildUrl({action: 'cargarHitos'}, ModuleMgr.get('Facturacion')),
                reader: {
                    root: 'data',
                    totalProperty: 'cant',
                    successProperty: 'success'
                },
                // extraParams:{
                //     idcontratos: '[-1]'
                // }
            }
        });

        me.columns = [
            {
                text: me.etiquetas.lbNumber,
                minWidth: 40,
                width: 40,
                dataIndex: 'numero',
                hidden: false,
                groupable: false,
                filter: {
                    type: 'numeric'
                },
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                }
            }, {
                text: me.etiquetas.lbDescripcion,
                minWidth: 100,
                flex: 1,
                dataIndex: 'descripcion',
                groupable: false,
                filter: {
                    type: 'string'
                },
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                }
            }, {
                text: me.etiquetas.lbNumberContrato,
                minWidth: 35,
                flex: 1,
                dataIndex: 'numerocontrato',
                hidden: true,
                filter: {
                    type: 'string'
                },
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                }
            }, {
                text: me.etiquetas.lbFechaEstimada,
                tooltip: me.etiquetas.lbFechaFin,
                align: 'center',
                minWidth:60,
                width: 80,
                dataIndex: 'fechaestimada',
                //xtype: 'datecolumn',
                filter: {
                    type: 'date'
                },
                renderer: function (value, meta) {
                    if (value) {
                        value = Ext.Date.format(value, 'd/m/Y');
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                }
            },{
                text: me.etiquetas.lbFechaReplanificada,
                tooltip: me.etiquetas.lbFechaFin,
                align: 'center',
                minWidth:60,
                width: 80,
                dataIndex: 'fechareplanificada',
                //xtype: 'datecolumn',
                filter: {
                    type: 'date'
                },
                renderer: function (value, meta) {
                    if (value) {
                        value = Ext.Date.format(value, 'd/m/Y');
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                }
            },{
                text: me.etiquetas.lbFechaFin,
                tooltip: me.etiquetas.lbFechaFin,
                align: 'center',
                minWidth:60,
                width: 80,
                dataIndex: 'fechafin',
                xtype: 'datecolumn',
                filter: {
                    type: 'date'
                },
                hidden: true,
                renderer: function (value, meta) {
                    if (value) {
                        value = Ext.Date.format(value, 'd/m/Y');
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                }
            },
            {
                text: me.etiquetas.lbArea,
                tooltip: me.etiquetas.lbArea,
                minWidth:60,
                width: 100,
                dataIndex: 'nombrearea',
                filter: {
                    type: 'string'
                },
                hidden: false,
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                }
            },
            {
                text: me.etiquetas.lbTotalAmount,
                tooltip: me.etiquetas.lbTotalAmount,
                align: 'right',
                minWidth:60,
                width: 80,
                dataIndex: 'montototal',
                groupable: false,
                filter: {
                    type: 'numeric'
                },
                renderer: function (value, meta) {
                    if (value) {
                        value = Ext.util.Format.currency(value);
                        meta.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                    return value;
                }
            },
            {
                text: me.etiquetas.lbEstado,
                tooltip: me.etiquetas.lbEstado,
                minWidth:80,
                width: 100,
                dataIndex: 'idestado',
                groupable: false,
                renderer: function (value, meta, record) {
                    var icono = record.data.iconoestado,
                        nombre = record.data.nombreestado;
                    meta.innerCls = "icondistra-" + icono;
                    meta.tdAttr = 'data-qtip="' + nombre + ' <br> <b>Fecha</b>: '+record.data.fechainicio+'"';
                    return nombre;
                },
                filter: {
                    type: 'list',
                    idField: 'idestado',
                    labelField: 'nombre',
                    store: Ext.create('Ext.data.Store', {
                        autoLoad: false,
                        proxy: {
                            type: 'ajax',
                            url: UtilsFn.buildUrl({action: 'cargarEstados'}, ModuleMgr.get('Facturacion'))
                        },
                        fields: [
                            {name: 'nombre', type: 'string'},
                            {name: 'idestado', type: 'integer'}
                        ]
                    }),
                    listeners: {
                        serialize: me.onSerialize
                    }
                }
            },
            {
                text: 'Doc',
                width: 40,
                align: 'center',
                hidden: true,
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
        ];

        me.btnDetails = Ext.create('Ext.Button', {
            iconCls: 'detalles',
            action: 'hitodetail',
            selector: 'btnDetailsHito',
            hidden: true,
            disabled: true,
            text: me.etiquetas.lbBtnDetail,
            tooltip: me.etiquetas.qtipDetail,
            keyMap: {
                ctrl: true,
                key: 'd',
                alt: true,
                event: 'click'
            }
        });

        me.btnEdit = Ext.create('Ext.Button', {
            iconCls: 'modificar',
            action: 'edit',
            selector: 'btnEditDate',
            hidden: true,
            disabled: true,
            text: me.etiquetas.lbBtnEditDate,
            tooltip: me.etiquetas.qtipEditDate,
            keyMap: {
                key: 'm',
                alt: true,
                event: 'click'
            }
        });

        this.btnVerTrazas = Ext.create('Ext.menu.Item', {
            iconCls: 'traza',
            action: 'traza',
            selector: 'btnVerTrazas',
            // hidden: true,
            disabled: true,
            text: me.etiquetas.lbBtnVerTrazas,
            tooltip: me.etiquetas.qtipVerTrazas,
            keyMap: {
                key: 'u',
                alt: true,
                event: 'click'
            }
        });

        this.btnChangeState = Ext.create('Ext.Button', {
            iconCls: 'modificar',
            selector: 'btnChangeState',
            hidden: true,
            disabled: true,
            text: this.etiquetas.lbChangeState,
            tooltip: this.etiquetas.lbChangeState,
            menu: new Ext.menu.Menu()
        });

        this.btnActaAceptacion = Ext.create('Ext.Button', {
            iconCls: 'imprimir',
            action:'generaractaaceptacion',
            selector: 'generarActaAceptacion',
            hidden: true,
            // disabled: true,
            text: this.etiquetas.lbActaAceptacion,
            tooltip: this.etiquetas.lbGenerarActaAceptacion,
        });

        this.btnGenerar = Ext.create('Ext.menu.Item', {
            iconCls: 'imprimir',
            selector: 'btnGenerarHito',
            hidden: true,
            disabled: true,
            text: this.etiquetas.lbGenerar,
            tooltip: this.etiquetas.lbGenerar,
            menu:  Ext.create('Ext.menu.Menu', {
                plain: true,
                items: this.btnActaAceptacion
            })
        });

        this.btnAreaResponsable = Ext.create('Ext.Button', {
            iconCls: 'modificar',
            selector: 'btnModificarAreaResponsable',
            action: 'modificararearesponsable',
            hidden: true,
            disabled: true,
            text: this.etiquetas.lbModificarAreaResponsable,
            tooltip: this.etiquetas.qtipModificarAreaResponsable,
        });

        this.btnLimpiarEspacioTrabajo= Ext.create('Ext.menu.Item', {
            iconCls: 'limpiar',
            selector: 'btnLimpiarEspacioTrabajo',
            action: 'limpiarespaciotrabajo',
            hidden: true,
            disabled: true,
            text: 'Limpiar espacio',
            tooltip: 'Limpiar espacio de trabajo',
        });

        this.btnModificarDocumentos = Ext.create('Ext.menu.Item', {
            iconCls: 'modificar',
            selector: 'btnModificarDocumentos',
            action: 'modificarardocumentos',
            hidden: true,
            disabled: true,
            text: this.etiquetas.lbModificarDocumentos,
            tooltip: this.etiquetas.qtipModificarDocumentos,
        });

        this.btnHelp = Ext.create('Ext.Button', {
            iconCls: 'ayuda',
            action: 'help',
            text: this.etiquetas.lbBtnhelp,
            refhelp: '',
            tooltip: this.etiquetas.qtipHelp
        });

        this.btnAcciones = Ext.create('Ext.Button', {
            iconCls: 'contraer',
            text: me.etiquetas.lbMasAcciones,
            tooltip: me.etiquetas.lbMasAcciones,
            selector: 'btnAcciones',
            hidden: true,
            menu: [
                this.btnVerTrazas, this.btnModificarDocumentos, this.btnGenerar, this.btnLimpiarEspacioTrabajo
            ]
        });
        me.tbar = Ext.create('Ext.toolbar.Toolbar', {
            enableOverflow: true,
            items: [me.btnDetails, me.btnEdit, this.btnChangeState,this.btnAreaResponsable,this.btnAcciones, '->', this.btnHelp]
        });

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

        me.callParent();
    },
    findState: function (idestado) {
        var estados = this.getStore().proxy.reader.jsonData.estados;
        return estados[idestado];
    },
    onSerialize: function (data, filter, eOpts) {
        data['value'] = Ext.encode(data['value']);
    }
});
