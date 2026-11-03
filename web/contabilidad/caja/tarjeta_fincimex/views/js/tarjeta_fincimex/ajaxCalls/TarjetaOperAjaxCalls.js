Ext.namespace('Ext.GestionarTarjetaOper');
Ext.GestionarTarjetaOper.AjaxCalls = Ext.extend(Ext.Component, {
    constructor: function()
    {
        this.tarjetaOperAjaxCalls();
        Ext.GestionarTarjetaOper.AjaxCalls.superclass.constructor.call(this);
    },
    tarjetaOperAjaxCalls: function () {
        // this.ajaxEjemplo = function (parametrosAdicionales, callbackFunction) {
        //     var parametros = {
        //         method: "POST",
        //         url: "cargaretiquetas",
        //         callback: callbackFunction //options, success, response
        //     };
        //     this.ajaxCall(parametros, parametrosAdicionales);
        // };

        this.cargarEtiquetas = function (parametrosAdicionales, callbackFunction) {
            var parametros = {
                method: "POST",
                url: "cargaretiquetas",
                callback: callbackFunction //options, success, response
            };
            this.ajaxCall(parametros, parametrosAdicionales);
        };

        this.buscarFechaContable = function (parametrosAdicionales, callbackFunction) {
            var parametros = {
                method: "POST",
                url: "buscarfechacontable",
                callback: callbackFunction //options, success, response
            };
            this.ajaxCall(parametros, parametrosAdicionales);
        };

        this.probarConexionBD = function (parametrosAdicionales, callbackFunction) {
            var parametros = {
                method: "POST",
                url: "probarConexionBDFincimex",
                callback: callbackFunction //options, success, response
            };
            this.ajaxCall(parametros, parametrosAdicionales);
        };

        this.guardarDatosBD = function (parametrosAdicionales, callbackFunction) {
            var parametros = {
                method: "POST",
                url: "guardarDatosBDFincimex",
                callback: callbackFunction //options, success, response
            };
            this.ajaxCall(parametros, parametrosAdicionales);
        };

        this.cargarDatosBD = function (parametrosAdicionales, callbackFunction) {
            var parametros = {
                method: "POST",
                url: "cargarDatosBDFincimex",
                callback: callbackFunction //options, success, response
            };
            this.ajaxCall(parametros, parametrosAdicionales);
        };

        this.guardarDatosTarjetaSync = function (parametrosAdicionales, callbackFunction) {
            var parametros = {
                method: "POST",
                url: "guardarDatosTarjetaSync",
                callback: callbackFunction //options, success, response
            };
            this.ajaxCall(parametros, parametrosAdicionales);
        };

        this.actualizarFechaCadTarjetaSistema = function (parametrosAdicionales, callbackFunction) {
            var parametros = {
                method: "POST",
                url: "actualizarFechaCadTarjetaSistema",
                callback: callbackFunction //options, success, response
            };
            this.ajaxCall(parametros, parametrosAdicionales);
        };

        this.crearTarjetaSistema = function (parametrosAdicionales, callbackFunction) {
            var parametros = {
                method: "POST",
                url: "crearTarjetaSistema",
                callback: callbackFunction //options, success, response
            };
            this.ajaxCall(parametros, parametrosAdicionales);
        };

        this.guardarProveedor = function (parametrosAdicionales, callbackFunction) {
            var parametros = {
                method: "POST",
                url: "saveProveedor",
                callback: callbackFunction //options, success, response
            };
            this.ajaxCall(parametros, parametrosAdicionales);
        };
        this.saveRecargaFincimex = function (parametrosAdicionales, callbackFunction) {
            var parametros = {
                method: "POST",
                url: "saveRecargaFincimex",
                callback: callbackFunction //options, success, response
            };
            this.ajaxCall(parametros, parametrosAdicionales);
        };
        this.cargarDatosRecargaFincimexById = function (parametrosAdicionales, callbackFunction) {
            var parametros = {
                method: "POST",
                url: "cargarDatosRecargaFincimexById",
                callback: callbackFunction //options, success, response
            };
            this.ajaxCall(parametros, parametrosAdicionales);
        };
        this.cancelarRecargaFincimex = function (parametrosAdicionales, callbackFunction) {
            var parametros = {
                method: "POST",
                url: "cancelarRecargaFincimex",
                callback: callbackFunction //options, success, response
            };
            this.ajaxCall(parametros, parametrosAdicionales);
        };
        this.confirmarRecargaFincimex = function (parametrosAdicionales, callbackFunction) {
            var parametros = {
                method: "POST",
                url: "confirmarRecargaFincimex",
                callback: callbackFunction //options, success, response
            };
            this.ajaxCall(parametros, parametrosAdicionales);
        };
        //anticipo
        this.saveAnticiposFincimex = function (parametrosAdicionales, callbackFunction) {
            var parametros = {
                method: "POST",
                url: "saveAnticiposFincimex",
                callback: callbackFunction //options, success, response
            };
            this.ajaxCall(parametros, parametrosAdicionales);
        };
        this.confirmarAnticipoFincimex = function (parametrosAdicionales, callbackFunction) {
            var parametros = {
                method: "POST",
                url: "confirmarAnticipoFincimex",
                callback: callbackFunction //options, success, response
            };
            this.ajaxCall(parametros, parametrosAdicionales);
        };
        this.cancelarAnticipoFincimex = function (parametrosAdicionales, callbackFunction) {
            var parametros = {
                method: "POST",
                url: "cancelarAnticipoFincimex",
                callback: callbackFunction //options, success, response
            };
            this.ajaxCall(parametros, parametrosAdicionales);
        };
        this.cargarDatosAnticiposFincimexById = function (parametrosAdicionales, callbackFunction) {
            var parametros = {
                method: "POST",
                url: "cargarDatosAnticiposFincimexById",
                callback: callbackFunction //options, success, response
            };
            this.ajaxCall(parametros, parametrosAdicionales);
        };
        this.saveLiquidacionesFincimex = function (parametrosAdicionales, callbackFunction) {
            var parametros = {
                method: "POST",
                url: "saveLiquidacionesFincimex",
                callback: callbackFunction //options, success, response
            };
            this.ajaxCall(parametros, parametrosAdicionales);
        };
    },
    ajaxCall: function (parametros, parametrosAdicionales) {
        if (typeof parametrosAdicionales === 'object') {
            Ext.applyIf(parametros, parametrosAdicionales);
        }
        Ext.Ajax.request(parametros);
    }
});
