//Empaquetando el componente conciliacion
Ext.ns('Banco.Conciliacion');

//Controller del componente conciliacion.
Banco.Conciliacion.Controller = {
    /**
     *Inicializar el controlador de la vista.
     * 
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param view Vista del componente Conciliacion
     * @param model Modelo de la vista del componente Conciliacion
     */
    init: function(idioma, view, model) {
        controller = this;
        this.fechas = {};
        this.respConciliacion = '';//guarda los datos de la conciliacion realizada
        this.search = false;

        //cargar el listado de estados de cta
        /* model.stConciliaciones.load({
         params: {
         start: 0,
         limit: 20
         }
         });*/

        //accion de btn adicionar conciliacion
        view.btnConciliar.on('click', function() {
            if (!view.windowopen) {
                controller.openConciliacion();
            }
        });

        //accion de btn eliminar conciliacion
        view.btnEliminar.on('click', function() {
            if (!view.windowopen) {
                controller.eliminarConciliacion();
            }
        });
        //accion de btn ver conciliacion
        view.btnVer.on('click', function() {
            if (!view.windowopen) {
                controller.loadDataVerConciliacion();
            }
        });

        view.btnImprimirConc.on({
            scope: this,
            click: function() {
                if (!view.windowopen) {
                    controller.openReporteConciliacion();
                }
            }
        });

        //accion de btn ayuda conciliacion
//        view.btnAyuda.on('click', function() {
//            //ayuda.show(2, '/contabilidad/banco/estadocuenta/', 'btnAyudaconciliacion');
//        });

        //evento al seleccionar la conciliacion
        view.gpConciliaciones.getSelectionModel().on('rowselect', function(sm, rowindex, record) {
            view.btnEliminar.enable();
            view.btnVer.enable();
        });

        //evento al deseleccionar la conciliacion
        view.gpConciliaciones.getSelectionModel().on('rowdeselect', function(sm, rowindex, record) {
            view.btnEliminar.disable();
            view.btnVer.disable();
        });

        //accion para el btn del botón buscar
        view.btnBuscar.on({
            click: function() {
                if (!view.windowopen) {
                    controller.buscarConciliacion();
                }
            }
        });

        view.dfBuscar.on({
            invalid: function() {
                view.btnBuscar.setDisabled(true);
            },
            valid: function() {
                view.btnBuscar.setDisabled(false);

                if (view.dfBuscar.getRawValue() == '') {
                    view.btnBuscar.setDisabled(true);
                }
            },
            keyup: function(datefield, event) {
                if (event.getKey() == 13 && !view.btnBuscar.disabled && !view.windowopen) {
                    controller.buscarConciliacion();
                }
            }
        });

        view.paginToolbar.btnClearFilter.on({
            scope: this,
            click: function() {
                this.search = false;
                view.dfBuscar.reset();
            }
        });

        model.stConciliaciones.on({
            scope: this,
            beforeload: function(store) {
                if (view.dfBuscar.getRawValue()) {
                    this.search = true;
                    store.baseParams.fecha = view.dfBuscar.getRawValue();
                }
            }
        });

        //evento al recargar el grid de las conciliaciones
        model.stConciliaciones.on('load', function(store, records, options) {
            if (store.getCount() == 0) {
                var msg = (this.search) ? idioma.msgEmptyDataSearch : idioma.msgEmptyData;
                mostrarMensaje(1, msg);
            }
            view.btnEliminar.disable();
            view.btnVer.disable();
        }, this);

        //evento al ocultarse
        view.winConcBancaria.on('hide', function() {
            view.windowopen = false;
            controller.cleanConciliacion();
            //model.stConciliaciones.reload();
        });

        //teclas de acceso rapido    
        //adicionar conciliacion
        view.globalKeyMap.accessKey({
            key: 'o',
            alt: true
        }, function() {
            if (!view.windowopen) {
                controller.openConciliacion();
            }
        }, Ext.getBody());

        //eliminar conciliacion
        view.globalKeyMap.accessKey({
            key: Ext.EventObject.DELETE
        }, function() {
            if (!view.windowopen && !view.btnEliminar.disabled) {
                if (view.gpConciliaciones.getSelectionModel().getSelected()) {
                    controller.eliminarConciliacion();
                }
            }
        }, Ext.getBody());

        //ver conciliacion
        view.globalKeyMap.accessKey({
            key: 'd',
            alt: true
        }, function() {
            if (!view.windowopen && !view.btnVer.disabled) {
                controller.loadDataVerConciliacion();
            }
        }, Ext.getBody());

        //ayuda conciliacion
        view.globalKeyMap.accessKey({
            key: 'r',
            alt: true
        }, function() {
            if (!view.windowopen && !view.btnImprimirConc.disabled) {
                controller.openReporteConciliacion();
            }
        }
        , Ext.getBody());

        view.globalKeyMap.accessKey({
            key: 'b',
            alt: true
        }, function() {
            if (!view.btnBuscar.disabled && !view.windowopen) {
                controller.buscarConciliacion();
            }
        }
        , Ext.getBody());

        //evento al mostrarse
        view.winConcBancaria.on('show', function() {
            view.windowopen = true;
            controller.MostrarMensaje(idioma.msgLoad);
            view.lfDatosConciliacion.setText(idioma.lbMonedaSucursal);
            view.cbTipoConciliacion.setValue(1);
            view.cbTipoConciliacion.fireEvent('select', view.cbTipoConciliacion.getValue(), this);
            if (view.actionbtn == 'conc') {//si se esta conciliando se carga la cta                
                model.stCuentaBancaria.load();
            }

            //Key map del inicio y fin del formulario
            var btnAccept = view.btnAceptar;
            btnAccept.getEl().addKeyMap([
                {
                    key: Ext.EventObject.TAB,
                    stopEvent: true,
                    fn: function() {
                        view.dfFechaConciliacion.focus(true, true);
                    }
                }
            ]);

            view.dfFechaConciliacion.getEl().addKeyMap([
                {
                    key: Ext.EventObject.TAB,
                    shift: true,
                    stopEvent: true,
                    fn: function() {
                        btnAccept.focus();
                    }
                }
            ]);
        });

        //accion de btn cancelar
        view.btnCancelar.on('click', function() {
            view.winConcBancaria.hide();
        });

        //accion de btn cerrar
        view.btnCerrar.on('click', function() {
            view.winConcBancaria.hide();
        });

        //accion de btn aplicar
        view.btnAplicar.on('click', function() {
            controller.adicionarConciliacion('apli');
        });

        //accion de btn aceptar
        view.btnAceptar.on('click', function() {
            controller.adicionarConciliacion('add');
        });

        //evento para el ENTER
        view.dfFechaConciliacion.on('keypress', function(df, event) {
            if (event.getKey() == 13) {
                if (!df.getValue()) {
                    df.setValue(controller.fechas.fechaCont);
                    view.cbCuentaBancaria.focus(false, 100);
                }
                else if (df.getValue() && df.isValid()) {
                    view.cbCuentaBancaria.focus(false, 100);
                }
                if (df.getValue() && view.cbCuentaBancaria.isValid()) {
                    view.cbCuentaBancaria.fireEvent('select', this);
                }
            }
        });

        //evento al cargar la cta bancaria
        model.stCuentaBancaria.on('load', function(store, records, options) {
            view.cbCuentaBancaria.setDisabled(false);
            view.dfFechaConciliacion.setDisabled(false);
            if (view.dfFechaConciliacion.getRawValue()) {
                view.cbCuentaBancaria.focus(false, 100);

                if (store.getCount() == 1) {
                    var idctabanc = store.getAt(0).data.idcuenta;
                    view.cbCuentaBancaria.setValue(idctabanc);

                    view.cbCuentaBancaria.fireEvent('select', this);
                }
            }
            else {
                view.dfFechaConciliacion.focus(false, 100);
            }

            loadMask.hide();
            if (store.getCount() > 0) {
                model.stCreditoBanco.removeAll();
                model.stDebitoBanco.removeAll();
                model.stCreditoLibro.removeAll();
                model.stDebitoLibro.removeAll();
                model.stCtaContable.removeAll();
            } else {
                mostrarMensaje(1, idioma.msgNoCtaBancaria);
            }
        }, this);

        //evento para el ENTER
        view.cbCuentaBancaria.on('keypress', function(combo, event) {
            if (event.getKey() === 13) {
                if (!combo.getValue()) {
                    //combo.setValue(model.stCuentaBancaria.getAt(0).get('idcuenta'));
                    //combo.setRawValue(model.stCuentaBancaria.getAt(0).get('nombrecuentabancaria'));
                    //combo.fireEvent('select', combo);
                    combo.reset();
                    combo.focus(true, true);
                }
            }
        });

        //evento al mostrarse
        view.cbCuentaBancaria.on('render', function(component) {
            component.getEl().on('mouseover', function() {
                if (component.getValue() !== idioma.lbEmptyMsg && component.getValue().length > 0)
                    controller.fToolTipShow(component, component.getRawValue());
            });
        });

        //enento al seleccionar la cta bancaria
        view.cbCuentaBancaria.on('select', function(combo, record, index) {
            if (view.dfFechaConciliacion.isValid()) {
                controller.MostrarMensaje(idioma.msgLoad);
                if (!record) {
                    index = model.stCuentaBancaria.find('idcuenta', view.cbCuentaBancaria.getValue());
                    if (index !== -1)
                        record = model.stCuentaBancaria.getAt(index);
                }

                if (record.data.nomsucursal)
                    view.lfDatosConciliacion.setText(idioma.lbMoneda + record.data.codigoiso + '. ' + idioma.lbSucursal + record.data.nomsucursal + '.');
                else
                    view.lfDatosConciliacion.setText(idioma.lbMoneda + record.data.codigoiso + '. ' + idioma.lbBanco + record.data.nombanco + '.');
                controller.loadDataConciliacion(record.data.idcuenta, record.data.moneda);
            }
        });

        //enento al seleccionar el metodo de conciliacion
        view.cbTipoConciliacion.on('select', function(combo, record, index) {
            if (this.getValue() == 0) {
                view.pSaldoAjustado.setVisible(true);
                view.pSegunBanco.setVisible(false);
                view.pSegunLibro.setVisible(false);
            }
            else if (this.getValue() == 1) {
                view.pSaldoAjustado.setVisible(false);
                view.pSegunBanco.setVisible(false);
                view.pSegunLibro.setVisible(true);
            } else {
                view.pSaldoAjustado.setVisible(false);
                view.pSegunBanco.setVisible(true);
                view.pSegunLibro.setVisible(false);
            }
        });

        //carga los datos iniciales y valida la apertura
        this.loadDataIni = function() {
            controller.MostrarMensaje(idioma.msgLoad);
            Ext.Ajax.request({
                url: 'loadDataIni',
                method: 'POST',
                params: {
                    start: 0,
                    limit: view.gpConciliaciones.getBottomToolbar().pageSize
                },
                callback: function(options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    if (responseData.aperturado == 0) {//0=ci, 1=aperturado

                        mostrarMensaje(1, idioma.msgNoCierreCi, function() {
                            view.viewPort.disable();
                            view.gpConciliaciones.disable();
                            view.windowopen = true;
                        });
                    }
                    else {
                        //cargar el listado de estados de cta
                        model.stConciliaciones.loadData(responseData.gridConc);
                        controller.fechas = responseData.fechaCont;
                        if (controller.fechas.fechai) {
                            view.dfFechaConciliacion.setMinValue(controller.fechas.fechai);
                            view.dfFechaConciliacion.setMaxValue(controller.fechas.fechafin);

                            var msg = 'Período actual: ' + responseData.periodo.nombre;
                            msg += ' desde ' + responseData.periodo.inicio + ' hasta ' + responseData.periodo.fin + ' | Fecha contable: ' + responseData.periodo.fechacontable;
                            view.labelPeriodo.setText(msg);

                        } else {
                            mostrarMensaje(1, idioma.msgNoFechaPeriodo);
                        }
                    }

                    view.btnConciliar.focus();
                    loadMask.hide();
                }//callback
            });
        };

        //carga los datos de la conciliacion
        this.loadDataConciliacion = function(idcuenta, idmoneda) {
            var crlibro = 0;
            var dblibro = 0;
            var crbanco = 0;
            var dbbanco = 0;
            //se cargan los grid
            Ext.Ajax.request({
                url: 'cargardatosconc',
                method: 'POST',
                params: {
                    idcuenta: idcuenta,
                    fecha: view.dfFechaConciliacion.getRawValue(),
                    idmoneda: idmoneda
                },
                callback: function(options, success, response) {
                    if (success) {
                        var data = Ext.decode(response.responseText);
                        controller.respConciliacion = data;
                        //GRIDS CON EL DESGLOSE DE LOS SALDOS
                        //se llenan los grid del libro
                        model.stDebitoLibro.removeAll();
                        model.stCreditoLibro.removeAll();
                        libro = data.libro;
                        for (var i = 0; i < libro.transito.length; i++) {//credito
                            crlibro += parseFloat(libro.transito[i].importemo);
                            model.stCreditoLibro.add(new model.recLibro(libro.transito[i]));
                        }
                        for (var i = 0; i < libro.depositar.length; i++) {//debito
                            dblibro += parseFloat(libro.depositar[i].importemo);
                            model.stDebitoLibro.add(new model.recLibro(libro.depositar[i]));
                        }
                        //se llenan los totales libro
                        view.tfTotaldebLibro.setValue(formatoMonedaABS(dblibro));
                        view.tfTotalcredLibro.setValue(formatoMonedaABS(crlibro));

                        //se llenan los grid de banco
                        model.stCreditoBanco.removeAll();
                        model.stDebitoBanco.removeAll();
                        banco = data.banco;
                        for (var i = 0; i < banco.length; i++) {
                            if (banco[i].diferenciamo < 0) {//credito
                                crbanco += parseFloat(banco[i].diferenciamo);
                                model.stCreditoBanco.add(new model.recBanco(banco[i]));
                            } else {//debito
                                dbbanco += parseFloat(banco[i].diferenciamo);
                                model.stDebitoBanco.add(new model.recBanco(banco[i]));
                            }
                        }
                        //se llenan los totales banco
                        view.tfTotaldebBanco.setValue(formatoMonedaABS(dbbanco));
                        view.tfTotalcredBanco.setValue(formatoMonedaABS(crbanco));

                        //SALDOS ACTUALES DE BANCO Y LIBRO
                        //saldo actual libro por los tres metodos
                        /*view.tfSaldoActLibroAjust.setValue(formatoMonedaABS(data.saldolibro));
                        view.tfSaldoActLibroLib.setValue(formatoMonedaABS(data.saldolibro));
                        view.tfSaldoActLibroBanc.setValue(formatoMonedaABS(data.saldolibro));*/
                        view.tfSaldoActLibroAjust.setValue(formatoMoneda(data.saldolibro));
                        view.tfSaldoActLibroLib.setValue(formatoMoneda(data.saldolibro));
                        view.tfSaldoActLibroBanc.setValue(formatoMoneda(data.saldolibro));
                        //saldo actual banco por los tres metodos
                        /*view.tfSaldoActBancoAjust.setValue(formatoMonedaABS(data.saldobanco));
                        view.tfSaldoActBancoLib.setValue(formatoMonedaABS(data.saldobanco));
                        view.tfSaldoActBancoBanc.setValue(formatoMonedaABS(data.saldobanco));*/
                        view.tfSaldoActBancoAjust.setValue(formatoMoneda(data.saldobanco));
                        view.tfSaldoActBancoLib.setValue(formatoMoneda(data.saldobanco));
                        view.tfSaldoActBancoBanc.setValue(formatoMoneda(data.saldobanco));

                        view.tfDebitoLibroAjust.setValue(formatoMonedaABS(dblibro));
                        view.tfDebitoLibroLib.setValue(formatoMonedaABS(dblibro));
                        view.tfDebitoLibroBanc.setValue(formatoMonedaABS(dblibro));

                        view.tfCreditoLibroAjust.setValue(formatoMonedaABS(crlibro));
                        view.tfCreditoLibroLib.setValue(formatoMonedaABS(crlibro));
                        view.tfCreditoLibroBanc.setValue(formatoMonedaABS(crlibro));

                        view.tfCreditoBancoAjust.setValue(formatoMonedaABS(crbanco));
                        view.tfCreditoBancoLib.setValue(formatoMonedaABS(crbanco));
                        view.tfCreditoBancoBanc.setValue(formatoMonedaABS(crbanco));

                        view.tfDebitoBancoAjust.setValue(formatoMonedaABS(dbbanco));
                        view.tfDebitoBancoLib.setValue(formatoMonedaABS(dbbanco));
                        view.tfDebitoBancoBanc.setValue(formatoMonedaABS(dbbanco));

                        dbbanco = (dbbanco < 0) ? dbbanco * (-1) : dbbanco;
                        crlibro = (crlibro < 0) ? crlibro * (-1) : crlibro;
                        //metodo saldo ajustado
                        var saldoajlibro = parseFloat(data.saldolibro) + Math.abs(crbanco) - Math.abs(dbbanco);
                        //view.tfSaldoAjustLibroAjust.setValue(formatoMonedaABS(saldoajlibro));
                        view.tfSaldoAjustLibroAjust.setValue(formatoMoneda(saldoajlibro));

                        var saldoajbanco = parseFloat(data.saldobanco) + Math.abs(dblibro) - Math.abs(crlibro);
                        //view.tfSaldoAjustBancoAjust.setValue(formatoMonedaABS(saldoajbanco));
                        view.tfSaldoAjustBancoAjust.setValue(formatoMoneda(saldoajbanco));

                        //metodo saldo ajustado segun libro
                        var saldoajlibroSSL = parseFloat(data.saldolibro) + Math.abs(crbanco) - Math.abs(dbbanco) - Math.abs(dblibro) + Math.abs(crlibro);
                        /*view.tfSaldoAjustLibroLib.setValue(formatoMonedaABS(saldoajlibroSSL));
                        view.tfSaldoAjustLibroBanc.setValue(formatoMonedaABS(parseFloat(data.saldolibro)));*/
                        view.tfSaldoAjustLibroLib.setValue(formatoMoneda(saldoajlibroSSL));
                        view.tfSaldoAjustLibroBanc.setValue(formatoMoneda(parseFloat(data.saldolibro)));

                        //metodo saldo ajustado segun banco
                        var saldoajbancoSSB = parseFloat(data.saldobanco) + Math.abs(dblibro) - Math.abs(crlibro) - Math.abs(crbanco) + Math.abs(dbbanco);
                        /*view.tfSaldoAjustBancoBanc.setValue(formatoMonedaABS(saldoajbancoSSB));
                        view.tfSaldoAjustBancoLib.setValue(formatoMonedaABS(parseFloat(data.saldobanco)));*/
                        view.tfSaldoAjustBancoBanc.setValue(formatoMoneda(saldoajbancoSSB));
                        view.tfSaldoAjustBancoLib.setValue(formatoMoneda(parseFloat(data.saldobanco)));

                        //Validacion para cuando devuelve -0.00
                        if (parseFloat(saldoajbanco).toFixed(2) == "-0.00")
                            saldoajbanco = 0;
                        if (parseFloat(saldoajlibro).toFixed(2) == "-0.00")
                            saldoajlibro = 0;
                        //-----------------------------
                        if (parseFloat(saldoajbanco).toFixed(2) === parseFloat(saldoajlibro).toFixed(2)) {
                            mostrarMensaje(1, idioma.msgCtaConciliada);
                        }
                        else {
                            mostrarMensaje(1, idioma.msgNoCtaConciliada);
                        }
                        view.btnAceptar.focus();

                        //GRID DE LAS CUENTAS CONTABLES
                        if (data.contables) {
                            totdifctacont = 0;
                            for (var k = 0; k < data.contables.cant; k++)
                                totdifctacont += parseFloat(data.contables.datos[k].importe);
                            model.stCtaContable.loadData(data.contables);
                            view.tfTotalctaCont.setValue(formatoMonedaABS(totdifctacont));
                        }
                        else {
                            mostrarMensaje(1, idioma.msgNoCtaContables);
                            view.cbCuentaBancaria.clearValue();
                            view.cbCuentaBancaria.focus();
                        }

                        view.btnAplicar.enable();
                        view.btnAceptar.enable();
                        loadMask.hide();
                    } else {
                        view.btnAplicar.disable();
                        view.btnAceptar.disable();
                        Ext.Msg.alert(response.statusText, response.responseText);
                    }
                }//end callback
            });
        };

        //evento antes de cargar las ctas contables
        model.stCtaContable.on('beforeload', function(store, options) {
            store.clearFilter(true);
            if (view.cbCuentaBancaria.getValue()) {
                model.stCtaContable.baseParams.idctabancaria = view.cbCuentaBancaria.getValue();
                model.stCtaContable.baseParams.idmoneda = model.stCuentaBancaria.getAt(model.stCuentaBancaria.find('idcuenta', view.cbCuentaBancaria.getValue())).data.moneda;
                model.stCtaContable.baseParams.fecha = view.dfFechaConciliacion.getRawValue();
            }
        });

        //abre la vista para adicionar las conciliaciones
        this.openConciliacion = function() {
            view.actionbtn = 'conc';
            view.winConcBancaria.show();
            view.winConcBancaria.center();
            view.winConcBancaria.setTitle(idioma.lbGridConcBancaria);
            view.dfFechaConciliacion.setValue(controller.fechas.fechaCont);
            view.btnCancelar.show();
            view.btnAplicar.show();
            view.btnAceptar.show();
            view.btnCerrar.hide();
            view.winConcBancaria.doLayout();
            view.cbCuentaBancaria.isValid();
        };

        //limpia los datos de la conciliacion
        this.cleanConciliacion = function() {
            model.stCreditoBanco.removeAll();
            model.stDebitoBanco.removeAll();
            model.stCreditoLibro.removeAll();
            model.stDebitoLibro.removeAll();
            model.stCtaContable.removeAll();

            view.tfSaldoActLibroAjust.setValue(formatoMonedaABS(0));
            view.tfSaldoActLibroLib.setValue(formatoMonedaABS(0));
            view.tfSaldoActLibroBanc.setValue(formatoMonedaABS(0));
            //saldo actual banco por los tres metodos
            view.tfSaldoActBancoAjust.setValue(formatoMonedaABS(0));
            view.tfSaldoActBancoLib.setValue(formatoMonedaABS(0));
            view.tfSaldoActBancoBanc.setValue(formatoMonedaABS(0));

            view.tfDebitoLibroAjust.setValue(formatoMonedaABS(0));
            view.tfDebitoLibroLib.setValue(formatoMonedaABS(0));
            view.tfDebitoLibroBanc.setValue(formatoMonedaABS(0));

            view.tfCreditoLibroAjust.setValue(formatoMonedaABS(0));
            view.tfCreditoLibroLib.setValue(formatoMonedaABS(0));
            view.tfCreditoLibroBanc.setValue(formatoMonedaABS(0));

            view.tfCreditoBancoAjust.setValue(formatoMonedaABS(0));
            view.tfCreditoBancoLib.setValue(formatoMonedaABS(0));
            view.tfCreditoBancoBanc.setValue(formatoMonedaABS(0));

            view.tfDebitoBancoAjust.setValue(formatoMonedaABS(0));
            view.tfDebitoBancoLib.setValue(formatoMonedaABS(0));
            view.tfDebitoBancoBanc.setValue(formatoMonedaABS(0));

            //metodo saldo ajustado
            view.tfSaldoAjustLibroAjust.setValue(formatoMonedaABS(0));
            view.tfSaldoAjustBancoAjust.setValue(formatoMonedaABS(0));

            //metodo saldo ajustado segun libro
            view.tfSaldoAjustLibroLib.setValue(formatoMonedaABS(0));
            view.tfSaldoAjustLibroBanc.setValue(formatoMonedaABS(0));

            //metodo saldo ajustado segun banco
            view.tfSaldoAjustBancoBanc.setValue(formatoMonedaABS(0));
            view.tfSaldoAjustBancoLib.setValue(formatoMonedaABS(0));

            view.tfTotaldebLibro.setValue(formatoMonedaABS(0));
            view.tfTotalctaCont.setValue(formatoMonedaABS(0));
            view.tfTotalcredBanco.setValue(formatoMonedaABS(0));
            view.tfTotaldebBanco.setValue(formatoMonedaABS(0));
            view.tfTotalcredLibro.setValue(formatoMonedaABS(0));

            view.cbCuentaBancaria.reset();
            view.dfFechaConciliacion.reset();

            view.btnAplicar.disable();
            view.btnAceptar.disable();
        };

        //adiciona la conciliacion bancaria
        this.adicionarConciliacion = function(btn) {
            if (!controller.existeDatosConciliacion() && view.cbCuentaBancaria.isValid() && view.dfFechaConciliacion.isValid()) {
                controller.loadMessageBox(idioma.msgGuardando);
                index = model.stCuentaBancaria.find('idcuenta', view.cbCuentaBancaria.getValue());
                if (index !== -1)
                    record = model.stCuentaBancaria.getAt(index);

                Ext.Ajax.request({
                    url: 'adicionarconciliacion',
                    method: 'POST',
                    params: {
                        idcuentabancaria: view.cbCuentaBancaria.getValue(),
                        idmoneda: record.data.moneda,
                        fecha: view.dfFechaConciliacion.getRawValue(),
                        //saldoajustadolibro: cleanComa(view.tfSaldoAjustLibroLib.getValue()),
                        saldoajustadolibro: cleanFormatoMoneda(view.tfSaldoAjustLibroLib.getValue()),
                        dataConciliacion: Ext.encode(controller.respConciliacion)
                    },
                    callback: function(options, success, response) {
                        var result = eval(response.responseText);
                        Ext.MessageBox.hide();
                        switch (result) {
                            case 1:
                                model.stConciliaciones.reload();
                                mostrarMensaje(1, idioma.msgGuardado);
                                view.cbCuentaBancaria.clearValue();
                                if (btn === 'add')
                                    view.winConcBancaria.hide();
                                else
                                    controller.cleanConciliacion();
                                break;
                            case 2:
                                mostrarMensaje(3, idioma.msgErrorGuardar);
                                break;
                            case 3:
                                mostrarMensaje(3, idioma.msgErrorEnvio);
                                break;
                            case 4:
                                mostrarMensaje(1, idioma.msgEquals + view.dfFechaConciliacion.getRawValue() + '.');
                                break;
                            default:
                                mostrarMensaje(3, idioma.msgErrorGuardar);
                        }
                    }
                });
            }
        };

        //verifica que la conciliacion tenga datos
        this.existeDatosConciliacion = function() {
            return ((model.stCreditoBanco.getCount() === 0) &&
                    (model.stDebitoBanco.getCount() === 0) &&
                    (model.stCreditoLibro.getCount() === 0) &&
                    (model.stDebitoLibro.getCount() === 0) &&
                    (model.stCtaContable.getCount() === 0));
        };

        //carga los datos de la conciliacion para verlos
        this.loadDataVerConciliacion = function() {
            view.actionbtn = 'ver';
            view.winConcBancaria.show();
            view.winConcBancaria.center();
            view.winConcBancaria.setTitle(idioma.lbTitleVer);
            view.btnCancelar.hide();
            view.btnAplicar.hide();
            view.btnAceptar.hide();
            view.btnCerrar.show();
            view.winConcBancaria.doLayout();
            var crlibro = 0;
            var dblibro = 0;
            var crbanco = 0;
            var dbbanco = 0;

            model.stCreditoBanco.removeAll();
            model.stDebitoBanco.removeAll();
            model.stCreditoLibro.removeAll();
            model.stDebitoLibro.removeAll();
            model.stCtaContable.removeAll();

            dataConciliacion = view.gpConciliaciones.getSelectionModel().getSelected().data;

            Ext.Ajax.request({
                url: 'cargarconciliacionver',
                method: 'POST',
                params: {
                    idconciliacion: dataConciliacion.idconciliacionbancaria,
                    idcuenta: dataConciliacion.idcuentabancaria
                },
                callback: function(options, success, response) {
                    loadMask.hide();
                    if (success) {
                        data = Ext.decode(response.responseText);
                        view.cbCuentaBancaria.setValue(data.cta.idcuenta);
                        view.cbCuentaBancaria.setRawValue(data.cta.nombrecuentabancaria);
                        view.dfFechaConciliacion.setValue(dataConciliacion.fecha);
                        view.cbCuentaBancaria.setDisabled(true);
                        view.dfFechaConciliacion.setDisabled(true);

                        //se cargan moneda,banco,sucursal
                        if (data.cta.nomsucursal)
                            view.lfDatosConciliacion.setText(idioma.lbMoneda + data.cta.codigoiso + '. ' + idioma.lbSucursal + data.cta.nomsucursal + '.');
                        else
                            view.lfDatosConciliacion.setText(idioma.lbMoneda + data.cta.codigoiso + '. ' + idioma.lbBanco + data.cta.nombanco + '.');

                        //se llenan los grid del libro
                        if (data.hisbanco.length > 0) {
                            for (var i = 0; i < data.hisbanco.length; i++) {
                                if (parseFloat(data.hisbanco[i].importemo) < 0) {
                                    crlibro += parseFloat(data.hisbanco[i].importemo);
                                    model.stCreditoLibro.add(new model.recLibro(data.hisbanco[i]));
                                } else {
                                    dblibro += parseFloat(data.hisbanco[i].importemo);
                                    model.stDebitoLibro.add(new model.recLibro(data.hisbanco[i]));
                                }
                            }
                        }
                        //se llenan los totales libro
                        view.tfTotaldebLibro.setValue(formatoMonedaABS(dblibro));
                        view.tfTotalcredLibro.setValue(formatoMonedaABS(crlibro));

                        //se llenan los grid de banco
                        if (data.hislibro.length > 0) {
                            for (i = 0; i < data.hislibro.length; i++) {
                                if (parseFloat(data.hislibro[i].diferenciamo) < 0) {
                                    crbanco += parseFloat(data.hislibro[i].diferenciamo);
                                    model.stCreditoBanco.add(new model.recBanco(data.hislibro[i]));
                                } else {
                                    dbbanco += parseFloat(data.hislibro[i].diferenciamo);
                                    model.stDebitoBanco.add(new model.recBanco(data.hislibro[i]));
                                }
                            }
                        }
                        //se llenan los totales banco
                        view.tfTotaldebBanco.setValue(formatoMonedaABS(dbbanco));
                        view.tfTotalcredBanco.setValue(formatoMonedaABS(crbanco));

                        //GRID DE LAS CUENTAS CONTABLES
                        if (data.hisctacontable.length > 0) {
                            totdifctacont = 0;
                            for (var k = 0; k < data.hisctacontable.length; k++) {
                                totdifctacont += parseFloat(data.hisctacontable[k].saldomo);
                                model.stCtaContable.add(new Ext.data.Record({
                                    idcuentacontable: data.hisctacontable[k].idcuenta,
                                    nombrecuentacontable: data.hisctacontable[k].nombrecuentacontable,
                                    importe: data.hisctacontable[k].saldomo
                                }));
                            }
                            view.tfTotalctaCont.setValue(formatoMonedaABS(totdifctacont));
                        }

                        //SALDOS ACTUALES DE BANCO Y LIBRO
                        //saldo actual libro por los tres metodos
                        /*view.tfSaldoActLibroAjust.setValue(formatoMonedaABS(dataConciliacion.saldoactuallibro));
                        view.tfSaldoActLibroLib.setValue(formatoMonedaABS(dataConciliacion.saldoactuallibro));
                        view.tfSaldoActLibroBanc.setValue(formatoMonedaABS(dataConciliacion.saldoactuallibro));*/
                        view.tfSaldoActLibroAjust.setValue(formatoMoneda(dataConciliacion.saldoactuallibro));
                        view.tfSaldoActLibroLib.setValue(formatoMoneda(dataConciliacion.saldoactuallibro));
                        view.tfSaldoActLibroBanc.setValue(formatoMoneda(dataConciliacion.saldoactuallibro));
                        //saldo actual banco por los tres metodos
                        /*view.tfSaldoActBancoAjust.setValue(formatoMonedaABS(dataConciliacion.saldoactualbanco));
                        view.tfSaldoActBancoLib.setValue(formatoMonedaABS(dataConciliacion.saldoactualbanco));
                        view.tfSaldoActBancoBanc.setValue(formatoMonedaABS(dataConciliacion.saldoactualbanco));*/
                        view.tfSaldoActBancoAjust.setValue(formatoMoneda(dataConciliacion.saldoactualbanco));
                        view.tfSaldoActBancoLib.setValue(formatoMoneda(dataConciliacion.saldoactualbanco));
                        view.tfSaldoActBancoBanc.setValue(formatoMoneda(dataConciliacion.saldoactualbanco));

                        view.tfDebitoLibroAjust.setValue(formatoMonedaABS(dblibro));
                        view.tfDebitoLibroLib.setValue(formatoMonedaABS(dblibro));
                        view.tfDebitoLibroBanc.setValue(formatoMonedaABS(dblibro));

                        view.tfCreditoLibroAjust.setValue(formatoMonedaABS(crlibro));
                        view.tfCreditoLibroLib.setValue(formatoMonedaABS(crlibro));
                        view.tfCreditoLibroBanc.setValue(formatoMonedaABS(crlibro));

                        view.tfCreditoBancoAjust.setValue(formatoMonedaABS(crbanco));
                        view.tfCreditoBancoLib.setValue(formatoMonedaABS(crbanco));
                        view.tfCreditoBancoBanc.setValue(formatoMonedaABS(crbanco));

                        view.tfDebitoBancoAjust.setValue(formatoMonedaABS(dbbanco));
                        view.tfDebitoBancoLib.setValue(formatoMonedaABS(dbbanco));
                        view.tfDebitoBancoBanc.setValue(formatoMonedaABS(dbbanco));

                        dbbanco = (dbbanco < 0) ? dbbanco * (-1) : dbbanco;
                        crlibro = (crlibro < 0) ? crlibro * (-1) : crlibro;
                        //metodo saldo ajustado
                        var saldoajlibro = parseFloat(dataConciliacion.saldoactuallibro) + Math.abs(crbanco) - Math.abs(dbbanco);
                        //view.tfSaldoAjustLibroAjust.setValue(formatoMonedaABS(saldoajlibro));
                        view.tfSaldoAjustLibroAjust.setValue(formatoMoneda(saldoajlibro));

                        var saldoajbanco = parseFloat(dataConciliacion.saldoactualbanco) + Math.abs(dblibro) - Math.abs(crlibro);
                        //view.tfSaldoAjustBancoAjust.setValue(formatoMonedaABS(saldoajbanco));
                        view.tfSaldoAjustBancoAjust.setValue(formatoMoneda(saldoajbanco));

                        //metodo saldo ajustado segun libro
                        var saldoajlibroSSL = parseFloat(dataConciliacion.saldoactuallibro) + Math.abs(crbanco) - Math.abs(dbbanco) - Math.abs(dblibro) + Math.abs(crlibro);
                        /*view.tfSaldoAjustLibroLib.setValue(formatoMonedaABS(saldoajlibroSSL));
                        view.tfSaldoAjustLibroBanc.setValue(formatoMonedaABS(parseFloat(dataConciliacion.saldoactuallibro)));*/
                        view.tfSaldoAjustLibroLib.setValue(formatoMoneda(saldoajlibroSSL));
                        view.tfSaldoAjustLibroBanc.setValue(formatoMoneda(parseFloat(dataConciliacion.saldoactuallibro)));

                        //metodo saldo ajustado segun banco
                        var saldoajbancoSSB = parseFloat(dataConciliacion.saldoactualbanco) + Math.abs(dblibro) - Math.abs(crlibro) - Math.abs(crbanco) + Math.abs(dbbanco);
                        /*view.tfSaldoAjustBancoBanc.setValue(formatoMonedaABS(saldoajbancoSSB));
                        view.tfSaldoAjustBancoLib.setValue(formatoMonedaABS(parseFloat(dataConciliacion.saldoactualbanco)));*/
                        view.tfSaldoAjustBancoBanc.setValue(formatoMoneda(saldoajbancoSSB));
                        view.tfSaldoAjustBancoLib.setValue(formatoMoneda(parseFloat(dataConciliacion.saldoactualbanco)));

                        if (parseFloat(saldoajbanco).toFixed(2) === parseFloat(saldoajlibro).toFixed(2))
                            mostrarMensaje(1, idioma.msgCtaConciliada);
                        else
                            mostrarMensaje(1, idioma.msgNoCtaConciliada);

                    } else {
                        mostrarMensaje(3, idioma.msgErrorCarga);
                    }

                    view.btnCerrar.focus();
                }
            });
        };

        //elimina la conciliacion bancaria
        this.eliminarConciliacion = function() {
            view.windowopen = true;
            mostrarMensaje(2, idioma.msgDelQuestion, elimina);

            function elimina(btnPresionado) {
                if (btnPresionado == 'ok') {
                    controller.loadMessageBox(idioma.msgDel);
                    Ext.Ajax.request({
                        url: 'eliminarconciliacion',
                        method: 'POST',
                        params: {
                            idconciliacion: view.gpConciliaciones.getSelectionModel().getSelected().data.idconciliacionbancaria
                        },
                        callback: function(options, success, response) {
                            responseData = Ext.decode(response.responseText);
                            Ext.MessageBox.hide();
                            switch (responseData) {
                                case 1:
                                    mostrarMensaje(1, idioma.msgDelSuccess);
                                    model.stConciliaciones.reload();
                                    break;
                                default:
                                    mostrarMensaje(3, idioma.msgErrorEliminando);
                                    break;
                            }
                            view.windowopen = false;
                        }
                    });
                } else {
                    view.windowopen = false;
                }
            }
        };

        //Esta funcionalidad va a servir para filtrar la conciliación
        this.buscarConciliacion = function() {
            var fecha = view.dfBuscar.getRawValue();

            model.stConciliaciones.reload({
                params: {
                    fecha: fecha
                }
            });
        };

        //abre la ventana para ver los reportes
        this.openReporteConciliacion = function() {
            var url = "/contabilidad/banco/recuperaciones/index.php/conciliacionreporte/conciliacionbancariaConc";
            var winIReporte = new Ext.Window({
                layout: 'form',
                width: view.viewPort.getSize().width - 200,
                title: idioma.lbTitleVerreporte,
                height: view.viewPort.getSize().height - 100,
                resizable: false,
                modal: true,
                html: '<iframe id="ifReporteConc" style="width:100%; height: 100%; border:none;"></iframe>',
                closeAction: 'close',
                buttons: [new Ext.Button({
                        iconCls: 'cerrar',
                        text: idioma.lbBtnCerrar,
                        tooltip: idioma.lbBtnTooltipCerrar,
                        handler: function() {
                            winIReporte.close();
                        }
                    })],
                listeners: {
                    show: function() {
                        view.windowopen = true;

                        document.getElementById('ifReporteConc').src = url;
                        winIReporte.maximize();
                        winIReporte.doLayout();
                    },
                    close: function() {
                        view.windowopen = false;
                    }
                }
            });
            winIReporte.show();
        };

        //muestra el tooltip sobre los combo
        this.fToolTipShow = function(component, text) {
            if (!component.ttp)
                component.ttp = new Ext.ToolTip({
                    target: component.getEl(),
                    autoHeight: true,
                    autoWidth: true,
                    autoHide: true,
                    maxWidth: 200,
                    anchor: 'left',
                    title: text,
                    trackMouse: true
                });
            else
                component.ttp.setTitle(text);
        };

        //muestra la mascara segun el msg 
        this.MostrarMensaje = function(mensaje) {
            loadMask = new Ext.LoadMask(Ext.getBody(), {
                msg: mensaje
            });
            loadMask.show();
        };

        this.loadMessageBox = function(msg) {
            Ext.MessageBox.show({
                title: idioma.msgEspere,
                msg: msg,
                width: 300,
                progress: true,
                closable: false
            });
            var f = function(v) {
                return function() {
                    var i = v / 11;
                    Ext.MessageBox.updateProgress(i);
                };
            };
            for (var i = 1; i < 12; i++)
                setTimeout(f(i), i * 500);
        };

    }
}; 