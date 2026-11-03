/**
 * GestionarReembolso.Controller
 *
 * @author Ing. Roberto Linares Zamora
 * @version 1.0
 */
Ext.ns('Caja.Operaciones.Reembolso');
Caja.Operaciones.Reembolso.Controller = {
    idfuncionalidad: window.parent.idFuncionalidad,
    init: function (perfil, etiquetas, view, model, contabilizaReembolso) {
        var scope = this;
        this.initGlobalsKeys(scope, view);
        scope.totalImporte;
        scope.action = 'add';

        view.btnFondo.on({
            scope: this,
            click: function () {

                if (scope.idfondo != undefined) {
                    lMask = new Ext.LoadMask(Ext.getBody(), {
                        msg: etiquetas.lbCargando
                    });
                    lMask.show();
                }

                var objCajaFondo = new Caja.CajaFondo.WindowCajaFondo({
                    showCbMov: false,
                    showWinMod: (scope.idfondo != undefined) ? true : false,
                    tipoMov: [1]//1-Salida(Egreso)
                });

                objCajaFondo.on({
                    scope: this,
                    loadData: function () {
                        scope.idfondo = objCajaFondo.idFondo;
                        scope.idcajafondo = objCajaFondo.idCajaFondo;
                        scope.nomFondo = objCajaFondo.nomFondo;
                        scope.idmonedaEntidad = objCajaFondo.idMonedaEntidad;
                        scope.idcaja = objCajaFondo.idCaja;
                        scope.nomCaja = objCajaFondo.nomCaja;
                        scope.tipoFondo = objCajaFondo.tipoFondo;
                        view.tfFondo.setValue(scope.nomFondo);
                        Ext.MessageBox.hide();
                        model.stReembolso.baseParams.idcajafondo = scope.idcajafondo;
                        view.gridReembolso.getBottomToolbar().changePage(0);
                        //model.stReembolso.load();
                        view.btnAdicionar.enable();
                        view.btnAdicionar.focus(true, 100);
                        return;
                    },
                    show: function () {
                        if (scope.idfondo != undefined)
                            lMask.hide();
                        Ext.MessageBox.hide();
                    }
                });

                objCajaFondo.btnCancelar.on('click', function () {
                    if (scope.idfondo == undefined) {
                        window.parent.Ext.getCmp('win' + scope.idfuncionalidad).close();
                    } else
                        objCajaFondo.close();
                });
            }
        });
//-----------------------------------------------
        view.btnAdicionar.on('click', function () {
            scope.action = 'add';
            scope.ClickAddReemb();
        });
        view.btnModificar.on('click', function () {
            scope.action = 'mod';
            scope.ClickAddReemb();
            scope.cargarDatosMod();
        });
        view.btnCancelar.on('click', function () {
            scope.ClickCancelReembolso();
        });
        view.btnConfirmar.on('click', function () {
            scope.ClickConfirmarReembolso();
        });
        view.btnContabilizar.on('click', function () {
            scope.ClickContabilizarReembolso();
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
            var arrayIdCmp = view.gridReembolso.getSelectionModel().getSelected().json.arrayIdCmp;

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

        view.paginToolbar.on({
            beforechange: function () {
                model.stReembolso.baseParams.idcajafondo = scope.idcajafondo;
                model.stReembolso.baseParams.idPeriodo = Caja.Componentes.cbPeriodo.getValue();
            }
        });

        this.ClickAddReemb = function () {
            var me = this;
            view.Window(etiquetas, model, scope, contabilizaReembolso);
            view.winAddReembolso.on({
                beforeshow: function () {
                    scope.addReembolsoEvents();
                    view.tacomentario.focus(true, 1000);
                    scope.keyMap.disable();
                },
                destroy: function (windows) {
                    view.btnAdicionar.focus();
                    scope.keyMap.enable();
                },
                show: function () {
                    model.stDocumento.load({
                        params: {
                            idcajafondo: scope.idcajafondo,
                            idmovimientocaja: scope.action == 'mod' ? view.smReemb.getSelected().data.idmovimientocaja : 0
                        }, callback: function (records, options, success) {
                            if (records.length == 0) {
                                mostrarMensaje(1, etiquetas.lbNoDocPendientes);
                            }
                            me.createFormSteps(scope.action);
                        }
                    });
                    if (contabilizaReembolso) {
                        view.stCuentaCont.on({
                            scope: this,
                            load: function (st, records) {
                                if (records.length == 1) {
                                    view.cbCuentaCont.setValue(records[0].data.idcuenta);
                                }
                                if (records.length == 0) {
                                    mostrarMensaje(1, "No existen cuentas contables configuradas para realizar esta operación.");
                                }
                            }
                        });
                    }
                }
            });
            view.winAddReembolso.show();
            // view.dfdesde.setValue(fechaInicio);
            // view.dfdesde.setMinValue(fechaInicio);
            // view.dfhasta.setValue(fechaFin);
            // view.dfhasta.setMaxValue(fechaFin);
            // // view.dfFecha.setMaxValue(fechaFin);
            // view.dfFecha.setValue(fechaContable);
            model.stDocumento.removeAll();
        };

        this.createFormSteps = function (tipoAccion) {
            var gridsetup = {
                grid: view.gpDocumento,
                ordenar: 'iddoc',
                evaluar: ['iddoc', 'importe'],
                tipo: 'sm',
            };
            this.formSteps = new Ext.FormSteps(view.panelsur, view.winAddReembolso.buttons, [gridsetup]);
            this.formSteps.on({
                scope: this,
                Nuevo: function (fnNuevo, fnLimpiarCampos, fnDesabilitarForm) {
                    fnLimpiarCampos();
                    this.limpiarCampos();
                    fnDesabilitarForm(false);
                    // this.desabilitarCamposForm(false);
                    fnNuevo();
                },
                Crear: function (fnCrear, cerrarVentana, fnDesabilitarForm) {
                    var fn = function (id) {
                        // this.desabilitarCamposForm(true);
                        fnDesabilitarForm(true);
                        fnCrear.call(undefined, id);
                    }.bind(this);

                    scope.saveReembolso(cerrarVentana, fn);
                    // view.btnAdicionar.focus();

                },
                Confirmar: function (fnConfirmar, id) {
                    scope.ClickConfirmarReembolso(id, fnConfirmar);
                },
                Postear: function (fnPostear, id) {
                    var fn = fnPostear;
                    if (tipoAccion == 'mod') {
                        fn = fnPostear.createSequence(function () {
                            scope.wAdicionarMovGen.close();
                            scope.fireEvent('closeAdicionar', true);
                        }, this);
                    }
                    scope.ClickContabilizarReembolso(id, fn);
                },
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
            view.gpDocumento.getStore().reload();
        };

        this.ClickCancelReembolso = function () {
            scope.keyMap.disable();
            mostrarMensaje(2, etiquetas.lbmsgAnularReembolso, function (btnPress) {
                if (btnPress === 'ok') {
                    view.windowCacelar(etiquetas, view.smReemb.getSelected().data.fecha, model);
                    view.winCancelar.on({
                        beforeshow: function () {
                            scope.cancelarEvents();
                            model.stMotivo.load();
                            scope.keyMap.disable();
                        },
                        destroy: function (windows) {
                            view.btnAdicionar.focus();
                            scope.keyMap.enable();
                        }
                    });
                    view.winCancelar.show();
                }
                if (btnPress === 'cancel') {
                    scope.keyMap.enable();
                }
            });
        };

        this.ClickConfirmarReembolso = function (id, fnConfirmar) {
            scope.keyMap.disable();
            mostrarMensaje(2, etiquetas.lbmsgConfirmarReembolso, function (btnPress) {
                if (btnPress === 'ok') {
                    scope.confirmarReembolso(id, fnConfirmar);
                    view.btnAdicionar.focus();
                    scope.keyMap.enable();
                }
                if (btnPress === 'cancel') {
                    scope.keyMap.enable();
                }
            });
        };

        this.confirmarReembolso = function (id, fnConfirmar) {
            var arrayIdDoc = new Array();
            var selections = this.selectionsOnPaging();
            if (id) {
                arrayIdDoc.push(id);
            } else {
                for (var i = 0; i < selections.length; i++) {
                    arrayIdDoc.push((selections[i].iddocumento).toString());
                }
            }

            Ext.Msg.wait(etiquetas.lbConfirmandoReem, etiquetas.lbEspere);
            Ext.Ajax.request({
                url: 'confirmarReembolso',
                method: 'POST',
                scope: this,
                params: {
                    arrayIdDoc: Ext.encode(arrayIdDoc),
                },
                callback: function (options, success, response) {
                    Ext.Msg.hide();
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.codMg == 1) {
                        if (typeof fnConfirmar === 'function') {
                            fnConfirmar();
                        } else {
                            model.stReembolso.reload();
                            view.smReemb.clearSelections();
                        }
                        mostrarMensaje(1, etiquetas.lbConfirmSat);
                    }
                }
            });
        };

        this.selectionsOnPaging = function () {
            var arrayValues = new Array();
            var instance = new PagingToolbarSelections({
                'selections': view.gridReembolso.getSelectionModel().getSelections(),
                'activePage': view.gridReembolso.getBottomToolbar().getPageData().activePage
            });
            return instance.getSelectionsOnArray(arrayValues);
        };

        this.fDifEstados = function () {
            var flagDifEstados = false;
            var arraySelections = this.selectionsOnPaging();
            for (var i = 0; i < arraySelections.length; i++) {
                for (var j = 0; j < arraySelections.length; j++) {
                    if (arraySelections[i].idestado != arraySelections[j].idestado) {
                        flagDifEstados = true;
                        break;
                    }
                }
            }
            return flagDifEstados;
        };

        this.ClickContabilizarReembolso = function (id, fn) {
            scope.keyMap.disable();
            mostrarMensaje(2, etiquetas.lbmsgContabilizarReembolso, function (btnPress) {
                if (btnPress === 'ok') {
                    scope.contabilizarReembolso(id, fn);
                    view.btnAdicionar.focus();
                }
                if (btnPress === 'cancel') {
                    scope.keyMap.enable();
                }
            });
        };

        this.arrayIdDocumentos = function () {
            var arrayIdDocum = new Array();
            var selections = view.smDocumento.getSelections();
            for (var i = 0; i < selections.length; i++) {
                arrayIdDocum[i] = selections[i].data.iddoc;
            }
            return arrayIdDocum;
        };

        this.saveReembolso = function (cerrarVentana = true, fn) {
            Ext.Msg.wait(etiquetas.lbGuardandoReembolso, etiquetas.lbEspere);
            Ext.Ajax.request({
                url: 'guardarReembolso',
                method: 'POST',
                scope: this,
                params: {
                    documentos: Ext.encode(this.arrayIdDocumentos()),
                    descripcion: view.tacomentario.getValue(),
                    importetotal: scope.totalImporte,
                    idcajafondo: scope.idcajafondo,
                    idmonedaentidad: scope.idmonedaEntidad,
                    fecha: view.dfFecha.getRawValue(),
                    idcaja: scope.idcaja,
                    idDocumentoMod: scope.action == 'mod' ? view.smReemb.getSelected().data.iddocumento : 0,
                    idMovimientoMod: scope.action == 'mod' ? view.smReemb.getSelected().data.idmovimiento : 0,
                    idMovCajaMod: scope.action == 'mod' ? view.smReemb.getSelected().data.idmovimientocaja : 0,
                    idCuentaContrapartida: contabilizaReembolso ? view.cbCuentaCont.getValue() : null
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.codMg == -1) {
                        mostrarMensaje(1, etiquetas.lbMsgNoExistenOper);
                    }
                    if (responseData.codMg == -2) {
                        mostrarMensaje(1, etiquetas.lbMsgNoExistenTalonario);
                    }
                    if (responseData.codMg == 1) {
                        if (scope.action == 'add') {
                            mostrarMensaje(1, etiquetas.lbMsgSaveSatif);
                        } else if (scope.action == 'mod') {
                            mostrarMensaje(1, etiquetas.lbMsgModSatif);
                        }
                        if (typeof fn === 'function') {
                            fn(responseData.idDoc);
                        }
                    }
                    if (cerrarVentana) {
                        model.stReembolso.reload();
                        view.smReemb.clearSelections();
                        view.winAddReembolso.destroy();
                    }
                    Ext.Msg.hide();
                }
            });
        };

        this.contabilizarReembolso = function (id, fn) {
            param = {
                tipoContabilizacion: 1, //1 contabilizar doc confirmado | 2 revertir comprobnate contabilizado
                actionContabiliza: 'contabilizar',
                descripcion: 'Posteando reembolso: ',
            };
            this.fLoadDataComprobante(param, id, fn);
        };

        this.cancelarReembolso = function (idmotivo, fecha) {
            var params = {
                idmotivo: idmotivo,
                fecha: fecha,
                tipoContabilizacion: 2,
                descripcion: 'Cancelando reembolso: ',
            };
            if (!scope.fDifEstados() && view.smReemb.getSelected().data.idestado != 6) {
                params.contabilizado = 0;
                scope.guardarCancelacion(null, null, null, params)
            } else {
                params.contabilizado = 1;
                scope.fLoadDataComprobante(params);
            }
        };

        this.guardarCancelacion = function (idComprobante, numComprobante, fechaComprobante, params) {
            Ext.Msg.wait(etiquetas.lbCancelandoReem, etiquetas.lbEspere);

            var arrayIdDoc = new Array();
            var selections = this.selectionsOnPaging();
            for (var i = 0; i < selections.length; i++) {
                arrayIdDoc.push((selections[i].iddocumento).toString());
            }

            Ext.Ajax.request({
                method: "POST",
                url: 'cancelarReembolso',
                scope: this,
                params: {
                    arrayIdDoc: Ext.encode(arrayIdDoc),
                    idComprobante: idComprobante,
                    numComprobante: numComprobante,
                    fechaComprobante: fechaComprobante,
                    idCajaFondo: scope.idcajafondo,
                    idmotivo: params.idmotivo,
                    fecha: params.fecha,
                    contabilizado: params.contabilizado
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    Ext.Msg.hide();
                    if (responseData.codMg == 1) {
                        //this.disableBottons();
                        model.stReembolso.reload();
                        view.smReemb.clearSelections();
                        if (params.contabilizado)
                            mostrarMensaje(1, etiquetas.lbMsgCancelContabilizado + ' ' + numComprobante + '.');
                        else mostrarMensaje(1, etiquetas.lbMsgCancelReem);
                    }
                }.bind(this)
            });
        };

        this.fLoadDataComprobante = function (params, id, fn) {
            var arrayIdDoc = [];
            var arraySelections = this.selectionsOnPaging();
            if (id) {
                arrayIdDoc.push(id);
            } else {
                for (var i = 0; i < arraySelections.length; i++)
                arrayIdDoc.push(arraySelections[i].iddocumento);
            }
            Ext.Msg.wait(etiquetas.lbLoadDataComprobante, etiquetas.lbEspere);
            params.arrayIdDoc = arrayIdDoc;
            Ext.Ajax.request({
                url: 'loadDataComprobante',
                method: 'POST',
                scope: this,
                params: {
                    arrayIdDoc: Ext.encode(arrayIdDoc),
                    idCajaFondo: scope.idcajafondo,
                    tipoContabilizacion: params.tipoContabilizacion,
                    fecha: params.fecha
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    this.fShowComprobante(responseData, params, fn);
                }.bind(this)
            });
        };

        //Construir y mostrar el comprobante
        this.fShowComprobante = function (respData, params, fn) {
            var idSubsistema = 14;//Caja
            var idTipoComprobante = 3;//comprobante tipo operaciones
            var descripcion = params.descripcion + respData.descripcion;
            var detalle = params.descripcion + respData.detalle;

            //Ext.MessageBox.hide();
            Ext.Cont.Comprobante.init(idSubsistema, detalle, descripcion, respData.fechaCont, respData.dataComprobante, idTipoComprobante, 1, 1).onSaved(function (idComprobante, numComprobante, fechaComprobante) {
                Ext.Msg.wait(etiquetas.lbGuardandoComprobante, etiquetas.lbEspere);
                if (params.tipoContabilizacion === 1)
                    this.fGuardarComprobante(idComprobante, numComprobante, fechaComprobante, params, fn);
                else this.guardarCancelacion(idComprobante, numComprobante, fechaComprobante, params);
            }.bind(this)).onClose(function () {
                scope.keyMap.enable();
                noWindow = true;//para indicar que se cerro la ventana
            }.bind(this));
        };

        this.fGuardarComprobante = function (idComprobante, numeroComprobante, fechaComprobante, params, fn) {
            Ext.Ajax.request({
                method: "POST",
                url: 'contabilizarReembolso',
                scope: this,
                params: {
                    arrayIdDoc: Ext.encode(params.arrayIdDoc),
                    idComprobante: idComprobante,
                    numeroComprobante: numeroComprobante,
                    fechaComprobante: fechaComprobante,
                    idCajaFondo: scope.idcajafondo
                },
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    Ext.MessageBox.hide();
                    //this.disableBottons();
                    if (typeof fn === 'function') {
                        fn();
                    } else {
                        model.stReembolso.reload();
                        view.smReemb.clearSelections();
                    }
                    mostrarMensaje(1, etiquetas.lbMsgContabilizado + ' ' + numeroComprobante + '.');
                }.bind(this)
            });
        };

        this.cargarDatosMod = function () {
            view.dfFecha.setValue(view.smReemb.getSelected().data.fecha);
            view.tacomentario.setValue(view.smReemb.getSelected().data.comentario);

            if (!Ext.isEmpty(view.cbCuentaCont)) {
                view.cbCuentaCont.store.on({
                    load: function () {
                        view.cbCuentaCont.setValue(view.smReemb.getSelected().data.idcuentacontable);
                    }
                });
            }
            view.winAddReembolso.setTitle(etiquetas.lbModSolicitudReembolso);
        };

//--------Evento de la ventana adicionar
        this.addReembolsoEvents = function () {
            view.btnCancelarWin.on({
                click: function () {
                    model.stReembolso.reload();
                    view.smReemb.clearSelections();
                    view.winAddReembolso.destroy();
                    view.btnAdicionar.focus();
                }
            });

            view.btnAceptar.on({
                click: function () {
                    // if (model.stDocumento.getCount() == 0) {
                    //     mostrarMensaje(1, etiquetas.lbNoDocPendientes);
                    //     return;
                    // }
                    // if (view.smDocumento.getSelections().length == 0) {
                    //     mostrarMensaje(1, etiquetas.lbMsgSelectDoc);
                    //     return;
                    // } else if (view.dfFecha.getRawValue() == '') {
                    //     view.dfFecha.markInvalid();
                    //     return;
                    // } else if (view.tacomentario.getValue() == '') {
                    //     view.tacomentario.markInvalid();
                    //     return;
                    // }
                    // scope.saveReembolso();
                    // view.btnAdicionar.focus();

                }
            });

            view.btnBuscarAdd.on('click', function () {
                model.stDocumento.removeAll();
                model.stDocumento.load({
                    params: {
                        idcajafondo: scope.idcajafondo,
                        // fechaDesde: view.dfdesde.getRawValue(),
                        // fechaHasta: view.dfhasta.getRawValue(),
                    }
                });
            });

            view.smDocumento.on({
                selectionchange: function (sm) {
                    var selections = sm.getSelections();
                    scope.totalImporte = 0;
                    for (var i = 0; i < selections.length; i++) {
                        scope.totalImporte += parseFloat(Math.abs(selections[i].data.importe));
                    }
                    view.labelTotal.setText(parseFloat(scope.totalImporte).toFixed(2));
                }
            });

        }
        //--Eventos de la ventana cancelar--------------------------------
        this.cancelarEvents = function () {
            view.btnCancelarCancel.on({
                click: function () {
                    view.winCancelar.destroy();
                    view.btnAdicionar.focus();
                }
            });
            view.btnAceptarCancel.on({
                click: function () {
                    if (view.pcancelacion.getForm().isValid()) {
                        scope.cancelarReembolso(view.cbxmotivo.getValue(), view.dffechac.getRawValue());
                        view.winCancelar.close();
                        view.btnAdicionar.focus();
                    }
                }
            });
        }

//Evento para los filtros de buscar
        view.btnBuscar.on({
            scope: this,
            click: function (tf, e) {
                model.stReembolso.baseParams = {
                    numero: view.tfNumero.getValue(),
                    idestado: view.cbEstado.getValue(),
                    idcajafondo: scope.idcajafondo
                }
                model.stReembolso.load();
            }
        });

        Caja.Componentes.cbPeriodo.on({
            scope: this,
            select: function (cb, record) {
                view.gridReembolso.getBottomToolbar().changePage(0);
                //model.stReembolso.reload();
            }
        });

        model.stReembolso.on({
            scope: this,
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
                // view.smReemb.clearSelections();
                if (this.idSelected) {
                    var index = model.stReembolso.find('idmovimiento', this.idSelected);
                    view.smReemb.selectRow(index);
                    view.smReemb.fireEvent('rowclick', view.smReemb, index);
                } else {
                    view.smReemb.selectFirstRow();
                    view.smReemb.fireEvent('rowclick', view.smReemb, 0);
                }
            },
            beforeload: function () {
                model.stReembolso.baseParams.idcajafondo = scope.idcajafondo;
                model.stReembolso.baseParams.idPeriodo = Caja.Componentes.cbPeriodo.getValue();
                if (view.smReemb.hasSelection())
                    this.idSelected = view.smReemb.getSelected().data.idmovimiento;
                else this.idSelected = null;
            }
        });

//--Vista Reporte del Reembolso-------------------------
        view.btnReporte.on('click', function () {
            scope.keyMap.disable();
            this.fShowReporte();
        }, this);

        this.fShowReporte = function () {
            scope.keyMap.disable();
            Ext.Msg.wait('Cargando...', 'Espere...');
            var data = view.smReemb.getSelected().data;

            Ext.Ajax.request({
                url: 'getDataReporte',
                method: 'POST',
                params: {
                    idCajaFondo: scope.idcajafondo,
                    idDocumento: data.iddocumento,
                    fecha: data.fecha
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

        //Evento para lso filtros de buscar
        view.tfNumero.on({
            scope: this,
            keypress: function (field, e) {
                if (e.getKey() == 13 && field.getValue() != '') {
                    view.btnBuscar.fireEvent('click');
                }
            },
            keyup: function (field, e) {
                if (field.getValue() == '' && !view.cbEstado.getValue()) {
                    view.btnBuscar.disable();
                    /*if ((e.getKey() == 46 || e.getKey() == 8)) {
                     model.stReembolso.baseParams = {};
                     model.stReembolso.baseParams.idcajafondo = scope.idcajafondo;
                     model.stReembolso.load();
                     }*/
                } else view.btnBuscar.enable();
            }
        });

        view.cbEstado.on({
            scope: this,
            select: function () {
                view.btnBuscar.enable()
            },
            keypress: function (field, e) {
                if (e.getKey() == 46 || e.getKey() == 8) {
                    field.clearValue();
                    if (view.tfNumero.getValue() == '') {
                        view.btnBuscar.disable();
                        model.stReembolso.baseParams = {};
                        model.stReembolso.baseParams.idcajafondo = scope.idcajafondo;
                        model.stReembolso.load();
                    }
                }
                if (e.getKey() == 13) {
                    view.btnBuscar.fireEvent('click');
                }
            }
        });
        //-------------------------------------------
        view.gridReembolso.on({
            scope: this,
            rowClick: function () {
                var arraySelections = this.selectionsOnPaging();
                view.btnModificar.disable();
                if (arraySelections.length > 0) {
                    if (!this.fDifEstados()) {
                        if (arraySelections[0].idestado != 1 && arraySelections[0].idestado != 7 && arraySelections[0].idestado != 4) {
                            view.btnCancelar.enable();

                            if (arraySelections[0].idestado == 8) {
                                view.btnConfirmar.enable();
                            }

                            if (arraySelections[0].idestado == 5)
                                view.btnContabilizar.enable();
                        }
                    } else {
                        view.btnCancelar.disable();
                        view.btnConfirmar.disable();
                        view.btnContabilizar.disable();
                    }
                    if (arraySelections[0].estadoEnBanco) {
                        view.btnCancelar.disable();
                        view.btnConfirmar.disable();
                    }
                }
                if (arraySelections.length == 1 && arraySelections[0].idestado == 8) {
                    view.btnModificar.enable();
                }
                return;
            },
            rowdblclick: function (grid, rowIndex) {
                var arraySelections = this.selectionsOnPaging();
                if (arraySelections[0].idestado == 7)//Si esta cancelado no puede mostrar informacion en la ventana
                    return;
                //-------------
                scope.action = 'mod';
                scope.ClickAddReemb();
                scope.cargarDatosMod();
                if (arraySelections[0].idestado != 8) {
                    view.winAddReembolso.setTitle('Información del rembolso');
                    view.btnAceptar.setVisible(false);
                    view.btnNuevo.setVisible(false);
                    view.btnConfirmar.setVisible(false);
                    view.btnPostear.setVisible(false);
                    view.dfFecha.clearInvalid();
                    view.dfFecha.disable();
                    view.tacomentario.disable();
                    model.stDocumento.on({
                        load: function (store, records, options) {
                            view.smDocumento.lock();
                        }
                    });
                }
            }
        });

        view.smReemb.on({
            scope: this,
            rowselect: function (smodel, rowIndex, record) {
                view.gridReembolso.getView().addRowClass(rowIndex, "negrita");
                view.btnReporte.enable();
            },
            rowdeselect: function (smodel, rowIndex, record) {
                view.gridReembolso.getView().removeRowClass(rowIndex, "negrita");
            },
            selectionchange: function (selectionModel) {
                if (!selectionModel.hasSelection()) {
                    view.btnModificar.disable();
                    view.btnCancelar.disable();
                    view.btnConfirmar.disable();
                    view.btnContabilizar.disable();
                    view.btnReporte.disable();
                }
            }
        });

        view.gridReembolso.getView().getRowClass = function (record, index, rowParams, store) {
            if (record.json.idestado == 7) { //Cancelado
                return 'FilaRoja';
            }
            if (record.json.estadoEnBanco == 6) { //(6-Contabilizado en banco)
                return 'FilaVerde';
            }
        };

    },
    //-----------------------------------------------------
    initGlobalsKeys: function (scope, view) {

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
                key: "x",
                alt: true,
                scope: this,
                fn: function () {
                    if (!view.btnCancelar.disabled) {
                        view.btnCancelar.fireEvent('click');
                    }
                }
            }, {
                key: 'f',
                alt: true,
                scope: this,
                fn: function () {
                    if (!view.btnConfirmar.disabled) {
                        view.btnConfirmar.fireEvent('click');
                    }
                }
            }, {
                key: "t",
                alt: true,
                scope: this,
                fn: function () {
                    if (!view.btnContabilizar.disabled) {
                        view.btnContabilizar.fireEvent('click');
                    }
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
                key: "r", //Vista Reporte
                alt: true,
                fn: function () {
                    if (!view.btnReporte.disabled)
                        view.btnReporte.fireEvent('click');
                }
            }
        ]);

    }
};
