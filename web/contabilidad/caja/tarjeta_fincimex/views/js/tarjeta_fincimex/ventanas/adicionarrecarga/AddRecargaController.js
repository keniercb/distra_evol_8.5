Ext.namespace('Ext.GestionarTarjetaAddRecarga');
Ext.GestionarTarjetaAddRecarga.Controller = Ext.extend(Ext.Component, {
    lmask: undefined,
    url: undefined,
    etiquetas: undefined,
    objVentana: undefined,
    constructor: function(params)
    {
        this.crearSetsAndGets();

        this.setIdRecargaFincimex(params.idrecargafincimex);
        this.setFechaInicio(params.fechaInicio);
        this.setFechaActual(params.fechaActual);
        this.setFechaFin(params.fechaFin);
        this.setModoVentana(params.modo);
        this.setIdProveedor(params.idProveedor);
        this.setAjaxCalls(params.ajaxCalls);
        this.setIdCaja(params.idCaja);
        this.setUrl(params.url);
        this.setEtiquetas(params.etiquetas);

        this.loadMessageBox = params.loadMessageBox;
        this.loadMessageBox();

        requireJS.loadJsArray([
            {
                url: params.url + 'ventanas/adicionarrecarga/AddRecargaView',
                id: 'TajertaOperAddRecargaView',
            },
            {
                url: params.url + 'ventanas/adicionarrecarga/AddRecargaModel',
                id: 'TajertaOperAddRecargaModel',
            },
            {
                url: "/contabilidad/comun/js/FormSteps",
                id: 'FormSteps'
            },
        ], function () {
            this.initComponentTarjetaAddRecarga();
        }.bind(this));

        Ext.GestionarTarjetaAddRecarga.Controller.superclass.constructor.call(this);
        this.addEvents({
            'close': true,
            'confirmar': true,
            'postear': true
        });
    },
    initComponentTarjetaAddRecarga: function()
    {
        var modelo = new Ext.GestionarTarjetaAddRecarga.Model();
        var ventana = new Ext.GestionarTarjetaAddRecarga.View(modelo, {
            etiquetas: this.getEtiquetas(),
            modo: this.getModoVentana()
        });
        this.setModelo(modelo);
        this.setVentana(ventana);
        this.crearFunciones(ventana, modelo);
        this.crearEventos(ventana, modelo);
        this.loadDataComponent(ventana, modelo);
    },
    loadDataComponent: function(ventana, model)
    {
        var modo = this.getModoVentana();
        if (modo === 'add') {
            this.iniciarModoAdicionar(ventana, model);
        } else if (modo === 'mod') {
            this.iniciarModoModificar(ventana, model);
        } else if (modo === 'ver') {
            this.iniciarModoVer(ventana, model);
        }
    },
    iniciarModoAdicionar: function(ventana, model)
    {
        Ext.MessageBox.hide();
        ventana.show();
        ventana.crearFormSteps();
        ventana.loadMask();
        if (this.getIdProveedor()) {
            model.getStoreOperacion().load({
                scope: this,
                params: {
                    idProveedor: this.getIdProveedor(),
                    idMoneda: null,
                    nomcuenta: '',
                    // idAnticipo: me.action == 'mod' ? this.scope.smRecarga.getSelected().data.idanticipo : -1
                    idAnticipo: -1
                },
                callback: function (re, opts, success) {
                    if (success) {
                        ventana.hideMask();
                    }
                }
            });
        } else {
            ventana.hideMask();
        }


        this.setearFechasPorDefecto();
    },
    iniciarModoModificar: function(ventana, model)
    {

        this.obtenerDatosRecargaFincimex(function (options, success, response) {
            var datos = Ext.decode(response.responseText)[0];
            if (success) {
                this.setImporteTotal(datos.total);
                this.setIdAnticipo(datos.idanticipo);

                var recargasCorrectas = Ext.decode(datos.correctos);
                var recargas = [];
                var recordGridRecargaFincimex = model.getRecordGridRecargaFincimex();
                recargasCorrectas.forEach(function (item, i) {
                    recargas.push(new recordGridRecargaFincimex({
                        idsync: item.idsync,
                        idtarjeta: item.idtarjeta,
                        idoperaciontarjeta: item.idoperaciontarjeta,
                        idoperacionrecarga: item.idoperacionrecarga,
                        numtarjetafincimex: item.numero,
                        fechacaducidadfincimex: item.fechavence,
                        fecha: item.fecha,
                        importefincimex: item.importemo.toFixed(2),
                        chip: item.chip,
                        idmovimiento: item.idmovimiento,
                    }));
                });
                ventana.show();
                this.loadMessageBox();
                if (datos.responsable) {
                    var recordPersona = {data: [{idpersona: datos.responsable, nombre: datos.nombrecompleto}]};
                    ventana.getCbPersona().store.loadData(recordPersona);
                    ventana.getCbPersona().setValue(datos.responsable);
                }

                model.getStoreOperacion().load({
                    scope: this,
                    params: {
                        idProveedor: this.getIdProveedor(),
                        idMoneda: null,
                        nomcuenta: '',
                        idAnticipo: datos.idanticipo
                    },
                    callback: function (re, opts, success) {
                        if (success) {
                            var recordoper = '';
                            re.forEach(function (item, i) {
                                if (item.get('idnomoperaciones') == datos.idoperacion) {
                                    recordoper = item;
                                }
                            });
                            ventana.getCbOperacion().fireEvent('select', ventana.getCbOperacion(), recordoper);
                            var indexAnticipo = ventana.getGpAnticipo().getStore().find('idanticipo', datos.idanticipo);
                            var dataAnticipo = ventana.getGpAnticipo().getStore().getAt(indexAnticipo);

                            ventana.getGridRecargasFincimex().getStore().on({
                                scope: this,
                                load: function (st, records, opts) {
                                    st.insert(0, recargas);
                                    ventana.crearFormSteps();
                                }
                            });

                            ventana.getGpAnticipo().getSelectionModel().fireEvent('rowselect',
                            ventana.getGpAnticipo().getSelectionModel(), indexAnticipo, dataAnticipo);
                            Ext.MessageBox.hide();
                        }
                    }
                });
            }
        });

        this.setearFechasPorDefecto();
    },
    iniciarModoVer: function(ventana, model)
    {

        this.obtenerDatosRecargaFincimex(function (options, success, response) {
            var datos = Ext.decode(response.responseText)[0];
            if (success) {
                this.setImporteTotal(datos.total);
                this.setIdAnticipo(datos.idanticipo);

                var recargasCorrectas = Ext.decode(datos.correctos);
                var recargas = [];
                var recordGridRecargaFincimex = model.getRecordGridRecargaFincimex();
                recargasCorrectas.forEach(function (item, i) {
                    recargas.push(new recordGridRecargaFincimex({
                        idsync: item.idsync,
                        idtarjeta: item.idtarjeta,
                        idoperaciontarjeta: item.idoperaciontarjeta,
                        idoperacionrecarga: item.idoperacionrecarga,
                        numtarjetafincimex: item.numero,
                        fechacaducidadfincimex: item.fechavence,
                        fecha: item.fecha,
                        importefincimex: item.importemo.toFixed(2),
                        chip: item.chip,
                        idmovimiento: item.idmovimiento,
                    }));
                });
                ventana.show();
                this.loadMessageBox();
                if (datos.responsable) {
                    var recordPersona = {data: [{idpersona: datos.responsable, nombre: datos.nombrecompleto}]};
                    ventana.getCbPersona().store.loadData(recordPersona);
                    ventana.getCbPersona().setValue(datos.responsable);
                }

                model.getStoreOperacion().load({
                    scope: this,
                    params: {
                        idProveedor: this.getIdProveedor(),
                        idMoneda: null,
                        nomcuenta: '',
                        idAnticipo: datos.idanticipo
                    },
                    callback: function (re, opts, success) {
                        if (success) {
                            var recordoper = '';
                            re.forEach(function (item, i) {
                                if (item.get('idnomoperaciones') == datos.idoperacion) {
                                    recordoper = item;
                                }
                            });
                            ventana.getCbOperacion().fireEvent('select', ventana.getCbOperacion(), recordoper);
                            var indexAnticipo = ventana.getGpAnticipo().getStore().find('idanticipo', datos.idanticipo);
                            var dataAnticipo = ventana.getGpAnticipo().getStore().getAt(indexAnticipo);

                            ventana.getGridRecargasFincimex().getStore().on({
                                scope: this,
                                load: function (st, records, opts) {
                                    st.insert(0, recargas);
                                    // ventana.crearFormSteps();
                                    this.habilitarDesabilitarCampos(false);
                                    Ext.MessageBox.hide();
                                }
                            });

                            ventana.getGpAnticipo().getSelectionModel().fireEvent('rowselect',
                            ventana.getGpAnticipo().getSelectionModel(), indexAnticipo, dataAnticipo);
                        }
                    }
                });
            }
        });

    },
    obtenerDatosRecargaFincimex: function(fnCallback)
    {
        if (this.getIdRecargaFincimex()) {
            var ajax = this.getAjaxCalls();
            var params = {
                scope: this,
                params: {
                    idoperaciontarjeta: this.getIdRecargaFincimex()
                }
            };
            ajax.cargarDatosRecargaFincimexById(params, fnCallback);
        } else {
            console.log('No hay idrecargafincimex');
        }
    },
    crearEventos: function(ventana, model)
    {

        ventana.on({
            scope: this,
            close: function () {
                this.fireEvent('close');
            }
        });

        model.getStoreOperacion().on({
            scope: this,
            load: function (st, records) {
                if (records.length == 1) {
                    ventana.getCbOperacion().setValue(records[0].data.idnomoperaciones);
                    ventana.getCbOperacion().fireEvent('select', ventana.getCbOperacion(), records[0]);
                }
            },
            // loadexception: function (st) {
            //     var respuesta = Ext.decode(me.stOperacion.reader.jsonData);
            //     if (respuesta.codMg == -1) {
            //         mostrarMensaje(1, me.idioma.lbNoCtaPagoAntcipado);
            //     }
            //     if (respuesta.codMg == -2) {
            //         mostrarMensaje(1, me.idioma.lbNoOperacionRecarga);
            //     }
            //     me.lMask.hide();
            //     me.close();
            // }
        });

        ventana.getCbOperacion().on({
            scope: this,
            select: function (cb, record) {
                model.getStoreAnticipo().loadData(record.json.data_anticipo);
                // me.idCuentaProveedor = record.data.idCuentaProveedor;

                if (record.json.data_anticipo.length == 0) {
                    // mostrarMensaje(1, me.idioma.lbNoSaldoDisp);
                    mostrarMensaje(1, 'No hay saldo disponible');
                    ventana.getNfImporte().reset();
                    ventana.getNfImporte().isValid();
                }
            }
        });

        ventana.getGpAnticipo().getSelectionModel().on('rowselect', function (sm, index, record) {
            ventana.getCbAnticipo().setValue(record.data.idanticipo);
            ventana.getCbAnticipo().setRawValue(record.data.numerodocumento);
            if (this.getModoVentana() == 'mod' && record.data.idanticipo == this.getIdAnticipo())
                var totalPendiente = parseFloat(record.data.pendiente) + parseFloat(this.getImporteTotal());
            else var totalPendiente = record.data.pendiente;
            ventana.getNfImportePendiente().setValue(parseFloat(totalPendiente).toFixed(2));
            ventana.getCbAnticipo().collapse();

            var st = ventana.getGridRecargasFincimex().getStore();
            st.baseParams.idMoneda = record.json.idmoneda;
            st.baseParams.idCaja = this.getIdCaja();
            // st.baseParams.fechaInicio = ventana.getDfFechaInicio().getValue().toLocaleDateString();
            // st.baseParams.fechaFin = ventana.getDfFechaFin().getValue().toLocaleDateString();
            st.load();
        }, this);

        ventana.getGridRecargasFincimex().on({
            scope: this,
            afteredit: function (obj) {
                this.gridRecargaAfterEdit(obj);
            }
        });

        ventana.getGridRecargasFincimex().getStore().on({
            scope: this,
            beforeload: function () {
                ventana.getNfImporte().setValue(0);
                ventana.getNfImporte().isValid();
            },
            add: function (st, records, index) {
                this.gridRecargaAfterEdit();
            }
        });

        ventana.getDfFechaInicio().on({
            scope: this,
            change: function (dateField, newValue, oldValue) {
                ventana.getDfFechaFin().setMinValue(newValue);
                var st = ventana.getGridRecargasFincimex().getStore();
                st.baseParams.fechaInicio = newValue.toLocaleDateString();
                st.load();
            }
        });
        ventana.getDfFechaFin().on({
            scope: this,
            change: function (dateField, newValue, oldValue) {
                ventana.getDfFechaInicio().setMaxValue(newValue);
                var st = ventana.getGridRecargasFincimex().getStore();
                st.baseParams.fechaFin = newValue.toLocaleDateString();
                st.load();
            }
        });
        //saveRecargaFincimex
        ventana.on({
            scope: this,
            FormStepsCreado: function (formStep) {
                formStep.on({
                    scope: this,
                    Nuevo: function (fnCallback) {
                        this.limpiarCamposForm();
                        this.habilitarDesabilitarCampos(1);
                        fnCallback.call();
                    },
                    Crear: function (fnCallback, cerrarVentana) {
                        var fn = function (id) {
                            this.habilitarDesabilitarCampos(0);
                            fnCallback.call(undefined, id);
                        }.bind(this);
                        this.saveRecargaFincimex(fn, cerrarVentana);
                    },
                    Confirmar: function (fnCallback, id) {
                        this.fireEvent('confirmar', id, fnCallback);
                    },
                    Postear: function (fnCallback, id) {
                        this.fireEvent('postear', id, fnCallback);
                    },
                });
            }
        });

    },
    crearFunciones: function(ventana, model)
    {
        // var ventana = this.getVentana();
        var ajax = this.getAjaxCalls();

        this.saveRecargaFincimex = function (fnCallback, cerrarVentana) {
            this.loadMessageBox();
            var records = this.recordsConChips();
            var recargas = [];
            var idanticipo = ventana.getCbAnticipo().getValue();
            var idoperacion = ventana.getCbOperacion().getValue();
            var responsable = ventana.getCbPersona().getValue();
            var fechaoper = ventana.getDfFechaOperacion().getValue().toLocaleDateString();
            var idcuentaproveedor = ventana.getCbOperacion().store.getAt(
                ventana.getCbOperacion().store.find('idnomoperaciones', idoperacion)
            ).get('idCuentaProveedor');

            records.forEach(function (item, i) {
                recargas.push({
                    idsync: item.get('idsync'),
                    idtarjeta: item.get('idtarjeta'),
                    idoperaciontarjeta: item.get('idoperaciontarjeta'),
                    idoperacionrecarga: item.get('idoperacionrecarga'),
                    // fecha: item.get('fecha'),//fecha que ta en fincimex
                    fecha: fechaoper,
                    importefincimex: item.get('importefincimex'),
                    chip: item.get('chip'),
                    idmovimiento: item.get('idmovimiento')
                });
            });


            var params = {
                scope: this,
                params: {
                    // fechacontable: this.fechaActual,
                    idcaja: this.getIdCaja(),
                    recargas: Ext.encode(recargas),
                    idanticipo: idanticipo,
                    idoperacion: idoperacion,
                    fechaoper: fechaoper,
                    responsable: responsable,
                    idcuentaproveedor: idcuentaproveedor,
                    idoperaciontarjeta: this.getIdRecargaFincimex(),
                    idproveedor: this.getIdProveedor()
                }
            };
            var fn = function (options, success, response) {
                var responde = Ext.decode(response.responseText);
                if (success) {
                    if (cerrarVentana) {
                        ventana.close();
                    }
                    if (responde.codMg == 1) {
                        if (typeof fnCallback === 'function') {
                            fnCallback.call(undefined, responde.idoperaciontarjeta);
                        }
                        mostrarMensaje(1, 'La opeacion ha sido creada satisfactoriamente.');
                    } else {
                        mostrarMensaje(1, 'Algo salio mal.');
                    }
                }
                Ext.MessageBox.hide();
            };

            ajax.saveRecargaFincimex(params, fn);
        };

        this.recordsConChips = function () {
            var records = ventana.getGridRecargasFincimex().getStore().getRange();
            var recordsconchips = [];
            records.forEach(function (item, i) {
                if (item.get('chip')) {
                    recordsconchips.push(item);
                }
            });
            return recordsconchips;
        };
        this.gridRecargaAfterEdit = function (obj) {
            // obj.record.commit();
            // var records = obj.grid.getStore().getRange();
            var importeTotal = 0;
            var recordscheck = [];
            var records = this.recordsConChips();
            //si esta desordenado puede causar que falle lo que intento hacer mas abajo en el otro comentario
            records.sort(function (a, b) {
                return a.id - b.id;
            });
            records.forEach(function (item, i) {
                importeTotal += parseFloat(item.get('importefincimex'));
                //esto es pa poder saber si han sido modificados los chips
                recordscheck.push(
                    '' + item.get('chip') + '@' + item.get('idoperacionrecarga')
                );
            });
            importeTotal = parseFloat(importeTotal.toFixed(2));
            ventana.getNfImporte().setValue(importeTotal);
            ventana.getTfCheckChip().setValue(recordscheck.toString());
            ventana.getNfImporte().isValid();
        };

        this.limpiarCamposForm = function () {
            ventana.getCbPersona().clearValue();
            ventana.getCbOperacion().clearValue();
            ventana.getCbAnticipo().clearValue();
            ventana.getNfImportePendiente().reset();
            ventana.getNfImporte().reset();
            ventana.getGridRecargasFincimex().getStore().removeAll();
            ventana.getGpAnticipo().getStore().removeAll();
            this.setearFechasPorDefecto();
        };
        this.habilitarDesabilitarCampos = function (flag) {
            ventana.getCbPersona().setDisabled(!flag);
            ventana.getCbOperacion().setDisabled(!flag);
            ventana.getCbAnticipo().setDisabled(!flag);
            ventana.getDfFechaInicio().setDisabled(!flag);
            ventana.getDfFechaFin().setDisabled(!flag);
            ventana.getDfFechaOperacion().setDisabled(!flag);
            if (flag) {
                ventana.getGridRecargasFincimex().resumeEvents();
            } else {
                ventana.getGridRecargasFincimex().suspendEvents();
            }

        };
        this.setearFechasPorDefecto = function () {
            ventana.getDfFechaInicio().setValue(this.fechaInicio);
            ventana.getDfFechaInicio().setMaxValue(this.fechaActual);
            ventana.getDfFechaFin().setValue(this.fechaActual);
            ventana.getDfFechaFin().setMinValue(this.fechaInicio);
            ventana.getDfFechaFin().setMaxValue(this.fechaFin);

            ventana.getDfFechaOperacion().setValue(this.fechaActual);
            ventana.getDfFechaOperacion().setMinValue(this.fechaInicio);
            ventana.getDfFechaOperacion().setMaxValue(this.fechaFin);

        };

    },
    crearSetsAndGets: function()
    {
        this.setVentana = function (ventana) {
            this.objVentana = ventana;
        };
        this.getVentana = function () {
            return this.objVentana;
        };
        this.setModelo = function (modelo) {
            this.objModel = modelo;
        };
        this.getModelo = function () {
            return this.objModel;
        };
        this.setIdCaja = function (idcaja) {
            this.idCaja = idcaja;
        };
        this.getIdCaja = function () {
            return this.idCaja;
        };
        this.setEtiquetas = function (etiquetas) {
            this.etiquetas = etiquetas;
        };
        this.getEtiquetas = function () {
            return this.etiquetas;
        };
        this.setAjaxCalls = function (ajaxCalls) {
            this.ajaxCalls = ajaxCalls;
        };
        this.getAjaxCalls = function () {
            return this.ajaxCalls;
        };
        this.setIdProveedor = function (idProveedor) {
            this.idProveedor = idProveedor;
        };
        this.getIdProveedor = function () {
            return this.idProveedor;
        };
        this.setUrl = function (url) {
            this.url = url;
        };
        this.getUrl = function () {
            return this.url;
        };
        this.setModoVentana = function (modo) {
            //add mod ver -- son los modos
            this.modo = modo;
        };
        this.getModoVentana = function () {
            return this.modo;
        };
        this.setFechaInicio = function (fechaInicio) {
            this.fechaInicio = fechaInicio;
        };
        this.getFechaInicio = function () {
            return this.fechaInicio;
        };
        this.setFechaActual = function (fechaActual) {
            this.fechaActual = fechaActual;
        };
        this.getFechaActual = function () {
            return this.fechaActual;
        };
        this.setFechaFin = function (fechaFin) {
            this.fechaFin = fechaFin;
        };
        this.getFechaFin = function () {
            return this.fechaFin;
        };
        this.setIdRecargaFincimex = function (idRecargaFincimex) {
            this.idRecargaFincimex = idRecargaFincimex;
        };
        this.getIdRecargaFincimex = function () {
            return this.idRecargaFincimex;
        };
        this.setIdAnticipo = function (idAnticipo) {
            this.idAnticipo = idAnticipo;
        };
        this.getIdAnticipo = function () {
            return this.idAnticipo;
        };
        this.setImporteTotal = function (importeTotal) {
            this.importeTotal = importeTotal;
        };
        this.getImporteTotal = function () {
            return this.importeTotal;
        };
    }
});
