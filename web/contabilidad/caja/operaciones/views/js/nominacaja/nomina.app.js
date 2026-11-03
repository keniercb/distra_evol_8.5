/**
 * Created by furet on 13/10/15.
 */
Ext.namespace('Caja.Nomina');

Ext.QuickTips.init();

Ext.Ajax.request({
    method: "POST",
    url: "cargaretiquetas",
    callback: function (options, success, response) {
        var responseText = Ext.decode(response.responseText);
        new Caja.Nomina.Viewport({
            idioma: responseText,
            perfil: window.parent.perfil
        });
    }
});
//-----------------------------------------------------------------------------
Caja.Nomina.Viewport = Ext.extend(Ext.Viewport, {
    constructor: function (params) {
        Ext.apply(this, params);
        // Ext.Msg.wait(params.idioma.lbCargando, params.idioma.lbEspere);
        Ext.Ajax.request({
            url: 'loadDataIni',
            scope: this,
            callback: function (options, success, response) {
                var response = Ext.decode(response.responseText);
                if (success) {
                    if (response.codMg == -1) {
                        mostrarMensaje(1, 'No existen operaciones configuradas para realizar esta acción');
                        this.panelGeneral.disable();
                        return;
                    }
                    fechaContable = response.dataFecha.fechacontable;
                    periodoActual = response.dataFecha.nombre;
                    fechaInicio = response.dataFecha.inicio;
                    fechaFin = response.dataFecha.fin;
                    ejercicioActual = response.ejercicio;
                    Caja.Nomina.arrayOperacion = response.arrayOperacion;
                    Caja.Nomina.contabilizaSolicitud = response.contabilizaSolicitud;

                    if (response.aperturado != 1) {
                        this.panelGeneral.disable();
                        mostrarMensaje(1, params.idioma.lbCargaInicial, function (btn) {
                            if (btn == 'ok' || btn == 'cencel')
                                this.panelGeneral.disable();
                        }.bind(this));
                        return;
                    } else {
                        this.btnFondo.fireEvent('click');
                    }
                    this.lfdPeriodo.setText('Fecha contable: ' + fechaContable);
                    // this.panelNomina.btnFondo.fireEvent('click');
                }
            }.bind(this)
        });
        //------------------------------------------------
        this.panelPersonas = new Caja.Nomina.PanelPersonas({
            idioma: params.idioma,
            perfil: params.perfil,
            scope: this,
            region: 'center',
            layout: 'fit',
            border: false,
            frame: false,
            split: true,
            // height: Ext.lib.Dom.getViewHeight() * 0.70,
        });

        this.panelNomina = new Caja.Nomina.PanelNomina({
            idioma: params.idioma,
            perfil: params.perfil,
            scope: this,
            region: 'center',
            // height: Ext.lib.Dom.getViewHeight() * 0.30,
            frame: false,
            border: false,
        });

        this.panelNomina2 = new Ext.Panel({
            title: this.idioma.lbNominas,
            region: 'south',
            layout: 'border',
            collapsible: true,
            collapsed: true,
            height: Ext.lib.Dom.getViewHeight() * 0.30,
            items: [this.panelNomina]
        });

        this.lfdTotalPagar = new Ext.form.Label({
            text: 'Total a pagar',
            style: 'font-weight:bold;color:#0E5CBE'
        });

        this.panelEast = new Ext.Panel({
            region: 'east',
            layout: 'border',
            frame: false,
            border: false,
            width: Ext.lib.Dom.getViewWidth() * 0.50,
            items: [this.panelPersonas, this.panelNomina2],
            bbar: [this.lfdTotalPagar, '->', this.btnGuardar = new Ext.Button({
                selectOnFocus: true,
                disabled: true,
                iconCls: 'guardar',
                text: this.idioma.lbGuardar,
                tooltip: this.idioma.lbToolActualiar
            })]
        });

        this.panelPeriodo = new Caja.Nomina.PanelPeriodo({
            idioma: params.idioma,
            perfil: params.perfil,
            region: 'center',
            layout: 'fit',
            border: true,
            frame: false,
            split: true,
            scope: this,
            tbar: [
                this.btnSolicitar = new Ext.Button({
                    disabled: true,
                    iconCls: 'plantrabajodescanso',
                    text: this.idioma.lbSolicitar,
                    tooltip: this.idioma.lbToolSolicitar
                }),
                this.btnCancelar = new Ext.Button({
                    disabled: true,
                    // hidden: true,
                    iconCls: 'cancelar',
                    text: this.idioma.lbCancelar,
                    tooltip: this.idioma.lbToolCancelar
                }),
                this.btnConfirmar = new Ext.Button({
                    disabled: true,
                    iconCls: 'confirmar',
                    text: this.idioma.lbConfirmar,
                    tooltip: this.idioma.lbToolConfirmar
                }),
                this.btnPostear = new Ext.Button({
                    disabled: true,
                    iconCls: 'contabilidad',
                    text: this.idioma.lbPostear,
                    tooltip: this.idioma.lbToolPostear
                })],
            bbar: [
                '->', this.btnActualizar = new Ext.Button({
                    iconCls: 'actualizar',
                    text: this.idioma.lbActualizar,
                    tooltip: this.idioma.lbToolActualizar,
                    listeners: {
                        scope: this,
                        click: function (tf, e) {
                            this.panelPeriodo.stPeriodo.reload();
                        }
                    }
                })
            ]
        });

        this.panelGeneral = new Ext.Panel({
            layout: 'border',
            border: false,
            frame: false,
            items: [this.panelPeriodo, this.panelEast],
            tbar: ['->',
                this.lfdPeriodo = new Ext.form.Label({
                    text: ' ',
                    style: 'font-weight:bold;'
                }), '-',
                this.lfdSaldo = new Ext.form.Label({
                    text: 'Saldo dispoible',
                    style: 'font-weight:bold;color:#0E5CBE'
                }), '-',
                this.btnFondo = new Ext.Button({
                    text: this.idioma.lbFondo,
                    tooltip: this.idioma.lbToolFondo,
                    //icon: this.perfil.dirImg + 'abrirventana.png',
                    iconCls: 'fondo'
                }),
                this.tfFondo = new Ext.form.TextField({
                    scope: this,
                    disabledClass: 'disabled-component',
                    selectOnFocus: true,
                    id: 'tfFondo',
                    disabled: true,
                    width: 150,
                    anchor: '100%'
                }), '-',
                this.btnAyuda = new Ext.Button({
                    id: 'btnAyudaPagoNomina',
                    text: this.idioma.lbBtnAyuda,
                    tooltip: this.idioma.lbToolAyuda,
                    //icon: this.perfil.dirImg + 'ayuda.png',
                    iconCls: 'ayuda'
                })
            ]
        });

        Ext.apply(this, params);
        Ext.apply(this, {
            layout: 'fit',
            items: [this.panelGeneral]
        });
        this.initGlobalsKeys();
        this.initEventos();
        this.initFunctions();
        Caja.Nomina.Viewport.superclass.constructor.call(this, params);
    },
    initGlobalsKeys: function () {

        this.globalKeyMap = new Ext.KeyMap(Ext.getBody());
        this.globalKeyMap.accessKey = function (key, handler, scope) {
            var h = function (n, e) {
                e.preventDefault();
                handler.call(scope || this, n, e);
            };
            this.on(key, h, scope);
        };

        //Mapa de teclas de nomina
        this.globalKeyMap.accessKey({
            key: 's',
            alt: true
        }, function () {
            if (!this.btnSolicitar.disabled) {
                this.btnSolicitar.fireEvent('click');
            }
        }, this);

        this.globalKeyMap.accessKey({
            key: 'f',
            alt: true
        }, function () {
            if (!this.btnConfirmar.disabled) {
                this.btnConfirmar.fireEvent('click');
            }
        }, this);

        this.globalKeyMap.accessKey({
            key: 't',
            alt: true
        }, function () {
            if (!this.btnPostear.disabled) {
                this.btnPostear.fireEvent('click');
            }
        }, this);

    },
    initEventos: function () {
        this.btnFondo.on({
            scope: this,
            click: function () {
                var objCajaFondo = new Caja.CajaFondo.WindowCajaFondo({
                    showCbMov: false,
                    showWinMod: (this.idfondo > 0) ? true : false,
                    tipoMov: [5], //5-Para nominacaja
                });

                if (this.idfondo > 0) {
                    this.loadMask();
                }

                objCajaFondo.on({
                    scope: this,
                    loadData: function () {
                        this.idfondo = objCajaFondo.idFondo;
                        this.idCajaFondo = objCajaFondo.idCajaFondo;
                        this.denominacion = objCajaFondo.nomFondo;
                        this.idMonedaEntidad = objCajaFondo.idMonedaEntidad;
                        this.idMoneda = objCajaFondo.idMoneda;
                        this.idcaja = objCajaFondo.idCaja;
                        this.denominacion = objCajaFondo.nomCaja;
                        this.tipoFondo = objCajaFondo.tipoFondo;
                        this.saldoActual = objCajaFondo.saldoActual;
                        Ext.getCmp('tfFondo').setValue(objCajaFondo.nomFondo);
                        Ext.MessageBox.hide();
                        this.panelPeriodo.stPeriodo.baseParams.idmoneda = this.idMoneda;
                        this.panelPeriodo.stPeriodo.baseParams.idCajaFondo = this.idCajaFondo;
                        this.panelPeriodo.stPeriodo.load();
                        this.lfdSaldo.setText('Saldo: ' + this.saldoActual);
                        this.btnSolicitar.focus(true, true);
                    },
                    show: function () {
                        if (this.idfondo != undefined)
                            this.lMask.hide();
                    }
                });

                objCajaFondo.btnCancelar.on('click', function () {
                    if (this.idfondo == "") {
                        window.parent.Ext.getCmp('win' + scope.idfuncionalidad).close();
                    } else
                        objCajaFondo.close();
                });
            }
        });

        this.btnSolicitar.on({
            scope: this,
            click: function () {
                this.globalKeyMap.disable();
                mostrarMensaje(2, this.idioma.lbSolicitarExtraccion, function (btnPress) {
                    if (btnPress === 'ok') {
                        var windowSolicitar = new Caja.Nomina.WindowSolicitar(this);
                        windowSolicitar.show();
                        windowSolicitar.on({
                            scope: this,
                            close: function () {
                                this.globalKeyMap.enable();
                            }
                        });
                    }
                    if (btnPress === 'cancel') {
                        this.globalKeyMap.enable();
                    }
                }.bind(this));
            }
        });

        this.btnGuardar.on({
            scope: this,
            click: function () {
                this.guardarNomina();
            }
        });

        this.btnConfirmar.on({
            scope: this,
            click: function () {
                this.globalKeyMap.disable();
                var montoPagado = this.panelPeriodo.smPeriodo.getSelected().data.montopagado;
                var mgConfirmar = this.idioma.lbConfirmPago;
                if(montoPagado == 0)
                    mgConfirmar = 'El siguiente pago a confirmar <span style="color: red"><b>NO TIENE PERSONAS SELECCIONADAS, ESTO GENERARÁ OBLIGACIONES POR PAGAR</b></span>. Está seguro que desea realizar la acción?';
                mostrarMensaje(2, mgConfirmar, function (btnPress) {
                    if (btnPress === 'ok') {
                        this.confirmarNomina();
                    }
                    if (btnPress === 'cancel') {
                        this.globalKeyMap.enable();
                    }
                }.bind(this));
            }
        });

        this.btnPostear.on({
            scope: this,
            click: function () {
                this.globalKeyMap.disable();
                mostrarMensaje(2, this.idioma.lbPostearPago, function (btnPress) {
                    if (btnPress === 'ok') {
                        this.contabilizarNomina();
                    }
                    if (btnPress === 'cancel') {
                        this.globalKeyMap.enable();
                    }
                }.bind(this));
            }
        });

        this.btnCancelar.on({
            scope: this,
            click: function () {
                this.globalKeyMap.disable();
                mostrarMensaje(2, this.idioma.lbCancelPago, function (btnPress) {
                    if (btnPress === 'ok') {
                        var windowCancelar = new Caja.Nomina.WindowCancelar(this);
                        windowCancelar.show();
                        windowCancelar.on({
                            scope: this,
                            close: function () {
                                this.globalKeyMap.enable();
                            }
                        });
                    }
                    if (btnPress === 'cancel') {
                        this.globalKeyMap.enable();
                    }
                }.bind(this));
            }
        });
    },
    initFunctions: function () {
        this.solicitarEfectivo = function (fecha, idOperacion, idCtaContrapartida) {
            var arrayPerona = new Array();
            var range = this.panelPersonas.stPersonas.getRange();
            for (var i = 0; i < range.length; i++) {
                arrayPerona.push(range[i].data);
            }
            var dataPeriodo = this.panelPeriodo.smPeriodo.getSelected().data;
            Ext.Msg.wait(this.idioma.lbGuardando, this.idioma.lbEspere);
            Ext.Ajax.request({
                url: 'solicitarEfectivo',
                method: 'POST',
                scope: this,
                params: {
                    peronas: Ext.encode(arrayPerona),
                    idCajaFondo: this.idCajaFondo,
                    idMonedaEntidad: this.idMonedaEntidad,
                    idfechacierrenomina: dataPeriodo.idfechacierrenomina,
                    fechacierrenomina: dataPeriodo.fechacierrenomina,
                    monto: dataPeriodo.monto,
                    fecha: fecha,
                    idOperacion: idOperacion,
                    idCtaContrapartida: Caja.Nomina.contabilizaSolicitud ? idCtaContrapartida : null
                },
                callback: function (options, success, response) {
                    Ext.Msg.hide();
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.codMg == -1) {
                        mostrarMensaje(1, this.idioma.lbNoOperacion);
                    } else if (responseData.codMg == 1) {
                        this.btnSolicitar.disable();
                        this.panelPeriodo.stPeriodo.reload();
                        mostrarMensaje(1, this.idioma.lbSolicitudSat);
                    }
                }.bind(this)
            });
        };

        this.guardarNomina = function () {
            var arrayPerona = new Array();
            var arrayTemp = new Array();
            var temp = {};
            var range = this.panelPersonas.stPersonas.getRange();
            for (var i = 0; i < range.length; i++) {
                // arrayPerona.push(range[i].data);
                //arrayTemp = [];
                temp = {
                    idpersona: range[i].get('idpersona'),
                    importeactualizar: range[i].get('importeactualizar'),
                    pagos: range[i].get('pagos'),
                };
                /*range[i].get('pagos').forEach(function (item) {
                    console.log(item);
                    arrayTemp.push({
                        tipopago: item.tipopago,
                        monto: item.monto,
                        cobro: item.cobro,
                    });
                });
                //temp.pagos = arrayTemp;*/
                arrayPerona.push(temp);
            }
            var dataPeriodo = this.panelPeriodo.smPeriodo.getSelected().data;
            Ext.Msg.wait(this.idioma.lbGuardando, this.idioma.lbEspere);
            Ext.Ajax.request({
                url: 'guardarNomina',
                method: 'POST',
                scope: this,
                params: {
                    peronas: Ext.encode(arrayPerona),
                    idCajaFondo: this.idCajaFondo,
                    idMonedaEntidad: this.idMonedaEntidad,
                    idfechacierrenomina: dataPeriodo.idfechacierrenomina,
                    fechacierrenomina: dataPeriodo.fechacierrenomina,
                    idmovimiento: dataPeriodo.idmovimiento,
                    idnominacaja: dataPeriodo.idnominacaja,
                    montopagado: dataPeriodo.montopagado
                },
                callback: function (options, success, response) {
                    Ext.Msg.hide();
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.codMg == -1) {
                        mostrarMensaje(1, this.idioma.lbNoOperacion);
                    }
                    if (responseData.codMg == -2) {
                        mostrarMensaje(1, this.idioma.lbSaldoInsuficiente);
                    }
                    if (responseData.codMg == 1) {
                        this.panelPeriodo.stPeriodo.reload();
                        //this.panelPersonas.stPersonas.reload();
                        this.panelNomina.stNomina.removeAll();
                        this.btnGuardar.disable();
                        mostrarMensaje(1, this.idioma.lbGuardarSat);
                        this.panelPersonas.isSavePersona = true;
                    }
                }.bind(this)
            });
        };

        this.confirmarNomina = function () {
            var dataPeriodo = this.panelPeriodo.smPeriodo.getSelected().data;
            Ext.Msg.wait(this.idioma.lbConfirmando, this.idioma.lbEspere);
            Ext.Ajax.request({
                url: 'confirmarNomina',
                method: 'POST',
                scope: this,
                params: {
                    iddocumento: dataPeriodo.iddocumento,
                    idCajaFondo: this.idCajaFondo,
                    idNominaCaja: dataPeriodo.idnominacaja
                },
                callback: function (options, success, response) {
                    Ext.Msg.hide();
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.codMg == 1) {
                        this.panelPeriodo.stPeriodo.reload();
                        //this.panelPersonas.stPersonas.reload();
                        this.panelNomina.stNomina.removeAll();
                        this.btnConfirmar.disable();
                        mostrarMensaje(1, this.idioma.lbMsgConfirmPago);
                    } else {
                        mostrarMensaje(1, 'Por favor verifique que se haya emitido el instrumento bancario para realizar el pago de nómina.');
                    }
                }.bind(this)
            });
        };

        this.cancelarNomina = function (idmotivo, fecha) {
            var dataPeriodo = this.panelPeriodo.smPeriodo.getSelected().data;
            var idEstado = dataPeriodo.idestado;
            var params = {
                idmotivo: idmotivo,
                fecha: fecha,
                tipoContabilizacion: 2,
                descripcion: 'Cancelando nómina por pagar: '
            };

            if (idEstado == 6) {//6-Posteado
                params.contabilizado = 1;
                params.tipoContabilizacion = 2;//2-Cancelando pago
                params.idCtaContrapartida = dataPeriodo.idcuentacontrapartida;
                this.fLoadDataComprobante(params);
            } else {
                params.contabilizado = 0;
                this.guardarCancelacion(null, null, null, params)
            }
        };

        this.contabilizarNomina = function () {
            var dataPeriodo = this.panelPeriodo.smPeriodo.getSelected().data;
            var param = {
                iddocumento: dataPeriodo.iddocumento,
                tipoContabilizacion: 1, //1 contabilizar doc confirmado | 2 revertir comprobnate contabilizado
                actionContabiliza: 'contabilizar',
                descripcion: 'Posteando nómina: '
            };
            this.fLoadDataComprobante(param);
        };

        this.guardarCancelacion = function (idComprobante, numComprobante, fechaComprobante, params) {
            Ext.Msg.wait(this.idioma.lbCancelando, this.idioma.lbEspere);
            var dataPeriodo = this.panelPeriodo.smPeriodo.getSelected().data;
            var idDocumento = dataPeriodo.iddocumento;

            Ext.Ajax.request({
                method: "POST",
                url: 'cancelarNomina',
                scope: this,
                params: {
                    idDoc: idDocumento,
                    idComprobante: idComprobante,
                    numComprobante: numComprobante,
                    fechaComprobante: fechaComprobante,
                    idCajaFondo: this.idCajaFondo,
                    idmotivo: params.idmotivo,
                    fecha: params.fecha,
                    idNominaCaja: dataPeriodo.idnominacaja,
                    contabilizado: params.contabilizado,
                    idMoneda: this.idMoneda
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    Ext.Msg.hide();
                    this.panelPersonas.stPersonas.removeAll();
                    this.panelNomina.stNomina.removeAll();
                    this.panelPeriodo.stPeriodo.reload();
                    if (params.contabilizado)
                        mostrarMensaje(1, this.idioma.lbMsgCancelContabilizado + ' ' + numComprobante + '.');
                    else mostrarMensaje(1, this.idioma.lbMsgCancelPago);
                }.bind(this)
            });
        };

        this.fLoadDataComprobante = function (params) {
            Ext.Msg.wait(this.idioma.lbLoadDataComprobante, this.idioma.lbEspere);
            var dataPeriodo = this.panelPeriodo.smPeriodo.getSelected().data;
            var idDocumento = dataPeriodo.iddocumento;
            var totalMomina = dataPeriodo.monto;
            var pagado = dataPeriodo.montopagado;
            var idcuentacontrapartida = dataPeriodo.idcuentacontrapartida;
            params.idDoc = idDocumento;

            Ext.Ajax.request({
                url: 'loadDataComprobante',
                method: 'POST',
                scope: this,
                params: {
                    idDoc: idDocumento,
                    totalMomina: totalMomina,
                    pagado: pagado,
                    idCajaFondo: this.idCajaFondo,
                    tipoContabilizacion: params.tipoContabilizacion,
                    idCtaContrapartida: idcuentacontrapartida ? idcuentacontrapartida : null
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.codMg == -1) {
                        mostrarMensaje(1, this.idioma.lbNoOperacion);
                        Ext.MessageBox.hide();
                    } else if (responseData.codMg == -2) {
                        mostrarMensaje(1, this.idioma.lbNoModelo);
                        Ext.MessageBox.hide();
                    } else if (responseData.codMg == -3) {
                        mostrarMensaje(1, 'No se puede cancelar el pago seleccionado debido a que se realizaron liquidaciones a las obligaciones fijadas.');
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
            params.idDocPrim = respData.idDocPrim;
            //Ext.MessageBox.hide();
            Ext.Cont.Comprobante.init(idSubsistema, detalle, descripcion, respData.fechaCont, respData.dataComprobante, idTipoComprobante, 1, 1).onSaved(function (idComprobante, numComprobante, fechaComprobante) {
                Ext.Msg.wait(this.idioma.lbGuardandoComprobante, this.idioma.lbEspere);
                if (params.tipoContabilizacion === 1)//1-Postear pago de nómina
                    this.fGuardarComprobante(idComprobante, numComprobante, fechaComprobante, params, respData.pasePorPagar);
                else if (params.tipoContabilizacion === 2) {//Cancelar pago de nómina
                    this.guardarCancelacion(idComprobante, numComprobante, fechaComprobante, params);
                }
            }.bind(this)).onClose(function () {
                this.globalKeyMap.enable();
                noWindow = true;//para indicar que se cerro la ventana
            }.bind(this));
        };

        this.fGuardarComprobante = function (idComprobante, numeroComprobante, fechaComprobante, params, pasePorPagar) {
            var dataPeriodo = this.panelPeriodo.smPeriodo.getSelected().data;
            Ext.Ajax.request({
                method: "POST",
                url: 'contabilizarPagoNomina',
                scope: this,
                params: {
                    idDocumento: params.iddocumento,
                    idComprobante: idComprobante,
                    numeroComprobante: numeroComprobante,
                    fechaComprobante: fechaComprobante,
                    idCajaFondo: this.idCajaFondo,
                    idMoneda: this.idMoneda,
                    //idfechacierrenomina: dataPeriodo.idfechacierrenomina,
                    idNominaCaja: dataPeriodo.idnominacaja,
                    pasePorPagar: Ext.encode(pasePorPagar),
                    idDocPrim: params.idDocPrim
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    Ext.MessageBox.hide();
                    this.panelPeriodo.stPeriodo.reload();
                    this.btnPostear.disable();
                    mostrarMensaje(1, this.idioma.lbMsgContabilizado + ' ' + numeroComprobante + '.');
                }.bind(this)
            });
        };

        this.loadMask = function () {
            //lMask = new Ext.LoadMask(this.body, {
            this.lMask = new Ext.LoadMask(Ext.getBody(), {
                msg: this.idioma.lbCargando
            });
            this.lMask.show();
        };
    }
});