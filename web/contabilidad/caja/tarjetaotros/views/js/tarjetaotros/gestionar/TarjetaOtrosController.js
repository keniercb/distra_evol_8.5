Ext.namespace('Ext.GestionarTarjetaOtros');
Ext.GestionarTarjetaOtros.Controller = Ext.extend(Ext.Component, {
    url: undefined,
    perfil: undefined,
    etiquetas: undefined,
    constructor: function(params)
    {
        this.crearSetsAndGets();
        this.setUrl(params.url);
        this.perfil = window.parent.perfil;

        requireJS.loadJsArray([
            // {
            //     url: "/contabilidad/comun/componentes/RowActionColumn/Ext.grid.RowActions",
            //     id: 'RowActions',
            //     async: false
            // },
            {
                url: "/contabilidad/cobros_pagos/cargainicial/views/js/componentes/CmpAction/cmpaction",
                id: 'cmpaction',
                async: false
            },
            {
                url: "/contabilidad/comun/js/Util/Forms/FormSteps",
                id: 'FormSteps'
            },
            {
                url: params.url + 'tabtarjetaotros/tabtarjetaotros',
                id: 'tabtarjetasotros',
            },
            {
                url: params.url + 'tabtarjetaotros/tarjetaislaazul/TarjetaIslaAzulController',
                id: 'TarjetaIslaAzulController',
            },
            {
                url: params.url + 'tabtarjetaotros/tarjetaislaazul/TarjetaIslaAzulModel',
                id: 'TarjetaIslaAzulModel',
            },
            {
                url: params.url + 'tabtarjetaotros/tarjetaislaazul/TarjetaIslaAzulView',
                id: 'TarjetaIslaAzulView',
            },
            {
                url: params.url + 'tabtarjetaotros/tarjetaislaazul/ventanas/adicionartarjeta/AddTarjetaController',
                id: 'AddTarjetaController',
            },
            {
                url: params.url + 'tabtarjetaotros/tarjetaislaazul/ventanas/adicionartarjeta/AddTarjetaModel',
                id: 'AddTarjetaModel',
            },
            {
                url: params.url + 'tabtarjetaotros/tarjetaislaazul/ventanas/adicionartarjeta/AddTarjetaView',
                id: 'AddTarjetaView',
            },
        ], function () {
            this.loadDataComponent();
        }.bind(this));

        Ext.GestionarTarjetaOtros.Controller.superclass.constructor.call(this);
    },
    loadMessageBox: function (msg = 'Cargando...', title = 'Por favor espere...') {
        Ext.MessageBox.show({
            title: title,
            msg: msg,
            width: 300,
            progress: true,
            closable: false
        });
        var f = function (v) {
            return function () {
                var i = v / 11;
                Ext.MessageBox.updateProgress(i);
            };
        };
        for (var i = 1; i < 12; i++)
            setTimeout(f(i), i * 500);
    },
    hideMessageBox: function () {
        Ext.MessageBox.hide();
    },
    loadDataComponent: function()
    {
        var model = this.crearModelTarjetaOtros();
        model.cargarEtiquetas(undefined, function (options, success, response) {
            var etiquetas = Ext.decode(response.responseText);
            if (!etiquetas.codMsg && success) {
                this.setEtiquetas(etiquetas);
                // this.loadDataInit(model);
                this.initializeClass();
                this.loadWindowCaja();
            }
        }.bind(this));
    },
    loadDataInit: function(model)
    {
        this.loadMessageBox();
        model.loadDataInit({scope: this}, function (options, success, response) {
            if (success) {
                var responde = Ext.decode(response.responseText);
                fechaContable = responde.dataFecha.fechacontable;
                periodoActual = responde.dataFecha.nombre;
                fechaInicio = responde.dataFecha.inicio;
                fechaFin = responde.dataFecha.fin;
                ejercicioActual = responde.ejercicio;
                this.hideMessageBox();
                // me.dataCombustible = responde.combustible;

                this.initializeClass();
                var view = this.getTOView();
                //Poner informacion de fecha y periodo
                view.getLabelFechaContable().setText('Fecha contable: ' + fechaContable);
                this.hideMessageBox();
                this.loadWindowCaja();
            }
        });
    },
    crearModelTarjetaOtros: function () {
        this.setTOModel(new Ext.GestionarTarjetaOtros.Model());
        return this.getTOModel();
    },
    crearViewTarjetaOtros: function () {
        var params = {
            etiquetas: this.getEtiquetas()
        };
        this.setTOView(new Ext.GestionarTarjetaOtros.View(this.getTOModel(), params));
    },
    crearWindowCaja: function (idCajaOld) {
        return this.winCaja = new Caja.Componentes.WindowCaja({
            idCajaOld: idCajaOld
        });
    },
    loadWindowCaja: function (idCajaOld) {
        var wincaja = this.crearWindowCaja(idCajaOld);
        wincaja.on({
            scope: this,
            loadData: function (data) {
                var caja = this.getWindowCaja();
                var view = this.getTOView();
                // var model = this.getTOModel();
                this.setCaja(caja.idCaja, caja.nomCaja);
                view.getTfCaja().setValue(caja.nomCaja);
                // this.panelTarjeta.stTarjeta.baseParams.idCaja = this.winCaja.idCaja;
                // this.panelTarjeta.stTarjeta.baseParams.activo = 1;
                // this.panelTarjeta.stTarjeta.load();
                // this.panelTarjeta.cbEstado.setValue(1);

                // this.panelTarjeta.btnAdicionar.focus(true, true);

                // var stRecarga = this.getTOView().getGridRecarga().getStore();
                // stRecarga.baseParams.idcaja = caja.idCaja;
                // stRecarga.load();
                view.getTabTarjetaOtros().cargar(caja.idCaja);
            }
        });
        wincaja.show();
    },
    initializeClass: function () {
        this.crearViewTarjetaOtros();
        this.initializeDataIni();
        this.initializeFunctions();
        this.initializeEvents();
        // this.initializeKeyMap();
    },
    initializeDataIni: function () {
        var view = this.getTOView();
        var model = this.getTOModel();

        model.buscarFechaContable(undefined, function (options, success, response) {
            var fechacon = Ext.decode(response.responseText);
            if (!fechacon.codMsg && success) {
                view.getLabelFechaContable().setText('Fecha contable: ' + fechacon.fecha);
                this.setFechasPeriodoContable(fechacon.fechai, fechacon.fecha, fechacon.fechafin);
                fechaContable = fechacon.fecha;
                fechaFin = fechacon.fechafin;
                fechaInicio = fechacon.fechai;
            }
        }.bind(this));

        model.getStoreProveedor().load({
            scope: this,
            callback: function (records, opts, success) {
                if (success) {
                    var respuesta = model.getStoreProveedor().reader.jsonData;
                    if (respuesta.proveedor) {
                        view.getCbProveedor().setValue(respuesta.proveedor.idclientesproveedores);
                        view.getCbProveedor().setRawValue(respuesta.proveedor.nombre);
                    }
                    // this.aperturaTarjeta = respuesta.aperturaTarjeta;
                    // this.panelTarjeta.gpTarjeta.getColumnModel().setHidden(
                    //     this.panelTarjeta.gpTarjeta.getColumnModel().getIndexById('idColumSaldoContab'),
                    //      !this.aperturaTarjeta);

                }
            }
        });

    },
    initializeEventsPanelGeneral: function() {
        var view = this.getTOView();
        var model = this.getTOModel();

        view.getCbProveedor().on({
            scope: this,
            select: function (cb, record, index) {
                // view.getCbxCuentaProveedor().clearValue();
                // var datos = [];
                // for (var i = 0; i < record.json.cobrospagos.length; i++) {
                //     if (record.json.cobrospagos[i].idclasificacion == 4) { // 4 es pago anticipado
                //         datos.push(record.json.cobrospagos[i].idcuenta);
                //     }
                // }
                // // this.data = undefined;
                // if (!(datos.length === 0)) {
                //     model.getStoreCuentaProveedor().baseParams.arrayIdCuenta = Ext.encode(datos);
                //     view.getCbxCuentaProveedor().reload();
                //     view.getCbxCuentaProveedor().enable();
                // } else {
                //     view.getCbxCuentaProveedor().disable();
                // }
            },
            blur: function (store, record, options) {
                this.loadMessageBox();
                var params = {
                    scope: this,
                    params: {
                        idProveedor: view.getCbProveedor().getValue(),
                        arrCuentas: Ext.encode(view.getCbxCuentaProveedor().getValue())
                    },
                };
                var fn = function (options, success, response) {
                    if (success) {
                        // response = Ext.decode(response.responseText);
                    }
                    this.hideMessageBox();
                };
                model.guardarProveedor(params, fn);
            }
        });

        view.getCbxCuentaProveedor().on(
            {
                scope: this,
                beforeload: function () {
                    view.getCbxCuentaProveedor().getStore().removeAll();
                },
                blur: function (store, record, options) {
                    this.loadMessageBox();
                    var params = {
                        scope: this,
                        params: {
                            idProveedor: view.getCbProveedor().getValue(),
                            arrCuentas: Ext.encode(view.getCbxCuentaProveedor().getValue())
                        },
                    };
                    var fn = function (options, success, response) {
                        if (success) {
                            // response = Ext.decode(response.responseText);
                        }
                        this.hideMessageBox();
                    };
                    model.guardarProveedor(params, fn);
                }
            });

        view.getBtnCaja().setHandler(function (btn) {
            this.loadWindowCaja(this.getIdCaja());
        }, this);

        view.getBtnAdd().on({
            click: function () {
                view.getTabTarjetaOtros().getGridActive().accionAdicionar();
            }
        });

        view.getBtnMod().on({
            click: function () {
                view.getTabTarjetaOtros().getGridActive().accionModificar();
            }
        });

        view.getBtnActivarInactivar().on({
            click: function () {
                view.getTabTarjetaOtros().getGridActive().accionActivarInactivar();
            }
        });

        view.getBtnInventario().on({
            click: function () {
                view.getTabTarjetaOtros().getGridActive().accionInventario();
            }
        });

        view.getTabTarjetaOtros().on({
            scope: this,
            deshabilitar: function () {
                this.estadoDefault();
            },
            habilitar: function (activo) {
                this.estadoHabilitado(activo);
            }
        });

    },
    initializeEvents: function() {
        this.initializeEventsPanelGeneral();
    },
    initializeFunctions: function() {
        var view = this.getTOView();
        var model = this.getTOModel();

        this.estadoHabilitado = function (activo) {
            view.getBtnMod().enable();
            view.getBtnActivarInactivar().enable();

            if (activo === 1) {
                view.getBtnActivarInactivar().setIconClass('icondistra-activar rojo');
                view.getBtnActivarInactivar().setText(this.getEtiquetas().lbInactivar);
            } else {
                view.getBtnActivarInactivar().setIconClass('icondistra-activar');
                view.getBtnActivarInactivar().setText(this.getEtiquetas().lbActivar);
            }
        };

        this.estadoDefault = function () {
            view.getBtnAdd().enable();
            view.getBtnMod().disable();
            view.getBtnEliminar().disable();
            view.getBtnActivarInactivar().disable();
        };
    },
    crearSetsAndGets: function () {

        this.setFechasPeriodoContable = function (fechaInicial, fechaActual, fechaFin) {
            this.fechaInicioPeriodo = fechaInicial;
            this.fechaContablePeriodo = fechaActual;
            this.fechaFinPeriodo = fechaFin;
        };

        this.getPeriodoConFechaInicial = function () {
            return this.fechaInicioPeriodo;
        };

        this.getPeriodoConFechaActual = function () {
            return this.fechaContablePeriodo;
        };

        this.getPeriodoConFechaFin = function () {
            return this.fechaFinPeriodo;
        };

        this.setEtiquetas = function (etiquetas) {
            this.etiquetas = etiquetas;
        };

        this.getEtiquetas = function () {
            return this.etiquetas;
        };

        this.setUrl = function (url) {
            this.url = url;
        };

        this.getUrl = function () {
            return this.url;
        };

        this.setTOView = function (view) {
            this.TOView = view;
        };

        this.getTOView = function (view) {
            return this.TOView;
        };

        this.setTOModel = function (model) {
            this.TOModel = model;
        };

        this.getTOModel = function () {
            return this.TOModel;
        };

        this.getWindowCaja = function () {
            return this.winCaja;
        };

        this.setCaja = function (idCaja, nombreCaja) {
            this.idCaja = idCaja;
            this.nombreCaja = nombreCaja;
        };

        this.getIdCaja = function () {
            return this.idCaja;
        };

        this.getNombreCaja = function () {
            return this.nombreCaja;
        };

    }
});
