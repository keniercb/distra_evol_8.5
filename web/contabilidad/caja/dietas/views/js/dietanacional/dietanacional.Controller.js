/**
 * GestionarAnticipoDienta.Controller
 *
 * @author Ing. Roberto Linares Zamora
 * @author Ing. Alejandro Mengana
 * @version 1.0
 */
Ext.ns('Caja.DietaNacional');
Caja.DietaNacional.Controller = {
    init: function (perfil, etiquetas, view, model, cargainicial, dataAnota) {
        var scope = this;
        this.changed = false;
        this.liquidar = false;
        this.diferencia = 0;
        this.TaskFormValidation = TaskFormValidation;
        this.isLiquidacion = 0;

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
                showWinMod: (scope.idfondo != undefined) ? true : false,
                tipoMov: [1] // 1- Pagos menosres
            });

            objMiWin.btnCancelar.on('click', function () {
                objMiWin.close();
            });

            objMiWin.on({
                scope: this,
                show: function () {
                    scope.keyMap.disable();

                    if (btnfondo) {
                        this.closeMask();
                    } else {
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
                    scope.idMonedaEntidad = objMiWin.idMonedaEntidad;
                    scope.idMoneda = objMiWin.idMoneda;
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
                    view.paginToolbar.changePage(0);
                    model.stAnticipos.load();
                    view.btnAdicionar.focus(true, 100);

                    Ext.Ajax.request({
                        url: "/contabilidad/caja/tarjetaotros/index.php/tarjetaotros/cargartarjetas",
                        params: {
                            'idCaja': scope.idcaja
                        },
                        callback: function (options, success, response) {
                            var responseData = Ext.decode(response.responseText);
                            if (responseData.datos.length > 0) {
                                scope.mostrarIslaAzul = true;
                                view.gridAnticipo.getColumnModel().setHidden(9, false);
                            }
                        }
                    });
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
            if ((record.json.idestado == 6 && record.json.tipodieta == 2) || record.json.idestado == 9) { //Contabilizado si es Liquidacion directa o Liquidado so es anticipo
                return 'FilaVerde';
            } else if (record.json.idestado == 7) { //Cancelado
                return 'FilaRoja';
            }
        };

        view.gridAnticipo.on({
            scope: this,
            rowdblclick: function (grid, row, event) {
                var record = grid.getStore().getAt(row);
                if (record) {
                    var estado = record.get('idestado');
                    var tipodieta = record.get('tipodieta');
                    if (estado == 8) {
                        if (!view.btnModificar.disabled)
                            view.btnModificar.fireEvent('click');
                    } else {
                        scope.showWindow('ver', tipodieta, true);
                    }
                }
            }
        });

        view.rowaction.on({
            action: function (grid, recordarray, icon, rowindex, colindex) {
                fShowReporteComprobante();
            },
            beforeaction: function (grid, rowIndex) {
            }
        });

        fShowReporteComprobante = function () {
            // Ext.Msg.wait(scope.etiquetas.lbCargando, scope.etiquetas.lbEspere);
            Ext.Msg.wait('Cargando...', 'Espere');
            var arrayIdCmp = view.smAnticipos.getSelected().json.arrayIdCmp;

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

        view.smAnticipos.on({
            rowselect: function (smodel, rowIndex, record) {
                scope.actualizarBotones();
                //Para el caso de CI----------------------------------------------
                if (view.smAnticipos.getSelected().data.cargainicial == 1 && cargainicial == 0) {
                    view.btnModificar.disable();
                    view.btnConfirmar.disable();
                    view.btnCancelar.disable();
                    view.btnContabilizar.disable();
                    view.btnEliminar.disable();
                }
                if (view.smAnticipos.getSelected().data.cargainicial == 1 && cargainicial == 1) {
                    view.btnModificar.enable();
                    view.btnEliminar.enable();
                }
                //Para unificacion/Permitir liquidar los documentos unificados
                if (view.smAnticipos.getSelected().data.idestado == 12)//12-Unificado
                    view.btnLiquidar.enable();
                //------------------------
                view.gridAnticipo.getView().addRowClass(rowIndex, "negrita");
            }, rowdeselect: function (smodel, rowIndex, record) {
                scope.actualizarBotones();
                view.gridAnticipo.getView().removeRowClass(rowIndex, "negrita");
            },
            selectionchange: function (selectionModel) {
                if (!selectionModel.hasSelection()) {
                    view.btnModificar.disable();
                    view.btnConfirmar.disable();
                    view.btnCancelar.disable();
                    view.btnContabilizar.disable();
                    view.btnEliminar.disable();
                }
            }
        });

        // if (cargainicial) {
        //     view.btnAdicionar.on('click', function () {
        //         scope.ClickAddAnticipo(1);
        //     });
        // }
        view.btnAddAnt.on('click', function () {
            scope.ClickAddAnticipo(1);
        });
        view.btnAddLiq.on('click', function () {
            scope.ClickAddAnticipo(2);
        });

        view.btnModificar.on('click', function () {
            scope.ClickModAnticipo();
        });
        view.btnConfirmar.on('click', function () {
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

        view.btnReporte.on({
            click: function () {
                scope.fShowReporte();
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
                } else view.btnBuscar.enable();
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
                        // model.stAnticipos.baseParams.idcajafondo = scope.idCajaFondo;
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


        Caja.Componentes.cbPeriodo.on({
            scope: this,
            select: function (cb, record) {
                model.stAnticipos.reload();
                // view.gridAnticipo.getBottomToolbar().changePage(0);
                view.paginToolbar.changePage(0);
            }
        });

        model.stAnticipos.on({
            scope: this,
            beforeload: function () {
                model.stAnticipos.baseParams.idcajafondo = scope.idcajafondo;
                model.stAnticipos.baseParams.idPeriodo = Caja.Componentes.cbPeriodo.getValue();

                if (view.smAnticipos.hasSelection())
                    this.idSelected = view.smAnticipos.getSelected().data.idanticipoviajenacional;
                else this.idSelected = null;
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
                if (this.idSelected) {
                    var index = model.stAnticipos.find('idanticipoviajenacional', this.idSelected);
                    view.smAnticipos.selectRow(index);
                } else {
                    view.smAnticipos.selectFirstRow();
                }
            }
        });

        view.paginToolbar.on({
            beforechange: function () {
                model.stAnticipos.baseParams.idcajafondo = scope.idcajafondo;
                model.stAnticipos.baseParams.idPeriodo = Caja.Componentes.cbPeriodo.getValue();
            }
        });

        this.fShowReporte = function () {
            scope.keyMap.disable();
            Ext.Msg.wait(etiquetas.lbCargando, 'Por favor espere...');
            var selections = view.gridAnticipo.getSelectionModel().getSelections();
            var arrayIdDoc = [];
            for (var v = 0; v < selections.length; v++) {
                arrayIdDoc.push(selections[v].data.iddocumento);
            }

            Ext.Ajax.request({
                url: 'getDataReporte',
                method: 'POST',
                params: {
                    arrayIdDoc: Ext.encode(arrayIdDoc)
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    if (responseData) {
                        scope.fOpenWindowReport(responseData);
                    } else {
                        scope.keyMap.enable();
                    }
                    Ext.MessageBox.hide();
                }
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

        this.ClickAddAnticipo = function (tipodieta) {
            scope.showWindow('add', tipodieta);
        };
        this.ClickModAnticipo = function () {
            var selected = view.smAnticipos.getSelected();
            scope.showWindow('mod', selected.data.tipodieta);
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
                        ? '¿Est&aacute; seguro que quiere eliminar los anticipos de dieta seleccionados?'
                        : '¿Est&aacute; seguro que quiere eliminar el anticipo de dieta seleccionado?';

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

        view.btnImportar.on({
            click: function fConfigurarImportar () {
                var self = this;
                //self.map.disable();
                this.winImportCmp = new SCFPrintData(new Object(), "/contabilidad/comun/SCFPrintView/", {
                    reportType: "DISTRA_DIETAS",
                    typeAction: 'import',
                    idcajafondo:scope.idcajafondo,
                    idMonedaEntidad:scope.idMonedaEntidad
                });
                this.winImportCmp.show();
                this.winImportCmp.doLayout();
                this.winImportCmp.on({
                    'show': function() {
                        self.map.disable();
                    },
                    'close': function() {
                        model.stAnticipos.load();
                    }
                });
            }
        });

        this.showConfirm = function (aprobar, iddocumento, fnCallBack) {
            // var selecteds = (aprobar === 'aprobar') ? view.smAnticipos.getSelections() : [scope.iddocumento];
            var selecteds = (aprobar === 'aprobar') ? view.smAnticipos.getSelections() : [String(iddocumento)];
            if (selecteds.length > 0) {
                if (aprobar === 'aprobar') {
                    var mensaje = (selecteds.length > 1)
                    ? '¿Est&aacute; seguro que quiere confirmar las dietas seleccionadas?'
                    : '¿Est&aacute; seguro que quiere confirmar la dieta seleccionada?';
                    var msgAprobar = (selecteds.length > 1)
                    ? 'Confirmando dietas.'
                    : 'Confirmando dieta.';
                } else {
                    var mensaje = '¿Est&aacute; seguro que quiere confirmar la dieta?';
                    var msgAprobar = 'Confirmando dieta.';
                }

                mostrarMensaje(2, mensaje, function (btnPress) {
                    if (btnPress === 'ok') {
                        Ext.Msg.wait(msgAprobar, 'Por favor espere...');
                        scope.aprobarAnticipo(selecteds, aprobar, fnCallBack);
                        // view.btnAdicionar.focus();
                    }
                    view.btnAdicionar.focus();
                });
            }
        };

        this.showCancelar = function () {
            var selecteds = view.smAnticipos.getSelections();
            if (selecteds.length > 0) {
                var mensaje = (selecteds.length > 1)
                    ? '¿Est&aacute; seguro que quiere cancelar las dietas seleccionadas?'
                    : '¿Est&aacute; seguro que quiere cancelar la dieta seleccionada?';

                //Si va a cancelar una liquidacion
                if (selecteds[0].data.idestado == 9) {
                    mensaje = (selecteds.length > 1)
                        ? '¿Est&aacute; seguro que quiere cancelar las liquidaciones seleccionadas?'
                        : '¿Est&aacute; seguro que quiere cancelar la liquidación seleccionada?';
                }

                mostrarMensaje(2, mensaje, function (btnPress) {
                    if (btnPress === 'ok') {
                        scope.showWindowCancelar();
                        view.btnCancelar.focus();
                    }
                    view.btnCancelar.focus();
                });
            }
        };

        this.showConfirmContabilizar = function (contabilizar, iddocumento, fnPostear) {
            // var selecteds = (contabilizar === 'contabilizar') ? view.smAnticipos.getSelections() : [scope.iddocumento];
            var selecteds = (contabilizar === 'contabilizar') ? view.smAnticipos.getSelections() : [iddocumento];
            //var selecteds = view.smAnticipos.getSelections();
            if (selecteds.length > 0) {
                if (contabilizar === 'contabilizar') {
                    var mensaje = (selecteds.length > 1)
                    ? '¿Est&aacute; seguro que quiere postear las dietas seleccionadas?'
                    : ' ¿Est&aacute; seguro que quiere postear la dieta seleccionada?';
                } else {
                    var mensaje = '¿Est&aacute; seguro que quiere postear la dieta?';
                }

                mostrarMensaje(2, mensaje, function (btnPress) {
                    if (btnPress === 'ok') {
                        Ext.Msg.wait('Mostrando comprobante de operaciones.', 'Por favor espere...');
                        scope.loadDataComprobante(selecteds, contabilizar, 'contabilizar', fnPostear);
                        // view.btnAdicionar.focus();
                    }
                    view.btnAdicionar.focus();
                });
            }
        };

        this.showConfirmLiquidar = function (contabilizar) {
            // if (scope.totalGasto == 0) {
            //     mostrarMensaje(1, 'Por favor, debe desglosar el importe a liquidar.');
            //     return;
            // }
            var selecteds = view.smAnticipos.getSelections();
            //var selecteds = view.smAnticipos.getSelections();
            if (selecteds.length > 1) {
                var mensaje = '¿Est&aacute; seguro que quiere liquidar los anticipos de dietas seleccionados?';
            } else {
                var mensaje = '¿Est&aacute; seguro que quiere liquidar el anticipo de dieta seleccionado?';
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

        this.desabilitarCamposForm = function (flag, action, tipodieta) {
            if (flag) {
                view.panelContenedor.disable();
                view.panelContenedor.el._mask.removeClass('ext-el-mask');
                view.panelContenedor.el._mask.addClass('my-disable-mask');
            } else {
                view.panelContenedor.enable();
            }

            // view.cbpersona.setDisabled(flag);
            // view.cbclasificacion.setDisabled(flag);
            // view.dffecha.setDisabled(flag);
            // view.tflabor.setDisabled(flag);
            // view.cbOperaciones.setDisabled(flag);
            // view.cbAnota.setDisabled(flag);
            // view.cbAutoriza.setDisabled(flag);
            //
            //
            //
            //
            // // if (flag) {
            // //     view.fpanel.disable();
            // // } else {
            // //     view.fpanel.enable();
            // // }
            //
            // if (tipodieta == 1) {
            //     view.dffechae.setDisabled(flag);
            //     view.dffecharegreso.setDisabled(flag);
            //     view.clocktime.setDisabled(flag);
            //     view.clocktimeregreso.setDisabled(flag);
            //     view.alimentacion.setDisabled(flag);
            //     view.hospedaje.setDisabled(flag);
            //     view.desayuno.setDisabled(flag);
            //     view.transporte.setDisabled(flag);
            //     view.cantDias.setDisabled(flag);
            //     view.cantDiasHosp.setDisabled(flag);
            // } else if (tipodieta == 2) {
            //     view.dffechaLiq.setDisabled(flag);
            //     view.dffecharegresoLiq.setDisabled(flag);
            //     view.clocktimeLiq.setDisabled(flag);
            //     view.clocktimeregresoLiq.setDisabled(flag);
            //     view.cantDiasLiq.setDisabled(flag);
            //     view.cantDiasLiqHosp.setDisabled(flag);
            // }
        };

        this.gridAfterEdit = function () {
            var recordscheck = '';
            var datoGasto = this.gridGastoAfterEdit();
            var datoGastoIslaAzul = this.gridGastoIslaAzulAfterEdit();
            if (datoGasto && datoGastoIslaAzul) {
                recordscheck = datoGasto + '.' + datoGastoIslaAzul;
            } else if (datoGasto) {
                recordscheck = datoGasto;
            } else if (datoGastoIslaAzul) {
                recordscheck = datoGastoIslaAzul;
            }
            view.checkGp.setValue(recordscheck);
        };

        this.gridGastoAfterEdit = function () {
            var recordscheck = [];
            var records = view.gpAnexoGasto.getStore().getRange();
            //si esta desordenado puede causar que falle lo que intento hacer mas abajo en el otro comentario
            records.sort(function (a, b) {
                return a.data.idcuentaelemento - b.data.idcuentaelemento;
            });
            records.forEach(function (item, i) {
                //esto es pa poder saber si han sido modificados
                recordscheck.push(
                    '' + item.get('idcuentaelemento') + '@' + item.get('importemo')
                );
            });
            return recordscheck.toString();
        };

        this.gridGastoIslaAzulAfterEdit = function () {
            var recordscheck = [];
            var records = view.gpAnexoIslaAzul.getStore().getRange();
            //si esta desordenado puede causar que falle lo que intento hacer mas abajo en el otro comentario
            records.sort(function (a, b) {
                return a.data.idcuentaelemento - b.data.idcuentaelemento;
            });
            records.forEach(function (item, i) {
                //esto es pa poder saber si han sido modificados
                recordscheck.push(
                    '' + item.get('idcuentaelemento') + '@' + item.get('idanticipo')
                    + '@' + item.get('idtarjeta') + '@' + item.get('importemo')
                );
            });
            return recordscheck.toString();
        };

        this.createFormSteps = function (arrBtn, form, tipoAccion, tipodieta) {
            if (arrBtn) {
                this.formSteps = new Ext.FormSteps(form, arrBtn);
            } else {
                return;
            }
            this.formSteps.on({
                scope: this,
                Nuevo: function (fnNuevo) {
                    this.desabilitarCamposForm(false, tipoAccion, tipodieta);
                    this.limpiarCampos();
                    fnNuevo.call();
                },
                Crear: function (fnCrear, cerrarVentana) {
                    // if (tipoAccion === 'add') {
                    //     var fn = function (id) {
                    //         this.desabilitarCamposForm(true);
                    //         fnCrear.call(undefined, id);
                    //     }.bind(this);
                    //     this.adicionarAnt(cerrarVentana, fn);
                    // } else if (tipoAccion === 'mod') {
                    //     var fn = function () {
                    //         this.desabilitarCamposForm(true);
                    //         fnCrear.call(undefined, this.getAnticipo());
                    //     }.bind(this);
                    //     this.modificarAnt(cerrarVentana, fn);
                    // }

                    var fn = function (id) {
                        this.desabilitarCamposForm(true, tipoAccion, tipodieta);
                        fnCrear.call(undefined, id);
                    }.bind(this);

                    if (scope.liquidar) {
                        //es es cuando se le da liquidar por el boton de afuera. o eso creo por ahora
                        scope.showConfirmLiquidar(cerrarVentana, fn);
                    } else {
                        if (cleanComa(view.totalAnt.getRawValue()) == 0 && tipodieta == 1) {
                            mostrarMensaje(1, 'Por favor, debe desglosar el importe de la dieta.');
                            return;
                        }
                        scope.addmodAnticipo(tipoAccion, !cerrarVentana, fn);
                    }
                },
                Confirmar: function (fnConfirmar, id) {
                    scope.showConfirm('aprobarAddMod', id, fnConfirmar);
                },
                Postear: function (fnPostear, id) {
                    var fn = fnPostear;
                    if (tipoAccion == 'mod') {
                        fn = fnPostear.createSequence(function () {
                            view.winAddMod.close();
                        }, this);
                    }
                    scope.showConfirmContabilizar('contabilizarAddMod', id, fnPostear);
                }
            });
        };

        this.showWindow = function (action, tipodieta, modoVer = false) {
            scope.changed = false;
            view.Window(etiquetas, action, cargainicial, scope, modoVer);
            view.winAddMod.on({
                beforeshow: function () {
                    scope.diferencia = 0;
                    scope.totalGasto = 0;
                    scope.keyMap.disable();
                    scope.anticipoEvents(action);
                    scope.gastoEvents(action);
                    if (action === 'add') {
                        if (tipodieta == 2) {
                            var operLiq = true;
                            view.winAddMod.setTitle('Adicionar liquidación de dieta nacional');
                        }
                    }
                    if (action === 'mod' || action === 'ver') {
                        var selected = view.smAnticipos.getSelected();
                        if (selected.data.tipodieta == 2)
                            var operLiq = true;
                    }
                    model.stOperaciones.load({
                        params: {
                            action: operLiq ? 'liq' : action,
                            idMoneda: scope.idMoneda
                        },
                        callback: function (records) {

                            if (records.length == 1) {
                                view.cbOperaciones.setValue(records[0].data.idnomoperaciones);
                                //Obtener cuentas de gasto
                                if (action === 'liq' || operLiq) {
                                    view.stCuenta.baseParams.arrayIdCuenta = Ext.encode(records[0].data.cuentagasto);
                                    view.stCuenta.baseParams.arrayNomCuenta = Ext.encode(records[0].json.nomcuentagasto);
                                    //view.stCuenta.load();
                                }
                                // var formArray = new Array();
                                // // formArray.push(view.fpanel);
                                // var arrbotones = new Array();
                                // arrbotones.push(view.btnAplicar);
                                // arrbotones.push(view.btnAceptar);
                                //
                                // //Arreglo de campos a validar
                                // var gridArray = new Array();
                                // var fieldArray = new Array();
                                // fieldArray.push(view.cbpersona);
                                // fieldArray.push(view.cbclasificacion);
                                // fieldArray.push(view.dffecha);
                                // fieldArray.push(view.tflabor);
                                // fieldArray.push(view.cbOperaciones);
                                // fieldArray.push(view.cbAnota);
                                // fieldArray.push(view.cbAutoriza);
                                // if (tipodieta == 1 && action != 'liq') {
                                //     fieldArray.push(view.dffechae);
                                //     fieldArray.push(view.dffecharegreso);
                                //     fieldArray.push(view.clocktime);
                                //     fieldArray.push(view.clocktimeregreso);
                                //     fieldArray.push(view.alimentacion);
                                //     fieldArray.push(view.hospedaje);
                                //     fieldArray.push(view.desayuno);
                                //     fieldArray.push(view.transporte);
                                //     fieldArray.push(view.cantDias);
                                //     fieldArray.push(view.cantDiasHosp);
                                // }
                                // if (tipodieta == 2 || action == 'liq') {
                                //     gridArray.push(view.gpAnexoGasto);
                                //     fieldArray.push(view.dffechaLiq);
                                //     fieldArray.push(view.dffecharegresoLiq);
                                //     fieldArray.push(view.clocktimeLiq);
                                //     fieldArray.push(view.clocktimeregresoLiq);
                                //     fieldArray.push(view.cantDiasLiq);
                                //     fieldArray.push(view.cantDiasLiqHosp);
                                // }
                                // scope.TaskFormValidation.startTaskValidation(action, formArray, arrbotones, gridArray, fieldArray);
                            }
                        }
                    });
                    if (action === 'mod') {
                        var selected = view.smAnticipos.getSelected();
                        scope.loadDataMod(selected, action);
                        view.btnAprobarAddMod.enable();
                        if (selected.data.tipodieta == 1) {//1-Anticipo
                            view.fieldSetAntDieta.expand();
                            view.fieldSetLiqDieta.setVisible(false);
                            view.fieldSetLiqDieta.cascade(function () {
                                this.disable();
                            });
                            scope.isLiquidacion = 0;
                            // view.fieldSetLiqDieta.collapse();
                        } else {
                            view.fieldSetLiqDieta.expand();
                            view.fieldSetAntDieta.setVisible(false);
                            view.fieldSetAntDieta.cascade(function () {
                                this.disable();
                            });
                            scope.isLiquidacion = 1;
                            view.fieldSetAntDieta.collapse();
                            view.fieldSetIslaAzul.collapse();
                            view.fieldSetIslaAzul.setVisible(false);
                            view.fieldSetIslaAzul.cascade(function () {
                                this.disable();
                            });
                        }
                    } else if (action === 'liq') {
                        var selected = view.smAnticipos.getSelected();
                        scope.loadDataMod(selected, action);
                        view.winAddMod.setTitle(etiquetas.lbModAnticipoViajLiq);
                        scope.disableField(action);
                        view.cbOperaciones.reset();
                        view.cbAutoriza.setDisabled(true);
                        view.cbAnota.setDisabled(true);
                        view.btnAprobarAddMod.setVisible(false);
                        view.btnContabilizarAddMod.setVisible(false);
                        view.fieldSetAntDieta.collapse();
                        view.fieldSetAntDieta.setVisible(false);
                        view.fieldSetIslaAzul.collapse();
                        view.fieldSetIslaAzul.setVisible(false);
                    } else if (action === 'add') {
                        if (tipodieta == 1) {
                            view.fieldSetAntDieta.expand();
                            view.fieldSetLiqDieta.setVisible(false);
                            view.fieldSetLiqDieta.cascade(function () {
                                this.disable();
                            });
                            scope.isLiquidacion = 0;
                        } else {
                            view.fieldSetLiqDieta.expand();
                            view.fieldSetAntDieta.setVisible(false);
                            view.fieldSetAntDieta.cascade(function () {
                                this.disable();
                            });
                            view.fieldSetIslaAzul.collapse();
                            view.fieldSetIslaAzul.setVisible(false);
                            view.fieldSetIslaAzul.cascade(function () {
                                this.disable();
                            });
                            scope.isLiquidacion = 1;
                            view.stTarjetaIslaAzulGasto.load();
                            view.stAnticipo.load();
                        }
                    } else if (action === 'ver') {
                        var selected = view.smAnticipos.getSelected();
                        view.btnAprobarAddMod.enable();
                        if (selected.data.tipodieta == 2 || (selected.data.tipodieta == 1 && selected.data.idestado == 9)) {//1-Anticipo
                            scope.loadDataMod(selected, 'mod');
                            view.fieldSetLiqDieta.expand();
                            view.fieldSetAntDieta.setVisible(false);
                            view.fieldSetAntDieta.cascade(function () {
                                this.disable();
                            });
                            scope.isLiquidacion = 1;
                            view.fieldSetAntDieta.collapse();
                            view.fieldSetIslaAzul.collapse();
                            view.fieldSetIslaAzul.setVisible(false);
                            view.fieldSetIslaAzul.cascade(function () {
                                this.disable();
                            });
                        } else if (selected.data.tipodieta == 1) {
                            scope.loadDataMod(selected, action);
                            view.fieldSetAntDieta.expand();
                            view.fieldSetLiqDieta.setVisible(false);
                            view.fieldSetLiqDieta.cascade(function () {
                                this.disable();
                            });
                            scope.isLiquidacion = 0;
                            // view.fieldSetLiqDieta.collapse();
                        }
                    }
                    if (cargainicial) {
                        view.btnAprobarAddMod.setVisible(false);
                        view.btnContabilizarAddMod.setVisible(false);
                    }

                    if (scope.mostrarIslaAzul) {
                        view.tabgeneral.getItem('anexotarjetaislaazul').setDisabled(false);
                        view.fieldSetIslaAzul.expand();
                    } else {
                        view.fieldSetIslaAzul.collapse();
                        view.fieldSetIslaAzul.setVisible(false);
                        view.tabgeneral.getItem('anexotarjetaislaazul').setDisabled(true);
                        view.tabgeneral.hideTabStripItem('anexotarjetaislaazul');
                    }
                },
                show: function () {
                    if (cargainicial)
                        view.numTal.focus(true, 10);
                    else
                        view.cbpersona.focus(true, 10);
                    if (action === 'add') {
                        view.cbAnota.store.loadData({datos: [dataAnota]});
                        view.cbAnota.setValue(dataAnota.idpersona);
                        view.cbAnota.setRawValue(dataAnota.nombre);
                    }
                    if (modoVer) {
                        view.winAddMod.setTitle('Ver dieta nacional');
                        view.fpanel.cascade(function () {
                            this.disabledClass = 'disabled-component';
                        });

                        view.fpanel.disable();
                        view.gpAnexoGasto.disable();
                        view.gpAnexoIslaAzul.disable();
                        // view.btnAddGridAnexo.disable();
                    } else {
                        scope.createFormSteps(view.winAddMod.buttons, view.fpanel, action, tipodieta);
                    }
                }, close: function () {
                    model.stAnticipos.load();
                    view.btnAdicionar.focus();
                    // view.smAnticipos.clearSelections();
                    scope.liquidar = false;
                    scope.keyMap.enable();
                    // scope.TaskFormValidation.stopTaskValidation();
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
                    view.winAddMod.close();
                    if (scope.changed)
                        model.stAnticipos.load();
                }
            });
            view.btnAplicar.on({
                click: function () {
                    if (cleanComa(view.totalAnt.getRawValue()) == 0 && scope.totalGasto == 0) {
                        mostrarMensaje(1, 'Por favor, debe desglosar el importe de la dieta.');
                        return;
                    }
                    scope.addmodAnticipo(action, true);
                    scope.limpiarCampos();
                }
            });
            view.btnAceptar.on({
                click: function () {
                    // if (scope.liquidar) {
                    //     if (view.fpanel.getForm().isValid())
                    //         scope.showConfirmLiquidar();
                    // } else {
                    //     if (cleanComa(view.totalAnt.getRawValue()) == 0 && scope.totalGasto == 0) {
                    //         mostrarMensaje(1, 'Por favor, debe desglosar el importe de la dieta.');
                    //         return;
                    //     }
                    //     scope.addmodAnticipo(action, true);
                    // }
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
                        view.cbclasificacion.focus(true, 10);
                    }
                }, select: function () {
                    if (action === 'add') {
                        scope.validarFormAdd();
                    }
                }
            });
            view.cbclasificacion.on({
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
                },
                keyup: function () {
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
                        view.stCuenta.baseParams.arrayIdCuenta = Ext.encode(records[0].data.cuentagasto);
                        view.stCuenta.load();
                        // view.stCuentaGasto.load({
                        //     params: {
                        //         arrayCuenta: Ext.encode(records[0].data.cuentagasto)
                        //     }
                        // });
                    }
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
                oninitsetvalue: function (roweditor, field, record) {
                    if (field.id == 'cbxCuenta') {
                        field.setValue(record.data.idcuentaelemento, record.data.textcuentaelemento);
                        return false;
                    }
                },
                afteredit: function (editor, grid, changes, record, rowIndex) {
                    record.data.textcuentaelemento = view.cbxCuenta.displayFieldTemp;
                    // view.gpAnexoGasto.getStore().commitChanges();
                    view.gpAnexoGasto.getView().refresh();
                    me.calcularDiferenciaGasto(action);
                    me.gridAfterEdit();
                },
                beforeedit: function (roweditor, grid, record, rowIndex) {
                    if (action === 'mod')
                        view.nfImporte.enable();
                }
            });

            view.roweditorIslaAzul.on({
                scope: this,
                oninitsetvalue: function (roweditor, field, record) {
                    if (field.id == 'cbxCuentaIslaAzul') {
                        field.setValue(record.data.idcuentaelemento, record.data.textcuentaelemento);
                        return false;
                    } else if (field.id == 'anticipoislaazul') {
                        field.setValue(record.data.idanticipo);
                        if (record.data.numanticipo) {
                            field.setRawValue(record.data.numanticipo);
                        }
                        return false;
                    } else if (field.id == 'tarjetaislaazulgasto') {
                        field.setValue(record.data.idtarjeta);
                        // field.setRawValue(record.data.numero);
                        return false;
                    }
                },
                afteredit: function (editor, grid, changes, record, rowIndex) {
                    record.data.textcuentaelemento = view.cbxCuentaIslaAzul.displayFieldTemp;
                    record.data.numanticipo = view.cbAnticipo.getRawValue();
                    record.data.numtarjeta = view.cbxTarjetaIzlaAzulGasto.getRawValue();
                    // view.gpAnexoGasto.getStore().commitChanges();
                    view.gpAnexoIslaAzul.getView().refresh();
                    me.calcularDiferenciaGasto(action);
                    me.gridAfterEdit();

                    view.nfImporteIslaAzul.__proto__.maxValue = undefined;
                    view.smGpAnticipo.clearSelections();
                },
                beforeedit: function (roweditor, grid, record, rowIndex) {
                    me.actualizarPendienteAnticipo(grid);
                    // view.nfImporteIslaAzul.__proto__.maxValue = record.get('saldodisponible');
                    // if (action === 'mod')
                    //     view.nfImporteIslaAzul.enable();
                },
                canceledit: function (roweditor, record, rowIndex) {
                    view.nfImporteIslaAzul.__proto__.maxValue = undefined;
                }
            });

            view.rowactionIslaAzul.on('action', function (grid, record, action, rowIndex, col, e) {
                switch (action) {
                    case 'eliminarIslaAzul':
                        mostrarMensaje(2, etiquetas.lbPregEliminarGasto, function (btnPress) {
                            if (btnPress === 'ok') {
                                var seleccionado = grid.getSelectionModel().getSelected();
                                grid.getStore().remove(seleccionado);
                                me.actualizarPendienteAnticipo(grid);
                                me.calcularDiferenciaGasto('eliminar');
                                me.gridAfterEdit();
                            }
                        });
                        break;
                }
            });

            view.rowaction.on('action', function (grid, record, action, rowIndex, col, e) {
                switch (action) {
                    case 'eliminar':
                        mostrarMensaje(2, etiquetas.lbPregEliminarGasto, function (btnPress) {
                            if (btnPress === 'ok') {
                                var seleccionado = view.gpAnexoGasto.getSelectionModel().getSelected();
                                view.gpAnexoGasto.getStore().remove(seleccionado);
                                me.calcularDiferenciaGasto(action);
                                me.gridAfterEdit();
                            }
                        });
                        break;
                }
            });

        };
//-----------------------------------------
        this.cancelarEvents = function () {
            view.btnCancelarCerrar.on({
                click: function () {
                    view.winCancelar.destroy();
                }
            });
            view.btnCancelarAceptar.on({
                click: function () {
                    var selecteds = view.smAnticipos.getSelections();
                    if (!scope.estadosDiferentes() && selecteds[0].data.idestado == 6 || selecteds[0].data.idestado == 9)
                        scope.loadDataComprobante(selecteds, '', 'cancelar', undefined, view.dffechacancelacion.getRawValue());
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

        this.addmodAnticipo = function (action, aplicar, fnCallBack) {
            Ext.Msg.wait('Guardando datos del anticipo de dietas.', 'Por favor espere...');
            var anticipo = [];
            var dataLiquidar = {};
            var selected = view.smAnticipos.getSelected();
            anticipo.push({
                idpersona: view.cbpersona.getValue(),
                fechaEmision: view.dffecha.getRawValue(),
                clasificacion: view.cbclasificacion.getValue(),
                cantDias: view.cantDias.getRawValue(),
                cantDiasHosp: view.cantDiasHosp.getRawValue(),
                labor: view.tflabor.getValue(),
                fechaVence: view.dffechaVence.getRawValue(),
                operacion: view.cbOperaciones.getValue(),
                autoriza: view.cbAutoriza.getValue(),
                anota: view.cbAnota.getValue(),
                //Anticipo
                fechaSalida: view.dffechae.getRawValue(),
                horaSalida: view.clocktime.getValue(),
                fechaRegreso: view.dffecharegreso.getRawValue(),
                horaRegreso: view.clocktimeregreso.getRawValue(),
                alimentacion: Ext.isEmpty(view.alimentacion.getValue()) ? 0 : view.alimentacion.getValue(),
                hospedaje: Ext.isEmpty(view.hospedaje.getValue()) ? 0 : view.hospedaje.getValue(),
                desayunouotros: Ext.isEmpty(view.desayuno.getValue()) ? 0 : view.desayuno.getValue(),
                transporte: Ext.isEmpty(view.transporte.getValue()) ? 0 : view.transporte.getValue(),
                total: view.totalAnt.getRawValue() ? cleanComa(view.totalAnt.getRawValue()) : 0,
                //-----------------
                idMonedaEntidad: scope.idMonedaEntidad,
                idfondo: scope.idCbFondo,
                idcaja: scope.idCbCaja,
                idcajafondo: scope.idcajafondo,
                numTalonario: view.numTal.getValue(),
                idtarjetasislaazul: view.cbxTarjetaIzlaAzul.getValue()
            });

            //Si es un aliquidacion directa
            if (scope.isLiquidacion) {
                //dataLiquidar.idDocumento = iddoc[0];
                // dataLiquidar.numDoc = selecteds[0].json.numero;
                dataLiquidar.diferencia = scope.diferencia;
                //dataLiquidar.idAnticipoNacional = selecteds[0].json.idmovimiento;
                dataLiquidar.operacion = view.cbOperaciones.getValue();
                dataLiquidar.fechaLiq = view.dffechaLiq.getRawValue();
                dataLiquidar.totalLiq = 0;
                // dataLiquidar.fechaLiq = view.dffechaLiq.getRawValue();
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
                if (cargainicial == 1) {
                    totalGasto = view.nfImporteCargaInicial.getValue();
                } else {
                    for (var i = 0; i < arrayData.length; i++) {
                        arrayPaseGasto.push({
                            idcuentaelemento: arrayData[i].data.idcuentaelemento,
                            importemo: arrayData[i].data.importemo,
                            tipo: 1
                        });
                        totalGasto += parseFloat(arrayData[i].data.importemo);
                    }
                }

                var arrayPaseGastoIslaAzul = [];
                var arrayDataIslaAzul = view.gpAnexoIslaAzul.getStore().getRange();
                for (var i = 0; i < arrayDataIslaAzul.length; i++) {
                    arrayPaseGastoIslaAzul.push({
                        idcuentaelemento: arrayDataIslaAzul[i].data.idcuentaelemento,
                        importemo: arrayDataIslaAzul[i].data.importemo,
                        idanticipo: arrayDataIslaAzul[i].data.idanticipo,
                        idtarjeta: arrayDataIslaAzul[i].data.idtarjeta,
                        tipo: 2
                    });
                }

                dataLiquidar.totalLiq = totalGasto;
                //--------------------
            }

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
                    idmovimientocaja: (action === 'mod') ? selected.json.idmovimientocaja : -1,
                    cargaInicial: cargainicial,
                    isLiquidacion: scope.isLiquidacion,
                    dataLiquidar: Ext.encode(dataLiquidar),
                    arrayPaseGasto: Ext.encode(arrayPaseGasto),
                    arrayPaseGastoIslaAzul: Ext.encode(arrayPaseGastoIslaAzul)
                },
                callback: function (options, success, response) {
                    Ext.Msg.hide();
                    scope.changed = true;
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codMsg == 1 && action == 'add' && !scope.isLiquidacion)
                        mostrarMensaje(1, etiquetas.lbAddAnticipoDieta);
                    else if (responseData.codMsg == 1 && action == 'add' && scope.isLiquidacion)
                        mostrarMensaje(1, etiquetas.lbAddLiqDieta);
                    if (responseData.codMsg == 1 && action == 'mod' && !scope.isLiquidacion)
                        mostrarMensaje(1, etiquetas.lbModAnticipoDieta);
                    else if (responseData.codMsg == 1 && action == 'mod' && scope.isLiquidacion)
                        mostrarMensaje(1, etiquetas.lbModLiqDieta);
                    else if (responseData.codMsg == -1) {
                        mostrarMensaje(1, responseData.mensaje);
                        return;
                    } else if (responseData.codMsg == -2) {
                        mostrarMensaje(1, etiquetas.msgNoSaldo);
                        return;
                    } else if (responseData.codMsg == -3) {
                        mostrarMensaje(1, etiquetas.msgAnticipoSinLiquidar);
                        return;
                    }
                    if (!aplicar) {
                        view.winAddMod.close();
                    }
                    scope.iddocumento = responseData.iddocumento;
                    if (typeof fnCallBack == 'function') {
                        fnCallBack(responseData.iddocumento);
                    }
                }
            });
        };

        this.aprobarAnticipo = function (selecteds, aprobar, fnCallBack) {
            var iddocumentos = Array();
            var msg = (selecteds.length > 1)
                ? 'Las dietas han sido confirmadas satisfactoriamente.'
                : 'La dieta ha sido confirmada satisfactoriamente.';
            if (aprobar === 'aprobar') {
                for (var i = 0; i < selecteds.length; i++)
                    iddocumentos.push(selecteds[i].json.iddocumento);
            } else {
                // iddocumentos.push(scope.iddocumento);
                iddocumentos.push(selecteds[0]);
            }

            Ext.Ajax.request({
                url: 'aprobar',
                method: 'POST',
                params: {
                    iddocumentos: Ext.encode(iddocumentos)
                },
                callback: function (options, success, response) {
                    Ext.Msg.hide();
                    var responseData = Ext.decode(response.responseText);
                    if (aprobar === 'aprobar')
                        model.stAnticipos.load({
                            callback: function () {
                                mostrarMensaje(responseData.codMsg, msg);
                            }
                        });
                    else {
                        mostrarMensaje(responseData.codMsg, msg);
                        // view.btnAprobarAddMod.disable();
                        // view.btnContabilizarAddMod.enable();
                        // view.btnAceptar.disable();
                        // view.fpanel.disable();
                        // view.cantDias.disable();
                        // view.total.disable();
                        if (typeof fnCallBack === 'function') {
                            fnCallBack();
                        }
                    }

                }
            });
        };

        this.eliminarAnticipo = function (selecteds) {
            var arrayIdAnticipo = Array();
            var arrayIdDoc = Array();
            var msg = (selecteds.length > 1)
                ? 'Los anticipos de dietas han sido eliminados satisfactoriamente.'
                : 'El anticipo de dieta ha sido eliminado satisfactoriamente.';

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
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.codM == 1) {
                        mostrarMensaje(1, msg);
                        model.stAnticipos.reload();
                    }
                }
            });
        };

        this.loadDataComprobante = function (selecteds, contabilizar, tipo, fnPostear, fecha) {
            var data = Array();
            var iddoc = Array();
            var dataLiquidar = {};
            var otherParams = {};

            if (contabilizar === 'contabilizarAddMod' || tipo === 'liquidar') {
                if (contabilizar === 'contabilizarAddMod') {
                    iddoc.push(String(selecteds[0]));
                } else {
                    data.push({
                        iddocumento: String(scope.iddocumento),
                        idoperacion: view.cbOperaciones.getValue(),
                        tipodieta: selecteds[0].json.tipodieta,
                        idestado: selecteds[0].json.idestado
                    });
                    iddoc.push(String(scope.iddocumento));
                }
            } else {
                for (var i = 0; i < selecteds.length; i++) {
                    data.push({
                        iddocumento: selecteds[i].json.iddocumento,
                        idoperacion: selecteds[i].json.idoperacion,
                        tipodieta: selecteds[i].json.tipodieta,
                        idestado: selecteds[i].json.idestado,
                        diferencia: parseFloat(selecteds[i].json.importemo) - parseFloat(selecteds[i].json.importeLiqmo)
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
                dataLiquidar.diferencia = scope.diferencia;
                dataLiquidar.idAnticipoNacional = selecteds[0].json.idmovimiento;
                dataLiquidar.operacion = view.cbOperaciones.getValue();
                dataLiquidar.autoriza = view.cbAutoriza.getValue();
                dataLiquidar.anota = view.cbAnota.getValue();
                dataLiquidar.fechaLiq = view.dffechaLiq.getRawValue();
                fecha = dataLiquidar.fechaLiq;
                dataLiquidar.totalLiq = 0;

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
                        idcuentaelemento: arrayData[i].data.idcuentaelemento,
                        importemo: arrayData[i].data.importemo,
                        tipo: 1
                    });
                    totalGasto += parseFloat(arrayData[i].data.importemo);
                }

                var arrayPaseGastoIslaAzul = [];
                var arrayDataIslaAzul = view.gpAnexoIslaAzul.getStore().getRange();
                for (var i = 0; i < arrayDataIslaAzul.length; i++) {
                    arrayPaseGastoIslaAzul.push({
                        idcuentaelemento: arrayDataIslaAzul[i].data.idcuentaelemento,
                        importemo: arrayDataIslaAzul[i].data.importemo,
                        idanticipo: arrayDataIslaAzul[i].data.idanticipo,
                        idtarjeta: arrayDataIslaAzul[i].data.idtarjeta,
                        tipo: 2
                    });
                }

                dataLiquidar.totalLiq = totalGasto;
                //--------------------
            }

            Ext.Msg.wait(etiquetas.lbCargando, 'Por favor espere...');
            Ext.Ajax.request({
                url: 'loadDataComprobante',
                method: 'POST',
                params: {
                    tipo: tipo,
                    diferencia: scope.diferencia,
                    idoperacion: (tipo === 'liquidar') ? view.cbOperaciones.getValue(): null,//cuando liq
                    idCajaFondo: scope.idcajafondo,
                    //data: Ext.encode(data),
                    iddoc: Ext.encode(iddoc),
                    arrayPaseGasto: Ext.encode(arrayPaseGasto),
                    arrayPaseGastoIslaAzul: Ext.encode(arrayPaseGastoIslaAzul),
                    fecha: fecha
                },
                callback: function (options, success, response) {
                    // Ext.Msg.hide();
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.datos.codM) {
                        if (responseData.datos.codM == -2) {
                            mostrarMensaje(1, "No se puede realizar esta acción porque el estado del documento ha sido cambiado.<br><b>Por favor recargue la interfaz.</b>");
                            Ext.MessageBox.hide();
                        }
                        if (responseData.datos.codM == -1) {
                            mostrarMensaje(1, "Ocurrió un error durante la ejecución de esta acción.");
                            Ext.MessageBox.hide();
                        }
                        if (tipo === 'cancelar')
                            view.winCancelar.destroy();
                        return;//No continuar
                    }

                    if (tipo === 'cancelar')
                        view.winCancelar.destroy();

                    Ext.Cont.Comprobante.init(responseData.datos.subsistema, responseData.datos.detalle, responseData.datos.descripcion, responseData.datos.fechaCont, responseData.datos.dataComprobante, 3, 1, 1).onSaved(function (idComprobant, numComprobant, fecha) {
                        if (idComprobant) {
                            Ext.Msg.wait('Guardando datos.', 'Por favor espere...');
                            var msg = (tipo === 'cancelar')
                                ? 'Cancelaci&oacute;n satisfactoria registrada en el comprobante ' + numComprobant + '.'
                                : 'Posteo satisfactorio registrado en el comprobante ' + numComprobant + '.';
                            if (tipo === 'liquidar')
                                msg = 'Liquidación satisfactoria registrada en el comprobante ' + numComprobant + '.';
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
                                    idCajaFondo: scope.idcajafondo,
                                    arrayGasto: Ext.encode(arrayPaseGasto),
                                    arrayPaseGastoIslaAzul: Ext.encode(arrayPaseGastoIslaAzul),
                                    dataDoc: Ext.encode(data)
                                },
                                callback: function (options, success, response) {
                                    scope.diferencia = 0;
                                    //if (view.btnContabilizarAddMod)
                                    //    view.btnContabilizarAddMod.disable();
                                    if (tipo === 'liquidar') {
                                        view.winAddMod.close();
                                        view.btnLiquidar.disable();
                                    }
                                    // view.smAnticipos.clearSelections();
                                    model.stAnticipos.load({
                                        callback: function () {
                                            mostrarMensaje(1, msg);
                                        }
                                    });
                                    Ext.Msg.hide();
                                    if (typeof fnPostear === 'function') {
                                        fnPostear();
                                    }
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
                    otherParams: Ext.encode(otherParams),
                    idCajaFondo: scope.idcajafondo
                },
                callback: function (options, success, response) {
                    model.stAnticipos.load({
                        callback: function () {
                            if (iddoc.length > 1)
                                mostrarMensaje(1, 'Las dietas seleccionadas han sido canceladas satisfactoriamente.');
                            else
                                mostrarMensaje(1, 'La dieta seleccionada ha sido cancelada satisfactoriamente.');
                        }
                    });
                }
            });
            view.winCancelar.destroy();
        };

        this.loadDataMod = function (data, action) {
            view.numTal.setValue(data.json.numeroMostrar);
            var datosPerMod = {datos: [{idpersona: data.json.idpersona, nombre: data.json.fullname}]};
            model.stPersona.loadData(datosPerMod);
            view.cbpersona.setValue(data.json.idpersona);
            //view.cbpersona.setRawValue(data.json.fullname);
            view.cbclasificacion.setValue(data.json.clasificacion);
            view.dffecha.setRawValue(data.json.fechaemision);
            view.dffecha.clearInvalid();
            //Datos anticipo
            view.dffechae.setRawValue(data.json.fechasalida);
            view.dffechae.setMaxValue(data.json.fecharegreso);
            view.dffecharegreso.setRawValue(data.json.fecharegreso);
            view.dffecharegreso.setMinValue(data.json.fecharegreso);
            view.dffechaVence.setRawValue(data.json.fechavencimiento);
            view.clocktime.setRawValue(data.json.horaviaje);
            view.clocktimeregreso.setRawValue(data.json.horaregreso);
            view.alimentacion.setRawValue(formatoMoneda(data.json.alimentacion));
            view.hospedaje.setRawValue(formatoMoneda(data.json.hospedaje));
            view.desayuno.setRawValue(formatoMoneda(data.json.desayunoyotros));
            view.transporte.setRawValue(formatoMoneda(data.json.transporte));
            view.cantDias.setValue(data.json.diasestimadoviaje);
            view.cantDiasHosp.setValue(data.json.diasestimadohospedado);
            // Datos Liquidacion
            if (action === 'mod') {
                view.dffechaeLiq.setRawValue(data.json.fechasalidaLiq);
                view.dffecharegresoLiq.setRawValue(data.json.fecharegresoLiq);
                view.clocktimeLiq.setRawValue(data.json.horasalidaLiq);
                view.clocktimeregresoLiq.setRawValue(data.json.horaregresoLiq);
                view.cantDiasLiq.setValue(data.json.diasviajeLiq);
                view.cantDiasLiqHosp.setValue(data.json.diashospedadosLiq);
                view.stAnexoGasto.removeAll();
                view.stAnexoGasto.loadData({datos: data.json.arrayGatos});
                view.stAnexoIslaAzul.removeAll();
                view.stAnexoIslaAzul.loadData({datos: data.json.arrayGatosIslaAzul});
                scope.calcularDiferenciaGasto();
                scope.gridAfterEdit();
                view.stTarjetaIslaAzulGasto.load({
                    callback: function (records) {
                        // var tar = Ext.decode(data.json.idtarjetasislaazul);
                        // if (tar) {
                        //     for (var i = 0; i < records.length; i++) {
                        //         if (!tar.includes(records[i].idtarjeta)) {
                        //             view.stTarjetaIslaAzulGasto.remove(records[i]);
                        //         }
                        //     }
                        // }
                    }
                });
            } else if (action === 'liq') {
                view.stAnticipo.load();
                view.stTarjetaIslaAzulGasto.load({
                    callback: function (records) {
                        // var tar = Ext.decode(data.json.idtarjetasislaazul);
                        // if (tar) {
                        //     for (var i = 0; i < records.length; i++) {
                        //         if (!tar.includes(records[i].data.idtarjeta)) {
                        //             view.stTarjetaIslaAzulGasto.remove(records[i]);
                        //         }
                        //     }
                        // }
                    }
                });
            }
//----------------------------------------
            view.tflabor.setValue(data.json.laborarealizar);
            view.totalAnt.setRawValue(formatoMoneda(data.json.importemb));
            //view.total.setRawValue(formatoMoneda(data.json.importemb));
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
            var tempp = Ext.decode(data.json.idtarjetasislaazul);
            scope.iddocumento = data.json.iddocumento;
            if (tempp) {
                if (tempp[0]) {
                    view.cbxTarjetaIzlaAzul.setValue(tempp, data.json.numtarjetasislaazul);
                }
            }
            view.cbxTarjetaIzlaAzul.flagload = true;
            view.cbxTarjetaIzlaAzul.on({
                load: function () {
                    if (!this.tree.getLoader().isLoading() && this.flagload) {
                        Ext.each(this.customvalues, function (item) {
                            if (this.tree.getNodeById(item)) {
                                this.tree.getNodeById(item).getUI().toggleCheck(true);
                            }
                        }, this)
                        this.flagload = false;
                    }
                }
            });
        };

        this.validarFormAdd = function () {
            view.btnAceptar.setDisabled(!view.fpanel.getForm().isValid() || Ext.isEmpty(view.cantDias.getValue()));
        };

        this.disableField = function (action) {
            view.alimentacion.setDisabled(true);
            view.hospedaje.setDisabled(true);
            view.desayuno.setDisabled(true);
            view.transporte.setDisabled(true);
            view.cbpersona.setDisabled(true);
            view.cbclasificacion.setDisabled(true);
            view.dffecha.setDisabled(true);
            view.dffechaVence.setDisabled(true);
            view.tflabor.setDisabled(true);
            //view.cbOperaciones.setDisabled(true);
        };

        this.actualizarBotones = function () {
            if (!view.smAnticipos.hasSelection() || scope.estadosDiferentes()) {
                view.btnModificar.disable();
                view.btnCancelar.disable();
                view.btnConfirmar.disable();
                view.btnContabilizar.disable();
                view.btnLiquidar.disable();
            } else {
                view.btnReporte.enable();

                if (scope.todosGuardados()) {
                    if (view.smAnticipos.selections.length > 1)
                        view.btnModificar.disable();
                    else
                        view.btnModificar.enable();
                    view.btnCancelar.enable();
                    view.btnConfirmar.enable();
                    view.btnContabilizar.disable();
                    view.btnLiquidar.disable();
                }
                if (scope.todosConfirmados()) {
                    view.btnModificar.disable();
                    view.btnCancelar.enable();
                    view.btnConfirmar.disable();
                    view.btnContabilizar.enable();
                    view.btnLiquidar.disable();
                }
                if (scope.todosContabilizados()) {
                    view.btnCancelar.enable();
                    if (view.smAnticipos.selections.length == 1)
                        view.btnLiquidar.enable();
                    else view.btnLiquidar.disable();
                    view.btnModificar.disable();
                    view.btnConfirmar.disable();
                    view.btnContabilizar.disable();
                }
                if (scope.todosLiquidados()) {
                    view.btnCancelar.enable();
                    view.btnLiquidar.disable();
                    view.btnModificar.disable();
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
                    if (view.smAnticipos.getSelections()[i].data.idestado != view.smAnticipos.getSelections()[i + 1].data.idestado || (view.smAnticipos.getSelections()[i].data.tipodieta != view.smAnticipos.getSelections()[i + 1].data.tipodieta))
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
                if (view.smAnticipos.getSelections()[i].data.idestado != 6 || view.smAnticipos.getSelections()[0].data.tipodieta == 2)//Si no esta contabilizado o es liquidacion directa
                    return false;
            return true;
        }

        this.todosLiquidados = function () {
            for (var i = 0; i < view.smAnticipos.getCount(); i++)
                if (view.smAnticipos.getSelections()[i].data.idestado != 9)//Si no esta liquidado
                    return false;
            return true;
        }

        this.limpiarCampos = function () {
            view.fpanel.getForm().reset();
            view.cantDias.reset();
            view.total.reset();

            view.stAnexoGasto.removeAll();
            view.stAnexoIslaAzul.removeAll();
            scope.calcularDiferenciaGasto();
            scope.gridAfterEdit();
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
                view.labelDiferencia.setText('Importe a entregar al trabajador: ' + formatoMoneda(scope.diferencia));
            else if (scope.diferencia > 0)
                view.labelDiferencia.setText('Importe a devolver a la caja: ' + formatoMoneda(scope.diferencia));
            else
                view.labelDiferencia.setText('');
        };

        this.calcularDiferenciaGasto = function (action) {
            var importeTotalG = 0;
            var importeTotalGIslaAzul = 0;
            for (var i = 0; i < view.gpAnexoGasto.getStore().getCount(); i++) {
                importeTotalG += parseFloat(Math.abs(view.gpAnexoGasto.getStore().getAt(i).data.importemo));
            }
            for (var i = 0; i < view.gpAnexoIslaAzul.getStore().getCount(); i++) {
                importeTotalGIslaAzul += parseFloat(Math.abs(view.gpAnexoIslaAzul.getStore().getAt(i).data.importemo));
            }
            view.labelTotal.setText(formatoMoneda(importeTotalG));
            view.labelTotalIslaAzul.setText(formatoMoneda(importeTotalGIslaAzul));
            scope.totalGasto = importeTotalG;
            if (action === 'liq') {
                scope.diferencia = cleanComa(view.totalAnt.getRawValue()) - importeTotalG;


                if (scope.diferencia < 0)
                    view.labelDiferencia.setText('Importe a entregar al trabajador: ' + formatoMoneda(Math.abs(scope.diferencia)));
                else if (scope.diferencia > 0)
                    view.labelDiferencia.setText('Importe a devolver a la caja: ' + formatoMoneda(Math.abs(scope.diferencia)));
                else
                    view.labelDiferencia.setText('');
            }
        };

        this.actualizarPendienteAnticipo = function (grid) {
            var records = grid.getStore().getRange();
            var idant = '';
            var indexant = -1;
            var record = '';

            this.actualizarPendienteAlValorOriginal();
            if (records.length > 0) {
                for (var i = 0; i < records.length; i++) {
                    idant = records[i].get('idanticipo');
                    indexant = view.stAnticipo.find('idanticipo', idant);
                    if (indexant !== -1) {
                        record = view.stAnticipo.getAt(indexant);
                        record.set('pendiente', record.get('pendiente') - records[i].get('importemo'));
                        record.commit();
                    }

                }
                if (view.gpAnticipo.rendered) {
                    view.gpAnticipo.getView().refresh();
                }
            }
        };

        this.actualizarPendienteAlValorOriginal = function () {
            var records = view.stAnticipo.getRange();
            if (records.length > 0) {
                for (var i = 0; i < records.length; i++) {
                    records[i].set('pendiente', records[i].get('pendienteoriginal'));
                    records[i].commit();
                }
            }
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
            /*{
                key: "i",
                alt: true,
                scope: this,
                fn: function () {
                    if (cargainicial)
                        view.btnAdicionar.fireEvent('click');
                }
            },*/ {
                key: "i",
                alt: true,
                scope: this,
                fn: function () {
                    //if (!cargainicial)
                    view.btnAddAnt.fireEvent('click');
                }
            }, {
                key: "i",
                alt: true,
                ctrl: true,
                scope: this,
                fn: function () {
                    view.btnAddLiq.fireEvent('click');
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
                key: 'f',
                alt: true,
                scope: this,
                // ctrl: true,
                fn: function () {
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
                key: "l",
                alt: true,
                scope: this,
                fn: function () {
                    if (!view.btnLiquidar.disabled)
                        view.btnLiquidar.fireEvent('click');
                }
            }, {
                key: "r",
                alt: true,
                scope: this,
                stopEvent: true,
                fn: function () {
                    if (!view.btnReporte.disabled)
                        view.btnReporte.fireEvent('click');
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
    }
};
