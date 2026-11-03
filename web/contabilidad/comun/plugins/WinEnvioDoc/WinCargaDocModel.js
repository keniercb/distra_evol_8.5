Ext.namespace('Ext.WinCargarDoc');
Ext.WinCargarDoc.Model = Ext.extend(Ext.Component, {
    tipo: undefined,
    constructor: function(params)
    {
        this.initializeModel();
        Ext.WinCargarDoc.Model.superclass.constructor.call(this);
    },
    initializeModel: function () {
        this.initializeRecords();
        this.initializeReaders();
        this.initializeStores();
        this.initializeGetFn();
        this.initializeAjaxCalls();
    },
    initializeRecords: function () {

        this.recordGrid = new Ext.data.Record.create([
            {name: 'id', mapping: 'id'},
            {name: 'idpersona', mapping: 'responsable'},
            {name: 'nombrecompleto', mapping: 'nombrecompleto'},
            {name: 'estado', mapping: 'estado'},
            {name: 'idcomprobante', mapping: 'idcomprobante'},
            {name: 'fechacontable', mapping: 'fechacontable'},
            {name: 'fechasistema', mapping: 'fechasistema'},
            {name: 'idoperacion', mapping: 'idoperacion'},
            {name: 'comentario', mapping: 'comentario'},
            {name: 'numcomprobante', mapping: 'numcomprobante'},
            {name: 'showCmp', mapping: 'showCmp'}
        ]);

    },
    initializeReaders: function () {

        this.rdGrid = new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cantidad_filas'
            },
            this.recordGrid
        );

    },
    initializeStores: function () {

        this.stGrid = new Ext.data.Store({
            url: '',
            reader: this.rdGrid,
            autoLoad: false
        });

    },
    initializeGetFn: function () {

        this.getStore = function () {
            return this.stGrid;
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

        this.buscarFechaContable = function (parametrosAdicionales, callbackFunction) {
            var parametros = {
                method: "POST",
                url: "buscarfechacontable",
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