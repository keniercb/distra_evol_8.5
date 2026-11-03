Ext.define('PRT.view.WindowConfCosteo', {
    extend: 'Ext.window.Window',
    alias: 'widget.windowconfcosteo',

    //idioma: eval('PRT.language.' + lang),
    idioma: PRT.language[lang],
    autoShow: true,

    initComponent: function () {
        this.inicializarStores();


        this.rowEditingUnidad = Ext.create('Ext.grid.plugin.RowEditing', {
            autoLoad: true,
            errorSummary: false,
            saveBtnText: this.idioma.lbbtnAceptar,
            cancelBtnText: this.idioma.lbbtnCancelar
        });

        this.btnAdicionarUnidad = Ext.create('Ext.Button', {
            tooltip: this.idioma.tooltipbtnAddUnidad,
            tabIndex: 6,
            text: this.idioma.btnAdicionar,
            //disabled: true,
            scope: this,
            handler: function (button, e) {
                var count = this.stGridUnidad.getCount();
                this.stGridUnidad.insert(count, new Unidades());
                this.recordUnidad = count;
                this.rowEditingUnidad.startEdit(count, 0);
                this.btnAdicionarUnidad.disable();
                this.stMagnitud.load();
                this.validarModificarDestinoUnidad();
            }
        });

        this.cbMagnitud = Ext.create('Ext.form.ComboBox', {
            name: 'idmagnitud',
            tabIndex: 6,
            emptyText: this.idioma.lbSeleccione,
            forceSelection: true,
            //fieldLabel: this.idioma.lbMagnitud,
            labelAlign: 'top',
            labelStyle: 'margin: 2 2 3 0',
            store: this.stMagnitud,
            allowBlank: false,
            blankText: this.idioma.blankTextField,
            editable: false,
            flex: 1,
            queryMode: 'local',
            valueField: 'idmagnitud',
            displayField: 'magnitud',
            enforceMaxLength: true,
            listConfig: {
                minWidth: null
            },


        });

        this.cbUnidadMedida = Ext.create('Ext.form.ComboBox', {
            name: 'idunidadmedida',
            tabIndex: 7,
            emptyText: this.idioma.lbSeleccione,
            forceSelection: true,
            //fieldLabel: this.idioma.lbCbxUnidadMedida,
            labelAlign: 'top',
            labelStyle: 'margin: 2 2 3 0',
            margin: '0 2 3 5',
            store: this.stUnidadMedida,
            allowBlank: false,
            blankText: this.idioma.blankTextField,
            editable: false,
            flex: 1,
            queryMode: 'local',
            valueField: 'id',
            displayField: 'abreviaturaunidadmedida',
            enforceMaxLength: true,
            disabled: true,
            listConfig: {
                minWidth: null
            },


        });

        this.gridUnidadMedida = Ext.create('Ext.grid.Panel', {
            viewConfig: {loadMask: false},
            scope: this,
            plugins: [this.rowEditingUnidad],
            width: 565,
            height: 175,
            margin: '0 0 8 0',
            store: this.stGridUnidad,
            columns: [{
                text: 'Magnitud',
                sortable: true,
                flex: 1,
                //width: 150,
                dataIndex: 'idmagnitud',

                editor: this.cbMagnitud,
                renderer: function (value, metadata, record, rowIndex, colIndex, store) {
                    return record.data.magnitud;
                }


            }, {
                header: 'Unidad de medida',
                width: 195,
                flex: 1,
                sortable: true,
                dataIndex: 'idunidadmedida',

                editor: this.cbUnidadMedida,
                renderer: function (value, metadata, record, rowIndex, colIndex, store) {
                    return record.data.unidadmedida;
                }

            }, {
                xtype: 'actioncolumn',
                width: 23,
                sortable: false,
                menuDisabled: true,
                items: [{
                    iconCls: 'icondistra-eliminar',
                    tooltip: this.idioma.lbtooltipEliminarUnidadM,
                    scope: this,
                    handler: function (view, rowIndex, colIndex, item, e, record, row) {
                        mostrarMensaje(2, this.idioma.lbDeleteConfirmUnidadM, function (btnPress) {
                            if (btnPress == 'ok') {
                                var myMask = new Ext.LoadMask(view.getEl(), {msg: this.idioma.msgCargando});
                                myMask.show();
                                if (record.data.idunidad) {
                                    Ext.Ajax.request({
                                        scope: this,
                                        url: 'deleteUnidadMedida',
                                        params: {
                                            idunidadm: record.data.idunidad
                                        },
                                        callback: function (options, success, response) {
                                            myMask.hide();
                                            var responseData = Ext.decode(response.responseText);
                                            view.refresh();
                                            if (responseData.success == true) {
                                                this.stGridUnidad.remove(record);
                                                this.stGridUnidad.commitChanges();
                                                mostrarMensaje(1, this.idioma.lbUnidadMEliminada);
                                                Ext.TaskManager.stop(this.tarea);
                                                this.btnAceptar.enable();
                                            } else {
                                                var msg = (responseData.msg === 3) ? this.idioma.lbUnidadMEliminadoError : this.idioma.lbError;
                                                mostrarMensaje(1, msg);
                                            }
                                        }
                                    });
                                } else {

                                    this.stGridUnidad.remove(record);
                                    myMask.hide();
                                    //this.stGridUnidad.commitChanges();
                                    mostrarMensaje(1, this.idioma.lbUnidadMEliminada);

                                    if (this.tarea) {
                                        Ext.TaskManager.stop(this.tarea);
                                    }

                                    this.btnAceptar.enable();
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
                    this.btnAdicionarUnidad
                ]
            }],
            listeners: {
                scope: this,
                itemclick:
                    function (dv, record, item, index, e) {
                        this.idinductor = record.data['idinductor'];
                    },
                itemdblclick:
                    function (dv, record, item, index, e) {
                        var indexmagnitud = this.stMagnitud.find('idmagnitud', record.data.idmagnitud);
                        var magnitud = this.stMagnitud.getAt(indexmagnitud);
                        this.cbMagnitud.select(magnitud);

                        this.stUnidadMedida.load({
                            params: {
                                idmagnitud: record.data.idmagnitud
                            }
                        });
                        this.cbUnidadMedida.select(record.data.idunidadmedida);

                        if (this.recordUnidad != null) {
                            this.stGridUnidad.removeAt(this.recordUnidad);
                        }
                        if (this.tareaModificarDestinoUnidad) {
                            Ext.TaskManager.stop(this.tareaModificarDestinoUnidad);
                        }
                        //Ext.TaskManager.stop(this.tareaModificarDestinoUnidad);
                        var valorMagnitud = this.cbMagnitud.getValue();
                        var valorUnidad = this.cbUnidadMedida.getValue();
                        this.btnAdicionarUnidad.disable();
                        this.validarModificarDestinoUnidad(valorMagnitud, valorUnidad);
                    }
            }
        });

        this.recordDestinoProd;

        this.rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {

            autoLoad: true,
            errorSummary: false,
            saveBtnText: this.idioma.lbbtnAceptar,
            cancelBtnText: this.idioma.lbbtnCancelar
        });

        this.cbMetodoCosto = Ext.create('Ext.form.ComboBox', {
            tabIndex: 1,
            emptyText: this.idioma.lbSeleccione,
            forceSelection: true,
            editable: false,
            multiSelect: true,
            labelStyle: 'margin: 3 5 3 0',
            margin: '0 0 0 0',
            fieldLabel: this.idioma.lbCbxMetodoCosto,
            labelAlign: 'top',
            width: 200,
            store: Ext.create('Ext.data.Store', {
                fields: [
                    {
                        name: 'idmetodo'
                    },
                    {
                        name: 'metodo'
                    }
                ],
                data: [
                    {
                        idmetodo: 0,
                        metodo: 'Costo predeterminado'
                    },
                    {
                        idmetodo: 1,
                        metodo: 'Costo real'
                    }
                ]
            }),
            allowBlank: false,
            blankText: this.idioma.blankTextField,
            editable: false,
            //flex: 1,
            queryMode: 'local',
            valueField: 'idmetodo',
            displayField: 'metodo',
            enforceMaxLength: true,
            listConfig: {
                minWidth: null
            },


        });

        this.cbParteFormatoDetino = Ext.create('Ext.form.ComboBox', {
            tabIndex: 2,
            flex: 1,
            labelStyle: 'margin: 3 5 3 0',
            margin: '0 0 0 5',
            fieldLabel: this.idioma.lbColumnPartForDestino,
            labelAlign: 'top',
            store: this.stParteFormato,
            valueField: 'idparteformato',
            name: 'nomformatodestino',
            displayField: 'nombre',
            editable: false,
            emptyText: 'Seleccione...',
            blankText: this.idioma.blankTextField,
            queryMode: 'local',
            allowBlank: false

        });

        this.cbCuentaGasto = Ext.create('CostoComun.components.ComboTree', {
            tabIndex: 3,
            fieldLabel: this.idioma.lbCbxProdPro,
            multiSelect: true,
            displayField: 'concatcta',
            displayTextTree: 'text',
            valueField: 'idcuenta',
            //anchor: '100%',
            leafField: 'leaf',
            emptyText: this.idioma.lbSeleccione,
            margin: '0 0 0 5',
            url: 'getCuentasGastos',
            rootData: 'data',
            selectParent: true,
            showSearch: false,
            labelAlign: 'top',
            allowBlank: false,
            //flex: 2,
            width: 214,
            editable: false,
            forceSelection: true,
        });

        this.cbDenominacion = Ext.create('Ext.form.ComboBox', {
            tabIndex: 4,
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

        this.cbCuentaDestino = Ext.create('CostoComun.components.ComboTree', {
            tabIndex: 5,
            name: 'cuentadestino',
            displayField: 'concatcta',
            displayTextTree: 'text',
            valueField: 'idcuenta',
            leafField: 'leaf',
            url: 'getCuentasPorTipo',
            emptyText: this.idioma.lbSeleccione,
            rootData: 'datos',
            autoLoadComboTree: false,
            selectParent: true,
            showSearch: false,
            labelAlign: 'top',
            allowBlank: false,
            flex: 1,

            //disabled: true

        });

        this.btnCancelar = Ext.create('Ext.Button', {
            tabIndex: 8,
            text: this.idioma.lbbtnCancelar,
            scope: this,
            tooltip: this.idioma.tooltipbtnCancelar,
            height: 23,
        });

        this.btnAceptar = Ext.create('Ext.Button', {
            tabIndex: 9,
            tooltip: this.idioma.lbtooltipBtnAceptar,
            text: this.idioma.lbbtnAceptar,
            scope: this,
            height: 23,
            disabled: true
        });

        this.btnAdicionar = Ext.create('Ext.Button', {
            tabIndex: 3,
            tooltip: this.idioma.lbtooltipAdicionarDestino,
            text: this.idioma.btnAdicionar,
            scope: this,
            handler: function (button, e) {
                this.cbCuentaDestino.reset();
                var count = this.stDestinoProduccion.getCount();
                this.recordDestinoProd = count;
                var modeldestinoprod = Ext.create('DestinoProduccion');

                this.stDestinoProduccion.insert(count, modeldestinoprod);

                /*if (count) {
                    var temp = this.stDestinoProduccion.getAt(count - 1);
                    modeldestinoprod.data.coddestinoprod = temp.data.coddestinoprod + 1;

                } else {
                    modeldestinoprod.set('coddestinoprod', 1);
                }*/
                this.rowEditing.startEdit(count, 0);
                this.btnAdicionar.disable();
                this.validarModificarDestino();
            }
        });

        this.gridDestinoProd = Ext.create('Ext.grid.Panel', {
            viewConfig: {loadMask: false},
            scope: this,
            plugins: [this.rowEditing],
            width: 400,
            height: 150,
            margin: '0 0 8 0',
            store: this.stDestinoProduccion,
            columns: [/*{
                text: this.idioma.lbCodigo,
                sortable: true,
                flex: 1,
                //width: 150,
                dataIndex: 'coddestinoprod',

                editor: this.tfCodigo

            },*/ {
                text: this.idioma.lbCbxDenominacion,
                sortable: true,
                flex: 1,
                //width: 150,
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
                width: 195,
                flex: 1,
                sortable: true,
                dataIndex: 'idcuenta',
                editor: this.cbCuentaDestino,
                renderer: function (value, metadata, record, rowIndex, colIndex, store) {
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
                                if (record.data.iddestino) {

                                    Ext.Ajax.request({
                                        scope: this,
                                        url: 'deleteDestinoProduccion',
                                        params: {
                                            iddestino: record.data.iddestino
                                        },
                                        callback: function (options, success, response) {
                                            myMask.hide();
                                            var responseData = Ext.decode(response.responseText);
                                            //view.refresh();
                                            if (responseData.success == true) {
                                                this.stDestinoProduccion.remove(record);
                                                this.stDestinoProduccion.commitChanges();
                                                mostrarMensaje(1, this.idioma.lbDestinoProdDelete);
                                            } else {
                                                var msg = (responseData.msg === 3) ? this.idioma.lbDestinoProdError : this.idioma.lbError;
                                                mostrarMensaje(1, msg);
                                            }
                                            if (!this.stDestinoProduccion.getCount()) {
                                                this.cbMetodoCosto.reset();
                                                this.cbParteFormatoDetino.reset();
                                                this.cbMagnitud.reset();
                                                this.cbUnidadMedida.reset();
                                                this.cbCuentaGasto.reset();
                                                if (this.validarbtnAcep) {
                                                    Ext.TaskManager.stop(this.validarbtnAcep);
                                                    this.validarbtnAceptar();
                                                }
                                            }
                                        }
                                    });
                                } else {
                                    this.stDestinoProduccion.remove(record);
                                    this.stDestinoProduccion.commitChanges();
                                    myMask.hide();
                                    //view.refresh();
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
                itemclick:
                    function (dv, record, item, index, e) {
                        this.idinductor = record.data['idinductor'];
                    },
                itemdblclick:
                    function (dv, record, item, index, e) {
                        if (this.tareaModificarDestino) {
                            Ext.TaskManager.stop(this.tareaModificarDestino);
                        }
                        this.btnAdicionar.disable();
                        this.cbCuentaDestino.enable();

                        var rec = this.stDenominacion.findRecord('denominacion', record.data.denominacion);

                        this.cbCuentaDestino.params = {iddenominacion: rec.data.iddenominacion};

                        this.cbCuentaDestino.noResetBeforeLoad = true;

                        this.cbCuentaDestino.reloadStoreComboTree();

                        this.cbCuentaDestino.noResetBeforeLoad = false;

                        this.cbCuentaDestino.enable();

                        this.cbCuentaDestino.reset();

                        this.cbCuentaDestino.setValueComboTree(record.data.idcuenta);

                        if (this.recordDestinoProd != null) {
                            this.stDestinoProduccion.removeAt(this.recordDestinoProd);
                        }


                        this.validarModificarDestino(record.data.denominacion, record.data.idcuenta);

                        /*var denominacion = record.data.denominacion;
                        var arraycta = record.data.cuentadestino.split(',');
                        var cantcta = arraycta.length;
                        var tempcta = new Array();
                        for (var i = 0; i < cantcta; i++) {

                            tempcta.push(parseInt(arraycta[i]));
                        }

                        var recorcbdeno = this.stDenominacion.findRecord('denominacion', record.data.denominacion);

                        this.cbCuentaDestino.storeComboTree.load({
                            params: {
                                iddenominacion: recorcbdeno.data.iddenominacion
                            }
                        });
                        this.validarModificarDestino(denominacion, tempcta);
*/
                        /*if (this.btnAdicionar.disabled) {
                            if (this.recordDestinoProd != null) {
                                this.stDestinoProduccion.removeAt(this.recordDestinoProd);
                            }
                        }*/
                        /*if (this.tareaDestino) {
                            Ext.TaskManager.stop(this.tareaDestino);
                        }
                        this.validarDestino();*/

                    }
            }
        });


        this.frame = true;
        this.autoValidate = true;
        this.resizable = false;
        this.constrain = true;
        this.modal = true;
        this.title = this.idioma.lbConfiguracion;
        this.bodyPadding = 8;
        this.width = 620;
        this.height = 530;
        this.fieldDefaults = {
            labelAlign: 'right',
            labelWidth: 90,
            msgTarget: 'qtip'
        };
        this.items = [{
            layout: 'column',
            //xtype: 'fieldset',
            margin: '5 5 5 5',
            frame: true,
            items: [
                this.cbMetodoCosto,
                this.cbParteFormatoDetino,
                this.cbCuentaGasto
            ]
        }, {
            xtype: 'fieldset',
            title: this.idioma.lbGridDestinoProd,
            defaultType: 'textfield',
            layout: 'anchor',
            defaults: {
                anchor: '100%'
            },
            items: [this.gridDestinoProd]
        }, {
            xtype: 'fieldset',
            title: this.idioma.lbFieldsetUnidaMedida,
            defaultType: 'textfield',
            layout: 'anchor',
            defaults: {
                anchor: '100%'
            },
            items: [this.gridUnidadMedida]
        }];
        this.buttons = [this.btnCancelar,
            this.btnAceptar];
        this.inicializarEventos();
        this.callParent(arguments);
    },

    inicializarEventos: function () {

        this.cbMagnitud.on({
            scope: this,
            select: function () {
                this.cbUnidadMedida.reset();
                this.stUnidadMedida.load();
            }
        });

        this.cbUnidadMedida.on({
            scope: this,
            select: function (combo, records) {
                var unidades = this.stGridUnidad.getRange();
                var unidadeslength = this.stGridUnidad.getRange().length;
                for (var i = 0; i < unidadeslength; i++) {
                    if (unidades[i].data.idunidadmedida == records[0].data.idunidadmedida) {
                        mostrarMensaje(1, this.idioma.lbExisteUnidad);
                        this.cbUnidadMedida.reset();
                    }

                }
            }
        });

        this.rowEditing.on({
            scope: this,
            edit: function (e, context) {
                this.cbCuentaDestino.disable();
                if (this.tareaModificarDestino) {
                    Ext.TaskManager.stop(this.tareaModificarDestino);
                }

                this.btnAdicionar.enable();
                this.recordDestinoProd = null;
                var cantcuentasdest = this.cuentasdestinoSelected.length;
                var cuentasdest = new Array();
                var tempcuentadestrec = {};
                for (var i = 0; i < cantcuentasdest; i++) {
                    tempcuentadestrec = {};
                    tempcuentadestrec['id'] = this.cuentasdestinoSelected[i].raw.idcuenta;
                    tempcuentadestrec['value'] = this.cuentasdestinoSelected[i].raw.concatcta;
                    tempcuentadestrec['idmoneda'] = this.cuentasdestinoSelected[i].raw.idmoneda;
                    tempcuentadestrec['text'] = this.cuentasdestinoSelected[i].raw.text;
                    cuentasdest.push(tempcuentadestrec);
                }

                if (!context.record.data.iddestino && !context.record.data.idcuenta) {
                    //context.record.data.idcuenta = this.cbCuentaDestino.getValueComboTree().slice();
                    context.record.data.idcuenta = cuentasdest.slice();
                    context.record.commit();
                } else {
                    //context.record.data.idcuenta = this.cbCuentaDestino.getValueComboTree().slice();
                    context.record.data.idcuenta = cuentasdest.slice();
                }

            },
            cancelEdit: function (editor, context, eOpts) {
                this.cbCuentaDestino.disable();
                //Ext.TaskManager.stop(this.tareaDestino);
                /* if (this.tareaDestino) {
                     Ext.TaskManager.stop(this.tareaDestino);
                 }*/

                if (this.tareaModificarDestino) {
                    Ext.TaskManager.stop(this.tareaModificarDestino);
                }
                this.btnAdicionar.enable();
                if (context.record.phantom) {
                    this.stDestinoProduccion.remove(context.record);
                }
            },
            /* validateedit: function (editor, context) {
                /!* var cod = context.record.data.coddestinoprod;
                 this.validarCod(cod);*!/
             },*/

            /*beforeedit: function (editor, context) {

            }*/


        });

        this.cbCuentaDestino.treegrid.on({
            scope: this,
            selectionchange: function (cb, selected, index) {
                this.cuentasdestinoSelected = selected;
            }
        });

        this.rowEditingUnidad.on({
            scope: this,
            edit: function (e, context) {

                this.cbCuentaDestino.disable();

                if (this.tareaModificarDestinoUnidad) {
                    Ext.TaskManager.stop(this.tareaModificarDestinoUnidad);
                }
                context.record.data.magnitud = this.cbMagnitud.getRawValue();
                context.record.data.unidadmedida = this.cbUnidadMedida.getRawValue();
                this.recordUnidad = null;
                /*if (this.tareaDestino) {
                    Ext.TaskManager.stop(this.tareaDestino);
                }*/
                this.btnAdicionarUnidad.enable();
                //context.record.data.tempdestino = context.record.data.cuentadestino;
                context.record.commit();
            },
            cancelEdit: function (editor, context, eOpts) {
                this.cbCuentaDestino.disable();
                //Ext.TaskManager.stop(this.tareaDestino);
                /* if (this.tareaDestino) {
                     Ext.TaskManager.stop(this.tareaDestino);
                 }*/

                if (this.tareaModificarDestinoUnidad) {
                    Ext.TaskManager.stop(this.tareaModificarDestinoUnidad);
                }
                this.btnAdicionarUnidad.enable();
                if (context.record.phantom) {
                    this.stGridUnidad.remove(context.record);
                }
            },
            validateedit: function (editor, context) {
                /*var cod = context.record.data.coddestinoprod;
                this.validarCod(cod);*/
            },

            beforeedit: function (editor, context) {

            }


        });

        this.stDestinoProduccion.on({
            scope: this,
            load: function (store, records, successful) {
                if (store.getCount()) {
                    this.configuracion = Ext.decode(records[0].data.configuracion);
                    this.cbCuentaGasto.setValueComboTree(this.configuracion[0].idcuenta)
                    this.cbMetodoCosto.select(Ext.decode(this.configuracion[0].idmetodo));
                    this.cbParteFormatoDetino.select(records[0].data.idparteformato);
                } else {
                    this.myMask.hide();
                }
                this.stGridUnidad.load();
            }
        });

        this.stGridUnidad.on({
            scope: this,
            load: function (store, records) {
                var me = this;
                //if (records.length && this.stDestinoProduccion.getRange().length) {
                //Ext.TaskManager.stop(this.validarbtnAcep);

                var valorcuentagasto = this.cbCuentaGasto.getValueComboTree().slice();

                var valorgriddestino = this.stDestinoProduccion.getRange().slice();
                var lengthdest = valorgriddestino.length;
                var arraycopy = new Array();
                for (var i = 0; i < lengthdest; i++) {
                    arraycopy.push(valorgriddestino[i].data);
                }

                var valorgridunidad = this.stGridUnidad.getRange().slice();
                var lengthunid = valorgridunidad.length;
                var arraycopyunid = new Array();
                for (var i = 0; i < lengthunid; i++) {
                    arraycopyunid.push(valorgridunidad[i].data);
                }
                me.validarbtnAceptar(me.cbMetodoCosto.getValue(), me.cbParteFormatoDetino.getValue(), valorcuentagasto,
                    Ext.encode(arraycopy), Ext.encode(arraycopyunid));
                /*}else{
                    this.validarbtnAceptar();
                }*/
                me.myMask.hide();
            },
            beforeload: function () {

            }
        });

        this.stUnidadMedida.on({
            scope: this,
            beforeload: function (store, operation) {
                operation.params = {
                    idmagnitud: this.cbMagnitud.getValue()
                };
            },
            load: function (store, records, successful) {
                /*if (this.configuracion) {
                    /!*var indexunidadmedida = this.cbUnidadMedida.getStore().find('idunidadmedida', this.configuracion.idunidadmedida);
                    var unidadmedida = this.cbUnidadMedida.getStore().getAt(indexunidadmedida);
                    this.cbUnidadMedida.select(unidadmedida);*!/
                }

                if (this.tareaAceptar) {
                    Ext.TaskManager.stop(this.tareaAceptar);
                }
                /!*if (this.tarea && store.getRange().length == 0) {
                    Ext.TaskManager.stop(this.tarea);
                } else *!///{
                    var valorcuentagasto = this.cbCuentaGasto.getValueComboTree();
                    this.validarModificar(this.cbMetodoCosto.getValue(), valorcuentagasto,
                        this.stDestinoProduccion.getRange().length, this.stGridUnidad.getRange());
                //}*/

                if (store.getRange().length == 0) {
                    this.cbUnidadMedida.disable();
                    this.btnAceptar.disable();
                    mostrarMensaje(1, this.idioma.lbUnidadMedidaError);

                } else {
                    this.cbUnidadMedida.enable();
                    if (this.cbUnidadMedida.isValid()) {
                        this.btnAceptar.enable();
                    }
                }
            }
        });

        this.stMagnitud.on({
            scope: this,
            load: function (store, records, successful) {
                if (this.configuracion) {
                    this.stUnidadMedida.load();
                    /*var indexmagnitud = this.cbMagnitud.getStore().find('id', this.configuracion.idmagnitud);
                    var magnitud = this.cbMagnitud.getStore().getAt(indexmagnitud);
                    this.cbMagnitud.select(magnitud);
                    this.stUnidadMedida.load();*/
                }
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
                    /*var rec = this.cbDenominacion.getStore().findRecord('denominacion', record.data.denominacion);

                    this.cbCuentaDestino.params = {iddenominacion: rec.data.iddenominacion};

                    this.cbCuentaDestino.noResetBeforeLoad = true;

                    this.cbCuentaDestino.reloadStoreComboTree();

                    this.cbCuentaDestino.noResetBeforeLoad = false;

                    this.cbCuentaDestino.enable();*/

                    this.cbCuentaDestino.params = {iddenominacion: records[0].data.iddenominacion};
                    this.cbCuentaDestino.reloadStoreComboTree();
                    this.cbCuentaDestino.enable();
                }
            }
        });

        this.on({
            scope: this,
            close: function (editor, context, eOpts) {
                Ext.TaskManager.stop(this.validarbtnAcep);
                if (this.tareaModificarDestino) {
                    Ext.TaskManager.stop(this.tareaModificarDestino);
                }
                if (this.tareaModificarDestinoUnidad) {
                    Ext.TaskManager.stop(this.tareaModificarDestinoUnidad);
                }
            },
            show: function (window, eOpts) {
                this.myMask = new Ext.LoadMask(this.getEl(), {msg: this.idioma.msgCargando});
                this.myMask.show();
                this.cbCuentaGasto.btnUpdate.text = "<span class='icondistra-actualizar'></span>"
                this.cbCuentaDestino.btnUpdate.text = "<span class='icondistra-actualizar'></span>"
                //this.validarAceptar();

                this.map = Ext.create('Ext.util.KeyMap', this.btnCancelar.getEl(), {
                    key: Ext.EventObject.TAB,
                    stopEvent: true,
                    fn: function () {
                        this.cbMetodoCosto.focus(true, true);
                    },
                    scope: this
                });


                this.map = Ext.create('Ext.util.KeyMap', this.cbMetodoCosto.getEl(), {
                    key: Ext.EventObject.TAB,
                    shift: true,
                    stopEvent: true,
                    fn: function () {
                        this.btnCancelar.focus();
                    },
                    scope: this
                });


                /*var tempAceptar = this.rowEditing.getEditor().floatingButtons.items.items[0];
                var cancel = this.rowEditing.getEditor().floatingButtons.items.items[1];
                    this.rowEditing.getEditor().floatingButtons.items.items[0] = cancel;
                    this.rowEditing.getEditor().floatingButtons.items.items[1] = tempAceptar;*/
            }
        });

        this.btnAceptar.on({
            scope: this,
            click: function () {
                if (this.tareaDestino) {
                    Ext.TaskManager.stop(this.tareaDestino);
                }
                var records = this.gridDestinoProd.getStore().getRange();
                var cantrecords = records.length;
                var datos = new Array();
                var paramConfiguracion = {};
                for (var i = 0; i < cantrecords; i++) {
                    paramConfiguracion = {};
                    //paramConfiguracion['coddestinoprod'] = records[i].data.coddestinoprod;
                    paramConfiguracion['denominacion'] = records[i].data.denominacion;
                    paramConfiguracion['iddestino'] = records[i].data.iddestino;
                    paramConfiguracion['cuentadestino'] = records[i].data.idcuenta;

                    datos.push(paramConfiguracion);
                }
                var paramUnidadMedida = new Array();
                var recordsunidad = this.gridUnidadMedida.getStore().getRange();
                var cantrecordsunidad = recordsunidad.length;
                var datosUnidad = new Array();
                for (var i = 0; i < cantrecordsunidad; i++) {
                    paramUnidadMedida = {};
                    paramUnidadMedida['idunidad'] = recordsunidad[i].data.idunidad;
                    paramUnidadMedida['idmagnitud'] = recordsunidad[i].data.idmagnitud;
                    paramUnidadMedida['idunidadmedida'] = recordsunidad[i].data.idunidadmedida;
                    paramUnidadMedida['magnitud'] = recordsunidad[i].data.magnitud;
                    paramUnidadMedida['unidadmedida'] = recordsunidad[i].data.unidadmedida;

                    datosUnidad.push(paramUnidadMedida);
                }

                var parameter = {
                    idmetodo: Ext.encode(this.cbMetodoCosto.getValue()),
                    arrayIdCuenta: Ext.encode(this.cbCuentaGasto.getValueComboTree()),
                    idmagnitud: this.cbMagnitud.getValue(),
                    idparteformato: this.cbParteFormatoDetino.getValue(),
                    idunidadmedida: this.cbUnidadMedida.getValue(),
                    parametrosgrid: Ext.encode(datos),
                    paramunidades: Ext.encode(datosUnidad)
                };

                var myMask = new Ext.LoadMask(this.getEl(), {msg: this.idioma.msgCargando});
                myMask.show();
                Ext.Ajax.request({
                    scope: this,
                    url: 'saveConfiguracion',
                    params: parameter,
                    callback: function (options, success, response) {
                        var responseData = Ext.decode(response.responseText);
                        var msg = (responseData.msg === 1) ? this.idioma.lbConfigGuardada : this.idioma.lbMsgErrorGuardar;
                        mostrarMensaje(1, msg);
                        myMask.hide();
                        if (success) {
                            this.close();
                            myMask.hide();
                        }
                    }
                });
            }
        });

        this.btnCancelar.on({
            scope: this,
            click: function () {
                this.close();
                if (this.tareaInductor || this.tareaNivel) {
                    Ext.TaskManager.stop(this.tareaInductor);
                    Ext.TaskManager.stop(this.tareaNivel);
                }

            }
        });

        this.cbCuentaDestino.storeComboTree.on({
            scope: this,
            /*beforeload: function (store, operation) {
                    operation.params = {
                        iddenominacion : this.cbDenominacion.getValue()
                    }
            },*/
            load: function (store, records, successful) {
                if (store.getRootNode().childNodes.length == 0) {
                    this.cbCuentaDestino.disable();
                    mostrarMensaje(1, this.idioma.lbNoDataCuentasDes);
                }
            }
        });
    },

    inicializarStores: function () {


        Ext.define('DestinoProduccion', {
            extend: 'Ext.data.Model',
            fields: [{
                name: 'iddestino',
                type: 'int'
            }, {
                name: 'denominacion',
                type: 'string'
            }, {
                name: 'idcuenta',
                mapping: 'cuentadestino'
            }, {
                name: 'idestructuracomun',
                type: 'int'
            }, {
                name: 'idparteformato',
                type: 'int'
            }, {
                name: 'configuracion'
            }]
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
            autoLoad: true,
            model: 'DestinoProduccion',
            proxy: {
                type: 'ajax',
                api: {
                    read: 'getDestinoProduccion',
                    update: 'saveDestinoProduccion',
                    create: 'saveDestinoProduccion'
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

        this.stParteFormato = Ext.create('Ext.data.Store', {
            autoLoad: true,
            fields: [{
                name: 'idparteformato',
                type: 'int'
            }, {
                name: 'nombre',
                type: 'string'
            }, {
                name: 'abreviatura',
                type: 'string'
            }, {
                name: 'nivel',
                type: 'int'
            }, {
                name: 'idformato',
                type: 'int'
            }],
            proxy: {
                type: 'ajax',
                url: 'getParteFormatos',
                reader: {
                    type: 'json',
                    root: 'data'
                },
                writer: {
                    type: 'json'
                }
            }
        });

        this.stUnidadMedida = Ext.create('Ext.data.Store', {
            fields: [{
                name: 'idunidadmedida',
                type: 'int'
            }, {
                name: 'abreviaturaunidadmedida',
                type: 'string'
            }, {
                name: 'denominacionunidadmedida',
                type: 'string'
            }, {
                name: 'uriunidadmedida',
                type: 'string'
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
                    this.rowEditing.getEditor().floatingButtons.items.items[1].setDisabled(!(/*this.tfCodigo.isValid() && */this.cbDenominacion.isValid() && this.cbCuentaDestino.getValueComboTree().length != 0));
                }
            },
            interval: 300,
            scope: this
        };
        Ext.TaskManager.start(this.tareaModificarDestino);
    },

    validarModificarDestinoUnidad: function (magnitud, unidad) {
        this.tareaModificarDestinoUnidad = {
            run: function () {
                if (magnitud && unidad) {
                    this.rowEditingUnidad.getEditor().floatingButtons.items.items[1].setDisabled(this.cbMagnitud.getValue() == magnitud && this.cbUnidadMedida.getValue() == unidad);
                } else {
                    this.rowEditingUnidad.getEditor().floatingButtons.items.items[1].setDisabled(!(/*this.tfCodigo.isValid() && */this.cbUnidadMedida.getValue() != null && this.cbMagnitud.isValid()));
                }
            },
            interval: 300,
            scope: this
        };
        Ext.TaskManager.start(this.tareaModificarDestinoUnidad);
    },

    validarbtnAceptar: function (metodo, formatoini, cuentas, griddes, griduni) {
        this.validarbtnAcep = {
            run: function () {
                if (metodo && cuentas && griddes != '[]' && griduni != '[]') {
                    var griddestino = this.stDestinoProduccion.getRange();
                    var totalrange = griddestino.length;
                    var arrayreal = new Array();
                    for (var i = 0; i < totalrange; i++) {
                        arrayreal.push(griddestino[i].data)
                    }

                    var destinos = false;
                    //var cantrecorddestino = griddestino.length;
                    //var contigualdestino = 0;
                    if (Ext.encode(arrayreal) == griddes) {
                        //contigualdestino++;
                        destinos = true;
                        /*for (var i = 0; i < cantrecorddestino; i++) {
                            if (arrayreal[i].data.idcuenta == griddes[i].data.idcuenta && arrayreal[i].data.denominacion == griddes[i].data.denominacion) {

                            }
                        }*/
                        /*if (contigualdestino) {
                            destinos == false;
                        }
                    } else {
                        destinos == false;
                    }*/
                    }


                    var unidades = false;
                    var valorgridunidad = this.stGridUnidad.getRange().slice();
                    var lengthunid = valorgridunidad.length;
                    var arraycopyunid = new Array();
                    for (var i = 0; i < lengthunid; i++) {
                        arraycopyunid.push(valorgridunidad[i].data);
                    }


                    //var cantrecordunidades = gridunidad.length;
                    if (Ext.encode(arraycopyunid) == griduni) {
                        unidades = true;
                        /*var contigualunidad = 0;
                        for (var i = 0; i < cantrecordunidades; i++) {
                            if (gridunidad[i].data.idmagnitud == griduni[i].data.idmagnitud && gridunidad[i].data.idunidadmedida == griduni[i].data.idunidadmedida) {
                                contigualunidad++;
                            }
                        }
                        if (contigualunidad) {
                            unidades == false;
                        }
                    } else {
                        unidades == false;
                    }*/

                    }

                    cuentas.sort(function (a, b) {
                        if (a.id > b.id) {
                            return 1;
                        }
                        if (a.id < b.id) {
                            return -1;
                        }
                        // a must be equal to b
                        return 0;
                    });
                    var temp = this.cbCuentaGasto.getValueComboTree();
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
                    var strValorCuenta = Ext.encode(cuentas);
                    var strTemp = Ext.encode(temp);
                    metodo.sort();
                    var met = this.cbMetodoCosto.getValue();
                    var formato = this.cbParteFormatoDetino.getValue();
                    met.sort();

                    this.btnAceptar.setDisabled((strValorCuenta == strTemp && formato == formatoini && (metodo.length == met.length && metodo.every(function (v, i) {
                        return v === met[i]
                    })) && destinos && unidades));
                    if (this.btnAdicionarUnidad.disabled || this.btnAdicionar.disabled ) {
                        this.btnAceptar.disable();
                    }
                } else {
                    this.btnAceptar.setDisabled(!(this.cbMetodoCosto.isValid() && this.cbCuentaGasto.isValid() && this.cbParteFormatoDetino.isValid() && this.stDestinoProduccion.getRange().length > 0 && this.stGridUnidad.getRange().length > 0 && !this.btnAdicionar.disabled && !this.btnAdicionarUnidad.disabled));
                }
            },
            interval: 300,
            scope: this
        };
        Ext.TaskManager.start(this.validarbtnAcep);
    },

    swichTask: function () {
        this.swichTaskDelay = {
            run: function () {
                if(!this.cbParteFormatoDetino.isValid() || !this.cbMetodoCosto.isValid() || !this.cbCuentaGasto.isValid()){
                    Ext.TaskManager.stop(this.validarbtnAcep);
                    this.validarbtnAceptar();
                }
            },
            interval: 300,
            scope: this
        };
        Ext.TaskManager.start(this.swichTaskDelay);
    },



});
