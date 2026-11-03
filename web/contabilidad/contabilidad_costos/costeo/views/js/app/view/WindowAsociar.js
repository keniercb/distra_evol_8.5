Ext.define('PRT.view.WindowAsociar', {
    extend: 'Ext.window.Window',
    alias: 'widget.windowasociar',

    //idioma: eval('PRT.language.' + lang),
    idioma: PRT.language[lang],
    autoShow: true,

    initComponent: function () {
        var me = this;
        this.inicializarStores();

        this.searchFields = Ext.create('CostoComun.components.SearchField', {
            // margin: '2 2 0 5',
            fnOnSearch: function () {
                var filter = this.getValue();
                me.stCuentasGasto.proxy.extraParams.filter = filter;
                me.stCuentasGasto.load({
                    scope: this,
                    params: {},
                    callback: function () {
                        this.masktree.hide();
                    }
                }),
                    this.masktree = new Ext.LoadMask(me.treeGridCentros.getEl(), {msg: me.idioma.msgCargando});
                this.masktree.show();
            },
            fnOnClear: function () {
                me.stCuentasGasto.proxy.extraParams.filter = null;
                me.node = 'root';
                me.stCuentasGasto.load();
            },
            validationEvent: false,
            validateOnBlur: true,
            selectOnFocus: true,
            hasSearch: false,
            trigger1Cls: 'x-form-clear-trigger',
            trigger2Cls: 'x-form-search-trigger',
            clearTooltip: 'Limpiar filtros <b>(Esc)</b>',
            searchTooltip: 'Buscar elementos <b>(Enter)</b>',
            emptyText: 'Criterio a buscar...',
            enableKeyEvents: true,
            flex: 1
        });

        this.treeGridCentros = Ext.create('Ext.tree.Panel', {
            region: 'west',
            //autoScroll: true,
            useArrows: true,
            width: 250,
            store: this.stCuentasGasto,
            //margin: '0 5 5 5',
            rootVisible: false,
            columns: {
                items: [
                    {
                        xtype: 'treecolumn',
                        flex: 1,
                        text: this.idioma.lbHeaderTreeCentros,
                        dataIndex: 'text',
                        sortable: true,
                        scroll: true
                        //autoScroll: true,
                    },

                ]
            },
            listeners: {
                scope: this,
                itemclick:
                    function (dv, record, item, index, e) {
                        //this.idcentrocosto = record.data.idcentrocosto
                    }
            },
            tbar: [this.searchFields]
            //renderTo: Ext.getBody()
        });

        this.cbDenominacion = Ext.create('Ext.form.ComboBox', {
            allowBlank: false,
            editable: false,
            blankText: this.idioma.blankTextField,
            store: this.stDenominacion,
            emptyText: this.idioma.lbSeleccione,
            name: 'denominacion',
            queryMode: 'local',
            valueField: 'iddenominacion',
            displayField: 'denominacion',
            enableKeyEvents: true

        });

        this.cbCuentaDestino = Ext.create('Ext.form.ComboBox', {
            allowBlank: false,
            multiSelect: true,
            editable: false,
            blankText: this.idioma.blankTextField,
            store: this.stCuentaDestino,
            emptyText: this.idioma.lbSeleccione,
            name: 'cuentadestino',
            queryMode: 'local',
            valueField: 'id',
            displayField: 'value',
            enableKeyEvents: true,
            disabled: true,
            listConfig: {
                getInnerTpl: function () {
                    return '<div>{text}</div>'
                }
            }

        });

        this.rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {

            autoLoad: true,
            errorSummary: false,
            saveBtnText: this.idioma.lbbtnAceptar,
            cancelBtnText: this.idioma.lbbtnCancelar
        });

        this.recordDestinoProd;

        this.cbUnidadMedida = Ext.create('Ext.form.ComboBox', {
            name: 'idunidadmedida',
            tabIndex: 7,
            emptyText: this.idioma.lbSeleccione,
            forceSelection: true,
            fieldLabel: this.idioma.lbCbxUnidadMedida,
            labelAlign: 'top',
            labelStyle: 'margin: 2 2 3 0',
            //margin: '0 2 3 5',
            store: this.stGridUnidad,
            allowBlank: false,
            blankText: this.idioma.blankTextField,
            editable: false,
            width: 250,
            //flex: 1,
            queryMode: 'local',
            valueField: 'idunidad',
            displayField: 'unidadmedida',
            enforceMaxLength: true,
            //disabled: true,
            listConfig: {
                minWidth: null
            },


        });

        this.btnGuardar = Ext.create('Ext.Button', {
            tabIndex: 9,
            tooltip: this.idioma.tooltipbtnGuardar,
            text: "<span class='icondistra-guardar'></span>Guardar",
            scope: this,
            height: 23,
            //margin: '5 0 0 0',
            align: 'center',
            disabled: true,
            handler: function (btn) {
                var myMask = new Ext.LoadMask(this.getEl(), {msg: this.idioma.msgCargando});
                myMask.show();
                var objectTreeCuenta = this.treeGridCentros.getSelectionModel().getSelection()[0];
                var recordCuenta = objectTreeCuenta.data;
                var datosGrid = this.stDestinoProduccion.getRange();
                var cantDatosGrid = datosGrid.length;

                var datos = new Array();

                var paramConfiguracion = {};
                for (var i = 0; i < cantDatosGrid; i++) {
                    paramConfiguracion = {};
                    paramConfiguracion['denominacion'] = datosGrid[i].data.denominacion;
                    paramConfiguracion['iddestino'] = datosGrid[i].data.iddestino;
                    paramConfiguracion['cuentadestino'] = datosGrid[i].data.cuentasdestino;
                    paramConfiguracion['idasociacion'] = datosGrid[i].data.idasociacion;

                    datos.push(paramConfiguracion);
                }
                var parameter = {
                    idcuenta: recordCuenta.idcuenta,
                    idunidad: this.cbUnidadMedida.getValue(),
                    destinopro: Ext.encode(datos)
                };
                Ext.Ajax.request({
                    scope: this,
                    url: 'saveAsociacion',
                    params: parameter,
                    callback: function (options, success, response) {
                        var responseData = Ext.decode(response.responseText);
                        var msg = (responseData.msg === 1) ? this.idioma.lbAsosiacionGuardada : this.idioma.lbMsgErrorGuardarAsociacion;
                        mostrarMensaje(1, msg);
                        myMask.hide();
                        if (success) {
                            this.stDestinoProduccion.removeAll();
                            this.stDestinoProduccion.commitChanges();
                            var objectTreeCuenta = this.treeGridCentros.getSelectionModel().getSelection()[0];
                            this.treeGridCentros.getSelectionModel().deselect(objectTreeCuenta);
                            this.btnAdicionar.disable();
                            //this.btnGuardar.disable();
                            //this.stCuentas.load();
                            myMask.hide();
                        }
                    }
                });
            }
        });

        this.btnVistaR = Ext.create('Ext.Button', {
            tabIndex: 9,
            tooltip: this.idioma.lbTooltipBtnVistaRepo,
            text: this.idioma.lbBtnVistaRepo,
            scope: this,
            height: 23,
            //margin: '0 0 0 0',
        });

        this.btnCancelarAso = Ext.create('Ext.Button', {
            tabIndex: 9,
            //margin: '5 0 0 225',
            tooltip: 'Cerrar ventana',
            text: "<span class='icondistra-cancelar'></span>Cancelar",
            scope: this,
            //height: 23,
            //disabled: true
        });

        this.btnAdicionar = Ext.create('Ext.Button', {
            tabIndex: 3,
            tooltip: this.idioma.lbtooltipAdicionarDestino,
            text: this.idioma.btnAdicionar,
            scope: this,
            disabled: true,
            handler: function (button, e) {

                this.cbCuentaDestino.reset();
                var count = this.stDestinoProduccion.getCount();
                this.recordAsoc = count;
                var modeldestinoprod = Ext.create('Asociacion');
                this.stDestinoProduccion.insert(count, modeldestinoprod);
                this.rowEditing.startEdit(count, 0);
                this.btnAdicionar.disable();
                this.validarModificarDestino();
            }
        });

        /*this.winCmp = new Ext.Window({
            width: 450,
            height: 318,
            constrain: true,
            modal: true,
            closeAction: 'destroy',
            html: '<iframe style="border: none;" src= "/contabilidad/contabilidad_costos/costeo/index.php/confcosteo/mostrarcomprobanteExt4" width="100%" height="100%"></iframe>',
            listeners: {
                scope: this,
                close: function (win) {
                    //window.closewind = true;
                },
            },
            buttons: [
                this.btnCancelarReporte, this.btnAceptarReporte
            ]
        });*/

        this.gridDestinoProd = Ext.create('Ext.grid.Panel', {
            title: 'Destinos de producci&oacute;n',
            viewConfig: {loadMask: false},
            scope: this,
            plugins: [this.rowEditing],
            width: 300,
            store: this.stDestinoProduccion,
            columns: [{
                text: this.idioma.lbCbxDenominacion,
                sortable: true,
                flex: 1,
                dataIndex: 'denominacion',
                editor: this.cbDenominacion,
                renderer: function (value, metadata, record, rowIndex, colIndex, store) {
                    var index = this.cbDenominacion.getStore().find('iddenominacion', value);
                    if (index >= 0) {
                        var newValue = this.cbDenominacion.getStore().getAt(index).data.denominacion;
                        record.data.denominacion = newValue;
                        return newValue;
                    }
                    return record.data.denominacion;
                }.bind(this)
            }, {
                header: this.idioma.lbCbxCuentaDestino,
                width: 155,
                flex: 2,
                sortable: true,
                dataIndex: 'cuentasdestino',
                editor: this.cbCuentaDestino,
                renderer: function (value) {
                    var cantCuentas = value.length;
                    var valor = new Array();
                    for (var i = 0; i < cantCuentas; i++) {
                        valor.push(value[i].value);
                    }
                    return valor;
                }.bind(this)

            }, {
                xtype: 'actioncolumn',
                width: 23,
                itemId: 'eliminar',
                sortable: false,
                menuDisabled: true,
                items: [{
                    iconCls: 'icondistra-eliminar',
                    tooltip: this.idioma.lbtooltipDeleteDestinoProd,
                    scope: this,
                    handler: function (view, rowIndex, colIndex, item, e, record, row) {
                        mostrarMensaje(2, this.idioma.lbConfirmDeleteDestinoProd, function (btnPress) {
                            if (btnPress == 'ok') {
                                var myMask = new Ext.LoadMask(view.getEl(), {msg: this.idioma.msgCargando});
                                myMask.show();
                                if (record.data.idasociacion) {
                                    Ext.Ajax.request({
                                        scope: this,
                                        url: 'deleteAsociacion',
                                        params: {
                                            idasociacion: record.data.idasociacion
                                        },
                                        callback: function (options, success, response) {
                                            myMask.hide();
                                            var responseData = Ext.decode(response.responseText);
                                            if (responseData.success == true) {
                                                this.stDestinoProduccion.remove(record);
                                                this.stDestinoProduccion.commitChanges();
                                                mostrarMensaje(1, this.idioma.lbDestinoProdDelete);
                                            } else {
                                                var msg = (responseData.msg === 3) ? this.idioma.lbDestinoProdError : this.idioma.lbError;
                                                mostrarMensaje(1, msg);
                                            }
                                        }
                                    });
                                } else {
                                    this.stDestinoProduccion.remove(record);
                                    this.stDestinoProduccion.commitChanges();
                                    myMask.hide();
                                }
                            }
                        }.bind(this));
                    }
                }]
            }
            ],
            dockedItems: [{
                xtype: 'toolbar',
                items: [
                    this.btnAdicionar
                ]
            }],
            listeners: {
                scope: this,
                itemdblclick:
                    function (dv, record, item, index, e) {
                        this.cbCuentaDestino.enable();
                        var rec = new Array();
                        var recconcatcta = new Array();
                        for (var i = 0; i < record.data.cuentasdestino.length; i++) {
                            rec.push(record.data.cuentasdestino[i].id);
                            recconcatcta.push(record.data.cuentasdestino[i].value);
                        }
                        this.recordItemdblCuentas = rec;
                        this.cbCuentaDestino.setRawValue(recconcatcta);
                        if (this.recordAsoc != null) {
                            this.stDestinoProduccion.removeAt(this.recordAsoc);
                        }
                        this.stCuentaDestino.load();
                    }
            }
        });

        this.panelDestinoPro = Ext.create('Ext.panel.Panel', {
            layout: 'fit',
            margin: '0 0 0 5',
            region: 'center',
            tbar: [this.cbUnidadMedida],
            items: [this.gridDestinoProd]

        });

        this.panelAsociar = Ext.create('Ext.panel.Panel', {
            layout: 'border',
            border: false,
            items: [this.treeGridCentros, this.panelDestinoPro]
        });

        this.layout = 'fit';
        this.autoValidate = true;
        this.resizable = false;
        this.constrain = true;
        this.modal = true;
        this.title = this.idioma.lbAsociar;
        this.width = 780;
        this.height = 477;
        this.fieldDefaults = {
            labelAlign: 'right',
            labelWidth: 90,
            msgTarget: 'qtip'
        };
        this.items = [this.panelAsociar
        ];
        this.tbar = [this.btnVistaR];
        this.buttons = [this.btnCancelarAso, this.btnGuardar];
        this.inicializarEventos();
        this.callParent(arguments);
    },

    inicializarEventos: function () {
        var me = this;

        this.cbUnidadMedida.on({
            scope: this,
            select: function (combo, records) {
                if (this.stDestinoProduccion.getCount()){
                //this.btnGuardar.enable();
                }
            }
        });

       /* this.cbCuentaDestino.getPicker().on({
            scope: this,
            beforerender: function () {

                //setTimeout(function () {
                    me.maskComboCuentaDestino = new Ext.LoadMask(me.cbCuentaDestino.getPicker().getEl(), {msg: me.idioma.msgCargando});
                    me.maskComboCuentaDestino.show();
                //}, 5);
            }
        });*/

        this.rowEditing.on({
            scope: this,
            edit: function (e, context) {
                this.cbCuentaDestino.disable();
                if (this.tareaModificarDestino) {
                    Ext.TaskManager.stop(this.tareaModificarDestino);
                }
                this.btnAdicionar.enable();
                this.recordAsoc = null;
                if (!context.record.data.iddestino && !context.record.data.idcuenta) {
                    var objectTreeCuenta = this.treeGridCentros.getSelectionModel().getSelection()[0];
                    context.record.data.idcentrocosto = objectTreeCuenta.data.idcuenta;
                    context.record.data.idcuenta = this.cbCuentaDestino.getValue().slice();
                    context.record.data.concatcta = this.cbCuentaDestino.getRawValue().slice();
                    var arrayTempConcat = JSON.parse("[" + context.record.data.concatcta + "]");
                    var cantCuentas = context.record.data.idcuenta.length;
                    var tempCuentas = new Array();
                    for (var i = 0; i < cantCuentas; i++) {
                        tempCuentas.push({
                            id: context.record.data.idcuenta[i],
                            value: arrayTempConcat[i],
                        });

                    }

                    context.record.data.cuentasdestino = tempCuentas;
                    context.record.data.idunidadmedida = this.cbUnidadMedida.getValue();
                    context.record.data.iddestino = this.stCuentaDestino.getRange()[0].data.iddestino;
                    context.record.commit();
                    if (this.recordItemdblCuentas) {
                        this.recordItemdblCuentas = new Array();
                    }

                } else {
                    context.record.data.idcuenta = this.cbCuentaDestino.getValue().slice();

                }

            },
            cancelEdit: function (editor, context, eOpts) {
                this.cbCuentaDestino.disable();
                if (this.recordItemdblCuentas) {
                    this.recordItemdblCuentas = new Array();
                }
                if (this.tareaModificarDestino) {
                    Ext.TaskManager.stop(this.tareaModificarDestino);
                }
                this.btnAdicionar.enable();
                if (context.record.phantom) {
                    this.stDestinoProduccion.remove(context.record);
                }
            },

            validateedit: function (editor, context, eOpts) {
                //this.btnGuardar.enable();
            },
        });

        this.stDestinoProduccion.on({
            scope: this,
            load: function (store, records, successful) {
                if (records.length) {
                    this.cbUnidadMedida.select(parseInt(records[0].data.idunidadmedida));
                }
                var arraydenom = store.proxy.reader.jsonData.configdenom;
                var arrayrecdenom = this.stDenominacion.getRange();
                for (var i = 0; i < arrayrecdenom.length; i++) {
                    if (arraydenom.indexOf(arrayrecdenom[i].data.denominacion) == -1) {
                        this.stDenominacion.remove(arrayrecdenom[i]);
                    }
                }
                if(!records.length){
                    //this.btnGuardar.disable();
                }
                this.maskDestino.hide();
                var unidad = this.cbUnidadMedida.getValue();
                var valorgriddestino = this.stDestinoProduccion.getRange().slice();
                var lengthdest = valorgriddestino.length;
                var arraycopydestino = new Array();
                for (var i = 0; i < lengthdest; i++) {
                    arraycopydestino.push(valorgriddestino[i].data);
                }
                if(this.validarbtnAcep){
                    Ext.TaskManager.stop(this.validarbtnAcep);
                }
                this.validarbtnGuardar(unidad, Ext.encode(arraycopydestino));
            },
        });

        this.stGridUnidad.on({
            scope: this,
            load: function (store, records, successful) {
                this.cbUnidadMedida.select(records[0]);
            }
        });

        this.cbDenominacion.on({
            scope: this,
            select: function (combo, records) {
                var existe = this.stDestinoProduccion.findRecord('denominacion', records[0].data.denominacion)
                if (existe) {
                    combo.reset();
                    mostrarMensaje(1, this.idioma.lbExisteDenominacion);
                } else {
                    this.stCuentaDestino.load();
                    this.cbCuentaDestino.enable();
                }

            },
        });

        this.stCuentaDestino.on({
            scope: this,
            beforeload: function (store, operation) {
                operation.params = {
                    denominacion: this.cbDenominacion.getRawValue()
                }
            },
            load: function (store, records) {
                this.cbCuentaDestino.select(this.recordItemdblCuentas);
                if (!records.length) {
                    this.cbCuentaDestino.disable();
                    mostrarMensaje(1, this.idioma.lbNoDataCuentasDes);
                }
                /*setTimeout(function () {
                    //me.maskComboCuentaDestino.hide();
                }, 2000);*/

            },
        });

        this.on({
            scope: this,
            close: function (editor, context, eOpts) {
                /*Ext.TaskManager.stop(this.validarbtnAcep);*/
                if (this.tareaModificarDestino) {
                    Ext.TaskManager.stop(this.tareaModificarDestino);
                }
                /* if (this.tareaModificarDestinoUnidad) {
                     Ext.TaskManager.stop(this.tareaModificarDestinoUnidad);
                 }*/
            },
            show: function (window, eOpts) {
                this.mask = new Ext.LoadMask(this.getEl(), {msg: this.idioma.msgCargando});
                this.mask.show();
            }
        });

        this.cbCuentaDestino.on({
            scope: this,
            beforeselect: function (combo, records) {
                var objectTreeCuenta = this.treeGridCentros.getSelectionModel().getSelection()[0];
                if (objectTreeCuenta.data.idmoneda != records.data.idmoneda) {
                    mostrarMensaje(1, this.idioma.lbErrorMonedaNoCoinsiden);
                    return false;
                }
            }
        });

        this.stCuentasGasto.on({
            scope: this,
            beforeload: function (store, operation) {
                operation.params = {
                    node: this.node //this.idcentrocosto
                }
            },
            beforeexpand: function (store) {
                this.stCuentasGasto.proxy.extraParams.filter = '';
                this.node = store.data.idcuenta
            },
            load: function (store) {
                this.mask.hide();

            }
        });

        this.btnCancelarAso.on({
            scope: this,
            click: function () {
                if(this.validarbtnAcep){
                    Ext.TaskManager.stop(this.validarbtnAcep);
                }
                this.close();
            }
        });

        this.treeGridCentros.on({
            scope: this,
            select: function (tree, record, index) {
                this.stDestinoProduccion.load({
                    params: {
                        idcentrocosto: record.data.idcuenta
                    }
                });
                this.btnAdicionar.enable();
                //this.btnGuardar.disable();
                this.maskDestino = new Ext.LoadMask(this.gridDestinoProd.getEl(), {msg: this.idioma.msgCargando});
                this.maskDestino.show();
            },
            beforeselect: function (tree, record, index) {
                if (!record.data.leaf) {
                    this.rowEditing.cancelEdit();
                    this.btnAdicionar.disable();
                    return false;
                }
            }
        });

        this.btnVistaR.on({
            scope: this,
            click: function (btn, event) {
                this.crearVentanaVistaReporte();
            }
        });


    },

    inicializarStores: function () {

        Ext.define('Asociacion', {
            extend: 'Ext.data.Model',
            fields: [{
                name: 'idasociacion',
                //type: 'int'
            }, {
                name: 'denominacion',
                //type: 'int',
            }, {
                name: 'idcentrocosto',
                //type: 'string'
            }, {
                name: 'idunidadmedida',
                //mapping: 'cuentadestino'
            }, {
                name: 'idestructuracomun',
                //type: 'int'
            }, {
                name: 'cuentasdestino'
            }, {
                name: 'iddestino'
            }, {
                name: 'concatcta'
            }]
        });

        Ext.define('CuentasGasto', {
            extend: 'Ext.data.Model',
            fields: [{
                name: 'idcuenta',
            }, {
                name: 'qtip',
                mapping: 'text'
            }, {
                name: 'text',
            }, {
                name: 'concatcta',
            }, {
                name: 'descripcion',
            }, {
                name: 'leaf',
            }, {
                name: 'idcuentapadre'
            }, {
                name: 'idmoneda'
            }
            ],
            proxy: {
                type: 'ajax',
                url: 'getCentrosCostoAsociar'
            }
        });

        Ext.define('Unidades', {
            extend: 'Ext.data.Model',
            fields: [{
                name: 'idunidad',
                type: 'int',
            }, {
                name: 'idmagnitud',
            }, {
                name: 'idunidadmedida',
            }, {
                name: 'magnitud',
            }, {
                name: 'unidadmedida',
            }]
        });

        this.stDestinoProduccion = Ext.create('Ext.data.Store', {
            model: 'Asociacion',
            proxy: {
                type: 'ajax',
                api: {
                    read: 'getAsociacion',
                    update: 'saveAsociacion',
                    create: 'saveAsociacion'
                },
                reader: {
                    type: 'json',
                    root: 'data'
                },
                writer: {
                    type: 'json'
                }
            },
        });

        this.stGridUnidad = Ext.create('Ext.data.Store', {
            autoLoad: true,
            model: 'Unidades',
            proxy: {
                type: 'ajax',
                api: {
                    read: 'getUnidades',
                    /*update: 'saveUnidadMedida',
                    create: 'saveUnidadMedida'*/
                },
                reader: {
                    type: 'json',
                    root: 'unidades'
                },
                writer: {
                    type: 'json'
                }
            },
        });

        this.stMagnitud = Ext.create('Ext.data.Store', {
            autoLoad: true,
            fields: [{
                name: 'idmagnitud',
                mapping: 'id'
            }, {
                name: 'magnitud',
                mapping: 'text'
            }],
            proxy: {
                type: 'ajax',
                url: 'getMagnitudUnidadMedida',
                reader: {
                    type: 'json',
                    root: 'data'
                },
                writer: {
                    type: 'json'
                }
            }
        });

        this.stCuentaDestino = Ext.create('Ext.data.Store', {
            fields: [{
                name: 'id',
            }, {
                name: 'value',
            }, {
                name: 'idmoneda',
            }, {
                name: 'text',
            }, {
                name: 'iddestino',
            }],
            proxy: {
                type: 'ajax',
                url: 'getCuentasDestino',
                reader: {
                    type: 'json',
                    root: 'data'
                },
                writer: {
                    type: 'json'
                }
            }
        });

        this.stDenominacion = Ext.create('Ext.data.Store', {
            fields: [
                {
                    name: 'iddenominacion'
                },
                {
                    name: 'denominacion'
                }
            ],
            data: [
                {
                    iddenominacion: 1,
                    denominacion: 'Producción terminada'
                }, {
                    iddenominacion: 2,
                    denominacion: 'Costo de venta'
                }, {
                    iddenominacion: 3,
                    denominacion: 'Insumos'
                },
                {
                    iddenominacion: 4,
                    denominacion: 'Traspaso'
                }
            ]
        });

        this.stCuentasGasto = Ext.create('Ext.data.TreeStore', {
            model: 'CuentasGasto'
        });

    },

    validarModificarDestino: function (denominacion, valorCuentas) {
        this.tareaModificarDestino = {
            run: function () {
                if (denominacion && valorCuentas) {
                    valorCuentas.sort(function (a, b) {
                        if (a.id > b.id) {
                            return 1;
                        }
                        if (a.id < b.id) {
                            return -1;
                        }
                        // a must be equal to b
                        return 0;
                    });
                    var temp = this.cbCuentaDestino.getValueComboTree();
                    temp.sort(function (a, b) {
                        if (a.id > b.id) {
                            return 1;
                        }
                        if (a.id < b.id) {
                            return -1;
                        }
                        // a must be equal to b
                        return 0;
                    });

                    var valorctatemp = Ext.encode(valorCuentas);
                    var strTemp = Ext.encode(temp);
                    this.rowEditing.getEditor().floatingButtons.items.items[1].setDisabled(!(this.cbDenominacion = denominacion && valorctatemp != strTemp && this.cbCuentaDestino.getValueComboTree().length));
                } else {
                    this.rowEditing.getEditor().floatingButtons.items.items[1].setDisabled(!(/*this.tfCodigo.isValid() && */this.cbDenominacion.isValid() && this.cbCuentaDestino.isValid()));
                }
            },
            interval: 300,
            scope: this
        };
        Ext.TaskManager.start(this.tareaModificarDestino);
    },

    validarbtnGuardar: function (unidad, griddes) {
        this.validarbtnAcep = {
            run: function () {
                if ( griddes != '[]' && unidad) {
                    var griddestino = this.stDestinoProduccion.getRange();
                    var totalrange = griddestino.length;
                    var arrayreal = new Array();
                    for (var i = 0; i < totalrange; i++) {
                        arrayreal.push(griddestino[i].data)
                    }
                    var tempUnidad = this.cbUnidadMedida.getValue();
                    var destinos = false;
                    if (Ext.encode(arrayreal) == griddes) {
                        destinos = true;
                    }
                    this.btnGuardar.setDisabled(destinos && tempUnidad == unidad );
                    if (this.btnAdicionar.disabled ) {
                        this.btnGuardar.disable();
                    }
                } else {
                    this.btnAceptar.setDisabled(!(this.cbUnidadMedida.isValid() && this.stDestinoProduccion.getCount() > 0 && !this.btnAdicionar.disabled ));
                }
            },
            interval: 300,
            scope: this
        };
        Ext.TaskManager.start(this.validarbtnAcep);
    },

    crearVentanaVistaReporte: function () {
        this.btnCancelarReporte = Ext.create('Ext.Button', {
            //margin: '5 0 0 225',
            tooltip: 'Cerrar ventana',
            text: "<span class='icondistra-cancelar'></span>Cancelar",
            scope: this,
            handler: function (btn) {
                this.winCmp.destroy();
            }
            //height: 23,
            //disabled: true
        });
        this.btnAceptarReporte = Ext.create('Ext.Button', {
            //margin: '5 0 0 225',
            tooltip: this.idioma.tooltipbtnAceptarReporte,
            text: "<span class='icondistra-aceptar'></span>Aceptar",
            scope: this,
            handler: function (btn) {
                window.datareporte = true;
            }

            //height: 23,
            //disabled: true
        });
        var me = this;
        this.winCmp = new Ext.Window({
            width: 450,
            height: 318,
            constrain: true,
            modal: true,
            closeAction: 'destroy',
            html: '<iframe  " id = "idframecc" style="border: none;" src= "/contabilidad/contabilidad_costos/costeo/index.php/confcosteo/mostrarcomprobanteExt4" width="100%" height="100%"></iframe>',
            buttons: [
                this.btnCancelarReporte, this.btnAceptarReporte
            ],
            listeners: {
                afterrender: {
                    fn: function (cmp) {
                        me.myMask = new Ext.LoadMask(cmp.getEl(), {msg: me.idioma.msgCargando});
                        me.myMask.show();
                        document.getElementById('idframecc').onload = function () {
                            setTimeout(function () {
                                me.myMask.hide();
                            }, 800);
                        };
                    }
                },
            }

        });
        this.winCmp.show();

    }

});
