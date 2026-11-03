Ext.ns('Ext.Cont.Comprobante');
Ext.Cont.Comprobante = {
    idSubsistema: undefined,
    detalle: undefined,
    observacion: undefined,
    fechaEmision: undefined,
    anotaciones: undefined,
    idTipoComprante: undefined,
    tipoCont: undefined,
    accion: undefined,
    estado: undefined,
    idComprobante: undefined,
    idPeriodo: undefined,
    urlExterna: undefined,
    importado: undefined,
    anulado: 0,
    Anotacion: Ext.data.Record.create([{
        name: 'cuenta'
    }, {
        name: 'idcuenta'
    }, {
        name: 'moneda'
    }, {
        name: 'idmoneda'
    }, {
        name: 'idtasa'
    }, {
        name: 'debito'
    }, {
        name: 'credito'
    }, {
        name: 'tipo'
    }, {
        name: 'numerodocumento'
    }, {
        name: 'iddocumento'
    }, {
        name: 'idoperacion'
    }, {
        name: 'porciento'
    }, {
        name: 'coddocprim'
    }, {
        name: 'docobl'
    }]),
    setIdSubsistema: function (idSubsistema) {
        this.idSubsistema = idSubsistema;
        return this;
    },
    setDetalle: function (detalle) {
        this.detalle = detalle;
        return this;
    },
    setObservacion: function (observacion) {
        this.observacion = observacion;
        return this;
    },
    setFechaEmision: function (fechaEmision) {
        this.fechaEmision = fechaEmision;
        return this;
    },
    setAnotaciones: function (anotaciones) {
        this.anotaciones = anotaciones;
        return this;
    },
    setIdTipoComprante: function (idTipoComprante) {
        this.idTipoComprante = idTipoComprante;
        return this;
    },
    setTipoCont: function (tipoCont) {
        this.tipoCont = tipoCont;
        return this;
    },
    setAccion: function (accion) {
        this.accion = accion;
        return this;
    },
    setEstado: function (estado) {
        this.estado = estado;
        return this;
    },
    setIdComprobante: function (idComprobante) {
        this.idComprobante = idComprobante;
        return this;
    },
    setIdPeriodo: function (idPeriodo) {
        this.idPeriodo = idPeriodo;
        return this;
    },
    setUrlExterna: function (urlExterna) {
        this.urlExterna = urlExterna;
        return this;
    },
    setImportado: function (importado) {
        this.importado = importado;
        return this;
    },
    setAnulado: function (anulado) {
        this.anulado = anulado;
        return this;
    },
    iniciar: function () {
        this.init(
            this.idSubsistema,
            this.detalle,
            this.observacion,
            this.fechaEmision,
            this.anotaciones,
            this.idTipoComprante,
            this.tipoCont,
            this.accion,
            this.estado,
            this.idComprobante,
            this.idPeriodo,
            this.urlExterna,
            this.importado,
            this.anulado,
        );
        this.setDefault();
        return this;
    },
    setDefault: function () {
        this.idSubsistema = undefined;
        this.detalle = undefined;
        this.observacion = undefined;
        this.fechaEmision = undefined;
        this.anotaciones = undefined;
        this.idTipoComprante = undefined;
        this.tipoCont = undefined;
        this.accion = undefined;
        this.estado = undefined;
        this.idComprobante = undefined;
        this.idPeriodo = undefined;
        this.urlExterna = undefined;
        this.importado = undefined;
        this.anulado = 0;
    },
    init: function (agIdSubsistema, agDetalle, agObservacion, agFechaEmision, agAnotaciones, agIdTipoComprante, agTipoCont, agAccion, agEstado, agIdComprobante, agIdPeriodo, agUrl, agImportado, agAnulado) {
        this.initializeKeyMap(this);
        //Agrupar las anotaciones por debe y haber y luego ordenarlas por las cuentas(concatcta)
        var arrDebe = [];
        var arrHaber = [];
        var arrayIdCtas = [];
        var arrayNomCtaIncorrecta = [];

        if (agAnotaciones[0]) {
            Ext.Msg.wait('Cargando datos del comprobante', 'Por favor espere...');
            var numCmp = agAnotaciones[0].numerocomprobante;
        }

        agAnotaciones.forEach(function (item, index, allItem) {
            if (!Ext.isEmpty(item.idcuenta)) {
                arrayIdCtas.push(item.idcuenta);
            } else {
                arrayNomCtaIncorrecta.push(item.concatcta);
            }

            if (item.debitoCredito == 1) {
                arrHaber.push(item);
            } else if (item.debitoCredito == 0) {
                arrDebe.push(item);
            }
        });

        //Para mostrar un mensaje con las cuentas que vengan con idcuenta null en los pases del comprobante
        if (arrayNomCtaIncorrecta.length) {
            var msgCtaIncorrecta = 'Las siguientes cuentas son incorrectas:' + '<br>';
            for (var i = 0; i < arrayNomCtaIncorrecta.length; i++) {
                msgCtaIncorrecta += '<br>' + '- ' + arrayNomCtaIncorrecta[i];
            }
            mostrarMensaje(1, msgCtaIncorrecta)
        }

        arrHaber.sort(function (a, b) {
            if (a.concatcta > b.concatcta) {
                return 1;
            }
            if (a.concatcta < b.concatcta) {
                return -1;
            }
            // a must be equal to b
            return 0;
        });

        arrDebe.sort(function (a, b) {
            if (a.concatcta > b.concatcta) {
                return 1;
            }
            if (a.concatcta < b.concatcta) {
                return -1;
            }
            // a must be equal to b
            return 0;
        });

        agAnotaciones.splice();
        agAnotaciones = arrDebe.concat(arrHaber);

        Ext.QuickTips.init();
        var scope = this;
        scope.url = '/contabilidad/contabilidad_financiera/comprobante_operaciones/index.php/mostrarcomprobante/';
        var MyObservable = function () {
            this.addEvents({
                'saved': true,
                'close': true,
                'show': true
            });
        };
        Ext.extend(MyObservable, Ext.util.Observable);
        scope.events = new MyObservable();
        scope.setCss(".FilaVerde .x-grid3-cell-inner{color:black;background-color:#dffbda;} .FilaOscura .x-grid3-cell-inner{color:black;background-color:#D7D7D7;} .FilaRoja .x-grid3-cell-inner{color:black;background-color:#f2e2e2;}");
        scope.loadJs("/contabilidad/comun/js/ucid-util-format", 'ucid-util-format');
        scope.loadJs("/contabilidad/contabilidad_financiera/componentes/Nucleos/Comprobante/Comprobante.UI", 'ExtComprobanteUI');
        scope.perfil = window.parent.perfil;

        Ext.Ajax.request({
            method: "POST",
            url: scope.url + "comprobarFechaCmp",
            params: {
                idSubsistema: agIdSubsistema,
                agFechaEmision: (agFechaEmision instanceof Date) ? new Date(agFechaEmision).format('d/m/Y') : agFechaEmision
            },
            callback: function (options, success, response) {
                scope.realizaCmp = Ext.decode(response.responseText); console.log(response);

                if (success && !scope.realizaCmp.codMsg) {
                    if (Ext.isEmpty(agIdComprobante)) {
                        if (scope.realizaCmp == 2) {
                            mostrarMensaje(1, 'No se puede postear el comprobante ya que el subsistema Contabilidad se encuentra en Carga Inicial.');
                        } else if (scope.realizaCmp == 0) {
                            mostrarMensaje(1, 'No se puede postear el comprobante ya que el subsistema no se encuentra en el mismo período de Contabilidad.');
                        } else if (scope.realizaCmp == 3) {
                            mostrarMensaje(1, '.');
                        } else if (scope.realizaCmp == 4) {
                            mostrarMensaje(1, 'No se puede postear comprobante ya que el subsistema Contabilidad cerró el período en el que se encuentra el módulo.');
                        } else if (scope.realizaCmp == 5 && Ext.isEmpty(agIdComprobante)) {
                            mostrarMensaje(1, 'No se puede postear comprobante ya que la fecha del comprobante no concide con el período en el que se encuentra el módulo.');
                        } else if (scope.realizaCmp == 6) {
                            mostrarMensaje(1, 'La estructura no esta autorizada para postear comprobantes.');
                        }
                        else if (scope.realizaCmp == 7) {
                            mostrarMensaje(1, 'No se puede postear el comprobante ya que el subsistema Contabilidad se encuentra en Cierre de Ejercicio.');
                        }
                    }

                    Ext.Ajax.request({
                        method: "POST",
                        url: scope.url + "cargaretiquetas",
                        callback: function (options, success, response) {
                            scope.etiquetas = Ext.decode(response.responseText);
                            if (success && !scope.etiquetas.codMsg) {
                                Ext.Ajax.request({
                                    method: "POST",
                                    url: scope.url + "verificarctasentidad",
                                    params: {
                                        //anotaciones: Ext.encode(agAnotaciones)
                                        arrayIdCtas: Ext.encode(arrayIdCtas)
                                    },
                                    callback: function (options, success, response) {
                                        scope.dataCtas = Ext.decode(response.responseText);
                                        if (success && !scope.dataCtas.codMsg) {
                                            if ((scope.dataCtas.cuentasentidad.length > 0 || scope.dataCtas.inactivas.length > 0) && Ext.isEmpty(agIdComprobante)) {
                                                var mostrar = '';
                                                var entidad = '<br> ' + 'Las siguientes cuentas no se encuentran definidas en la entidad:' + '<br> <br>';
                                                for (var i = 0; i < scope.dataCtas.cuentasentidad.length; i++) {
                                                    entidad += '<br>' + '- ' + scope.dataCtas.cuentasentidad[i].concatcta;
                                                }
                                                var inactivas = '<br> ' + 'Las siguientes cuentas no se encuentran activas en la entidad:' + '<br> <br>';
                                                for (var i = 0; i < scope.dataCtas.inactivas.length; i++) {
                                                    inactivas += '<br>' + '- ' + scope.dataCtas.inactivas[i].concatcta;
                                                }
                                                if (scope.dataCtas.inactivas.length > 0 && scope.dataCtas.cuentasentidad.length > 0) {
                                                    mostrar = entidad + inactivas;
                                                } else if (scope.dataCtas.inactivas.length > 0) {
                                                    mostrar = inactivas;
                                                } else if (scope.dataCtas.cuentasentidad.length > 0) {
                                                    mostrar = entidad;
                                                }
                                                if (Ext.Msg.getDialog())
                                                    Ext.Msg.hide();
                                                mostrarMensaje(1, mostrar);
                                            } else {
                                                if (agAnotaciones.length > 0) {
                                                    scope.UI = new Ext.Cont.Comprobante.UI({
                                                        perfil: scope.perfil,
                                                        etiquetas: scope.etiquetas
                                                    });
                                                    scope.initFunciones();
                                                    scope.initEventos();
                                                    scope.UI.wComprobante.show(Ext.getBody(), function () {
                                                        this.maximize();
                                                        this.doLayout();
                                                        if (Ext.Msg.getDialog())
                                                            Ext.Msg.hide();
                                                        scope.events.fireEvent('show', scope);
                                                    });
                                                    scope.UI.wComprobante.add(scope.UI.pnlComprobante);
                                                    scope.UI.wComprobante.doLayout();

                                                    scope.generarAnotaciones();

                                                    if (!scope.UI.taDescripcion.isValid() || !scope.UI.tfDetalle.isValid()) {
                                                        scope.UI.btnAceptarComprobante.disable();
                                                    }
                                                    if (scope.realizaCmp != 1 || arrayNomCtaIncorrecta.length) {//Para cuando tenga algun motivo que impida postear no se muestre el boton
                                                        scope.UI.btnAceptarComprobante.hide();
                                                    }
                                                } else {
                                                    if (Ext.Msg.getDialog())
                                                        Ext.Msg.hide();
                                                    mostrarMensaje(1, scope.etiquetas.textErrorComprobante);
                                                }
                                            }
                                        }
                                    }
                                });
                            }
                        }
                    });
                    //}
                }
            }
        });
        scope.initFunciones = function () {
            this.generarAnotaciones = function () {
                for (var i = 0; i < agAnotaciones.length; i++) {
                    var objAnotacion = new scope.Anotacion({
                        numerodocumento: agAnotaciones[i].numero,
                        iddoc: agAnotaciones[i].iddoc,
                        iddocumento: agAnotaciones[i].idtipodocumento,
                        cuenta: agAnotaciones[i].concatcta,
                        idcuenta: agAnotaciones[i].idcuenta,
                        moneda: agAnotaciones[i].moneda,
                        idmoneda: agAnotaciones[i].idmoneda,
                        idtasa: agAnotaciones[i].idtasa,
                        idoperacion: agAnotaciones[i].idoperacioncontable,
                        porciento: agAnotaciones[i].porciento,
                        coddocprim: agAnotaciones[i].coddocprim,
                        docobl: agAnotaciones[i].docobl,
                        tipo: agAnotaciones[i].contabilidadAdicional //DETERMINA SI ES  CONTABILIDAD ADICIONAL 0|1
                    });
                    if (scope.fContDebitoCredito(agAnotaciones[i].debitoCredito, agTipoCont))
                        //objAnotacion.data.debito = agAnotaciones[i].importemb; // 2016-11-01 Se cambia importemb x importemo ya que se debe mostrar el importe original de la factura
                        objAnotacion.data.debito = parseFloat(agAnotaciones[i].importemo);
                    else
                        //objAnotacion.data.credito = agAnotaciones[i].importemb; // 2016-11-01 Se cambia importemb x importemo ya que se debe mostrar el importe original de la factura
                        objAnotacion.data.credito = parseFloat(agAnotaciones[i].importemo);
                    agAnotaciones[i] = objAnotacion;//se sobreescribe la variable de entrada para manterner la logica que estaba implementada
                }
                scope.fSetValues();
            };
            this.fContDebitoCredito = function (debCredito, tipoCont) {
                var debCred = false;
                if (debCredito === 1)
                    debCred = (tipoCont === 1) ? false : true;
                else if (debCredito === 0)
                    debCred = (tipoCont === 1) ? true : false;
                return debCred;
            };
            this.fSetValues = function () {
                var detalle = agDetalle.toString().replace(/\s+/gi, ' ');
                var observacion = agObservacion.toString().replace(/\s+/gi, ' ');
                scope.UI.tfDetalle.setValue(detalle);
                scope.UI.taDescripcion.setValue(observacion);
                scope.UI.dfFecha.setValue(agFechaEmision);
                scope.UI.dfFecha.setMinValue(agFechaEmision);
                scope.UI.dfFecha.setMaxValue(agFechaEmision);

                if (agAnotaciones[0].data.numerodocumento === undefined)
                    scope.UI.gpAnotaciones.getColumnModel().setHidden(0, true);
                scope.UI.stAnotaciones.add(agAnotaciones);
            };
            this.fImporteEnAnotacionIgualEnDesglose = function (data) {
                var importe = scope.fRedondear(parseFloat((data.credito !== undefined) ? data.credito : data.debito), 2);
                var importeAnexo = 0;
                for (var i = 0; i < data.anexos.length; i++)
                    importeAnexo += parseFloat(data.anexos[i].data.importe);
                return ((importe - scope.fRedondear(importeAnexo, 2)) === 0);
            };
            this.fCerrarComprobante = function () {
                scope.UI.wComprobante.hide();
                scope.events.fireEvent('close', this);
            };
            this.fGuardarComprobante = function () {
                scope.lMaskGuardarComprobante = scope.UI.lMask(scope.UI.wComprobante.body, scope.etiquetas.msgGuardar);
                scope.lMaskGuardarComprobante.show();
                Ext.Ajax.request({
                    method: "POST",
                    url: agUrl ? agUrl : scope.url + "guardarComprobante",
                    autoAbort: true,
                    timeout: 1800000,
                    params: {
                        detalle: scope.UI.tfDetalle.getValue(),
                        observacion: scope.UI.taDescripcion.getValue(),
                        fechaEmision: scope.UI.dfFecha.getRawValue(),
                        idSubsistema: agIdSubsistema,
                        idTipoComprobante: agIdTipoComprante,
                        idPeriodo: agIdPeriodo,
                        anotaciones: Ext.encode(scope.fListaAnotaciones()),
                        agImportado: agImportado,
                        anulado: agAnulado
                    },
                    callback: function (options, success, response) {
                        scope.responseText = Ext.decode(response.responseText);
                        scope.lMaskGuardarComprobante.hide();
                        if (scope.responseText.idComprobante == '') {
                            if (scope.responseText.nombreCta)
                                mostrarMensaje(1, 'Las siguientes cuentas no son de último nivel: ' + scope.responseText.nombreCta);
                            scope.UI.btnCerrarComprobante.enable();
                        } else if (scope.responseText.codMsg == -1) {//Si ya genero comprobante para ese documento
                            mostrarMensaje(1, 'El documento que deseas postear ya generó comprobante. Verifique.');
                            scope.UI.btnCerrarComprobante.enable();
                        } else if (scope.responseText.codMsg != 3 && scope.responseText.mensaje == undefined) {
                            scope.events.fireEvent('saved', scope.responseText.idComprobante, scope.responseText.numComprobante, scope.responseText.fechaContable);
                            scope.UI.wComprobante.hide();
                        }
                    }
                });
            };
            this.fListaAnotaciones = function () {
                var listAnotaciones = new Array();
                for (var i = 0; i < agAnotaciones.length; i++) {
                    agAnotaciones[i].data.fechaemision = scope.UI.dfFecha.getRawValue();
                    listAnotaciones.push(agAnotaciones[i].data);
                }
                return listAnotaciones;
            };
            this.fRedondear = function (numero, decimales) {
                var flotante = parseFloat(numero);
                var resultado = Math.round(flotante * Math.pow(10, decimales)) / Math.pow(10, decimales);
                return resultado;
            };
            this.fObtenerDatosComprobante = function () {
                var url = '/contabilidad/contabilidad_financiera/comprobante_operaciones/index.php/registrodecomprobantes/';
                Ext.CONT.Componentes.MessageBox('msgbIniciando', scope.etiquetas.lbLoadData, scope.etiquetas.lbEsperando);
                // Ext.Ajax.request({
                //     timeout: 300000,
                //     url: url + 'obtenerDatosImprimirReporte',
                //     params: {
                //         reporteParams: Ext.encode(new Array({idcomprobante: agIdComprobante}))
                //     },
                //     callback: function (options, success, response) {
                //         var responseData = Ext.decode(response.responseText);
                //         Ext.CONT.Componentes.HideBox('msgbIniciando');
                //         if (responseData.dataSources.length > 0) {
                //
                //         } else {
                //             mostrarMensaje(1, scope.etiquetas.lbNoData);
                //         }
                //     }
                // });
                Ext.CONT.Componentes.HideBox('msgbIniciando');
                scope.fOpenWindowReport({
                    datoGeneral: {
                        reporte: '100',
                        titulo: 'Comprobante_Operaciones',
                        idComprobante: agIdComprobante
                    },
                    datoCuerpo: [],
                    datoParametros: [{idcomprobante: agIdComprobante}]
                });
            };
            this.fOpenWindowReport = function (requestDataSources) {
                var winReportCmp = new SCFPrintView(requestDataSources, "/contabilidad/comun/SCFPrintView/", {
                    paperSize: "FOLIO",
                    orientation: "Horizontal",
                    reportType: "HTML",
                    typeAction: 'report'
                });
                winReportCmp.show();
            };
            this.fExportComprobante = function () {
                var dataExportCmp = {
                    datoGeneral: {
                        reporte: '100',
                        titulo: 'Comprobante_Operaciones',
                        idComprobante: -1,
                        fechaemision: scope.UI.dfFecha.getRawValue(),
                        detalle: scope.UI.tfDetalle.getValue(),
                        observacion: scope.UI.taDescripcion.getValue()
                    },
                    datoCuerpo: scope.fListaAnotaciones()
                };
                var winExportCmp = new SCFPrintData(dataExportCmp, "/contabilidad/comun/SCFPrintView/", {
                    reportType: 'DBF',
                    typeAction: 'export'
                });
                winExportCmp.show();
                winExportCmp.doLayout();
            };
        };
        scope.initEventos = function () {
            scope.UI.btnExportar.on('click', function (component) {
                if (!document.getElementById('SCFPrintData')) {
                    // scope.loadJs("/contabilidad/comun/SCFPrintView/views/js/SCFPrintData.min", 'SCFPrintData');
                    scope.loadJs("/contabilidad/comun/SCFPrintView/views/js/SCFPrintData", 'SCFPrintData');
                }
                scope.fExportComprobante();
            });
            scope.UI.btnVistaPrevia.on('click', function () {
                scope.fObtenerDatosComprobante();
            });
            scope.UI.btnAceptarComprobante.on('click', function () {
                scope.UI.btnAceptarComprobante.disable();
                scope.UI.btnAceptarComprobante.hide();
                scope.UI.btnExportar.disable();
                scope.UI.btnExportar.hide();
                scope.UI.btnCerrarComprobante.disable();
                scope.UI.tfDetalle.disable();
                scope.UI.taDescripcion.disable();
                scope.fGuardarComprobante();
            });
            scope.UI.btnCerrarComprobante.on('click', function () {
                scope.fCerrarComprobante();
            });
            scope.UI.stAnotaciones.on({
                add: function (store, records, index) {
                    scope.totalDebito = scope.fRedondear(store.sum('debito'), 2);
                    scope.totalCredito = scope.fRedondear(store.sum('credito'), 2);
                    scope.UI.nfTotalDebito.setText('<b>' + formatoMonedaABS(scope.totalDebito) + '</b>', false);
                    scope.UI.nfTotalCredito.setText('<b>' + formatoMonedaABS(scope.totalCredito) + '</b>', false);
                    scope.flagTerminado = ((parseFloat(scope.totalDebito) * 1 === parseFloat(scope.totalCredito) * 1) && ((parseFloat(scope.totalDebito) * 1 !== 0) && (parseFloat(scope.totalCredito) * 1 !== 0))) ? true : false;
                    scope.UI.lbEstadoComprobante.setText(((scope.flagTerminado) ? scope.etiquetas.textEstadoTerminado : scope.etiquetas.textEstadoError), false);
                    scope.UI.btnAceptarComprobante.setVisible((scope.flagTerminado && agAccion === 1) ? true : false);
                    //Para que no permita editar estos campos si ya esta posteado
                    if (scope.flagTerminado && agAccion === 1) {
                        scope.UI.taDescripcion.enable();
                        scope.UI.tfDetalle.enable();
                    } else {
                        scope.UI.taDescripcion.disable();
                        scope.UI.tfDetalle.disable();
                    }
                    //
                    // scope.UI.btnExportar.setVisible((scope.flagTerminado && agAccion === 1) ? true : false);
                    scope.UI.btnVistaPrevia.setVisible((agIdSubsistema == 4 && agAccion === 0) ? true : false);//solo para contabilidad
                    if (agEstado && scope.flagTerminado) {
                        scope.UI.lbEstadoComprobante.setText(agEstado);
                    } else if (scope.flagTerminado) {//Si todavia no se ha generado el comprobante
                        scope.UI.lbEstadoComprobante.setText('SIN ERROR');
                    }
                    if (numCmp)
                        scope.UI.lbNroComprobante.setText(numCmp);
                    else {
                        scope.UI.lbNroComprobante.setVisible(false);
                        scope.UI.textItemNoComprobante.setVisible(false);
                    }

                    scope.UI.bbgpAnotaciones.show();
                }
            });
            scope.UI.smAnotaciones.on({
                rowselect: function (sm, rowIndex, record) {
                    scope.UI.tbgpAnotaciones.setVisible(false);
                    scope.UI.gpAnotaciones.syncSize();
                    scope.UI.wComprobante.doLayout(true);
                },
                rowdeselect: function (sm, rowIndex, record) {
                    scope.UI.tbgpAnotaciones.setVisible(false);
                    scope.UI.gpAnotaciones.syncSize();
                    scope.UI.wComprobante.doLayout(true);
                }
            });
        };
        return this;
    },
    loadJs: function (jsSrc, id) {
        if (jsSrc != null) {
            var tagScript = document.createElement("script");
            tagScript.setAttribute("type", "text/javascript");
            tagScript.setAttribute("id", id);
            tagScript.setAttribute("src", jsSrc + ".js");
            document.getElementsByTagName("body")[0].appendChild(tagScript);
        }
    },
    loadCss: function (cssHref) {
        if (cssHref != null) {
            var tagStyle = document.createElement("style");
            tagStyle.setAttribute("type", "text/css");
            tagStyle.setAttribute("href", cssHref + ".css");
            document.getElementsByTagName("head")[0].appendChild(tagStyle);
        }
    },
    setCss: function (css) {
        var tag = document.createElement("style");
        tag.type = "text/css";
        if (tag.styleSheet)
            tag.styleSheet.cssText = css;
        else
            tag.appendChild(document.createTextNode(css));
        document.getElementsByTagName("head")[0].appendChild(tag);
    },
    onSaved: function (fn) {
        this.events.on('saved', fn);
        return this;
    },
    onClose: function (fn) {
        this.events.on('close', fn);
        return this;
    },
    onShow: function (fn) {
        this.events.on('show', fn);
        return this;
    },
    initializeKeyMap: function (scope) {
        var keyMapCmp = new Ext.KeyMap(document, [
            {
                key: Ext.EventObject.ESC,//ESCAPE Cerrar ventana
                alt: false,
                fn: function () {
                    scope.UI.wComprobante.hide();
                    scope.events.fireEvent('close', this);
                    keyMapCmp.disable();
                }
            }
        ]);
    }
};
