Ext.define('DesgloseContrato.view.WindowAddAreasImplicadas', {
    extend: 'Ext.window.Window',
    alias: 'widget.windowaddareasimplicadas',
    frame: false,
    margin: false,
    border: false,
    width: window.innerWidth*0.95,
    height: window.innerHeight*0.9,
    minHeight: 400,
    minWidth: 600,
    closable : true,
//     closeAction: 'hide',
    modal: true,
    resizable: false,
    layout: {type: 'hbox', align: 'stretch'},
    areaRoot:{
        text: 'Estructura',
        id: 0,
        expanded: true
    },
    initComponent: function () {
        var me = this;

        me.etiquetas = LangMgr.getLang(me);

        me.title = me.etiquetas.qtipGestionarAreasImplicadas;

        // me.store = Ext.create('GestionContrato.store.Areas',{
        //     root: me.areaRoot,
        // });
        me.store=Ext.create('Ext.data.TreeStore', {
            proxy: {
                type: 'ajax',
                url: UtilsFn.buildUrl({action: 'getAreasTodas'}, ModuleMgr.get('DesgloseContrato')),
                reader: {
                    root: 'children',
                    type: 'json',
                    totalProperty: 'total',
                    successProperty: 'success'
                },

            },
            root: me.areaRoot
        })

//         me.tree = Ext.create('Ext.tree.Panel', {
//             itemId: 'treeareas',
//             cls: 'crm-icon-tree',
//             name: 'areatree',
//             store: me.store,
//             rootVisible: true,
//             autoScroll: true,
//         });
        me.items = [
            Ext.create('Ext.tree.Panel', {
                frame: false,
                margin: false,
                border: false,
                split: true,

                title: me.etiquetas.lbAreas,
                itemId: 'treeareas',
                width: 250,
                minWidth: 200,
                maxWidth: 300,
                cls: 'crm-icon-tree',
                name: 'areatree',
                store: me.store,
                // rootVisible: true,
                autoScroll: true,
                selModel:{
                    xtype:'treemodel',
                    mode: 'multi'
                } 
            }),
            {
                xtype: 'panel',
                bodyStyle: 'background:#DFE9F6;',
                itemId: 'panelbotones',
                layout: {
                    type: 'vbox',
                    align: 'stretch',
                    pack: 'center'
                },
                defaults: {
                    xtype: 'button',
                    margin: '1 2',
                    ui: 'default-toolbar-small',
                },
                items:[
                    {
                        iconCls: 'icondistra-siguiente icon-medium',
                        tooltip: me.etiquetas.qtipAdicionar,
                        action: 'addareaimplicada'
                    },
                    {
                        iconCls: 'icondistra-anterior icon-medium',
                        tooltip: me.etiquetas.qtipQuitar,
                        action: 'delareaimplicada'
                    },
                    {
                        iconCls: 'icondistra-desplazardobleizq icon-medium',
                        tooltip: me.etiquetas.qtipQuitarTodas,
                        action: 'deltodasareaimplicada'
                    }
                ]
            },
            {
                xtype: 'panel',
                layout: 'border',
                flex: 2,
                minWidth: 400,
                items: [
                    {
                        xtype: 'form',
                        itemId: 'formaddareasimplicadas',
                        title: me.etiquetas.lbTitleHitoAreas,
                        flex: 2,
                        minWidth: 400,
                        layout: 'border',
                        region: 'center',
                        items: [
                            {
                                xtype: 'tabpanel',
                                itemId: 'tabpaneldesgloses',
                                region: 'center',
                                flex: 3,
                                items: [
                                    // {
                                    //     title: 'Desglose general'
                                    // },
                                    Ext.create('DesgloseContrato.view.GridHitosAreas', {
                                        // title: 'Desglose general',
                                        itemId: 'gridhitosareas',
                                        editGrid: true,
                                        selType: 'checkboxmodel',
                                        summaryColumnas: true,
                                        montototal: me.montototal,
                                        montosmonedas: me.montosmonedas,
                                        idsAreas: [],
                                        allowBlank: false,
                                        preventMark: true,
                                        idStore: 'dc_stHitoAreaGestionar',
                                        dockedItems: [
                                            {
                                                xtype: 'toolbar',
                                                defaultType: 'textfield',
                                                defaults: {
                                                    labelAlign: 'top',
                                                    readOnly: true,
                                                    flex: 1,
                                                    fieldStyle: "text-align:right;",
                                                    allowBlank: false,
                                                    afterLabelTextTpl: ''
                                                },
                                                items: [
                                                    {
                                                        fieldLabel: 'Monto total',
                                                        itemId: 'montototal',
                                                        value: Ext.util.Format.number(me.montototal, '0.000,00/i')
                                                    },
                                                    {
                                                        fieldLabel: 'Porciento restante',
                                                        itemId: 'porcientorestante',
                                                        hidden: true
                                                        // regex: /^0(,00)?%$/,
                                                        // regexText: me.etiquetas.lbNoRepartidoDinero
                                                    },
                                                    {
                                                        fieldLabel: 'Monto restante',
                                                        itemId: 'montorestante',
                                                        regex: /^0(,00)?$/,
                                                        regexText: me.etiquetas.lbNoRepartidoDinero
                                                        // validator: function(value){
                                                        //     if(value=='0,00')return true
                                                        //     return 'No se ha repartido todo el dinero.'
                                                        // }
                                                    },
                                                    {
                                                        xtype: 'button',
                                                        iconCls: 'desglose',
                                                        iconAlign: 'top',
                                                        text: 'Convertir',
                                                        tooltip: 'Convertir desglose general a desglose por monedas',
                                                        disabled: true,
                                                        itemId: 'generalAmonedas',
                                                        action: 'generalAmonedas',
                                                        flex: null,

                                                    }
                                                ]
                                            }
                                        ],
                                    }),
                                    Ext.create('DesgloseContrato.view.GridHitosAreasMonedas', {
                                        // title: 'Desglose por monedas',
                                        itemId: 'gridhitosareasmonedas',
                                        editGrid: true,
                                        selType: 'checkboxmodel',
                                        summaryColumnas: true,
                                        montototal: me.montototal,
                                        montosmonedas: me.montosmonedas,
                                        idsAreas: [],
                                        idStore: 'dc_stHitoAreaMonedaGestionar',
                                        extrafields: me.extrafields,
                                        dockedItems: [
                                            {
                                                xtype: 'toolbar',
                                                defaultType: 'textfield',
                                                itemId: 'toolbarmonedas',
                                                autoScroll: true,
                                                defaults: {
                                                    labelAlign: 'top',
                                                    readOnly: true,
                                                    flex: 1,
                                                    minWidth: 100,
                                                    fieldStyle: "text-align:right;",
                                                    allowBlank: false,
                                                    afterLabelTextTpl: ''
                                                },
                                                items: [
                                                    {
                                                        hidden: true,
                                                        itemId: 'correcto'
                                                    }
                                                ]
                                            }
                                        ],
                                    })
                                ]
                            },
                            // Ext.create('GestionContrato.view.TabHitosAdicional',{
                            //     title: 'Datos adicionales de los hitos',
                            //     itemId: 'datosadicionaleshitos',
                            //     region: 'south',
                            //     flex:1,
                            //     minHeight: 220,
                            //     // maxHeight: 300,
                            //     collapsible: true,
                            //     collapsed: true,
                            //     // resizable:true,
                            // })

                            // {
                            //     xtype: 'panel',
                            //     title: 'Datos adicionales de los hitos',
                            //     region: 'south',
                            //     flex:1,
                            //     minHeight: 250,
                            //     maxHeight: 500,
                            //     collapsible: true,
                            //     collapsed: true,
                            //     layout: {type: 'hbox', align: 'stretch'},
                            //     items:[
                            //
                            //     ]
                            // }
                        ]
                        // dockedItems:[
                        //     {
                        //         xtype: 'toolbar',
                        //         defaultType: 'textfield',
                        //         defaults:{
                        //             labelAlign: 'top',
                        //             readOnly: true,
                        //             flex:1,
                        //             fieldStyle: "text-align:right;",
                        //             allowBlank: false,
                        //             afterLabelTextTpl: ''
                        //         },
                        //         items:[
                        //             {
                        //                 fieldLabel: 'Monto total',
                        //                 itemId: 'montototal',
                        //                 value: Ext.util.Format.number(me.montototal, '0.000,00/i')
                        //             },
                        //             {
                        //                 fieldLabel: 'Porciento restante',
                        //                 itemId: 'porcientorestante',
                        //                 regex: /^0(,00)?%$/,
                        //                 regexText: me.etiquetas.lbNoRepartidoDinero
                        //             },
                        //             {
                        //                 fieldLabel: 'Monto restante',
                        //                 itemId: 'montorestante',
                        //                 regex: /^0(,00)?$/,
                        //                 regexText: me.etiquetas.lbNoRepartidoDinero
                        //                 // validator: function(value){
                        //                 //     if(value=='0,00')return true
                        //                 //     return 'No se ha repartido todo el dinero.'
                        //                 // }
                        //             },
                        //         ]
                        //     }
                        // ],
                        // items:[
                        //     Ext.create('DesgloseContrato.view.GridHitosAreas',{
                        //         itemId: 'gridhitosareas',
                        //         editGrid: true,
                        //         selType: 'checkboxmodel',
                        //         summaryColumnas: true,
                        //         montototal: me.montototal,
                        //         idsAreas:[],
                        //         allowBlank: false,
                        //         preventMark: true,
                        //         idStore: 'dc_stHitoAreaGestionar',
                        //     }),
                        // ]
                    },
                    Ext.create('Ext.form.Panel', {
                        title: 'Aplicar a seleccionadas',
                        itemId: 'paneladicionalhitos',
                        region: 'south',
                        // flex:1,
                        // minHeight: 220,
                        collapsible: true,
                        bodyStyle: 'background:#DFE9F6;',
                        trackResetOnLoad: true,
                        // flex:1,
                        layout: 'hbox',
                        // hidden: true,
                        // disabled: true,
                        items: [
                            Ext.create('Ext.form.field.Hidden', {
                                itemId: 'idservicio',
                                name: 'idservicio'
                            }),
                            {
                                xtype: 'combo',
                                fieldLabel: 'Servicio',
                                labelAlign: 'top',
                                itemId: 'servicio',
                                name: 'servicio',
                                displayField: 'denominacion',
                                valueField: 'denominacion',
                                pageSize: 20,
                                mode: 'remote',
                                flex: 2,
                                queryParam: 'denominacion',
                                allowBlank: false,
                                closeAction: 'destroy',
                                margin: '10 5 10 10',
                                store: Ext.create('Ext.data.Store', {
                                    fields: [
                                        {name: 'idindicador', type: 'int'},
                                        {name: 'denominacion', type: 'string'},
                                        {name: 'tipo', type: 'int'},
                                        {name: 'codigoproveedor'}
                                    ],
                                    remoteSort: true,
                                    pageSize: 20,
                                    proxy: {
                                        type: 'ajax',
                                        url: UtilsFn.buildUrl({action: 'getProducto'}, ModuleMgr.get('GestionContrato')),
                                        actionMethods: {
                                            read: 'POST'
                                        },
                                        extraParams: {
                                            idtipoprecio: -1, tipo: 2
                                        },
                                        reader: {
                                            root: 'data',
                                            totalProperty: 'total',
                                            successProperty: 'success'
                                        }
                                    }
                                }),
                                listeners: {
                                    select: function (yo, records) {
                                        if (yo.getValue()) {
                                            me.down('#idservicio').setValue(records[0].get('idindicador'));
                                        }
                                    },
                                    change: function (yo, value) {
                                        // console.log('value', value)
                                        if (!value || value == '') {
                                            me.down('#idservicio').setValue('');
                                        }
                                    }
                                }
                            },
                            Ext.create('Ext.form.field.Hidden', {
                                itemId: 'idlineanegocio',
                                name: 'idlineanegocio'
                            }),
                            // Ext.create('Ext.ux.CmbSelectField', {
                            Ext.create('Ext.form.ComboBox', {
                                fieldLabel: 'Linea de negocio',
                                labelAlign: 'top',
                                // fieldLabel: me.context == "proveedor" ? me.etiquetas.lbOrganismo:me.etiquetas.lbEsquema,
                                itemId: 'lineanegocio',
                                name: 'lineanegocio',
                                mapping: 'NomLineaNegocio.denominacion',
                                // localId: 'idlineanegocio',
                                module: 'Nomencladores',
                                // allowBlank: false,
                                gen: 'f',
                                filters: {},
                                //disabled: true,
                                flex: 2,
                                margin: '10 5 10 10',
                                pageSize: 20,
                                valueField: 'idnaturaleza',
                                displayField: 'denominacion',
                                queryParam: 'denominacion',
                                // forceSelection: true,
                                store: Ext.create('Ext.data.Store', {
                                    fields: ['idnaturaleza', 'denominacion'],
                                    proxy: {
                                        type: 'ajax',
                                        url: UtilsFn.buildUrl({action: 'cargarNaturalezas'}, ModuleMgr.get('GestionContrato')),
                                        actionMethods: {
                                            read: 'POST'
                                        },
                                        reader: {
                                            root: 'data',
                                            totalProperty: 'total',
                                            successProperty: 'success'
                                        }
                                    },
                                    pageSize: 20
                                }),
                                listeners: {
                                    select: function (yo, records) {
                                        if (yo.getValue()) {
                                            var seleccionado = me.down('#gridhitosareas').getSelectionModel().getSelection();
                                            me.down('#idlineanegocio').setValue(records[0].get('idnaturaleza'));
                                            with (me.down('#fieldsetproductoasociado')) {
                                                setDisabled(false);
                                                down('#productoasociado').setValue('');
                                                down('#idproductoasociado').setValue('');
                                                // down('#seleccionarproducto').setDisabled(seleccionado[0].get('indicadores').length==0);
                                                // down('#limpiarproducto').setDisabled(seleccionado[0].get('indicadores').length==0);
                                                down('#seleccionarproducto').idnaturaleza = records[0].get('idnaturaleza');
                                            }
                                        }
                                        // me.down('#idlineanegocio').setValue(records[0].get('idlineanegocio'))
                                    },
                                    change: function (yo, value) {
                                        // console.log('value', value)
                                        if (!value || value == '') {
                                            me.down('#idlineanegocio').setValue('');
                                            // me.down('#fieldsetproductoasociado').setDisabled(true)
                                            with (me.down('#fieldsetproductoasociado')) {
                                                setDisabled(true);
                                                down('#productoasociado').setValue('');
                                                down('#idproductoasociado').setValue('');
                                                // down('#seleccionarproducto').setDisabled(true);
                                                // down('#limpiarproducto').setDisabled(true);
                                            }
                                        }
                                    }
                                }
                            }),
                            {
                                xtype: 'fieldset',
                                title: 'Producto asociado',
                                itemId: 'fieldsetproductoasociado',
                                margin: '5 10 10 5',
                                flex: 3,
                                layout: 'hbox',
                                disabled: true,
                                items: [
                                    Ext.create('Ext.form.field.Hidden', {
                                        itemId: 'idproductoasociado',
                                        name: 'idproductoasociado'
                                    }),
                                    {
                                        xtype: 'textfield',
                                        itemId: 'productoasociado',
                                        name: 'productoasociado',
                                        flex: 1,
                                        readOnly: true,
                                        margin: '5 0 10 0'
                                    },
                                    {
                                        xtype: 'button',
                                        text: 'Seleccionar',
                                        itemId: 'seleccionarproducto',
                                        tooltip: 'Seleccionar producto asociado al servicio',
                                        iconCls: 'aceptar',
                                        // action: 'addprod',
                                        margin: '5 0 10 0',
                                        handler: function () {
                                            if (!me.winProducto) {
                                                // console.log('no existe')
                                                me.winProducto = Ext.create('GestionContrato.view.FormaPago.Producto.WindowProducto', {
                                                    title: me.etiquetas.titleSelecProducto,
                                                    btnApply: false,
                                                    height: window.innerHeight * 0.90,
                                                    width: window.innerWidth * 0.8,
                                                    // closeAction: 'destroy',
                                                    withDatosAdicionales: false,
                                                    itemId: 'winproductoasociado',
                                                    // filtros: {},
                                                    listeners: {
                                                        close: function (yo) {
                                                            yo.grid.getSelectionModel().deselectAll();
                                                        }
                                                    }
                                                    // gridproducto: myButton.up('gridpanel')
                                                });
                                                me.winProducto.show(null, function () {
                                                    // me.winProducto.btnAplicar.setVisible(false);
                                                    me.winProducto.btnAceptar.action = null;
                                                    // console.log('me.winProducto:', me.winProducto)
                                                    me.winProducto.btnAceptar.setHandler(function () {
                                                        var gridproductos = me.winProducto.grid,
                                                            seleccion = gridproductos.getSelectionModel().getSelection();
                                                        if (seleccion.length == 1) {
                                                            me.down('#productoasociado').setValue(seleccion[0].get('denominacion'));
                                                            me.down('#idproductoasociado').setValue(seleccion[0].get('idindicador'));
                                                            me.winProducto.close();
                                                        } else {
                                                            mostrarMensaje(8, 'Debe haber seleccionado un producto.')
                                                        }
                                                    })
                                                });
                                            } else {
                                                me.winProducto.show();
                                            }
                                            // with (me.winProducto.grid.getStore()) {
                                            var storeP = me.winProducto.grid.getStore();
                                            if (!storeP.proxy.extraParams.idnaturaleza || (storeP.proxy.extraParams.idnaturaleza &&
                                                    storeP.proxy.extraParams.idnaturaleza != me.down('#seleccionarproducto').idnaturaleza)) {
                                                // if (storeP.isLoading()) {
                                                //     Ext.Ajax.abort(storeP.proxy.activeRequest);
                                                //     delete storeP.proxy.activeRequest;
                                                // }
                                                storeP.proxy.extraParams.idnaturaleza = me.down('#seleccionarproducto').idnaturaleza;
                                                storeP.load();
                                                // console.log('idnaturaleza:', me.down('#seleccionarproducto').idnaturaleza)
                                            }

                                            // }
                                        }
                                    },
                                    {
                                        xtype: 'button',
                                        text: 'Limpiar',
                                        itemId: 'limpiarproducto',
                                        tooltip: 'Limpiar producto seleccionado',
                                        iconCls: 'limpiar',
                                        margin: '5 0 10 0',
                                        handler: function () {
                                            me.down('#productoasociado').setValue('');
                                            me.down('#idproductoasociado').setValue('');
                                        }
                                    },
                                ]
                            },

                            {
                                xtype: 'button',
                                text: 'Aplicar',
                                tooltip: 'Aplicar a seleccionados',
                                iconCls: 'aceptar',
                                itemId: 'guardardatoshito',
                                disabled: true,
                                margin: '28 5 0 0',
                                handler: function () {
                                    // console.log(me.down('#paneladicionalhitos').query('[name]'));
                                    if (me.down('#gridhitosareas').getSelectionModel().getCount() == 0) {
                                        mostrarMensaje(8, 'No hay ningún área seleccionada.');
                                    } else {
                                        me.down('#gridhitosareas').getSelectionModel().getSelection().forEach(function (x) {
                                            with (x) {
                                                // me.down('#paneladicionalhitos').query('[name]').forEach(function(x) {
                                                //     set(x.name, x.getValue());
                                                //     x.resetOriginalValue();
                                                // });
                                                set('idlineanegocio', me.down('#idlineanegocio').getValue());
                                                set('lineanegocio', me.down('#lineanegocio').getRawValue());
                                                set('idproducto', me.down('#idproductoasociado').getValue());
                                                set('producto', me.down('#productoasociado').getValue());
                                                set('idservicio', me.down('#idservicio').getValue());
                                                set('servicio', me.down('#servicio').getValue());
                                                // if(get('indicadores') && get('indicadores').length>0){
                                                //     indicadores=get('indicadores');
                                                //     indicadores[0]['idproductoasociado']=me.down('#idproductoasociado').getValue();
                                                //     indicadores[0]['productoasociado']=me.down('#productoasociado').getValue();
                                                //     set('indicadores', indicadores);
                                                //     if(me.down('#idproductoasociado').getValue()){
                                                //         set('arrayIndicadores', {modificados: indicadores,eliminados:[]})
                                                //     }else{
                                                //         set('arrayIndicadores', '');
                                                //     }
                                                // }
                                                // me.down('#gridhitosareas').getStore().fireEvent('update', me.down('#gridhitosareas').getStore(), this);
                                            }
                                            // me.down('#idlineanegocio').resetOriginalValue();
                                            // me.down('#lineanegocio').resetOriginalValue();
                                            // me.down('#idproductoasociado').resetOriginalValue();
                                            // me.down('#productoasociado').resetOriginalValue();
                                        })
                                    }

                                    // console.log(me.down('#gridhitosareas').getSelectionModel().getSelection()[0])
                                    // me.down('#guardardatoshito').setDisabled(true);
                                }
                            }
                        ],
                        listeners: {
                            dirtychange: function (form, dirty) {
                                // console.log('is dirty yeah', dirty)
                                me.down('#guardardatoshito').setDisabled(!dirty);
                            }
                        }
                    })
                    // {
                    //     xtype: 'form',
                    //     items:[
                    //         {
                    //             xtype: 'textfield',
                    //             itemId: 'totalporciento',
                    //             hidden: true,
                    //             regex: /^100$/,  // /^(10)?0$/
                    //             allowBlank: false
                    //         },
                    //         {
                    //             xtype: 'textfield',
                    //             itemId: 'totalmonto',
                    //             hidden: true,
                    //             // regex: /^me.montototal$/,  // /^(10)?0$/
                    //             allowBlank: false,
                    //             validator: function(value){
                    //
                    //             }
                    //         },
                    //     ]
                    // }
                ]
            }
        ];

        me.buttons = [
            {
                text: me.etiquetas.lbEliminarAreasImplicadas,
                iconCls: 'icondistra-eliminar',
                tooltip: me.etiquetas.qtipEliminarAreasImplicadas,
                disabled: true,
                hidden: true,
                itemId: 'eliminar',
                action: 'eliminar'
            },
            // { xtype: 'tbspacer', width: 40 },
            // { xtype: 'tbseparator' },
            { xtype: 'tbseparator',width: 50},
            {
                text: me.etiquetas.lbBtnCancel,
                iconCls: 'icondistra-cancelar',
                tooltip: me.etiquetas.qtipCancel,
                handler: function(){
                    me.close();
                }
            },{
                text: me.etiquetas.lbBtnAccept,
                iconCls: 'icondistra-aceptar',
                tooltip: me.etiquetas.qtipAccept,
                disabled: true,
                itemId: 'aceptar',
                action: 'aceptar'
            }
        ];

        me.callParent();
        if(me.extrafields){
            me.extrafields.forEach(function(field){
                if(me.montosmonedas[field.codigoiso.toLowerCase()+'_'+field.idmoneda]!=0) {
                    me.down('#toolbarmonedas').add([
                        {
                            fieldLabel: 'Monto ' + field.codigoiso,
                            itemId: 'montomoneda_' + field.codigoiso.toLowerCase() + '_' + field.idmoneda,
                            value: Ext.util.Format.number(me.montosmonedas[field.codigoiso.toLowerCase() + '_' + field.idmoneda], '0.000,00/i')
                        },
                        {
                            fieldLabel: '% restante ' + field.codigoiso,
                            itemId: 'porcientorestante_' + field.codigoiso.toLowerCase() + '_' + field.idmoneda,
                            hidden: true
                            // regex: /^0(,00)?%$/,
                            // regexText: me.etiquetas.lbNoRepartidoDinero
                        },
                        {
                            fieldLabel: 'Restante ' + field.codigoiso,
                            itemId: 'montorestante_' + field.codigoiso.toLowerCase() + '_' + field.idmoneda,
                            regex: /^0(,00)?$/,
                            regexText: me.etiquetas.lbNoRepartidoDinero
                        },
                        // '-'
                        { xtype: 'tbseparator',flex:null, minWidth: null},
                    ]);
                }
            })
        }
        me.down('#toolbarmonedas').add([
            {
                fieldLabel: 'Monto total',
                itemId: 'montototaltotal',
                value: Ext.util.Format.number(me.montototal, '0.000,00/i')
            },
            {
                fieldLabel: 'Porciento restante',
                itemId: 'porcientorestantetotal',
                hidden:true
                // regex: /^0(,00)?%$/,
                // regexText: me.etiquetas.lbNoRepartidoDinero
            },
            {
                fieldLabel: 'Monto restante',
                itemId: 'montorestantetotal',
                regex: /^0(,00)?$/,
                regexText: me.etiquetas.lbNoRepartidoDinero
                // validator: function(value){
                //     if(value=='0,00')return true
                //     return 'No se ha repartido todo el dinero.'
                // }
            },
        ]);

    },
    insertarColumnasMonedas: function (newcolumns, extrafields, pos) {
        var me=this;
        Ext.each(extrafields, function (field) {
            console.log('field',field)
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
                summaryType: function (records, dataindex, b) {
                    var total = 0;
                    records.forEach(function (x) {
                        if (x.get(dataindex))
                            total += parseFloat(x.get(dataindex));
                    });
                    return total;
                }
            });
            pos++;
        });
        // console.log('fields:', fields)
        return newcolumns;
    },
});
