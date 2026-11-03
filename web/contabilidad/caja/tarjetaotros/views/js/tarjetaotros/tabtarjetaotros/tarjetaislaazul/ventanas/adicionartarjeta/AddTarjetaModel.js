Ext.namespace('Ext.AddTarjetaIslaAzul');
Ext.AddTarjetaIslaAzul.Model = Ext.extend(Ext.Component, {
    tipoDuo: undefined,
    constructor: function(params)
    {
        this.initializeModel();
        Ext.AddTarjetaIslaAzul.Model.superclass.constructor.call(this);
    },
    initializeModel: function () {
        this.initializeRecords();
        this.initializeReaders();
        this.initializeStores();
        this.initializeGetFn();
        this.initializeAjaxCalls();
    },
    initializeRecords: function () {

        this.recordMoneda = new Ext.data.Record.create([{
            name: 'nombremoneda'
        }, {
            name: 'codigoiso'
        }, {
            name: 'idmoneda'
        }, {
            name: 'idmonedaentidad'
        }
        ]);

        this.recordPersona = new Ext.data.Record.create([{
            name: 'idpersona'
        }, {
            name: 'nombre'
        }, {
            name: 'numid'
        }, {
            name: 'cargo'
        }
        ]);

        this.recordCuenta = new Ext.data.Record.create([
            {name: 'idcuenta'},
            {name: 'text'},
            {name: 'idmoneda'},
            {name: 'codigoiso'}
        ]);

        this.recordTipo = new Ext.data.Record.create([{
            name: 'idtipo'
        }, {
            name: 'tipo'
        }
        ]);

    },
    initializeReaders: function () {

        this.rdMoneda = new Ext.data.JsonReader({
            root: 'datos'
        }, this.recordMoneda);

        this.rdPersona = new Ext.data.JsonReader({
            root: 'data',
            totalProperty: 'total'
        }, this.recordPersona);

        this.rdCuenta = new Ext.data.JsonReader({
            root: 'datos'
        }, this.recordCuenta);

        this.rdTipo = new Ext.data.JsonReader({
        }, this.recordTipo);

    },
    initializeStores: function () {

        this.stMoneda = new Ext.data.Store({
            url: 'cargarmonedas',
            reader: this.rdMoneda,
            autoLoad: true
        });

        this.stPersona = new Ext.data.Store({
            url: 'cargarpersonas',
            sortInfo: {
                field: 'nombre',
                direction: "ASC"
            },
            reader: this.rdPersona,
        });

        this.stCuenta = new Ext.data.Store({
            url: 'cargarcuentas',
            reader: this.rdCuenta,
        });

        this.stTipo = new Ext.data.Store({
            data:[{idtipo: 1, tipo: 'Garaje'},{idtipo: 2, tipo: 'Isla azul'},{idtipo: 3, tipo: 'Tarjeta mayorista'}],
            reader: this.rdTipo,
        });

    },
    initializeGetFn: function () {

        this.getStoreMoneda = function () {
            return this.stMoneda;
        };

        this.getStorePersona = function () {
            return this.stPersona;
        };

        this.getStoreCuenta = function () {
            return this.stCuenta;
        };

        this.getStoreTipo = function () {
            return this.stTipo;
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