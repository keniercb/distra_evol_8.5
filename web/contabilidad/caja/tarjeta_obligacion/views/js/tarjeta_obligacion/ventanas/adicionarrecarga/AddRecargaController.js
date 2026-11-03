Ext.namespace('Ext.GestionarTarjetaAddRecarga');
Ext.GestionarTarjetaAddRecarga.Controller = Ext.extend(Ext.Component, {
    lmask: undefined,
    url: undefined,
    etiquetas: undefined,
    objVentana: undefined,
    arrEliminados: [],
    constructor: function(params)
    {
        this.crearSetsAndGets();

        this.setIdTarjetaObligacion(params.idtarjetaobligacion);
        this.setFechaInicio(params.fechaInicio);
        this.setFechaActual(params.fechaActual);
        this.setFechaFin(params.fechaFin);
        this.setModoVentana(params.modo);
        this.setIdProveedor(params.idProveedor);
        this.setIdCaja(params.idCaja);
        this.setUrl(params.url);
        this.setEtiquetas(params.etiquetas);
        this.estado = params.estado;

        this.loadMessageBox = params.loadMessageBox;
        this.loadMessageBox();

        requireJS.loadJsArray([
            {
                url: params.url + 'ventanas/adicionarrecarga/AddRecargaView',
                id: 'TajertaObligacionAddRecargaView',
            },
            {
                url: params.url + 'ventanas/adicionarrecarga/AddRecargaModel',
                id: 'TajertaObligacionAddRecargaModel',
            },
            {
                url: "/contabilidad/comun/js/Util/Forms/FormSteps",
                id: 'FormSteps'
            },
        ], function () {
            this.initComponentTarjetaAddRecarga();
        }.bind(this));

        Ext.GestionarTarjetaAddRecarga.Controller.superclass.constructor.call(this);
        this.addEvents({
            'close': true,
            'confirmar': true,
            'postear': true,
            'cancelarRecargaEspecifica' : true
        });
    },
    initComponentTarjetaAddRecarga: function()
    {
        var modelo = new Ext.GestionarTarjetaAddRecarga.Model(this.getIdCaja());
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
            model.cargarOperacionYCuentas({
                params: {
                    idProveedor: this.getIdProveedor(),
                },
            }, function (options, success, response) {
                if (success) {
                    var res = Ext.decode(response.responseText);
                    if (res.codMg == -1) {
                        mostrarMensaje(1, 'El proveedor seleccionado no tiene cuenta de pago configurada.');
                    } else if (res.codMg == -2) {
                        mostrarMensaje(1, 'No existen operaciones configuradas para realizar recarga de tarjeta.');
                    } else {
                        model.getStoreOperacion().loadData(res);
                        model.getStoreCbCuenta().loadData(res.cuentas);
                    }
                    ventana.hideMask();
                }
            });
        } else {
            ventana.hideMask();
        }


        this.setearFechasPorDefecto();
    },
    iniciarModoModificar: function(ventana, model)
    {

        var me = this;
        this.obtenerDatosTarjetaObligacion(function (options, success, response) {
            var datos = Ext.decode(response.responseText)[0];
            if (success) {
                this.setImporteTotal(datos.total);

                var recargasCorrectas = Ext.decode(datos.recargas);
                var recargas = [];
                var recordGridRecarga = model.getRecordGridRecarga();
                recargasCorrectas.forEach(function (item, i) {
                    if (item.estado == 0) {
                        recargas.push(new recordGridRecarga({
                            idtarjeta: item.idtarjeta,
                            idrecargaobligacion: item.idrecargaobligacion,
                            numtarjeta: item.numero,
                            importe: item.importemo.toFixed(2),
                            chip: item.chip,
                            estado: item.estado,
                        }));
                    }
                });
                ventana.show();
                this.loadMessageBox();
                if (datos.responsable) {
                    var recordPersona = {data: [{idpersona: datos.responsable, nombre: datos.nombrecompleto}]};
                    ventana.getCbPersona().store.loadData(recordPersona);
                    ventana.getCbPersona().setValue(datos.responsable);
                }

                model.cargarOperacionYCuentas({
                    params: {
                        idProveedor: this.getIdProveedor(),
                    },
                }, function (options, success, response) {
                    if (success) {
                        var res = Ext.decode(response.responseText);
                        if (res.codMg == -1) {
                            mostrarMensaje(1, 'El proveedor seleccionado no tiene cuenta de pago configurada.');
                        } else if (res.codMg == -2) {
                            mostrarMensaje(1, 'No existen operaciones configuradas para realizar recarga de tarjeta.');
                        } else {
                            model.getStoreOperacion().loadData(res);
                            model.getStoreCbCuenta().loadData(res.cuentas);
                            ventana.getCbOperacion().setValue(datos.idoperacion);
                            ventana.getCbCuenta().setValue(datos.idcuentaproveedor);
                            ventana.getGridRecargas().getStore().insert(0, recargas);
                            me.gridRecargaAfterEdit();
                        }
                        ventana.crearFormSteps();
                        Ext.MessageBox.hide();
                    }
                });
                ventana.getTfComentario().setValue(datos.comentario);
            }
        });
        this.setearFechasPorDefecto();
    },
    iniciarModoVer: function(ventana, model)
    {

        var me = this;
        this.obtenerDatosTarjetaObligacion(function (options, success, response) {
            var datos = Ext.decode(response.responseText)[0];
            if (success) {
                this.setImporteTotal(datos.total);

                var recargasCorrectas = Ext.decode(datos.recargas);
                var recargas = [];
                var recordGridRecarga = model.getRecordGridRecarga();
                recargasCorrectas.forEach(function (item, i) {
                    if (item.estado == 1 || item.estado == 2 || item.estado == 3) {
                        recargas.push(new recordGridRecarga({
                            idtarjeta: item.idtarjeta,
                            idrecargaobligacion: item.idrecargaobligacion,
                            numtarjeta: item.numero,
                            importe: item.importemo.toFixed(2),
                            chip: item.chip,
                            estado: item.estado,
                        }));
                    }
                });
                ventana.show();
                this.loadMessageBox();
                if (datos.responsable) {
                    var recordPersona = {data: [{idpersona: datos.responsable, nombre: datos.nombrecompleto}]};
                    ventana.getCbPersona().store.loadData(recordPersona);
                    ventana.getCbPersona().setValue(datos.responsable);
                }

                model.cargarOperacionYCuentas({
                    params: {
                        idProveedor: this.getIdProveedor(),
                    },
                }, function (options, success, response) {
                    if (success) {
                        var res = Ext.decode(response.responseText);
                        if (res.codMg == -1) {
                            mostrarMensaje(1, 'El proveedor seleccionado no tiene cuenta de pago configurada.');
                        } else if (res.codMg == -2) {
                            mostrarMensaje(1, 'No existen operaciones configuradas para realizar recarga de tarjeta.');
                        } else {
                            model.getStoreOperacion().loadData(res);
                            model.getStoreCbCuenta().loadData(res.cuentas);
                            ventana.getCbOperacion().setValue(datos.idoperacion);
                            ventana.getCbCuenta().setValue(datos.idcuentaproveedor);
                            ventana.getGridRecargas().getStore().insert(0, recargas);
                            me.gridRecargaAfterEdit();
                        }
                        // ventana.crearFormSteps();
                        me.habilitarDesabilitarCampos(false);
                        if (me.estado == 2 || me.estado == 1) {
                            ventana.rowaction.resumeEvents();
                        }
                        Ext.MessageBox.hide();
                    }
                });
                ventana.getTfComentario().setValue(datos.comentario);
            }
        });
        this.setearFechasPorDefecto();

    },
    obtenerDatosTarjetaObligacion: function(fnCallback)
    {
        if (this.getIdTarjetaObligacion()) {
            var model = this.getModelo();
            var params = {
                scope: this,
                params: {
                    idtarjetaobligacion: this.getIdTarjetaObligacion()
                }
            };
            model.cargarDatosTarjetaObligacionById(params, fnCallback);
        } else {
            console.log('No hay idrecargafincimex');
        }
    },
    crearEventos: function(ventana, model)
    {
        var me = this;
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
        });

        ventana.getCbOperacion().on({
            scope: this,
            select: function (cb, record) {
                // model.getStoreAnticipo().loadData(record.json.data_anticipo);
                // // me.idCuentaProveedor = record.data.idCuentaProveedor;
                //
                // if (record.json.data_anticipo.length == 0) {
                //     // mostrarMensaje(1, me.idioma.lbNoSaldoDisp);
                //     mostrarMensaje(1, 'No hay saldo disponible');
                //     ventana.getNfImporte().reset();
                //     ventana.getNfImporte().isValid();
                // }
            }
        });

        // ventana.getGridRecargasFincimex().getStore().on({
        //     scope: this,
        //     beforeload: function () {
        //         ventana.getNfImporte().setValue(0);
        //         ventana.getNfImporte().isValid();
        //     },
        //     add: function (st, records, index) {
        //         this.gridRecargaAfterEdit();
        //     }
        // });

        ventana.roweditor.on({
            afteredit: function (editor, grid, changes, record, rowIndex) {
                // scope.Estadoeditando = false;
                record.data.numtarjeta = ventana.cbTarjetas.getRawValue();
                me.gridRecargaAfterEdit();
            },
            beforeedit: function (roweditor, grid, record, rowIndex) {
                if (record.data.idtarjeta) {
                    ventana.cbTarjetas.setValue(record.data.idtarjeta);
                }
                // scope.Estadoeditando = true;
            },
            canceledit: function (roweditor, grid, record, rowIndex) {
                // scope.Estadoeditando = false;
            }
        });

        ventana.rowaction.on('action', function (grid, record, action, rowIndex, col, e) {
            switch (action) {
                case 'eliminar':
                    var records = ventana.getGridRecargas().getStore().query('estado', /[^3]/);
                    if (records.getCount() > 1 && record.get('estado') != 3) {
                        mostrarMensaje(2, 'Desea eliminar esta recarga?', function (btnPress) {
                            if (btnPress === 'ok') {
                                if (me.getModoVentana() === 'ver') {
                                    if (me.estado == 2 || me.estado == 1) {
                                        me.fireEvent('cancelarRecargaEspecifica', me.getIdTarjetaObligacion(), record.get('idrecargaobligacion'), me.estado, function () {
                                            me.loadMessageBox();
                                            me.obtenerDatosTarjetaObligacion(function (options, success, response) {
                                                var datos = Ext.decode(response.responseText)[0];
                                                if (success) {

                                                    var recargasCorrectas = Ext.decode(datos.recargas);
                                                    var recargas = [];
                                                    var recordGridRecarga = model.getRecordGridRecarga();
                                                    recargasCorrectas.forEach(function (item, i) {
                                                        if (item.estado == 1 || item.estado == 2 || item.estado == 3) {
                                                            recargas.push(new recordGridRecarga({
                                                                idtarjeta: item.idtarjeta,
                                                                idrecargaobligacion: item.idrecargaobligacion,
                                                                numtarjeta: item.numero,
                                                                importe: item.importemo.toFixed(2),
                                                                chip: item.chip,
                                                                estado: item.estado,
                                                            }));
                                                        }
                                                    });
                                                    ventana.getGridRecargas().getStore().removeAll();
                                                    ventana.getGridRecargas().getStore().insert(0, recargas);
                                                    me.gridRecargaAfterEdit();

                                                }
                                            });
                                        });
                                    }
                                } else {
                                    if (seleccionado.get('idrecargaobligacion')) {
                                        me.arrEliminados.push(record.get('idrecargaobligacion'));
                                    }
                                    ventana.getGridRecargas().getStore().remove(record);
                                    me.gridRecargaAfterEdit();
                                }
                            }
                        });
                    }
                    break;
            }
        });

        ventana.getGridRecargas().getView().getRowClass = function (record, index, rowParams, store) {
            if (record.get('estado') == 1 || record.get('estado') == 2) {
                rowParams.tstyle += "background-color: #dffbda;";
            } else if (record.get('estado') == 3) {
                rowParams.tstyle += "background-color: #f2e2e2;";
            } else {
                var style = rowParams.tstyle.split(';');
                if (style[0]) {
                    rowParams.tstyle = style[0] + ';';
                }
            }
            // if (record.get('idestado') == 6)
            //     return 'FilaVerde';
            // if (record.get('idestado') == 7)
            //     return 'FilaRoja';
        };

        //saveRecargaFincimex
        ventana.on({
            scope: this,
            FormStepsCreado: function (formStep) {
                formStep.on({
                    scope: this,
                    Nuevo: function (fnCallback) {
                        this.limpiarCamposForm();
                        this.habilitarDesabilitarCampos(true);
                        fnCallback.call();
                    },
                    Crear: function (fnCallback, cerrarVentana) {
                        var fn = function (id) {
                            this.habilitarDesabilitarCampos(false);
                            fnCallback.call(undefined, id);
                        }.bind(this);
                        this.saveRecargas(fn, cerrarVentana);
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

        this.saveRecargas = function (fnCallback, cerrarVentana) {
            this.loadMessageBox();
            var records = model.getStoreGridRecarga().getRange();
            var recargas = [];
            var idoperacion = ventana.getCbOperacion().getValue();
            var responsable = ventana.getCbPersona().getValue();
            var comentario = ventana.getTfComentario().getValue();
            var idcuentaproveedor = ventana.getCbCuenta().getValue();
            var fechaoper = ventana.getDfFechaOperacion().getValue().toLocaleDateString();

            records.forEach(function (item, i) {
                recargas.push({
                    idrecargaobligacion: item.get('idrecargaobligacion'),
                    idtarjeta: item.get('idtarjeta'),
                    fecha: fechaoper,
                    importe: item.get('importe'),
                    chip: item.get('chip'),
                    // idmovimiento: item.get('idmovimiento')
                });
            });


            var params = {
                scope: this,
                params: {
                    // fechacontable: this.fechaActual,
                    idcaja: this.getIdCaja(),
                    recargas: Ext.encode(recargas),
                    idoperacion: idoperacion,
                    fechaoper: fechaoper,
                    responsable: responsable,
                    idcuentaproveedor: idcuentaproveedor,
                    idtarjetaobligacion: this.getIdTarjetaObligacion(),
                    idproveedor: this.getIdProveedor(),
                    comentario: comentario,
                    recargaseliminadas: Ext.encode(this.arrEliminados)
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
                            fnCallback.call(undefined, responde.idtarjetaobligacion);
                        }
                        mostrarMensaje(1, 'La opeacion ha sido creada satisfactoriamente.');
                    } else {
                        mostrarMensaje(1, 'Algo salio mal.');
                    }
                }
                Ext.MessageBox.hide();
            };

            model.saveRecargas(params, fn);
        };

        // this.recordsConChips = function () {
        //     var records = ventana.getGridRecargasFincimex().getStore().getRange();
        //     var recordsconchips = [];
        //     records.forEach(function (item, i) {
        //         if (item.get('chip')) {
        //             recordsconchips.push(item);
        //         }
        //     });
        //     return recordsconchips;
        // };

        this.gridRecargaAfterEdit = function (obj) {
            var records = model.getStoreGridRecarga().getRange();
            var importeTotal = 0;
            //si esta desordenado puede causar que falle lo que intento hacer mas abajo en el otro comentario
            records.forEach(function (item, i) {
                importeTotal += parseFloat(item.get('importe'));
                //esto es pa poder saber si han sido modificados los chips
            });
            importeTotal = parseFloat(importeTotal.toFixed(2));
            ventana.getNfImporte().setValue(importeTotal);
            ventana.getNfImporte().isValid();
            ventana.getGridRecargas().fireEvent('afteredit');
        };

        this.limpiarCamposForm = function () {
            ventana.getCbPersona().clearValue();
            ventana.getCbOperacion().clearValue();
            ventana.getCbCuenta().clearValue();
            ventana.getTfComentario().setValue('');
            ventana.getNfImporte().reset();
            ventana.getGridRecargas().getStore().removeAll();
            this.setearFechasPorDefecto();
            model.getStoreGridRecarga().removeAll();
            this.gridRecargaAfterEdit();
        };
        this.habilitarDesabilitarCampos = function (flag) {
            ventana.getCbPersona().setDisabled(!flag);
            ventana.getCbOperacion().setDisabled(!flag);
            ventana.getCbCuenta().setDisabled(!flag);
            ventana.getTfComentario().setDisabled(!flag);
            ventana.getBtnAdd().setDisabled(!flag);
            // ventana.getDfFechaInicio().setDisabled(!flag);
            // ventana.getDfFechaFin().setDisabled(!flag);
            ventana.getDfFechaOperacion().setDisabled(!flag);
            if (flag) {
                ventana.getGridRecargas().resumeEvents();
                ventana.rowaction.resumeEvents();
            } else {
                ventana.getGridRecargas().suspendEvents();
                ventana.rowaction.suspendEvents();
            }

        };
        this.setearFechasPorDefecto = function () {
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
        this.setIdTarjetaObligacion = function (id) {
            this.idTarjetaObligacion = id;
        };
        this.getIdTarjetaObligacion = function () {
            return this.idTarjetaObligacion;
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
