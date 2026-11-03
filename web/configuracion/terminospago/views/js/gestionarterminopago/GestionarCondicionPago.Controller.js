/**
 * GestionarGondicionPago.Controller
 *
 * @author Ing. Rodain Terrer Molina
 * @version 1.0
 */
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
                if (!view.btnAdicionar.disabled && !scope.disabledKeyMap) {
                    view.btnAdicionar.handler.call();
                }
            }
        }, {
            // MODIFICAR
            key: 'm',
            alt: true,
            fn: function () {
                if (!view.btnModificar.disabled && !scope.disabledKeyMap) {
                    view.btnModificar.handler.call();
                }
            }
        }, {
            // ELIMINAR
            key: Ext.EventObject.DELETE,
            fn: function () {
                if (!view.btnEliminar.disabled && view.smPayCondition.hasSelection() && !scope.disabledKeyMap) {
                    view.btnEliminar.handler.call();
                }
            }
        }, {
            // //Activar
            //key: 'x',
            key: 'y',
            alt: true,
            fn: function () {
                if (!view.btnActivar.disabled && !scope.disabledKeyMap) {
                    Ext.EventObject.stopEvent();
                    view.btnActivar.handler.call();
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
                view.btnModificar.disable();
                view.btnEliminar.disable();
                view.btnActivar.disable();
                if (scope.cont > 0)
                    Ext.getBody().mask(etiquetas.msgLoading);
                else {
                    Ext.Msg.wait(etiquetas.msgLoading, etiquetas.msgWait);
                }
            },
            load: function (store, records, options) {
                if (records.length === 0) {
                    var message = (model.payConditionStore.baseParams.denominacion) ? etiquetas.msgNoElementSearch : etiquetas.emptyMsg;
                    view.grid.body.unmask();
                    mostrarMensaje(1, message);
                }

                if (scope.cont > 0) {
                    Ext.getBody().unmask();
                } else {
                    Ext.Msg.hide();
                }
                scope.cont++;
            }
        });

        view.btnAdicionar.setHandler(function () {
            scope.ferst = true;
            scope.ClickAddPayConditionAction();
        });

        view.btnModificar.setHandler(function () {
            scope.ClickModPayConditionAction();
        });

        view.btnEliminar.setHandler(function () {
            scope.ClickDeletePayConditionAction();
        });

        view.btnActivar.setHandler(function () {
            scope.ClickActivePayConditionAction();
        });

        view.btnUsar.setHandler(function () {
            scope.ClickUsarEntidadConditionAction(true);
        });

        view.btnNoUsar.setHandler(function () {
            scope.ClickUsarEntidadConditionAction(false);
        });

        view.btnAyuda.setHandler(function () {
            scope.EventosAyuda();
        });

        this.ClickAddPayConditionAction = function () {
            scope.WindowsFactory('add');
        };

        this.ClickModPayConditionAction = function () {
            scope.WindowsFactory('mod');
        };

        this.ClickDeletePayConditionAction = function () {
            scope.disabledKeyMap = true;
            var selected = view.smPayCondition.getSelections();//scope.getSelectionsOnPaging();
            if (selected.length > 0) {
                var mensaje = (selected.length > 1) ? etiquetas.msgConfirmDeletePlural : etiquetas.msgConfirmDelete;
                msgDel = (selected.length > 1) ? etiquetas.msgWaitDeletePlural : etiquetas.msgWaitDelete;
                mostrarMensaje(2, mensaje, function (btnPress) {
                    if (btnPress === 'ok') {
                        scope.DeletePayCondition(selected);
                    }
                    scope.disabledKeyMap = false;
                });
            } else {
                scope.disabledKeyMap = false;
                mostrarMensaje(3, etiquetas.msgNoSecuenceSelected);
            }
        };

        this.ClickActivePayConditionAction = function () {
            scope.disabledKeyMap = true;
            var selected = view.smPayCondition.getSelected();
            Ext.Msg.confirm(etiquetas.titleConfirm, etiquetas.msgConfirmActive.replace("<#>", selected.json.nombre), function (btnPress) {
                if (btnPress === 'yes') {
                    scope.ActivePayCondition(selected);
                }
                scope.disabledKeyMap = false;
            });
        };

        this.ClickUsarEntidadConditionAction = function(usar){
//             console.log('yayayay')
            var ids=[],  
                selected = view.smPayCondition.getSelections();
                console.log(selected);
            selected.forEach(function(x){
                ids.push(x.get('idterminodepago'));
            });
            console.log(ids);
            Ext.Msg.wait(etiquetas.msgWaitUsarEntidad, etiquetas.msgWait);
            Ext.Ajax.request({
                url: 'gestionarUso',
                method: 'POST',
                params: {
                    usar: usar,
                    idterminospagos: Ext.encode(ids)
                },
                callback: function (options, success, response) {
                    Ext.Msg.hide();
                    var responseData = Ext.decode(response.responseText); 
                    var message = usar ? etiquetas.msgAdicionadoEntidad : etiquetas.msgEliminadoEntidad;
                    mostrarMensaje(1, message);   
                    view.grid.getStore().load();
                }
            });
        };

        this.WindowsFactory = function (action) {
            view.createWindow(etiquetas, action);
            view.window.on({
                beforeshow: function () {
                    scope.crearTabPanelInicial(action);
                    scope.eventos(action);
                    model.payCondcionPagoStore.load();

                    if (action === 'mod') {
                        if (view.smPayCondition.hasSelection()) {
                            var selected = view.smPayCondition.getSelected();

                            view.tfDenominacion.setValue(selected.json.nombre);
                            scope.oldDenominacion = selected.json.nombre;

                            view.tfPlazo.setValue(selected.json.plazo);
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
                            view.window.focus();
                        }
                    } else {
                        setTimeout(function () {
                            view.first.focus();
                        }, 100);
                    }
                },
                destroy: function () {
                    scope.disabledKeyMap = false;
                }
            });
            view.window.show();
            scope.disabledKeyMap = true;
        };

        this.eventos = function (action) {
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

                    view.tfPlazo.reset();
                    view.tfPlazo.disable();

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
                    view.tfPlazo.enable();
                    if (!view.cbTiempoPlazo) {
                        view.cbTiempoPlazo.enable();
                    }
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

            view.tfPlazo.on({
                'keyup': function (tf) {
                    if (tf.getValue() !== "")
                        view.chPlazo.disable();
                    else
                        view.chPlazo.enable();

                    //scope.validateWindow();
                    // VALIDAR LOS BOTONOS EN CASO DE ADICIONAR
                    if (action == 'add') {
                        if (tf.getValue() != '') {
                            if (scope.validatetfPlazo()) {
                                view.btnAceptar.enable();
                                view.btnAplicar.enable();
                            }
                        } else {
                            view.btnAceptar.disable();
                            view.btnAplicar.disable();
                        }
                    }

                    //VALIDAR LOS BOTONOS EN CASO DE MODIFICAR
                    if (action == 'mod') {
                        if (tf.getValue() != scope.oldPlazo)
                            view.btnAceptar.enable();
                        else if (!view.chPlazo.getValue()) {
                            if (view.cbTiempoPlazo.getValue() != scope.oldTiempoPlazo || view.tfDenominacion.getValue() != scope.oldDenominacion || scope.noPagoPlazo)
                                view.btnAceptar.enable();
                            else
                                view.btnAceptar.disable();
                        }
                        else if (view.chPlazo.getValue()) {
                            if (!scope.btnAdicionarPlazo.disabled && scope.bool)
                                view.btnAceptar.enable();
                            else
                                view.btnAceptar.disable();
                        }
                        else
                            view.btnAceptar.disable();
                    }
                }
            });

            view.cbTiempoPlazo.on({
                'select': function (combo) {
                    //scope.validateWindow();
                    // VALIDAR LOS BOTONOS EN CASO DE ADICIONAR
                    if (action == 'add') {
                        if (combo.getValue() != '') {
                            if (scope.validatecbTiempoPlazo()) {
                                view.btnAceptar.enable();
                                view.btnAplicar.enable();
                            }
                        } else {
                            view.btnAceptar.disable();
                            view.btnAplicar.disable();
                        }
                    }

                    //VALIDAR LOS BOTONOS EN CASO DE MODIFICAR
                    if (action == 'mod') {
                        if (combo.getValue() != scope.oldTiempoPlazo)
                            view.btnAceptar.enable();
                        else if (!view.chPlazo.getValue() /*&& model.payMoraStore.getCount() > 0*/) {
                            if (view.tfPlazo.getValue() != scope.oldPlazo || view.tfDenominacion.getValue() != scope.oldDenominacion || scope.noPagoPlazo)
                                view.btnAceptar.enable();
                            else
                                view.btnAceptar.disable();
                        }
                        else if (view.chPlazo.getValue()) {
                            if (!scope.btnAdicionarPlazo.disabled && scope.bool)
                                view.btnAceptar.enable();
                            else
                                view.btnAceptar.disable();
                        }
                        else
                            view.btnAceptar.disable();
                    }
                }
            });

            view.tfDenominacion.on({
                'keyup': function (tf) {
                    // VALIDAR LOS BOTONOS EN CASO DE ADICIONAR
                    if (action == 'add') {
                        if (tf.getValue() != '') {
                            if (scope.validatetfDenominacion()) {
                                view.btnAceptar.enable();
                                view.btnAplicar.enable();
                            }
                        } else {
                            view.btnAceptar.disable();
                            view.btnAplicar.disable();
                        }
                    }

                    //VALIDAR LOS BOTONOS EN CASO DE MODIFICAR
                    if (action == 'mod') {
                        if (tf.getValue() != scope.oldDenominacion)
                            view.btnAceptar.enable();
                        else if (!view.chPlazo.getValue() /*&& model.payMoraStore.getCount() > 0*/) {
                            if (view.tfPlazo.getValue() != scope.oldPlazo || view.cbTiempoPlazo.getValue() != scope.oldTiempoPlazo || scope.noPagoPlazo)
                                view.btnAceptar.enable();
                            else
                                view.btnAceptar.disable();
                        }
                        else if (view.chPlazo.getValue()) {
                            if (!scope.btnAdicionarPlazo.disabled && scope.bool)
                                view.btnAceptar.enable();
                            else
                                view.btnAceptar.disable();
                        }
                        else
                            view.btnAceptar.disable();
                    }
                    //scope.validateWindow();
                }
            });

            view.btnAceptar.on('click', function () {
                scope.AdicionarModificar('add', action);
            });

            view.btnAplicar.on('click', function () {
                scope.AdicionarModificar('apl', action);
            });

            view.btnCancelar.on('click', function () {
                view.window.close();
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
                    view.btnAceptar.disable();
                    view.btnAplicar.disable();
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
                    view.btnAceptar.disable();
                    view.btnAplicar.disable();
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
                    view.btnAceptar.disable();
                    view.btnAplicar.disable();
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
                    view.btnAceptar.disable();
                    view.btnAplicar.disable();
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
                            tooltip: etiquetas.tooltipDelPlazo,
                            iconCls: 'icondistra-eliminar',
                            align: 'center',
                            width: 40
                        }
                    ]
                });

                this.btnAdicionarPlazo = new Ext.Button({
                    id: 'btnAdicionarPlazo',
                    iconCls: 'adicionar',
                    tooltip: etiquetas.tooltipAddPlazo,
                    text: etiquetas.lbbtnAdicionar
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
                            header: etiquetas.titleCondicion,
                            dataIndex: 'nombre',
                            width: 270,
                            sortable: true,
                            align: 'left',
                            editor: this.cbCondicionPagoPlazo
                        }, {
                            id: 'prcentajePlazo',
                            header: etiquetas.titlePorciento,
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
                            view.btnAceptar.enable();
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
                            view.btnAceptar.disable();
                            view.btnAplicar.disable();
                        } else {
                            view.btnAceptar.enable();
                            view.btnAplicar.enable();
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
                                if (!Ext.isEmpty(view.tfDenominacion.getValue())) {
                                    view.btnAceptar.enable();
                                    view.btnAplicar.enable();
                                }
                            }
                        } else {
                            scope.btnAdicionarPlazo.disable();
                            view.btnAceptar.disable();
                            view.btnAplicar.disable();
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
                            tooltip: etiquetas.tooltipDelMora,//this.idioma.lbDelTalonario,
                            iconCls: 'icondistra-eliminar',
                            align: 'center',
                            width: 40
                        }
                    ]
                });
                this.btnAdicionarMora = new Ext.Button({
                    id: 'btnAdicionarMora',
                    iconCls: 'adicionar',
                    tooltip: etiquetas.tooltipAddMora,
                    text: etiquetas.lbbtnAdicionar
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
                            header: etiquetas.titlePorciento,
                            dataIndex: 'prcentaje',
                            width: 250,
                            align: 'left',
                            sortable: true,
                            editor: this.tfPorcientoMora
                        }, {
                            id: 'aplicabledespues',
                            header: etiquetas.titleDespues,
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
                        view.btnAceptar.enable();
                        view.btnAplicar.enable();
                    }


                }, this);
                this.gpMora.on({
                    'afteredit': function (obj) {
                        if (!Ext.isEmpty(obj.record.data.prcentaje) && !Ext.isEmpty(obj.record.data.aplicabledespues)) {
                            scope.btnAdicionarMora.enable();

                            //VALIDAR BOTONES EN CASO DE QUE SE ADICIONE
                            if (action == 'add') {
                                if (scope.validateGridMora()) {
                                    view.btnAceptar.enable();
                                    view.btnAplicar.enable();
                                }
                            }

                            //VALIDAR BOTONES EN CASO DE QUE SE MODIFIQUE
                            if (action == 'mod') {
                                scope.noPagoPlazo = true;
                                view.btnAceptar.enable();
                            }
                        }
                        else {
                            console.log('gpMora - afteredit')
                            scope.btnAdicionarMora.disable();
                            view.btnAceptar.disable();
                            view.btnAplicar.disable();
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
                                tooltip: etiquetas.tooltipDelDV,//this.idioma.lbDelTalonario,
                                iconCls: 'icondistra-eliminar',
                                align: 'center',
                                width: 40
                            }
                        ]
                    });
                    this.btnAdicionarDescVenta = new Ext.Button({
                        id: 'btnAdicionarPlazo',
                        iconCls: 'adicionar',
                        tooltip: etiquetas.tooltipAddDV,
                        text: etiquetas.lbbtnAdicionar
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
                                header: etiquetas.titlePorciento,
                                dataIndex: 'porciento',
                                width: 150,
                                sortable: true,
                                align: 'left',
                                editor: this.tfPorcientoDescVenta
                            }, {
                                header: etiquetas.titleCantMin,
                                dataIndex: 'cantMinima',
                                width: 150,
                                align: 'left',
                                sortable: true,
                                editor: this.tfCantMinimaDescVenta
                            }, {
                                id: 'cantMaxima',
                                header: etiquetas.titleCantMax,
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
                                        view.btnAceptar.enable();
                                        view.btnAplicar.enable();
                                    }
                                }

                                //VALIDAR BOTONES EN CASO DE QUE SE MODIFIQUE
                                if (action == 'mod') {
                                    scope.noPagoPlazo = true;
                                    view.btnAceptar.enable();
                                }
                            } else {
                                console.log('gpDescVenta - afteredit')
                                scope.btnAdicionarDescVenta.disable();
                                view.btnAceptar.disable();
                                view.btnAplicar.disable();
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
                                tooltip: etiquetas.tooltipDelDPP,//this.idioma.lbDelTalonario,
                                iconCls: 'icondistra-eliminar',
                                align: 'center',
                                width: 40
                            }
                        ]
                    });
                    this.btnAdicionarDPP = new Ext.Button({
                        id: 'btnAdicionarPlazo',
                        iconCls: 'adicionar',
                        tooltip: etiquetas.tooltipAddDPP,
                        text: etiquetas.lbbtnAdicionar
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
                                header: etiquetas.titlePorciento,
                                dataIndex: 'porciento',
                                width: 200,
                                sortable: true,
                                align: 'left',
                                editor: this.tfPorcientoDPP
                            }, {
                                id: 'antesde',
                                header: etiquetas.titleAntes,
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
                                        view.btnAceptar.enable();
                                        view.btnAplicar.enable();
                                    }
                                }

                                //VALIDAR BOTONES EN CASO DE QUE SE MODIFIQUE
                                if (action == 'mod') {
                                    scope.noPagoPlazo = true;
                                    view.btnAceptar.enable();
                                }
                            }
                            else {
                                console.log('gpDPP - afteredit');
                                scope.btnAdicionarDPP.disable();
                                view.btnAceptar.disable();
                                view.btnAplicar.disable();
                            }
                        }
                    });

                    return this.gpDPP;
            }
        }

        this.AdicionarModificar = function (addapl, action) {
            Ext.Msg.wait(etiquetas.msgWaitSave, etiquetas.msgWait);
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
                    denominacion: view.tfDenominacion.getValue(),
                    plazoCuotas: Ext.encode(arrPlazo),
                    plazo: view.tfPlazo.getValue(),
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

                    var message = (action == 'mod') ? etiquetas.msgModifySuccess : etiquetas.msgAddSuccess;
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.codM == 1) {
                        if (addapl == 'apl') {
                            scope.limpiar();
                            view.first.focus();
                            view.btnAceptar.disable();
                            view.btnAplicar.disable();
                        } else {
                            view.window.destroy();
                        }
                        model.payMoraStore.removeAll();
                        model.payDescVentaStore.removeAll();
                        model.payDPPStore.removeAll();
                        model.payCuotasStore.removeAll();
                        scope.MostrarMascara('Cargando...');
                        model.payConditionStore.load({
                            callback: function () {
                                loadMask.hide();
                            }
                        });
                        mostrarMensaje(1, message);
                    } else {
                        mostrarMensaje(3, 'No se pudo adicionar el t&eacute;rmino de pago.');
                    }
                }
            });
        }

        this.DeletePayCondition = function (selecteds) {
            var message = (selecteds.length > 1) ? etiquetas.msgDelSuccessPlural : etiquetas.msgDelSuccess,
                msguse = (selecteds.length > 1) ? etiquetas.msgInUsePlural : etiquetas.msgInUse,
                msgfail = (selecteds.length > 1) ? etiquetas.msgDefaultDelFailedPlural : etiquetas.msgDefaultDelFailed,
                arrayData = [];
            for (var i = 0; i < selecteds.length; i++) {
                arrayData.push(selecteds[i].data);
            }

            Ext.Msg.wait(etiquetas.msgDel, etiquetas.msgWait);
            Ext.Ajax.request({
                url: 'deletePayCondition',
                method: 'POST',
                params: {
                    condiciones: Ext.encode(arrayData)
                },
                callback: function (options, success, response) {
                    //loadMask.hide();
                    if (!response.responseText) {
                        scope.disabledKeyMap = false;
                        mostrarMensaje(3, etiquetas.msgDefaultError);
                    } else {
                        var responseData = Ext.decode(response.responseText);
                        if (responseData.codM == 1) {
                            scope.MostrarMascara(etiquetas.msgLoading);
                            mostrarMensaje(1, message);
                        } else if (responseData.codM == 23503) {
                            mostrarMensaje(1, msguse);
                        } else {
                            mostrarMensaje(3, msgfail);
                        }
                        Ext.Msg.hide();
                        model.payConditionStore.load();
                    }
                }
            });
        };

        this.ActivePayCondition = function (selected) {
            Ext.Msg.wait(etiquetas.msgWaitSetDefault, etiquetas.msgWait);
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
                        scope.disabledKeyMap = false;
                        mostrarMensaje(3, etiquetas.msgDefaultError);
                    } else {
                        var responseData = Ext.decode(response.responseText);
                        scope.MostrarMascara(etiquetas.msgLoading);
                        model.payConditionStore.load({
                            callback: function () {
                                loadMask.hide();
                            }
                        });
                        mostrarMensaje(1, etiquetas.msgActiveSuccess.replace("<#>", responseData.success[0].denominacion));
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
                }
            });
        }

        view.paginToolbar.on({
            beforechange: function () {
                Ext.getBody().mask(etiquetas.msgLoading);
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
                        view.btnModificar.enable();
                    if (!smodel.getSelections()[0].data.usado)
                        view.btnEliminar.enable();
                    if (smodel.getSelections()[0].data.predeterminado == 0)
                        view.btnActivar.enable();
                    if (smodel.getSelections()[0].data.enuso == false)
                        view.btnUsar.enable();
                    if (smodel.getSelections()[0].data.enuso == true)
                        view.btnNoUsar.enable();        
                } else {
                    if (smodel.getSelections().length > 1) {
                        view.btnModificar.disable();
                        view.btnActivar.disable();
                        if (scope.enUso(smodel.getSelections()))
                            view.btnEliminar.disable();
                        else
                            view.btnEliminar.enable();
                        view.btnUsar.setDisabled(!scope.enUsoEntidad(smodel.getSelections(), false));
                        view.btnNoUsar.setDisabled(!scope.enUsoEntidad(smodel.getSelections(), true));
                    }
                }
                view.grid.getView().addRowClass(rowIndex, "negrita");
            },
            rowdeselect: function (smodel, rowIndex, record) {
                if (smodel.hasSelection()) {
                    if (smodel.getSelections().length == 1) {
                        if (smodel.getSelections()[0].data.usado)
                            view.btnModificar.disable();
                        view.btnModificar.enable();
                        if (!smodel.getSelections()[0].data.usado)
                            view.btnEliminar.enable();
                        if (smodel.getSelections()[0].data.predeterminado == 0)
                            view.btnActivar.enable();
                        if (smodel.getSelections()[0].data.enuso == false)
                            view.btnUsar.enable();
                        if (smodel.getSelections()[0].data.enuso == true)
                            view.btnNoUsar.enable();  
                    } else {
                        if (smodel.getSelections().length > 1) {
                            view.btnModificar.disable();
                            view.btnActivar.disable();
                        if (scope.enUso(smodel.getSelections()))
                            view.btnEliminar.disable();
                        else
                            view.btnEliminar.enable();
                        view.btnUsar.setDisabled(!scope.enUsoEntidad(smodel.getSelections(), false));
                        view.btnNoUsar.setDisabled(!scope.enUsoEntidad(smodel.getSelections(), true));    
                        }
                    }
                }
                else {
                    view.btnModificar.disable();
                    view.btnEliminar.disable();
                    view.btnActivar.disable();
                    view.btnUsar.disable();
                    view.btnNoUsar.disable();
                }
                view.grid.getView().removeRowClass(rowIndex, "negrita");
            }
        });

        /****************************FUNCIONES AUXILIARES**********************************/

        this.validatetfDenominacion = function () {
            var bool = false;
            if ((!Ext.isEmpty(view.tfPlazo.getValue()) && !Ext.isEmpty(view.cbTiempoPlazo.getValue()) /*&& model.payMoraStore.getCount() > 0*/ && !scope.btnAdicionarMora.disabled) ||
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
        };

        this.validatetfPlazo = function () {
            var bool = false;
            if ((!Ext.isEmpty(view.tfDenominacion.getValue()) && !Ext.isEmpty(view.cbTiempoPlazo.getValue()) /*&& model.payMoraStore.getCount() > 0*/ && !scope.btnAdicionarMora.disabled)) {
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
        };

        this.validatecbTiempoPlazo = function () {
            var bool = false;
            if ((!Ext.isEmpty(view.tfDenominacion.getValue()) && !Ext.isEmpty(view.tfPlazo.getValue()) /*&& model.payMoraStore.getCount() > 0*/ && !scope.btnAdicionarMora.disabled)) {
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
        };

        this.validateGridMora = function () {
            var bool = false;
            if (!Ext.isEmpty(view.tfDenominacion.getValue()) && !Ext.isEmpty(view.cbTiempoPlazo.getValue()) && !Ext.isEmpty(view.cbTiempoPlazo.getValue())) {
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
        };

        this.validateGridDescVenta = function () {
            var bool = false;
            if (!Ext.isEmpty(view.tfDenominacion.getValue()) && !Ext.isEmpty(view.cbTiempoPlazo.getValue()) && !Ext.isEmpty(view.cbTiempoPlazo.getValue()) /*&&
                model.payMoraStore.getCount() > 0*/ && !scope.btnAdicionarMora.disabled) {
                bool = true;
                if (view.chDescuentoPago.getValue()) {
                    if (model.payDPPStore.getCount() > 0 && !scope.btnAdicionarDPP.disabled)
                        bool = true;
                    else
                        return false;
                }
            }
            return bool;
        };

        this.validateGridDPP = function () {
            var bool = false;
            if (!Ext.isEmpty(view.tfDenominacion.getValue()) && !Ext.isEmpty(view.cbTiempoPlazo.getValue()) && !Ext.isEmpty(view.cbTiempoPlazo.getValue()) /*&&
                model.payMoraStore.getCount() > 0*/ && !scope.btnAdicionarMora.disabled) {
                bool = true;
                if (view.chDescuentoVentas.getValue()) {
                    if (model.payDescVentaStore.getCount() > 0 && !scope.btnAdicionarDescVenta.disabled)
                        bool = true;
                    else
                        return false;
                }
            }
            return bool;
        };

        this.validateWindow = function () {
            var form = view.panelGest.getForm();
            if (form.isValid()) {
                view.btnAplicar.enable();
                view.btnAceptar.enable();
            } else {
                console.log('validateWindow');
                view.btnAplicar.disable();
                view.btnAceptar.disable();
            }
        };

        //VALIDAR BOTONES EN CASO DE QUE SE MODIFIQUE
        this.modificoGridPlazo = function (objeto, id) {
            if ((objeto.field == "nombre" && id != objeto.value) || (objeto.field == "prcentajePlazo" && objeto.originalValue != objeto.value))
                return true;
            return false;
        };

        this.limpiar = function () {
            view.tfDenominacion.reset();
            view.tfPlazo.reset();
            view.cbTiempoPlazo.reset();
            view.chPlazo.setValue(false);
            view.chDescuentoVentas.setValue(false);
            view.chDescuentoPago.setValue(false);
            model.payMoraStore.removeAll();
        };

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
        };

        this.enUsoEntidad = function (selects, enuso) {
            var bool = true;
            for (var i = 0; i < selects.length; i++) {
                if (selects[i].data.enuso!=enuso) {
                    bool = false;
                }
            }
            return bool;
        };

        this.EventosAyuda = function () {
            var title = etiquetas.tooltipAyuda;
            var referencia = 'copa/config/condiciones_generales';
            help.show(title, referencia);
        };
    }
}
;