Ext.define('RecuperacionDesglose.view.MainRecuperacionDesglose', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.mainrecuperaciondesglose',
    initComponent: function () {
        var me = this;

        me.etiquetas = LangMgr.getLang(me);
        me.viewConfig = {
            stripeRows: false,
            getRowClass: function (record, rowIndex, rowParams, store) {
                if(record.get('cantareas')==0){
                    return 'intermedio'
                }else{
                    if(record.get('montototal')==record.get('montodesglose') &&
                        record.get('montototal')==record.get('montoindicador') &&
                        record.get('montototal')==record.get('montofactura')){return 'correcto'}
                    if(record.get('montototal')!=record.get('montodesglose')){return 'incorrecto'}
					if(record.get('montototal')!=record.get('montoindicador')){return 'incorrecto'}
					if(record.get('montototal')!=record.get('montofactura')){return 'incorrecto'}
                }
                return '';
            }
        };

        me.features = [
            {
                ftype: 'filters',
                menuFilterText: me.etiquetas.lbbusqueda,
                local: false,
                filters: [
                    {
                        dataIndex: 'cantfacturas',
                        type: 'int'
                    }
                ]
            },
            {
                ftype: 'grouping',
                groupByText: 'Agrupar por esta columna',
                enableNoGroups: false,
                // collapsible:false,
                groupHeaderTpl: ['Contrato: {children:this.format},  Estado: {children:this.formatEstado},  Área: {children:this.formatArea}', {
                    format: function (children) {
                        return children[0].data.numerocontrato;
                    },
                    formatArea: function (children) {
                        return children[0].data.nombreareacontrato;
                    },
                    formatEstado: function (children) {
                        return children[0].data.nombreestadocontrato;
                    }
                }]
            }
        ];

        me.store=Ext.create('RecuperacionDesglose.store.MainStore');
        var hoy=new Date(),
            inicioMes=new Date(hoy.getFullYear(), hoy.getMonth(), 1),
            finMes=new Date(hoy.getFullYear(), hoy.getMonth()+1, 0);
        with(me.store.proxy){
            extraParams['filter[50][field]']='fechafin';
            extraParams['filter[50][data][type]']='date';
            extraParams['filter[50][data][comparison]']='gt';
            extraParams['filter[50][data][value]']=inicioMes;
            extraParams['filter[51][field]']='fechafin';
            extraParams['filter[51][data][type]']='date';
            extraParams['filter[51][data][comparison]']='lt';
            extraParams['filter[51][data][value]']=finMes;
        }
        me.store.load();

        me.columns=[
            {text: 'Hitos', flex:1, columns:[
                {text: 'No', dataIndex: 'numero', width: 30, groupable: false},
                {text: 'Descripción', dataIndex: 'descripcion', minWidth: 170, groupable: false,
                    renderer: function (value, meta) {
                        if (value)meta.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }},
                {text: 'Área', dataIndex: 'nombrearea', width: 130, groupable: false,
                    renderer: function (value, meta) {
                        if (value)meta.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }},
                {text: 'Fecha estimada', tooltip: 'Fecha estimada', dataIndex: 'fechaestimada', width: 90, groupable: false,
                    renderer: function (value, meta) {
                        if (value)meta.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }},
                {text: 'Fecha replanificada', tooltip: 'Fecha replanificada', dataIndex: 'fechareplanificada', width: 100, groupable: false,
                    renderer: function (value, meta) {
                        if (value)meta.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }},
                {text: 'Estado', dataIndex: 'nombreestado', width: 90, groupable: false,
                    renderer: function (value, meta, record) {
                        var icono = record.data.iconoestado,
                            nombre = record.data.nombreestado;
                        meta.innerCls = "icondistra-" + icono;
                        meta.tdAttr = 'data-qtip="' + nombre + ' <br> <b>Fecha</b>: ' + record.data.fechainicio + '"';
                        return nombre;
                    },},
                {text: 'Monto total', dataIndex: 'montototal', width: 90, align: 'right', groupable: false,
                    renderer: function (value, meta) {
                        if (value)
                            meta.tdAttr = 'data-qtip="' + Ext.util.Format.number(value, '0.000,00/i') + '"';
                        return '<b>'+Ext.util.Format.number(value, '0.000,00/i')+'</b>';
                    }},
					{text: 'Monto Indicadores', dataIndex: 'montoindicador', width: 90, align: 'right', groupable: false,
                    renderer: function (value, meta, record) {
					    var dif=record.get('montototal')!=value;//+(dif?'(Valor diferente)':'')+
                        if (value || dif)
                            meta.tdAttr = 'data-qtip="' + Ext.util.Format.number(value, '0.000,00/i') +(dif?'<br>(Valor diferente)':'')+ '"';
                        // return Ext.util.Format.number(value, '0.000,00/i');
                        return (dif?'<u>':'')+Ext.util.Format.number(value, '0.000,00/i')+(dif?'</u>':'');
                    }},
                ]},
            {text: 'Desgloses', flex:1, columns:
                [
                    {text: 'Monto total', dataIndex: 'montodesglose', width: 90, align: 'right', groupable: false,
                        renderer: function (value, meta, record) {
                            var dif=record.get('montototal')!=value;
                            if (value || dif)
                                meta.tdAttr = 'data-qtip="' + Ext.util.Format.number(value, '0.000,00/i') +(dif?'<br>(Valor diferente)':'')+ '"';
                            // return Ext.util.Format.number(value, '0.000,00/i');
                            return (dif?'<u>':'')+Ext.util.Format.number(value, '0.000,00/i')+(dif?'</u>':'');
                        }
                    },
                    {text: 'Áreas', tooltip: 'Cantidad de áreas implicadas', dataIndex: 'cantareas', width: 50, align: 'right',groupable: false}
                ]
            },
            {
                text: 'Monto factura', dataIndex: 'montofactura', width: 90, align: 'right', groupable: false,
                renderer: function (value, meta, record) {
                    var dif=record.get('montototal')!=value;
                    if (value || dif)
                        meta.tdAttr = 'data-qtip="' + Ext.util.Format.number(value, '0.000,00/i') +(dif?'<br>(Valor diferente)':'')+ '"';
                    // return Ext.util.Format.number(value, '0.000,00/i');
                    return (dif?'<u>':'')+Ext.util.Format.number(value, '0.000,00/i')+(dif?'</u>':'');
                }
            },
            {
                text: 'Cant fact', dataIndex: 'cantfacturas', width: 50,
            }
        ];

        me.dockedItems = [
            {
                xtype: 'toolbar',
                dock: 'top',
                overflowX:'auto',
                items:[
                    Ext.create('Ext.ux.RangoFechasFilter',{
                        buttonLimpiar: false,
                        buttonLimpiarCampos: false,
                        initialValue: 'mesActual',
                        parametroFiltro: 'fechafin',
                        grid: me
                    }),
                    '->',
                    Ext.create('Ext.button.Split',{
                        text: 'Mostrar',
                        // text: 'Mostrar <i style="background-color:green> </i> <span style="background-color:red> </i> <span style="background-color:orange> </span>',
                        tooltip: 'Mostrando:<br/>-Correctos<br/>-Incorrectos<br/>-Sin desglose',
                        iconCls: 'buscar',
                        action: 'mostrartipos',
                        menu:[
                            {
                                xtype: 'menucheckitem',
                                text: '<b style="color:green">Correctos</b>',
                                nombre: 'Correctos',
                                itemId: 'correctos',
                                checked: true
                            },
                            {
                                xtype: 'menucheckitem',
                                text: '<b style="color:red">Incorrectos</b>',
                                nombre: 'Incorrectos',
                                itemId: 'incorrectos',
                                checked: true
                            },
                            {
                                xtype: 'menucheckitem',
                                text: '<b style="color:#ff5d09">Sin desglose</b>',
                                nombre: 'Sin desglose',
                                itemId: 'sindesglose',
                                checked: true
                            },
                            // {
                            //     xtype: 'menucheckitem',
                            //     text: '<b style="color:#ff5d09">Diferencia Indicador</b>',
                            //     nombre: 'Sin Indicador',
                            //     itemId: 'indicador',
                            //     checked: true
                            // }
                        ]
                    }),
                    Ext.create('Ext.button.Button',{
                        text: 'Filtros',
                        tooltip: 'Filtros',
                        iconCls: 'buscar',
                        enableToggle: true,
                        itemId: 'mostrarfiltros',
                        action: 'mostrarfiltros',
                        handler: function(yo){
                            me.down('#toolbarfiltros').setVisible(yo.pressed);
                        }
                    }),
                    Ext.create('Ext.button.Button',{
                        // split: true,
                        text: 'Acciones',
                        itemId: 'buttonacciones',
                        iconCls: 'contraer',
                        menu:[
                            {
                                text: 'Ver hito',
                                tooltip: 'Ver detalles del hito seleccionado',
                                itemId: 'detalleshito',
                                action: 'detalleshito',
                                iconCls: 'detalles',
                                disabled: true,
                            },
                            {
                                text: 'Ver contrato',
                                tooltip: 'Ver detalles del contrato del hito seleccionado',
                                itemId: 'detallescontrato',
                                action: 'detallescontrato',
                                iconCls: 'detalles',
                                disabled: true,
                            },
                            {
                                text: 'Ver desgloses',
                                tooltip: 'Ver desgloses del hito seleccionado',
                                itemId: 'detallesdesgloses',
                                action: 'detallesdesgloses',
                                iconCls: 'detalles',
                                disabled: true,
                            }
                        ]
                    })
                ]
            },
            {
                xtype: 'toolbar',
                dock: 'top',
                itemId: 'toolbarfiltros',
                hidden: true,
                frame: true,
                layout: 'fit',
                items:[
                    {
                        xtype: 'form',
                        layout: 'hbox',
                        bodyStyle: 'background:#DFE9F6;',
                        listeners:{
                            afterrender: function(yo){
                                yo.query().forEach(function(x){
                                    if(Ext.isFunction(x.getValue) && x.parametro){
                                        x.on('specialkey', function(yo, e){
                                            if (e.getKey() == e.ENTER || e.getKey() == 13) {
                                                me.down('#realizarfiltros').fireEvent('click', me.down('#realizarfiltros'));
                                            }
                                        })
                                    }
                                })
                            },
                            dirtychange: function(yo, dirty){
                                // console.log('dirtychange', yo)
                                me.down('#realizarfiltros').setDisabled(true);
                                me.down('#toolbarfiltros').down('form').query().forEach(function(x){
                                    if(Ext.isFunction(x.getValue) && x.parametro && x.getValue() && (x.multiSelect?x.getValue().length>0:true)){
                                        me.down('#realizarfiltros').setDisabled(false);
                                    }
                                })
                            }
                        },
                        items:[
                            {
                                xtype: 'fieldset',
                                title: 'Contratos',
                                flex: 1,
                                layout: 'column',
                                defaultType: 'textfield',
                                defaults:{
                                    columnWidth: 0.5,
                                    labelAlign: 'top',
                                    margin: '0 2 4 0',
                                },
                                items:[
                                    {
                                        fieldLabel: 'Número de contrato',
                                        parametro: {'field': 'numerocontrato', 'type': 'string', 'numero': 70}
                                    },
                                    {
                                        fieldLabel: 'Nombre',
                                        parametro: {'field': 'nombre', 'type': 'string', 'numero': 71}
                                    },
                                    // {
                                    //     fieldLabel: 'Área',
                                    //     parametro: {'field': 'areacontrato', 'type': 'string', 'numero': 72}
                                    // },
                                    // Ext.create('Ext.form.field.Hidden', {
                                    //     fieldLabel: 'Área',
                                    //     name: 'idarea',
                                    //     parametro: {'field': 'c.idarea', 'type': 'int', 'numero': 72}
                                    // }),
                                    Ext.create('GestionContrato.view.SearchCmbArea', {
                                        itemId: 'filtroareacontrato',
                                        columnWidth: 1,
                                        labelAlign: 'top',
                                        editable:false,
                                        // localId: 'idarea',
                                        // valorId: 'idarea',
                                        parametro: {'field': 'idarea', 'type': 'list', 'numero': 72},
                                        getValue: function(){
                                            // console.log('getValue', me.down('#filtroareacontrato').idValue)
                                            return me.down('#filtroareacontrato').idValue;
                                        },
                                        // reset: function(){
                                        //     console.log('reset copia')
                                        //     this.hideTrigger2(1);
                                        //     this.hideTrigger2(2);
                                        //     console.log('this.tree:', this.tree)
                                        //     console.log('this.tree seel:', this.tree.getSelectionModel())
                                        //     console.log('this.tree seel:', this.tree.getSelectionModel().getLastSelected())
                                        //     if(this.tree && this.tree.getSelectionModel() && this.tree.getSelectionModel().getLastSelected())
                                        //         this.tree.getSelectionModel().deselectAll();
                                        //
                                        //     this.idValue=null;
                                        //     this.setValue('');
                                        //     // me.down('#filtroareacontrato').idValue=null;
                                        //     // me.down('#filtroareacontrato').setValue('');
                                        //     // this.tree.getSelectionModel().deselectAll();
                                        //     // this.callParent();
                                        // },
                                        listeners:{
                                            onclick3: function(cmb){
                                                me.down('#realizarfiltros').fireEvent('click', me.down('#realizarfiltros'));
                                            }
                                        }
                                    })
                                ]
                            },
                            {
                                xtype: 'fieldset',
                                title: 'Hitos',
                                flex: 1,
                                layout: 'column',
                                // defaultType: 'textfield',
                                defaults:{
                                    xtype: 'textfield',
                                    columnWidth: 0.5,
                                    labelAlign: 'top',
                                    margin: '0 2 4 0',
                                },
                                items:[
                                    {
                                        fieldLabel: 'Descripción',
                                        parametro: {'field': 'descripcion', 'type': 'string', 'numero': 60}
                                    },
                                    // {
                                    //     fieldLabel: 'Área',
                                    //     parametro: {'field': 'dh.idarea', 'type': 'int', 'numero': 61}
                                    // }

                                    // Ext.create('Ext.form.field.ComboBox',
                                    {
                                        xtype: 'combobox',
                                        labelAlign: 'top',
                                        fieldLabel: 'Estado',
                                        valueField: 'idestado',
                                        displayField: 'nombre',
                                        itemId: 'fitroestadohito',
                                        parametro: {'field': 'idestado', 'type': 'list', 'numero': 61},
                                        multiSelect: true,
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
                                        // getValue: function(yo){
                                        //     console.log('getValue:', yo)
                                        // }
                                    },
                                    // Ext.create('Ext.form.field.Hidden', {
                                    //     fieldLabel: 'Área',
                                    //     name: 'idareahito',
                                    //     parametro: {'field': 'dh.idarea', 'type': 'int', 'numero': 62}
                                    // }),
                                    Ext.create('GestionContrato.view.SearchCmbArea', {
                                        itemId: 'filtrohitocontrato',
                                        columnWidth: 1,
                                        labelAlign: 'top',
                                        editable:false,
                                        // localId: 'idarea',
                                        // valorId: 'idarea',
                                        parametro: {'field': 'idarea', 'type': 'list', 'numero': 62},
                                        getValue: function(){
                                            // console.log('getValue', me.down('#filtroareacontrato').idValue)
                                            return me.down('#filtrohitocontrato').idValue;
                                        },
                                        listeners:{
                                            onclick3: function(cmb){
                                                me.down('#realizarfiltros').fireEvent('click', me.down('#realizarfiltros'));
                                            },
                                        }
                                    })
                                ]
                            },
                            {
                                xtype: 'container',
                                layout: {type:'vbox', align: 'stretch'},
                                defaults:{
                                    margin: '0 0 3 1'
                                },
                                items:[
                                    {
                                        xtype: 'button',
                                        iconCls: 'buscar',
                                        iconAlign: 'top',
                                        ui:'default-toolbar-small',
                                        text:'Realizar filtros',
                                        itemId: 'realizarfiltros',
                                        action: 'realizarfiltros',
                                        disabled: true,
                                        margin: '8 1 3 1'
                                    },
                                    {
                                        xtype: 'button',
                                        iconCls: 'limpiar',
                                        iconAlign: 'top',
                                        ui:'default-toolbar-small',
                                        text:'Limpiar filtros',
                                        itemId: 'limpiarfiltros',
                                        action: 'limpiarfiltros',
                                        disabled: true,
                                        margin: '0 1 3 1'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                xtype: 'pagingtoolbar',
                store: me.store,
                dock: 'bottom',
                pageNumb: true,
                displayInfo: true,
                comboEntradas:8,
                // items: [
                //     {
                //         action: 'clearfilters',
                //         iconCls: 'limpiar',
                //         tooltip: me.etiquetas.qtipCleanFilters,
                //         allwaysEnabled: true,
                //         keyMap: {
                //             key: 'l',
                //             alt: true,
                //             ctrl: true,
                //             event: 'click'
                //         }
                //     }
                // ]

            }
        ];

        me.callParent();
    },
});
