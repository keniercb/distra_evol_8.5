Ext.namespace('Ext.GestionarTarjetaAddAnt');
Ext.GestionarTarjetaAddAnt.Controller = Ext.extend(Ext.Component, {
    lmask: undefined,
    url: undefined,
    etiquetas: undefined,
    objVentana: undefined,
    constructor: function(params)
    {
        this.crearSetsAndGets();
        this.setIdAnticipoFincimex(params.idanticipofincimex);
        this.loadMessageBox = params.loadMessageBox;
        this.setUrl(params.url);
        this.setEtiquetas(params.etiquetas);
        this.setFechaInicio(params.fechaInicio);
        this.setFechaActual(params.fechaActual);
        this.setFechaFin(params.fechaFin);
        this.setModoVentana(params.modo);
        this.setAjaxCalls(params.ajaxCalls);
        this.setIdCaja(params.idCaja);
        this.loadMessageBox();

        requireJS.loadJsArray([
            {
                url: params.url + 'ventanas/adicionaranticipo/AddAnticipoView',
                id: 'TajertaAddAntView',
            },
            {
                url: params.url + 'ventanas/adicionaranticipo/AddAnticipoModel',
                id: 'TajertaAddAntModel',
            },
            {
                url: "/contabilidad/comun/js/FormSteps",
                id: 'FormSteps'
            },
        ], function () {
            this.initComponentTarjetaAddAnt();
        }.bind(this));

        Ext.GestionarTarjetaAddAnt.Controller.superclass.constructor.call(this);
    },
    initComponentTarjetaAddAnt: function()
    {
        var modelo = new Ext.GestionarTarjetaAddAnt.Model();
        var ventana = new Ext.GestionarTarjetaAddAnt.View(modelo, {
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
                // ventana.getGridAnticipos().getStore().load();
            }
        });

        ventana.getGridAnticipos().on({
            scope: this,
            beforeedit: function (obj) {
                console.log(obj);
                if (obj.field == 'importe') {
                    ventana.getNfImporteAnt().__proto__.maxValue = obj.record.get('saldodisponible');
                }
            },
            afteredit: function (obj) {
                this.gridAnticipoAfterEdit();
            },
            validateedit: function (obj) {
                if (obj.field == 'fechaentrega') {
                    obj.value = obj.value.toLocaleDateString();
                } else if (obj.field == 'idpersona') {
                    var temp = model.getStorePersona().getAt(model.getStorePersona().find('idpersona', obj.value));
                    obj.record.set('nompersona', temp.get('nombre'));
                }
            }
        });

        ventana.getGridAnticipos().getSelectionModel().on({
            scope: this,
            rowselect: function (sel, index, record) {
                if (record.get('importe') == 0) {
                    record.set('importe', record.get('saldodisponible'));
                }
            },
            selectionchange: function (sel) {
                this.gridAnticipoAfterEdit();
            }
        });

        // //saveRecargaFincimex
        ventana.on({
            scope: this,
            FormStepsCreado: function (formStep) {
                formStep.on({
                    scope: this,
                    Nuevo: function (fnCallback) {
                        this.limpiarCamposForm();
                        this.habilitarDesabilitarCampos(1);
                        fnCallback.call();
                        ventana.getGridAnticipos().getStore().load();
                    },
                    Crear: function (fnCallback, cerrarVentana) {
                        var fn = function (id) {
                            this.habilitarDesabilitarCampos(0);
                            fnCallback.call(undefined, id);
                        }.bind(this);
                        this.saveAnticipoFincimex(fn, cerrarVentana);
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
        var ajax = this.getAjaxCalls();

        this.obtenerDatosAnticiposFincimex = function (fnCallback) {
            if (this.getIdAnticipoFincimex()) {
                var ajax = this.getAjaxCalls();
                var params = {
                    scope: this,
                    params: {
                        idoperaciontarjeta: this.getIdAnticipoFincimex()
                    }
                };
                ajax.cargarDatosAnticiposFincimexById(params, fnCallback);
            } else {
                console.log('No hay idrecargafincimex');
            }
        };

        this.iniciarModoAdicionar = function () {
            Ext.MessageBox.hide();
            ventana.show();
            ventana.crearFormSteps();
            ventana.loadMask();
            model.getStoreOperacion().load({
                scope: this,
                params: {
                    concepto: '38',
                    idMoneda: null,
                    nomcuenta: ''
                },
                callback: function (re, opts, success) {
                    if (success) {
                        ventana.hideMask();
                        ventana.getGridAnticipos().getStore().baseParams.idcaja = this.getIdCaja();
                        ventana.getGridAnticipos().getStore().load();
                    }
                }
            });

            this.setearFechasPorDefecto();
        };

        this.iniciarModoModificar = function () {

            this.obtenerDatosAnticiposFincimex(function (options, success, response) {
                var datos = Ext.decode(response.responseText)[0];
                if (success) {
                    // this.setImporteTotal(datos.total);
                    // this.setIdAnticipo(datos.idanticipo);

                    var anticiposCorrectos = Ext.decode(datos.correctos);
                    var anticipos = [];
                    var recordGridAnticipoFincimex = model.getRecordGridAnticipoFincimex();
                    anticiposCorrectos.forEach(function (item, i) {
                        anticipos.push(new recordGridAnticipoFincimex({
                            idsync: item.idsync,
                            idtarjeta: item.idtarjeta,
                            idoperaciontarjeta: item.idoperaciontarjeta,
                            // idoperacionrecarga: item.idoperacionrecarga,
                            numerotarjeta: item.numero,
                            fechavence: item.fechavence,
                            fechaentrega: item.fecha,
                            importe: item.importemo,
                            // chip: item.chip,
                            idmovimiento: item.idmovimiento,
                            saldodisponible: (item.saldodisponible + item.importemo).toFixed(2),
                            idpersona: item.idpersona,
                            nompersona: item.nombrecompleto,
                            preciocombustible: item.preciocombustible,
                            nomcombustible: item.nomcombustible
                        }));
                    });
                    ventana.show();
                    this.loadMessageBox();

                    model.getStoreOperacion().load({
                        scope: this,
                        params: {
                            concepto: '38',
                            idMoneda: null,
                            nomcuenta: ''
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

                                // ventana.getGridAnticipos().getStore().on({
                                //     scope: this,
                                //     load: function (st, records, opts) {
                                //         st.insert(0, anticipos);
                                //         ventana.crearFormSteps();
                                //     }
                                // });
                                console.log(anticipos);
                                ventana.getGridAnticipos().getStore().add(anticipos);
                                ventana.crearFormSteps();

                                Ext.MessageBox.hide();
                            }
                        }
                    });
                }
                this.setearFechasPorDefecto();
            });

        };

        this.iniciarModoVer = function () {

        };

        this.setearFechasPorDefecto = function () {
            ventana.getDfFechaOperacion().setValue(this.getFechaActual());
            ventana.getDfFechaOperacion().setMinValue(this.getFechaInicio());
            ventana.getDfFechaOperacion().setMaxValue(this.getFechaFin());

            ventana.getDfFechaEditor().setValue(this.getFechaActual());
            ventana.getDfFechaEditor().setMinValue(this.getFechaInicio());
            ventana.getDfFechaEditor().setMaxValue(this.getFechaFin());
        };

        this.saveAnticipoFincimex = function (fnCallback, cerrarVentana) {
            this.loadMessageBox();
            var records = this.recordsConImporte();
            var anticipos = [];
            var idoperacion = ventana.getCbOperacion().getValue();
            var fechaoper = ventana.getDfFechaOperacion().getValue().toLocaleDateString();

            records.forEach(function (item, i) {
                anticipos.push({
                    idsync: item.get('idsync'),
                    idtarjeta: item.get('idtarjeta'),
                    idmovimiento: item.get('idmovimiento'),//ponerlos
                    idpersona: item.get('idpersona'),
                    importe: item.get('importe'),
                    fechaentrega: item.get('fechaentrega') ? item.get('fechaentrega') : fechaoper
                });
            });


            var params = {
                scope: this,
                params: {
                    idoperaciontarjeta: this.getIdAnticipoFincimex(),
                    idcaja: this.getIdCaja(),
                    anticipos: Ext.encode(anticipos),
                    idoperacion: idoperacion,
                    fechaoper: fechaoper
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

            ajax.saveAnticiposFincimex(params, fn);
        };

        this.recordsConImporte = function () {
            // var records = ventana.getGridAnticipos().getStore().getRange();
            var records = ventana.getGridAnticipos().getSelectionModel().getSelections();
            var recordsconimporte = [];
            records.forEach(function (item, i) {
                if (item.get('importe') > 0) {
                    recordsconimporte.push(item);
                }
            });
            return recordsconimporte;
        };
        this.gridAnticipoAfterEdit = function () {
            var recordscheck = [];
            var records = this.recordsConImporte();
            //si esta desordenado puede causar que falle lo que intento hacer mas abajo en el otro comentario
            records.sort(function (a, b) {
                return a.id - b.id;
            });
            records.forEach(function (item, i) {
                //esto es pa poder saber si han sido modificados
                recordscheck.push(
                    '' + item.get('idtarjeta') + '@' + item.get('idpersona') +
                    '@' + item.get('importe') + '@' + item.get('fechaentrega')
                );
            });
            ventana.getTfCheckAnticipo().setValue(recordscheck.toString());
        };

        this.limpiarCamposForm = function () {
            ventana.getCbOperacion().clearValue();
            ventana.getDfFechaOperacion().setValue(this.getFechaActual());
            ventana.getGridAnticipos().getStore().removeAll();
        };

        this.habilitarDesabilitarCampos = function (flag) {
            ventana.getCbOperacion().setDisabled(!flag);
            ventana.getDfFechaOperacion().setDisabled(!flag);
            if (flag) {
                ventana.getGridAnticipos().resumeEvents();
            } else {
                ventana.getGridAnticipos().suspendEvents();
            }

        };

    },
    crearSetsAndGets: function () {

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

        this.setIdAnticipoFincimex = function (idAnticipoFincimex) {
            this.idAnticipoFincimex = idAnticipoFincimex;
        };

        this.getIdAnticipoFincimex = function () {
            return this.idAnticipoFincimex;
        };

    }
});
