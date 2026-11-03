/**
 * GestionarAnticipoDienta.Controller
 *
 * @author Ing. Roberto Linares Zamora
 * @author Ing. Alejandro Mengana
 * @version 1.0
 */
Ext.ns('Caja.DietaExt');
Caja.DietaExt.Controller = {
    init: function (perfil, etiquetas, view, model, cargainicial) {

        var scope = this;
        this.changed = false;
        this.liquidar = false;
        this.diferencia = 0;
        this.TaskFormValidation=TaskFormValidation;

        this.showMask = function () {
            this.mask = new Ext.LoadMask(Ext.getBody(), {msg: etiquetas.lbCargando});
            this.mask.show();
        };

        this.closeMask = function () {
            this.mask.hide();
        };

        this.loadWindowCajaFondo = function (btnfondo) {
            if (btnfondo) {
                this.showMask();
            }
            var objMiWin = new Caja.CajaFondo.WindowCajaFondo({
                showCbMov: false,
                showWinMod: (scope.idfondo !== undefined) ? true : false,
                tipoMov: [3] // 3- Fondo de Dieta Divisa
            });

            objMiWin.btnCancelar.on('click', function () {
                objMiWin.close();

                //items[k].win.destroy();            items[k].destroy();
//                  var desk = window.parent.MyDesktop.getDesktop();
//                  var items = desk.taskbar.tbPanel.items;
//                  var idFuncionalidad = 'win' + window.parent.idFuncionalidad;
//
//                  for (var i = 0, long = items.length; i < long; i++) {
//                      if(items[i].win.id == idFuncionalidad) {
//                          items[i].win.destroy();
//                          items[i].destroy();
//                          break;
//                      }
//                  }
            });

            objMiWin.on({
                scope: this,
                show: function () {
                    scope.keyMap.disable();

                    if (btnfondo) {
                        this.closeMask();
                    }
                    else {
                        Ext.MessageBox.hide();
                    }
                },
                close: function () {
                    if (scope.idfondo === undefined) {
                        window.parent.Ext.getCmp('win' + window.parent.idFuncionalidad).close();
                    }

                    scope.keyMap.enable();
                    //scope.MostrarMascara('Cargando...');
                },
                loadData: function () {
                    model.stAnticipos.removeAll();
                    scope.idMoneda = objMiWin.idMoneda;
                    scope.idMonedaEntidad = objMiWin.idMonedaEntidad;
                    scope.idcajafondo = objMiWin.idCajaFondo;

                    scope.idfondo = objMiWin.cbFondo.getValue();
                    scope.idcaja = objMiWin.cbCaja.getValue();

                    view.tfFondo.setValue(objMiWin.nomFondo);

                    scope.idCbCaja = objMiWin.idCaja;
                    scope.valueCbCaja = objMiWin.nomCaja;
                    scope.valueCbFondo = objMiWin.nomFondo;
                    scope.idCbFondo = objMiWin.idFondo;
                    scope.idMovimiento = objMiWin.cbMovimiento.getValue();
                    scope.valueCbFondo = objMiWin.cbMovimiento.getRawValue();

                    Ext.MessageBox.hide();

                    model.stAnticipos.baseParams.idcajafondo = scope.idcajafondo;
                    model.stAnticipos.load();
                }
            });
        };
        this.loadWindowCajaFondo(false);

        view.btnFondo.on({
            scope: this,
            click: function () {
                this.loadWindowCajaFondo(true);
            }
        });

        view.gridAnticipo.getView().getRowClass = function (record, index, rowParams, store) {
            if (record.json.idestado == 6) { //Contabilizado
                return 'FilaVerde';
            } else if (record.json.idestado == 7) { //Cancelado
                return 'FilaRoja';
            }
        };

        model.stAnticipos.on({
            beforeload: function () {
                scope.MostrarMascara(etiquetas.lbCargando);
            },
            load: function () {
                loadMask.hide();
            }
        });

        view.smAnticipos.on({
            rowselect: function (smodel, rowIndex, record) {
                scope.actualizarBotones();
                //Para el caso de CI----------------------------------------------
                if (view.smAnticipos.getSelected().data.cargainicial == 1 && cargainicial == 0) {
                    view.btnModificar.disable();
                    view.btnAprobar.disable();
                    view.btnCancelar.disable();
                    view.btnContabilizar.disable();
                    view.btnEliminar.disable();
                }
                if (view.smAnticipos.getSelected().data.cargainicial == 1 && cargainicial == 1) {
                    view.btnModificar.enable();
                    view.btnEliminar.enable();
                }
                view.gridAnticipo.getView().addRowClass(rowIndex, "negrita");
            }, rowdeselect: function (smodel, rowIndex, record) {
                scope.actualizarBotones();
                view.gridAnticipo.getView().removeRowClass(rowIndex, "negrita");
            },
            selectionchange: function (selectionModel) {
                if (!selectionModel.hasSelection()) {
                    view.btnModificar.disable();
                    view.btnAprobar.disable();
                    view.btnCancelar.disable();
                    view.btnContabilizar.disable();
                    view.btnEliminar.disable();
                }
            }
        });

        view.btnAdicionar.on('click', function () {
            scope.ClickAddAnticipo();
        });
        view.btnModificar.on('click', function () {
            scope.ClickModAnticipo();
        });
        view.btnAprobar.on('click', function () {
            scope.ClickAprobarAnticipo();
        });
        view.btnContabilizar.on('click', function () {
            scope.ClickContabilizarAnticipo();
        });
        view.btnCancelar.on('click', function () {
            scope.ClickCancelarAnticipo();
        });

        view.btnLiquidar.on({
            click: function () {
                scope.showWindow('liq');
                scope.liquidar = true;
            }
        });

        view.tfNumero.on({
            keypress: function (field, e) {
                if (e.getKey() == 13 && field.getValue() != '') {
                    view.btnBuscar.fireEvent('click');
                }
            },
            keyup: function (field, e) {
                if (field.getValue() == '' && !view.cbEstado.getValue()) {
                    view.btnBuscar.disable();
                    /*if ((e.getKey() == 46 || e.getKey() == 8)) {
                     model.stAnticipos.baseParams = {};
                     model.stAnticipos.baseParams.idcajafondo = scope.idCajaFondo;
                     model.stAnticipos.load();
                     }*/
                }
                else view.btnBuscar.enable();
            }
        });

        view.cbEstado.on({
            select: function () {
                view.btnBuscar.enable()
            },
            keypress: function (field, e) {
                if (e.getKey() == 46 || e.getKey() == 8) {
                    field.clearValue();
                    if (view.tfNumero.getValue() == '') {
                        view.btnBuscar.disable();
                        model.stAnticipos.baseParams = {};
                        model.stAnticipos.baseParams.idcajafondo = scope.idCajaFondo;
                        model.stAnticipos.load();
                    }
                }
                if (e.getKey() == 13) {
                    view.btnBuscar.fireEvent('click');
                }
            }
        });

        view.btnBuscar.on({
            click: function (tf, e) {
                model.stAnticipos.baseParams = {
                    numero: view.tfNumero.getValue(),
                    idestado: view.cbEstado.getValue()
                }
                //model.stAnticipos.baseParams.idcajafondo = scope.idcajafondo;
                model.stAnticipos.reload();
            }
        });

        model.stAnticipos.on({
            scope: this,
            beforeload: function () {
                //this.scope.loadMask();
                model.stAnticipos.baseParams.idcajafondo = scope.idcajafondo;
            },
            load: function (options, records) {
                if (!options.baseParams.numero)
                    view.tfNumero.reset();
                if (!options.baseParams.idestado)
                    view.cbEstado.reset();
                if (!options.baseParams.idestado && !options.baseParams.numero)
                    view.btnBuscar.disable();
                //Mensaje cuando no encuentra datos al buscar
                if (!records.length) {
                    if (options.baseParams.numero && options.baseParams.idestado)
                        mostrarMensaje(1, etiquetas.lbNoDatosPorCriterios);
                    else if (options.baseParams.numero || options.baseParams.idestado)
                        mostrarMensaje(1, etiquetas.lbNoDatosPorCriterio);
                    else mostrarMensaje(1, etiquetas.lbNoDatos);
                }
            }
        });

        view.paginToolbar.on({
            beforechange: function () {
                model.stAnticipos.baseParams.idcajafondo = scope.idcajafondo;
            }
        })

        this.ClickAddAnticipo = function () {
            scope.showWindow('add');
        };
        this.ClickModAnticipo = function () {
            scope.showWindow('mod');
        };
        this.ClickAprobarAnticipo = function () {
            scope.showConfirm('aprobar');
        };
        this.ClickContabilizarAnticipo = function () {
            scope.showConfirmContabilizar('contabilizar');
        };
        this.ClickCancelarAnticipo = function () {
            scope.showCancelar();
        };

        view.btnEliminar.on({
            click: function () {
                var selecteds = view.smAnticipos.getSelections();
                if (selecteds.length > 0) {
                    var mensaje = (selecteds.length > 1)
                        ? '¿Est&aacute; seguro que quiere eliminar los anticipos de dietas seleccionados?'
                        : '¿Est&aacute; seguro que quiere eliminar el anticipos de dieta seleccionado?';

                    mostrarMensaje(2, mensaje, function (btnPress) {
                        if (btnPress === 'ok') {
                            scope.eliminarAnticipo(selecteds);
                            view.btnEliminar.focus();
                        }
                        view.btnEliminar.focus();
                    });
                }
            }

        });


        this.showConfirm = function (aprobar) {
            var selecteds = (aprobar === 'aprobar') ? view.smAnticipos.getSelections() : [scope.iddocumento];
            if (selecteds.length > 0) {
                var mensaje = (selecteds.length > 1)
                    ? '¿Est&aacute; seguro que quiere aprobar los anticipos de dietas seleccionados?'
                    : '¿Est&aacute; seguro que quiere aprobar el anticipos de dieta seleccionado?';
                var msgAprobar = (selecteds.length > 1)
                    ? 'Aprobando datos de los anticipos de dieta.'
                    : 'Aprobando datos del anticipos de dieta.';

                mostrarMensaje(2, mensaje, function (btnPress) {
                    if (btnPress === 'ok') {
                        Ext.Msg.wait(msgAprobar, 'Por favor espere...');
                        scope.aprobarAnticipo(selecteds, aprobar);
                        view.btnAdicionar.focus();
                    }
                    view.btnAdicionar.focus();
                });
            }
        };

        this.showCancelar = function () {
            var selecteds = view.smAnticipos.getSelections();
            if (selecteds.length > 0) {
                var mensaje = (selecteds.length > 1)
                    ? '¿Est&aacute; seguro que quiere cancelar los anticipos de dietas seleccionados?'
                    : '¿Est&aacute; seguro que quiere cancelar el anticipos de dieta seleccionado?';

                mostrarMensaje(2, mensaje, function (btnPress) {
                    if (btnPress === 'ok') {
                        scope.showWindowCancelar();
                        view.btnCancelar.focus();
                    }
                    view.btnCancelar.focus();
                });
            }
        };

        this.showConfirmContabilizar = function (contabilizar) {
            var selecteds = (contabilizar === 'contabilizar') ? view.smAnticipos.getSelections() : [scope.iddocumento];
            //var selecteds = view.smAnticipos.getSelections();
            if (selecteds.length > 0) {
                var mensaje = (selecteds.length > 1)
                    ? ' Esta operaci&oacute;n generar&aacute; asientos contables. ¿Est&aacute; seguro que quiere postear los anticipos de dietas seleccionados?'
                    : ' Esta operaci&oacute;n generar&aacute; asientos contables. ¿Est&aacute; seguro que quiere postear el anticipos de dieta seleccionado?';

                mostrarMensaje(2, mensaje, function (btnPress) {
                    if (btnPress === 'ok') {
                        Ext.Msg.wait('Mostrando comprobante de operaciones.', 'Por favor espere...');

                        scope.loadDataComprobante(selecteds, contabilizar, 'contabilizar');
                        view.btnAdicionar.focus();
                    }
                    view.btnAdicionar.focus();
                });
            }
        };

        this.showConfirmLiquidar = function (contabilizar) {
            if (scope.totalGasto == 0) {
                mostrarMensaje(1, 'Por favor, debe desglosar el importe a liquidar.');
                return;
            }
            var selecteds = view.smAnticipos.getSelections();
            //var selecteds = view.smAnticipos.getSelections();
            if (selecteds.length > 1) {
                var mensaje = 'Esta operaci&oacute;n generar&aacute; asientos contables. ¿Est&aacute; seguro que quiere liquidar los anticipos de dietas seleccionados?';
            }
            else {
                var mensaje = 'Esta operaci&oacute;n generar&aacute; asientos contables. ¿Est&aacute; seguro que quiere liquidar el anticipos de dieta seleccionado?';
            }

            mostrarMensaje(2, mensaje, function (btnPress) {
                if (btnPress === 'ok') {
                    Ext.Msg.wait('Mostrando comprobante de operaciones.', 'Por favor espere...');

                    scope.loadDataComprobante(selecteds, contabilizar, 'liquidar');
                    view.btnAdicionar.focus();
                }
                view.btnAdicionar.focus();
            });
        };

        this.cargandoSt = 1;
        this.showWindow = function (action) {
            scope.changed = false;
            view.Window(etiquetas, action, cargainicial);
            view.winAddMod.on({
                beforeshow: function () {
                    scope.diferencia = 0;
                    scope.totalGasto = 0;
                    scope.keyMap.disable();
                    scope.anticipoEvents(action);
                    scope.gastoEvents(action);
                    model.stOperaciones.load({
                        params: {
                            action: action,
                            idMoneda: scope.idMoneda
                        },
                        callback: function (records) {
                            if (records.length == 1) {
                                view.cbOperaciones.setValue(records[0].data.idnomoperaciones);
                                //Obtener centro de costo
                                if (action === 'liq') {
                                    view.stCuenta.baseParams.arrayIdCuenta = Ext.encode(records[0].data.cuentagasto);
                                    view.stCuenta.load();
                                    // view.stCuentaGasto.load({
                                    //     params: {
                                    //         arrayCuenta:  Ext.encode(records[0].data.cuentagasto)
                                    //     }
                                    // });
                                }
                            }
                            if(this.cargandoSt==1) this.cargandoSt--;
                            else{
                                var formArray = new Array();
                                formArray.push(view.fpanel);
                                var arrbotones = new Array();
                                arrbotones.push(view.btnAceptar);
                                arrbotones.push(view.btnAplicar);
                                scope.TaskFormValidation.stopTaskValidation();
                                scope.TaskFormValidation.startTaskValidation(action, formArray, arrbotones);
                            }
                        }
                    });
                    model.stInstrumento.load({
                        params: {
                            idMoneda: scope.idMoneda,
                            idinstrumento: action != 'add' ? view.smAnticipos.getSelected().json.idinstrumentobancario : null
                        },
                        callback: function (records) {
                            if (records.length == 1 && action === 'add')
                                view.cbInstrumento.setValue(records[0].data.iddocumento);
                            if (action === 'add' && !records.length) {
                                mostrarMensaje(1, 'No existen instrumentos bancarios para adicionar dietas al extranjero.');
                                //view.winAddMod.close();
                                return;
                            }
                            if(action != 'add'){
                                view.cbInstrumento.setValue(view.smAnticipos.getSelected().json.idinstrumentobancario);
                            }
                            if(this.cargandoSt==1) this.cargandoSt--;
                            else{
                                var formArray = new Array();
                                formArray.push(view.fpanel);
                                var arrbotones = new Array();
                                arrbotones.push(view.btnAceptar);
                                arrbotones.push(view.btnAplicar);
                                scope.TaskFormValidation.stopTaskValidation();
                                scope.TaskFormValidation.startTaskValidation(action, formArray, arrbotones);
                            }

                        }
                    });
                    //-----------------------------
                    if (action === 'mod') {
                        var selected = view.smAnticipos.getSelected();
                        scope.loadDataMod(selected);
                        view.btnAprobarAddMod.enable();
                    } else if (action === 'liq') {
                        var selected = view.smAnticipos.getSelected();
                        scope.loadDataMod(selected);
                        view.winAddMod.setTitle(etiquetas.lbModAnticipoViajLiq);
                        view.alimentacion.setDisabled(true);
                        view.hospedaje.setDisabled(true);
                        view.desayuno.setDisabled(true);
                        view.transporte.setDisabled(true);
                        view.cbpersona.setDisabled(true);
                        view.dffecha.setDisabled(true);
                        view.dffechaVence.setDisabled(true);
                        view.tflabor.setDisabled(true);
                        view.cbPais.setDisabled(true);
                        //view.cbOperaciones.setDisabled(true);
                        view.cbOperaciones.reset();
                        view.cbAutoriza.setDisabled(true);
                        view.cbAnota.setDisabled(true);
                        view.btnAprobarAddMod.setVisible(false);
                        view.btnContabilizarAddMod.setVisible(false);
                        view.cbInstrumento.disable()

                    }
                    if (cargainicial) {
                        view.btnAprobarAddMod.setVisible(false);
                        view.btnContabilizarAddMod.setVisible(false);
                    }

                }, show: function () {
                    view.cbpersona.focus(true, 10);
                }, close: function () {
                    view.btnAdicionar.focus();
                    model.stAnticipos.load();
                    view.smAnticipos.clearSelections();
                    scope.liquidar = false;
                    scope.keyMap.enable();

                }
            });
            view.winAddMod.show();
        };

        this.showWindowCancelar = function () {
            view.WindowCancelar(etiquetas, view.smAnticipos.getSelected().data.fechaemision);
            view.winCancelar.on({
                beforeshow: function () {
                    scope.keyMap.disable();
                    scope.cancelarEvents();
                    model.stMotivo.load();
                }, show: function () {
                    view.cbmotivo.focus(true, 10);
                }, destroy: function () {
                    scope.keyMap.enable();
                    view.btnAdicionar.focus();
                }
            });
            view.winCancelar.show();
        };

        this.anticipoEvents = function (action) {
            view.btnAddCerrar.on({
                click: function () {
                    view.winAddMod.destroy();
                    if (scope.changed)
                        model.stAnticipos.load();
                }
            });
            view.btnAplicar.on({
                click: function () {
                    if (!view.cbInstrumento.getValue()) {
                        mostrarMensaje(1, 'Por favor, debe seleccionar el instrumento para el viaje.');
                        return;
                    } else {
                        var index = model.stInstrumento.find('iddocumento', view.cbInstrumento.getValue());
                        var record = model.stInstrumento.getAt(index);
                        if (record.data.importe != view.totalAnt.getValue()) {
                            mostrarMensaje(1, 'El desglose del importe entregado debe ser igual al importe del instrumento.');
                            return;
                        }
                    }
                    scope.addmodAnticipo(action, true);
                    scope.limpiarCampos();
                }
            });
            view.btnAceptar.on({
                click: function () {
                    if (scope.liquidar) {
                        if (view.fpanel.getForm().isValid())
                            scope.showConfirmLiquidar();
                    }
                    else {
                        if (!view.cbInstrumento.getValue()) {
                            mostrarMensaje(1, 'Por favor, debe seleccionar el instrumento para el viaje.');
                            return;
                        } else {
                            var index = model.stInstrumento.find('iddocumento', view.cbInstrumento.getValue());
                            var record = model.stInstrumento.getAt(index);
                            if (record.data.importe != view.totalAnt.getValue()) {
                                mostrarMensaje(1, 'El desglose del importe entregado debe ser igual al importe del instrumento.');
                                return;
                            }
                        }
                        scope.addmodAnticipo(action, false);
                    }
                }
            });
            view.btnAprobarAddMod.on({
                click: function () {
                    scope.showConfirm('aprobarAddMod');
                }
            });
            view.btnContabilizarAddMod.on({
                click: function () {
                    scope.showConfirmContabilizar('contabilizarAddMod');
                }
            });
            view.alimentacion.on({
                keypress: function (tf, e) {
                    if (e.getKey() == 13) {
                        view.hospedaje.focus(true, 10);
                    }
                }, keyup: function (tf, e) {
                    scope.calcularAnt(e, this);
                    if (action === 'add') {
                        scope.validarFormAdd()
                    }
                },
                blur: function (tf, e) {
                    tf.setRawValue(formatoMoneda(tf.getValue()));
                }
            });
            view.alimentacionLiq.on({
                keypress: function (tf, e) {
                    if (e.getKey() == 13) {
                        view.hospedajeLiq.focus(true, 10);
                    }
                }, keyup: function (tf, e) {
                    scope.calcularLiq(e, this);
                },
                blur: function (tf, e) {
                    tf.setRawValue(formatoMoneda(tf.getValue()));
                }
            });
            view.hospedaje.on({
                keypress: function (tf, e) {
                    if (e.getKey() == 13) {
                        view.desayuno.focus(true, 10);
                    }
                }, keyup: function (tf, e) {
                    scope.calcularAnt(e, this);

                    if (action === 'add') {
                        scope.validarFormAdd();
                    }
                },
                blur: function (tf, e) {
                    tf.setRawValue(formatoMoneda(tf.getValue()));
                }
            });
            view.hospedajeLiq.on({
                keypress: function (tf, e) {
                    if (e.getKey() == 13) {
                        view.desayunoLiq.focus(true, 10);
                    }
                }, keyup: function (tf, e) {
                    scope.calcularLiq(e, this);
                },
                blur: function (tf, e) {
                    tf.setRawValue(formatoMoneda(tf.getValue()));
                }
            });
            view.desayuno.on({
                keypress: function (tf, e) {
                    if (e.getKey() == 13) {
                        view.transporte.focus(true, 10);
                    }
                }, keyup: function (tf, e) {
                    scope.calcularAnt(e, this);

                    if (action === 'add') {
                        scope.validarFormAdd();
                    }
                },
                blur: function (tf, e) {
                    tf.setRawValue(formatoMoneda(tf.getValue()));
                }
            });
            view.desayunoLiq.on({
                keypress: function (tf, e) {
                    if (e.getKey() == 13) {
                        view.transporteLiq.focus(true, 10);
                    }
                }, keyup: function (tf, e) {
                    scope.calcularLiq(e, this);
                },
                blur: function (tf, e) {
                    tf.setRawValue(formatoMoneda(tf.getValue()));
                }
            });
            view.transporte.on({
                keypress: function (tf, e) {
                    if (e.getKey() == 13) {
                        view.cbOperaciones.focus(true, 10);
                    }
                }, keyup: function (tf, e) {
                    scope.calcularAnt(e, this);

                    if (action === 'add') {
                        scope.validarFormAdd();
                    }
                },
                blur: function (tf, e) {
                    tf.setRawValue(formatoMoneda(tf.getValue()));
                }
            });
            view.transporteLiq.on({
                keypress: function (tf, e) {
                    if (e.getKey() == 13) {
                        view.cbOperaciones.focus(true, 10);
                    }
                }, keyup: function (tf, e) {
                    scope.calcularLiq(e, this);
                },
                blur: function (tf, e) {
                    tf.setRawValue(formatoMoneda(tf.getValue()));
                }
            });

            view.cbpersona.on({
                keypress: function (tf, e) {
                    if (e.getKey() == 13) {
                        view.dffecha.focus(true, 10);
                    }
                }, select: function () {
                    if (action === 'add') {
                        scope.validarFormAdd();
                    }
                }
            });

            view.dffecha.on({
                keypress: function (tf, e) {
                    if (e.getKey() == 13) {
                        view.dffechae.focus(true, 10);
                    }
                }, blur: function () {
                    if (action === 'add') {
                        scope.validarFormAdd();
                    }
                }
            });
            view.dffechae.on({
                keypress: function (tf, e) {
                    if (e.getKey() == 13) {
                        view.clocktime.focus(true, 10);
                    }
                }, blur: function () {
                    if (action === 'add') {
                        scope.validarFormAdd();
                    }
                }
            });
            view.clocktime.on({
                keypress: function (tf, e) {
                    if (e.getKey() == 13) {
                        view.dffecharegreso.focus(true, 10);
                    }
                }, select: function () {
                    if (action === 'add') {
                        scope.validarFormAdd();
                    }
                }
            });
            view.dffecharegreso.on({
                keypress: function (tf, e) {
                    if (e.getKey() == 13) {
                        view.clocktimeregreso.focus(true, 10);
                    }
                }, blur: function () {
                    if (action === 'add') {
                        scope.validarFormAdd();
                    }
                }
            });
            view.clocktimeregreso.on({
                keypress: function (tf, e) {
                    if (e.getKey() == 13) {
                        view.tflabor.focus(true, 10);
                    }
                }, select: function () {
                    if (action === 'add') {
                        scope.validarFormAdd();
                    }
                }
            });
            view.tflabor.on({
                keypress: function (tf, e) {
                    if (e.getKey() == 13) {
                        view.dffechaVence.focus(true, 10);
                    }
                }, keyup: function () {
                    if (action === 'add') {
                        scope.validarFormAdd();
                    }
                }
            });
            view.dffechaVence.on({
                keypress: function (tf, e) {
                    if (e.getKey() == 13) {
                        view.alimentacion.focus(true, 10);
                    }
                }, blur: function () {
                    if (action === 'add') {
                        scope.validarFormAdd();
                    }
                }
            });
            view.cbOperaciones.on({
                keypress: function (tf, e) {
                    if (e.getKey() == 13) {
                        view.cbAutoriza.focus(true, 10);
                    }
                }, select: function (cb, record) {
                    if (action === 'add') {
                        scope.validarFormAdd();
                    }
                    //Obtener centro de costo
                    if (action === 'liq') {
                        this.stCuenta.baseParams.arrayIdCuenta = Ext.encode(records[0].data.cuentagasto);
                        this.stCuenta.load();
                    }
                    // view.stCuentaGasto.load({
                    //     params: {
                    //         arrayCuenta:  Ext.encode(records[0].data.cuentagasto)
                    //     }
                    // });
                }
            });
            view.cbAutoriza.on({
                keypress: function (tf, e) {
                    if (e.getKey() == 13) {
                        view.cbAnota.focus(true, 10);
                    }
                }, select: function () {
                    if (action === 'add') {
                        scope.validarFormAdd();
                    }
                }
            });
            view.cbAnota.on({
                keypress: function (tf, e) {
                    if (e.getKey() == 13) {
                        view.cantDias.focus(true, 10);
                    }
                }, select: function () {
                    if (action === 'add') {
                        scope.validarFormAdd();
                    }
                }
            });
            view.cantDias.on({
                keypress: function (tf, e) {
                    if (e.getKey() == 13) {
                        view.btnAceptar.focus();
                    }
                }, keyup: function () {
                    if (action === 'add') {
                        scope.validarFormAdd();
                    }
                }
            });
        };

        this.gastoEvents = function (action) {
            var me = this;
            view.roweditor.on({
                scope: this,
                // oninitsetvalue: function (roweditor, field, record) {
                //     if (field.id === 'cbEGasto') {
                //         field.setValue(record.data.idcuentagasto, record.data.text);
                //         return false;
                //     }
                // },
                afteredit: function (editor, grid, changes, record, rowIndex) {
                    // view.btnAceptar.enable();
                    me.calcularDiferenciaGasto();
                    // view.gpAnexoGasto.getStore().commitChanges();
                },
                beforeedit: function (roweditor, grid, record, rowIndex) {
                    //if (record.data.idcuentagasto != '') {
                        var lodMask = new Ext.LoadMask(view.winAddMod.body, {msg:"Cargando..."});
                        /*view.stCCosto.baseParams = {'idCuenta': record.data.idcuentagasto};
                        view.stCCosto.load({
                            callback: function () {
                                view.cbCCosto.setValue(record.data.idcuentaccosto);
                                view.stEGasto.baseParams = {'idcuenta': record.data.idcuentaccosto};
                                view.stEGasto.load({
                                    callback: function () {
                                        var index = view.stEGasto.find('idcuentaelemento', record.data.idcuentaelemento);
                                        if (index >= 0) {
                                            view.cbEGasto.setValue(record.data.idcuentaelemento, view.stEGasto.getAt(index).data.text);
                                        }
                                        lodMask.hide();
                                    }
                                });
                            }
                        });*/
                    //} else {
                        // view.cbEGasto.disable();
                        // view.nfImporte.disable();
                   // }
                    // record.data.text = this.cbEGasto.displayFieldTemp;
                }
            });

            view.rowaction.on('action', function (grid, record, action, rowIndex, col, e) {
                switch (action) {
                    case 'eliminar':
                        mostrarMensaje(2, etiquetas.lbPregEliminarGasto, function (btnPress) {
                            if (btnPress === 'ok') {
                                var seleccionado = view.gpAnexoGasto.getSelectionModel().getSelected();
                                view.gpAnexoGasto.getStore().remove(seleccionado);
                                me.calcularDiferenciaGasto();
                            }
                        });
                        break;
                }
            });

        };

        this.cancelarEvents = function () {
            view.btnCancelarCerrar.on({
                click: function () {
                    view.winCancelar.destroy();
                }
            });
            view.btnCancelarAceptar.on({
                click: function () {
                    var selecteds = view.smAnticipos.getSelections();
                    if (!scope.estadosDiferentes() && selecteds[0].data.idestado == 6)
                        scope.loadDataComprobante(selecteds, '', 'cancelar');
                    else scope.cancelarOtros(selecteds);
                }
            });
            view.cbmotivo.on({
                select: function () {
                    view.btnCancelarAceptar.setDisabled(!view.fpCancelar.getForm().isValid());
                }
            });
            view.dffechacancelacion.on({
                blur: function () {
                    view.btnCancelarAceptar.setDisabled(!view.fpCancelar.getForm().isValid());
                }
            });
        };

        this.addmodAnticipo = function (action, aplicar) {

            if (view.fpanel.getForm().isValid()) {
                Ext.Msg.wait('Guardando datos del anticipos de dietas.', 'Por favor espere...');
                var anticipo = [];
                var selected = view.smAnticipos.getSelected();
                anticipo.push({
                    idpersona: view.cbpersona.getValue(),
                    fechaEmision: view.dffecha.getRawValue(),
                    cantDias: view.cantDias.getRawValue(),
                    cantDiasHosp: view.cantDiasHosp.getRawValue(),
                    fechaSalida: view.dffechae.getRawValue(),
                    horaSalida: view.clocktime.getValue(),
                    fechaRegreso: view.dffecharegreso.getRawValue(),
                    horaRegreso: view.clocktimeregreso.getRawValue(),
                    labor: view.tflabor.getValue(),
                    fechaVence: view.dffechaVence.getRawValue(),
                    operacion: view.cbOperaciones.getValue(),
                    autoriza: view.cbAutoriza.getValue(),
                    anota: view.cbAnota.getValue(),
                    alimentacion: Ext.isEmpty(view.alimentacion.getValue()) ? 0 : view.alimentacion.getValue(),
                    hospedaje: Ext.isEmpty(view.hospedaje.getValue()) ? 0 : view.hospedaje.getValue(),
                    desayunouotros: Ext.isEmpty(view.desayuno.getValue()) ? 0 : view.desayuno.getValue(),
                    transporte: Ext.isEmpty(view.transporte.getValue()) ? 0 : view.transporte.getValue(),
                    total: cleanComa(view.totalAnt.getRawValue()),
                    idDocInstrumento: view.cbInstrumento.getValue(),
                    idMonedaEntidad: scope.idMonedaEntidad,
                    idfondo: scope.idCbFondo,
                    idcaja: scope.idCbCaja,
                    idcajafondo: scope.idcajafondo,
                    numTalonario: view.numTal.getValue(),
                    idPais: view.cbPais.getValue()
                });

                Ext.Ajax.request({
                    url: 'guardarAnticipo',
                    method: 'POST',
                    params: {
                        idmovimiento: (action === 'mod') ? selected.json.idmovimiento : -1,
                        iddocumento: (action === 'mod') ? selected.json.iddocumento : -1,
                        idestado: (action === 'mod') ? selected.json.idestado : -1,
                        importemoViejo: (action === 'mod') ? selected.json.importemo : -1,
                        importembViejo: (action === 'mod') ? selected.json.importemb : -1,
                        anticipo: Ext.encode(anticipo),
                        idCaja: scope.idcaja,
                        idAntViajeExtPais: (action === 'mod') ? selected.json.idanticipoviajeextranjeropais : -1,
                        idmovimientocaja: (action === 'mod') ? selected.json.idmovimientocaja : -1,
                        cargaInicial: cargainicial
                    },
                    callback: function (options, success, response) {
                        Ext.Msg.hide();
                        scope.changed = true;
                        responseData = Ext.decode(response.responseText);
                        if (responseData.codMsg == 1)
                            mostrarMensaje(1, responseData.mensaje);
                        else if (responseData.codMsg == -1) {
                            mostrarMensaje(1, responseData.mensaje);
                            return;
                        }else if(responseData.codMsg == -2){
                            mostrarMensaje(1, etiquetas.msgAnticipoSinLiquidar);
                            return;
                        }
                        if (!aplicar) {
                            view.winAddMod.close();
                        }
                        scope.iddocumento = responseData.iddocumento;
                    }
                });
            }
        };

        this.aprobarAnticipo = function (selecteds, aprobar) {
            var iddocumentos = Array();
            var msg = (selecteds.length > 1)
                ? 'Los anticipos de dieta han sido aprobados satisfactoriamente.'
                : 'El anticipos de dieta ha sido aprobado satisfactoriamente.';
            if (aprobar === 'aprobar') {
                for (var i = 0; i < selecteds.length; i++)
                    iddocumentos.push(selecteds[i].json.iddocumento);
            } else
                iddocumentos.push(scope.iddocumento);

            Ext.Ajax.request({
                url: 'aprobar',
                method: 'POST',
                params: {
                    iddocumentos: Ext.encode(iddocumentos)
                },
                callback: function (options, success, response) {
                    Ext.Msg.hide();
                    responseData = Ext.decode(response.responseText);
                    if (aprobar === 'aprobar')
                        model.stAnticipos.load({
                            callback: function () {
                                mostrarMensaje(responseData.codMsg, msg);
                            }
                        });
                    else {
                        mostrarMensaje(responseData.codMsg, msg);
                        view.btnAprobarAddMod.disable();
                        view.btnContabilizarAddMod.enable();
                        view.btnAceptar.disable();
                        view.fpanel.disable();
                        view.cantDias.disable();
                        view.total.disable();
                    }

                }
            });
        };

        this.eliminarAnticipo = function (selecteds) {
            var arrayIdAnticipo = Array();
            var arrayIdDoc = Array();
            var msg = (selecteds.length > 1)
                ? 'Los anticipos de dieta han sido eliminados satisfactoriamente.'
                : 'El anticipos de dieta ha sido eliminado satisfactoriamente.';

            for (var i = 0; i < selecteds.length; i++) {
                arrayIdAnticipo.push(selecteds[i].json.idmovimiento);
                arrayIdDoc.push(selecteds[i].json.iddocumento);
            }

            Ext.Ajax.request({
                url: 'eliminar',
                method: 'POST',
                params: {
                    arrayIdAnticipo: Ext.encode(arrayIdAnticipo),
                    arrayIdDoc: Ext.encode(arrayIdDoc),
                    idCajaFondo: scope.idcajafondo
                },
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    model.stAnticipos.load({
                        callback: function () {
                            mostrarMensaje(1, msg);
                        }
                    });
                }
            });
        };

        this.loadDataComprobante = function (selecteds, contabilizar, tipo) {
            var data = Array();
            var iddoc = Array();
            var dataLiquidar = {};
            var otherParams = {};

            if (contabilizar === 'contabilizarAddMod' || tipo === 'liquidar') {
                data.push({
                    iddocumento: String(scope.iddocumento),
                    idoperacion: view.cbOperaciones.getValue()
                });
                iddoc.push(String(scope.iddocumento));
            } else {
                for (var i = 0; i < selecteds.length; i++) {
                    data.push({
                        iddocumento: selecteds[i].json.iddocumento,
                        idoperacion: selecteds[i].json.idoperacion
                    });
                    iddoc.push(selecteds[i].json.iddocumento);
                }
            }

            if (tipo === 'cancelar') {
                otherParams.idsMov = iddoc;
                otherParams.idmotivo = view.cbmotivo.getValue();
                otherParams.fechacancelacion = view.dffechacancelacion.getRawValue();
            }

            if (tipo === 'liquidar') {
                dataLiquidar.idDocumento = iddoc[0];
                dataLiquidar.numDoc = selecteds[0].json.numero;
                dataLiquidar.totalLiq = cleanComa(view.totalLiq.getRawValue());
                dataLiquidar.diferencia = scope.diferencia;
                dataLiquidar.idAnticipoNacional = selecteds[0].json.idmovimiento;
                dataLiquidar.operacion = view.cbOperaciones.getValue();
                dataLiquidar.autoriza = view.cbAutoriza.getValue();
                dataLiquidar.anota = view.cbAnota.getValue();
                dataLiquidar.fechaLiq = view.dffechaLiq.getRawValue();
                dataLiquidar.totalLiq = 0;

                // dataLiquidar.alimentacionLiq = Ext.isEmpty(view.alimentacionLiq.getValue()) ? 0 : view.alimentacionLiq.getValue();
                // dataLiquidar.hospedajeLiq = Ext.isEmpty(view.hospedajeLiq.getValue()) ? 0 : view.hospedajeLiq.getValue();
                // dataLiquidar.desayunoLiq = Ext.isEmpty(view.desayunoLiq.getValue()) ? 0 : view.desayunoLiq.getValue();
                // dataLiquidar.transporteLiq = Ext.isEmpty(view.transporteLiq.getValue()) ? 0 : view.transporteLiq.getValue();

                dataLiquidar.fechaSalida = view.dffechaeLiq.getRawValue();
                dataLiquidar.fechaRegreso = view.dffecharegresoLiq.getRawValue();
                dataLiquidar.horaSalida = view.clocktimeLiq.getRawValue();
                dataLiquidar.horaRegreso = view.clocktimeregresoLiq.getRawValue();
                dataLiquidar.diasViaje = view.cantDiasLiq.getRawValue();
                dataLiquidar.diasHospedado = view.cantDiasLiqHosp.getRawValue();
                //Registro de gasto----------------------------------
                var arrayPaseGasto = [];
                var totalGasto = 0;
                var arrayData = view.gpAnexoGasto.getStore().getRange();
                for (var i = 0; i < arrayData.length; i++) {
                    arrayPaseGasto.push({
                        // idcuentagasto: arrayData[i].data.idcuentagasto,
                        // idcuentaccosto: arrayData[i].data.idcuentaccosto,
                        // textcuentaccosto: arrayData[i].data.textcuentaccosto,
                        // textcuentaelemento: arrayData[i].data.textcuentaelemento,
                        idcuentaelemento: arrayData[i].data.idcuentaelemento,
                        importemo: arrayData[i].data.importemo
                    });
                    totalGasto += arrayData[i].data.importemo;
                }
                dataLiquidar.totalLiq = totalGasto;
                //--------------------
            }

            Ext.Ajax.request({
                url: 'loadDataComprobante',
                method: 'POST',
                params: {
                    tipo: tipo,
                    diferencia: scope.diferencia,
                    idCajaFondo: scope.idcajafondo,
                    data: Ext.encode(data),
                    arrayPaseGasto: Ext.encode(arrayPaseGasto),
                },
                callback: function (options, success, response) {
                    // Ext.Msg.hide();
                    responseData = Ext.decode(response.responseText);

                    if (tipo === 'cancelar')
                        view.winCancelar.destroy();

                    Ext.Cont.Comprobante.init(responseData.datos.subsistema, responseData.datos.detalle, responseData.datos.descripcion, responseData.datos.fechaCont, responseData.datos.dataComprobante, 3, 1, 1).onSaved(function (idComprobant, numComprobant, fecha) {
                        if (idComprobant) {
                            Ext.Msg.wait('Guardando datos.', 'Por favor espere...');
                            var msg = (tipo === 'cancelar')
                                ? 'Cancelaci&oacute;n satisfactoria registrada en el comprobante ' + numComprobant
                                : 'Posteo satisfactorio registrado en el comprobante ' + numComprobant;
                            if (tipo === 'liquidar')
                                msg = 'Liquidación satisfactoria registrada en el comprobante ' + numComprobant;
                            Ext.Ajax.request({
                                url: tipo,
                                method: 'POST',
                                params: {
                                    arrayIdDoc: Ext.encode(iddoc),
                                    idComprobante: idComprobant,
                                    numComprobante: numComprobant,
                                    fechaComprobante: fecha,
                                    contabilizado: (tipo === 'cancelar') ? 1 : 0,
                                    otherParams: Ext.encode(otherParams),
                                    dataLiquidar: Ext.encode(dataLiquidar),
                                    idMonedaEntidad: scope.idMonedaEntidad,
                                    idcajafondo: scope.idcajafondo,
                                    arrayGasto: Ext.encode(arrayPaseGasto)
                                },
                                callback: function (options, success, response) {
                                    //if (view.btnContabilizarAddMod)
                                    //    view.btnContabilizarAddMod.disable();
                                    if (tipo === 'liquidar')
                                        view.winAddMod.close();
                                    view.smAnticipos.clearSelections();
                                    model.stAnticipos.load({
                                        callback: function () {
                                            mostrarMensaje(1, msg);
                                        }
                                    });
                                    Ext.Msg.hide();
                                    // mostrarMensaje(1, msg);
                                }
                            });
                        }
                    });
                }
            });
        };

        this.cancelarOtros = function (selecteds) {
            var data = Array();
            var iddoc = Array();

            var otherParams = {};
            otherParams.idmotivo = view.cbmotivo.getValue();
            otherParams.fechacancelacion = view.dffechacancelacion.getRawValue();

            for (var i = 0; i < selecteds.length; i++) {
                data.push({
                    iddocumento: selecteds[i].json.iddocumento,
                    idoperacion: selecteds[i].json.idoperacion,
                });
                iddoc.push(selecteds[i].json.iddocumento);
            }

            Ext.Ajax.request({
                url: 'cancelar',
                method: 'POST',
                params: {
                    arrayIdDoc: Ext.encode(iddoc),
                    contabilizado: 0,
                    otherParams: Ext.encode(otherParams)
                },
                callback: function (options, success, response) {
                    model.stAnticipos.load({
                        callback: function () {
                            if (iddoc.length > 1)
                                mostrarMensaje(1, 'Los anticipos de dietas seleccionados han sidos cancelados satisfactoriamente.');
                            else
                                mostrarMensaje(1, 'El anticipos de dieta seleccionado ha sido cancelado satisfactoriamente.');
                        }
                    });
                }
            });
            view.winCancelar.destroy();
        };

        this.loadDataMod = function (data) {
            view.numTal.setValue(data.json.numeroMostrar);
            var datosPerMod = {datos: [{idpersona: data.json.idpersona, nombre: data.json.fullname}]};
            model.stPersona.loadData(datosPerMod);
            view.cbpersona.setValue(data.json.idpersona);
            //view.cbpersona.setRawValue(data.json.fullname);

            view.dffecha.setRawValue(data.json.fechaemision);
            view.dffechae.setRawValue(data.json.fechasalida);
            view.dffecharegreso.setRawValue(data.json.fecharegreso);
            view.dffechaVence.setRawValue(data.json.fechavencimiento);

            view.clocktime.setRawValue(data.json.horaviaje);
            view.clocktimeregreso.setRawValue(data.json.horaregreso);

            view.tflabor.setValue(data.json.laborarealizar);
            view.alimentacion.setRawValue(formatoMoneda(data.json.alimentacion));
            view.hospedaje.setRawValue(formatoMoneda(data.json.hospedaje));
            view.desayuno.setRawValue(formatoMoneda(data.json.desayunoyotros));
            view.transporte.setRawValue(formatoMoneda(data.json.transporte));
            view.cantDias.setValue(data.json.diasestimadoviaje);
            view.cantDiasHosp.setValue(data.json.diasestimadohospedado);
            view.totalAnt.setRawValue(formatoMoneda(data.json.importemo));
            //view.total.setRawValue(formatoMoneda(data.json.importemb));

            view.cbPais.setValue(data.json.idpais);
            view.cbOperaciones.setValue(data.json.idoperacion);
            view.cbOperaciones.setRawValue(data.json.operacion);

            //var datosAutMod = {datos: [{idpersona: data.json.idautoriza, nombre: data.json.autoriza}]};
            //model.stAutoriza.loadData(datosAutMod);
            view.cbAutoriza.setValue(data.json.idautoriza);
            view.cbAutoriza.setRawValue(data.json.autoriza);

            var datosAnotaMod = {datos: [{idpersona: data.json.idanota, nombre: data.json.anota}]};
            view.cbAnota.store.loadData(datosAnotaMod);
            view.cbAnota.setValue(data.json.idanota);
            view.cbAnota.setRawValue(data.json.anota);

            scope.iddocumento = data.json.iddocumento;
        };

        this.validarFormAdd = function () {
        //    view.btnAceptar.setDisabled(!view.fpanel.getForm().isValid() || Ext.isEmpty(view.cantDias.getValue()));
        };

      /*  this.desabilitarForm = function (action, selected) {
            view.btnAceptar.disable();
            view.fpanel.disable();
            view.cantDias.disable();
            view.total.disable();
            if (action === 'mod') {
                if (selected.json.idestado == 8) {
                    view.btnAprobarAddMod.enable();
                    view.btnAprobarAddMod.focus();
                } else if (selected.json.idestado == 2) {
                    view.btnContabilizarAddMod.enable();
                    view.btnContabilizarAddMod.focus();
                }
            } else {
                view.btnAprobarAddMod.enable();
                view.btnAprobarAddMod.focus();
            }
        };*/

        this.actualizarBotones = function () {
            if (!view.smAnticipos.hasSelection() || scope.estadosDiferentes()) {
                view.btnModificar.disable();
                view.btnCancelar.disable();
                view.btnAprobar.disable();
                view.btnConfirmar.disable();
                view.btnContabilizar.disable();
                view.btnLiquidar.disable();
            } else {
                if (scope.todosGuardados()) {
                    if (view.smAnticipos.selections.length > 1)
                        view.btnModificar.disable();
                    else
                        view.btnModificar.enable();
                    view.btnCancelar.enable();
                    view.btnAprobar.enable();
                    view.btnConfirmar.disable();
                    view.btnContabilizar.disable();
                    view.btnLiquidar.disable();
                }
                if (scope.todosAprobados()) {
                    view.btnModificar.disable();
                    view.btnAprobar.disable();
                    view.btnConfirmar.disable();
                    view.btnCancelar.enable();
                    view.btnContabilizar.enable();
                    view.btnLiquidar.disable();
                }
                if (scope.todosConfirmados()) {
                    view.btnModificar.disable();
                    view.btnCancelar.enable();
                    view.btnAprobar.disable();
                    view.btnConfirmar.disable();
                    view.btnContabilizar.enable();
                    view.btnLiquidar.disable();
                }
                if (scope.todosContabilizados()) {
                    view.btnCancelar.enable();
                    view.btnLiquidar.enable();
                    view.btnModificar.disable();
                    view.btnAprobar.disable();
                    view.btnConfirmar.disable();
                    view.btnContabilizar.disable();
                }
            }
            //Caso de Carga Inicial
            if (cargainicial && view.smAnticipos.selections.length > 0) {
                view.btnEliminar.enable();
            } else view.btnEliminar.disable();

        };

        this.estadosDiferentes = function () {
            if (view.smAnticipos.selections.length > 1) {
                for (var i = 0; i < view.smAnticipos.selections.length - 1; i++) {
                    if (view.smAnticipos.getSelections()[i].data.idestado != view.smAnticipos.getSelections()[i + 1].data.idestado)
                        return true;
                }
                return false;
            }
            return;
        };

        this.todosGuardados = function () {
            for (var i = 0; i < view.smAnticipos.getCount(); i++)
                if (view.smAnticipos.getSelections()[i].data.idestado != 8)
                    return false;
            return true;
        };

        this.todosAprobados = function () {
            for (var i = 0; i < view.smAnticipos.getCount(); i++)
                if (view.smAnticipos.getSelections()[i].data.idestado != 2)
                    return false;
            return true;
        };

        this.todosConfirmados = function () {
            for (var i = 0; i < view.smAnticipos.getCount(); i++)
                if (view.smAnticipos.getSelections()[i].data.idestado != 5)
                    return false;
            return true;
        };

        this.todosContabilizados = function () {
            for (var i = 0; i < view.smAnticipos.getCount(); i++)
                if (view.smAnticipos.getSelections()[i].data.idestado != 6)
                    return false;
            return true;
        }

        this.limpiarCampos = function () {
            view.fpanel.getForm().reset();
            view.cantDias.reset();
            view.total.reset();
        };

        this.calcularAnt = function (e, tf) {
            //if ((e.getKey() == 8) || (e.getKey() == 46))  // suprimir y borrar
            //    if (Ext.isEmpty(tf.getValue()))
            //        tf.setValue(0);
            var tempAlimentacion = 0;
            var tempHospedaje = 0;
            var tempDesayuno = 0;
            var tempTransporte = 0;

            if (!Ext.isEmpty(view.alimentacion.getValue()))
                tempAlimentacion = view.alimentacion.getValue();
            if (!Ext.isEmpty(view.hospedaje.getValue()))
                tempHospedaje = view.hospedaje.getValue();
            if (!Ext.isEmpty(view.desayuno.getValue()))
                tempDesayuno = view.desayuno.getValue();
            if (!Ext.isEmpty(view.transporte.getValue()))
                tempTransporte = view.transporte.getValue();

            view.totalAnt.setRawValue(formatoMoneda(parseFloat(tempAlimentacion) + parseFloat(tempHospedaje) + parseFloat(tempDesayuno) + parseFloat(tempTransporte)));
        };

        this.calcularLiq = function (e, tf) {
            var tempAlimentacion = 0;
            var tempHospedaje = 0;
            var tempDesayuno = 0;
            var tempTransporte = 0;

            if (!Ext.isEmpty(view.alimentacionLiq.getValue()))
                tempAlimentacion = view.alimentacionLiq.getValue();
            if (!Ext.isEmpty(view.hospedajeLiq.getValue()))
                tempHospedaje = view.hospedajeLiq.getValue();
            if (!Ext.isEmpty(view.desayunoLiq.getValue()))
                tempDesayuno = view.desayunoLiq.getValue();
            if (!Ext.isEmpty(view.transporteLiq.getValue()))
                tempTransporte = view.transporteLiq.getValue();

            view.totalLiq.setRawValue(formatoMoneda(parseFloat(tempAlimentacion) + parseFloat(tempHospedaje) + parseFloat(tempDesayuno) + parseFloat(tempTransporte)));
            scope.calcularDiferencia();
        };

        this.calcularDiferencia = function () {
            scope.diferencia = cleanComa(view.totalAnt.getRawValue()) - cleanComa(view.totalLiq.getRawValue())
            //view.total.setRawValue(formatoMoneda(dif));

            if (scope.diferencia < 0)
                view.labelDiferencia.setText('Diferencia de importe a entregar: ' + formatoMoneda(scope.diferencia));
            else if (scope.diferencia > 0)
                view.labelDiferencia.setText('Diferencia de importe a devolver: ' + formatoMoneda(scope.diferencia));
            else
                view.labelDiferencia.setText('');
        };

        this.calcularDiferenciaGasto = function () {
            var importeTotalG = 0;
            for (var i = 0; i < view.gpAnexoGasto.getStore().getCount(); i++) {
                importeTotalG += parseFloat(Math.abs(view.gpAnexoGasto.getStore().getAt(i).data.importemo));
            }
            view.labelTotal.setText(formatoMoneda(importeTotalG))

            scope.diferencia = cleanComa(view.totalAnt.getRawValue()) - importeTotalG;
            scope.totalGasto = importeTotalG;

            if (scope.diferencia < 0)
                view.labelDiferencia.setText('Importe a entregar: ' + formatoMoneda(Math.abs(scope.diferencia)));
            else if (scope.diferencia > 0)
                view.labelDiferencia.setText('Importe a devolver: ' + formatoMoneda(Math.abs(scope.diferencia)));
            else
                view.labelDiferencia.setText('');
        };

        /**
         * Funcion que coloca una mascara
         */
        this.MostrarMascara = function (mensaje) {
            loadMask = new Ext.LoadMask(Ext.getBody(), {
                msg: mensaje
            });
            loadMask.show();
        };



//Teclas calientes--------------------------------
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
                    if (!view.btnEliminar.disabled && cargainicial)
                        view.btnEliminar.fireEvent('click');
                }
            }, {
                key: "x",
                alt: true,
                scope: this,
                fn: function () {
                    if (!view.btnCancelar.disabled)
                        view.btnCancelar.fireEvent('click');
                }
            }, {
                key: 'a',
                alt: true,
                scope: this,
                ctrl: true,
                fn: function () {
                    if (!view.btnAprobar.disabled)
                        view.btnAprobar.fireEvent('click');
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
                key: "l",
                alt: true,
                scope: this,
                fn: function () {
                    if (!view.btnLiquidar.disabled)
                        view.btnLiquidar.fireEvent('click');
                }
            }, {
                key: "b",
                alt: true,
                scope: this,
                fn: function () {
                    if (!view.btnBuscar.disabled)
                        view.btnBuscar.fireEvent('click');
                }
            }
        ]);
        scope.keyMap.disable();
    }
};