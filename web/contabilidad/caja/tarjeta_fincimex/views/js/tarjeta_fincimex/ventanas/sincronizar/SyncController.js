Ext.namespace('Ext.GestionarTarjetaOperSync');
Ext.GestionarTarjetaOperSync.Controller = Ext.extend(Ext.Component, {
    lmask: undefined,
    url: undefined,
    etiquetas: undefined,
    objVentana: undefined,
    idCaja: undefined,
    ajaxCalls: undefined,
    constructor: function(params)
    {
        this.loadMessageBox = params.loadMessageBox;
        this.setAjaxCalls(params.ajaxCalls);
        this.setIdCaja(params.idCaja);
        this.setUrl(params.url);
        this.setEtiquetas(params.etiquetas);
        this.loadMessageBox();

        requireJS.loadJsArray([
            {
                url: params.url + 'ventanas/sincronizar/SyncView',
                id: 'TajertaOperSyncView',
            },
            {
                url: params.url + 'ventanas/sincronizar/SyncModel',
                id: 'TajertaOperSyncModel',
            },
            {
                url: "/contabilidad/comun/js/FormSteps",
                id: 'FormSteps'
            },
        ], function () {
            this.initComponentTarjetaOperSync();
        }.bind(this));

        Ext.GestionarTarjetaOperSync.Controller.superclass.constructor.call(this);
    },
    setUrl: function(url)
    {
        this.url = url;
    },
    getUrl: function()
    {
        return this.url;
    },
    setAjaxCalls: function(ajaxCalls)
    {
        this.ajaxCalls = ajaxCalls;
    },
    getAjaxCalls: function()
    {
        return this.ajaxCalls;
    },
    setEtiquetas: function(etiquetas)
    {
        this.etiquetas = etiquetas;
    },
    getEtiquetas: function()
    {
        return this.etiquetas;
    },
    setIdCaja: function(idcaja)
    {
        this.idCaja = idcaja;
    },
    getIdCaja: function()
    {
        return this.idCaja;
    },
    setVentana: function(ventana)
    {
        this.objVentana = ventana;
    },
    getVentana: function()
    {
        return this.objVentana;
    },
    setModelo: function(modelo)
    {
        this.objModel = modelo;
    },
    getModelo: function()
    {
        return this.objModel;
    },
    initComponentTarjetaOperSync: function()
    {
        var modelo = new Ext.GestionarTarjetaOperSync.Model();
        var ventana = new Ext.GestionarTarjetaOperSync.View(modelo, {
            etiquetas: this.getEtiquetas()
        });
        this.setModelo(modelo);
        this.setVentana(ventana);
        this.crearFunciones();
        this.loadDataComponent();
        this.crearEventos();
    },
    loadDataComponent: function()
    {
        var ventana = this.getVentana();
        var modelo = this.getModelo();
        Ext.MessageBox.hide();
        ventana.show(Ext.getBody(), function () {
            // ventana.maximize();
            // ventana.doLayout();
            this.cargarGrids();
        }, this);

    },
    crearEventos: function()
    {
        var ventana = this.getVentana();

        ventana.btnSincronizar.setHandler(function (btn) {
            this.guardarDatosTarjetaSync();
        }, this);

        ventana.btnActFechaCad.setHandler(function (btn) {
            this.actualizarFechaCadTarjetaSistema();
        }, this);

        ventana.btnAddTarjetaSistema.setHandler(function (btn) {
            this.addTarjetaSistema();
        }, this);

        ventana.getGridSync().getSelectionModel().on({
            scope: this,
            selectionchange: function (sm) {
                var selections = sm.getSelections();
                this.gridSyncBtnManage(selections);

            }
        });

        ventana.getGridTarjFincimex().getSelectionModel().on({
            scope: this,
            selectionchange: function (sm) {
                var selections = sm.getSelections();
                this.gridTarjFincimexBtnManage(selections);

            }
        });

        ventana.getGridSync().getView().getRowClass = function (record, index, rowParams, store) {
            if (record.get('idsync'))
                return 'FilaVerde';
        };

    },
    crearFunciones: function()
    {
        var ventana = this.getVentana();
        var ajaxCalls = this.getAjaxCalls();

        this.guardarDatosTarjetaSync = function () {
            this.loadMessageBox();
            var sm = ventana.getGridSync().getSelectionModel();
            var arr = [];
            var selections = sm.getSelections();
            selections.forEach(function (item, i) {
                arr.push({
                    idtarjeta: item.get('idtarjetasistema'),
                    idtarjetafincimex: item.get('idtarjetafincimex')
                });
            });

            var parametros = {
                scope: this,
                params: {
                    datos: Ext.encode(arr)
                }
            };

            ajaxCalls.guardarDatosTarjetaSync(parametros, function (options, success, response) {
                var result = Ext.decode(response.responseText);
                if (success && result.codMg == 1) {
                    mostrarMensaje(1, 'Se guardo exitosamente la(s) tarjeta(s) sincronizada(s).');
                    ventana.getGridSync().getStore().reload();
                }
                Ext.MessageBox.hide();
            });
        };

        this.actualizarFechaCadTarjetaSistema = function () {
            this.loadMessageBox();
            var sm = ventana.getGridSync().getSelectionModel();
            var arr = [];
            var selections = sm.getSelections();
            selections.forEach(function (item, i) {
                arr.push({
                    idsync: item.get('idsync')
                });
            });

            var parametros = {
                scope: this,
                params: {
                    datos: Ext.encode(arr)
                }
            };

            ajaxCalls.actualizarFechaCadTarjetaSistema(parametros, function (options, success, response) {
                var result = Ext.decode(response.responseText);
                if (success && result.codMg == 1) {
                    mostrarMensaje(1, 'Se actualizo exitosamente la(s) fecha(s) de caducidad de la(s) tarjeta(s) seleccionada(s).');
                    ventana.getGridSync().getStore().reload();
                }
                Ext.MessageBox.hide();
            });
        };

        this.addTarjetaSistema = function () {
            this.loadMessageBox();
            var sm = ventana.getGridTarjFincimex().getSelectionModel();
            var arr = [];
            var selections = sm.getSelections();
            selections.forEach(function (item, i) {
                arr.push({
                    numerotarjeta: item.get('numtarjetafincimex'),
                    fechacaducidad: item.get('fechacaducidadfincimex')
                });
            });

            var parametros = {
                scope: this,
                params: {
                    datos: Ext.encode(arr),
                    idcaja: this.getIdCaja()
                }
            };

            ajaxCalls.crearTarjetaSistema(parametros, function (options, success, response) {
                var result = Ext.decode(response.responseText);
                if (success && result.codMg == 1) {
                    mostrarMensaje(1, 'Se ha creado correctamente la(s) tarjeta(s), modifiquela(s) para corregir los detalles.');
                    ventana.getGridSync().getStore().reload();
                } else if (result.codMg == -1){
                    mostrarMensaje(1, 'El numero de tarjeta que quiere crear ya existe.');
                }
                Ext.MessageBox.hide();
            });
        };

        this.cargarGrids = function () {
            var stSync = ventana.getGridSync().getStore();
            stSync.baseParams.idcaja = this.getIdCaja();
            stSync.load();
            var stTarjSistema = ventana.getGridTarjSistema().getStore();
            stTarjSistema.baseParams.idcaja = this.getIdCaja();
            stTarjSistema.load();
            ventana.getGridTarjFincimex().getStore().load();
        };

        this.gridSyncBtnManage = function (arrRecords) {
            var sePuedenSycn = true;
            var sePuedenAct = true;
            for (var i = 0; i < arrRecords.length; i++) {
                if (arrRecords[i].get('idsync')) {
                    sePuedenSycn = false;
                }
                if (!arrRecords[i].get('idsync') || arrRecords[i].get('fechacaducidadsistema') == arrRecords[i].get('fechacaducidadfincimex')) {
                    sePuedenAct = false;
                }
            }
            if (arrRecords.length > 0) {
                ventana.btnSincronizar.setDisabled(!sePuedenSycn);
                ventana.btnActFechaCad.setDisabled(!sePuedenAct);
            } else {
                ventana.btnSincronizar.disable();
                ventana.btnActFechaCad.disable();
            }
        };

        this.gridTarjFincimexBtnManage = function (arrRecords) {
            if (arrRecords.length > 0) {
                ventana.btnAddTarjetaSistema.enable();
            } else {
                ventana.btnAddTarjetaSistema.disable();
            }
        };

    }
});
