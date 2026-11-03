Ext.define('DesgloseContrato.view.GridHitos', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.dc_gridhito',
    selType: 'checkboxmodel',
    autoScroll: true,
    initComponent: function () {
        var me = this;
        me.etiquetas = LangMgr.getLang(me);
        // me.selModel = {mode: 'SINGLE'};
        me.frame = false;
        me.border = false;
        me.title = me.etiquetas.lbTitleHito;
        me.viewConfig = {
            stripeRows: false,
            getRowClass: function (record, rowIndex, rowParams, store) {
                if (!record.get('tieneareasimplicadas'))
                    return 'incorrecto';
					else
					
                return 'esindicador';
            }
        };
        me.features=[
            {
                ftype: 'filters',
                menuFilterText: me.etiquetas.lbbusqueda,
                local: false,
            }
        ];
        me.store = Ext.create('Ext.data.Store', {
            storeId: 'dc_stHito',
            remoteFilter: true,
            onlyOneLoad: true,
            // remoteSort: true,
            sorters:[{property: 'numero', direction: 'ASC'}],
            // remoteGroup: true,
            fields: [],
            // groupField: 'fechafin',
            proxy: {
                type: 'ajax',
                url: UtilsFn.buildUrl({action: 'cargarHitos'}, ModuleMgr.get('DesgloseContrato')),
                reader: {
                    root: 'data',
                    totalProperty: 'cant',
                    successProperty: 'success'
                },
                extraParams:{
                    idcontratos: null
                }
            },
        });

        me.columns = [
            {
                text: me.etiquetas.lbNumber,
                tooltip: me.etiquetas.lbNumber,
                minWidth: 40,
                width: 50,
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
                tooltip: me.etiquetas.lbDescripcion,
                minWidth: 100,
                flex: 1,
                dataIndex: 'descripcion',
                groupable: false,
                filter: {
                    type: 'string'
                },
               renderer: function (value, meta, records) {
                    if (value) {
                        // icono=null;   deshabilitar  desbloquear verde rojo
                        var qtip=value;
                        qtip=qtip.replace(/\"/g, '');
                        if(records.get('idusuariocertifico')!=null){
                            if(records.get('idusuariocertifico')==window.parent.UCID.portal.perfil.idusuario){
                                meta.innerCls = "icondistra-habilitar verde";
                            }else if(records.get('idusuariocertifico')!=window.parent.UCID.portal.perfil.idusuario){
                                meta.innerCls = "icondistra-deshabilitar rojo";
                            }
                            qtip+='<br><u>Certificado por:</u> '+records.get('usuariocertifico')+'<br><u>Fecha:</u> '+records.get('fechacertifico');
                        }
                        // meta.innerCls = "icondistra-" + meta.record.data.iconoestadoinicial;
                        meta.tdAttr = 'data-qtip="' + qtip + '"';
                    }
                    return value;
                }
            }, {
                text: me.etiquetas.lbNumberContrato,
                tooltip: me.etiquetas.lbNumberContrato,
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
                // hidden: true,
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                }
            },
            {
                text: me.etiquetas.lbFechaEstimada,
                tooltip: me.etiquetas.lbFechaEstimada,
                align: 'center',
                minWidth:60,
                width: 80,
                dataIndex: 'fechaestimada',
                //hidden: true,
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
            },
            {
                text: me.etiquetas.lbFechaReplanificada,
                tooltip: me.etiquetas.lbFechaReplanificada,
                align: 'center',
                minWidth:60,
                width: 80,
                dataIndex: 'fechareplanificada',
                hidden: true,
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
            },
            {
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
            }, {
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
                    meta.tdAttr = 'data-qtip="' + nombre + ' <br> <b>Fecha</b>: ' + record.data.fechainicio + '"';
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
            }
        ];

        me.btnDetails = Ext.create('Ext.Button', {
            iconCls: 'detalles',
            action: 'hitodetail',
            selector: 'btnDCDetailsHito',
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

        me.btnVerTrazas = Ext.create('Ext.Button', {
            iconCls: 'traza',
            action: 'traza',
            selector: 'btnDCVerTrazas',
            hidden: true,
            disabled: true,
            text: me.etiquetas.lbBtnVerTrazas,
            tooltip: me.etiquetas.qtipVerTrazas,
            keyMap: {
                key: 'u',
                alt: true,
                ctrl: false,
                event: 'click'
            }
        });

        this.btnHelp = Ext.create('Ext.Button', {
            iconCls: 'ayuda',
            action: 'help',
            text: this.etiquetas.lbBtnhelp,
            refhelp: '',
            tooltip: this.etiquetas.qtipHelp
        });

        me.btnGestionarAreasImplicadas = Ext.create('Ext.Button', {
            iconCls: 'gestionardesglose',
            action: 'gestionarareasimplicadas',
            selector: 'btnDCGestionarAreasImplicadas',
            hidden: true,
            disabled: true,
            text: me.etiquetas.lbGestionarAreasImplicadas,
            tooltip: me.etiquetas.qtipGestionarAreasImplicadas,
            keyMap: {
                key: 'i',
                alt: true,
                ctrl: false,
                event: 'click'
            }
        });
		
        me.btnCertificar = Ext.create('Ext.Button', {
            iconCls: 'deshabilitar',  //deshabilitar  desbloquear
            action: 'certificardesglose',
            selector: 'btnCertificarDesglose',
            hidden: true,
            disabled: true,
            text: me.etiquetas.lbCertificar,
            tooltip: me.etiquetas.qtipCertificar,
            keyMap: {
                key: 'c',
                alt: true,
                ctrl: false,
                event: 'click'
            }
        });

        me.btnHeredar = Ext.create('Ext.Button', {
            iconCls: 'deshabilitar',  //deshabilitar  desbloquear
            action: 'heredardesglose',
            selector: 'btnHeredarDesglose',
            hidden: true,
            disabled: true,
            text: 'Heredar',
            tooltip: 'Heredar desglose',
            keyMap: {
                key: 'c',
                alt: true,
                ctrl: false,
                event: 'click'
            }
        });

     var fechainicio = Ext.create('Ext.ux.FechaTrigger', {
            labelAlign: 'top',
            // fieldLabel: me.etiquetas.lbFechaInicio,
            name: 'fechainicio',
            itemId: 'fechainicio',
            // width: 100,
            // flex: 1,
            margin: '0 5 0 0',
            emptyText: 'Fecha de inicio',
            endDateField: 'fechafin',
            listeners:{
                change: function(){
                    me.checkFechasInicioFin();
                }
            }
        });
        
        var fechafin = Ext.create('Ext.ux.FechaTrigger', {
            labelAlign: 'top',
            // fieldLabel: me.etiquetas.lbFechaFin,
            name: 'fechafin',
            itemId: 'fechafin',
            // width: 100,
            // flex: 1,
            margin: '0 5 0 0',
            emptyText: 'Fecha de fin',
            startDateField: 'fechainicio',
            listeners:{
                change: function(){
                    me.checkFechasInicioFin();
                }
            }
        });
        
        
        var buttonFiltrar=Ext.create('Ext.button.Button',{
            iconCls: 'buscar',
            tooltip: 'Buscar por fechas',
            itemId: 'buscarfechas',
            disabled: true,
            action: 'filtrarfechas',
        })

        var buttonLimpiarFiltros=Ext.create('Ext.button.Button',{
            iconCls: 'limpiar',
            tooltip: 'Limpiar filtro fechas',
            itemId: 'limpiarfechas',
            disabled: true,
            action: 'limpiarfechas',
        })
		
		this.leyenda = Ext.create('Ext.form.FieldSet', {
                title: 'Leyenda',
               // itemId: 'leyenda',
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },

                defaults:{
                    // margin: '1 0',
                    height: 10
                },
                margin: '0 10 0 0',
				items: [
                    {
                        xtype: 'button',
                        readOnly: true,
                        style: {
                            background: '#008f39',
                        },
                        tooltip: "Hitos con desglose",
                        fieldStyle: 'background-color:#008f39;background-image:none',
                        width: 20
                        //; data-qtip="Color cuando el valor del campo representa mas del 75% del total de productos"
                    },
                    {
                        xtype: 'button',
                        readOnly: true,
                        style: {
                            background: '#ff0000', //8b8021
                        },
                        tooltip: "Hitos sin desglose",
                        fieldStyle: 'background-color:#ff0000;background-image:none',
                        width: 20,
                        //data-qtip="Color cuando el valor del campo se encuentra entre el 25% y el 75% del total de productos"
                    }
                ]
        });
		
		

        me.tbar = Ext.create('Ext.toolbar.Toolbar', {
            enableOverflow: true,
            items: [me.btnDetails, this.btnVerTrazas,
                this.btnGestionarAreasImplicadas,
                me.btnCertificar, me.btnHeredar,
                Ext.create('Ext.ux.RangoFechasFilter',{parametroFiltro: 'fechafin'}),
                '->', this.btnHelp]
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
    },
    checkFechasInicioFin: function(){
        var me=this;
        me.down('#buscarfechas').setDisabled(
            !(me.down('#fechainicio').getValue() || me.down('#fechafin').getValue()));
    }
});
