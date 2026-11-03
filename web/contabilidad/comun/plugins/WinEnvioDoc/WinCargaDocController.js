Ext.namespace('Ext.WinCargarDoc');
Ext.WinCargarDoc.Controller = Ext.extend(Ext.Component, {
    url: undefined,
    etiquetas: undefined,
    model: undefined,
    view: undefined,
    destino: undefined,
    constructor: function(params)
    {
        this.crearSetsAndGets();
        this.initializeFunctions();
        this.setPerfil(window.parent.perfil);

        // requireJS.loadJsArray([
        //     {
        //         url: "/contabilidad/cobros_pagos/cargainicial/views/js/componentes/CmpAction/cmpaction",
        //         id: 'cmpaction',
        //         async: false
        //     },
        //     {
        //         url: params.url + '',
        //         id: '',
        //     },
        // ], function () {
        //     this.loadDataComponent();
        // }.bind(this));

        this.loadDataComponent();

        Ext.WinCargarDoc.Controller.superclass.constructor.call(this);
    },
    loadDataComponent: function()
    {
        var model = this.crearModel();
        // model.cargarEtiquetas(undefined, function (options, success, response) {
        //     var etiquetas = Ext.decode(response.responseText);
        //     if (!etiquetas.codMsg && success) {
        //         this.setEtiquetas(etiquetas);
        //         this.initializeClass();
        //     }
        // }.bind(this));
        this.initializeClass();
    },
    initializeClass: function () {
        this.crearView();
        this.initializeEvents();
        this.initializeFunctions();
        // this.initializeKeyMap();
    },
    initializeEvents: function() {

    },
    initializeFunctions: function() {
        var model = this.getModel();
        var view = this.getView(model);

        this.show = function () {
            view.show();
        }

        this.funcionesGenerales = function () {
            this.loadMessageBox = function (msg = 'Cargando...', title = 'Por favor espere...') {
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
            };

            this.hideMessageBox = function () {
                Ext.MessageBox.hide();
            };

            this.crearModel = function () {
                this.setModel(new Ext.WinCargarDoc.Model());
                return this.getModel();
            };

            this.crearView = function () {
                var params = {
                    etiquetas: this.getEtiquetas()
                };
                this.setView(new Ext.WinCargarDoc.View(this.getModel(), params));
            };

        };

        this.funcionesComponente = function () {
            this.estadoCreado = function () {

            };
        };

        this.funcionesGenerales.call(this);
        this.funcionesComponente.call(this);
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

        this.setPerfil = function (perfil) {
            this.perfil = perfil;
        };

        this.getPerfil = function () {
            return this.perfil;
        };

        this.setModel = function (model) {
            this.model = model;
        };

        this.getModel = function () {
            return this.model;
        };

        this.setView = function (view) {
            this.view = view;
        };

        this.getView = function () {
            return this.view;
        };

    },
    initializeKeyMap: function () {
        this.map = new Ext.KeyMap(document);
        this.map.accessKey = function (key, handler, scope) {
            var h = function (n, e) {
                e.preventDefault();
                handler.call(scope || this, n, e);
            };
            this.on(key, h, scope);
        };

        //ADICIONAR
        this.map.accessKey({
            key: 'i',
            alt: true
        }, function () {
//            if ()
//                scope.btn.handler.call();
        }, Ext.getBody());

        //MODIFICAR
        this.map.accessKey({
            key: 'm',
            alt: true
        }, function () {

        }, Ext.getBody());

        //ELIMINAR
        this.map.accessKey({
            key: Ext.EventObject.DELETE
        }, function () {

        }, Ext.getBody());

        //CANCELAR
        this.map.accessKey({
            key: 'x',
            alt: true
        }, function () {

        }, Ext.getBody());

        //CANCELAR LIQUIDACION
        this.map.accessKey({
            key: 'x',
            ctrl: true
        }, function () {

        }, Ext.getBody());

        //CONFIRMAR
        this.map.accessKey({
            key: 'f',
            alt: true
        }, function () {

        }, Ext.getBody());

        //CONTABILIZAR
        this.map.accessKey({
            key: 't',
            alt: true
        }, function () {

        }, Ext.getBody());

        //LIQUIDAR
        this.map.accessKey({
            key: 'l',
            alt: true
        }, function () {

        }, Ext.getBody());

        //VER
        this.map.accessKey({
            key: 'v',
            alt: true
        }, function () {

        }, Ext.getBody());

        //GRAFICAR
        this.map.accessKey({
            key: 'g',
            alt: true
        }, function () {

        }, Ext.getBody());

        //BUSCAR
        this.map.accessKey({
            key: 'b',
            alt: true
        }, function () {

        }, Ext.getBody());

        //AYUDA
        this.map.accessKey({
            key: 'h',
            alt: true
        }, function () {

        }, Ext.getBody());

        //TAB
        this.map.accessKey({
            key: Ext.EventObject.TAB
        }, function () {
//            if (document.activeElement.tabIndex == 14)
//                scope.objWindowsDuo.cbAddTipoDoc.focus(true, 10);
//            else if (document.activeElement.tabIndex == 108)
//                scope.objWindowsDuo.cbBuscarTipoDoc.focus(true, 10);
//            else if (document.activeElement.tabIndex == 1)
//                scope.objWindowsDuo.btnAddConfirmar.focus();
//            else if (document.activeElement.tabIndex == 100)
//                scope.objWindowsDuo.btnBuscarAceptar.focus();
        }, Ext.getBody());
    }
});
