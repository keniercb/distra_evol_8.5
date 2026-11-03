Ext.namespace('Ext.TarjetaIslaAzul');
Ext.TarjetaIslaAzul.Model = Ext.extend(Ext.Component, {
    tipoDuo: undefined,
    constructor: function(params)
    {
        this.initializeModel();
        Ext.TarjetaIslaAzul.Model.superclass.constructor.call(this);
    },
    initializeModel: function () {
        this.initializeRecords();
        this.initializeReaders();
        this.initializeStores();
        this.initializeGetFn();
        this.initializeAjaxCalls();
    },
    initializeRecords: function () {

        this.recordTarjeta = new Ext.data.Record.create([{
                name: 'idtarjeta'
            }, {
                name: 'numero'
            }, {
                name: 'saldomo'
            }, {
                name: 'idpersona'
            }, {
                name: 'nompersona'
            }, {
                name: 'idcuenta'
            }, {
                name: 'nomcuenta'
            }, {
                name: 'idmoneda'
            }, {
                name: 'nommoneda'
            }, {
                name: 'activo'
            }, {
                name: 'tipo'
            }, {
                name: 'fechavence', dateFormat: 'd/m/Y'
        }]);

    },
    initializeReaders: function () {

        this.rdTarjeta = new Ext.data.JsonReader(
            {
                root: 'datos',
                totalProperty: 'total'
            }, this.recordTarjeta);

    },
    initializeStores: function () {

        this.stTarjeta = new Ext.data.Store({
            url: 'cargartarjetas',
            reader: this.rdTarjeta,
            scope: this,
            baseParams: {
                limit: 15,
                filter: ''
            },
            autoLoad: false
        });

        this.stEstado = new Ext.data.SimpleStore({
            fields: ['id', 'estado', 'srcImg'],
            data: [
                [1, 'Activas', '/contabilidad/comun/images/checkgreen.png'],
                [2, 'Inactivas', '/contabilidad/comun/images/cierreno.png'],
                [3, 'Todas', '/contabilidad/comun/images/seleccion.png']
            ]
        });

    },
    initializeGetFn: function () {

        this.getStoreTarjeta = function () {
            return this.stTarjeta;
        };

        this.getStoreEstado = function () {
            return this.stEstado;
        };

    },
    initializeAjaxCalls: function (parametros, parametrosAdicionales) {

        this.cargarEtiquetas = function (parametrosAdicionales, callbackFunction) {
            var parametros = {
                method: "POST",
                url: "cargaretiquetas",
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