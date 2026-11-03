Ext.define('PRT.view.WindowConfProrrateo', {
    extend: 'Ext.window.Window',
    alias: 'widget.windowconfprorrateo',

    //idioma: eval('PRT.language.' + lang),
    idioma: PRT.language[lang],
    autoShow: true,

    initComponent: function () {
        this.inicializarStores();

        this.recordInductor;

        this.recordNivel;

        this.rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
            autoLoad: true,
            errorSummary: false,
            saveBtnText: this.idioma.lbbtnAceptar,
            cancelBtnText: this.idioma.lbbtnCancelar
        });

        this.rowEditingNivel = Ext.create('Ext.grid.plugin.RowEditing', {
            autoLoad: true,
            errorSummary: false,
            saveBtnText: this.idioma.lbbtnAceptar,
            cancelBtnText: this.idioma.lbbtnCancelar
        });

        this.cbCuentaGasto = Ext.create('CostoComun.components.ComboTree', {
            tabIndex: 1,
            //tabIndex: 11,
            fieldLabel: this.idioma.lbCbxCuentaGasto,
            multiSelect: true,
            displayField: 'concatcta',
            displayTextTree: 'text',
            valueField: 'idcuenta',
            leafField: 'leaf',
            margin: '1 5 0 0',
            url: 'getCuentasGastos',
            rootData: 'data',
            selectParent: true,
            //bbar: [],
            showSearch: false,
            labelAlign: 'top',
            //labelWidth: 110,
            flex: 1,
            /*params: {
                idparteformato: this.nivel.idparteformatoorigen,
                receptor: 0,
                emisor: 1
            }*/
        });

        this.cbElementoTrasp = Ext.create('Ext.form.ComboBox', {
            tabIndex: 2,
            name: 'mailingState',
            anchor: '50%',
            forceSelection: true,
            labelStyle: 'margin: 0 0 5 0',
            fieldLabel: this.idioma.lbCbxElementoTraspaso,
            labelAlign: 'top',
            labelWidth: 110,
            //margin: '1 0 0 0',
            store: this.stElementoTrasp,
            allowBlank: false,
            blankText: this.idioma.blankTextField,
            editable: false,
            flex: 1,
            queryMode: 'local',
            valueField: 'idelementoobjeto',
            displayField: 'text',
            enforceMaxLength: true,
            listConfig: {
                minWidth: null
            },


        });

        this.btnAdicionarNivel = Ext.create('Ext.Button', {
            tabIndex: 3,
            tooltip: this.idioma.tooltipAddNivel,
            text: this.idioma.btnAdicionar,
            //disabled: true,
            scope: this,
            handler: function (button, e) {
                var count = this.stNivelProrrateo.getCount();
                this.recordNivel = count;
                var modelconfpro = Ext.create('ConfNivelProrrateo');
                this.stNivelProrrateo.insert(count, modelconfpro);
                if (count) {
                    var temp = this.stNivelProrrateo.getAt(count - 1);
                    modelconfpro.set('confnivelprorrateo', temp.data.confnivelprorrateo + 1);
                } else {
                    modelconfpro.set('confnivelprorrateo', 1);
                }
                this.cbParteFormatoOrigen.reset();
                this.cbParteFormatoDetino.reset();
                this.rowEditingNivel.startEdit(count, 0);
                this.action = 'add';
                this.btnAdicionarNivel.disable();
            }
        });

        this.tfNivel = Ext.create('Ext.form.field.Text', {
            blankText: this.idioma.blankTextField,
            readOnly: true,
            fieldStyle: 'text-align: right',
            name: 'confnivelprorrateo'

        });

        this.cbParteFormatoOrigen = Ext.create('Ext.form.ComboBox', {
            tabIndex: 4,
            flex: 1,
            name: 'nomformatoorigen',
            store: this.stParteFormato,
            valueField: 'idparteformato',
            displayField: 'nombre',
            editable: false,
            emptyText: 'Seleccione...',
            blankText: this.idioma.blankTextField,
            queryMode: 'local',
            allowBlank: false

        });

        this.cbParteFormatoInductor = Ext.create('Ext.form.ComboBox', {

            tabIndex: 4,
            flex: 1,
            name: 'idparteformatodestinoinductor',
            store: this.stParteFormatoInductor,
            valueField: 'idparteformatodestino',
            displayField: 'nombre',
            editable: false,
            emptyText: 'Seleccione...',
            blankText: this.idioma.blankTextField,
            queryMode: 'local',
            allowBlank: false

        });

        this.cbParteFormatoDetino = Ext.create('Ext.form.ComboBox', {
            tabIndex: 5,
            flex: 1,
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

        this.btnAdicionar = Ext.create('Ext.Button', {
            tooltip: this.idioma.tooltipAddBaseDistr,
            tabIndex: 6,
            text: this.idioma.btnAdicionar,
            //disabled: true,
            scope: this,
            handler: function (button, e) {
                var count = this.stInductor.getCount();
                this.stInductor.insert(count, new NomInductor());
                this.recordInductor = count;
                this.tfNombre.reset();
                this.tfAbreviatura.reset();
                this.rowEditing.startEdit(count, 0);
                this.action = 'add';
                this.btnAdicionar.disable();
            }
        });

        this.tfNombre = Ext.create('Ext.form.field.Text', {
            tabIndex: 7,
            allowBlank: false,
            name: 'nominductor',
            maskRe: /^[a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xda\xfc\s\_\-]+$/,
            regex: /^([a-zA-Z\-\_\xf3\xf1\xe1\xe9\xed\xfa\xda\xd1-]+ ?)+$/,
            enableKeyEvents: true,
            blankText: this.idioma.blankTextField,
            maxLength: 50,
            maxLengthText: this.idioma.maxLengthText.replace("<#>", '50'),
            enableKeyEvents: true
        });

        this.tfAbreviatura = Ext.create('Ext.form.field.Text', {
            tabIndex: 8,
            allowBlank: false,
            blankText: this.idioma.blankTextField,
            name: 'abreviatura',
            maskRe: /^[a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xda\xfc\/\s\_]+$/,
            regex: /^([a-zA-Z\_\/\xf3\xf1\xe1\xe9\xed\xfa\xda\xd1-]+ ?)+$/,
            maxLength: 10,
            maxLengthText: this.idioma.maxLengthText.replace("<#>", '10'),
            enableKeyEvents: true

        });

        this.btnCancelar = Ext.create('Ext.Button', {
            tabIndex: 9,
            text: this.idioma.lbbtnCancelar,
            scope: this,
            tooltip: this.idioma.tooltipbtnCancelar,
            //margin: '1 0 1 445',
            height: 23,
        });

        this.btnAceptar = Ext.create('Ext.Button', {
            tabIndex: 10,
            tooltip: this.idioma.lbtooltipBtnAceptar,
            text: this.idioma.lbbtnAceptar,
            scope: this,
            height: 23,
            disabled: true
        });

        this.gridInductor = Ext.create('Ext.grid.Panel', {
            viewConfig: {loadMask: false},
            scope: this,
            plugins: [this.rowEditing],
            width: 400,
            height: 175,
            margin: '0 0 8 0',
            store: this.stInductor,
            columns: [{
                text: this.idioma.lbColumnNombre,
                sortable: true,
                flex: 1,
                //width: 150,
                dataIndex: 'nominductor',

                editor: this.tfNombre

            }, {
                header: this.idioma.lbColumnAbreviatura,
                width: 195,
                flex: 1,
                sortable: true,
                dataIndex: 'abreviatura',

                editor: this.tfAbreviatura

            }, {
                header: 'Formato destino',
                width: 195,
                flex: 1,
                sortable: true,
                dataIndex: 'idparteformatodestinoinductor',
                editor: this.cbParteFormatoInductor,
                renderer: function (value, metadata, record, rowIndex, colIndex, store) {
                    var rec = this.stParteFormatoInductor.findRecord('idparteformatodestino', value);
                    if (rec) {
                        return rec.data.nombre;
                    }
                    else {
                        return value;
                    }
                }.bind(this)
            }, {
                xtype: 'actioncolumn',
                width: 23,
                sortable: false,
                menuDisabled: true,
                items: [{
                    iconCls: 'icondistra-eliminar',
                    tooltip: this.idioma.lbtooltipEliminarInductor,
                    scope: this,
                    handler: function (view, rowIndex, colIndex, item, e, record, row) {
                        mostrarMensaje(2, this.idioma.lbDeleteConfirmInductor, function (btnPress) {
                            if (btnPress == 'ok') {
                                var myMask = new Ext.LoadMask(view.getEl(), {msg: this.idioma.msgCargando});
                                myMask.show();
                                Ext.Ajax.request({
                                    scope: this,
                                    url: 'deleteNomInductor',
                                    params: {
                                        idinductor: this.idinductor
                                    },
                                    callback: function (options, success, response) {
                                        myMask.hide();
                                        var responseData = Ext.decode(response.responseText);
                                        view.refresh();
                                        if (responseData.success == true) {
                                            this.stInductor.remove(record);
                                            this.stInductor.commitChanges();
                                            Ext.TaskManager.stop(this.tarea);
                                            this.btnAceptar.enable();
                                            mostrarMensaje(1, this.idioma.lbInductorEliminado);
                                        } else {
                                            var msg = (responseData.msg === 3) ? this.idioma.lbInductorEliminadoError : this.idioma.lbError;
                                            mostrarMensaje(1, msg);
                                        }
                                    }
                                });
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
                        //var count = this.stInductor.getCount();
                        //this.stInductor.remove(record)

                        this.action = 'mod';
                        if (this.recordInductor != null) {
                            this.stInductor.removeAt(this.recordInductor);
                        }
                        if (record.data['idinductor'] != null) {
                            var valorNombre = this.tfNombre.getValue();
                            var valorAbreviatura = this.tfAbreviatura.getValue();
                            var valorNivel = this.cbParteFormatoInductor.getValue();
                            this.tareaInductor;
                            if (this.tareaInductor) {
                                Ext.TaskManager.stop(this.tareaInductor);
                            }
                            this.validarModInductor(valorNombre, valorAbreviatura, valorNivel);
                        }
                    }
            }
        });

        this.gridNivel = Ext.create('Ext.grid.Panel', {
            scope: this,
            viewConfig: {loadMask: false},
            plugins: [this.rowEditingNivel],
            width: 400,
            height: 175,
            margin: '0 0 8 0',
            store: this.stNivelProrrateo,
            columns: [{
                header: this.idioma.lbColumnNivel,
                sortable: true,
                align: 'right',
                flex: 1,
                dataIndex: 'confnivelprorrateo',
                editor: this.tfNivel


            }, {
                header: this.idioma.lbColumnPartForOrigen,
                sortable: true,
                flex: 1,
                dataIndex: 'nomformatoorigen',
                editor: this.cbParteFormatoOrigen

            }, {
                header: this.idioma.lbColumnPartForDestino,
                flex: 1,
                sortable: true,
                dataIndex: 'nomformatodestino',

                editor: this.cbParteFormatoDetino

            }, {
                xtype: 'actioncolumn',
                width: 23,
                sortable: false,
                menuDisabled: true,
                items: [{
                    //iconCls: 'icondistra-eliminar',
                    getClass: function (v, metadata, record, rowIndex, colIndex, store) {
                        var count = this.stNivelProrrateo.getCount();
                        var temp = this.stNivelProrrateo.getAt(count - 1);
                        /*aqui*/
                        if (record.data['confnivelprorrateo'] == temp.data.confnivelprorrateo) {
                            return 'icondistra-eliminar';
                        }
                        return;
                    },
                    tooltip: this.idioma.lbtooltipEliminarNivel,
                    scope: this,
                    handler: function (view, rowIndex, colIndex, item, e, record, row) {

                        mostrarMensaje(2, this.idioma.lbDeleteConfirmNivel, function (btnPress) {
                            if (btnPress == 'ok') {
                                var myMask = new Ext.LoadMask(view.getEl(), {msg: this.idioma.msgCargando});
                                myMask.show();
                                Ext.Ajax.request({
                                    scope: this,
                                    url: 'deleteDatNivelprorrateo',
                                    params: {
                                        idnivelprorrateo: record.data.idnivelprorrateo
                                    },
                                    callback: function (options, success, response) {
                                        var responseData = Ext.decode(response.responseText);
                                        myMask.hide();
                                        if (responseData.success == true) {
                                            this.stNivelProrrateo.remove(record);
                                            this.stNivelProrrateo.commitChanges();
                                            view.refresh();
                                            Ext.TaskManager.stop(this.tarea);
                                            this.btnAceptar.enable();
                                            mostrarMensaje(1, this.idioma.lbNivelEliminado);
                                        } else {
                                            var msg = (responseData.msg === 3) ? this.idioma.lbNivelEliminadoError : this.idioma.lbError;
                                            mostrarMensaje(1, msg);
                                        }
                                    }
                                });
                            }
                        }.bind(this));
                    }
                }]
            }
            ],
            dockedItems: [{
                xtype: 'toolbar',
                items: [
                    this.btnAdicionarNivel
                ]
            }],
            listeners: {
                scope: this,
                itemclick:
                    function (gridNivel, record, item, index, e, eOpts) {
                        this.idnivelprorrateo = record.data['idnivelprorrateo'];
                    },
                itemdblclick:
                    function (gridNivel, record, item, index, e, eOpts) {
                        //this.tfNivel.setValue(record.data['confnivelprorrateo']);
                        this.action = 'mod';
                        if (this.recordNivel != null) {
                            this.stNivelProrrateo.removeAt(this.recordNivel);
                        }
                        this.rowEditingNivel.getEditor().floatingButtons.items.items[0].enable();
                        var idparteformOrigen = this.stParteFormato.findRecord('idparteformato', record.data['idparteformatoorigen']);
                        this.cbParteFormatoOrigen.select(idparteformOrigen);
                        var idparteformDestino = this.stParteFormato.findRecord('idparteformato', record.data['idparteformatodestino']);
                        this.cbParteFormatoDetino.select(idparteformDestino);
                        if (record.data['idnivelprorrateo'] != null) {
                            var valorParteFOrigen = this.cbParteFormatoOrigen.getValue();
                            var valorParteFDestino = this.cbParteFormatoDetino.getValue();
                            this.tareaNivel;
                            if (this.tareaNivel) {
                                Ext.TaskManager.stop(this.tareaNivel);
                            }
                            this.validarModNivel(valorParteFOrigen, valorParteFDestino);
                        }

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
        this.height = 550;
        this.fieldDefaults = {
            labelAlign: 'right',
            labelWidth: 90,
            msgTarget: 'qtip'
        };
        this.items = [{
            layout: 'hbox',
            margin: '5 0 0 0',
            frame: true,
            items: [
                this.cbCuentaGasto
                ,
                this.cbElementoTrasp
            ]
        }, {
            xtype: 'fieldset',
            title: this.idioma.lbFieldsetNivel,
            margin: '5 0 0 0',
            defaultType: 'textfield',
            layout: 'anchor',
            defaults: {
                anchor: '100%'
            },
            items: [this.gridNivel]
        }, {
            xtype: 'fieldset',
            //height: 100,
            margin: '5 0 5 0',
            title: this.idioma.lbFieldsetBase,
            defaultType: 'textfield',
            layout: 'anchor',
            defaults: {
                anchor: '100%'
            },
            items: [this.gridInductor]
        }];
        this.buttons = [this.btnCancelar,
            this.btnAceptar];
        this.initGlobalsKeys();
        this.inicializarEventos();
        this.callParent(arguments);
    },

    inicializarEventos: function () {

        this.on('show', function () {

            this.map = Ext.create('Ext.util.KeyMap', this.btnCancelar.getEl(), {
                key: Ext.EventObject.TAB,
                stopEvent: true,
                fn: function () {
                    this.cbCuentaGasto.focus(true, true);
                },
                scope: this
            });


            this.map = Ext.create('Ext.util.KeyMap', this.cbCuentaGasto.getEl(), {
                key: Ext.EventObject.TAB,
                shift: true,
                stopEvent: true,
                fn: function () {
                    this.btnCancelar.focus();
                },
                scope: this
            });
        });


        this.rowEditing.on({
            scope: this,
            edit: function (e, context) {
                this.myMask = new Ext.LoadMask(this.gridInductor.getEl(), {msg: this.idioma.msgCargando});
                this.myMask.show();
                this.gridInductor.getStore().sync({
                    scope: this,
                    success : function (batch, options) {
                        this.myMask.hide();
                        var rawData = batch.proxy.getReader().rawData;
                        if (rawData.success == true) {
                            Ext.TaskManager.stop(this.tarea);
                            this.btnAceptar.enable();
                            this.btnAdicionar.enable();
                            this.recordInductor = null;
                            context.record.data.idinductor = rawData.idinductor;
                        } else {
                            this.stInductor.remove(context.record);
                        }
                        if (this.action == 'mod') {
                            Ext.TaskManager.stop(this.tareaInductor);
                            var msg = (rawData.msg === 1) ? this.idioma.lbInductorModificado : this.idioma.lbMsgErrorGuardarInd;
                        } else {
                            var msg = (rawData.msg === 1) ? this.idioma.lbInductorAdicionado : this.idioma.lbMsgErrorGuardarInd;
                        }
                        mostrarMensaje(1, msg);
                    }

                });
                /*Ext.Ajax.request({
                    scope: this,
                    url: 'saveNomInductor',
                    params: parameter,
                    callback: function (options, success, response) {
                        var rawData = batch.proxy.getReader().rawData;
                        this.btnAdicionar.enable();
                        if (rawData.success == true) {
                            this.recordInductor = null;
                        }
                        var responseData = Ext.decode(response.responseText);
                        if (this.action == 'mod') {
                            Ext.TaskManager.stop(this.tareaInductor);
                            var msg = (responseData.msg === 1) ? this.idioma.lbInductorModificado : this.idioma.lbMsgErrorGuardarInd;
                        } else {
                            var msg = (responseData.msg === 1) ? this.idioma.lbInductorAdicionado : this.idioma.lbMsgErrorGuardarInd;
                        }
                        mostrarMensaje(1, msg);
                        //this.myMask.hide();
                        this.stInductor.reload();
                    }
                });*/

            },
            cancelEdit: function (editor, context, eOpts) {
                this.btnAdicionar.enable();
                if (!context.record.data.idinductor) {
                    this.stInductor.remove(context.record);
                }
                if (this.tareaInductor) {
                    Ext.TaskManager.stop(this.tareaInductor);
                }
            },
            validateedit: function (editor, e) {
                /*if (this.tfNombre.getValue() == '' || this.tfAbreviatura.getValue() == '') {
                    return false;
                }*/
            }
        });

        this.rowEditingNivel.on({
            scope: this,
            edit: function (e, context) {
                var record = context.record;
                this.myMask = new Ext.LoadMask(this.gridNivel.getEl(), {msg: this.idioma.msgCargando});
                this.myMask.show();
                var idOrigen = this.cbParteFormatoOrigen.getValue();
                var idDestino = this.cbParteFormatoDetino.getValue();
                var indexFOrigen = this.stParteFormato.find('idparteformato', idOrigen);
                var indexFDestino = this.stParteFormato.find('idparteformato', idDestino);
                var modelFOrigen = this.stParteFormato.getAt(indexFOrigen);
                var modelFDestino = this.stParteFormato.getAt(indexFDestino);
                if (this.action == 'mod') {
                    var parameter = {
                        nivelprorrateo: this.tfNivel.getValue(),
                        idparteformatoorigen: this.cbParteFormatoOrigen.getValue(),
                        idparteformatodestino: this.cbParteFormatoDetino.getValue(),
                        idnivelprorrateo: this.idnivelprorrateo,
                        nomformatoorigen: modelFOrigen.data.nombre,
                        nomformatodestino: modelFDestino.data.nombre,
                        action: this.action
                    };
                } else {
                    var parameter = {
                        nivelprorrateo: this.tfNivel.getValue(),
                        idparteformatoorigen: this.cbParteFormatoOrigen.getValue(),
                        idparteformatodestino: this.cbParteFormatoDetino.getValue(),
                        nomformatoorigen: modelFOrigen.data.nombre,
                        nomformatodestino: modelFDestino.data.nombre,
                        action: this.action
                    };
                    //var parameter = modelNivel;

                }
                context.record.set(parameter);
                this.gridNivel.getStore().sync({
                    scope: this,
                    callback: function (batch, options) {
                        this.myMask.hide();
                        var rawData = batch.proxy.getReader().rawData;
                        this.btnAdicionarNivel.enable();
                        if (rawData.success == true) {
                            Ext.TaskManager.stop(this.tarea);
                            this.btnAceptar.enable();
                            record.data.idnivelprorrateo = rawData.idnivelprorrateo;
                            this.recordNivel = null;
                        }
                        if (this.action == 'mod') {
                            Ext.TaskManager.stop(this.tareaNivel);
                            var msg = (rawData.msg === 1) ? this.idioma.lbNivelModificado : this.idioma.lbMsgErrorGuardar;
                        } else {
                            var msg = (rawData.msg === 1) ? this.idioma.lbNivelAdicionado : this.idioma.lbMsgErrorGuardar;
                        }
                        mostrarMensaje(1, msg);

                    }

                });

                /*Ext.Ajax.request({
                    scope: this,
                    url: 'saveDatNivelProrrateo',
                    params: parameter,
                    callback: function (options, success, response) {
                        //this.stNivelProrrateo.sync();
                        this.myMask.hide();
                        this.btnAdicionarNivel.enable();
                        if (success == true) {
                            this.recordNivel = null;
                        }
                        var responseData = Ext.decode(response.responseText);
                        if (this.action == 'mod') {
                            Ext.TaskManager.stop(this.tareaNivel);
                            var msg = (responseData.msg === 1) ? this.idioma.lbNivelModificado : this.idioma.lbMsgErrorGuardar;
                        } else {
                            var msg = (responseData.msg === 1) ? this.idioma.lbNivelAdicionado : this.idioma.lbMsgErrorGuardar;
                        }
                        mostrarMensaje(1, msg);


                        record.data.idnivelprorrateo = responseData.idnivelprorrateo;
                        record.commit();
                        this.stNivelProrrateo.commitChanges();

                    }
                });*/

            },
            cancelEdit: function (editor, context, eOpts) {
                this.btnAdicionarNivel.enable();
                if (!context.record.data.idnivelprorrateo) {
                    this.stNivelProrrateo.remove(context.record);
                }
                if (this.tareaNivel) {
                    Ext.TaskManager.stop(this.tareaNivel);
                }
            },
            validateedit: function (editor, e) {
                /*if (this.tfNivel.getValue() == '' || this.cbParteFormatoOrigen.getValue() == null || this.cbParteFormatoDetino.getValue() == null) {
                    mostrarMensaje(1, 'Hay campos vacios.');
                    return false;
                }*/
            }
        });

        this.on({
            scope: this,
            close: function (editor, context, eOpts) {
                Ext.TaskManager.stop(this.tarea);
            },
            show: function (window, eOpts) {
                this.Mask = new Ext.LoadMask(window.getEl(), {msg: this.idioma.msgCargando});
                this.Mask.show();
            }
        });

        this.cbParteFormatoDetino.on({
            scope: this,
            change: function (cbx, newValue, oldValue, eOpts) {
                if (cbx.isValid() && this.cbParteFormatoOrigen.isValid()) {
                    this.rowEditingNivel.getEditor().floatingButtons.items.items[0].enable();
                }
            }
        });

        this.cbParteFormatoOrigen.on({
            scope: this,
            change: function (cbx, newValue, oldValue, eOpts) {
                if (cbx.isValid() && this.cbParteFormatoDetino.isValid()) {
                    this.rowEditingNivel.getEditor().floatingButtons.items.items[0].enable();
                }
            }
        });

        this.tfNombre.on({
            scope: this,
            keyup: function (tf, e, eOpts) {
                this.rowEditing.getEditor().floatingButtons.items.items[0].setDisabled(!(tf.isValid() && this.tfAbreviatura.isValid() && this.cbParteFormatoInductor.isValid()));
            },
            /*change: function (tf,e, eOpts) {
                if(tf.isValid() && this.tfAbreviatura.isValid()){
                this.rowEditing.getEditor().floatingButtons.items.items[0].enable();
                }
            }*/
        });

        this.tfAbreviatura.on({
            scope: this,
            keyup: function (tf, e, eOpts) {
                this.rowEditing.getEditor().floatingButtons.items.items[0].setDisabled(!(tf.isValid() && this.tfNombre.isValid() && this.cbParteFormatoInductor.isValid()));
            },
            /*change: function (tf,e, eOpts) {
                if(tf.isValid() && this.tfNombre.isValid()){
                this.rowEditing.getEditor().floatingButtons.items.items[0].enable();
                }
            }*/
        });

        this.cbParteFormatoInductor.on({
            scope: this,
            select: function (tf, e, eOpts) {
                this.rowEditing.getEditor().floatingButtons.items.items[0].setDisabled(!(tf.isValid() && this.tfNombre.isValid() && this.tfAbreviatura.isValid()));
            },
            /*change: function (tf,e, eOpts) {
                if(tf.isValid() && this.tfNombre.isValid()){
                this.rowEditing.getEditor().floatingButtons.items.items[0].enable();
                }
            }*/
        });

        this.stElementoTrasp.on({
            scope: this,
            load: function (e, context) {
                Ext.Ajax.request({
                    url: 'getConfProrrateo',
                    scope: this,
                    callback: function (data, success, response) {
                        this.Mask.hide();
                        this.cbCuentaGasto.focus(true, true);
                        var respuesta = Ext.decode(response.responseText);
                        var elemento = this.stElementoTrasp.findRecord('idelementoobjeto', respuesta.idelemento);
                        this.cbElementoTrasp.select(elemento);
                        var cuentaGasto = new Array();
                        /*for (var i = 0; i < respuesta.idcuenta.length; i++) {
                            cuentaGasto.push({
                                id: respuesta.idcuenta[i],
                                value: respuesta.concatcta[i]
                            });
                        }*/
                        this.cbCuentaGasto.setValueComboTree(respuesta.idcuenta);
                        //----Validar que al modificar activar el btn aceptar----
                        //if (respuesta.idelemento != null) {
                        var valorCuentas = this.cbCuentaGasto.getValueComboTree();
                        var valorElem = this.cbElementoTrasp.getValue();
                        //this.tarea;
                        this.validarModificar(valorElem, valorCuentas, this.btnAceptar);
                        //}
                    }

                });
            }
        });
        this.stInductor.on({
            scope: this,
            load: function (e, context) {
                if (this.myMask) {
                    this.myMask.hide();
                }

            }
        });

        this.stParteFormatoInductor.on({
            scope: this,
            load: function (e, context) {
                this.stInductor.load();
                if (this.myMask) {
                    this.myMask.hide();
                }

            }
        });

        this.btnAceptar.on({
            scope: this,
            click: function () {
                var parameter = {
                    idelemento: this.cbElementoTrasp.getValue(),
                    arrayIdCuenta: Ext.encode(this.cbCuentaGasto.getValueComboTree())
                };
                var myMask = new Ext.LoadMask(this.getEl(), {msg: this.idioma.msgCargando});
                myMask.show();
                Ext.Ajax.request({
                    scope: this,
                    url: 'saveConfProrrateo',
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

    },

    inicializarStores: function () {

        Ext.define('NomInductor', {
            extend: 'Ext.data.Model',
            fields: [{
                name: 'idinductor',
                type: 'int',
            }, 'nominductor', 'abreviatura', {
                name: 'idparteformatodestinoinductor',
                mapping: 'idparteformato'
            }, 'idestructuracomun']
        });

        Ext.define('ConfNivelProrrateo', {
            extend: 'Ext.data.Model',
            fields: [{
                name: 'idnivelprorrateo',
                type: 'int'
            }, {
                name: 'confnivelprorrateo',
                type: 'int',
                mapping: 'nivelprorrateo'
            }, {
                name: 'idparteformatoorigen',
                type: 'int'
            }, {
                name: 'idparteformatodestino',
                type: 'int'
            }, {
                name: 'nomformatoorigen',
                type: 'string'
            }, {
                name: 'nomformatodestino',
                type: 'string'
            }]
        });

        this.stParteFormatoInductor = Ext.create('Ext.data.Store', {
            autoLoad: true,
            fields: [{
                name: 'idparteformatodestino',
            }, {
                name: 'nombre',
            }],
            proxy: {
                type: 'ajax',
                url: 'getParteFormatoDestinoInductor',
                reader: {
                    type: 'json',
                    root: 'data'
                },
                writer: {
                    type: 'json'
                }
            }

        });

        this.stElementoTrasp = Ext.create('Ext.data.Store', {
            autoLoad: true,
            fields: [{
                name: 'idelementoobjeto',
                type: 'int'
            }, {
                name: 'text',
                type: 'string'
            }],
            proxy: {
                type: 'ajax',
                url: 'getElementos',
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

        this.stInductor = Ext.create('Ext.data.Store', {
            //autoLoad: true,
            fields: [{
                name: 'idinductor',
                type: 'int'
            }, {
                name: 'nominductor',
                type: 'string'
            }, {
                name: 'abreviatura',
                type: 'string'
            }, {
                name: 'idparteformatodestinoinductor',
                mapping: 'idparteformato'
            }],
            proxy: {
                type: 'ajax',
                api: {
                    read: 'getNomInductor',
                    update: 'saveNomInductor',
                    create: 'saveNomInductor'
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

        this.stNivelProrrateo = Ext.create('Ext.data.Store', {
            autoLoad: true,
            model: 'ConfNivelProrrateo',
            proxy: {
                type: 'ajax',
                api: {
                    read: 'getDatNivelProrrateo',
                    update: 'saveDatNivelProrrateo',
                    create: 'saveDatNivelProrrateo'
                },
                reader: {
                    type: 'json',
                    root: 'datanivelprorrateo'
                },
                writer: {
                    type: 'json'
                }
            },

        });

        /*this.stCuentaGasto = Ext.create('Ext.data.Store', {
            autoLoad: true,
            fields: [{
                name: 'idcuenta',
                type: 'int'
            }, {
                name: 'concatcta',
                type: 'string'
            }, {
                name: 'descripcion',
                type: 'string'
            }, {
                name: 'text',
                type: 'string'
            }, {
                name: 'leaf',
                type: 'integer'
            }],
            proxy: {
                type: 'ajax',
                url: 'getCuentasGastos',
                reader: {
                    type: 'json',
                    root: 'data'
                },
                writer: {
                    type: 'json'
                }
            }
        });*/
    },

    validarModificar: function (valorElem, valorCuentas, btn) {
        this.tarea = {
            run: function () {
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
                var strValorCuenta = Ext.encode(valorCuentas);
                var strTemp = Ext.encode(temp);
                btn.setDisabled(strValorCuenta == strTemp && valorElem == this.cbElementoTrasp.getValue());
            },
            interval: 300,
            scope: this
        };
        Ext.TaskManager.start(this.tarea);
    },

    validarModInductor: function (valorNomb, valorAbrev, valorNivel) {
        this.tareaInductor = {
            run: function () {
                this.rowEditing.getEditor().floatingButtons.items.items[0].setDisabled(!(valorNomb != this.tfNombre.getValue() || valorAbrev != this.tfAbreviatura.getValue() || valorNivel != this.cbParteFormatoInductor.getValue()));
            },
            interval: 300,
            scope: this
        };
        Ext.TaskManager.start(this.tareaInductor);
    },

    validarModNivel: function (valorParteFOrigen, valorParteFDestino) {

        this.tareaNivel = {
            run: function () {
                this.rowEditingNivel.getEditor().floatingButtons.items.items[0].setDisabled(!(valorParteFOrigen != this.cbParteFormatoOrigen.getValue() || valorParteFDestino != this.cbParteFormatoDetino.getValue()));
            },
            interval: 300,
            scope: this
        };
        Ext.TaskManager.start(this.tareaNivel);
    },
    initGlobalsKeys: function () {

    }


});
