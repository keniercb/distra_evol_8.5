Ext.namespace('Caja.Tarjetas');
Ext.QuickTips.init();

Ext.Ajax.request({
    method: "POST",
    url: "cargaretiquetas",
    callback: function (options, success, response) {
        new Caja.Tarjetas.Viewport({
            idioma: Ext.decode(response.responseText),
            perfil: window.parent.perfil
        });
    }
});

Caja.Tarjetas.Viewport = Ext.extend(Ext.Viewport, {
    constructor: function (params) {
        this.TaskFormValidation=TaskFormValidation;
        //Objeto para ejecutar una tarea
        //esto me sirve para validar el formulario en el modificar
        this.taskRunner = new Ext.util.TaskRunner();

        this.gridTarjeta = new Caja.Tarjetas.GridTarjeta({
            idioma: params.idioma,
            perfil: params.perfil,
            scope: this,
            region: 'center',
            border: true,
            tipotarjeta: 2 // por ahora 1-Combustible 2-Otras tarjetas
        });

        this.panelAnticipo = new Caja.Tarjetas.PanelAnticipo({
            idioma: params.idioma,
            perfil: params.perfil,
            scope: this,
            region: 'east',
            border: true,
            // frame: true,
            split: true,
            width: Ext.lib.Dom.getViewWidth() * 0.68,
            tipotarjeta: 2 // por ahora 1-Combustible 2-Otras tarjetas
        });

        this.panelGeneral = new Ext.Panel({
            layout: 'border',
            frame: false,
            border: false,
            items: [this.gridTarjeta, this.panelAnticipo]
        });

        Ext.apply(this, params);
        Ext.apply(this, {
            layout: 'fit',
            idioma: params.idioma,
            items: [this.panelGeneral]
        });

        this.initGlobalsKeys();
        this.initFunctions();
        this.loadDataInit();
        //this.loadWindowCaja();
        Caja.Tarjetas.Viewport.superclass.constructor.call(this, params);
    },
    initGlobalsKeys: function () {

        this.keyMapa = new Ext.KeyMap(document, [
            {
                key: "i",
                ctrl: true,
                scope: this,
                fn: function () {
                    this.panelAnticipo.btnAdicionar.fireEvent('click');
                }
            }, {
                key: "m",
                ctrl: true,
                scope: this,
                fn: function () {
                    if (!this.panelAnticipo.btnModificar.disabled)
                        this.panelAnticipo.btnModificar.fireEvent('click');
                }
            }, {
                key: "x",
                ctrl: true,
                scope: this,
                fn: function () {
                    if (!this.panelAnticipo.btnCancelar.disabled)
                        this.panelAnticipo.btnCancelar.fireEvent('click');
                }
            }, {
                key: "t",
                ctrl: true,
                scope: this,
                fn: function () {
                    if (!this.panelAnticipo.btnPostear.disabled)
                        this.panelAnticipo.btnPostear.fireEvent('click');
                }
            }, {
                key: "l",
                ctrl: true,
                scope: this,
                fn: function () {
                    if (!this.panelAnticipo.btnLiquidar.disabled)
                        this.panelAnticipo.btnLiquidar.fireEvent('click');
                }
            }, {
                key: "h",
                alt: true,
                fn: function () {
                    //this.btnAyuda.fireEvent('click');
                }
            }
        ]);
    },

    initFunctions: function () {
        var me = this;
        this.loadDataInit = function () {
            Ext.Msg.wait('Cargando...', 'Por favor espere...');
            Ext.Ajax.request({
                url: 'loadDataIni',
                method: 'POST',
                scope: this,
                callback: function(options, success, response) {
                    if (success) {
                        response = Ext.decode(response.responseText);
                        fechaContable = response.dataFecha.fechacontable;
                        periodoActual = response.dataFecha.nombre;
                        fechaInicio = response.dataFecha.inicio;
                        fechaFin = response.dataFecha.fin;
                        ejercicioActual = response.ejercicio;
                        Ext.Msg.hide();
                        me.dataCombustible = response.combustible;
                        //Poner informacion de fecha y periodo
                        this.panelAnticipo.lfdPeriodo.setText('Fecha contable: ' + fechaContable);
                        // this.panelAnticipo.lfdPeriodo.setText('Per\u00EDodo actual: ' + periodoActual + ' desde ' + fechaInicio + ' hasta ' + fechaFin + '|' + 'Fecha contable: ' + fechaContable);
                        //Validar que este aperturado el subsitema
                        if (response.aperturado != 1) {
                            me.panelGeneral.disable();
                            mostrarMensaje(1, this.idioma.lbCargaInicial, function (btn) {
                                if (btn == 'ok' || btn == 'cencel')
                                    me.panelGeneral.disable();
                            });
                            return;
                        }
                        me.loadWindowCaja();
                    }
                }
            });
        };

        this.loadWindowCaja = function () {
            //Componete de caja-----------
            this.winCaja = new Caja.Componentes.WindowCaja({
                idCajaOld: this.idCaja
            });
            this.winCaja.show();

            this.winCaja.on({
                scope: this,
                loadData: function (data) {
                    this.idCaja = this.winCaja.idCaja;
                    this.gridTarjeta.tfCaja.setValue(this.winCaja.idCaja);
                    this.gridTarjeta.tfCaja.setRawValue(this.winCaja.nomCaja);
                    this.gridTarjeta.stTarjeta.baseParams.idcaja = this.winCaja.idCaja;
                    this.gridTarjeta.stTarjeta.load();
                }
            });

        };
    }
});