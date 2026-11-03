Ext.define('Penalizaciones.view.WinEditPenalizacion', {
    extend: 'Ext.window.Window',
    alias: 'widget.wineditpenalizacion',
    frame: true,
    margin: false,
    border: false,
    width: 800,
    // height: 400,
    closable: true,
    closeAction: 'destroy',
    modal: true,
    actionInsert: true,
    resizable: false,
    defaultFocus: 'nombre',
    initComponent: function () {
        var me = this;
        me.idcontrato = null;
        Ext.util.Format.decimalSeparator = ',';
        Ext.util.Format.thousandSeparator = '.';
        Ext.util.Format.currencyPrecision = 2;
        Ext.util.Format.currencySign = ' ';

        me.etiquetas = LangMgr.getLang(me);

        me.initBody();

        me.initButtons();

        me.callParent();
        me.down('form').on('validitychange', function (yo) {
            me.checkValidez();
        });
        me.down('form').on('dirtychange', function (yo) {
            me.checkValidez();
        });
        me.down('form[tabId=anexos]').on('validitychange', function () {
            me.checkValidez();
        });
        me.down('form[tabId=anexos]').on('dirtychange', function (yo) {
            me.checkValidez();
        });
    },
    checkValidez: function () {
        var me = this,
            form = me.down('form').getForm(),
            formDA = me.down('form[tabId=anexos]').getForm(),
            invalid = form.hasInvalidField() || formDA.hasInvalidField(),
            dirty = form.isDirty() || formDA.isDirty();
        if (me.action == 'addpenalizacion') {
            me.down('button[action=aplicar]').setDisabled(invalid);
            me.down('button[action=aceptar]').setDisabled(invalid);
        } else {
            me.down('button[action=aplicar]').setDisabled(invalid || !dirty);
            me.down('button[action=aceptar]').setDisabled(invalid || !dirty);
        }
    },
    initBody: function () {
        var me = this;
        me.docAdicionales = Ext.create('Penalizaciones.view.DocumentosAdicionales', {
            tabId: 'anexos',
            height: 300,//me.height - 87,
            hidden: !me.gestordocumental
        });

        var elementos = [
            me.getFormDatosGenerales(),
            me.docAdicionales,
            // me.getPenalizacionesTab()

        ]
        me.items = [{
            xtype: 'tabpanel',
            deferredRender: false,
            border: false,
            items: elementos
        }];
    },
    getFormDatosGenerales: function () {
        var me = this;

        me.sfcontrato = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: me.etiquetas.lbFieldNombreC,
            name: 'idcontrato',
            valueField: 'idcontrato',
            displayField: 'nombre',
            queryParam: 'idcontrato',
            queryMode: 'local',
            forceSelection: true,
            allowBlank: false,
            flex: 1,
            hidden: false,
            readOnly: me.modificar,
            columnWidth: 0.50,
            store: Ext.create('Ext.data.Store', {
                fields: [
                    {name: 'idcontrato'},
                    {name: 'nombre'},
                    {name: 'numero'}
                ],
                storeId: 'Contrato',
                proxy: {
                    type: 'ajax',
                    url: UtilsFn.buildUrl({action: 'cargarContratos'}, ModuleMgr.get('Penalizaciones')),
                    actionMethods: {read: 'POST'},
                    reader: {
                        root: 'datos',
                        totalProperty: 'cantidad',
                        successProperty: 'success'
                    }
                },
            }),
            listConfig: {
                loadingText: me.etiquetas.msgCargando,
                emptyText: '<div class="x-grid-empty">' + me.etiquetas.listEmptyText + '</div>'
            },
            tpl: Ext.create('Ext.XTemplate',
                '<tpl for=".">',
                '<div class="x-boundlist-item" data-qtip="{numero} - {nombre}">' +
                '{numero} - {nombre}' +
                '</div>',
                '</tpl>'
            ),
            listeners: {
                render: function (field, records) {
                    me.sfcontrato.getStore().load()
                },
                select: function (yo, records) {
                    console.log('RECORDS', records)

                    me.sfarribo.setDisabled(records.length != 1);
                    me.sftipopenalidad.setDisabled(records.length != 1);
                    if (records.length != 1) {
                        me.sfarribo.getStore().proxy.extraParams = {};
                        me.sftipopenalidad.getStore().proxy.extraParams.idcontrato = null;
                    }
                    else{
                        me.sfarribo.getStore().proxy.extraParams = {'idcontrato': records[0].get('idcontrato'),}
                        me.sftipopenalidad.getStore().proxy.extraParams.idcontrato = records[0].get('idcontrato');
                    }
                    me.sfarribo.setValue('');
                    me.sfarribo.getStore().load();
                    me.sftipopenalidad.setValue('');
                    me.sftipopenalidad.getStore().load();
                },
                change: function (yo) {
                    var record = yo.findRecordByValue(yo.getValue());

                    console.log('RECORD',record)

                    if (!record) {
                        me.sfarribo.setValue('');
                        me.sfarribo.getStore().proxy.extraParams = {};
                        me.sfarribo.setDisabled(true);
                        me.sftipopenalidad.setValue('');
                        me.sftipopenalidad.getStore().proxy.extraParams = {};
                        me.sftipopenalidad.setDisabled(true);
                    }
                    if (me.sfcontrato.getValue() != "") {

                        if(record){
                            me.sftipopenalidad.getStore().proxy.extraParams.idcontrato = record.data.idcontrato;
                            me.idcontrato = me.sfcontrato.getValue();
                        }
                    }
                    me.sftipopenalidad.setValue('');
                    me.sftipopenalidad.getStore().load();
                },
            }
        });
        me.sfarribo = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: me.etiquetas.lbFieldDescripcA,
            name: 'idarribo',
            valueField: 'idarribo',
            displayField: 'descripcion',
            queryParam: 'idarribo',
            queryMode: 'local',
            forceSelection: true,
            allowBlank: false,
            flex: 1,
            disabled: true,
            hidden: false,
            readOnly: me.modificar,
            columnWidth: 0.50,
            store: Ext.create('Ext.data.Store', {
                fields: [
                    {name: 'idarribo'},
                    {name: 'descripcion'},
                ],
                storeId: 'Contrato',
                proxy: {
                    type: 'ajax',
                    url: UtilsFn.buildUrl({action: 'cargarArribos'}, ModuleMgr.get('Penalizaciones')),
                    actionMethods: {read: 'POST'},
                    reader: {
                        root: 'datos',
                        totalProperty: 'cantidad',
                        successProperty: 'success'
                    }
                }
            }),
            listConfig: {
                loadingText: me.etiquetas.msgCargando,
                emptyText: '<div class="x-grid-empty">' + me.etiquetas.listEmptyText + '</div>'
            },
            listeners: {
                // render: function (field, records) {
                //     me.sfarribo.getStore().load()
                // },
            }
        });

        me.sftipopenalidad = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: me.etiquetas.lbBtnTipoPenalizacion,
            name: 'idtipopenalidad',
            valueField: 'idtipopenalidad',
            displayField: 'tipopenalidad',
            module: 'Nomencladores',
            flex: 0.5,
            hidden: false,
            emptyText: 'Seleccione el tipo de penalidad',
            columnWidth: 0.50,
            disabled: true,
            readOnly: false,
            editable: true,
            queryMode: 'local',
            forceSelection: true,
            allowBlank: false,
            store: Ext.create('Ext.data.Store', {
                fields: [
                    {name: 'idtipopenalidad'},
                    {name: 'tipopenalidad'},
                    {name: 'nombre'},
                    {name: 'idcontrato'},
                    {name: 'contrato'},
                    {name: 'porciento'},
                ],
                storeId: 'TipoPenalidad',
                proxy: {
                    type: 'ajax',
                    url: UtilsFn.buildUrl({action: 'obtenerTiposPenalidades'}, ModuleMgr.get('Penalizaciones')),
                    actionMethods: {read: 'POST'},
                    reader: {
                        root: 'datos',
                        totalProperty: 'cantidad',
                        successProperty: 'success'
                    }
                }
            }),
            listConfig: {
                loadingText: me.etiquetas.msgCargando,
                emptyText: '<div class="x-grid-empty">' + me.etiquetas.listEmptyText + '</div>'
            },
            listeners: {
                select: function (yo, records){
                    if (me.sftipopenalidad.getValue() != "") {
                        me.tfporciento.setValue(records[0].get('porciento'))
                        // me.idtipopenalidad = me.sftipopenalidad.getValue();
                        // me.tfporciento.setDisabled(records.length != 1);

                        // Ext.Ajax.request({
                        //     url: UtilsFn.buildUrl({action: 'cargarPorcientoPenalidad'}, ModuleMgr.get('Penalizaciones')),
                        //     params: {idtipopenalidad: me.idtipopenalidad},
                        //     success: function (response) {
                        //         var datos = Ext.decode(response.responseText).datos[0].porciento;
                        //         me.tfporciento.setValue(datos);
                        //     },
                        //     failure: function (response) {
                        //         me.tfporciento.setDisabled(false);
                        //     }
                        // })
                    }
                },
                // render: function (field, records) {
                //     me.sftipopenalidad.getStore().load()
                // },


            }
            // margin: '0 0 10 5',
        });
        me.tfporciento = Ext.create('Ext.form.field.Text', {
            fieldLabel: me.etiquetas.lbFieldPorciento,
            name: 'porciento',
            readOnly: true,
            anchor: '25%',
            maxLength: 150,
            width: 100,
            minValue: 1,
            // disabled: true,
            flex: 0.5,
            maxLengthText: me.etiquetas.validationMaxLength_150,
            blankText: me.etiquetas.vBlankText,
        });

        me.descripcion = Ext.create('Ext.form.field.TextArea', {
            fieldLabel: 'Descripción',
            name: 'descripcion',
            //enableVar: false,
            allowBlank: true,
            //enableSourceEdit: false,
            height: 150,
            flex: 1,
        });

        return {
            title: me.etiquetas.lbTitleTabDatosGenerales,
            xtype: 'form',
            itemId: 'principal',
            trackResetOnLoad: true,
            bodyStyle: {
                padding: '5px 10px 10px 10px',
                background: '#DFE9F6'
            },
            fieldDefaults: {labelAlign: 'top'},
            defaults: {
                // bodyStyle: 'background:#DFE9F6;',
                defaults: {margin: '0 3 0 3'}
            },
            items: [
                {
                    layout: 'hbox',
                    border: false,
                    bodyStyle: 'background:#DFE9F6;',
                    hidden: true,
                    items: []
                },
                {
                    layout: 'hbox',
                    border: false,
                    bodyStyle: 'background:#DFE9F6;',
                    // anchor: '50%',
                    items: [
                        me.sfcontrato,
                        me.sfarribo,
                    ]
                },

                {
                    xtype: 'hidden',
                    name: 'idpenalidad',
                },

                // {
                //     xtype: 'hidden',
                //     name: 'idespaciotrabajo'
                // },
                {
                    layout: 'hbox',
                    border: false,
                    bodyStyle: 'background:#DFE9F6;',
                    items: [ me.sftipopenalidad, me.tfporciento]
                },
                {
                    layout: 'hbox',
                    border: false,
                    bodyStyle: 'background:#DFE9F6;',
                    items: [me.descripcion]
                },

            ]
        };
    },

    initButtons: function () {
        var me = this;

        me.buttons = [
            {
                text: me.etiquetas.lbBtnCancel,
                iconCls: 'icondistra-cancelar',
                tooltip: me.etiquetas.qtipCancel,
                handler: function () {
                    me.close();
                }
            }, {
                text: me.etiquetas.lbBtnApply,
                iconCls: 'icondistra-aplicar',
                tooltip: me.etiquetas.qtipApply,
                disabled: true,
                action: 'aplicar',
                itemId: 'btnaplicar'
            }, {
                text: me.etiquetas.lbBtnAccept,
                iconCls: 'icondistra-aceptar',
                tooltip: me.etiquetas.qtipAccept,
                disabled: true,
                action: 'aceptar',
                itemId: 'btnaceptar'
            }
        ];
    },
    initState: function () {
        var me = this;
        me.down('button[action=aplicar]').setVisible(me.actionInsert);
        me.items.first().setActiveTab(0);
    }
    ,
    resetComponents: function () {
        var me = this,
            form = me.down('form'),
            formDA = me.down('form[tabId=anexos]');
        if (me.gridProducto) {
            me.gridProducto.leftGrid.getStore().removeAll();
        }

        form.getForm().reset();

        if (formDA) {
            formDA.removeAllRow();
            formDA.insertRow();
        }
        // form.down('field:first').focus(false, 500);
    }
    ,
    loadValues: function (val) {
        var me = this,
            formDA = me.down('form[tabId=anexos]');

        me.down('form').loadRecord(val);
    },
    getValues: function () {
        var me = this,
            values;

        values = me.down('form').getForm().getValues();
        return values;
    }
    ,
    setActionInsert: function (action) {
        this.actionInsert = !!action;
    }
    ,
    getActionInsert: function () {
        return this.actionInsert;
    }
    ,
    show: function () {
        var me = this;

        me.initState();

        me.callParent();

        me.resetComponents();
    },
    checkWindow: function () {
        var me = this,
            form = me.down('form').getForm(),
            formDA = me.down('form[tabId=anexos]').getForm(),
            invalid = form.hasInvalidField() || formDA.hasInvalidField(),
            dirty = form.isDirty() || formDA.isDirty();
        invalidGrid = false;
        if (me.action == 'addpenalizacion') {
            me.down('button[action=aplicar]').setDisabled(invalid || invalidGrid);
            me.down('button[action=aceptar]').setDisabled(invalid || invalidGrid);
        } else {
            me.down('button[action=aplicar]').setDisabled(invalid || invalidGrid || !dirty);
            me.down('button[action=aceptar]').setDisabled(invalid || invalidGrid || !dirty);
        }
    },
});