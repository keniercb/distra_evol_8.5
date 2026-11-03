Ext.ns('Costo.Procesos.Nomencladores');
Costo.Procesos.Nomencladores.Controller = {
    init: function (perfil, view, model, etiquetas) {
        var scope = this;

        // esto le coloca el fondo verde a la cuenta definida para saldo de inicio
        view.gridSubCuentas.getView().getRowClass = function (record, index, rowParams, store) {
            if (record.json.saldoinicioanno) {
                return 'green';
            }
        }
        // EVENTOS RELACIONADOS CON LOS STORES
        model.storeSubCuentas.on({
            beforeload: function (store, options) {
                nodeSelected = Ext.getCmp('cpmCuentasProcesos').fGetSelections();
                if (nodeSelected.id != 0) {
                    this.baseParams.ordenizq = nodeSelected.attributes.ordenizq;
                    this.baseParams.ordender = nodeSelected.attributes.ordender;
                    this.baseParams.idestructurae = nodeSelected.attributes.idestructurae;
                } else {
                    // si se retorna false en este evento la accion load sera cancelada
                    return false;
                }
            },
            load: function (store, records, options) {
                this.baseParams = {};
                if (records.length == 0)
                    mostrarMensaje(1, etiquetas.MsgInformacionSinResultado);
            }
        });

        view.mySelectionModel.on({
            rowselect: function (selModel, rowIndex, record) {
                view.gridSubCuentas.getView().addRowClass(rowIndex, "negrita");
            },
            rowdeselect: function (selModel, rowIndex, record) {
                view.gridSubCuentas.getView().removeRowClass(rowIndex, "negrita");
            }
        });
        //teclas calientes
        // /********* EVENTOS *********/
        view.keys = new Ext.KeyMap(document, [{
            // ADICIONAR
            key: 'i',
            alt: true,
            fn: function () {
                view.gridSubCuentas.enable();
                view.createWindows(perfil, etiquetas);
                view.ventanaCuentas.show();
                eventosComponentCuentas();
                EventosCancelarAdicionar();
                EventosAceptarAdicionar();
            }
        }, {
            // ELIMINAR
            key: Ext.EventObject.DELETE,
            fn: function () {
                if (!Ext.getCmp('cpmCuentasProcesos').fGetSelections()) {
                    mostrarMensaje(1, etiquetas.msgNotCountsSelected, function () {
                    });
                } else
                    EventosEliminar();
            }
        }, {
            // Ayuda
            key: 'h',
            alt: true,
            fn: function () {
            }
        }
        ]);

        // Evento para adiconar cuentas
        view.btnAdicionar.on('click', function () {
            view.gridSubCuentas.enable();
            view.createWindows(perfil, etiquetas);
            view.ventanaCuentas.show();
            eventosComponentCuentas();
            EventosCancelarAdicionar();
            EventosAceptarAdicionar();
        });

        function eventosComponentCuentas() {
            Ext.getCmp('cpmCuentas').on({
                initialize: function (componentUI) {
                    componentUI.on({
                        checkchange: function (node, checked) {
                            if (checked) {
                                view.btnAceptarAddCuentas.enable();
                            } else {
                                var selections = Ext.getCmp('cpmCuentas').fGetSelections();
                                if (selections.length == 0)
                                    view.btnAceptarAddCuentas.disable();
                            }
                        },
                        click: function (node) {
                            if (node.id != 0) {
                                node.getUI().toggleCheck(true);
                            }
                        },
                        dblclick: function (node) {
                            if (node.id != 0) {
                                node.getUI().toggleCheck(true);
                            }
                        }
                    });
                }
            });
        }

        function EventosCancelarAdicionar() {
            view.btnCancelarAddCuentas.on('click', function () {
                view.ventanaCuentas.close();
                //view.gridSubCuentas.disable();
            });
        }

        function EventosAceptarAdicionar() {
            view.btnAceptarAddCuentas.on('click', function () {
                var cuentas = [];
                var selections = Ext.getCmp('cpmCuentas').fGetSelections();
                for (var i = 0; i < selections.length; i++) {
                    cuentas.push({
                        id: selections[i].attributes.idcuenta,
                        text: selections[i].attributes.text
                    });
                }
                (cuentas.length > 1) ? scope.MostrarMascara(etiquetas.msgPluralAddCount, scope)
                    : scope.MostrarMascara(etiquetas.msgSingleAddCount, scope);
                Ext.Ajax.request({
                    method: "POST",
                    url: "addCuenta",
                    params: {
                        cuentas: Ext.encode(cuentas)
                    },
                    callback: function (options, success, response) {
                        if (!response.responseText) {
                            mostrarMensaje(1, etiquetas.msgDefaultError);
                        } else {
                            var responseData = Ext.decode(response.responseText);
                            switch (responseData.code) {
                                case 1:
                                    var mensaje = selections.length > 1 ? etiquetas.msgPluralAddSuccess : etiquetas.msgSingleAddSuccess;
                                    view.ventanaCuentas.close();
                                    scope.loadMask.hide();
                                   /* scope.MsgPersonalizado({
                                        title: etiquetas.titleInfo,
                                        buttons: Ext.Msg.OK,
                                        msg: mensaje,
                                        icon: Ext.Msg.INFO,
                                        fn: function () {
                                            view.btnEliminar.disable();
                                            Ext.getCmp('cpmCuentasProcesos').reload();
                                            scope.resetGridSubcuentas();
                                        }
                                    });*/
                                    mostrarMensaje(1,mensaje);
                                    break;
                                case 2:
                                    var message = (responseData.errors.length > 1) ? etiquetas.msgPluralAddFailedBD :
                                        (responseData.errors.length == 1 ? etiquetas.msgSingleAddFailedBD : etiquetas.msgDefaultAsocFailed)
                                    if (responseData.errors.length >= 1) {
                                        var msgcuentas = " " + "<i>" + responseData.errors[0].cuenta + "</i>"
                                        if (responseData.errors.length > 1) {
                                            for (i = 0; i < responseData.errors.length; i++)
                                                msgcuentas += " ,<i>" + responseData.errors[i].cuenta + "</i>"
                                        }
                                        message = message.replace('/cuentas/', msgcuentas);
                                    }
                                    // si no todas las asociaciones fueron registradas
                                    view.ventanaCuentas.close();
                                    view.btnEliminar.disable();
                                    scope.loadMask.hide();
                                    if (responseData.errors.length < cuentas.length) {
                                        var messageParcial = (cuentas.length > 1) ? etiquetas.msgPluralParcialAddCuentas : etiquetas.msgPluralParcialAddCuentas;
                                       scope.MsgPersonalizado({
                                            title: etiquetas.titleInfo,
                                            buttons: Ext.Msg.OK,
                                            msg: messageParcial,
                                            icon: Ext.Msg.INFO,
                                            fn: function () {
                                                Ext.getCmp('cpmCuentasProcesos').reload();
                                                mostrarMensaje(1,message);
                                                /*scope.MsgPersonalizado({
                                                    title: etiquetas.titleInfo,
                                                    buttons: Ext.Msg.OK,
                                                    msg: message,
                                                    icon: Ext.Msg.INFO,
                                                    fn: function () {
                                                    }
                                                });*/
                                            }
                                        });
                                    } else {
                                       /* scope.MsgPersonalizado({
                                            title: etiquetas.titleInfo,
                                            buttons: Ext.Msg.OK,
                                            msg: message,
                                            icon: Ext.Msg.INFO,
                                            fn: function () {
                                            }
                                        });*/
                                        mostrarMensaje(1,message);
                                    }
                                    break;
                                case 4:
                                    var message = (responseData.errors.length > 1) ? etiquetas.msgPluralAddFailed :
                                        (responseData.errors.length == 1 ? etiquetas.msgSingleAddFailed : etiquetas.msgDefaultAsocFailed)
                                    if (responseData.errors.length >= 1) {
                                        var msgcuentas = " " + "<i>" + responseData.errors[0].cuenta + "</i>"
                                        if (responseData.errors.length > 1) {
                                            for (i = 0; i < responseData.errors.length; i++)
                                                msgcuentas += " ,<i>" + responseData.errors[i].cuenta + "</i>"
                                        }
                                        message = message.replace('/cuentas/', msgcuentas);
                                    }
                                    // si no todas las asociaciones fueron registradas
                                    view.ventanaCuentas.close();
                                    view.btnEliminar.disable();
                                    scope.loadMask.hide();
                                    if (responseData.errors.length < cuentas.length) {
                                        var messageParcial = (cuentas.length > 1) ? etiquetas.msgPluralParcialAddCuentas : etiquetas.msgPluralParcialAddCuentas;
                                       scope.MsgPersonalizado({
                                            title: etiquetas.titleInfo,
                                            buttons: Ext.Msg.OK,
                                            msg: messageParcial,
                                            icon: Ext.Msg.INFO,
                                            fn: function () {
                                                Ext.getCmp('cpmCuentasProcesos').reload();
                                               /* scope.MsgPersonalizado({
                                                    title: etiquetas.titleInfo,
                                                    buttons: Ext.Msg.OK,
                                                    msg: message,
                                                    icon: Ext.Msg.INFO,
                                                    fn: function () {
                                                    }
                                                });*/
                                                mostrarMensaje(1,message);
                                            }
                                        });
                                    } else {
                                       /* scope.MsgPersonalizado({
                                            title: etiquetas.titleInfo,
                                            buttons: Ext.Msg.OK,
                                            msg: message,
                                            icon: Ext.Msg.INFO,
                                            fn: function () {
                                            }
                                        });*/
                                        mostrarMensaje(1,message);
                                    }
                                    break;
                                case 3:
                                    mostrarMensaje(1, etiquetas.msgNotCountsSelected);
                                    break;
                                default:
                                    mostrarMensaje(1, etiquetas.msgDefaultError);
                                    break;
                            }
                        }
                    }
                });

            });
        }

        // Evento para eliminar una cuenta
        view.btnEliminar.on('click', function () {
            EventosEliminar();
        });
        function EventosEliminar() {
            mostrarMensaje(2, etiquetas.msgConfirm, function (btnPress) {
                if (btnPress === 'ok') {
                    scope.MostrarMascara(etiquetas.msgDelCount, scope);
                    var nodeSelected = Ext.getCmp('cpmCuentasProcesos').fGetSelections();
                    Ext.Ajax.request({
                        method: "POST",
                        url: "delCuenta",
                        params: {
                            id: nodeSelected.id
                        },
                        callback: function (options, success, response) {
                            if (!response.responseText) {
                                mostrarMensaje(1, etiquetas.msgDefaultError);
                            } else {
                                var responseData = Ext.decode(response.responseText);
                                switch (responseData.code) {
                                    case 1:
                                        scope.loadMask.hide();
                                        view.btnEliminar.disable();
                                        model.storeSubCuentas.removeAll();
                                       /* scope.MsgPersonalizado({
                                            title: etiquetas.titleInfo,
                                            buttons: Ext.Msg.OK,
                                            msg: etiquetas.msgDelSuccess,
                                            icon: Ext.Msg.INFO,
                                            fn: function () {
                                                Ext.getCmp('cpmCuentasProcesos').reload();
                                                scope.resetGridSubcuentas();
                                            }
                                        });*/
                                        mostrarMensaje(1,etiquetas.msgDelSuccess);
                                        break;
                                    case 2:
                                        mostrarMensaje(1, etiquetas.msgDelNotSuccess);
                                        break;
                                    default:
                                        mostrarMensaje(1, etiquetas.msgDefaultError);
                                        break;
                                }
                            }
                        }
                    });
                }
            });
        }

        // Evento que activa el btn de saldo si existe una subcuenta seleccionada
        view.mySelectionModel.on('rowselect', function (selectionModel, rowIndex, record) {
            view.btnPersistir.setDisabled(record.json.saldoinicioanno);
            view.gridSubCuentas.getView().addRowClass(rowIndex, "negrita");
        });

        view.btnPersistir.on('click', function () {
            scope.persistirSaldo();
        });

        view.gridSubCuentas.on('rowcontextmenu', function (grid, rowIndex, eventObject) {
            eventObject.stopEvent();
            var record = model.storeSubCuentas.getAt(rowIndex);
            if (!record.json.saldoinicioanno) {
                grid.getSelectionModel().selectRow(rowIndex);
                view.menuContextual.showAt(eventObject.getXY());
            }
        });

        view.menuItemPersistir.on('click', function () {
            scope.persistirSaldo();
        });

        this.persistirSaldo = function () {
            var aux = Ext.getCmp('cpmCuentasProcesos').fGetSelections().attributes;
            var text = view.gridSubCuentas.getSelectionModel().getSelected().data.concatcta;
            if (!isNaN(parseInt(aux.idcuentaparasaldoinicio))) {
                mostrarMensaje(2, etiquetas.msgConfirmacion.replace('<subcuenta>', text), function (btnPress) {
                    if (btnPress === 'ok') {
                        scope.DefinirComoSaldoInicio(aux);
                    }
                });
            } else
                scope.DefinirComoSaldoInicio(aux);
        };

        this.DefinirComoSaldoInicio = function (nodo) {
            scope.MostrarMascara(etiquetas.loading, scope);
            var subCtaSelected = view.gridSubCuentas.getSelectionModel().getSelected();
            if (subCtaSelected) {
                Ext.Ajax.request({
                    method: "POST",
                    url: "definirCuentaSaldoInicio",
                    params: {
                        idcuenta: view.nodeSelected.id,
                        idsubcuenta: Ext.encode(subCtaSelected.json)
                    },
                    callback: function (options, success, response) {
                        if (!response.responseText) {
                            mostrarMensaje(1, etiquetas.msgDefaultError);
                        } else {
                            var responseData = Ext.decode(response.responseText);
                            switch (responseData.code) {
                                case 1:
                                    scope.loadMask.hide();
                                    model.storeSubCuentas.reload({
                                        callback: function () {
                                            nodo.idcuentaparasaldoinicio = 0;
                                        }
                                    });
                                    mostrarMensaje(1, etiquetas.msgOkSaldoInicio.replace('<subcuenta>', responseData.cuenta));
                                    break;
                                case 2:
                                    mostrarMensaje(1, etiquetas.msgFailedSaldoInicio.replace('<subcuenta>', responseData.cuenta));
                                    break;
                                default:
                                    mostrarMensaje(1, etiquetas.msgDefaultError);
                                    break;
                            }
                        }
                    }
                });
            }
        };
        this.resetGridSubcuentas = function () {
            model.storeSubCuentas.removeAll();
            //view.gridSubCuentas.disable();
        };

        this.MostrarMascara = function (mensaje, scope) {
            scope.loadMask = new Ext.LoadMask(Ext.getBody(), {
                msg: mensaje
            });
            scope.loadMask.show();
        };
        /**
         * Funcion que muestra un mensaje personalizado
         */
        this.MsgPersonalizado = function (options) {
            Ext.Msg.show({
                title: options.title,
                buttons: options.buttons,
                msg: options.msg,
                icon: options.icon,
                fn: options.fn
            });
        };

        this.loadMessageBox = function (msg) {
            Ext.MessageBox.show({
                title: etiquetas.lbMsgEspere,
                msg: msg,
                width: 300,
                progress: true,
                closable: false
            });
            var f = function (v) {
                return function () {
                    var i = v / 11;
                    Ext.MessageBox.updateProgress(i);
                };
            };
            for (var i = 1; i < 12; i++)
                setTimeout(f(i), i * 500);
        };
    }
};