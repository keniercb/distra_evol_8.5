Ext.define('ConfContratacion.view.WindowIndicadorPliego', {
    extend: 'Ext.ux.CustomWindow',
    alias: 'widget.windowindicadorpliego',
    layout: 'fit',
    width: 500,
    minWidth: 500,
    minHeight: null,
    initComponent: function () {
        var me  = this;
        this.getLang();

        // this.form = Ext.create('Ext.form.Panel', {
        Ext.define('ComboVariables', {
            extend: 'Ext.form.field.ComboBox',
            alias: 'widget.combovariables',
            fieldLabel: 'Variable',
            displayField: 'nombre',
            valueField: 'id',
            allowBlank: false,
            editable: false,
            // disabled: true,
            store: me.createStoreVariables(),
            listConfig: {
                getInnerTpl: function() {
                    return '<div data-qtip="{descripcion}">{nombre}</div>';
                }
            }

        })
        this.form = Ext.create('Ext.ux.CustomForm', {
            layout: 'column',
            border: false,
            trackResetOnLoad: true,
            defaults: {
                bodyStyle: 'background:#DFE9F6;'
            },
            fieldDefaults: {
                anchor: '100%',
                labelAlign: 'top',
                margin: '0 2'
            },
            items: [
                {
                    xtype: 'hiddenfield',
                    name: 'idindicadorpliego'
                },
                {
                    xtype: 'textfield',
                    fieldLabel: 'Nombre',
                    name: 'nombre',
                    allowBlank: false,
                    columnWidth: 0.3
                },
                {
                    xtype: 'combovariables',
                    fieldLabel: 'Atributo',
                    name: 'atributo',
                    itemId: 'atributorelevancia',
                    columnWidth: 0.3,
                },
                {
                    xtype: 'checkbox',
                    boxLabel: 'Calcular relevancia',
                    name: 'calcularrelevancia',
                    itemId: 'calcularrelevancia',
                    inputValue: 1,
                    uncheckedValue: 0,
                    margin: '16 4 0 5',
                    columnWidth: 0.15
                },
                {
                    xtype: 'textfield',
                    fieldLabel: 'Nombre relevancia',
                    name: 'nombrerelevancia',
                    itemId: 'atributo_title',
                    allowBlank: false,
                    disabled: true,
                    columnWidth: 0.25
                },
                {
                    xtype: 'textarea',
                    fieldLabel: 'Descripcion',
                    name: 'descripcion',
                    columnWidth: 1
                },
                {
                    xtype: 'fieldset',
                    title: 'Dashboard',
                    columnWidth: 1,
                    layout: 'column',
                    margin: '5 2 0 2',
                    defaults:{
                        // margin: '0 0 5 0'
                    },
                    items:[
                        {
                            xtype: 'fieldset',
                            title: 'Gráfica',
                            itemId: 'configgrafica',
                            checkboxToggle: true,
                            checkboxName: 'mostrargrafica',
                            columnWidth: 0.5,
                            margin: '5 10 8 0',
                            minHeight: 250,
                            height: window.innerHeight * 0.4,
                            maxHeight: 400,
                            items: [
                                {
                                    xtype: 'combobox',
                                    fieldLabel: 'Tipo de gráfica',
                                    name: 'tipografica',
                                    itemId: 'tipografica',
                                    displayField: 'nombre',
                                    valueField: 'id',
                                    allowBlank: false,
                                    editable: false,
                                    margin: '0 0 10 0',
                                    store: Ext.create('Ext.data.Store', {
                                        fields: ['nombre', 'id', 'elementos'],
                                        data: [
                                            {nombre: 'Gráfico de barras', id: 'bar', elementos: {}},
                                            {nombre: 'Gráfico de pastel', id: 'pie'},
                                        ]
                                    }),
                                    // listeners:{
                                    //     select: function(yo, records){
                                    //         me.down('#configgrafica').query('fieldset').forEach(function(x){
                                    //             x.setDisabled(true);
                                    //             x.setVisible(false);
                                    //         })
                                    //         if(yo.getValue() && me.down('#configgrafica_'+yo.getValue())) {
                                    //             me.down('#configgrafica_' + yo.getValue()).setDisabled(false);
                                    //             me.down('#configgrafica_' + yo.getValue()).setVisible(true);
                                    //         }
                                    //     },
                                    //     change: function(yo){
                                    //         if(!yo.getValue())
                                    //             me.down('#configgrafica').query('fieldset').forEach(function(x){
                                    //                 x.setDisabled(true);
                                    //                 x.setVisible(false);
                                    //             })
                                    //     }
                                    // }
                                },
                                {
                                    xtype: 'fieldset',
                                    title: 'Configuración de gráfica de barras',
                                    itemId: 'configgrafica_bar',
                                    layout: 'fit',
                                    hidden: true,
                                    disabled: true,
                                    items: [
                                        {
                                            xtype: 'container',
                                            itemId: 'bar',
                                            layout: 'column',
                                            defaults: {
                                                anchor: '100%',
                                                columnWidth: 0.5,
                                                margin: '0 2 10 2'
                                            },
                                            items: [
                                                {
                                                    xtype: 'combovariables',
                                                    fieldLabel: 'Categoría',
                                                    name: 'categoria_bar',
                                                    // multiSelect: true,
                                                },
                                                {
                                                    xtype: 'textfield',
                                                    fieldLabel: 'Título de la categoría',
                                                    name: 'categoria_bar_title',
                                                    itemId: 'categoria_bar_title',
                                                    allowBlank: false
                                                },
                                                {
                                                    xtype: 'combovariables',
                                                    fieldLabel: 'Valores',
                                                    name: 'valor_bar',
                                                },
                                                {
                                                    xtype: 'textfield',
                                                    fieldLabel: 'Título del valor',
                                                    name: 'valor_bar_title',
                                                    itemId: 'valor_bar_title',
                                                    allowBlank: false
                                                },
                                            ]
                                        }
                                    ]
                                },
                                {
                                    xtype: 'fieldset',
                                    title: 'Configuración de gráfica de pastel',
                                    itemId: 'configgrafica_pie',
                                    layout: 'fit',
                                    hidden: true,
                                    disabled: true,
                                    items: [
                                        {
                                            xtype: 'container',
                                            itemId: 'pie',
                                            layout: 'anchor',
                                            defaults: {
                                                anchor: '100%',
                                                columnWidth: 0.5,
                                                margin: '0 2 10 2'
                                            },
                                            items: [
                                                {
                                                    xtype: 'combovariables',
                                                    fieldLabel: 'Categoría',
                                                    name: 'categoria_pie',
                                                },
                                                {
                                                    xtype: 'combovariables',
                                                    fieldLabel: 'Valor',
                                                    name: 'valor_pie',
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            xtype: 'fieldset',
                            title: 'Grid',
                            itemId: 'configgrid',
                            checkboxToggle: true,
                            checkboxName: 'mostrargrid',
                            collapsible: false,
                            columnWidth: 0.5,
                            margin: '5 0 8 0',
                            minHeight: 250,
                            height: window.innerHeight * 0.4,
                            maxHeight: 400,
                            layout: {
                                type: 'hbox',
                                align: 'stretch'
                            },
                            defaults: {
                                // minHeight: 240,
                                margin: '0 0 10 0'
                            },
                            items: [
                                {
                                    xtype: 'grid',
                                    title: 'Variables',
                                    itemId: 'gridvariables',
                                    flex: 1,
                                    columns: [
                                        {
                                            text: 'Variables',
                                            dataIndex: 'nombre',
                                            flex: 1,
                                            renderer: function (value, meta, record) {
                                                if (value)
                                                    meta.tdAttr = 'data-qtip="' + (record.get('descripcion') ? record.get('descripcion') : value) + '"';
                                                return value;
                                            }
                                        }
                                    ],
                                    store: me.createStoreVariables('storegridvariables'),
                                    selModel: Ext.create('Ext.selection.RowModel', {mode: 'MULTI'}),
                                    viewConfig: {
                                        plugins: {
                                            ptype: 'gridviewdragdrop',
                                            // dragGroup: 'firstGridDDGroup',
                                            // dropGroup: 'secondGridDDGroup'
                                        },
                                        listeners: {
                                            drop: function (node, data, dropRec, dropPosition) {
                                                me.ordenCampos()

                                            }
                                        }
                                    }
                                },
                                {
                                    xtype: 'grid',
                                    title: 'Columnas del grid',
                                    itemId: 'columnsgrid',
                                    flex: 1,
                                    columns: [
                                        {
                                            text: 'Variables', dataIndex: 'nombrecolumna', flex: 1,
                                            editor: {
                                                xtype: 'textfield'
                                            },
                                            renderer: function (value, meta, record) {
                                                if (value)
                                                    meta.tdAttr = 'data-qtip="' + (record.get('descripcion') ? record.get('descripcion') : value) + '"';
                                                return value;
                                            }
                                        },
                                        {text: 'Orden', dataIndex: 'orden', width: 50, align: 'right'},
                                    ],
                                    store: Ext.create('Ext.data.Store', {
                                        storeId: 'storecolumnsgrid',
                                        fields: ['nombre', 'id', 'elementos', 'orden', 'nombrecolumna'],
                                        data: [],
                                        // listeners: {
                                        //     datachanged: function(store){
                                        //         console.log('datachanged', store.getCount())
                                        //         // console.log(me.down('#validogridvariables'))
                                        //         // if(me.down('#validogridvariables'))
                                        //         //     me.down('#validogridvariables').setValue(store.getCount()>0?'valido':'');
                                        //     }
                                        // }
                                    }),
                                    selModel: Ext.create('Ext.selection.RowModel', {mode: 'MULTI'}),
                                    viewConfig: {
                                        plugins: {
                                            ptype: 'gridviewdragdrop',
                                            // dragGroup: 'secondGridDDGroup',
                                            // dropGroup: 'firstGridDDGroup'
                                        },
                                        listeners: {
                                            drop: function (node, data, dropRec, dropPosition) {
                                                me.ordenCampos();
                                            }
                                        }
                                    },
                                    plugins: [
                                        new Ext.grid.plugin.CellEditing({
                                            clicksToEdit: 1,
                                        })
                                    ]
                                },
                                {
                                    xtype: 'textfield',
                                    hidden: true,
                                    name: 'validogridvariables',
                                    itemId: 'validogridvariables',
                                    allowBlank: false
                                }
                            ]

                        }
                    ]
                }

            ]
        });
        this.items = [this.form];
        this.callParent();
    },
    ordenCampos: function(){
        var me= this, orden=1;
        me.down('#columnsgrid').getStore().getRange().forEach(function(x){
            x.set('orden', orden); orden++;
        })
    },
    createStoreVariables: function(storeId){
        return Ext.create('Ext.data.Store',{
            autoLoad: true,
            storeId: storeId,
            fields: ['nombre', 'id', 'descripcion', 'nombrecolumna'],
            proxy: {
                type: 'ajax',
                url: UtilsFn.buildUrl({action: 'getVariablesPliego'}, ModuleMgr.get('ConfContratacion')),
                actionMethods: {
                    read: 'POST'
                },
                reader: {
                    root: 'data',
                    totalProperty: 'total',
                    successProperty: 'success'
                }
            }
        })
    }
});
