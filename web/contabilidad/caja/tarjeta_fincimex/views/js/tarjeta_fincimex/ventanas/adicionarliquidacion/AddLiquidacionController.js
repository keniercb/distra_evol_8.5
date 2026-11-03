Ext.namespace('Ext.GestionarTarjetaAddLiq');
Ext.GestionarTarjetaAddLiq.Controller = Ext.extend(Ext.Component, {
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
                url: params.url + 'ventanas/adicionarliquidacion/AddliquidacionView',
                id: 'TajertaAddLiqView',
            },
            {
                url: params.url + 'ventanas/adicionarliquidacion/AddliquidacionModel',
                id: 'TajertaAddLiqModel',
            },
            {
                url: "/contabilidad/comun/js/FormSteps",
                id: 'FormSteps'
            },
        ], function () {
            this.initComponentTarjetaAddAnt();
        }.bind(this));

        Ext.GestionarTarjetaAddLiq.Controller.superclass.constructor.call(this);
        this.addEvents({
            'loadDataComprobanteLiquidacion': true
        });
    },
    initComponentTarjetaAddAnt: function()
    {
        var modelo = new Ext.GestionarTarjetaAddLiq.Model();
        var ventana = new Ext.GestionarTarjetaAddLiq.View(modelo, {
            etiquetas: this.getEtiquetas(),
            modo: this.getModoVentana()
        });
        this.setModelo(modelo);
        this.setVentana(ventana);
        this.crearFunciones(ventana, modelo);
        this.crearEventos(ventana, modelo);
        this.loadDataComponent(ventana, modelo);
        // modelo.getStoreCuenta().load();
    },
    loadDataComponent: function(ventana, model)
    {
        var modo = this.getModoVentana();
        if (modo === 'add') {
            this.iniciarModoAdicionar(ventana, model);
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
                ventana.getGridLiquidaciones().getStore().load({
                    scope: this,
                    params: {
                        idcaja: this.getIdCaja()
                    },
                    // callback: function (re, opts, success) {
                    //     if (success) {
                    //         ventana.hideMask();
                    //     }
                    // }
                });
            }
        });

        ventana.getGridLiquidaciones().on({
            scope: this,
            beforeedit: function (obj) {
                // if (obj.field == 'importe') {
                //     ventana.getNfImporteAnt().__proto__.maxValue = obj.record.get('saldodisponible');
                // }
                if (obj.field == 'idcuentagasto') {
                    if (ventana.getCbOperacion().getValue()) {
                        ventana.getCbxCuenta().enable();
                        if (ventana.getCbOperacion().getValue() != ventana.getCbxCuenta().idoperacion
                    ||  ventana.getCbxCuenta().idcuentatarjeta != obj.record.get('idcuentatarjeta')) {
                            var params = {
                                idoperacion: ventana.getCbOperacion().getValue(),
                                idcuenta: obj.record.get('idcuentatarjeta')
                            };
                            ventana.getCbxCuenta().reload(null, false, params, function () {
                                // ventana.getCbxCuenta().enable();
                            });
                            ventana.getCbxCuenta().idoperacion = ventana.getCbOperacion().getValue();
                            ventana.getCbxCuenta().idcuentatarjeta = obj.record.get('idcuentatarjeta');
                        }
                    } else {
                        return false;
                    }

                }
            },
            afteredit: function (obj) {
                if (obj.field == 'idcuentagasto') {
                    var temp = model.getStoreCuenta().getAt(model.getStoreCuenta().find('idcuenta', obj.value));
                    this.gridLiquidacionEsparcirCuenta(obj.record.get('idtarjeta'), obj.value, temp.get('text'), temp.get('idmoneda'));
                }
                this.gridLiquidacionAfterEdit();
            },
            validateedit: function (obj) {
                // if (obj.field == 'fechaentrega') {
                //     obj.value = obj.value.toLocaleDateString();
                // } else if (obj.field == 'idpersona') {
                //     var temp = model.getStorePersona().getAt(model.getStorePersona().find('idpersona', obj.value));
                //     obj.record.set('nompersona', temp.get('nombre'));
                // }
                // if (obj.field == 'idcuentagasto') {
                //     var temp = model.getStoreCuenta().getAt(model.getStoreCuenta().find('idcuentagasto', obj.value));
                //     obj.record.set('nomcuentagasto', temp.get('text'));
                // }
            }
        });

        // //saveRecargaFincimex
        ventana.on({
            scope: this,
            FormStepsCreado: function (formStep) {
                formStep.on({
                    scope: this,
                    // Nuevo: function (fnCallback) {
                    //     this.limpiarCamposForm();
                    //     this.habilitarDesabilitarCampos(1);
                    //     fnCallback.call();
                    // },
                    Crear: function (fnCallback, cerrarVentana) {
                        // var fn = function (id) {
                        //     this.habilitarDesabilitarCampos(0);
                        //     fnCallback.call(undefined, id);
                        // }.bind(this);
                        this.saveLiquidacionFincimex(undefined, true);
                    },
                    // Confirmar: function (fnCallback, id) {
                    //     this.fireEvent('confirmar', id, fnCallback);
                    // },
                    // Postear: function (fnCallback, id) {
                    //     this.fireEvent('postear', id, fnCallback);
                    // },
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
                    concepto: '39',
                    idMoneda: null,
                    nomcuenta: ''
                },
                callback: function (re, opts, success) {
                    if (success) {
                        ventana.hideMask();
                    }
                }
            });
        };

        this.iniciarModoVer = function () {

        };

        this.gridLiquidacionEsparcirCuenta = function (idtarjeta, idcuenta, nomcuenta, idmoneda) {
            var records = ventana.getGridLiquidaciones().getStore().query('idtarjeta', idtarjeta);
            records.items.forEach(function (item, i) {
                item.set('idcuentagasto', idcuenta);
                item.set('nomcuentagasto', nomcuenta);
                item.set('idmonedacuentagasto', idmoneda);
            });
        };

        this.saveLiquidacionFincimex = function (fnCallback, cerrarVentana) {
            this.loadMessageBox();
            var records = this.recordsConChips();
            var liquidaciones = [];
            var liq = [];
            var temp = {};
            var liqTotal = 0;
            var idoperacion = ventana.getCbOperacion().getValue();
            var retornar = ventana.getCkbDevolverACaja().getValue();

            records.sort(function (a, b) {
                return a.data.idmovimiento - b.data.idmovimiento;
            });

            records.forEach(function (item, i) {
                liqTotal += parseFloat(item.get('importe'));
                liq.push({
                    idoperacionfincimex: item.get('idoperacionfincimex'),
                    fecha: item.get('fechaliq'),
                    importemo: item.get('importe'),
                    chip: item.get('chip')
                });
                if (records[i+1]) {
                    if (item.get('idmovimiento') != records[i+1].get('idmovimiento')) {
                        temp = {
                            idsync: item.get('idsync'),
                            idtarjeta: item.get('idtarjeta'),
                            idmovimiento: item.get('idmovimiento'),
                            idcuentagasto: item.get('idcuentagasto'),
                            idmonedacuentagasto: item.get('idmonedacuentagasto'),
                            iddocumento: item.get('iddocumento'),
                            importeLiquidado: liqTotal.toFixed(2),
                            liq: liq
                        };
                        liquidaciones.push(temp);
                        liq = [];
                        liqTotal = 0;
                    }
                } else {
                    temp = {
                        idsync: item.get('idsync'),
                        idtarjeta: item.get('idtarjeta'),
                        idmovimiento: item.get('idmovimiento'),
                        idcuentagasto: item.get('idcuentagasto'),
                        idmonedacuentagasto: item.get('idmonedacuentagasto'),
                        iddocumento: item.get('iddocumento'),
                        importeLiquidado: liqTotal.toFixed(2),
                        liq: liq
                    };
                    liquidaciones.push(temp);
                    liq = [];
                    liqTotal = 0;
                }
            });

            var params = {
                    // idoperaciontarjeta: this.getIdAnticipoFincimex(),
                    idcaja: this.getIdCaja(),
                    liquidaciones: Ext.encode(liquidaciones),
                    idoperacion: idoperacion,
                    retornar: retornar,
                    tipoContabilizacion: 3//liquidar
                };
            this.fireEvent('loadDataComprobanteLiquidacion', params, function () {
                ventana.close();
            });
            // var fn = function (options, success, response) {
            //     var responde = Ext.decode(response.responseText);
            //     if (success) {
            //         if (cerrarVentana) {
            //             ventana.close();
            //         }
            //         if (responde.codMg == 1) {
            //             if (typeof fnCallback === 'function') {
            //                 fnCallback.call(undefined, responde.idoperaciontarjeta);
            //             }
            //             mostrarMensaje(1, 'La opeacion ha sido creada satisfactoriamente.');
            //         } else {
            //             mostrarMensaje(1, 'Algo salio mal.');
            //         }
            //     }
            //     Ext.MessageBox.hide();
            // };

            // ajax.saveLiquidacionesFincimex(params, fn);
        };

        this.recordsConChips = function () {
            var records = ventana.getGridLiquidaciones().getStore().getRange();
            var recordsconchips = [];
            records.forEach(function (item, i) {
                if (item.get('chip') && item.get('idcuentagasto')) {
                    recordsconchips.push(item);
                }
            });
            return recordsconchips;
        };

        this.gridLiquidacionAfterEdit = function () {
            var recordscheck = [];
            var sumaDeComprobacion = 0;
            var checkImporte = true;
            var records = this.recordsConChips();
            console.log(records);
            //si esta desordenado puede causar que falle lo que intento hacer mas abajo en el otro comentario
            records.sort(function (a, b) {
                return a.id - b.id;
            });
            records.forEach(function (item, i) {
                //esto es pa poder saber si han sido modificados
                recordscheck.push(
                    '' + item.get('idmovimiento') + '@' + item.get('idcuentagasto') +
                    '@' + item.get('chip')
                );
                sumaDeComprobacion += parseFloat(item.get('importe'));
                if (sumaDeComprobacion > (parseFloat(item.get('saldoanticipo')) - parseFloat(item.get('importeliquidadomb'))) && checkImporte) {
                    checkImporte = false;
                }
                if (records[i+1]) {
                    if (records[i+1].get('idmovimiento') != item.get('idmovimiento')) {
                        sumaDeComprobacion = 0;
                    }
                }
            });
            ventana.gettfCheckLiquidacion().setValue(recordscheck.toString());
            if (checkImporte) {
                ventana.gettfCheckImporte().setValue('1');
            } else {
                ventana.gettfCheckImporte().setValue('');
            }
        };

        this.limpiarCamposForm = function () {
            ventana.getCbOperacion().clearValue();
            ventana.getGridAnticipos().getStore().removeAll();
        };

        this.habilitarDesabilitarCampos = function (flag) {
            ventana.getCbOperacion().setDisabled(!flag);
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
