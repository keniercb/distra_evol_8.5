
Ext.ns('Copa.Configuracion.CondicionPago');
Copa.Configuracion.CondicionPago.Controller = {
    init: function (perfil, etiquetas, view, model) {
        var scope = this;
        this.arrayValues = [];
        this.disabledKeyMap = false;
        this.cont = 0;
        this.totalMora;
        this.delMora = [];
        this.totalPlazo;
        this.delPlazo = [];
        this.totalDescVenta;
        this.delDescVenta = [];
        this.totalDPP;
        this.delDPP = [];
        this.addapl = '';
        this.bool = false;
        scope.noPagoPlazo = false;
        //Ext.Msg.wait('Cargando...', 'Por favor espere...');

        // esto le coloca el fondo verde a la cuenta definida para saldo de inicio
        view.grid.getView().getRowClass = function (record, index, rowParams, store) {
            if (record.json.usado) {
                return 'FilaVerde';
            }
        };

        /********* EVENTOS *********/
        new Ext.KeyMap(Ext.getDoc(), [{
            // ADICIONAR
            key: 'i',
            alt: true,
            fn: function () {
                if (!view.btnPrueba.disabled && !scope.disabledKeyMap) {
                    view.btnPrueba.handler.call();
                }
            }
        }, {
            // MODIFICAR
            key: 'm',
            alt: true,
            fn: function () {
                if (!view.btnModificarPrueba.disabled && !scope.disabledKeyMap) {
                    view.btnModificarPrueba.handler.call();
                }
            }
        }, {
            // ELIMINAR
            key: Ext.EventObject.DELETE,
            fn: function () {
                if (!view.btnEliminarPrueba.disabled && view.smPayCondition.hasSelection() && !scope.disabledKeyMap) {
                    view.btnEliminarPrueba.handler.call();
                }
            }
        }, {
            // //Activar
            //key: 'x',
            key: 'y',
            alt: true,
            fn: function () {
                if (!view.btnActivarPrueba.disabled && !scope.disabledKeyMap) {
                    Ext.EventObject.stopEvent();
                    view.btnActivarPrueba.handler.call();
                }
            }
        }, {
            // Ayuda
            key: 'h',
            alt: true,
            fn: function () {
                view.btnAyuda.handler.call();
            }
        }
        ]);

        model.payConditionStore.on({
            beforeload: function (store, records, options) {
                if (scope.cont > 0)
                    Ext.getBody().mask('Cargando...');
                else {
                    Ext.Msg.wait('Cargando...', 'Por favor espere...');
                }
            },
            load: function (store, records, options) {
                if (records.length === 0) {
                    var message = (model.payConditionStore.baseParams.denominacion != '') ? etiquetas.msgNoElementSearch : etiquetas.noPayConditions;
                    view.grid.body.unmask();
                    mostrarMensaje(1, message);
                }
                else {
                    if (records[0].data.usado)
                        view.btnModificarPrueba.disable();
                    view.smPayCondition.selectFirstRow();
                }

                if (scope.cont > 0) {
                    Ext.getBody().unmask();
                } else {
                    Ext.Msg.hide();
                }
                scope.cont++;
                //view.grid.body.unmask();
                //Ext.getBody().unmask();
                //Ext.Msg.hide();
                view.btnPrueba.focus();
            }
        });

        view.btnPrueba.setHandler(function () {
            scope.ferst = true;
            scope.ClickAddPayConditionActionPrueba();
        });
        view.btnModificarPrueba.setHandler(function () {
            scope.ClickModPayConditionActionPrueba();
        });
        view.btnEliminarPrueba.setHandler(function () {
            scope.ClickDeletePayConditionAction();
        });
        view.btnActivarPrueba.setHandler(function () {
            scope.ClickActivePayConditionAction();
        });
        view.btnAyuda.setHandler(function () {
            scope.EventosAyuda();
        });

        this.ClickAddPayConditionActionPrueba = function () {
            scope.WindowsFactoryPrueba('add');
        };
        this.ClickModPayConditionActionPrueba = function () {
            scope.WindowsFactoryPrueba('mod');
        };
        this.ClickDeletePayConditionAction = function () {
            scope.disabledKeyMap = true;
            var selected = view.smPayCondition.getSelections();//scope.getSelectionsOnPaging();
            if (selected.length > 0) {
                var mensaje = (selected.length > 1) ? etiquetas.msgConfirmDeletePlural : etiquetas.msgConfirmDelete;
                msgDel = (selected.length > 1) ? 'Eliminando datos de las condiciones de pago.' : 'Eliminando datos de la condici\xF3n de pago.';
                Ext.Msg.confirm(etiquetas.titleConfirm, mensaje, function (btnPress) {
                    if (btnPress === 'yes') {
                        scope.DeletePayCondition(selected);
                        view.btnPrueba.focus();
                    }
                    scope.disabledKeyMap = false;
                    view.btnPrueba.focus();
                });
            } else {
                mostrarMensaje(3, etiquetas.msgNoSecuenceSelected, function () {
                    scope.disabledKeyMap = false;
                });
            }
        };
        this.ClickActivePayConditionAction = function () {
            scope.disabledKeyMap = true;
            var selected = view.smPayCondition.getSelected();
            Ext.Msg.confirm(etiquetas.titleConfirm, etiquetas.msgConfirmActive.replace("<#>", selected.json.nombre), function (btnPress) {
                if (btnPress === 'yes') {
                    scope.ActivePayCondition(selected);
                    view.btnPrueba.focus();
                }
                scope.disabledKeyMap = false;
                view.btnPrueba.focus();
            });
        };

        this.WindowsFactoryPrueba = function (action) {
            view.Prueba(etiquetas, action);
            view.windowsPrueba.on({
                beforeshow: function () {
                    scope.crearTabPanelInicial(action);
                    scope.eventosPrueba(action);
                    model.payCondcionPagoStore.load();

                    if (action === 'mod') {
                        if (view.smPayCondition.hasSelection()) {
                            var selected = view.smPayCondition.getSelected();

                            view.tfDenominacionPrueba.setValue(selected.json.nombre);
                            scope.oldDenominacion = selected.json.nombre;

                            view.tfPlazoPrueba.setValue(selected.json.plazo);
                            scope.oldPlazo = selected.json.plazo;

                            view.cbTiempoPlazo.setValue(selected.json.idumplazo);
                            scope.oldTiempoPlazo = selected.json.idumplazo;
                            view.cbTiempoPlazo.setRawValue(selected.json.tiempo);

                            view.chPlazo.setDisabled((selected.json.aplazos == 0) ? true : false);
                            scope.oldAPlazo = selected.json.aplazos;

                            if (selected.json.aplazos == 1) {
                                view.chPlazo.setValue(selected.json.aplazos);
                                scope.tabs2.setActiveTab(scope.gpPlazo);
                            } else if (selected.json.descventa == 0 && selected.json.dpp == 0) {
                                scope.tabs2.setActiveTab(scope.gpMora);
                            }

                            view.chDescuentoVentas.setValue(selected.json.descventa);
                            scope.oldDescuentoVentas = selected.json.descventa;

                            view.chDescuentoPago.setValue(selected.json.dpp);
                            scope.oldDPP = selected.json.dpp;

                            scope.loadDataMod(selected.json.idterminodepago);
                        }
                    }
                },
                destroy: function () {
                    scope.disabledKeyMap = false;
                }
            });
            view.windowsPrueba.show();
            scope.disabledKeyMap = true;
        };

        this.eventosPrueba = function (action) {
            view.chPlazo.on('check', function (ch, checked) {
                var tabPlazo = scope.crearTabs(checked, action);
                if (checked) {
                    view.panel2.getComponent(0).add(tabPlazo);
                    for (var i = view.panel2.getComponent(0).items.length - 1; i >= 0; i--) {
                        if (view.panel2.getComponent(0).items.keys[i] === 'gpDescVenta' || view.panel2.getComponent(0).items.keys[i] === 'gpDPP' || view.panel2.getComponent(0).items.keys[i] === 'gpMora')
                            view.panel2.getComponent(0).remove(view.panel2.getComponent(0).getComponent(i), true);
                    }

                    view.chDescuentoVentas.setValue(false);
                    view.chDescuentoPago.setValue(false);

                    view.dfDia.reset();
                    view.chDiaFijo.disable();

                    view.tfPlazoPrueba.reset();
                    view.tfPlazoPrueba.disable();

                    view.cbTiempoPlazo.reset();
                    view.cbTiempoPlazo.disable();

                    model.payDescVentaStore.removeAll();
                    model.payDPPStore.removeAll();
                    model.payMoraStore.removeAll();

                    view.fsDescuento.disable();
                }
                else {
                    view.panel2.getComponent(0).add(tabPlazo);
                    view.panel2.getComponent(0).remove(view.panel2.getComponent(0).getComponent(0), true);

                    model.payCuotasStore.removeAll();

                    view.dfDia.enable();
                    view.chDiaFijo.enable();
                    view.tfPlazoPrueba.enable();
                    view.cbTiempoPlazo.enable();
                    view.fsDescuento.enable();
                }
            });

            view.chDescuentoVentas.on('check', function (ch, checked) {
                if (checked) {
                    var descVentas = scope.crearTabsDescuentos('descVentas', action);
                    view.panel2.getComponent(0).add(descVentas);
                    view.panel2.getComponent(0).setActiveTab(descVentas);

                } else {
                    for (var i = 0; i < view.panel2.getComponent(0).items.length; i++) {
                        if (view.panel2.getComponent(0).items.keys[i] === 'gpDescVenta')
                            view.panel2.getComponent(0).remove(view.panel2.getComponent(0).getComponent(i), true);
                    }
                    model.payDescVentaStore.removeAll();
                }
            });

            view.chDescuentoPago.on('check', function (ch, checked) {
                if (checked) {
                    var DPP = scope.crearTabsDescuentos('DPP', action);
                    view.panel2.getComponent(0).add(DPP);
                    view.panel2.getComponent(0).setActiveTab(DPP);
                } else {
                    for (var i = 0; i < view.panel2.getComponent(0).items.length; i++) {
                        if (view.panel2.getComponent(0).items.keys[i] === 'gpDPP')
                            view.panel2.getComponent(0).remove(view.panel2.getComponent(0).getComponent(i), true);
                    }
                    model.payDPPStore.removeAll();
                }
            });

            view.tfPlazoPrueba.on({
                'keyup': function (tf) {
                    if (tf.getValue() !== "")
                        view.chPlazo.disable();
                    else
                        view.chPlazo.enable();

                    // VALIDAR LOS BOTONOS EN CASO DE ADICIONAR
                    if (action == 'add') {
                        if (tf.getValue() != '') {
                            if (scope.validatetfPlazoPrueba()) {
                                view.btnAceptarPrueba.enable();
                                view.btnAplicarPrueba.enable();
                            }
                        } else {
                            view.btnAceptarPrueba.disable();
                            view.btnAplicarPrueba.disable();
                        }
                    }

                    //VALIDAR LOS BOTONOS EN CASO DE MODIFICAR
                    if (action == 'mod') {
                        if (tf.getValue() != scope.oldPlazo)
                            view.btnAceptarPrueba.enable();
                        else if (!view.chPlazo.getValue()) {
                            if (view.cbTiempoPlazo.getValue() != scope.oldTiempoPlazo || view.tfDenominacionPrueba.getValue() != scope.oldDenominacion || scope.noPagoPlazo)
                                view.btnAceptarPrueba.enable();
                            else
                                view.btnAceptarPrueba.disable();
                        }
                        else if (view.chPlazo.getValue()) {
                            if (!scope.btnAdicionarPlazo.disabled && scope.bool)
                                view.btnAceptarPrueba.enable();
                            else
                                view.btnAceptarPrueba.disable();
                        }
                        else
                            view.btnAceptarPrueba.disable();
                    }
                }
            });

            view.cbTiempoPlazo.on({
                'select': function (combo) {
                    // VALIDAR LOS BOTONOS EN CASO DE ADICIONAR
                    if (action == 'add') {
                        if (combo.getValue() != '') {
                            if (scope.validatecbTiempoPlazo()) {
                                view.btnAceptarPrueba.enable();
                                view.btnAplicarPrueba.enable();
                            }
                        } else {
                            view.btnAceptarPrueba.disable();
                            view.btnAplicarPrueba.disable();
                        }
                    }

                    //VALIDAR LOS BOTONOS EN CASO DE MODIFICAR
                    if (action == 'mod') {
                        if (combo.getValue() != scope.oldTiempoPlazo)
                            view.btnAceptarPrueba.enable();
                        else if (!view.chPlazo.getValue() && model.payMoraStore.getCount() > 0) {
                            if (view.tfPlazoPrueba.getValue() != scope.oldPlazo || view.tfDenominacionPrueba.getValue() != scope.oldDenominacion || scope.noPagoPlazo)
                                view.btnAceptarPrueba.enable();
                            else
                                view.btnAceptarPrueba.disable();
                        }
                        else if (view.chPlazo.getValue()) {
                            if (!scope.btnAdicionarPlazo.disabled && scope.bool)
                                view.btnAceptarPrueba.enable();
                            else
                                view.btnAceptarPrueba.disable();
                        }
                        else
                            view.btnAceptarPrueba.disable();
                    }
                }
            });

            view.tfDenominacionPrueba.on({
                'keyup': function (tf) {
                    // VALIDAR LOS BOTONOS EN CASO DE ADICIONAR
                    if (action == 'add') {
                        if (tf.getValue() != '') {
                            if (scope.validatetfDenominacion()) {
                                view.btnAceptarPrueba.enable();
                                view.btnAplicarPrueba.enable();
                            }
                        } else {
                            view.btnAceptarPrueba.disable();
                            view.btnAplicarPrueba.disable();
                        }
                    }

                    //VALIDAR LOS BOTONOS EN CASO DE MODIFICAR
                    if (action == 'mod') {
                        if (tf.getValue() != scope.oldDenominacion)
                            view.btnAceptarPrueba.enable();
                        else if (!view.chPlazo.getValue() && model.payMoraStore.getCount() > 0) {
                            if (view.tfPlazoPrueba.getValue() != scope.oldPlazo || view.cbTiempoPlazo.getValue() != scope.oldTiempoPlazo || scope.noPagoPlazo)
                                view.btnAceptarPrueba.enable();
                            else
                                view.btnAceptarPrueba.disable();
                        }
                        else if (view.chPlazo.getValue()) {
                            if (!scope.btnAdicionarPlazo.disabled && scope.bool)
                                view.btnAceptarPrueba.enable();
                            else
                                view.btnAceptarPrueba.disable();
                        }
                        else
                            view.btnAceptarPrueba.disable();
                    }
                }
            }
        );

        view.btnAceptarPrueba.on('click', function () {
            scope.AdicionarModificarPrueba('add', action);
        });

        view.btnAplicarPrueba.on('click', function () {
            scope.AdicionarModificarPrueba('apl', action);
        });

        view.btnCancelarPrueba.on('click', function () {
            view.windowsPrueba.close();
            model.payMoraStore.removeAll();
            model.payDescVentaStore.removeAll();
            model.payDPPStore.removeAll();
            model.payCuotasStore.removeAll();
            scope.noPagoPlazo = false;
        });
    };


this.adicionar = function (action) {
    switch (action) {
        case 'mora':
            scope.totalMora = model.payMoraStore.getCount();
            var recordDinamico = Ext.data.Record.create([
                {
                    name: 'idMora'
                }, {
                    name: 'prcentaje'
                }, {
                    name: 'aplicabledespues'
                }
            ]);
            var agregoMora = new recordDinamico({
                idMora: '',
                prcentaje: '',
                aplicabledespues: ''
            });

            scope.gpMora.getStore().add(agregoMora);
            scope.gpMora.getSelectionModel().selectRow(scope.totalMora);
            scope.gpMora.startEditing(scope.totalMora, 2);
            scope.btnAdicionarMora.disable();
            view.btnAceptarPrueba.disable();
            view.btnAplicarPrueba.disable();
            break;
        case 'plazo':
            scope.totalPlazo = model.payCuotasStore.getCount();
            var recordDinamico = Ext.data.Record.create([
                {
                    name: 'idPlazo'
                }, {
                    name: 'idterminodepago'
                }, {
                    name: 'nombre'
                }, {
                    name: 'prcentajePlazo'
                }, {
                    name: 'fecha'
                }
            ]);
            var agregoPlazo = new recordDinamico({
                idPlazo: '',
                idterminodepago: '',
                nombre: '',
                prcentajePlazo: '',
                fecha: ''
            });

            scope.gpPlazo.getStore().add(agregoPlazo);
            scope.gpPlazo.getSelectionModel().selectRow(scope.totalPlazo);
            scope.gpPlazo.startEditing(scope.totalPlazo, 3);
            scope.btnAdicionarPlazo.disable();
            view.btnAceptarPrueba.disable();
            view.btnAplicarPrueba.disable();
            break;
        case 'descVenta':
            scope.totalDescVenta = model.payDescVentaStore.getCount();
            var recordDinamico = Ext.data.Record.create([
                {
                    name: 'idDescVenta'
                }, {
                    name: 'porciento'
                }, {
                    name: 'cantMinima'
                }, {
                    name: 'cantMaxima'
                }
            ]);
            var agregoDescVenta = new recordDinamico({
                idDescVenta: '',
                porciento: '',
                cantMinima: '',
                cantMaxima: ''
            });

            scope.gpDescVenta.getStore().add(agregoDescVenta);
            scope.gpDescVenta.getSelectionModel().selectRow(scope.totalDescVenta);
            scope.gpDescVenta.startEditing(scope.totalDescVenta, 2);
            scope.btnAdicionarDescVenta.disable();
            view.btnAceptarPrueba.disable();
            view.btnAplicarPrueba.disable();
            break;
        case 'DPP':
            scope.totalDPP = model.payDPPStore.getCount();
            var recordDinamico = Ext.data.Record.create([
                {
                    name: 'idDPP'
                }, {
                    name: 'porciento'
                }, {
                    name: 'antesde'
                }
            ]);
            var agregoDPP = new recordDinamico({
                idDPP: '',
                porciento: '',
                antesde: ''
            });

            scope.gpDPP.getStore().add(agregoDPP);
            scope.gpDPP.getSelectionModel().selectRow(scope.totalDPP);
            scope.gpDPP.startEditing(scope.totalDPP, 2);
            scope.btnAdicionarDPP.disable();
            view.btnAceptarPrueba.disable();
            view.btnAplicarPrueba.disable();
            break;
    }
};

this.crearTabPanelInicial = function (action) {
    var tabs2 = scope.crearTabPanel();
    var tabMora = scope.crearTabs(false, action);
    tabs2.add(tabMora);
    view.panel2.add(tabs2);
    tabs2.setActiveTab(tabMora);
};

this.crearTabPanel = function () {
    this.tabs2 = new Ext.TabPanel({
        autoHeight: true,
        defaults: {autoScroll: true}
    });
    return this.tabs2;
};

this.crearTabs = function (check, action) {
    if (check) {
        var smPayConditionPlazo = new Ext.grid.RowSelectionModel({
            singleSelect: false
        });
        this.rowactionEliminarPlazo = new Ext.grid.RowActions({
            id: 'rowactionEliminarPlazo',
            align: 'center',
            actions: [
                {
                    id: 'eliminarPlazo',
                    tooltip: 'Eliminar mora',//this.idioma.lbDelTalonario,
                    icon: perfil.dirImg + 'eliminar.png',
                    align: 'center',
                    width: 40
                }
            ]
        });
        this.btnAdicionarPlazo = new Ext.Button({
            id: 'btnAdicionarPlazo',
            icon: perfil.dirImg + 'adicionar.png',
            iconCls: 'btn',
            tooltip: etiquetas.tooltipCancelar,
            text: 'Adicionar'//etiquetas.lbCancelar
        });
        this.tfCondicionPagoPlazo = new Ext.form.TextField({
            name: 'condicionaplicar',
            anchor: '100%',
            maskRe: /^([a-zA-Z0-9_ \u00e1\u00e9\u00ed\u00f3\u00fa\u00f1\u00d1  ().:;,"*-])+$/,
            regex: /^([a-zA-Z0-9_ \u00e1\u00e9\u00ed\u00f3\u00fa\u00f1\u00d1  ().:;,"*-])+$/,
            maxLength: 255,
            allowBlank: false,
            enableKeyEvents: true
        });
        this.cbCondicionPagoPlazo = new Ext.form.ComboBox({
            id: 'cbCondicionPagoPlazo',
            store: model.payCondcionPagoStore,
            name: 'idterminodepago',
            valueField: 'idterminodepago',
            hiddenName: 'idterminodepago',
            displayField: 'nombre',
            emptyText: 'Seleccione...',
            disabledClass: 'disabled-component',
            allowBlank: false,
            resizable: true,
            triggerAction: 'all',
            typeAhead: true,
            anchor: '100%',
            mode: 'local',
            maskRe: /^([a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
            tpl: '<tpl for="."><div ext:qtip="{nombre}" class="x-combo-list-item">{nombre}</div></tpl>',
            enableKeyEvents: true
        });

        this.tfPorcientoPlazo = new Ext.form.NumberField({
            name: 'prcentajePlazo',
            anchor: '100%',
            maxLength: 255,
            allowBlank: false,
            enableKeyEvents: true
        });
        scope.fechaPlazo = new Ext.form.DateField({
            name: 'fecha',
            maskRe: /^([0-9 \/\xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9.]*)+$/,
            readOnly: false,
            editable: true,
            allowBlank: false,
            anchor: '100%',
            format: 'd/m/Y',
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            enableKeyEvents: true
        });


        this.gpPlazo = new Ext.grid.EditorGridPanel({
            id: 'gpPlazo',
            title: 'Cuotas',
            layout: 'fit',
            autoExpandColumn: 'prcentajePlazo',
            autoHeight: true,
            store: model.payCuotasStore,
            sm: smPayConditionPlazo,
            plugins: [this.rowactionEliminarPlazo],
            clicksToEdit: 1,
            columns: [
                new Ext.grid.RowNumberer(),
                {
                    hidden: true,
                    hideable: true,
                    dataIndex: 'idPlazo'
                }, {
                    hidden: true,
                    hideable: true,
                    dataIndex: 'idterminodepago'
                }, {
                    header: 'T&eacute;rmino de pago',
                    dataIndex: 'nombre',
                    width: 270,
                    sortable: true,
                    align: 'left',
                    editor: this.cbCondicionPagoPlazo
                }, {
                    id: 'prcentajePlazo',
                    header: 'Porciento (%)',
                    dataIndex: 'prcentajePlazo',
                    width: 120,
                    align: 'left',
                    sortable: true,
                    editor: this.tfPorcientoPlazo
                }, {
                    id: 'fecha',
                    hidden: true,
                    hideable: true,
                    dataIndex: 'fecha'
                },
                this.rowactionEliminarPlazo
            ],
            tbar: [this.btnAdicionarPlazo]
        });

        // Eventos
        this.gpPlazo.on({
            beforeedit: function (e) {
                column = e.column;
                row = e.row;
            },
            afteredit: function (e) {
                var idCondicion = scope.cbCondicionPagoPlazo.getValue();
                var denominacion = scope.cbCondicionPagoPlazo.getRawValue();

                var record = model.payCuotasStore.getAt(row);

                record.set('nombre', denominacion);
                record.set('idterminodepago', idCondicion);

                //VALIDAR BOTONES EN CASO DE QUE SE MODIFIQUE
                if (action == 'mod') {
                    scope.bool = true;
                    view.btnAceptarPrueba.enable();
                }
            }
        });
        this.btnAdicionarPlazo.on('click', function () {
            scope.adicionar('plazo');
        });
        this.rowactionEliminarPlazo.on('action', function (grid, record, accion, rowIndex, col, e) {
            scope.delPlazo.push(record.data.idPlazo);
            scope.gpPlazo.getStore().remove(record);
            scope.tfCondicionPagoPlazo.reset();
            scope.tfPorcientoPlazo.reset();
            scope.fechaPlazo.reset();
            scope.btnAdicionarPlazo.enable();

            //VALIDAR BOTONES EN CASO DE QUE SE ADICIONE
            if (action == 'add') {
                if (model.payCuotasStore.getCount() == 0) {
                    view.btnAceptarPrueba.disable();
                    view.btnAplicarPrueba.disable();
                } else {
                    view.btnAceptarPrueba.enable();
                    view.btnAplicarPrueba.enable();
                }
            }
        }, this);
        this.cbCondicionPagoPlazo.on({
            'keypress': function (t, e) {
                if (e.getKey() == 13) {
                    scope.gpPlazo.startEditing(scope.totalPlazo, 4);
                }
            }
        });
        this.tfPorcientoPlazo.on({
            'keypress': function (t, e) {
                if (e.getKey() == 13) {
                    scope.gpPlazo.startEditing(scope.totalPlazo, 5);
                }
            }
        });
        this.gpPlazo.on({
            'afteredit': function (obj) {
                if (!Ext.isEmpty(obj.record.data.nombre) && !Ext.isEmpty(obj.record.data.prcentajePlazo)) {
                    scope.btnAdicionarPlazo.enable();
                    scope.cbCondicionPagoPlazo.reset();

                    //VALIDAR BOTONES EN CASO DE QUE SE ADICIONE
                    if (action == 'add') {
                        if (!Ext.isEmpty(view.tfDenominacionPrueba.getValue())) {
                            view.btnAceptarPrueba.enable();
                            view.btnAplicarPrueba.enable();
                        }
                    }
                } else {
                    scope.btnAdicionarPlazo.disable();
                    view.btnAceptarPrueba.disable();
                    view.btnAplicarPrueba.disable();
                }


            }
        });

        return this.gpPlazo;
    }
    else if (scope.ferst || !check) {
        var smPayConditionMora = new Ext.grid.RowSelectionModel({
            singleSelect: false
        });
        this.rowactionEliminarMora = new Ext.grid.RowActions({
            id: 'rowactionEliminarMora',
            align: 'center',
            actions: [
                {
                    id: 'eliminarMora',
                    tooltip: 'Eliminar mora',//this.idioma.lbDelTalonario,
                    icon: perfil.dirImg + 'eliminar.png',
                    align: 'center',
                    width: 40
                }
            ]
        });
        this.btnAdicionarMora = new Ext.Button({
            id: 'btnAdicionarMora',
            icon: perfil.dirImg + 'adicionar.png',
            iconCls: 'btn',
            tooltip: etiquetas.tooltipCancelar,
            text: 'Adicionar'
        });
        this.tfPorcientoMora = new Ext.form.NumberField({
            name: 'prcentaje',
            anchor: '100%',
            maxLength: 255,
            allowBlank: false,
            enableKeyEvents: true
        });
        this.tfDespuesdeMora = new Ext.form.NumberField({
            name: 'aplicabledespues',
            labelAlign: 'top',
            anchor: '100%',
            maxLength: 255,
            width: 200,
            allowBlank: false,
            enableKeyEvents: true
        });

        this.gpMora = new Ext.grid.EditorGridPanel({
            id: 'gpMora',
            title: 'Mora',
            layout: 'fit',
            autoHeight: true,//(scope.ferst) ? true : false,
            autoExpandColumn: 'aplicabledespues',
            store: model.payMoraStore,
            sm: smPayConditionMora,
            clicksToEdit: 1,
            plugins: [this.rowactionEliminarMora],
            columns: [
                new Ext.grid.RowNumberer(),
                {
                    hidden: true,
                    hideable: true,
                    dataIndex: 'idMora'
                }, {
                    header: 'Porciento (%)',
                    dataIndex: 'prcentaje',
                    width: 250,
                    align: 'left',
                    sortable: true,
                    editor: this.tfPorcientoMora
                }, {
                    id: 'aplicabledespues',
                    header: 'Despu&eacute;s de (d&iacute;as)',
                    dataIndex: 'aplicabledespues',
                    width: 140,
                    sortable: true,
                    align: 'left',
                    editor: this.tfDespuesdeMora
                },
                this.rowactionEliminarMora
            ],
            tbar: [this.btnAdicionarMora]
        });

        // Eventos
        this.btnAdicionarMora.on('click', function () {
            scope.adicionar('mora');
        });
        this.tfPorcientoMora.on({
            'keypress': function (t, e) {
                if (e.getKey() == 13) {
                    scope.gpMora.startEditing(scope.totalMora, 3);
                }
            }
        });
        this.rowactionEliminarMora.on('action', function (grid, record, accion, rowIndex, col, e) {
            scope.delMora.push(record.data.idMora);
            scope.gpMora.getStore().remove(record);
            scope.tfPorcientoMora.reset();
            scope.tfDespuesdeMora.reset();
            scope.btnAdicionarMora.enable();

            //VALIDAR BOTONES EN CASO DE QUE SE ADICIONE
            if (action == 'add') {
                if (model.payMoraStore.getCount() == 0) {
                    view.btnAceptarPrueba.disable();
                    view.btnAplicarPrueba.disable();
                } else {
                    view.btnAceptarPrueba.enable();
                    view.btnAplicarPrueba.enable();
                }
            }


        }, this);
        this.gpMora.on({
            'afteredit': function (obj) {
                if (!Ext.isEmpty(obj.record.data.prcentaje) && !Ext.isEmpty(obj.record.data.aplicabledespues)) {
                    scope.btnAdicionarMora.enable();

                    //VALIDAR BOTONES EN CASO DE QUE SE ADICIONE
                    if (action == 'add') {
                        if (scope.validateGridMora()) {
                            view.btnAceptarPrueba.enable();
                            view.btnAplicarPrueba.enable();
                        }
                    }

                    //VALIDAR BOTONES EN CASO DE QUE SE MODIFIQUE
                    if (action == 'mod') {
                        scope.noPagoPlazo = true;
                        view.btnAceptarPrueba.enable();
                    }
                }
                else {
                    scope.btnAdicionarMora.disable();
                    view.btnAceptarPrueba.disable();
                    view.btnAplicarPrueba.disable();
                }
            }
        });

        scope.ferst = false;
        return this.gpMora;
    }
};

this.crearTabsDescuentos = function (tabs, action) {
    switch (tabs) {
        case 'descVentas':
            var smPayConditionDescVenta = new Ext.grid.RowSelectionModel({
                singleSelect: false
            });
            this.rowactionEliminarDescVenta = new Ext.grid.RowActions({
                id: 'rowactionEliminarDescVenta',
                align: 'center',
                actions: [
                    {
                        id: 'eliminarDescVenta',
                        tooltip: 'Eliminar descunto en venta',//this.idioma.lbDelTalonario,
                        icon: perfil.dirImg + 'eliminar.png',
                        align: 'center',
                        width: 40
                    }
                ]
            });
            this.btnAdicionarDescVenta = new Ext.Button({
                id: 'btnAdicionarPlazo',
                icon: perfil.dirImg + 'adicionar.png',
                iconCls: 'btn',
                tooltip: etiquetas.tooltipCancelar,
                text: 'Adicionar'//etiquetas.lbCancelar
            });
            this.tfPorcientoDescVenta = new Ext.form.NumberField({
                name: 'prcentajePlazo',
                anchor: '100%',
                maxLength: 255,
                allowBlank: false,
                enableKeyEvents: true
            });
            this.tfCantMinimaDescVenta = new Ext.form.NumberField({
                name: 'prcentajeCantMinima',
                anchor: '100%',
                maxLength: 255,
                allowBlank: false,
                enableKeyEvents: true
            });
            this.tfCantMaximaDescVenta = new Ext.form.NumberField({
                name: 'prcentajeCantMaxima',
                anchor: '100%',
                maxLength: 255,
                allowBlank: false,
                enableKeyEvents: true
            });

            this.gpDescVenta = new Ext.grid.EditorGridPanel({
                id: 'gpDescVenta',
                title: 'Descuentos en venta',
                layout: 'fit',
                autoExpandColumn: 'cantMaxima',
                autoHeight: true,
                store: model.payDescVentaStore,
                sm: smPayConditionDescVenta,
                plugins: [this.rowactionEliminarDescVenta],
                clicksToEdit: 1,
                columns: [
                    new Ext.grid.RowNumberer(),
                    {
                        hidden: true,
                        hideable: true,
                        dataIndex: 'idDescVenta'
                    }, {
                        header: 'Porciento (%)',
                        dataIndex: 'porciento',
                        width: 150,
                        sortable: true,
                        align: 'left',
                        editor: this.tfPorcientoDescVenta
                    }, {
                        header: 'Cantidad m&iacute;nima',
                        dataIndex: 'cantMinima',
                        width: 150,
                        align: 'left',
                        sortable: true,
                        editor: this.tfCantMinimaDescVenta
                    }, {
                        id: 'cantMaxima',
                        header: 'Cantidad m&aacute;xima',
                        dataIndex: 'cantMaxima',
                        width: 150,
                        align: 'left',
                        sortable: true,
                        editor: this.tfCantMaximaDescVenta
                    },
                    this.rowactionEliminarDescVenta
                ],
                tbar: [this.btnAdicionarDescVenta]
            });

            // Eventos
            this.btnAdicionarDescVenta.on('click', function () {
                scope.adicionar('descVenta');
            });
            this.rowactionEliminarDescVenta.on('action', function (grid, record, accion, rowIndex, col, e) {
                scope.delDescVenta.push(record.data.idDescVenta);
                scope.gpDescVenta.getStore().remove(record);
                scope.tfPorcientoDescVenta.reset();
                scope.tfCantMinimaDescVenta.reset();
                scope.tfCantMaximaDescVenta.reset();
                scope.btnAdicionarDescVenta.enable();
            }, this);
            this.tfPorcientoDescVenta.on({
                'keypress': function (t, e) {
                    if (e.getKey() == 13) {
                        scope.gpDescVenta.startEditing(scope.totalDescVenta, 3);
                    }
                }
            });
            this.tfCantMinimaDescVenta.on({
                'keypress': function (t, e) {
                    if (e.getKey() == 13) {
                        scope.gpDescVenta.startEditing(scope.totalDescVenta, 4);
                    }
                }
            });
            this.gpDescVenta.on({
                'afteredit': function (obj) {
                    if (!Ext.isEmpty(obj.record.data.porciento) && !Ext.isEmpty(obj.record.data.cantMinima) && !Ext.isEmpty(obj.record.data.cantMaxima)) {
                        scope.btnAdicionarDescVenta.enable();

                        //VALIDAR BOTONES EN CASO DE QUE SE ADICIONE
                        if (action == 'add') {
                            if (scope.validateGridDescVenta()) {
                                view.btnAceptarPrueba.enable();
                                view.btnAplicarPrueba.enable();
                            }
                        }

                        //VALIDAR BOTONES EN CASO DE QUE SE MODIFIQUE
                        if (action == 'mod') {
                            scope.noPagoPlazo = true;
                            view.btnAceptarPrueba.enable();
                        }
                    } else {
                        scope.btnAdicionarDescVenta.disable();
                        view.btnAceptarPrueba.disable();
                        view.btnAplicarPrueba.disable();
                    }
                }
            });

            return this.gpDescVenta;

        case 'DPP':
            var smPayConditionDPP = new Ext.grid.RowSelectionModel({
                singleSelect: false
            });
            this.rowactionEliminarDPP = new Ext.grid.RowActions({
                id: 'rowactionEliminarDPP',
                align: 'center',
                actions: [
                    {
                        id: 'eliminarDPP',
                        tooltip: 'Eliminar descuento por pronto pago',//this.idioma.lbDelTalonario,
                        icon: perfil.dirImg + 'eliminar.png',
                        align: 'center',
                        width: 40
                    }
                ]
            });
            this.btnAdicionarDPP = new Ext.Button({
                id: 'btnAdicionarPlazo',
                icon: perfil.dirImg + 'adicionar.png',
                iconCls: 'btn',
                tooltip: etiquetas.tooltipCancelar,
                text: 'Adicionar'//etiquetas.lbCancelar
            });
            this.tfPorcientoDPP = new Ext.form.NumberField({
                name: 'prcentajeDPP',
                anchor: '100%',
                maxLength: 255,
                allowBlank: false,
                enableKeyEvents: true
            });
            this.tfAntesde = new Ext.form.NumberField({
                name: 'antesde',
                anchor: '100%',
                maxLength: 255,
                allowBlank: false,
                enableKeyEvents: true
            });

            this.gpDPP = new Ext.grid.EditorGridPanel({
                id: 'gpDPP',
                title: 'DPP',
                layout: 'fit',
                autoExpandColumn: 'antesde',
                autoHeight: true,
                store: model.payDPPStore,
                sm: smPayConditionDPP,
                plugins: [this.rowactionEliminarDPP],
                clicksToEdit: 1,
                columns: [
                    new Ext.grid.RowNumberer(),
                    {
                        hidden: true,
                        hideable: true,
                        dataIndex: 'idDPP'
                    }, {
                        header: 'Porciento (%)',
                        dataIndex: 'porciento',
                        width: 200,
                        sortable: true,
                        align: 'left',
                        editor: this.tfPorcientoDPP
                    }, {
                        id: 'antesde',
                        header: 'Antes de (d&iacuteas)',
                        dataIndex: 'antesde',
                        width: 200,
                        align: 'left',
                        sortable: true,
                        editor: this.tfAntesde
                    },
                    this.rowactionEliminarDPP
                ],
                tbar: [this.btnAdicionarDPP]
            });

            // Eventos
            this.btnAdicionarDPP.on('click', function () {
                scope.adicionar('DPP');
            });
            this.rowactionEliminarDPP.on('action', function (grid, record, action, rowIndex, col, e) {
                scope.delDPP.push(record.data.idDPP);
                scope.gpDPP.getStore().remove(record);
                scope.tfPorcientoDPP.reset();
                scope.tfAntesde.reset();
                scope.btnAdicionarDPP.enable();
            }, this);
            this.tfPorcientoDPP.on({
                'keypress': function (t, e) {
                    if (e.getKey() == 13)
                        scope.gpDPP.startEditing(scope.totalDPP, 3);
                }
            })
            this.gpDPP.on({
                'afteredit': function (obj) {
                    if (!Ext.isEmpty(obj.record.data.porciento) && !Ext.isEmpty(obj.record.data.antesde)) {
                        scope.btnAdicionarDPP.enable();

                        //VALIDAR BOTONES EN CASO DE ADICIONAR
                        if (action == 'add') {
                            if (scope.validateGridDPP()) {
                                view.btnAceptarPrueba.enable();
                                view.btnAplicarPrueba.enable();
                            }
                        }

                        //VALIDAR BOTONES EN CASO DE QUE SE MODIFIQUE
                        if (action == 'mod') {
                            scope.noPagoPlazo = true;
                            view.btnAceptarPrueba.enable();
                        }
                    }
                    else {
                        scope.btnAdicionarDPP.disable();
                        view.btnAceptarPrueba.disable();
                        view.btnAplicarPrueba.disable();
                    }
                }
            });

            return this.gpDPP;
    }
}

this.AdicionarModificarPrueba = function (addapl, action) {
    Ext.Msg.wait('Guardando datos del t&eacute;rmino de pago.', 'Por favor espere...');
    var arrPlazo = [];
    var arrDPP = [];
    var arrMora = [];
    var arrDescuentosVenta = [];

    for (var i = 0; i < model.payMoraStore.getCount(); i++) {
        arrMora.push(model.payMoraStore.getAt(i).data);
    }

    if (view.chPlazo.getValue()) {
        for (var i = 0; i < model.payCuotasStore.getCount(); i++) {
            arrPlazo.push({
                idPlazo: model.payCuotasStore.getAt(i).data.idPlazo,
                //denominacion: scope.cbCondicionPagoPlazo.getRawValue(),//model.payCuotasStore.getAt(i).data.nombre,
                //idcondicionpago: scope.cbCondicionPagoPlazo.getValue(),//model.payCuotasStore.getAt(i).data.idterminodepago,
                denominacion: model.payCuotasStore.getAt(i).data.nombre,
                idcondicionpago: model.payCuotasStore.getAt(i).data.idterminodepago,
                //fecha: model.payCuotasStore.getAt(i).data.fecha.format('d/m/Y'),
                prcentajePlazo: model.payCuotasStore.getAt(i).data.prcentajePlazo
            });
        }
    }

    if (view.chDescuentoVentas.getValue()) {
        for (var i = 0; i < model.payDescVentaStore.getCount(); i++)
            arrDescuentosVenta.push(model.payDescVentaStore.getAt(i).data);
    }

    if (view.chDescuentoPago.getValue()) {
        for (var i = 0; i < model.payDPPStore.getCount(); i++)
            arrDPP.push(model.payDPPStore.getAt(i).data);
    }

    Ext.Ajax.request({
        url: 'registrarCondicion',
        method: 'POST',
        params: {
            idterminopago: (action == 'mod') ? view.smPayCondition.getSelected().data.idterminodepago : '-1',
            predeterminado: (action == 'mod') ? view.smPayCondition.getSelected().data.predeterminado : '-1',
            denominacion: view.tfDenominacionPrueba.getValue(),
            plazoCuotas: Ext.encode(arrPlazo),
            plazo: view.tfPlazoPrueba.getValue(),
            tiempo: view.cbTiempoPlazo.getValue(),
            mora: Ext.encode(arrMora),
            dpp: Ext.encode(arrDPP),
            descuentos: Ext.encode(arrDescuentosVenta),
            delMora: Ext.encode(scope.delMora),
            delDescVenta: Ext.encode(scope.delDescVenta),
            delDPP: Ext.encode(scope.delDPP),
            delPlazo: Ext.encode(scope.delPlazo)
        },
        callback: function (options, success, response) {
            Ext.Msg.hide();
            scope.delMora = [];
            scope.delDescVenta = [];
            scope.delDPP = [];
            scope.delPlazo = [];
            //scope.cbCondicionPagoPlazo.reset();

            var message = (action == 'mod') ? 'El t&eacute;rmino de pago ha sido modificado satisfactoriamente.' : 'El t&eacute;rmino de pago ha sido adicionado satisfactoriamente.';
            var responseData = Ext.decode(response.responseText);
            if (responseData.codM == 1) {
                (addapl == 'apl') ? scope.limpiar() : view.windowsPrueba.destroy();
                model.payMoraStore.removeAll();
                model.payDescVentaStore.removeAll();
                model.payDPPStore.removeAll();
                model.payCuotasStore.removeAll();
                mostrarMensaje(1, message, function () {
                    scope.MostrarMascara('Cargando...');
                    model.payConditionStore.load({
                        callback: function () {
                            loadMask.hide();
                            view.btnPrueba.focus();
                        }
                    })
                });
            } else {
                mostrarMensaje(1, 'No se pudo adicionar el t&eacute;rmino de pago.', function () {
                });
            }
        }
    });
}

this.DeletePayCondition = function (selecteds) {
    var message = (selecteds.length > 1) ? 'Los t&eacute;rminos de pago se eliminaron satisfactoriamente.' : 'El t&eacute;rmino de pago se elimin&oacute; satisfactoriamente.'
    var arrayData = [];
    for (var i = 0; i < selecteds.length; i++) {
        arrayData.push(selecteds[i].data);
    }

    Ext.Msg.wait(msgDel, 'Por favor espere...');
    Ext.Ajax.request({
        url: 'deletePayCondition',
        method: 'POST',
        params: {
            condiciones: Ext.encode(arrayData)
        },
        callback: function (options, success, response) {
            //loadMask.hide();
            if (!response.responseText) {
                scope.disabledKeyMap = true;
                mostrarMensaje(3, etiquetas.msgDefaultError, function () {
                    scope.disabledKeyMap = false;
                });
            } else {
                var responseData = Ext.decode(response.responseText);
                if (responseData.codM == 1) {
                    mostrarMensaje(1, message, function () {
                        scope.MostrarMascara('Cargando...');
                        model.payConditionStore.load({
                            callback: function () {
                                loadMask.hide();
                                view.btnPrueba.focus();
                            }
                        })
                    });
                } else {
                    mostrarMensaje(1, 'No se pudo eliminar el t&eacute;rmino de pago.', function () {
                    });
                }
            }
        }
    });
};

this.ActivePayCondition = function (selected) {
    Ext.Msg.wait('Predeterminando la condici&oacute;n general.', 'Por favor espere...');
    Ext.Ajax.request({
        url: 'activePayCondition',
        method: 'POST',
        params: {
            idterminodepago: selected.json.idterminodepago,
            denominacion: selected.json.nombre
        },
        callback: function (options, success, response) {
            //loadMask.hide();
            Ext.Msg.hide();
            if (!response.responseText) {
                scope.disabledKeyMap = true;
                mostrarMensaje(3, etiquetas.msgDefaultError, function () {
                    scope.disabledKeyMap = false;
                });
            } else {
                var responseData = Ext.decode(response.responseText);
                mostrarMensaje(1, etiquetas.msgActiveSuccess.replace("<#>", responseData.success[0].denominacion), function () {
                    scope.MostrarMascara('Cargando...');
                    model.payConditionStore.load({
                        callback: function () {
                            loadMask.hide();
                            view.btnPrueba.focus();
                        }
                    })
                });
            }
        }
    });
};

this.loadDataMod = function (idterminodepago) {
    Ext.Ajax.request({
        url: 'loadDataMod',
        method: 'POST',
        params: {
            idterminodepago: idterminodepago
        },
        callback: function (options, success, response) {
            var responseData = Ext.decode(response.responseText);

            model.payMoraStore.loadData(responseData.mora);
            scope.oldCountMora = model.payMoraStore.getCount();

            model.payDescVentaStore.loadData(responseData.descventa);
            scope.oldCountDescVenta = model.payDescVentaStore.getCount();

            model.payDPPStore.loadData(responseData.dpp);
            scope.oldCountDPP = model.payDPPStore.getCount();

            model.payCuotasStore.loadData(responseData.cuotas);
            scope.oldCountCuotas = model.payCuotasStore.getCount();
            /*for(var i = 0; i < responseData.cuotas.length; i++) {
             model.payCuotasStore.getAt(i).set('nombre', denominacion);
             model.payCuotasStore.getAt(i).set('idterminodepago', idCondicion);
             }*/
        }
    });
}

view.paginToolbar.on({
    beforechange: function () {
        Ext.getBody().mask('Cargando...');
        var instance = new PagingToolbarSelections({
            'selections': view.smPayCondition.getSelections(),
            'activePage': this.getPageData().activePage
        });
        instance.saveSelectionsOnPage(scope.arrayValues);
    },
    change: function () {
        Ext.getBody().unmask();
        var instance = new PagingToolbarSelections({
            'activePage': this.getPageData().activePage
        });
        instance.setSelectionsOnPage(scope.arrayValues, view.grid);
    }
});

this.getSelectionsOnPaging = function () {
    var instance = new PagingToolbarSelections({
        'selections': view.grid.getSelectionModel().getSelections(),
        'activePage': view.grid.getBottomToolbar().getPageData().activePage
    });
    return instance.getSelectionsOnArray(scope.arrayValues);
};

view.smPayCondition.on({
    rowselect: function (smodel, rowIndex, record) {
        if (smodel.getSelections().length == 1) {
            if (!smodel.getSelections()[0].data.usado)
                view.btnModificarPrueba.enable();
            if (!smodel.getSelections()[0].data.usado)
                view.btnEliminarPrueba.enable();
            if (smodel.getSelections()[0].data.predeterminado == 0)
                view.btnActivarPrueba.enable();
        } else {
            if (smodel.getSelections().length > 1) {
                view.btnModificarPrueba.disable();
                view.btnActivarPrueba.disable();
                if (scope.enUso(smodel.getSelections()))
                    view.btnEliminarPrueba.disable();
                else
                    view.btnEliminarPrueba.enable();
            }
        }
        view.grid.getView().addRowClass(rowIndex, "negrita");
    },
    rowdeselect: function (smodel, rowIndex, record) {
        if (smodel.hasSelection()) {
            if (smodel.getSelections().length == 1) {
                if (smodel.getSelections()[0].data.usado)
                    view.btnModificarPrueba.disable();
                view.btnModificarPrueba.enable();
                if (!smodel.getSelections()[0].data.usado)
                    view.btnEliminarPrueba.enable();
                if (smodel.getSelections()[0].data.predeterminado == 0)
                    view.btnActivarPrueba.enable();
            } else {
                if (smodel.getSelections().length > 1) {
                    view.btnModificarPrueba.disable();
                    view.btnActivarPrueba.disable();
                    if (scope.enUso(smodel.getSelections()))
                        view.btnEliminarPrueba.disable();
                    else
                        view.btnEliminarPrueba.enable();
                }
            }
        }
        else {
            view.btnModificarPrueba.disable();
            view.btnEliminarPrueba.disable();
            view.btnActivarPrueba.disable();
        }
        view.grid.getView().removeRowClass(rowIndex, "negrita");
    }
});

/****************************FUNCIONES AUXILIARES**********************************/

    //VALIDAR BOTONES EN CASO DE QUE SE MODIFIQUE

this.validatetfDenominacion = function () {
    var bool = false;
    if ((!Ext.isEmpty(view.tfPlazoPrueba.getValue()) && !Ext.isEmpty(view.cbTiempoPlazo.getValue()) && model.payMoraStore.getCount() > 0 && !scope.btnAdicionarMora.disabled) ||
        view.chPlazo.getValue() && model.payCuotasStore.getCount() > 0 && !scope.btnAdicionarPlazo.disabled) {
        bool = true;
        if (view.chDescuentoVentas.getValue()) {
            if (model.payDescVentaStore.getCount() > 0 && !scope.btnAdicionarDescVenta.disabled)
                bool = true;
            else
                return false;
        }
        if (view.chDescuentoPago.getValue()) {
            if (model.payDPPStore.getCount() > 0 && !scope.btnAdicionarDPP.disabled)
                bool = true;
            else
                return false;
        }
    }
    return bool;
}
this.validatetfPlazoPrueba = function () {
    var bool = false;
    if ((!Ext.isEmpty(view.tfDenominacionPrueba.getValue()) && !Ext.isEmpty(view.cbTiempoPlazo.getValue()) && model.payMoraStore.getCount() > 0 && !scope.btnAdicionarMora.disabled)) {
        bool = true;
        if (view.chDescuentoVentas.getValue()) {
            if (model.payDescVentaStore.getCount() > 0 && !scope.btnAdicionarDescVenta.disabled)
                bool = true;
            else
                return false;
        }
        if (view.chDescuentoPago.getValue()) {
            if (model.payDPPStore.getCount() > 0 && !scope.btnAdicionarDPP.disabled)
                bool = true;
            else
                return false;
        }
    }
    return bool;
}
this.validatecbTiempoPlazo = function () {
    var bool = false;
    if ((!Ext.isEmpty(view.tfDenominacionPrueba.getValue()) && !Ext.isEmpty(view.tfPlazoPrueba.getValue()) && model.payMoraStore.getCount() > 0 && !scope.btnAdicionarMora.disabled)) {
        bool = true;
        if (view.chDescuentoVentas.getValue()) {
            if (model.payDescVentaStore.getCount() > 0 && !scope.btnAdicionarDescVenta.disabled)
                bool = true;
            else
                return false;
        }
        if (view.chDescuentoPago.getValue()) {
            if (model.payDPPStore.getCount() > 0 && !scope.btnAdicionarDPP.disabled)
                bool = true;
            else
                return false;
        }
    }
    return bool;
}
this.validateGridMora = function () {
    var bool = false;
    if (!Ext.isEmpty(view.tfDenominacionPrueba.getValue()) && !Ext.isEmpty(view.cbTiempoPlazo.getValue()) && !Ext.isEmpty(view.cbTiempoPlazo.getValue())) {
        bool = true;
        if (view.chDescuentoVentas.getValue()) {
            if (model.payDescVentaStore.getCount() > 0 && !scope.btnAdicionarDescVenta.disabled)
                bool = true;
            else
                return false;
        }
        if (view.chDescuentoPago.getValue()) {
            if (model.payDPPStore.getCount() > 0 && !scope.btnAdicionarDPP.disabled)
                bool = true;
            else
                return false;
        }
    }
    return bool;
}
this.validateGridDescVenta = function () {
    var bool = false;
    if (!Ext.isEmpty(view.tfDenominacionPrueba.getValue()) && !Ext.isEmpty(view.cbTiempoPlazo.getValue()) && !Ext.isEmpty(view.cbTiempoPlazo.getValue()) &&
        model.payMoraStore.getCount() > 0 && !scope.btnAdicionarMora.disabled) {
        bool = true;
        if (view.chDescuentoPago.getValue()) {
            if (model.payDPPStore.getCount() > 0 && !scope.btnAdicionarDPP.disabled)
                bool = true;
            else
                return false;
        }
    }
    return bool;
}
this.validateGridDPP = function () {
    var bool = false;
    if (!Ext.isEmpty(view.tfDenominacionPrueba.getValue()) && !Ext.isEmpty(view.cbTiempoPlazo.getValue()) && !Ext.isEmpty(view.cbTiempoPlazo.getValue()) &&
        model.payMoraStore.getCount() > 0 && !scope.btnAdicionarMora.disabled) {
        bool = true;
        if (view.chDescuentoVentas.getValue()) {
            if (model.payDescVentaStore.getCount() > 0 && !scope.btnAdicionarDescVenta.disabled)
                bool = true;
            else
                return false;
        }
    }
    return bool;
}

//VALIDAR BOTONES EN CASO DE QUE SE MODIFIQUE
this.modificoGridPlazo = function (objeto, id) {
    if ((objeto.field == "nombre" && id != objeto.value) || (objeto.field == "prcentajePlazo" && objeto.originalValue != objeto.value))
        return true;
    return false;
}


this.limpiar = function () {
    view.tfDenominacionPrueba.reset();
    view.tfPlazoPrueba.reset();
    view.cbTiempoPlazo.reset();
    view.chPlazo.setValue(false);
    view.chDescuentoVentas.setValue(false);
    view.chDescuentoPago.setValue(false);
    model.payMoraStore.removeAll();
}

this.MostrarMascara = function (mensaje) {
    loadMask = new Ext.LoadMask(Ext.getBody(), {
        msg: mensaje
    });
    loadMask.show();
};

this.enUso = function (selects) {
    var bool = false;
    for (var i = 0; i < selects.length; i++) {
        if (selects[i].data.usado) {
            bool = true;
        }
    }
    return bool;
}

this.EventosAyuda = function () {
    var title = 'Mostrar ayuda de la funcionalidad';
    var referencia = 'copa/config/condiciones_generales';
    help.show(title, referencia);
};
}
}
;