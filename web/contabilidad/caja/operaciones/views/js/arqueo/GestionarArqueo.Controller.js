/**
 * GestionarArqueo.Controller
 *
 * @author Ing. Roberto Linares Zamora
 * @version 1.0
 */
Ext.ns('Caja.Operaciones.Arqueo');
Caja.Operaciones.Arqueo.Controller = {
    idfuncionalidad: window.parent.idFuncionalidad,
    init: function (perfil, etiquetas, view, model, cargainicial) {
        var scope = this;
        this.totalArqueo = 0;
        this.totalBilletes = 0;
        this.totalSellos = 0;
        this.totalMonedas = 0;
        this.totalCheque = 0;
        // this.totalEfectivo = 0;
        this.arrayEliminarDesglose = [];
        this.arrayEliminarDesgloseSello = [];
        this.arrayEliminarInstArq = [];
        this.saldoFondo = 0;
        scope.accion = 'add';

        view.btnAdicionar.on('click', function () {
            if (model.stArqueos.getCount()) {
                if (model.stArqueos.getAt(0).data.idestado == 8 && !cargainicial) {
                    mostrarMensaje(1, etiquetas.lbConfirmArq);
                    return;
                }
                if (model.stArqueos.getAt(0).data.idestado == 5 && (model.stArqueos.getAt(0).data.diferenciasobrante - model.stArqueos.getAt(0).data.diferenciafaltante != 0) && !cargainicial) {
                    mostrarMensaje(1, etiquetas.lbPostearArq);
                    return;
                }
            }
            view.smArqueos.clearSelections();
            view.windowAddModArqueo(etiquetas, model, scope);
            view.winAddArqueo.show();
            view.dffecha.focus(true, true);
            view.winAddArqueo.setTitle('Adicionar arqueo');
            scope.loadDataAddArqueo();
        });
        view.btnModificar.on('click', function () {
            this.totalBilletes = 0;
            this.totalSellos = 0;
            this.totalMonedas = 0;
            this.totalArqueo = this.totalCheque;
            scope.accion = 'mod';
            view.windowAddModArqueo(etiquetas, model, scope);
            view.winAddArqueo.show();
            view.winAddArqueo.setTitle('Modificar arqueo');
            scope.loadDataAddArqueo(view.smArqueos.getSelected().data.idarqueo);
        }.bind(this));

        view.btnVer.on('click', function () {
            this.totalBilletes = 0;
            this.totalSellos = 0;
            this.totalMonedas = 0;
            this.totalArqueo = this.totalCheque;
            scope.accion = 'ver';
            view.windowAddModArqueo(etiquetas, model, scope);
            view.winAddArqueo.show();
            view.winAddArqueo.setTitle('Ver arqueo');
            scope.loadDataAddArqueo(view.smArqueos.getSelected().data.idarqueo);
        }.bind(this));

        view.btnCancelarDoc.on('click', function () {
            scope.ClickCancelArqueo();
        });

        view.btnEliminarDoc.on('click', function () {
            scope.ClickEliminarArqueo();
        });

        // view.winAddArqueo.on({
        //     scope: this,
        //     hide: function () {
        //         scope.keyMap.enable();
        //     },
        //     show: function () {
        //         scope.keyMap.disable();
        //     }
        // });

        view.btnFondo.on('click', function () {

            if (scope.idfondo != undefined) {
                lMask = new Ext.LoadMask(Ext.getBody(), {
                    msg: etiquetas.lbCargando
                });
                lMask.show();
            }

            var tipoMov = Array(1, 2, 3, 4, 5, 7);

            var objCajaFondo = new Caja.CajaFondo.WindowCajaFondo({
                showWinMod: (view.tfFondo.getValue()) ? true : false,
                showCbMov: false,
                tipoMov: tipoMov
            });

            objCajaFondo.on({
                scope: this,
                loadData: function () {
                    model.stArqueos.removeAll();
                    scope.idfondo = objCajaFondo.idFondo;
                    scope.idcaja = objCajaFondo.idCaja;
                    scope.idCbCaja = objCajaFondo.idCaja;
                    scope.valueCbCaja = objCajaFondo.nomCaja;
                    scope.valueCbFondo = objCajaFondo.nomFondo;
                    scope.idCbFondo = objCajaFondo.idFondo;
                    scope.tipoFondo = objCajaFondo.tipoFondo;
                    scope.idCajaFondo = objCajaFondo.idCajaFondo;
                    scope.idMonedaEntidad = objCajaFondo.idMonedaEntidad;
                    scope.saldoAprobado = objCajaFondo.saldoAprobado;
                    scope.saldoActual = objCajaFondo.saldoActual;
                    scope.tipoMovimiento = objCajaFondo.tipoMovimiento;//1-Salida 2-Entrada
                    scope.idFormaPago = objCajaFondo.idFormaPago;

                    view.tfFondo.setValue(objCajaFondo.nomFondo);
                    model.stArqueos.baseParams.idcajafondo = scope.idCajaFondo;
                    view.gridArqueos.getBottomToolbar().changePage(0);
                    //model.stArqueos.load();
                    Ext.MessageBox.hide();
                    view.btnAdicionar.focus(true, true);
                },
                show: function () {
                    if (scope.idfondo != undefined)
                        lMask.hide();
                }
            });

            objCajaFondo.btnCancelar.on('click', function () {
                if (scope.idfondo == undefined) {
                    window.parent.Ext.getCmp('win' + scope.idfuncionalidad).close();
                } else
                    objCajaFondo.close();
            });

        });

        view.btnFondo.fireEvent('click');

        this.ClickAddArqueo = function () {
            scope.WindowsFactory('add');
        };
        this.ClickModArqueo = function () {
            scope.WindowsFactory('mod');
        };

        this.ClickEliminarArqueo = function () {
            scope.keyMap.disable();
            mostrarMensaje(2, etiquetas.lbConfirmElim, function (btnPress) {
                if (btnPress === 'ok') {
                    scope.eliminarArqueo();
                }
                if (btnPress === 'cancel') {
                    scope.keyMap.enable();
                }
            });
        };

        this.ClickCancelArqueo = function () {
            scope.keyMap.disable();
            mostrarMensaje(2, etiquetas.lbConfirmCanc, function (btnPress) {
                if (btnPress === 'ok') {
                    view.windowCacelar(etiquetas, model, view.smArqueos.getSelected().data.fecha);
                    view.winCancelar.on({
                        beforeshow: function () {
                            //scope.disabledKeyMap = true;
                            scope.cancelarEvents();
                        },
                        hide: function (windows) {
                            scope.keyMap.enable();
                            view.btnAdicionar.focus();
                        }
                    });
                    view.winCancelar.show();
                }
                if (btnPress === 'cancel') {
                    scope.keyMap.enable();
                }
            });
        };

        this.WindowsFactory = function (action) {
            view.Window(etiquetas, action);
            view.winTalonario.on({
                beforeshow: function () {
                    //scope.disabledKeyMap = true;
                    scope.loadDataAddArqueo();
                    scope.arqueoEvents(action);
                },
                destroy: function (windows) {
                    //scope.disabledKeyMap = false;
                    view.btnAdicionar.focus();
                }
            });
            view.winTalonario.show();
//            view.winTalonario.maximize();
            view.winTalonario.doLayout();
        };

        this.arqueoEvents = function (action) {
            view.btnCancelar.on({
                click: function () {
                    view.winTalonario.destroy();
                    view.btnAdicionar.focus();
                }
            });

        };

        this.cancelarEvents = function () {
            view.btnCancelarCancel.on({
                click: function () {
                    view.winCancelar.destroy();
                    view.btnAdicionar.focus();
                }
            });
            view.btnAceptarCancel.on({
                click: function () {
                    if (view.pcancelacion.getForm().isValid())
                        if (view.smArqueos.getSelected().data.idestado == 6) {
                            var diferencia = '';
                            if (view.smArqueos.getSelected().data.diferenciasobrante > view.smArqueos.getSelected().data.diferenciafaltante)
                                diferencia = 'sobrante';
                            else diferencia = 'faltante';
                            param = {
                                tipoContabilizacion: 2, //1 contabilizar doc confirmado | 2 revertir comprobnate contabilizado
                                actionContabiliza: 'cancelar',
                                descripcion: 'Cancelando ' + diferencia + ' del arqueo: ',
                                fecha: view.dffechac.getRawValue()
                            }
                            scope.fLoadDataComprobante(param);
                        } else
                            scope.cancelarArqueo();
                }
            });
        }

        this.operacionEvents = function () {
            view.btnCancelar.on({
                click: function () {
                    view.winInstrumentos.destroy();
                    view.tfnombreentidad.focus(true, 10);
                }
            });
        }

        this.loadDataAddArqueo = function (idArqueo, isClear = false) {
            view.lMask.show();
            view.dffecha.reset();
            view.ckCierre.reset();

            Ext.Ajax.request({
                url: 'loadDataAddArqueo',
                method: 'POST',
                params: {
                    idMonedaEntidad: scope.idMonedaEntidad,
                    idCajaFondo: scope.idCajaFondo,
                    idArqueo: idArqueo,
                    tipoFondo: scope.tipoFondo,
                    idFormaPago: scope.idFormaPago
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    this.totalArqueo = 0;
                    this.totalCheque = 0;
                    this.totalBilletes = 0;
                    this.totalSellos = 0;
                    this.totalMonedas = 0;
                    this.arrayEliminarInstArq = [];
                    view.nfcantidadbilletes.startValue = 0;
                    view.nfcantidadSellos.startValue = 0;
                    view.nfcantidadmonedas.startValue = 0;
                    if (scope.idFormaPago == 3) {
                        model.stSellos.loadData(responseData.sellos);
                    } else {
                        model.stBilletes.loadData(responseData.billetes);
                        model.stMonedas.loadData(responseData.monedas);
                        model.stInstrumentos.loadData(responseData.instrumentos);
                    }
                    this.saldoFondo = scope.tipoMovimiento == 1 ? scope.saldoAprobado : responseData.saldoFondo; /*scope.saldoActual*/ //1-Salida
                    if (idArqueo) {//Si esta modificando
                        view.dffecha.setRawValue(view.smArqueos.getSelected().data.fecha);
                        //view.tfnumero.setValue(view.smArqueos.getSelected().data.numero);
                        view.ckCierre.setValue(view.smArqueos.getSelected().data.idcierre);
                        view.tacomentarioD.setValue(view.smArqueos.getSelected().data.comentario);
                        var difArqueo = view.smArqueos.getSelected().data.importemo - parseFloat(this.saldoFondo);
                        view.tfdiferenciaD.setValue(formatoMoneda(difArqueo));
                        //view.nfImporteCheques.setValue(view.smArqueos.getSelected().data.importecheques);
                        //view.nfImporteCheques.setRawValue(parseFloat(view.smArqueos.getSelected().data.importecheques).toFixed(2));

                        if (scope.accion == 'ver') {
                            view.pDatosDocumentos.cascade(function () {
                                this.disabledClass = 'disabled-component';
                            });

                            view.pDatosDocumentos.disable();
                            view.gpSellos.disable();
                            view.gpBilletes.disable();
                            view.gpMonedas.disable();
                            view.gpInstrumento.disable();

                        }
                    } else {
                        view.tfdiferenciaD.setValue(formatoMoneda(this.saldoFondo));
                    }
                    view.nfSaldoFondo.setValue(formatoMoneda(this.saldoFondo));
                    if (idArqueo && !isClear && scope.accion != 'ver') {
                        this.createFormSteps('mod');
                    } else if (!isClear && scope.accion != 'ver') {
                        this.createFormSteps('add');
                    }
                    view.lMask.hide();
                }.bind(this)
            });
        };

        this.createFormSteps = function (tipoAccion) {
            var arrGrids = [];
            if (controller.idFormaPago == 3) {
                arrGrids.push({
                    grid: view.gpSellos,
                    ordenar: 'idsellos',
                    evaluar: ['idsellos', 'cantidad'],
                    tipo: 'eg',
                    campoRecords: 'cantidad',
                });
            } else if (controller.idFormaPago == 2) {
                arrGrids.push({
                    grid: view.gpInstrumento,
                    ordenar: 'iddocumento',
                    evaluar: ['iddocumento', 'importe'],
                    tipo: 'sm',
                });
            } else if (controller.idFormaPago == 1) {
                arrGrids.push({
                    grid: view.gpBilletes,
                    ordenar: 'iddesglosemoneda',
                    evaluar: ['iddesglosemoneda', 'cantidad'],
                    tipo: 'eg',
                    campoRecords: 'cantidad',
                });
                arrGrids.push({
                    grid: view.gpMonedas,
                    ordenar: 'iddesglosemoneda',
                    evaluar: ['iddesglosemoneda', 'cantidad'],
                    tipo: 'eg',
                    campoRecords: 'cantidad',
                });
                arrGrids.push({
                    grid: view.gpInstrumento,
                    ordenar: 'iddocumento',
                    evaluar: ['iddocumento', 'importe'],
                    tipo: 'sm',
                });
            }

            this.formSteps = new CON.Util.FormSteps({
                arrForm: view.pDatosDocumentos,
                arrBtn: view.winAddArqueo.buttons,
                arrGrid: (view.nfSaldoFondo.getValue() == 0) ? undefined : arrGrids
            });
            this.formSteps.on({
                scope: this,
                Nuevo: function (fnNuevo, fnLimpiarCampos, fnDesabilitarForm, fnDesabilitarGrid) {
                    fnLimpiarCampos();
                    fnDesabilitarForm(false);
                    fnDesabilitarGrid(false);
                    this.limpiarCampos();
                    // this.desabilitarCamposForm(false);
                    fnNuevo();
                },
                Crear: function (fnCrear, cerrarVentana, fnDesabilitarForm, fnDesabilitarGrid) {
                    var fn = function (id) {
                        // this.desabilitarCamposForm(true);
                        fnDesabilitarForm(true);
                        fnDesabilitarGrid(true);
                        fnCrear.call(undefined, id);
                    }.bind(this);


                    if (view.ckCierre.getValue() && (parseFloat(controller.totalArqueo.toFixed(2)) - controller.saldoFondo) != 0) {
                        mostrarMensaje(1, etiquetas.lbMsgArqCierre);
                        return;
                    }
                    if (controller.tipoFondo == 2 && controller.idFormaPago == 1) {//Si elfondo es Ingreso de efectivo el total de documentos tiene que ser igual al total de billestes y monedas
                        if (controller.totalArqueo.toFixed(2) != controller.totalCheque.toFixed(2)) {
                            mostrarMensaje(1, 'El total desglosado debe corresponderse con los documentos arqueados.');
                            return;
                        }
                    }
                    if (cargainicial == 1) {
                        controller.guardarArqueo(true, fn);
                    } else {
                        controller.guardarArqueo(cerrarVentana, fn);
                    }

                },
                Confirmar: function (fnConfirmar, id) {
                    this.confirmarArqueo(id, fnConfirmar);
                },
                // Postear: function (fnPostear, id) {
                //     var fn = fnPostear;
                //     if (tipoAccion == 'mod') {
                //         fn = fnPostear.createSequence(function () {
                //             scope.wAdicionarMovGen.close();
                //             scope.fireEvent('closeAdicionar', true);
                //         }, this);
                //     }
                //     scope.ClickContabilizarReembolso(id, fn);
                // },
            });
        };

        this.desabilitarCamposForm = function (flag) {
            // if (flag) {
            //     scope.fpAddMovGen.disable();
            // } else {
            //     scope.fpAddMovGen.enable();
            // }
        };

        this.limpiarCampos = function () {
            this.loadDataAddArqueo(undefined, true);
        };

        this.arrayDesgloseMonedas = function () {
            var arr_monedas = new Array();
            var j = 0;
            for (var i = 0; i < model.stMonedas.getCount(); i++) {
                if (model.stMonedas.getAt(i).data.cantidad > 0) {
                    arr_monedas[j] = model.stMonedas.getAt(i).data;
                    j++;
                } else {
                    if (model.stMonedas.getAt(i).data.idcantidaddenominacion > 0)
                        this.arrayEliminarDesglose.push(model.stMonedas.getAt(i).data.idcantidaddenominacion);
                }
            }
            return arr_monedas;
        }

        this.arrayDesgloseBilletes = function () {
            var arr_billetes = new Array();
            var j = 0;
            for (var i = 0; i < model.stBilletes.getCount(); i++) {
                if (model.stBilletes.getAt(i).data.cantidad > 0) {
                    arr_billetes[j] = model.stBilletes.getAt(i).data;
                    j++;
                } else {
                    if (model.stBilletes.getAt(i).data.idcantidaddenominacion > 0)
                        this.arrayEliminarDesglose.push(model.stBilletes.getAt(i).data.idcantidaddenominacion);
                }
            }
            return arr_billetes;
        }

        this.arrayDesgloseSellos = function () {
            var arr_Sellos = new Array();
            var j = 0;
            for (var i = 0; i < model.stSellos.getCount(); i++) {
                if (model.stSellos.getAt(i).data.cantidad > 0) {
                    arr_Sellos[j] = model.stSellos.getAt(i).data;
                    j++;
                } else {
                    if (model.stSellos.getAt(i).data.idcantidaddenominacionsello > 0)
                        this.arrayEliminarDesgloseSello.push(model.stSellos.getAt(i).data.idcantidaddenominacionsello);
                }
            }
            return arr_Sellos;
        }

        this.arrayInstrumentosCheque = function () {
            var arr_cheques = new Array();

            for (var i = 0; i < model.stInstrumentos.getCount(); i++) {
                // if (view.smInstrumentos.isSelected(i) && model.stInstrumentos.getAt(i).data.idformapago == 2) {// si es cheque
                if (view.smInstrumentos.isSelected(i)) {
                    arr_cheques[i] = model.stInstrumentos.getAt(i).data;
                } else {
                    if (!view.smInstrumentos.isSelected(i) && model.stInstrumentos.getAt(i).data.iddocumentoarqueo) {
                        this.arrayEliminarInstArq.push(model.stInstrumentos.getAt(i).data.iddocumentoarqueo);
                    }
                }
            }
            return arr_cheques;
        }

        this.guardarArqueo = function (cerrarVentana = true, fn) {
            Ext.Msg.wait(etiquetas.lbGuardando, etiquetas.lbEspere);
            Ext.Ajax.request({
                url: 'guardarArqueo',
                method: 'POST',
                params: {
                    idArqueo: view.smArqueos.hasSelection() ? view.smArqueos.getSelected().data.idarqueo : 0,
                    idDocumento: view.smArqueos.hasSelection() ? view.smArqueos.getSelected().data.iddocumento : 0,
                    idMonedaEntidad: scope.idMonedaEntidad,
                    idCajaFondo: scope.idCajaFondo,
                    idCaja: scope.idcaja,
                    cargaInicial: cargainicial,
                    fecha: view.dffecha.getRawValue(),
                    importeArqueo: this.totalArqueo,
                    comentario: view.tacomentarioD.getValue(),
                    cierre: view.ckCierre.getValue() ? 1 : 0,
                    monedas: Ext.encode(this.arrayDesgloseMonedas()),
                    billetes: Ext.encode(this.arrayDesgloseBilletes()),
                    sellos: Ext.encode(this.arrayDesgloseSellos()),
                    instrumentosCheque: Ext.encode(this.arrayInstrumentosCheque()),
                    arrayEliminarDesglose: Ext.encode(this.arrayEliminarDesglose),
                    arrayEliminarDesglose: Ext.encode(this.arrayEliminarDesgloseSello),
                    arrayEliminarInstArq: Ext.encode(this.arrayEliminarInstArq),
                    diferencia: this.totalArqueo - this.saldoFondo,
                    //importeCheques: view.nfImporteCheques.getValue()
                },
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codMg == 1) {
                        if (view.smArqueos.hasSelection() ? view.smArqueos.getSelected().data.idarqueo : 0)
                            mostrarMensaje(1, etiquetas.msgModSatif);
                        else mostrarMensaje(1, etiquetas.msgAddSatif);
                        if (cerrarVentana) {
                            view.winAddArqueo.close();
                            model.stArqueos.reload();
                        }
                        if (typeof fn == 'function') {
                            fn(responseData.idDoc);
                        }
                    }
                    if (responseData.codMg == -1) {
                        mostrarMensaje(1, etiquetas.lbMsgNoExistenOper);
                    }
                    if (responseData.codMg == -2) {
                        mostrarMensaje(1, etiquetas.lbMsgNoExistenTalonario);
                    }
                    Ext.MessageBox.hide();
                }
            });
        };

        this.confirmarArqueo = function (id, fnConfirmar) {
            Ext.Msg.wait('Confirmado', etiquetas.lbEspere);
            Ext.Ajax.request({
                url: 'confirmarArqueo',
                method: 'POST',
                params: {
                    idDocumento: id ? id : view.smArqueos.getSelected().data.iddocumento
                    // idArqueo: view.smArqueos.getSelected().data.idarqueo,
                    // idCajaFondo: scope.idCajaFondo,
                    // idMonedaEntidad: scope.idMonedaEntidad
                },
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    if (!id) {
                        model.stArqueos.reload();
                    }
                    view.btnModificar.disable();
                    if (typeof fnConfirmar == 'function') {
                        fnConfirmar();
                    }
                    Ext.MessageBox.hide();
                    mostrarMensaje(1, etiquetas.msgConfirm);
                }
            });
        }

        this.cancelarArqueo = function (idComprobante, numComprobante, fechaComprobante) {
            Ext.Ajax.request({
                url: 'cancelarArqueo',
                method: 'POST',
                params: {
                    idArqueo: view.smArqueos.getSelected().data.idarqueo,
                    idDocumento: view.smArqueos.getSelected().data.iddocumento,
                    contabilizado: (view.smArqueos.getSelected().data.idestado == 6) ? 1 : 0,
                    idComprobante: idComprobante,
                    numComprobante: numComprobante,
                    fechaComprobante: fechaComprobante,
                    idmotivo: view.cbxmotivo.getValue(),
                    fecha: view.dffechac.getRawValue(),
                    idMonedaEntidad: scope.idMonedaEntidad,
                    idCajaFondo: scope.idCajaFondo
                },
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    model.stArqueos.reload();
                    view.winCancelar.hide();
                    Ext.MessageBox.hide();
                    if (idComprobante)
                        mostrarMensaje(1, etiquetas.lbAnulsatisfactoria + ' ' + numComprobante + '.');
                    else mostrarMensaje(1, etiquetas.msgCancelar);
                    scope.keyMap.enable();
                }
            });
        }

        this.eliminarArqueo = function () {
            Ext.Ajax.request({
                url: 'eliminarArqueo',
                method: 'POST',
                params: {
                    idArqueo: view.smArqueos.getSelected().data.idarqueo,
                    idDocumento: view.smArqueos.getSelected().data.iddocumento,
                    idCajaFondo: scope.idCajaFondo
                },
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    model.stArqueos.reload();
                    Ext.MessageBox.hide();
                    mostrarMensaje(1, etiquetas.msgEliminar);
                    scope.keyMap.enable();
                }
            });
        }

        this.fLoadDataComprobante = function (params) {
            Ext.Msg.wait(etiquetas.lbLoadDataComprobante, etiquetas.lbEspere);
            Ext.Ajax.request({
                url: 'loadDataComprobante',
                method: 'POST',
                scope: this,
                params: {
                    idArqueo: view.smArqueos.getSelected().data.idarqueo,
                    idDocumento: view.smArqueos.getSelected().data.iddocumento,
                    tipoContabilizacion: params.tipoContabilizacion,
                    fecha: params.fecha,
                    idCajaFondo: scope.idCajaFondo,
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.codMg == '-1') {
                        mostrarMensaje(1, etiquetas.lbMsgNoExistenOper);
                        Ext.MessageBox.hide();
                    } else if (responseData.codMg == '-2') {
                        mostrarMensaje(1, etiquetas.lbMsgModeloIncorrecto + '---ll');
                        Ext.MessageBox.hide();
                    } else
                        this.fShowComprobante(responseData, params);
                }.bind(this)
            });
        };

        //Construir y mostrar el comprobante
        this.fShowComprobante = function (respData, params) {
            var idSubsistema = 14;//Caja
            var idTipoComprobante = 3;//comprobante tipo operaciones
            var descripcion = params.descripcion + respData.descripcion;
            var detalle = params.descripcion + respData.detalle;

            // Ext.MessageBox.hide();
            Ext.Cont.Comprobante.init(idSubsistema, detalle, descripcion, respData.fechaCont, respData.dataComprobante, idTipoComprobante, 1, 1).onSaved(function (idComprobante, numComprobante, fechaComprobante) {
                Ext.Msg.wait(etiquetas.lbGuardandoComprobante, etiquetas.lbEspere);
                if (params.tipoContabilizacion === 1)
                    this.fGuardarComprobante(idComprobante, numComprobante, fechaComprobante, params);
                else
                    scope.cancelarArqueo(idComprobante, numComprobante, fechaComprobante);
            }.bind(this)).onClose(function () {
                scope.keyMap.enable();
                noWindow = true;//para indicar que se cerro la ventana
            });
        };

        this.fGuardarComprobante = function (idComprobante, numeroComprobante, fechaComprobante, params) {
            Ext.Ajax.request({
                method: "POST",
                url: 'contabilizarArqueo',
                scope: this,
                params: {
                    idArqueo: view.smArqueos.getSelected().data.idarqueo,
                    idDocumento: view.smArqueos.getSelected().data.iddocumento,
                    idComprobante: idComprobante,
                    numeroComprobante: numeroComprobante,
                    fechaComprobante: fechaComprobante,
                    idCajaFondo: scope.idCajaFondo,
                },
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    Ext.MessageBox.hide();
                    model.stArqueos.reload();
                    mostrarMensaje(1, etiquetas.lbMsgContabilizado + ' ' + numeroComprobante + '.');
                }.bind(this)
            });
        };

        this.calcImporteBilletes = function (cant, valor) {
            if (view.nfcantidadbilletes.startValue >= 0) {
                var totalImporte = (cant - view.nfcantidadbilletes.startValue) * valor;
                this.totalBilletes += totalImporte;
                // view.labelBilletes.setText(parseFloat(this.totalBilletes).toFixed(2));
                view.labelBilletes.setText(formatoMoneda(this.totalBilletes));
                this.totalArqueo += totalImporte;
                view.tftotalarqueoD.setValue(formatoMoneda(this.totalArqueo));
                var difArqueo = this.totalArqueo - this.saldoFondo;
                view.tfdiferenciaD.setValue(formatoMoneda(difArqueo));
                var importe = cant * valor;
                return parseFloat(importe).toFixed(2);
            } else {
                return parseFloat(0).toFixed(2);
            }
        };

        this.calcImporteSellos = function (cant, valor) {
            if (view.nfcantidadSellos.startValue >= 0) {
                var totalImporte = (cant - view.nfcantidadSellos.startValue) * valor;
                this.totalSellos += totalImporte;
                view.labelSellos.setText(formatoMoneda(this.totalSellos));
                this.totalArqueo += totalImporte;
                view.tftotalarqueoD.setValue(formatoMoneda(this.totalArqueo));
                var difArqueo = this.totalArqueo - this.saldoFondo;
                view.tfdiferenciaD.setValue(formatoMoneda(difArqueo));
                var importe = cant * valor;
                return parseFloat(importe).toFixed(2);
            } else {
                return parseFloat(0).toFixed(2);
            }
        };

        this.calcImporteMonedas = function (cant, valor) {
            if (view.nfcantidadmonedas.startValue >= 0) {
                var totalImporte = (cant - view.nfcantidadmonedas.startValue) * valor;
                this.totalMonedas += totalImporte;
                // view.labelMonedas.setText(parseFloat(this.totalMonedas).toFixed(2));
                view.labelMonedas.setText(formatoMoneda(this.totalMonedas));
                this.totalArqueo += totalImporte;
                view.tftotalarqueoD.setValue(formatoMoneda(this.totalArqueo));
                var difArqueo = this.totalArqueo - this.saldoFondo;
                view.tfdiferenciaD.setValue(formatoMoneda(difArqueo));
                var importe = cant * valor;
                return parseFloat(importe).toFixed(2);
            } else {
                return parseFloat(0).toFixed(2);
            }
        };

        this.calcImporteInstrumentos = function (instrumentos) {
            var totalCheque = 0;
            for (var i = 0; i < instrumentos.length; i++) {
                totalCheque += parseFloat(Math.abs(instrumentos[i].data.importe));
            }
            if (!(scope.tipoFondo == 2 && scope.idFormaPago == 1))//Si scope.tipoFondo es 2 que es Ingreso y es de efectivo no contar esos documentos porque se van a desglosar en billetes y monedas
                this.totalArqueo += totalCheque - this.totalCheque;
            this.totalCheque = totalCheque;
            view.tftotalarqueoD.setValue(formatoMoneda(this.totalArqueo));
            var difArqueo = this.totalArqueo - this.saldoFondo;
            view.tfdiferenciaD.setValue(formatoMoneda(difArqueo));
            view.labelDocument.setText(formatoMoneda(totalCheque));
            //view.nfImporteCheques.setValue(parseFloat(totalCheque));
            //view.nfImporteCheques.setRawValue(formatoMoneda(totalCheque));
        };

        // model.stInstrumentos.on({
        //     load: function () {
        //         //controller.calcImporteEfectivo();
        //     }
        // });

        // this.calcImporteEfectivo = function () {
        //     var totalEfectivo = 0;
        //     for (var i = 0; i < model.stInstrumentos.getCount(); i++) {
        //         if (model.stInstrumentos.getAt(i).data.idformapago == 1) {//1-Forma de pago Efectivo
        //             totalEfectivo += parseFloat(Math.abs(model.stInstrumentos.getAt(i).data.importe));
        //         }
        //     }
        //     this.totalEfectivo = totalEfectivo;
        //     view.labelEfectivo.setText(parseFloat(totalEfectivo).toFixed(2));
        // };

        view.btnConfirmar.on('click', function () {
            scope.keyMap.disable();
            mostrarMensaje(2, etiquetas.lbConfirmConf, function (btnPress) {
                if (btnPress === 'ok') {
                    scope.confirmarArqueo();
                    scope.keyMap.enable();
                }
                if (btnPress === 'cancel') {
                    scope.keyMap.enable();
                }
            }.bind(this));
        }.bind(this));

        view.rowaction.on({
            scope: this,
            action: function (grid, recordarray, icon, rowindex, colindex) {
                this.fShowReporteComprobante();
            },
            beforeaction: function (grid, rowIndex) {
            }
        });

        this.fShowReporteComprobante = function () {
            // Ext.Msg.wait(scope.etiquetas.lbCargando, scope.etiquetas.lbEspere);
            Ext.Msg.wait('Cargando...', 'Espere...');
            var arrayIdCmp = view.smArqueos.getSelected().json.arrayIdCmp;

            Ext.Ajax.request({
                url: "/contabilidad/contabilidad_financiera/comprobante_operaciones/index.php/registrodecomprobantes/" + 'obtenerDatosImprimirReporte',
                params: {
                    reporteParams: Ext.encode(arrayIdCmp)
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.dataSources.length > 0) {
                        fOpenWindowReportCmp({
                            datoGeneral: {
                                reporte: '100',
                                titulo: 'Comprobante de operaciones',
                            },
                            datoCuerpo: responseData.dataSources
                        });
                    }
                    Ext.MessageBox.hide();
                }
            });
        };

        fOpenWindowReportCmp = function (datosReporte) {
            defaultComponentsValue = {
                paperSize: "A4",
                orientation: "Horizontal",
                reportType: "HTML"
            };
            var printView = new SCFPrintView(datosReporte, "/contabilidad/comun/SCFPrintView/", defaultComponentsValue);
            printView.show();
        };

        view.btnContabilizarDif.on('click', function () {
            scope.keyMap.enable();
            mostrarMensaje(2, etiquetas.lbConfirmCont, function (btnPress) {
                if (btnPress === 'ok') {
                    var diferencia = '';
                    if (view.smArqueos.getSelected().data.diferenciasobrante > view.smArqueos.getSelected().data.diferenciafaltante)
                        diferencia = 'sobrante';
                    else diferencia = 'faltante'
                    param = {
                        tipoContabilizacion: 1, //1 contabilizar doc confirmado | 2 revertir comprobnate contabilizado
                        actionContabiliza: 'contabilizar',
                        descripcion: 'Posteando ' + diferencia + ' del arqueo: ',
                    }
                    scope.fLoadDataComprobante(param);
                }
                if (btnPress === 'cancel') {
                    scope.keyMap.enable();
                }
            });
        });

//--Reporte de Arqueo-------------------------------------------------------
        view.btnReporte.setHandler(function () {
            this.fShowReporte();
        }, this);

        this.fShowReporte = function () {
            scope.keyMap.disable();
            Ext.Msg.wait('Cargando...', 'Espere...');
            var data = view.smArqueos.getSelected().data;

            Ext.Ajax.request({
                url: 'getDataReporte',
                method: 'POST',
                params: {
                    idCajaFondo: scope.idCajaFondo,
                    idDocumento: data.iddocumento
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    if (responseData) {
                        this.fOpenWindowReport(responseData);
                    } else {
                        scope.keyMap.enable();
                    }
                    Ext.MessageBox.hide();
                }.bind(this)
            });
        };

        this.fOpenWindowReport = function (datosReporte) {
            defaultComponentsValue = {
                paperSize: "A4",
                orientation: "Horizontal",
                reportType: "HTML"
            };
            var printView = new SCFPrintView(datosReporte, "/contabilidad/comun/SCFPrintView/", defaultComponentsValue);
            printView.on({
                close: function () {
                    scope.keyMap.enable();
                }
            });
            printView.show();
        };
// -------------------------------------------------------------

        view.tfNumero.on({
            keypress: function (field, e) {
                if (e.getKey() == 13 && field.getValue() != '') {
                    view.btnBuscar.fireEvent('click');
                }
            },
            keyup: function (field, e) {
                if (field.getValue() == '' && !view.tfEstado.getValue()) {
                    view.btnBuscar.disable();
                    /*if ((e.getKey() == 46 || e.getKey() == 8)) {
                     model.stArqueos.baseParams = {};
                     model.stArqueos.baseParams.idcajafondo = scope.idCajaFondo;
                     model.stArqueos.load();
                     }*/
                } else view.btnBuscar.enable();
            }
        });

        view.tfEstado.on({
            select: function () {
                view.btnBuscar.enable()
            },
            keypress: function (field, e) {
                if (e.getKey() == 46 || e.getKey() == 8) {
                    field.clearValue();
                    if (view.tfNumero.getValue() == '') {
                        view.btnBuscar.disable();
                        model.stArqueos.baseParams = {};
                        model.stArqueos.baseParams.idcajafondo = scope.idCajaFondo;
                        model.stArqueos.load();
                    }
                }
                if (e.getKey() == 13) {
                    view.btnBuscar.fireEvent('click');
                }
            }
        });

        view.btnBuscar.on({
            click: function (tf, e) {
                model.stArqueos.baseParams = {
                    numero: view.tfNumero.getValue(),
                    idestado: view.tfEstado.getValue()
                }
                model.stArqueos.reload();
            }
        });

        model.stArqueos.on({
            load: function (options, records) {
                if (!options.baseParams.numero)
                    view.tfNumero.reset();
                if (!options.baseParams.idestado)
                    view.tfEstado.reset();
                if (!options.baseParams.idestado && !options.baseParams.numero)
                    view.btnBuscar.disable();
                Ext.MessageBox.hide();
                //Mensaje cuando no encuentra datos al buscar
                if (!records.length) {
                    if (options.baseParams.numero && options.baseParams.idestado)
                        mostrarMensaje(1, etiquetas.lbNoDatosPorCriterios);
                    else if (options.baseParams.numero || options.baseParams.idestado)
                        mostrarMensaje(1, etiquetas.lbNoDatosPorCriterio);
                    else mostrarMensaje(1, etiquetas.lbNoDatos);
                }
                if (this.idSelected) {
                    var index = model.stArqueos.find('idarqueo', this.idSelected);
                    view.smArqueos.selectRow(index);
                } else {
                    view.smArqueos.selectFirstRow();
                }
            },
            beforeload: function () {
                model.stArqueos.baseParams.idcajafondo = scope.idCajaFondo;
                model.stArqueos.baseParams.idPeriodo = Caja.Componentes.cbPeriodo.getValue();
                model.stArqueos.baseParams.cargaInicial = cargainicial;
                if (view.smArqueos.hasSelection())
                    this.idSelected = view.smArqueos.getSelected().data.idarqueo;
                else this.idSelected = null;
            }
        });

        view.paginToolbar.on({
            beforechange: function () {
                model.stArqueos.baseParams.idcajafondo = scope.idCajaFondo;
                model.stArqueos.baseParams.cargaInicial = cargainicial;
                model.stArqueos.baseParams.idPeriodo = Caja.Componentes.cbPeriodo.getValue();
            }
        });

        view.gridArqueos.getView().getRowClass = function (record, index, rowParams, store) {
            if (record.get('idestado') == 6)//Posteado
                return 'FilaVerde';
            if (record.get('idestado') == 7)//Cancelado
                return 'FilaRoja';
        };

        view.gridArqueos.on({
            scope: this,
            rowdblclick: function (grid, row, event) {
                var record = grid.getStore().getAt(row);
                if (record) {
                    var estado = record.get('idestado');
                    if (estado == 8) {
                        if (!view.btnModificar.disabled)
                            view.btnModificar.fireEvent('click');
                    } else {
                        if (!view.btnVer.disabled)
                            view.btnVer.fireEvent('click');
                    }
                }
            }
        });
        //-------------------------------------------
        Caja.Componentes.cbPeriodo.on({
            scope: this,
            select: function (cb, record) {
                view.gridArqueos.getBottomToolbar().changePage(0);
                model.stArqueos.reload();
            }
        });
//-------------------------------------------
        view.smArqueos.on({
            rowselect: function (smodel, rowIndex, record) {
                view.gridArqueos.getView().addRowClass(rowIndex, "negrita");

                view.btnCancelarDoc.enable();
                view.btnReporte.enable();

                if (view.smArqueos.getSelected().data.idestado == 8) {
                    view.btnModificar.enable();
                    view.btnConfirmar.enable();
                    view.btnEliminarDoc.enable();
                } else view.btnEliminarDoc.disable();

                if (view.smArqueos.getSelected().data.idestado == 5) {
                    view.btnConfirmar.disable();
                    if (view.smArqueos.getSelected().data.diferenciafaltante != view.smArqueos.getSelected().data.diferenciasobrante)
                        view.btnContabilizarDif.enable();
                }

                if (view.smArqueos.getSelected().data.idestado == 7) {
                    view.btnContabilizarDif.disable();
                    view.btnConfirmar.disable();
                    view.btnCancelarDoc.disable();
                }

                view.btnAvisoDebito.enable();
                //Para el caso de CI----------------------------------------------
                if (view.smArqueos.getSelected().data.cargainicial == 1 && cargainicial == 0) {
                    view.btnModificar.disable();
                    view.btnConfirmar.disable();
                    view.btnCancelarDoc.disable();
                    view.btnContabilizarDif.disable();
                    view.btnReporte.disable();
                }
                if (view.smArqueos.getSelected().data.cargainicial == 1 && cargainicial == 1) {
                    view.btnModificar.enable();
                    view.btnEliminarDoc.enable();
                }
            },
            rowdeselect: function (smodel, rowIndex, record) {
                view.gridArqueos.getView().removeRowClass(rowIndex, "negrita");

                view.btnModificar.disable();
                view.btnCancelarDoc.disable();
                view.btnEliminarDoc.disable();
                view.btnConfirmar.disable();
                view.btnContabilizarDif.disable();
                view.btnReporte.disable();
            },
            selectionchange: function (selectionModel) {
                if (!selectionModel.hasSelection()) {
                    view.btnModificar.disable();
                    view.btnCancelarDoc.disable();
                    view.btnEliminarDoc.disable();
                    view.btnConfirmar.disable();
                    view.btnContabilizarDif.disable();
                    view.btnReporte.disable();
                }
            }
        });

        this.keyMap = new Ext.KeyMap(document, [
            {
                key: "i",
                alt: true,
                scope: this,
                fn: function () {
                    view.btnAdicionar.fireEvent('click');
                }
            }, {
                key: "m",
                alt: true,
                scope: this,
                fn: function (n, e) {
                    e.preventDefault();
                    if (!view.btnModificar.disabled)
                        view.btnModificar.fireEvent('click');
                }
            }, {
                key: Ext.EventObject.DELETE, //Eliminar
                fn: function () {
                    if (!view.btnEliminarDoc.disabled && cargainicial)
                        view.btnEliminarDoc.fireEvent('click');
                }
            }, {
                key: "x",
                alt: true,
                scope: this,
                fn: function () {
                    if (!view.btnCancelarDoc.disabled)
                        view.btnCancelarDoc.fireEvent('click');
                }
            }, {
                key: 'f',
                alt: true,
                scope: this,
                fn: function (a, e) {
                    e.preventDefault();
                    if (!view.btnConfirmar.disabled)
                        view.btnConfirmar.fireEvent('click');
                }
            }, {
                key: "t",
                alt: true,
                scope: this,
                fn: function () {
                    if (!view.btnContabilizar.disabled)
                        view.btnContabilizar.fireEvent('click');
                }
            }, {
                key: "b",
                alt: true,
                scope: this,
                fn: function () {
                    if (!view.btnBuscar.disabled)
                        view.btnBuscar.fireEvent('click');
                }
            }, {
                key: "r",
                alt: true,
                scope: this,
                fn: function (a, e) {
                    e.preventDefault();
                    if (!view.btnReporte.disabled)
                        view.btnReporte.handler.call(this);
                }
            }
        ]);

    },
    initEventWinAddMod: function (view, controller, etiquetas, model) {
        // view.gpInstrumento.getView().getRowClass = function (record, index, rowParams, store) {
        //     if (record.get('idformapago') == 2)//Cheques
        //         return 'FilaVerde';
        //     else
        //         return 'FilaRoja';
        // };

        view.btnCerrar.on('click', function () {
            view.winAddArqueo.close();
            model.stArqueos.reload();
        });

        view.btnAceptarForm.on('click', function () {
            // if (view.ckCierre.getValue() && (parseFloat(controller.totalArqueo.toFixed(2)) - controller.saldoFondo) != 0) {
            //     mostrarMensaje(1, etiquetas.lbMsgArqCierre);
            //     return;
            // }
            // if (controller.tipoFondo == 2 && controller.idFormaPago == 1) {//Si elfondo es Ingreso de efectivo el total de documentos tiene que ser igual al total de billestes y monedas
            //     if (controller.totalArqueo.toFixed(2) != controller.totalCheque.toFixed(2)) {
            //         mostrarMensaje(1, 'El total desglosado debe corresponderse con los documentos arqueados.');
            //         return;
            //     }
            // }
            // if (view.pDatosDocumentos.getForm().isValid())
            //     controller.guardarArqueo();
        });

        // view.nfImporteCheques.on({
        //     blur: function (tf, e) {
        //         tf.setRawValue(parseFloat(tf.getValue()).toFixed(2));
        //     },
        //     change: function (tf, e) {
        //         this.totalArqueo = parseFloat(view.nfImporteCheques.getValue()) + this.totalBilletes + this.totalMonedas;
        //         view.tftotalarqueoD.setValue(formatoMoneda(this.totalArqueo));
        //
        //         var difArqueo = this.saldoFondo - this.totalArqueo;
        //         view.tfdiferenciaD.setValue(formatoMoneda(difArqueo));
        //     }.bind(this)
        // });

        view.smInstrumentos.on({
            selectionchange: function () {
                var hd = Ext.fly(view.gpInstrumento.getView().innerHd).child('div.x-grid3-hd-checker');
                if (view.smInstrumentos.getCount() < view.gpInstrumento.getStore().getCount()) {
                    hd.removeClass('x-grid3-hd-checker-on');
                } else {
                    hd.addClass('x-grid3-hd-checker-on');
                }
                var selections = view.gpInstrumento.getSelectionModel().getSelections();
                controller.calcImporteInstrumentos(selections);
            },
            rowselect: function (smodel, rowIndex, record) {
                view.gpInstrumento.getView().addRowClass(rowIndex, "negrita");
            },
            rowdeselect: function (smodel, rowIndex, record) {
                view.gpInstrumento.getView().removeRowClass(rowIndex, "negrita");
                //     if (record.get('idformapago') == 1 && controller.tipoMovimiento == 2) {//Forma de pago 1-Efectivo y tipoMov 2-Entrada
                //         view.smInstrumentos.selectRow(rowIndex, true);
                //     }
            }
        });
        //--------------------
    }
};